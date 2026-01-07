from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class Notification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str  # 'anniversary', 'special_date', 'reminder'
    message: str
    date: str
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    type: str
    message: str
    date: str
    read: bool
    created_at: datetime
