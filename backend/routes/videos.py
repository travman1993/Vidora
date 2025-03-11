from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
import uuid
import json
from datetime import datetime

# Create router
router = APIRouter()

# Mock video database - replace with real database in production
fake_videos_db = [
    {
        "id": "video1",
        "title": "Amazing Short Film",
        "description": "A beautiful short film about nature",
        "category": "short-film",
        "userId": "user123",
        "uploadDate": "2023-06-01T12:00:00Z",
        "duration": 480,  # 8 minutes
        "views": 5000,
        "averageRating": 4.8,
        "ratingCount": 120,
        "shares": 300,
        "thumbnailUrl": "/previews/video1.jpg",
        "videoUrl": "/videos/video1.mp4",
        "isPublic": True,
        "tags": ["nature", "cinematic", "4k"]
    },
    {
        "id": "video2",
        "title": "Commercial Demo",
        "description": "A sample commercial for a fictional product",
        "category": "commercial",
        "userId": "user123",
        "uploadDate": "2023-05-15T10:00:00Z",
        "duration": 60,  # 1 minute
        "views": 3000,
        "averageRating": 4.5,
        "ratingCount": 80,
        "shares": 150,
        "thumbnailUrl": "/previews/video2.jpg",
        "videoUrl": "/videos/video2.mp4",
        "isPublic": True,
        "tags": ["commercial", "product", "advertisement"]
    }
]

# Routes
@router.get("/")
async def get_videos(category: Optional[str] = None, limit: int = 50, page: int = 1):
    """Get a list of videos, optionally filtered by category"""
    skip = (page - 1) * limit
    
    # Filter by category if provided
    if category and category != "all":
        filtered_videos = [v for v in fake_videos_db if v["category"] == category and v["isPublic"]]
    else:
        filtered_videos = [v for v in fake_videos_db if v["isPublic"]]
    
    # Paginate results
    paginated_videos = filtered_videos[skip:skip + limit]
    
    return paginated_videos

@router.get("/featured")
async def get_featured_videos(limit: int = 6):
    """Get featured videos for the homepage"""
    # In a real app, this would use criteria to select featured videos
    return sorted(fake_videos_db, key=lambda v: v["views"], reverse=True)[:limit]

@router.get("/popular")
async def get_popular_videos(timeframe: str = "week", limit: int = 10):
    """Get popular videos for a given timeframe"""
    # In a real app, this would filter by upload date based on timeframe
    return sorted(fake_videos_db, key=lambda v: v["views"], reverse=True)[:limit]

@router.get("/{video_id}")
async def get_video(video_id: str):
    """Get a single video by ID"""
    for video in fake_videos_db:
        if video["id"] == video_id:
            # Add filmmaker info
            video_with_filmmaker = video.copy()
            video_with_filmmaker["filmmaker"] = {
                "id": "user123",
                "name": "Test Filmmaker",
                "isVerified": True
            }
            return video_with_filmmaker
    
    raise HTTPException(status_code=404, detail="Video not found")

@router.post("/upload")
async def upload_video(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    isPublic: bool = Form(True),
    tags: str = Form(""),
    videoFile: UploadFile = File(...),
    thumbnailFile: Optional[UploadFile] = File(None)
):
    """Upload a new video"""
    # In a real app, save files to storage and process video
    
    # Generate a video ID
    video_id = f"video{len(fake_videos_db) + 1}"
    
    # Create new video entry
    new_video = {
        "id": video_id,
        "title": title,
        "description": description,
        "category": category,
        "userId": "user123",  # Would come from auth in a real app
        "uploadDate": datetime.now().isoformat(),
        "duration": 300,  # Would be extracted from the actual video
        "views": 0,
        "averageRating": 0,
        "ratingCount": 0,
        "shares": 0,
        "thumbnailUrl": f"/previews/{video_id}.jpg",
        "videoUrl": f"/videos/{video_id}.mp4",
        "isPublic": isPublic,
        "tags": tags.split(",") if tags else []
    }
    
    # Add to database
    fake_videos_db.append(new_video)
    
    return new_video

@router.post("/{video_id}/rate")
async def rate_video(video_id: str, rating: float):
    """Rate a video"""
    if rating < 0.5 or rating > 5 or rating % 0.5 != 0:
        raise HTTPException(status_code=400, detail="Rating must be between 0.5 and 5 in 0.5 increments")
    
    for video in fake_videos_db:
        if video["id"] == video_id:
            # Update rating (simplified - a real app would store individual ratings)
            current_total = video["averageRating"] * video["ratingCount"]
            video["ratingCount"] += 1
            video["averageRating"] = (current_total + rating) / video["ratingCount"]
            return {
                "averageRating": video["averageRating"],
                "ratingCount": video["ratingCount"]
            }
    
    raise HTTPException(status_code=404, detail="Video not found")