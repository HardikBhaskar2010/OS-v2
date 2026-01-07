from fastapi import APIRouter, HTTPException, status, Depends
from models.photo import PhotoCreate, Photo, PhotoResponse
from middleware.auth_middleware import get_current_user
from typing import List

router = APIRouter(prefix="/photos", tags=["Photos"])

async def get_db():
    from server import db
    return db

@router.get("", response_model=List[PhotoResponse])
async def get_photos(current_user: dict = Depends(get_current_user)):
    """Get all photos for the couple"""
    db = await get_db()
    
    # Get photos uploaded by either partner
    photos = await db.photos.find({
        "$or": [
            {"uploaded_by": current_user["id"]},
            {"uploaded_by": current_user.get("partner_id", "")}
        ]
    }).sort("created_at", -1).to_list(1000)
    
    return [PhotoResponse(**photo) for photo in photos]

@router.post("", response_model=PhotoResponse)
async def upload_photo(
    photo_data: PhotoCreate,
    current_user: dict = Depends(get_current_user)
):
    """Upload a new photo"""
    db = await get_db()
    
    photo = Photo(
        image_base64=photo_data.image_base64,
        caption=photo_data.caption,
        date=photo_data.date,
        uploaded_by=current_user["id"],
        uploader_name=current_user["display_name"]
    )
    
    await db.photos.insert_one(photo.dict())
    
    return PhotoResponse(**photo.dict())

@router.delete("/{photo_id}")
async def delete_photo(
    photo_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a photo"""
    db = await get_db()
    
    # Find the photo
    photo = await db.photos.find_one({"id": photo_id})
    if not photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found"
        )
    
    # Check if current user uploaded it or is the partner
    if photo["uploaded_by"] not in [current_user["id"], current_user.get("partner_id", "")]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete photos from your relationship"
        )
    
    await db.photos.delete_one({"id": photo_id})
    
    return {"message": "Photo deleted successfully"}