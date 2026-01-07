from fastapi import APIRouter, HTTPException, status, Depends
from models.notification import NotificationResponse
from middleware.auth_middleware import get_current_user
from services.notification_service import generate_anniversary_notifications, get_user_notifications
from typing import List

router = APIRouter(prefix="/notifications", tags=["Notifications"])

async def get_db():
    from server import db
    return db

@router.get("", response_model=List[NotificationResponse])
async def get_notifications(current_user: dict = Depends(get_current_user)):
    """Get all notifications for current user"""
    db = await get_db()
    
    # Generate new notifications if needed
    await generate_anniversary_notifications(db)
    
    # Get user's notifications
    notifications = await get_user_notifications(db, current_user["id"])
    
    return [NotificationResponse(**notif) for notif in notifications]

@router.put("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Mark a notification as read"""
    db = await get_db()
    
    # Find notification
    notification = await db.notifications.find_one({"id": notification_id})
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    # Check if it belongs to current user
    if notification["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This notification doesn't belong to you"
        )
    
    # Mark as read
    await db.notifications.update_one(
        {"id": notification_id},
        {"$set": {"read": True}}
    )
    
    return {"message": "Notification marked as read"}

@router.get("/unread/count")
async def get_unread_count(current_user: dict = Depends(get_current_user)):
    """Get count of unread notifications"""
    db = await get_db()
    
    count = await db.notifications.count_documents({
        "user_id": current_user["id"],
        "read": False
    })
    
    return {"unread_count": count}