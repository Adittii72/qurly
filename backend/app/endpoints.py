"""
API endpoint handlers for advanced features
Including authentication, report management, and analytics
"""
from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from datetime import datetime

from app.database import get_db
from app.models import User, Report, RecommendationHistory, ComparisonReport
from app.auth import (
    UserCreate, UserResponse, LoginResponse, LoginRequest, ReportCreateRequest, 
    ReportResponse, ReportDetailResponse, ComparisonRequest, ComparisonResponse,
    create_access_token, verify_token
)
from app.modules.advanced_nlp import AdvancedNLPAnalyzer
from app.modules.explainability import ConfidenceExplainer
from app.modules.report_generator import ReportGenerator

router = APIRouter(prefix="/api", tags=["advanced"])


# Dependency to extract token from Authorization header
def get_token_from_header(authorization: Optional[str] = Header(None)) -> str:
    """Extract bearer token from Authorization header"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    return parts[1]


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@router.post("/auth/signup", response_model=LoginResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Create new user account"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_username = db.query(User).filter(User.username == user_data.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create new user
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        google_id=user_data.google_id,
        profile_picture=user_data.profile_picture
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate token
    token = create_access_token(new_user.id, new_user.email)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(new_user)
    }


@router.post("/auth/login", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login with email"""
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    token = create_access_token(user.id, user.email)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }


@router.post("/auth/google", response_model=LoginResponse)
def google_login(google_token: str = Depends(get_token_from_header), db: Session = Depends(get_db)):
    """Google OAuth login"""
    # TODO: Verify Google token and extract user info
    # For now, create/get user by email from token
    raise HTTPException(status_code=501, detail="Google OAuth not yet implemented")


# ============================================================================
# USER PROFILE ENDPOINTS
# ============================================================================

@router.get("/users/me", response_model=UserResponse)
def get_current_user(token: str = Depends(get_token_from_header), db: Session = Depends(get_db)):
    """Get current user profile"""
    try:
        payload = verify_token(token)
        user_id = payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


# ============================================================================
# REPORT MANAGEMENT ENDPOINTS
# ============================================================================

@router.post("/reports", response_model=dict)
def save_report(
    report_data: ReportCreateRequest,
    token: str = Depends(get_token_from_header),
    db: Session = Depends(get_db)
):
    """Save analysis report to database"""
    try:
        payload = verify_token(token)
        user_id = payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Create new report
    new_report = Report(
        user_id=user_id,
        product_url=report_data.product_url,
        product_title=report_data.product_title,
        product_description=report_data.product_description,
        product_price=report_data.product_price,
        overall_score=report_data.overall_score,
        clarity_score=report_data.clarity_score,
        trust_score=report_data.trust_score,
        completeness_score=report_data.completeness_score,
        structure_score=report_data.structure_score,
        nlp_features=report_data.nlp_features,
        issues=report_data.issues,
        confidence_scores=report_data.confidence_scores,
        benchmark_comparison=report_data.benchmark_comparison,
        tags=report_data.tags
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return {"id": new_report.id, "status": "saved", "created_at": new_report.created_at}


@router.get("/reports/{report_id}", response_model=ReportDetailResponse)
def get_report(report_id: int, token: str = Depends(get_token_from_header), db: Session = Depends(get_db)):
    """Get specific report"""
    try:
        payload = verify_token(token)
        user_id = payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == user_id
    ).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return report


@router.get("/reports", response_model=List[ReportResponse])
def list_reports(token: str = Depends(get_token_from_header), limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    """List user's saved reports"""
    try:
        payload = verify_token(token)
        user_id = payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    reports = db.query(Report).filter(
        Report.user_id == user_id
    ).order_by(Report.created_at.desc()).offset(offset).limit(limit).all()
    
    return reports


@router.delete("/reports/{report_id}")
def delete_report(report_id: int, token: str = Depends(get_token_from_header), db: Session = Depends(get_db)):
    """Delete a report"""
    try:
        payload = verify_token(token)
        user_id = payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == user_id
    ).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    db.delete(report)
    db.commit()
    
    return {"status": "deleted"}


@router.post("/reports/{report_id}/favorite")
def toggle_favorite(report_id: int, token: str = Depends(get_token_from_header), db: Session = Depends(get_db)):
    """Toggle report as favorite"""
    try:
        payload = verify_token(token)
        user_id = payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == user_id
    ).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report.is_favorite = not report.is_favorite
    db.commit()
    
    return {"is_favorite": report.is_favorite}


# ============================================================================
# HISTORICAL TRACKING ENDPOINTS
# ============================================================================

