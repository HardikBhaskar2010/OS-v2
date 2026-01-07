from fastapi import APIRouter, HTTPException, status, Depends
from models.letter import LetterCreate, Letter, LetterResponse
from middleware.auth_middleware import get_current_user
from typing import List

router = APIRouter(prefix="/letters", tags=["Letters"])

async def get_db():
    from server import db
    return db

@router.get("", response_model=List[LetterResponse])
async def get_letters(current_user: dict = Depends(get_current_user)):
    """Get all letters for the couple"""
    db = await get_db()
    
    # Get letters where user is either sender or receiver
    letters = await db.letters.find({
        "$or": [
            {"from_user_id": current_user["id"]},
            {"to_user_id": current_user["id"]},
            {"from_user_id": current_user.get("partner_id", "")},
            {"to_user_id": current_user.get("partner_id", "")}
        ]
    }).sort("created_at", -1).to_list(1000)
    
    return [LetterResponse(**letter) for letter in letters]

@router.post("", response_model=LetterResponse)
async def create_letter(
    letter_data: LetterCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new love letter"""
    db = await get_db()
    
    letter = Letter(
        title=letter_data.title,
        content=letter_data.content,
        from_user_id=current_user["id"],
        from_name=current_user["display_name"],
        to_user_id=letter_data.to_user_id
    )
    
    await db.letters.insert_one(letter.dict())
    
    return LetterResponse(**letter.dict())

@router.delete("/{letter_id}")
async def delete_letter(
    letter_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a letter (only the sender can delete)"""
    db = await get_db()
    
    # Find the letter
    letter = await db.letters.find_one({"id": letter_id})
    if not letter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Letter not found"
        )
    
    # Check if current user is the sender
    if letter["from_user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own letters"
        )
    
    await db.letters.delete_one({"id": letter_id})
    
    return {"message": "Letter deleted successfully"}