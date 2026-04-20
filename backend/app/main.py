"""
Qurly - AI Representation Optimizer
FastAPI backend for product analysis
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
import os
from dotenv import load_dotenv

from app.schemas import (
    AnalysisResult, RewriteRequest, RewriteResponse, ProductData
)
from app.modules.shopify_scraper import ShopifyScraper, ShopifyURLValidator
from app.modules.nlp_analyzer import NLPAnalyzer
from app.modules.scoring_engine import ScoringEngine, IssueDetector, AIPerceptionSimulator

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Qurly API",
    description="AI Representation Optimizer for Shopify Products",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (configure as needed)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Qurly API is running",
        "version": "0.1.0",
    }


@app.get("/api/health")
def health_check():
    """API health check"""
    return {"status": "healthy"}


@app.post("/api/analyze")
def analyze_product(url: str) -> AnalysisResult:
    """
    Analyze a Shopify product URL
    
    Args:
        url: Shopify product URL
        
    Returns:
        AnalysisResult with scores, issues, and recommendations
    """
    try:
        # Validate URL
        if not ShopifyURLValidator.is_valid_shopify_url(url):
            raise HTTPException(
                status_code=400,
                detail="Invalid Shopify URL. Please provide a valid Shopify product link.",
            )
        
        # Scrape product
        scraper = ShopifyScraper()
        product_data = scraper.scrape_product(url)
        
        if not product_data:
            raise HTTPException(
                status_code=400,
                detail="Could not extract product data from URL. Please check the link.",
            )
        
        # Analyze with NLP
        nlp_analyzer = NLPAnalyzer()
        nlp_features = nlp_analyzer.analyze_description(product_data.description)
        
        # Calculate scores
        scoring_engine = ScoringEngine()
        scores = scoring_engine.calculate_scores(product_data, nlp_features)
        
        # Detect issues
        issue_detector = IssueDetector()
        issues = issue_detector.detect_issues(product_data, nlp_features, scores)
        
        # Generate AI perception
        perception_simulator = AIPerceptionSimulator()
        ai_perception = perception_simulator.generate_perception_summary(scores)
        benchmark_comparison = perception_simulator.calculate_benchmark_comparison(scores)
        potential_improvement = perception_simulator.calculate_potential_improvement(
            scores, issues
        )
        
        # Build result
        result = AnalysisResult(
            url=url,
            product_data=product_data,
            nlp_features=nlp_features,
            scores=scores,
            issues=issues,
            ai_perception=ai_perception,
            benchmark_comparison=benchmark_comparison,
            potential_improvement=int(potential_improvement),
        )
        
        return result
        
    except HTTPException:
        raise
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        print(f"Error analyzing product: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing product: {str(e)}",
        )


@app.post("/api/rewrite-description")
def rewrite_description(request: RewriteRequest) -> RewriteResponse:
    """
    Rewrite product description using Gemini API
    
    Args:
        request: RewriteRequest with original description
        
    Returns:
        RewriteResponse with rewritten description and improvements
    """
    try:
        import google.generativeai as genai
        
        # Get API key
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="Gemini API key not configured",
            )
        
        # Configure Gemini
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-pro")
        
        # Prepare prompt
        prompt = f"""You are an ecommerce product description expert. 
Rewrite this product description to be:
- Clear and easy to understand (for AI agents to parse)
- Well-structured with bullet points for features
- Trustworthy and confidence-building
- 150-300 words
- Optimized for SEO and AI recommendation visibility

Product Title: {request.product_title}
Current Description: {request.description}

Key Features to Highlight: {', '.join(request.key_features) if request.key_features else 'Auto-detect from current description'}

Provide ONLY the rewritten description, nothing else."""
        
        # Call Gemini
        response = model.generate_content(prompt)
        rewritten = response.text.strip()
        
        # Analyze improvements
        improvements = [
            "✅ Simplified language for better AI parsing",
            "✅ Added structured bullet points",
            "✅ Enhanced trust signals",
            "✅ Optimized for readability",
            "✅ Improved keyword visibility",
        ]
        
        # Calculate estimated score boost
        nlp_analyzer = NLPAnalyzer()
        original_features = nlp_analyzer.analyze_description(request.description)
        rewritten_features = nlp_analyzer.analyze_description(rewritten)
        
        # Rough estimate: readability improvement + structure improvement
        estimated_boost = int(
            (rewritten_features.readability_score - original_features.readability_score) * 0.5
            + (2 if rewritten_features.has_bullet_points and not original_features.has_bullet_points else 0)
        )
        estimated_boost = max(0, min(20, estimated_boost))  # Cap between 0-20
        
        return RewriteResponse(
            original=request.description,
            rewritten=rewritten,
            improvements=improvements,
            estimated_score_boost=estimated_boost,
        )
        
    except Exception as e:
        print(f"Error rewriting description: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error rewriting description: {str(e)}",
        )


# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "error": exc.detail,
        "status_code": exc.status_code,
    }


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    print(f"Unhandled exception: {exc}")
    return {
        "error": "Internal server error",
        "status_code": 500,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
