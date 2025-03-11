import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Add the parent directory to the path so we can import from backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.routes.auth import verify_token, login_user, register_user
from backend.auth.token import generate_token

class AuthTestCase(unittest.TestCase):
    """Test cases for authentication functions"""
    
    def setUp(self):
        """Set up test data"""
        self.test_user = {
            "id": "test123",
            "email": "test@example.com",
            "name": "Test User",
            "password": "password123",
            "isStudent": False,
            "isVerified": True
        }
        
        # Create a mock database response
        self.db_user = {
            "id": "test123",
            "email": "test@example.com",
            "name": "Test User",
            "password_hash": "$2b$12$aBcDeFgHiJkLmNoPqRsTuVwXyZ01234567890AbCdEfGhIjKl", # Hashed "password123"
            "is_student": False,
            "is_verified": True,
            "created_at": "2023-01-01T00:00:00Z"
        }
        
        # Token for test user
        self.valid_token = generate_token({
            "sub": self.test_user["id"],
            "email": self.test_user["email"],
            "name": self.test_user["name"]
        })

    @patch('backend.database.queries.find_user_by_email')
    def test_login_success(self, mock_find_user):
        """Test successful login"""
        # Setup the mock
        mock_find_user.return_value = self.db_user
        
        # Mock the password verification
        with patch('backend.auth.token.bcrypt.checkpw', return_value=True):
            result = login_user(self.test_user["email"], self.test_user["password"])
        
        # Assertions
        self.assertIsNotNone(result)
        self.assertTrue("token" in result)
        self.assertTrue("user" in result)
        self.assertEqual(result["user"]["email"], self.test_user["email"])
        self.assertFalse("password_hash" in result["user"])
    
    @patch('backend.database.queries.find_user_by_email')
    def test_login_invalid_password(self, mock_find_user):
        """Test login with invalid password"""
        # Setup the mock
        mock_find_user.return_value = self.db_user
        
        # Mock the password verification
        with patch('backend.auth.token.bcrypt.checkpw', return_value=False):
            with self.assertRaises(ValueError) as context:
                login_user(self.test_user["email"], "wrong_password")
        
        # Assertions
        self.assertTrue("Invalid credentials" in str(context.exception))
    
    @patch('backend.database.queries.find_user_by_email')
    def test_login_user_not_found(self, mock_find_user):
        """Test login with non-existent user"""
        # Setup the mock
        mock_find_user.return_value = None
        
        # Assertions
        with self.assertRaises(ValueError) as context:
            login_user("nonexistent@example.com", self.test_user["password"])
        
        self.assertTrue("User not found" in str(context.exception))
    
    @patch('backend.database.queries.find_user_by_email')
    @patch('backend.database.queries.create_user')
    def test_register_user_success(self, mock_create_user, mock_find_user):
        """Test successful user registration"""
        # Setup the mocks
        mock_find_user.return_value = None
        mock_create_user.return_value = self.db_user
        
        # Mock password hashing
        with patch('backend.auth.token.bcrypt.hashpw', return_value=b'hashed_password'):
            result = register_user(
                self.test_user["email"],
                self.test_user["password"],
                self.test_user["name"],
                self.test_user["isStudent"]
            )
        
        # Assertions
        self.assertIsNotNone(result)
        self.assertTrue("token" in result)
        self.assertTrue("user" in result)
        self.assertEqual(result["user"]["email"], self.test_user["email"])
    
    @patch('backend.database.queries.find_user_by_email')
    def test_register_existing_user(self, mock_find_user):
        """Test registration with existing email"""
        # Setup the mock
        mock_find_user.return_value = self.db_user
        
        # Assertions
        with self.assertRaises(ValueError) as context:
            register_user(
                self.test_user["email"],
                self.test_user["password"],
                self.test_user["name"],
                self.test_user["isStudent"]
            )
        
        self.assertTrue("Email already registered" in str(context.exception))
    
    def test_verify_token_success(self):
        """Test successful token verification"""
        # Test with valid token
        user_data = verify_token(self.valid_token)
        
        # Assertions
        self.assertIsNotNone(user_data)
        self.assertEqual(user_data["sub"], self.test_user["id"])
        self.assertEqual(user_data["email"], self.test_user["email"])
    
    def test_verify_token_invalid(self):
        """Test verification with invalid token"""
        # Test with invalid token
        with self.assertRaises(ValueError) as context:
            verify_token("invalid.token.string")
        
        # Assertions
        self.assertTrue("Invalid token" in str(context.exception))
    
    def test_verify_token_expired(self):
        """Test verification with expired token"""
        # Mock jwt.decode to raise ExpiredSignatureError
        with patch('backend.auth.token.jwt.decode', side_effect=Exception("Signature has expired")):
            with self.assertRaises(ValueError) as context:
                verify_token(self.valid_token)
        
        # Assertions
        self.assertTrue("Token expired" in str(context.exception))


if __name__ == '__main__':
    unittest.main()