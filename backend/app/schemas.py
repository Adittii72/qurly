from pydantic import BaseModel
from typing import Optional, List


class ProductData(BaseModel):
    """Extracted product data from Shopify"""
    title: str
    description: str
    price: Optional[float] = None
    currency: Optional[str] = None
    review_count: int = 0
    average_rating: Optional[float] = None
    image_count: int = 0
    has_faq: bool = False
    has_return_policy: bool = False
    has_shipping_policy: bool = False
    has_warranty: bool = False


class NLPFeatures(BaseModel):
    """NLP analysis results"""
    readability_score: float
    sentiment_score: float
    description_length: int
    keyword_count: int
    has_bullet_points: bool
    clarity_indicators: dict


class ScoreBreakdown(BaseModel):
    """Score component breakdown"""
    clarity: float
    trust: float
    completeness: float
    structure: float
    overall: float


class Issue(BaseModel):
    """Issue item"""
    priority: str  # HIGH, MEDIUM, LOW
    title: str
    description: str
    suggestion: str
    impact: str  # potential score improvement


class AnalysisResult(BaseModel):
    """Complete analysis result"""
    url: str
    product_data: ProductData
    nlp_features: NLPFeatures
    scores: ScoreBreakdown
    issues: List[Issue]
    ai_perception: str  # Human-readable AI perception summary
    benchmark_comparison: dict
    potential_improvement: int  # Projected score after fixes


class RewriteRequest(BaseModel):
    """Request to rewrite description"""
    description: str
    product_title: str
    key_features: Optional[List[str]] = None


class RewriteResponse(BaseModel):
    """Rewritten description response"""
    original: str
    rewritten: str
    improvements: List[str]
    estimated_score_boost: int
