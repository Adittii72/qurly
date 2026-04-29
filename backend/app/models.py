"""
SQLAlchemy ORM models for Qurly application
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    """User model for authentication and profile"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String, nullable=True)  # For email/password auth
    google_id = Column(String, unique=True, index=True, nullable=True)
    profile_picture = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(email='{self.email}', username='{self.username}')>"


class Report(Base):
    """Analysis report model for tracking historical analyses"""
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    
    # Product info
    product_url = Column(String, index=True)
    product_title = Column(String)
    product_description = Column(Text)
    product_price = Column(Float, nullable=True)
    
    # Scores and analysis
    overall_score = Column(Float)
    clarity_score = Column(Float)
    trust_score = Column(Float)
    completeness_score = Column(Float)
    structure_score = Column(Float)
    
    # Detailed analysis
    nlp_features = Column(JSON)  # Stores readability, sentiment, keyword analysis
    issues = Column(JSON)  # Stores detected issues
    confidence_scores = Column(JSON)  # Stores confidence breakdown
    benchmark_comparison = Column(JSON)  # Stores comparison to ideal
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    tags = Column(String, nullable=True)  # Comma-separated tags for organization
    is_favorite = Column(Boolean, default=False)
    
    # Relationship
    user = relationship("User", back_populates="reports")
    
    def __repr__(self):
        return f"<Report(id={self.id}, product='{self.product_title}', score={self.overall_score})>"


class RecommendationHistory(Base):
    """Track recommendation actions taken on reports"""
    __tablename__ = "recommendation_history"
    
    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), index=True)
    
    # Recommendation type: rewrite_description, generate_bullets, improve_title, etc.
    action_type = Column(String)
    
    # Original and optimized content
    original_content = Column(Text)
    optimized_content = Column(Text, nullable=True)
    
    # Impact estimate
    estimated_score_improvement = Column(Float, nullable=True)
    
    # Status: pending, approved, rejected, applied
    status = Column(String, default="pending")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<RecommendationHistory(report={self.report_id}, action='{self.action_type}')>"


class ComparisonReport(Base):
    """Store multi-product comparison results"""
    __tablename__ = "comparison_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    
    # Product URLs being compared
    product_url_1 = Column(String)
    product_url_2 = Column(String)
    
    # Scores for each product
    product_1_score = Column(Float)
    product_2_score = Column(Float)
    
    # Analysis data
    comparison_data = Column(JSON)  # Stores detailed comparison metrics
    winner = Column(String, nullable=True)  # Which product scores higher
    insights = Column(JSON)  # Key differences and insights
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User")
    
    def __repr__(self):
        return f"<ComparisonReport(id={self.id}, winner='{self.winner}')>"
