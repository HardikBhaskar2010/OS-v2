from fastapi import APIRouter, HTTPException, status, Depends
from models.mood import MoodCreate, Mood, MoodResponse
from middleware.auth_middleware import get_current_user
from typing import List

router = APIRouter(prefix="/moods", tags=["Moods"])

async def get_db():
    from server import db
    return db

@router.get("", response_model=List[MoodResponse])
async def get_moods(current_user: dict = Depends(get_current_user)):
    """Get mood history for the couple"""
    db = await get_db()
    
    # Get moods from both partners
    moods = await db.moods.find({
        "$or": [
            {"user_id": current_user["id"]},
            {"user_id": current_user.get("partner_id", "")}
        ]
    }).sort("created_at", -1).to_list(1000)
    
    return [MoodResponse(**mood) for mood in moods]

@router.get("/latest", response_model=List[MoodResponse])
async def get_latest_moods(current_user: dict = Depends(get_current_user)):
    """Get the latest mood from each partner"""
    db = await get_db()
    
    moods = []
    
    # Get current user's latest mood
    user_mood = await db.moods.find_one(
        {"user_id": current_user["id"]},
        sort=[("created_at", -1)]
    )
    if user_mood:
        moods.append(MoodResponse(**user_mood))
    
    # Get partner's latest mood
    if current_user.get("partner_id"):
        partner_mood = await db.moods.find_one(
            {"user_id": current_user["partner_id"]},
            sort=[("created_at", -1)]
        )
        if partner_mood:
            moods.append(MoodResponse(**partner_mood))
    
    return moods

@router.post("", response_model=MoodResponse)
async def share_mood(
    mood_data: MoodCreate,
    current_user: dict = Depends(get_current_user)
):
    """Share current mood"""
    db = await get_db()
    
    mood = Mood(
        user_id=current_user["id"],
        username=current_user["username"],
        role=current_user["role"],
        mood=mood_data.mood,
        emoji=mood_data.emoji,
        note=mood_data.note
    )
    
    await db.moods.insert_one(mood.dict())
    
    return MoodResponse(**mood.dict())