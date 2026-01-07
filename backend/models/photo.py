from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class PhotoCreate(BaseModel):
    image_base64: str
    caption: str
    date: str

class Photo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image_base64: str
    caption: str
    date: str
    uploaded_by: str
    uploader_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PhotoResponse(BaseModel):
    id: str
    image_base64: str
    caption: str
    date: str
    uploaded_by: str
    uploader_name: str
    created_at: datetime
