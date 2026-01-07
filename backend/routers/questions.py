from fastapi import APIRouter, HTTPException, status, Depends
from models.question import Question, QuestionResponse, AnswerCreate, Answer, AnswerResponse
from middleware.auth_middleware import get_current_user
from typing import List
from datetime import datetime, date
import random

router = APIRouter(prefix="/questions", tags=["Questions"])

async def get_db():
    from server import db
    return db

# Predefined questions pool
QUESTIONS_POOL = [
    {"text": "What's your favorite memory of us together?", "category": "memories"},
    {"text": "What makes you smile when you think of me?", "category": "feelings"},
    {"text": "If we could travel anywhere together, where would it be?", "category": "dreams"},
    {"text": "What's one thing you appreciate about our relationship?", "category": "appreciation"},
    {"text": "What song reminds you of us?", "category": "music"},
    {"text": "What's your favorite thing we do together?", "category": "activities"},
    {"text": "How do you feel loved by me?", "category": "love_language"},
    {"text": "What's something new you'd like us to try together?", "category": "adventure"},
    {"text": "What was your first impression of me?", "category": "memories"},
    {"text": "What's your favorite physical feature of mine?", "category": "attraction"},
    {"text": "What do you think makes our relationship special?", "category": "relationship"},
    {"text": "What's a goal you have for us as a couple?", "category": "future"},
    {"text": "What's the sweetest thing I've ever done for you?", "category": "appreciation"},
    {"text": "What's your favorite way to spend time together?", "category": "quality_time"},
    {"text": "What's one thing you want me to know but haven't told me?", "category": "communication"},
]

@router.get("/daily", response_model=QuestionResponse)
async def get_daily_question(current_user: dict = Depends(get_current_user)):
    """Get today's daily question"""
    db = await get_db()
    
    today = date.today().isoformat()
    
    # Check if there's already a question for today
    existing_question = await db.questions.find_one({"date": today})
    
    if existing_question:
        return QuestionResponse(**existing_question)
    
    # Create a new question for today
    # Use date as seed for consistent daily question
    random.seed(today)
    question_data = random.choice(QUESTIONS_POOL)
    
    question = Question(
        question_text=question_data["text"],
        category=question_data["category"],
        date=today
    )
    
    await db.questions.insert_one(question.dict())
    
    return QuestionResponse(**question.dict())

@router.post("/answers", response_model=AnswerResponse)
async def submit_answer(
    answer_data: AnswerCreate,
    current_user: dict = Depends(get_current_user)
):
    """Submit an answer to a question"""
    db = await get_db()
    
    # Check if user already answered this question
    existing_answer = await db.answers.find_one({
        "question_id": answer_data.question_id,
        "user_id": current_user["id"]
    })
    
    if existing_answer:
        # Update existing answer
        await db.answers.update_one(
            {"id": existing_answer["id"]},
            {"$set": {"answer_text": answer_data.answer_text}}
        )
        existing_answer["answer_text"] = answer_data.answer_text
        return AnswerResponse(**existing_answer)
    
    # Create new answer
    answer = Answer(
        question_id=answer_data.question_id,
        user_id=current_user["id"],
        username=current_user["username"],
        role=current_user["role"],
        answer_text=answer_data.answer_text
    )
    
    await db.answers.insert_one(answer.dict())
    
    return AnswerResponse(**answer.dict())

@router.get("/answers/{question_id}", response_model=List[AnswerResponse])
async def get_answers(
    question_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get answers for a specific question from both partners"""
    db = await get_db()
    
    answers = await db.answers.find({
        "question_id": question_id,
        "$or": [
            {"user_id": current_user["id"]},
            {"user_id": current_user.get("partner_id", "")}
        ]
    }).to_list(10)
    
    return [AnswerResponse(**answer) for answer in answers]