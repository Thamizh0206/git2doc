from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
from pathlib import Path
from api.database import get_db, Document, User, SessionLocal
from api.models import DocumentCreate, DocumentResponse
from api.middleware.auth_middleware import get_current_user
from api.services.doc_generator import generate_documentation_task
import re

router = APIRouter(prefix="/api/documents", tags=["Documents"])


def parse_github_url(url: str) -> str:
    """Extract owner/repo from GitHub URL"""
    url = url.replace('https://', '').replace('http://', '')
    url = url.replace('github.com/', '')
    url = url.replace('.git', '')
    parts = url.strip('/').split('/')
    if len(parts) >= 2:
        return f"{parts[0]}/{parts[1]}"
    raise ValueError(f"Invalid GitHub URL format: {url}")


@router.post("/generate", response_model=DocumentResponse, status_code=status.HTTP_202_ACCEPTED)
async def generate_document(
    doc_data: DocumentCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate documentation from GitHub repository
    Returns immediately with document ID and status='processing'
    Actual generation happens in background
    """
    
    # Parse GitHub URL
    try:
        github_repo = parse_github_url(doc_data.repo_url)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    # Create document record with processing status
    new_doc = Document(
        user_id=current_user.id,
        name="Processing...",
        repo_url=doc_data.repo_url,
        github_repo=github_repo,
        status="processing",
        prompt=doc_data.prompt
    )
    
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    
    # Add background task for documentation generation
    background_tasks.add_task(
        generate_documentation_task,
        doc_id=new_doc.id,
        repo_url=doc_data.repo_url,
        prompt=doc_data.prompt or "",
        db_session_maker=SessionLocal
    )
    
    return new_doc


@router.get("", response_model=List[DocumentResponse])
async def get_user_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all documents for the current user"""
    documents = db.query(Document).filter(
        Document.user_id == current_user.id
    ).order_by(Document.created_at.desc()).all()
    
    return documents


@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific document"""
    document = db.query(Document).filter(
        Document.id == doc_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return document


@router.get("/{doc_id}/status")
async def get_document_status(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check the status of a document generation"""
    document = db.query(Document).filter(
        Document.id == doc_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    message = None
    if document.status == "failed":
        error_path = Path(__file__).resolve().parents[2] / "storage" / "documents" / str(doc_id) / "generation_error.txt"
        try:
            message = error_path.read_text(encoding="utf-8").strip()
        except OSError:
            message = "Generation failed. Check the backend logs for details."

    return {
        "id": document.id,
        "status": document.status,
        "progress": 100 if document.status == "completed" else (50 if document.status == "processing" else 0),
        "message": message,
    }


@router.get("/{doc_id}/download")
async def download_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Download the generated PDF"""
    document = db.query(Document).filter(
        Document.id == doc_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    if document.status != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document is not ready yet"
        )
    
    if not document.file_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    file_path = Path(document.file_path)
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found on server"
        )
    
    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=document.name
    )


@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a document"""
    document = db.query(Document).filter(
        Document.id == doc_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Delete files from storage
    if document.file_path:
        doc_dir = Path(f"storage/documents/{doc_id}")
        if doc_dir.exists():
            import shutil
            shutil.rmtree(doc_dir)
    
    # Delete database record
    db.delete(document)
    db.commit()
    
    return None
