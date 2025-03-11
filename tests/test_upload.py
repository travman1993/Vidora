import unittest
from unittest.mock import patch, MagicMock, mock_open
import sys
import os
import json
from io import BytesIO

# Add the parent directory to the path so we can import from backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.routes.videos import upload_video, update_video, delete_video
from backend.auth.token import generate_token

class UploadTestCase(unittest.TestCase):
    """Test cases for video upload functions"""
    
    def setUp(self):
        """Set up test data"""
        # Mock user data
        self.test_user = {
            "id": "user123",
            "email": "filmmaker@example.com",
            "name": "Test Filmmaker",
            "subscription": "Pro"
        }
        
        # Mock video data
        self.test_video = {
            "id": "video123",
            "title": "Test Video",
            "description": "This is a test video",
            "category": "short-film",
            "isPublic": True,
            "tags": "test,video,short",
            "userId": self.test_user["id"],
            "uploadDate": "2023-06-01T12:00:00Z",
            "duration": 180,  # 3 minutes
            "thumbnailUrl": "https://example.com/thumbnails/video123.jpg",
            "videoUrl": "https://example.com/videos/video123.mp4"
        }
        
        # Mock file data
        self.mock_video_file = BytesIO(b"mock video content")
        self.mock_thumbnail_file = BytesIO(b"mock thumbnail content")
        
        # Valid token for test user
        self.auth_token = generate_token({
            "sub": self.test_user["id"],
            "email": self.test_user["email"],
            "name": self.test_user["name"]
        })
    
    @patch('backend.database.queries.get_user_subscription')
    @patch('backend.database.queries.get_user_upload_stats')
    @patch('backend.database.queries.create_video')
    @patch('backend.routes.videos.upload_to_storage')
    def test_upload_video_success(self, mock_upload_to_storage, mock_create_video, 
                                 mock_get_stats, mock_get_subscription):
        """Test successful video upload"""
        # Setup mocks
        mock_get_subscription.return_value = {"name": "Pro", "maxUploads": 15, "maxMinutes": 150}
        mock_get_stats.return_value = {"uploadsThisMonth": 5, "totalMinutesUploaded": 60}
        mock_create_video.return_value = self.test_video
        mock_upload_to_storage.side_effect = [
            "https://example.com/videos/video123.mp4",
            "https://example.com/thumbnails/video123.jpg"
        ]
        
        # Mock request with files
        mock_request = MagicMock()
        mock_request.files = {
            'videoFile': MagicMock(filename="test.mp4", read=lambda: self.mock_video_file.getvalue()),
            'thumbnailFile': MagicMock(filename="test.jpg", read=lambda: self.mock_thumbnail_file.getvalue())
        }
        mock_request.form = {
            'title': "Test Video",
            'description': "This is a test video",
            'category': "short-film",
            'isPublic': "true",
            'tags': "test,video,short"
        }
        mock_request.headers = {'Authorization': f'Bearer {self.auth_token}'}
        
        # Mock video metadata
        with patch('backend.routes.videos.get_video_metadata', return_value={"duration": 180}):
            result = upload_video(mock_request)
        
        # Assertions
        self.assertIsNotNone(result)
        self.assertEqual(result["title"], "Test Video")
        self.assertEqual(result["userId"], self.test_user["id"])
        self.assertEqual(result["category"], "short-film")
        mock_upload_to_storage.assert_called()
        mock_create_video.assert_called_once()
    
    @patch('backend.database.queries.get_user_subscription')
    @patch('backend.database.queries.get_user_upload_stats')
    def test_upload_video_quota_exceeded(self, mock_get_stats, mock_get_subscription):
        """Test video upload with exceeded quota"""
        # Setup mocks
        mock_get_subscription.return_value = {"name": "Basic", "maxUploads": 5, "maxMinutes": 50}
        mock_get_stats.return_value = {"uploadsThisMonth": 5, "totalMinutesUploaded": 45}
        
        # Mock request with files
        mock_request = MagicMock()
        mock_request.files = {
            'videoFile': MagicMock(filename="test.mp4", read=lambda: self.mock_video_file.getvalue())
        }
        mock_request.form = {
            'title': "Test Video",
            'description': "This is a test video",
            'category': "short-film"
        }
        mock_request.headers = {'Authorization': f'Bearer {self.auth_token}'}
        
        # Mock video metadata
        with patch('backend.routes.videos.get_video_metadata', return_value={"duration": 180}):
            with self.assertRaises(ValueError) as context:
                upload_video(mock_request)
        
        # Assertions
        self.assertTrue("Upload quota exceeded" in str(context.exception))
    
    @patch('backend.database.queries.get_video')
    @patch('backend.database.queries.update_video')
    def test_update_video_success(self, mock_update_video, mock_get_video):
        """Test successful video update"""
        # Setup mocks
        mock_get_video.return_value = self.test_video
        mock_update_video.return_value = {**self.test_video, "title": "Updated Title"}
        
        # Mock request data
        mock_request = MagicMock()
        mock_request.json = {"title": "Updated Title"}
        mock_request.headers = {'Authorization': f'Bearer {self.auth_token}'}
        
        result = update_video("video123", mock_request)
        
        # Assertions
        self.assertIsNotNone(result)
        self.assertEqual(result["title"], "Updated Title")
        mock_update_video.assert_called_once()
    
    @patch('backend.database.queries.get_video')
    def test_update_video_unauthorized(self, mock_get_video):
        """Test video update by unauthorized user"""
        # Setup mocks - video owned by different user
        unauthorized_video = {**self.test_video, "userId": "different_user"}
        mock_get_video.return_value = unauthorized_video
        
        # Mock request data
        mock_request = MagicMock()
        mock_request.json = {"title": "Unauthorized Update"}
        mock_request.headers = {'Authorization': f'Bearer {self.auth_token}'}
        
        with self.assertRaises(ValueError) as context:
            update_video("video123", mock_request)
        
        # Assertions
        self.assertTrue("not authorized" in str(context.exception))
    
    @patch('backend.database.queries.get_video')
    @patch('backend.database.queries.delete_video_from_db')
    @patch('backend.routes.videos.delete_from_storage')
    def test_delete_video_success(self, mock_delete_from_storage, mock_delete_video_from_db, mock_get_video):
        """Test successful video deletion"""
        # Setup mocks
        mock_get_video.return_value = self.test_video
        mock_delete_video_from_db.return_value = True
        mock_delete_from_storage.return_value = True
        
        # Mock request
        mock_request = MagicMock()
        mock_request.headers = {'Authorization': f'Bearer {self.auth_token}'}
        
        result = delete_video("video123", mock_request)
        
        # Assertions
        self.assertTrue(result["success"])
        mock_delete_video_from_db.assert_called_once_with("video123")
        mock_delete_from_storage.assert_called()
    
    @patch('backend.database.queries.get_video')
    def test_delete_video_not_found(self, mock_get_video):
        """Test deletion of non-existent video"""
        # Setup mocks
        mock_get_video.return_value = None
        
        # Mock request
        mock_request = MagicMock()
        mock_request.headers = {'Authorization': f'Bearer {self.auth_token}'}
        
        with self.assertRaises(ValueError) as context:
            delete_video("nonexistent", mock_request)
        
        # Assertions
        self.assertTrue("Video not found" in str(context.exception))


if __name__ == '__main__':
    unittest.main()