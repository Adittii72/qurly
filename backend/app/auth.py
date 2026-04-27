"""
Authentication schemas and utilities
"""
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
import os
import jwt
from datetime import timedelta

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days


class TokenData(BaseModel):
    """Token payload schema"""
    user_id: int
    email: str
    exp: datetime = None


class UserCreate(BaseModel):
    """User creation schema"""
    email: EmailStr
    username: str
    google_id: Optional[str] = None
    profile_picture: Optional[str] = None


class LoginRequest(BaseModel):
    """User login request schema"""
    email: EmailStr


class UserResponse(BaseModel):
    """User response schema"""
    id: int
    email: str
    username: str
    profile_picture: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class GoogleAuthRequest(BaseModel):
    """Google OAuth token request"""
    token: str


class LoginResponse(BaseModel):
    """Login response with access token"""
    access_token: str
    token_type: str
    user: UserResponse


class ReportCreateRequest(BaseModel):
    """Request to save a report"""
    product_url: str
    product_title: str
    product_description: str
    product_price: Optional[float] = None
    overall_score: float
    clarity_score: float
    trust_score: float
    completeness_score: float
    structure_score: float
    nlp_features: dict
    issues: list
    confidence_scores: dict
    benchmark_comparison: dict
    tags: Optional[str] = None


class ReportResponse(BaseModel):
    """Report response schema"""
    id: int
    product_url: str
    product_title: str
    overall_score: float
    clarity_score: float
    trust_score: float
    completeness_score: float
    structure_score: float
    created_at: datetime
    is_favorite: bool
    
    class Config:
        from_attributes = True


class ReportDetailResponse(ReportResponse):
    """Detailed report response with all fields"""
    product_description: str
    nlp_features: dict
    issues: list
    confidence_scores: dict
    benchmark_comparison: dict
    tags: Optional[str] = None


class ComparisonRequest(BaseModel):
    """Request to compare two products"""
    product_url_1: str
    product_url_2: str


class ComparisonResponse(BaseModel):
    """Comparison result response"""
    id: int
    product_1_score: float
    product_2_score: float
    winner: str
    comparison_data: dict
    insights: dict
    created_at: datetime
    
    class Config:
        from_attributes = True


def create_access_token(user_id: int, email: str) -> str:
    """Create JWT access token"""
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> dict:
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")
