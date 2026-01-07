from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class MoodCreate(BaseModel):
    mood: str
    emoji: str
    note: str

class Mood(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    username: str
    role: str
    mood: str
    emoji: str
    note: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MoodResponse(BaseModel):
    id: str
    user_id: str
    username: str
    role: str
    mood: str
    emoji: str
    note: str
    created_at: datetime
