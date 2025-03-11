from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import random

# Create router
router = APIRouter()

# Mock video performance data
def generate_mock_data(days=30, base_views=100):
    """Generate mock analytics data for testing"""
    today = datetime.now()
    data = []
    
    for i in range(days):
        date = today - timedelta(days=i)
        # Generate some random data with an overall upward trend
        views = max(0, base_views - i + random.randint(-20, 20))
        
        data.append({
            "date": date.strftime("%Y-%m-%d"),
            "views": views,
            "uniqueViewers": int(views * 0.7),
            "averageWatchTime": random.randint(40, 90),
            "completionRate": random.randint(30, 80),
            "shares": int(views * 0.05),
            "ratings": int(views * 0.02)
        })
    
    return sorted(data, key=lambda x: x["date"])

# Routes
@router.get("/video/{video_id}")
async def get_video_analytics(
    video_id: str,
    timeframe: str = "month"
):
    """Get analytics for a specific video"""
    # In a real app, fetch from database
    
    # Determine days based on timeframe
    if timeframe == "week":
        days = 7
    elif timeframe == "month":
        days = 30
    elif timeframe == "year":
        days = 365
    else:
        days = 30  # Default to month
    
    # Generate mock data
    daily_data = generate_mock_data(days=days, base_views=300)
    
    # Calculate totals and averages
    total_views = sum(day["views"] for day in daily_data)
    total_shares = sum(day["shares"] for day in daily_data)
    avg_watch_time = sum(day["averageWatchTime"] for day in daily_data) / len(daily_data)
    
    return {
        "videoId": video_id,
        "timeframe": timeframe,
        "totals": {
            "views": total_views,
            "uniqueViewers": int(total_views * 0.7),
            "shares": total_shares,
            "ratings": int(total_views * 0.02),
            "averageWatchTime": avg_watch_time,
            "averageCompletionRate": sum(day["completionRate"] for day in daily_data) / len(daily_data)
        },
        "dailyData": daily_data,
        "demographics": {
            "locations": [
                {"name": "United States", "percentage": 45},
                {"name": "United Kingdom", "percentage": 15},
                {"name": "Canada", "percentage": 10},
                {"name": "Germany", "percentage": 8},
                {"name": "France", "percentage": 7},
                {"name": "Other", "percentage": 15}
            ],
            "devices": [
                {"name": "Mobile", "percentage": 55},
                {"name": "Desktop", "percentage": 35},
                {"name": "Tablet", "percentage": 8},
                {"name": "TV", "percentage": 2}
            ],
            "referrers": [
                {"name": "Direct", "percentage": 40},
                {"name": "Social Media", "percentage": 30},
                {"name": "External Websites", "percentage": 20},
                {"name": "Search", "percentage": 10}
            ]
        }
    }

@router.get("/filmmaker")
async def get_filmmaker_analytics():
    """Get overall analytics for the current filmmaker"""
    # In a real app, get the filmmaker ID from auth token
    
    # Generate some mock data
    return {
        "totalViews": 12500,
        "totalVideos": 5,
        "totalWatchTime": 52000,  # in seconds
        "averageRating": 4.6,
        "totalShares": 320,
        "totalRatings": 230,
        "viewsChange": 12.5,  # percentage change from previous period
        "sharesChange": 8.3,
        "ratingChange": 0.2,
        "topVideos": [
            {
                "id": "video1",
                "title": "Amazing Short Film",
                "views": 5000,
                "averageRating": 4.8
            },
            {
                "id": "video2",
                "title": "Commercial Demo",
                "views": 3000,
                "averageRating": 4.5
            }
        ],
        "viewsByDay": generate_mock_data(days=30, base_views=500),
        "geographicDistribution": [
            {"region": "North America", "percentage": 55},
            {"region": "Europe", "percentage": 25},
            {"region": "Asia", "percentage": 12},
            {"region": "Other", "percentage": 8}
        ]
    }

@router.post("/watch-time")
async def record_watch_time(
    videoId: str,
    watchTimeSeconds: int,
    percentageWatched: float
):
    """Record video watch time for analytics"""
    # In a real app, store this in a database
    return {
        "success": True,
        "videoId": videoId,
        "recorded": {
            "watchTimeSeconds": watchTimeSeconds,
            "percentageWatched": percentageWatched
        }
    }

@router.post("/shares")
async def record_share(
    videoId: str,
    platform: str,
    url: str
):
    """Record when a video is shared"""
    # In a real app, store this in a database
    return {
        "success": True,
        "videoId": videoId,
        "platform": platform,
        "shareId": f"share_{random.randint(10000, 99999)}"
    }