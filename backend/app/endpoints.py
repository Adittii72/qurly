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
    UserCreate, UserLogin, UserResponse, LoginResponse, ReportCreateRequest, 
    ReportResponse, ReportDetailResponse, ComparisonRequest, ComparisonResponse,
    create_access_token, verify_token, ContactRequest, SimulateScoreRequest
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
    """Create new user account with password"""
    from app.auth import hash_password
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_username = db.query(User).filter(User.username == user_data.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Hash password
    password_hash = hash_password(user_data.password)
    
    # Create new user
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        password_hash=password_hash,
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
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login with email and password"""
    from app.auth import verify_password
    
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not user.password_hash:
        raise HTTPException(status_code=401, detail="Password not set. Please use Google OAuth or reset password")
    
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
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


# ============================================================================
# CONTACT & SUPPORT ENDPOINTS
# ============================================================================

@router.post("/contact")
def contact_form(contact_data: ContactRequest, db: Session = Depends(get_db)):
    """Handle contact form submissions"""
    try:
        # Log contact message (in production, could send email)
        contact_log = {
            "timestamp": datetime.utcnow().isoformat(),
            "name": contact_data.name,
            "email": contact_data.email,
            "message": contact_data.message,
            "status": "received"
        }
        print(f"📧 Contact Form: {contact_log}")
        
        return {
            "success": True,
            "message": "Thank you for reaching out! We'll get back to you soon.",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        print(f"Error processing contact: {e}")
        return {
            "success": False,
            "message": "Failed to submit contact form",
            "error": str(e)
        }


# ============================================================================
# PDF EXPORT ENDPOINT
# ============================================================================

@router.get("/reports/{report_id}/export/pdf")
def export_pdf(report_id: int, token: str = Depends(get_token_from_header), db: Session = Depends(get_db)):
    """Export report as PDF"""
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
    
    try:
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
        
        pdf_content = generator.generate_pdf()
        
        if pdf_content:
            return FileResponse(
                path=pdf_content,
                media_type="application/pdf",
                filename=f"qurly-report-{report_id}.pdf"
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to generate PDF")
    except Exception as e:
        print(f"PDF generation error: {e}")
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")


# ============================================================================
# AI READINESS CHECKLIST ENDPOINT
# ============================================================================

@router.post("/analyze/checklist")
def ai_readiness_checklist(request_data: SimulateScoreRequest) -> dict:
    """
    Generate AI readiness checklist for a product
    
    Returns structured checklist with pass/fail for each criterion
    """
    try:
        product_data = request_data.product_data
        description = request_data.description or ""
        title = product_data.get("title", "")
        
        # Analyze description
        nlp_analyzer = AdvancedNLPAnalyzer(description, title)
        analysis = nlp_analyzer.analyze_full()
        
        # Generate checklist items
        checklist = []
        
        # Product Title checks
        checklist.append({
            "category": "Product Title",
            "check": "Title is descriptive and includes key attributes",
            "passed": len(title) > 20,
            "tip": "Use 40-60 character titles that describe the product and key benefits"
        })
        
        # Description checks
        desc_len = len(description.split())
        checklist.append({
            "category": "Description",
            "check": "Description is 150-300 words",
            "passed": 150 <= desc_len <= 300,
            "tip": f"Current: {desc_len} words. Aim for detailed but scannable descriptions"
        })
        
        # Trust Signals
        checklist.append({
            "category": "Trust Signals",
            "check": "Has customer reviews",
            "passed": product_data.get("review_count", 0) > 0,
            "tip": "Encourage customers to leave reviews for social proof"
        })
        
        checklist.append({
            "category": "Trust Signals",
            "check": "Has return policy",
            "passed": product_data.get("has_return_policy", False),
            "tip": "Clearly display return policy to build customer confidence"
        })
        
        checklist.append({
            "category": "Trust Signals",
            "check": "Has shipping info",
            "passed": product_data.get("has_shipping_policy", False),
            "tip": "Display shipping times and costs upfront"
        })
        
        # Images
        image_count = product_data.get("image_count", 0)
        checklist.append({
            "category": "Images",
            "check": "Has at least 3 product images",
            "passed": image_count >= 3,
            "tip": f"Current: {image_count} images. Multiple angles help AI agents understand products"
        })
        
        # Pricing
        price = product_data.get("price")
        checklist.append({
            "category": "Pricing",
            "check": "Price is clearly listed",
            "passed": price is not None and price > 0,
            "tip": "Always display current pricing and any discounts clearly"
        })
        
        # Structure
        has_bullets = "•" in description or "- " in description or "\n" in description
        checklist.append({
            "category": "Structure",
            "check": "Uses bullet points or structured formatting",
            "passed": has_bullets,
            "tip": "Use bullet points to make product features scannable for AI agents"
        })
        
        # Keywords
        keywords = analysis.get("keywords", {})
        keyword_count = len(keywords.get("high_frequency", []))
        checklist.append({
            "category": "AI Keywords",
            "check": "Contains specific, searchable keywords",
            "passed": keyword_count >= 5,
            "tip": f"Current: {keyword_count} high-frequency keywords. Use specific product attributes"
        })
        
        # FAQ
        checklist.append({
            "category": "FAQ",
            "check": "Has FAQ section",
            "passed": product_data.get("has_faq", False),
            "tip": "Add FAQ section to address common questions from both customers and AI agents"
        })
        
        # Calculate summary
        passed_count = sum(1 for item in checklist if item["passed"])
        total = len(checklist)
        readiness_percentage = int((passed_count / total) * 100)
        
        return {
            "checklist": checklist,
            "passed_count": passed_count,
            "total": total,
            "readiness_percentage": readiness_percentage
        }
    
    except Exception as e:
        print(f"Checklist generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Checklist generation failed: {str(e)}")


# ============================================================================
# SCORE SIMULATION ENDPOINT
# ============================================================================

@router.post("/simulate-score")
def simulate_score(request_data: SimulateScoreRequest) -> dict:
    """
    Simulate score for a product description without saving to database
    
    Returns projected scores for the new description
    """
    try:
        from app.modules.scoring_engine import ScoringEngine
        from app.modules.nlp_analyzer import NLPAnalyzer
        
        description = request_data.description
        product_data = request_data.product_data
        
        # Create mock ProductData
        from app.schemas import ProductData
        
        mock_product = ProductData(
            title=product_data.get("title", "Product"),
            description=description,
            price=product_data.get("price"),
            currency=product_data.get("currency", "USD"),
            image_count=product_data.get("image_count", 0),
            review_count=product_data.get("review_count", 0),
            average_rating=product_data.get("average_rating"),
            has_faq=product_data.get("has_faq", False),
            has_return_policy=product_data.get("has_return_policy", False),
            has_shipping_policy=product_data.get("has_shipping_policy", False),
            has_warranty=product_data.get("has_warranty", False),
        )
        
        # Analyze with NLP
        nlp_analyzer = NLPAnalyzer()
        nlp_features = nlp_analyzer.analyze_description(description)
        
        # Advanced NLP
        advanced_analyzer = AdvancedNLPAnalyzer(description, mock_product.title)
        advanced_analysis = advanced_analyzer.analyze_full()
        
        nlp_features["sentiment"] = advanced_analysis["sentiment"]
        nlp_features["readability"] = advanced_analysis["readability"]
        nlp_features["keywords"] = advanced_analysis["keywords"]
        nlp_features["spam_detection"] = advanced_analysis["spam_detection"]
        
        # Calculate scores
        scoring_engine = ScoringEngine()
        scores = scoring_engine.calculate_scores(mock_product, nlp_features)
        
        return {
            "scores": scores,
            "nlp_features": nlp_features,
            "advanced_analysis": advanced_analysis
        }
    
    except Exception as e:
        print(f"Score simulation error: {e}")
        raise HTTPException(status_code=500, detail=f"Score simulation failed: {str(e)}")


# ============================================================================
# SYNTHETIC BENCHMARK ENDPOINT
# ============================================================================

@router.get("/benchmark/category")
def benchmark_by_category(category: str = "electronics") -> dict:
    """
    Return synthetic benchmark data for a product category
    
    Shows average AI readiness scores for the category
    """
    # Synthetic data for different categories
    benchmarks = {
        "electronics": {
            "clarity_score": 7.2,
            "trust_score": 6.8,
            "completeness_score": 7.5,
            "structure_score": 7.1,
            "overall_score": 7.15,
            "product_count": 245,
            "category_name": "Electronics"
        },
        "clothing": {
            "clarity_score": 6.9,
            "trust_score": 7.2,
            "completeness_score": 6.8,
            "structure_score": 6.7,
            "overall_score": 6.9,
            "product_count": 312,
            "category_name": "Clothing & Fashion"
        },
        "home-garden": {
            "clarity_score": 7.4,
            "trust_score": 7.1,
            "completeness_score": 7.6,
            "structure_score": 7.3,
            "overall_score": 7.35,
            "product_count": 189,
            "category_name": "Home & Garden"
        },
        "sports": {
            "clarity_score": 7.1,
            "trust_score": 6.9,
            "completeness_score": 7.2,
            "structure_score": 7.0,
            "overall_score": 7.05,
            "product_count": 156,
            "category_name": "Sports & Outdoors"
        },
        "beauty": {
            "clarity_score": 7.5,
            "trust_score": 7.3,
            "completeness_score": 7.4,
            "structure_score": 7.2,
            "overall_score": 7.35,
            "product_count": 203,
            "category_name": "Beauty & Personal Care"
        },
    }
    
    # Get benchmark data for category (default to electronics if not found)
    category_lower = category.lower().replace(" ", "-")
    benchmark = benchmarks.get(category_lower, benchmarks["electronics"])
    
    # Add additional metrics
    benchmark["distribution"] = {
        "excellent": 22,  # % of products > 8.5
        "good": 35,       # 7.5-8.5
        "average": 28,    # 6.5-7.5
        "below_average": 15  # < 6.5
    }
    
    return benchmark
