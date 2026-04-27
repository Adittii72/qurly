"""
Gemini AI Integration for Enhanced Product Insights
Uses Google's Gemini API to provide AI-powered recommendations
"""

import google.generativeai as genai
from typing import Dict, Any, Optional
import os
from app.config import settings


class GeminiInsights:
    """Generate enhanced insights using Google's Gemini API"""
    
    def __init__(self):
        """Initialize Gemini API client"""
        self.api_key = settings.gemini_api_key
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
    
    def is_available(self) -> bool:
        """Check if Gemini API is configured"""
        return self.model is not None
    
    def generate_optimization_suggestions(self, product_data: Dict[str, Any], issues: list, scores: Dict) -> str:
        """Generate AI-powered optimization suggestions"""
        if not self.is_available():
            return "Gemini API not configured. Please add GEMINI_API_KEY to .env"
        
        try:
            prompt = f"""
Analyze this Shopify product and provide specific, actionable optimization suggestions for AI shopping agents.

**Product Title:** {product_data.get('title', 'N/A')}

**Product Description:** {product_data.get('description', 'N/A')[:500]}...

**Current Performance Scores:**
- Overall Score: {scores.get('overall_score', 0):.1f}/10
- Clarity Score: {scores.get('clarity_score', 0):.1f}/10
- Trust Score: {scores.get('trust_score', 0):.1f}/10
- Completeness Score: {scores.get('completeness_score', 0):.1f}/10

**Detected Issues:** {', '.join([issue.get('title', 'Unknown') for issue in issues[:5]])}

Please provide:
1. Top 3 specific improvements to make the product more appealing to AI agents
2. Keywords or phrases that should be added
3. Content that should be removed or modified
4. Price/availability details that matter to AI agents
5. Estimated impact of each suggestion

Keep suggestions practical and implementable.
"""
            
            response = self.model.generate_content(prompt)
            return response.text if response else "Unable to generate suggestions"
        except Exception as e:
            return f"Error generating suggestions: {str(e)}"
    
    def generate_description_rewrite(self, original_description: str, title: str, issues: list) -> str:
        """Generate an AI-optimized product description"""
        if not self.is_available():
            return original_description
        
        try:
            prompt = f"""
Rewrite this Shopify product description to be optimized for AI shopping agents while remaining human-readable.

**Original Title:** {title}

**Original Description:** {original_description[:800]}

**Issues to fix:** {', '.join([issue.get('title', 'Unknown') for issue in issues[:5]])}

Requirements:
- Keep it factual and honest
- Include specific product attributes (size, material, color, etc.)
- Add relevant keywords naturally
- Make it scannable with clear structure
- Ensure it works well for both humans and AI agents
- Maintain a professional tone
- Keep it under 300 words

Provide only the rewritten description, no explanations.
"""
            
            response = self.model.generate_content(prompt)
            return response.text if response else original_description
        except Exception as e:
            return original_description
    
    def analyze_ai_perception(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze how AI agents would perceive this product"""
        if not self.is_available():
            return {"perception": "API not available", "confidence": 0}
        
        try:
            prompt = f"""
As an AI shopping agent, how would you perceive and evaluate this product for recommendation to customers?

**Title:** {product_data.get('title', 'N/A')}
**Description:** {product_data.get('description', 'N/A')[:500]}
**Price:** {product_data.get('price', 'N/A')}

Provide a JSON response with:
1. "perception_score": 0-100 rating
2. "key_strengths": list of 3 strengths for AI recommendation
3. "key_weaknesses": list of 3 weaknesses
4. "recommendation_likelihood": how likely AI agents would recommend it
5. "missing_attributes": important product info that's missing
"""
            
            response = self.model.generate_content(prompt)
            text = response.text if response else "{}"
            
            # Parse response (simple extraction)
            return {
                "ai_perception": text,
                "source": "gemini",
                "available": True
            }
        except Exception as e:
            return {
                "ai_perception": f"Error analyzing perception: {str(e)}",
                "source": "gemini",
                "available": False
            }
    
    def generate_competitor_comparison(self, product_title: str, category: str) -> str:
        """Generate insights on how product compares to competitors for AI agents"""
        if not self.is_available():
            return "API not available"
        
        try:
            prompt = f"""
For an AI shopping agent evaluating {category} products, how does this product stand out or fall behind competitors?

**Product Name:** {product_title}
**Category:** {category}

Consider:
- Feature completeness vs competitors
- Price positioning
- Unique selling points for AI agents
- Missing features that competitors have
- Opportunities to differentiate

Provide brief, actionable insights.
"""
            
            response = self.model.generate_content(prompt)
            return response.text if response else "Unable to generate comparison"
        except Exception as e:
            return f"Error: {str(e)}"


# Global instance
_gemini_instance = None


def get_gemini_insights() -> GeminiInsights:
    """Get or create Gemini insights instance"""
    global _gemini_instance
    if _gemini_instance is None:
        _gemini_instance = GeminiInsights()
    return _gemini_instance
