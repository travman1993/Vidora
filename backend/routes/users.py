from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

# Create router
router = APIRouter()

# Mock user database - replace with real database in production
fake_users_db = {
    "user123": {
        "id": "user123",
        "email": "filmmaker@example.com",
        "name": "Test Filmmaker",
        "bio": "Award-winning filmmaker with a passion for storytelling",
        "location": "Los Angeles, CA",
        "profilePicture": "/profiles/user123.jpg",
        "isStudent": False,
        "isVerified": True,
        "subscription": "Pro",
        "joinDate": "2023-01-15T00:00:00Z",
        "socialLinks": {
            "instagram": "https://instagram.com/testfilmmaker",
            "twitter": "https://twitter.com/testfilmmaker",
            "vimeo": "https://vimeo.com/testfilmmaker"
        }
    },
    "student1": {
        "id": "student1",
        "email": "student@example.com",
        "name": "Film Student",
        "bio": "Film student at NYU",
        "location": "New York, NY",
        "profilePicture": "/profiles/student1.jpg",
        "isStudent": True,
        "isVerified": True,
        "subscription": "Student",
        "joinDate": "2023-03-10T00:00:00Z",
        "school": "NYU Tisch School of the Arts",
        "socialLinks": {
            "instagram": "https://instagram.com/filmstudent"
        }
    }
}

# Routes
@router.get("/profile")
async def get_user_profile():
    """Get the current user's profile"""
    # In a real app, get the user ID from auth token
    user_id = "user123"
    
    if user_id in fake_users_db:
        return fake_users_db[user_id]
    
    raise HTTPException(status_code=404, detail="User not found")

@router.get("/profile/{user_id}")
async def get_user_by_id(user_id: str):
    """Get a user's profile by ID"""
    if user_id in fake_users_db:
        return fake_users_db[user_id]
    
    raise HTTPException(status_code=404, detail="User not found")

@router.put("/profile")
async def update_profile(
    name: Optional[str] = None,
    bio: Optional[str] = None,
    location: Optional[str] = None,
    social_links: Optional[dict] = None
):
    """Update the current user's profile"""
    # In a real app, get the user ID from auth token
    user_id = "user123"
    
    if user_id not in fake_users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user fields
    user = fake_users_db[user_id]
    
    if name is not None:
        user["name"] = name
    
    if bio is not None:
        user["bio"] = bio
    
    if location is not None:
        user["location"] = location
    
    if social_links is not None:
        user["socialLinks"] = social_links
    
    return user

@router.post("/history")
async def update_watch_history(video_id: str, progress: float):
    """Add or update a video in the user's watch history"""
    # In a real app, get the user ID from auth token and store in a database
    return {"success": True, "videoId": video_id, "progress": progress}