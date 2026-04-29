"""
Authentication schemas and utilities
"""
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from typing import Optional
import os
import jwt
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", os.getenv("SECRET_KEY", "dev-jwt-secret-key-change-in-prod-min-32-chars"))
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24 * 7))  # 7 days


class TokenData(BaseModel):
    """Token payload schema"""
    user_id: int
    email: str
    exp: datetime = None


class UserCreate(BaseModel):
    """User creation schema with password"""
    email: EmailStr
    username: str
    password: str
    google_id: Optional[str] = None
    profile_picture: Optional[str] = None


class UserLogin(BaseModel):
    """User login request schema"""
    email: EmailStr
    password: str


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


class ComparisonRequest(BaseModel):
    """Request to compare two products"""
    product_url_1: str
    product_url_2: str


class ComparisonResponse(BaseModel):
    """Comparison result response"""
    product_url_1: str
    product_url_2: str
    product_1_score: float
    product_2_score: float
    winner: str
    insights: dict


class ContactRequest(BaseModel):
    """Contact form request"""
    name: str
    email: EmailStr
    message: str


class SimulateScoreRequest(BaseModel):
    """Request to simulate score for a description"""
    description: str
    product_data: dict


# Password hashing utilities
def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: int, email: str, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = {
        "user_id": user_id,
        "email": email
    }
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        email: str = payload.get("email")
        if user_id is None or email is None:
            return None
        return {"user_id": user_id, "email": email}
    except jwt.InvalidTokenError:
        return None


def verify_token(token: str) -> Optional[dict]:
    """Alias for decode_token for backwards compatibility"""
    return decode_token(token)


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
