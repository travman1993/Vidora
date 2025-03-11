import unittest
from unittest.mock import patch, MagicMock
import sys
import os
from datetime import datetime, timedelta

# Add the parent directory to the path so we can import from backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.awards.film_of_the_month import calculate_monthly_winners
from backend.awards.student_awards import calculate_student_filmmaker_awards
from backend.routes.awards import get_leaderboard, get_hall_of_fame

class AwardsTestCase(unittest.TestCase):
    """Test cases for awards and leaderboard functionality"""
    
    def setUp(self):
        """Set up test data"""
        # Sample videos for testing
        self.test_videos = [
            {
                "id": "video1",
                "title": "Amazing Short Film",
                "category": "short-film",
                "userId": "user1",
                "uploadDate": (datetime.now() - timedelta(days=20)).isoformat(),
                "duration": 480,  # 8 minutes
                "views": 5000,
                "averageRating": 4.8,
                "ratingCount": 120,
                "shares": 300,
                "thumbnailUrl": "https://example.com/thumbnails/video1.jpg",
                "isPublic": True
            },
            {
                "id": "video2",
                "title": "Artistic Commercial",
                "category": "commercial",
                "userId": "user2",
                "uploadDate": (datetime.now() - timedelta(days=15)).isoformat(),
                "duration": 60,  # 1 minute
                "views": 8000,
                "averageRating": 4.5,
                "ratingCount": 200,
                "shares": 450,
                "thumbnailUrl": "https://example.com/thumbnails/video2.jpg",
                "isPublic": True
            },
            {
                "id": "video3",
                "title": "Student Project",
                "category": "short-film",
                "userId": "student1",
                "uploadDate": (datetime.now() - timedelta(days=10)).isoformat(),
                "duration": 300,  # 5 minutes
                "views": 3000,
                "averageRating": 4.9,
                "ratingCount": 80,
                "shares": 150,
                "thumbnailUrl": "https://example.com/thumbnails/video3.jpg",
                "isPublic": True
            }
        ]
        
        # Sample users for testing
        self.test_users = [
            {
                "id": "user1",
                "name": "Professional Filmmaker",
                "isStudent": False,
                "profilePicture": "https://example.com/profiles/user1.jpg"
            },
            {
                "id": "user2",
                "name": "Commercial Director",
                "isStudent": False,
                "profilePicture": "https://example.com/profiles/user2.jpg"
            },
            {
                "id": "student1",
                "name": "Film Student",
                "isStudent": True,
                "school": "Film Academy",
                "profilePicture": "https://example.com/profiles/student1.jpg"
            }
        ]
    
    @patch('backend.database.queries.get_monthly_top_videos')
    def test_calculate_monthly_winners(self, mock_get_monthly_top_videos):
        """Test calculation of monthly winners"""
        # Setup mocks
        mock_get_monthly_top_videos.return_value = self.test_videos
        
        # Call the function
        result = calculate_monthly_winners()
        
        # Assertions
        self.assertIsNotNone(result)
        self.assertEqual(len(result), len(self.test_videos))
        self.assertEqual(result[0]["id"], "video1")  # Highest rated
        self.assertEqual(result[0]["rank"], 1)
    
    @patch('backend.database.queries.get_student_videos')
    @patch('backend.database.queries.get_user_by_id')
    def test_calculate_student_filmmaker_awards(self, mock_get_user, mock_get_student_videos):
        """Test calculation of student filmmaker awards"""
        # Setup mocks
        student_video = self.test_videos[2]  # The student video
        mock_get_student_videos.return_value = [student_video]
        mock_get_user.return_value = self.test_users[2]  # The student user
        
        # Call the function
        result = calculate_student_filmmaker_awards()
        
        # Assertions
        self.assertIsNotNone(result)
        self.assertEqual(result["winner"]["id"], "video3")
        self.assertEqual(result["winner"]["filmmaker"]["name"], "Film Student")
        self.assertTrue(result["winner"]["filmmaker"]["isStudent"])
    
    @patch('backend.routes.awards.get_videos_by_criteria')
    @patch('backend.routes.awards.get_user_by_id')
    def test_get_leaderboard(self, mock_get_user, mock_get_videos):
        """Test getting leaderboard data"""
        # Setup mocks
        mock_get_videos.return_value = self.test_videos
        mock_get_user.side_effect = lambda user_id: next(
            (user for user in self.test_users if user["id"] == user_id), None)
        
        # Mock request
        mock_request = MagicMock()
        mock_request.args = {"category": "all", "timeframe": "month", "limit": "5"}
        
        # Call function
        result = get_leaderboard(mock_request)
        
        # Assertions
        self.assertIsNotNone(result)
        self.assertEqual(len(result), len(self.test_videos))
        self.assertTrue("filmmaker" in result[0])
        self.assertEqual(result[0]["filmmaker"]["name"], "Professional Filmmaker")
    
    @patch('backend.database.queries.get_film_of_year')
    @patch('backend.database.queries.get_student_filmmaker_of_year')
    @patch('backend.database.queries.get_all_winners')
    def test_get_hall_of_fame(self, mock_get_all_winners, mock_get_student_winner, mock_get_film_winner):
        """Test getting Hall of Fame data"""
        # Setup mocks
        # Current year winners
        mock_get_film_winner.return_value = {
            "id": "video1",
            "title": "Amazing Short Film",
            "filmmaker": {
                "id": "user1",
                "name": "Professional Filmmaker"
            },
            "year": 2023
        }
        
        mock_get_student_winner.return_value = {
            "id": "video3",
            "title": "Student Project",
            "filmmaker": {
                "id": "student1",
                "name": "Film Student",
                "school": "Film Academy"
            },
            "year": 2023
        }
        
        # Past years winners
        mock_get_all_winners.return_value = [
            {
                "year": 2022,
                "filmOfTheYear": {
                    "id": "past1",
                    "title": "Last Year's Winner",
                    "filmmaker": {"name": "Past Director"}
                },
                "studentFilmmaker": {
                    "id": "past2",
                    "title": "Student Winner",
                    "filmmaker": {"name": "Past Student"}
                }
            }
        ]
        
        # Call function
        result = get_hall_of_fame()
        
        # Assertions
        self.assertIsNotNone(result)
        self.assertTrue("currentYear" in result)
        self.assertTrue("pastYears" in result)
        self.assertEqual(result["currentYear"]["filmOfTheYear"]["title"], "Amazing Short Film")
        self.assertEqual(result["currentYear"]["studentFilmmaker"]["filmmaker"]["name"], "Film Student")
        self.assertEqual(len(result["pastYears"]), 1)
        self.assertEqual(result["pastYears"][0]["year"], 2022)


if __name__ == '__main__':
    unittest.main()