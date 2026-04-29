"""
Gemini AI Integration for Enhanced Product Insights
Uses Google's Gemini API to provide AI-powered recommendations
"""

import google.generativeai as genai
from typing import Dict, Any, Optional
import time
import os
from app.config import settings


class GeminiInsights:
    """Generate enhanced insights using Google's Gemini API"""
    
    def __init__(self):
        """Initialize Gemini API client"""
        self.api_key = settings.gemini_api_key
        self.max_retries = settings.gemini_max_retries
        self.timeout = settings.gemini_timeout
        self.model_name = settings.ai_model_name  # gemini-1.5-flash
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            # Use gemini-1.5-flash instead of deprecated gemini-pro
            self.model = genai.GenerativeModel(self.model_name)
        else:
            self.model = None
    
    def is_available(self) -> bool:
        """Check if Gemini API is configured"""
        return self.model is not None
    
    def _call_with_retry(self, prompt: str, max_retries: Optional[int] = None) -> Optional[str]:
        """
        Call Gemini API with exponential backoff retry logic
        
        Args:
            prompt: The prompt to send to Gemini
            max_retries: Maximum number of retries (uses default if None)
            
        Returns:
            Generated content or None if all retries fail
        """
        if not self.is_available():
            return None
        
        retries = max_retries or self.max_retries
        backoff_base = 2  # Exponential backoff: 1s, 2s, 4s, 8s...
        
        for attempt in range(retries):
            try:
                response = self.model.generate_content(
                    prompt,
                    request_options={"timeout": self.timeout}
                )
                if response and response.text:
                    return response.text
                return None
            except Exception as e:
                is_last_attempt = attempt == retries - 1
                
                if is_last_attempt:
                    print(f"Gemini API error (final attempt {attempt + 1}/{retries}): {e}")
                    return None
                
                # Calculate backoff time
                wait_time = backoff_base ** attempt
                print(f"Gemini API error (attempt {attempt + 1}/{retries}): {e}. Retrying in {wait_time}s...")
                time.sleep(wait_time)
        
        return None
    
    def generate_optimization_suggestions(self, product_data: Dict[str, Any], issues: list, scores: Dict) -> str:
        """Generate AI-powered optimization suggestions"""
        if not self.is_available():
            return "Gemini API not configured. Please add GEMINI_API_KEY to .env"
        
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
        
        result = self._call_with_retry(prompt)
        return result or "Unable to generate suggestions"
    
    def generate_description_rewrite(self, original_description: str, title: str, issues: list) -> str:
        """Generate an AI-optimized product description"""
        if not self.is_available():
            return original_description
        
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
        
        result = self._call_with_retry(prompt)
        return result or original_description
    
    def analyze_ai_perception(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze how AI agents would perceive this product"""
        if not self.is_available():
            return {"perception": "API not available", "confidence": 0}
        
        prompt = f"""
As an AI shopping agent, how would you perceive and evaluate this product for recommendation to customers?

**Title:** {product_data.get('title', 'N/A')}
**Description:** {product_data.get('description', 'N/A')[:500]}
**Price:** {product_data.get('price', 'N/A')}

Provide insights on:
1. Perception score (0-100)
2. 3 key strengths for AI recommendation
3. 3 key weaknesses
4. Recommendation likelihood
5. Missing important attributes
"""
        
        result = self._call_with_retry(prompt)
        
        return {
            "ai_perception": result or "Unable to analyze perception",
            "source": "gemini",
            "model": self.model_name,
            "available": bool(result)
        }
    
    def generate_competitor_comparison(self, product_title: str, category: str) -> str:
        """Generate insights on how product compares to competitors for AI agents"""
        if not self.is_available():
            return "API not available"
        
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
        
        result = self._call_with_retry(prompt)
        return result or "Unable to generate comparison"


# Global instance
_gemini_instance = None


def get_gemini_insights() -> GeminiInsights:
    """Get or create Gemini insights instance"""
    global _gemini_instance
    if _gemini_instance is None:
        _gemini_instance = GeminiInsights()
    return _gemini_instance