@router.get("/reports/{report_id}/history")
def get_analysis_history(report_id: int, token: str = Depends(get_token_from_header), db: Session = Depends(get_db)):
    """Get historical tracking of a product"""
    try:
        payload = verify_token(token)
        user_id = payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Get all reports for the same product URL
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    history = db.query(Report).filter(
        Report.user_id == user_id,
        Report.product_url == report.product_url
    ).order_by(Report.created_at).all()
    
    return {
        "product_url": report.product_url,
        "product_title": report.product_title,
        "analysis_count": len(history),
        "history": [
            {
                "id": r.id,
                "overall_score": r.overall_score,
                "clarity_score": r.clarity_score,
                "trust_score": r.trust_score,
                "completeness_score": r.completeness_score,
                "structure_score": r.structure_score,
                "created_at": r.created_at
            }
            for r in history
        ],
        "trend": "improving" if len(history) > 1 and history[-1].overall_score > history[0].overall_score else "declining"
    }


# ============================================================================
# EXPORT ENDPOINTS
# ============================================================================

@router.get("/reports/{report_id}/export/json")
def export_json(report_id: int, token: str = Depends(get_token_from_header), db: Session = Depends(get_db)):
    """Export report as JSON"""
    try:
        payload = verify_token(token)
        user_id = payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == user_id
    ).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    generator = ReportGenerator({
        "product_title": report.product_title,
        "product_url": report.product_url,
        "overall_score": report.overall_score,
        "clarity_score": report.clarity_score,
        "trust_score": report.trust_score,
        "completeness_score": report.completeness_score,
        "structure_score": report.structure_score,
        "issues": report.issues,
        "nlp_features": report.nlp_features,
        "benchmark_comparison": report.benchmark_comparison,
        "confidence_scores": report.confidence_scores
    })
    
    return generator.generate_json()


@router.get("/reports/{report_id}/export/text")
def export_text(report_id: int, token: str = Depends(get_token_from_header), db: Session = Depends(get_db)):
    """Export report as text"""
    try:
        payload = verify_token(token)
        user_id = payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == user_id
    ).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    generator = ReportGenerator({
        "product_title": report.product_title,
        "product_url": report.product_url,
        "overall_score": report.overall_score,
        "clarity_score": report.clarity_score,
        "trust_score": report.trust_score,
        "completeness_score": report.completeness_score,
        "structure_score": report.structure_score,
        "issues": report.issues,
        "nlp_features": report.nlp_features,
        "benchmark_comparison": report.benchmark_comparison,
        "confidence_scores": report.confidence_scores
    })
    
    text = generator.generate_summary()
    
    return {
        "format": "text",
        "content": text,
        "filename": f"qurly-report-{report_id}.txt"
    }


@router.get("/reports/{report_id}/export/markdown")
def export_markdown(report_id: int, token: str = Depends(get_token_from_header), db: Session = Depends(get_db)):
    """Export report as Markdown"""
    try:
        payload = verify_token(token)
        user_id = payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == user_id
    ).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    generator = ReportGenerator({
        "product_title": report.product_title,
        "product_url": report.product_url,
        "overall_score": report.overall_score,
        "clarity_score": report.clarity_score,
        "trust_score": report.trust_score,
        "completeness_score": report.completeness_score,
        "structure_score": report.structure_score,
        "issues": report.issues,
        "nlp_features": report.nlp_features,
        "benchmark_comparison": report.benchmark_comparison,
        "confidence_scores": report.confidence_scores
    })
    
    markdown = generator.generate_markdown()
    
    return {
        "format": "markdown",
        "content": markdown,
        "filename": f"qurly-report-{report_id}.md"
    }


# ============================================================================
# MULTI-PRODUCT COMPARISON ENDPOINTS
# ============================================================================

@router.post("/compare", response_model=dict)
def compare_products(
    comparison_request: ComparisonRequest,
    token: str = Depends(get_token_from_header),
    db: Session = Depends(get_db)
):
    """Compare two products"""
    try:
        payload = verify_token(token)
        user_id = payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # TODO: Scrape and analyze both products
    # For now, return placeholder
    
    raise HTTPException(status_code=501, detail="Comparison endpoint not yet implemented")


@router.get("/comparisons", response_model=List[dict])
def list_comparisons(token: str = Depends(get_token_from_header), db: Session = Depends(get_db)):
    """List user's product comparisons"""
    try:
        payload = verify_token(token)
        user_id = payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    comparisons = db.query(ComparisonReport).filter(
        ComparisonReport.user_id == user_id
    ).order_by(ComparisonReport.created_at.desc()).all()
    
    return comparisons

