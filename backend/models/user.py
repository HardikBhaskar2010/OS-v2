from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

# Request Models
class UserRegister(BaseModel):
    username: str
    password: str
    role: str  # 'boyfriend' or 'girlfriend'
    display_name: str
    anniversary_date: Optional[str] = None
    relationship_start: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class LinkPartner(BaseModel):
    partner_username: str

# Response Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password_hash: str
    role: str
    display_name: str
    partner_id: Optional[str] = None
    anniversary_date: Optional[str] = None
    relationship_start: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserResponse(BaseModel):
    id: str
    username: str
    role: str
    display_name: str
    partner_id: Optional[str] = None
    anniversary_date: Optional[str] = None
    relationship_start: Optional[str] = None
    created_at: datetime

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
