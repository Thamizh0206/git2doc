from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from api.database import init_db
from api.routers import auth, articles, documents

# Initialize FastAPI app
app = FastAPI(
    title="Git2Doc API",
    description="API for generating professional documentation from GitHub repositories",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:8080",  # Vite dev server (alternative port)
        "http://localhost:3000",  # Alternative port
        "https://git2-doc-997m.vercel.app",  # Vercel production frontend
        "https://*.hf.space",     # Hugging Face Spaces
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for PDF downloads
storage_path = Path("storage/documents")
if storage_path.exists():
    app.mount("/storage", StaticFiles(directory="storage"), name="storage")

# Include routers
app.include_router(auth.router)
app.include_router(articles.router)
app.include_router(documents.router)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print("[STARTED] Git2Doc API started successfully!")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Git2Doc API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
