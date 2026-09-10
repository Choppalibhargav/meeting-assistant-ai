"""
FastAPI Backend for AI Meeting Intelligence & Automation Platform.
Phase 0 Deliverable: REST API + SQLite persistence for Browser Extension.
"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import init_db, save_meeting, get_all_meetings, get_meeting_by_id
from models import MeetingCreate, MeetingResponse, HealthResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database on startup
    init_db()
    yield


app = FastAPI(
    title="AI Meeting Intelligence API",
    description="Backend API powering the Meeting Intelligence Browser Extension and Core Automation",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for browser extension and local frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins including chrome-extension://
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint used by the extension to monitor connectivity."""
    return {
        "status": "ok",
        "service": "meeting-intelligence-api",
        "version": "1.0.0",
    }


@app.post("/api/meetings", response_model=MeetingResponse)
async def create_or_update_meeting(payload: MeetingCreate):
    """Save or update a meeting session from the browser extension."""
    meeting_dict = {
        "id": payload.id,
        "title": payload.title,
        "url": payload.url,
        "platform": payload.platform,
        "start_time": payload.start_time.isoformat() if payload.start_time else None,
        "end_time": payload.end_time.isoformat() if payload.end_time else None,
        "duration": payload.duration,
        "status": payload.status,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    saved = save_meeting(meeting_dict)
    return saved


@app.get("/api/meetings", response_model=List[MeetingResponse])
async def list_meetings():
    """List all saved meetings stored in SQLite."""
    return get_all_meetings()


@app.get("/api/meetings/{meeting_id}", response_model=MeetingResponse)
async def get_meeting(meeting_id: str):
    """Retrieve details for a specific meeting."""
    meeting = get_meeting_by_id(meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

