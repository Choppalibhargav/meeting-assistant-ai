"""
Pydantic data models for Meeting Intelligence API.
"""

from typing import Optional, Literal, List
from pydantic import BaseModel, Field
from datetime import datetime

MeetingPlatformType = Literal["Google Meet", "Microsoft Teams", "Zoom", "Custom"]
MeetingStatusType = Literal["idle", "detected", "active", "ended"]
PriorityType = Literal["High", "Medium", "Low"]

class ActionItemModel(BaseModel):
    id: str
    task: str
    owner: str = "Unassigned"
    deadline: str = "Next Meeting"
    priority: PriorityType = "Medium"
    status: str = "Pending"

class MeetingOutcomeModel(BaseModel):
    executiveSummary: str
    detailedDiscussion: List[str] = []
    decisions: List[str] = []
    actionItems: List[ActionItemModel] = []
    risks: List[str] = []
    openQuestions: List[str] = []
    parkingLot: List[str] = []
    processedAt: str
    modelUsed: str

class MeetingBase(BaseModel):
    title: str = Field(..., description="Title of the meeting")
    url: Optional[str] = Field(None, description="URL of the meeting tab")
    platform: MeetingPlatformType = Field(default="Custom", description="Detected or selected platform")
    start_time: Optional[datetime] = Field(None, description="Session start timestamp")
    end_time: Optional[datetime] = Field(None, description="Session end timestamp")
    duration: int = Field(default=0, description="Meeting duration in seconds")
    status: MeetingStatusType = Field(default="ended", description="Final meeting status")

class MeetingCreate(MeetingBase):
    id: str = Field(..., description="Unique UUID for the meeting")
    transcript: Optional[str] = None
    outcome: Optional[MeetingOutcomeModel] = None

class MeetingResponse(MeetingBase):
    id: str
    created_at: str
    transcript: Optional[str] = None
    outcome: Optional[MeetingOutcomeModel] = None

class TranscriptPayload(BaseModel):
    transcript: str

class ProcessMeetingPayload(BaseModel):
    transcript: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    ollama_online: bool = False
