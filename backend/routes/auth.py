from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta
import os
from typing import Dict, Optional

# Create router
router = APIRouter()

# Mock user database - replace with real database in production
fake_users_db = {
    "filmmaker@example.com": {
        "id": "user123",
        "email": "filmmaker@example.com",
        "name": "Test Filmmaker",
        "password_hash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
        "is_student": False,
        "is_verified": True,
        "subscription": "Pro"
    }
}

# Token settings
SECRET_KEY = os.getenv("JWT_SECRET", "development_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Models
class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    id: str
    email: str
    name: str
    is_student: bool = False
    is_verified: bool = False
    subscription: Optional[str] = None

class UserInDB(User):
    password_hash: str

# Auth utilities
def verify_password(plain_password, hashed_password):
    # Mock implementation - use a proper password hashing lib in production
    return plain_password == "password"  # Only for testing!

def get_user(email: str):
    if email in fake_users_db:
        user_dict = fake_users_db[email]
        return UserInDB(**user_dict)
    return None

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Routes
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email}, 
        expires_delta=access_token_expires
    )
    
    # Return token and user data
    return {
        "token": access_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "isStudent": user.is_student,
            "isVerified": user.is_verified,
            "subscription": user.subscription
        }
    }

@router.post("/register")
async def register(email: str, password: str, name: str, is_student: bool = False):
    if email in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Create new user
    user_id = f"user{len(fake_users_db) + 1}"
    fake_users_db[email] = {
        "id": user_id,
        "email": email,
        "name": name,
        "password_hash": "hashed_" + password,  # Mock hashing
        "is_student": is_student,
        "is_verified": not is_student,  # Students need verification
        "subscription": "Basic"
    }
    
    # Create token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id, "email": email}, 
        expires_delta=access_token_expires
    )
    
    # Return token and user data
    return {
        "token": access_token,
        "user": {
            "id": user_id,
            "email": email,
            "name": name,
            "isStudent": is_student,
            "isVerified": not is_student,
            "subscription": "Basic"
        }
    }

@router.post("/verify-student")
async def verify_student(email: str, code: str):
    # Mock verification - in a real app, verify against a stored code
    if code == "123456" and email in fake_users_db:
        user = fake_users_db[email]
        user["is_verified"] = True
        return {"success": True, "message": "Student account verified successfully"}
    
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid verification code",
    )