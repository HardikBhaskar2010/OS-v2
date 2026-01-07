from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class LetterCreate(BaseModel):
    title: str
    content: str
    to_user_id: str

class Letter(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    from_user_id: str
    from_name: str
    to_user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LetterResponse(BaseModel):
    id: str
    title: str
    content: str
    from_user_id: str
    from_name: str
    to_user_id: str
    created_at: datetime
