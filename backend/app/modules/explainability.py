"""
Explainable confidence scoring system
Shows WHY scores are high/low with detailed explanations
"""
from typing import Dict, List, Tuple


class ConfidenceExplainer:
    """Generate explainable confidence scores with reasons"""
    
    def __init__(self, scores: dict, nlp_data: dict, product_data: dict):
        self.scores = scores
        self.nlp_data = nlp_data
        self.product_data = product_data
    
    def explain_clarity_score(self) -> Dict:
        """Explain why clarity score is what it is"""
        clarity_score = self.scores.get("clarity", 5)
        factors = []
        confidence = 0.7
        
        # Check readability
        readability = self.nlp_data.get("readability", {})
        fre = readability.get("flesch_reading_ease", 50)
        
        if fre >= 70:
            factors.append({"factor": "✓ Excellent readability", "impact": 25, "status": "positive"})
        elif fre >= 50:
            factors.append({"factor": "~ Good readability", "impact": 15, "status": "neutral"})
        else:
            factors.append({"factor": "✗ Poor readability", "impact": -15, "status": "negative"})
        
        # Check paragraph structure
        description = self.product_data.get("description", "")
        paragraphs = [p for p in description.split('\n') if p.strip()]
        bullet_points = description.count('•') + description.count('-')
        
        if len(paragraphs) > 3 and bullet_points > 0:
            factors.append({"factor": "✓ Well-structured with bullets", "impact": 20, "status": "positive"})
        elif len(paragraphs) > 2:
            factors.append({"factor": "~ Structured in sections", "impact": 10, "status": "neutral"})
        else:
            factors.append({"factor": "✗ Poor structure, one large block", "impact": -10, "status": "negative"})
        
        # Check keyword diversity
        keywords = self.nlp_data.get("keywords", {})
        keyword_diversity = keywords.get("keyword_diversity", 0)
        
        if keyword_diversity > 20:
            factors.append({"factor": "✓ High keyword diversity", "impact": 15, "status": "positive"})
        elif keyword_diversity > 10:
            factors.append({"factor": "~ Moderate keyword diversity", "impact": 5, "status": "neutral"})
        else:
            factors.append({"factor": "✗ Low keyword diversity", "impact": -10, "status": "negative"})
        
        reasons = self._generate_recommendations("clarity", clarity_score, factors)
        
        return {
            "score": clarity_score,
            "confidence": min(confidence, 0.95),
            "label": self._get_label(clarity_score),
            "factors": factors,
            "key_reasons": reasons["reasons"],
            "recommendations": reasons["recommendations"]
        }
    
    def explain_trust_score(self) -> Dict:
        """Explain why trust score is what it is"""
        trust_score = self.scores.get("trust", 5)
        factors = []
        
        # Check review count
        review_count = self.product_data.get("review_count", 0)
        
        if review_count > 100:
            factors.append({"factor": "✓ Abundant customer reviews", "impact": 25, "status": "positive"})
        elif review_count > 20:
            factors.append({"factor": "~ Moderate reviews", "impact": 10, "status": "neutral"})
        else:
            factors.append({"factor": "✗ Few or no reviews", "impact": -15, "status": "negative"})
        
        # Check for trust indicators in description
        description = self.product_data.get("description", "").lower()
        trust_indicators = ["guarantee", "certified", "warranty", "money-back", "expert", "trust"]
        found_indicators = sum(1 for ind in trust_indicators if ind in description)
        
        if found_indicators >= 3:
            factors.append({"factor": "✓ Multiple trust indicators", "impact": 20, "status": "positive"})
        elif found_indicators >= 1:
            factors.append({"factor": "~ Some trust indicators present", "impact": 10, "status": "neutral"})
        else:
            factors.append({"factor": "✗ No trust indicators detected", "impact": -15, "status": "negative"})
        
        # Check sentiment
        sentiment = self.nlp_data.get("sentiment", {})
        polarity = sentiment.get("polarity", 0)
        
        if polarity > 0.5:
            factors.append({"factor": "✓ Positive sentiment detected", "impact": 15, "status": "positive"})
        elif polarity < -0.1:
            factors.append({"factor": "✗ Negative sentiment detected", "impact": -15, "status": "negative"})
        else:
            factors.append({"factor": "~ Neutral sentiment", "impact": 0, "status": "neutral"})
        
        # Check spam score
        spam = self.nlp_data.get("spam_detection", {})
        spam_score = spam.get("spam_score", 50)
        
        if spam_score < 20:
            factors.append({"factor": "✓ Clean language, minimal spam", "impact": 15, "status": "positive"})
        elif spam_score < 50:
            factors.append({"factor": "~ Moderate promotional language", "impact": 5, "status": "neutral"})
        else:
            factors.append({"factor": "✗ High spam language detected", "impact": -20, "status": "negative"})
        
        reasons = self._generate_recommendations("trust", trust_score, factors)
        
        return {
            "score": trust_score,
            "confidence": 0.8,
            "label": self._get_label(trust_score),
            "factors": factors,
            "key_reasons": reasons["reasons"],
            "recommendations": reasons["recommendations"]
        }
    
    def explain_completeness_score(self) -> Dict:
        """Explain why completeness score is what it is"""
        completeness_score = self.scores.get("completeness", 5)
        factors = []
        
        # Check description length
        description = self.product_data.get("description", "")
        desc_length = len(description)
        
        if desc_length > 500:
            factors.append({"factor": "✓ Comprehensive description", "impact": 20, "status": "positive"})
        elif desc_length > 200:
            factors.append({"factor": "~ Adequate description", "impact": 10, "status": "neutral"})
        else:
            factors.append({"factor": "✗ Too short description", "impact": -15, "status": "negative"})
        
        # Check image count
        image_count = self.product_data.get("image_count", 0)
        
        if image_count > 5:
            factors.append({"factor": "✓ Many product images", "impact": 20, "status": "positive"})
        elif image_count > 2:
            factors.append({"factor": "~ Adequate images", "impact": 10, "status": "neutral"})
        else:
            factors.append({"factor": "✗ Too few images", "impact": -15, "status": "negative"})
        
        # Check for specifications
        spec_keywords = ["specifications", "dimensions", "weight", "material", "color", "size"]
        spec_count = sum(1 for kw in spec_keywords if kw in description.lower())
        
        if spec_count >= 4:
            factors.append({"factor": "✓ Detailed specifications", "impact": 20, "status": "positive"})
        elif spec_count >= 2:
            factors.append({"factor": "~ Some specifications", "impact": 10, "status": "neutral"})
        else:
            factors.append({"factor": "✗ Missing specifications", "impact": -15, "status": "negative"})
        
        reasons = self._generate_recommendations("completeness", completeness_score, factors)
        
        return {
            "score": completeness_score,
            "confidence": 0.85,
            "label": self._get_label(completeness_score),
            "factors": factors,
            "key_reasons": reasons["reasons"],
            "recommendations": reasons["recommendations"]
        }
    
    def explain_structure_score(self) -> Dict:
        """Explain why structure score is what it is"""
        structure_score = self.scores.get("structure", 5)
        factors = []
        
        description = self.product_data.get("description", "")
        
        # Check bullet points
        bullet_count = description.count('•') + description.count('-')
        
        if bullet_count > 5:
            factors.append({"factor": "✓ Excellent bullet point usage", "impact": 25, "status": "positive"})
        elif bullet_count > 2:
            factors.append({"factor": "~ Good bullet points", "impact": 15, "status": "neutral"})
        else:
            factors.append({"factor": "✗ Insufficient bullet points", "impact": -15, "status": "negative"})
        
        # Check paragraph breaks
        paragraphs = [p for p in description.split('\n\n') if p.strip()]
        
        if len(paragraphs) > 4:
            factors.append({"factor": "✓ Well-organized paragraphs", "impact": 20, "status": "positive"})
        elif len(paragraphs) > 2:
            factors.append({"factor": "~ Decent paragraph structure", "impact": 10, "status": "neutral"})
        else:
            factors.append({"factor": "✗ Poor paragraph structure", "impact": -15, "status": "negative"})
        
        # Check readability grade
        readability = self.nlp_data.get("readability", {})
        grade = readability.get("flesch_kincaid_grade", 10)
        
        if grade < 8:
            factors.append({"factor": "✓ Simple language structure", "impact": 15, "status": "positive"})
        elif grade < 12:
            factors.append({"factor": "~ Average complexity", "impact": 8, "status": "neutral"})
        else:
            factors.append({"factor": "✗ Too complex", "impact": -10, "status": "negative"})
        
        reasons = self._generate_recommendations("structure", structure_score, factors)
        
        return {
            "score": structure_score,
            "confidence": 0.8,
            "label": self._get_label(structure_score),
            "factors": factors,
            "key_reasons": reasons["reasons"],
            "recommendations": reasons["recommendations"]
        }
    
    def _generate_recommendations(self, category: str, score: float, factors: List) -> Dict:
        """Generate specific recommendations based on factors"""
        positive_factors = [f for f in factors if f["status"] == "positive"]
        negative_factors = [f for f in factors if f["status"] == "negative"]
        
        reasons = [f["factor"] for f in positive_factors[:2]]
        
        recommendations = []
        for factor in negative_factors:
            if "readability" in factor["factor"].lower():
                recommendations.append("Simplify sentences and use shorter words")
            elif "structure" in factor["factor"].lower():
                recommendations.append("Add more bullet points to break up text")
            elif "reviews" in factor["factor"].lower():
                recommendations.append("Build more customer reviews and testimonials")
            elif "trust" in factor["factor"].lower():
                recommendations.append("Add guarantee, warranty, or certification mentions")
            elif "images" in factor["factor"].lower():
                recommendations.append("Add more high-quality product images")
            elif "specifications" in factor["factor"].lower():
                recommendations.append("Include detailed product specifications")
        
        return {
            "reasons": reasons,
            "recommendations": recommendations[:3]  # Top 3 recommendations
        }
    
    def _get_label(self, score: float) -> str:
        """Get label for score"""
        if score >= 8:
            return "Excellent"
        elif score >= 6:
            return "Good"
        elif score >= 4:
            return "Fair"
        else:
            return "Needs Improvement"
    
    def get_full_explanation(self) -> Dict:
        """Get complete explanation for all scores"""
        return {
            "clarity": self.explain_clarity_score(),
            "trust": self.explain_trust_score(),
            "completeness": self.explain_completeness_score(),
            "structure": self.explain_structure_score(),
            "overall_confidence": round(
                (0.7 + 0.8 + 0.85 + 0.8) / 4, 2
            )
        }
