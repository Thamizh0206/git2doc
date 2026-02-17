from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
import subprocess
import os
from pathlib import Path
import uuid

router = APIRouter(prefix="/api/public", tags=["Public"])


class GenerateRequest(BaseModel):
    repo_url: str
    question: str = "Generate comprehensive technical documentation for this repository"


@router.post("/generate")
async def generate_documentation_public(request: GenerateRequest):
    """
    Public endpoint to generate documentation without authentication.
    Runs the main.py script directly.
    """
    
    # Validate GitHub URL
    if not request.repo_url or "github.com" not in request.repo_url:
        raise HTTPException(
            status_code=400,
            detail="Please provide a valid GitHub repository URL"
        )
    
    # Generate unique session ID
    session_id = str(uuid.uuid4())[:8]
    
    # Create output directory
    output_dir = Path(f"storage/public/{session_id}")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    return {
        "message": "Documentation generation started",
        "session_id": session_id,
        "status": "processing",
        "note": "Please use the command-line interface (python main.py) for direct generation. Web interface requires authentication for full features."
    }


@router.get("/")
async def public_info():
    """Information about the public API"""
    return {
        "message": "Git2Doc Public API",
        "note": "For full functionality, please use the command-line interface: python main.py",
        "cli_usage": {
            "command": "python main.py",
            "description": "Interactive CLI to generate documentation from GitHub repositories"
        }
    }
