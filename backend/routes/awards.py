from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

# Create router
router = APIRouter()

# Mock leaderboard data
mock_leaderboard = [
    {
        "id": "video1",
        "title": "Amazing Short Film",
        "category": "short-film",
        "thumbnailUrl": "/previews/video1.jpg",
        "views": 5000,
        "averageRating": 4.8,
        "filmmaker": {
            "id": "user123",
            "name": "Test Filmmaker",
            "isVerified": True
        }
    },
    {
        "id": "video2",
        "title": "Commercial Demo",
        "category": "commercial",
        "thumbnailUrl": "/previews/video2.jpg",
        "views": 3000,
        "averageRating": 4.5,
        "filmmaker": {
            "id": "user123",
            "name": "Test Filmmaker",
            "isVerified": True
        }
    },
    {
        "id": "video3",
        "title": "Student Project",
        "category": "short-film",
        "thumbnailUrl": "/previews/video3.jpg",
        "views": 2000,
        "averageRating": 4.9,
        "filmmaker": {
            "id": "student1",
            "name": "Film Student",
            "isVerified": True,
            "isStudent": True
        }
    }
]

# Mock hall of fame data
mock_hall_of_fame = {
    "currentYear": {
        "year": 2023,
        "filmOfTheYear": {
            "id": "video1",
            "title": "Amazing Short Film",
            "thumbnailUrl": "/previews/video1.jpg",
            "description": "A beautiful short film about nature",
            "averageRating": 4.8,
            "views": 5000,
            "filmmaker": {
                "id": "user123",
                "name": "Test Filmmaker"
            }
        },
        "runnerUps": [
            {
                "id": "video2",
                "title": "Commercial Demo",
                "thumbnailUrl": "/previews/video2.jpg",
                "averageRating": 4.5,
                "filmmaker": {
                    "id": "user123",
                    "name": "Test Filmmaker"
                }
            }
        ],
        "studentFilmmaker": {
            "id": "video3",
            "title": "Student Project",
            "thumbnailUrl": "/previews/video3.jpg",
            "description": "An impressive student film project",
            "averageRating": 4.9,
            "filmmaker": {
                "id": "student1",
                "name": "Film Student",
                "school": "NYU Tisch School of the Arts"
            }
        }
    },
    "pastYears": [
        {
            "year": 2022,
            "filmOfTheYear": {
                "id": "past1",
                "title": "Last Year's Winner",
                "filmmaker": {
                    "name": "Past Director"
                }
            },
            "studentFilmmaker": {
                "id": "past2",
                "title": "Student Winner",
                "filmmaker": {
                    "name": "Past Student"
                }
            }
        }
    ]
}

@router.get("/leaderboard")
async def get_leaderboard(
    category: str = "all",
    timeframe: str = "month",
    limit: int = 5
):
    """Get the current leaderboard"""
    # Filter by category if needed
    if category != "all":
        filtered = [v for v in mock_leaderboard if v["category"] == category]
    else:
        filtered = mock_leaderboard
    
    # Sort by rating (in a real app, would use different criteria based on timeframe)
    sorted_videos = sorted(filtered, key=lambda v: v["averageRating"], reverse=True)
    
    # Return top videos up to limit
    return sorted_videos[:limit]

@router.get("/hall-of-fame")
async def get_hall_of_fame():
    """Get Hall of Fame data with Film of the Year and Student Filmmaker awards"""
    return mock_hall_of_fame

@router.get("/monthly-winners")
async def get_monthly_winners(
    month: Optional[int] = None,
    year: Optional[int] = None
):
    """Get winners for a specific month"""
    # In a real app, would filter by month and year
    # Default to current month if none specified
    
    # Sort by rating for simplicity
    sorted_videos = sorted(mock_leaderboard, key=lambda v: v["averageRating"], reverse=True)
    
    # Add ranking
    for i, video in enumerate(sorted_videos):
        video["rank"] = i + 1
    
    return {
        "month": month or datetime.now().month,
        "year": year or datetime.now().year,
        "winners": sorted_videos[:5]
    }