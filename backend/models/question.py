from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class Question(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question_text: str
    category: str
    date: str

class QuestionResponse(BaseModel):
    id: str
    question_text: str
    category: str
    date: str

class AnswerCreate(BaseModel):
    question_id: str
    answer_text: str

class Answer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question_id: str
    user_id: str
    username: str
    role: str
    answer_text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AnswerResponse(BaseModel):
    id: str
    question_id: str
    user_id: str
    username: str
    role: str
    answer_text: str
    created_at: datetime
