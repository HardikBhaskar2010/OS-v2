from fastapi import APIRouter, HTTPException, status, Depends
from models.user import UserRegister, UserLogin, User, UserResponse, LoginResponse, LinkPartner
from auth.password_utils import hash_password, verify_password
from auth.jwt_handler import create_access_token
from middleware.auth_middleware import get_current_user
import os

router = APIRouter(prefix="/auth", tags=["Authentication"])

async def get_db():
    from server import db
    return db

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserRegister):
    """Register a new user"""
    db = await get_db()
    
    # Check if username already exists
    existing_user = await db.users.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Validate role
    if user_data.role not in ["boyfriend", "girlfriend"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be either 'boyfriend' or 'girlfriend'"
        )
    
    # Create user
    user = User(
        username=user_data.username,
        password_hash=hash_password(user_data.password),
        role=user_data.role,
        display_name=user_data.display_name,
        anniversary_date=user_data.anniversary_date,
        relationship_start=user_data.relationship_start
    )
    
    # Save to database
    await db.users.insert_one(user.dict())
    
    return UserResponse(**user.dict())

@router.post("/login", response_model=LoginResponse)
async def login(credentials: UserLogin):
    """Login user and return JWT token"""
    db = await get_db()
    
    # Find user
    user_doc = await db.users.find_one({"username": credentials.username})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user_doc["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # Create access token
    token_data = {
        "sub": user_doc["id"],
        "username": user_doc["username"],
        "role": user_doc["role"],
        "display_name": user_doc["display_name"],
        "partner_id": user_doc.get("partner_id")
    }
    access_token = create_access_token(data=token_data)
    
    user_response = UserResponse(**user_doc)
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    db = await get_db()
    
    user_doc = await db.users.find_one({"id": current_user["id"]})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(**user_doc)

@router.post("/link-partner")
async def link_partner(
    partner_data: LinkPartner,
    current_user: dict = Depends(get_current_user)
):
    """Link current user with their partner"""
    db = await get_db()
    
    # Find partner by username
    partner_doc = await db.users.find_one({"username": partner_data.partner_username})
    if not partner_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Partner not found"
        )
    
    # Make sure they have different roles
    if partner_doc["role"] == current_user["role"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Partner must have a different role (one boyfriend, one girlfriend)"
        )
    
    # Update both users
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$set": {"partner_id": partner_doc["id"]}}
    )
    
    await db.users.update_one(
        {"id": partner_doc["id"]},
        {"$set": {"partner_id": current_user["id"]}}
    )
    
    return {"message": "Successfully linked with partner", "partner_name": partner_doc["display_name"]}
