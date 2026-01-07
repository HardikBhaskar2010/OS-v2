from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.notification import Notification
from typing import List

async def generate_anniversary_notifications(db: AsyncIOMotorDatabase):
    """Generate notifications for upcoming anniversaries"""
    
    # Get all users with anniversary dates
    users = await db.users.find({"anniversary_date": {"$exists": True, "$ne": None}}).to_list(1000)
    
    today = datetime.now().date()
    
    for user in users:
        if not user.get("anniversary_date"):
            continue
        
        try:
            # Parse anniversary date (assuming format: "2024-05-14")
            anniversary = datetime.strptime(user["anniversary_date"], "%Y-%m-%d").date()
            
            # Get this year's anniversary
            this_year_anniversary = anniversary.replace(year=today.year)
            
            # If this year's anniversary has passed, check next year
            if this_year_anniversary < today:
                this_year_anniversary = anniversary.replace(year=today.year + 1)
            
            days_until = (this_year_anniversary - today).days
            
            # Create notifications for 7 days before, 1 day before, and on the day
            notifications_to_create = []
            
            if days_until == 7:
                notifications_to_create.append({
                    "type": "anniversary",
                    "message": f"Your anniversary is coming up in 7 days! 💕",
                    "date": user["anniversary_date"]
                })
            elif days_until == 1:
                notifications_to_create.append({
                    "type": "anniversary",
                    "message": f"Tomorrow is your special day! Don't forget to celebrate 🎉",
                    "date": user["anniversary_date"]
                })
            elif days_until == 0:
                notifications_to_create.append({
                    "type": "anniversary",
                    "message": f"Happy Anniversary! 💕🎊 Wishing you both a wonderful day!",
                    "date": user["anniversary_date"]
                })
            
            # Insert notifications
            for notif_data in notifications_to_create:
                # Check if notification already exists
                existing = await db.notifications.find_one({
                    "user_id": user["id"],
                    "type": notif_data["type"],
                    "date": notif_data["date"],
                    "message": notif_data["message"]
                })
                
                if not existing:
                    notification = Notification(
                        user_id=user["id"],
                        type=notif_data["type"],
                        message=notif_data["message"],
                        date=notif_data["date"]
                    )
                    await db.notifications.insert_one(notification.dict())
        
        except Exception as e:
            print(f"Error processing anniversary for user {user['id']}: {e}")
            continue

async def get_user_notifications(db: AsyncIOMotorDatabase, user_id: str) -> List[dict]:
    """Get all notifications for a user"""
    
    notifications = await db.notifications.find(
        {"user_id": user_id}
    ).sort("created_at", -1).to_list(100)
    
    return notifications
