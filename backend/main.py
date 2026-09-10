"""
FastAPI Backend for AI Meeting Intelligence & Automation Platform.
Phases 0-4: REST API, SQLite persistence, and Structured AI Extraction.
"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import init_db, save_meeting, get_all_meetings, get_meeting_by_id, update_transcript, update_outcome
from models import MeetingCreate, MeetingResponse, HealthResponse, TranscriptPayload, ProcessMeetingPayload, MeetingOutcomeModel
from ai_service import process_transcript, is_ollama_available

@asynccontextmanager
async def lifespan(app: FastAPI):
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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint used by the extension to monitor connectivity and local Ollama status."""
    return {
        "status": "ok",
        "service": "meeting-intelligence-api",
        "version": "1.0.0",
        "ollama_online": is_ollama_available(),
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
        "transcript": payload.transcript,
        "outcome": payload.outcome.model_dump() if payload.outcome else None,
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

@app.post("/api/meetings/{meeting_id}/transcript")
async def save_transcript(meeting_id: str, payload: TranscriptPayload):
    """Save or append transcript for a specific meeting."""
    meeting = get_meeting_by_id(meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    success = update_transcript(meeting_id, payload.transcript)
    return {"success": success, "meeting_id": meeting_id}

@app.post("/api/meetings/{meeting_id}/process", response_model=MeetingOutcomeModel)
async def process_meeting_intelligence(meeting_id: str, payload: Optional[ProcessMeetingPayload] = None):
    """
    Generate structured meeting intelligence from transcript:
    Executive summary, detailed discussion points, highlighted decisions, and structured action items.
    """
    meeting = get_meeting_by_id(meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    transcript_text = payload.transcript if (payload and payload.transcript) else meeting.get("transcript")
    if not transcript_text:
        raise HTTPException(status_code=400, detail="No transcript available to process. Please provide transcript text.")

    # Save transcript if newly provided in body
    if payload and payload.transcript:
        update_transcript(meeting_id, payload.transcript)

    # Process via AI Service
    outcome = process_transcript(transcript_text, meeting.get("title", "Meeting"))

    # Save outcome to SQLite
    update_outcome(meeting_id, outcome)

    return outcome

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
