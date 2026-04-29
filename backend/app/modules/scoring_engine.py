"""
Scoring Engine Module
Calculates product scores and generates insights
"""

from typing import List, Dict, Tuple
from app.schemas import (
    ProductData, NLPFeatures, ScoreBreakdown, Issue, AnalysisResult
)
from app.modules.nlp_analyzer import NLPAnalyzer


class ScoringEngine:
    """Calculate product scores based on multiple factors"""
    
    # Ideal benchmarks
    IDEAL_DESCRIPTION_LENGTH = (150, 300)  # words
    IDEAL_FLESCH_EASE = (60, 70)
    IDEAL_FLESCH_GRADE = (6, 8)
    IDEAL_AVG_PARA_LENGTH = (20, 30)
    
    @staticmethod
    def calculate_clarity_score(nlp_features: NLPFeatures) -> float:
        """
        Calculate clarity score (0-10)
        Based on:
        - Readability (Flesch Ease)
        - Paragraph length
        - Has bullet points
        - Keyword diversity
        """
        score = 0
        
        # Readability (0-4 points)
        flesch_ease = nlp_features.clarity_indicators.get("flesch_ease", 50)
        if 60 <= flesch_ease <= 80:
            score += 4  # Optimal range
        elif 40 <= flesch_ease < 60 or 80 < flesch_ease <= 90:
            score += 3  # Acceptable
        elif 20 <= flesch_ease < 40 or 90 < flesch_ease <= 100:
            score += 2  # Difficult
        else:
            score += 1
        
        # Paragraph length (0-2 points)
        avg_para = nlp_features.clarity_indicators.get("avg_paragraph_length", 0)
        if 20 <= avg_para <= 40:
            score += 2
        elif 15 <= avg_para < 20 or 40 < avg_para <= 60:
            score += 1
        
        # Structure - bullet points (0-2 points)
        if nlp_features.has_bullet_points:
            bullet_ratio = nlp_features.clarity_indicators.get("bullet_ratio", 0)
            if bullet_ratio > 0.3:
                score += 2
            else:
                score += 1
        
        # Keyword diversity (0-2 points)
        diversity = nlp_features.clarity_indicators.get("keyword_diversity", 0)
        if diversity > 0.6:
            score += 2
        elif diversity > 0.5:
            score += 1
        
        # Clamp between 0-10
        return max(0, min(10, round(score, 1)))
    
    @staticmethod
    def calculate_trust_score(
        product_data: ProductData,
        nlp_features: NLPFeatures
    ) -> float:
        """
        Calculate trust score (0-10)
        Based on:
        - Reviews count & rating
        - Trust indicators in description
        - Policies presence (return, shipping, warranty)
        - Sentiment positivity
        """
        score = 0
        
        # Reviews (0-3 points)
        if product_data.review_count > 50:
            score += 3
        elif product_data.review_count > 20:
            score += 2
        elif product_data.review_count > 5:
            score += 1
        
        # Average rating (0-2 points)
        if product_data.average_rating and product_data.average_rating >= 4.5:
            score += 2
        elif product_data.average_rating and product_data.average_rating >= 4.0:
            score += 1
        
        # Policies (0-3 points)
        policies_count = sum([
            product_data.has_return_policy,
            product_data.has_shipping_policy,
            product_data.has_warranty,
        ])
        score += min(3, policies_count)
        
        # Trust indicators in text (0-2 points)
        trust_indicators = nlp_features.clarity_indicators.get("trust_indicators", {})
        trust_count = sum(1 for v in trust_indicators.values() if v)
        if trust_count >= 3:
            score += 2
        elif trust_count >= 1:
            score += 1
        
        # Clamp between 0-10
        return max(0, min(10, round(score, 1)))
    
    @staticmethod
    def calculate_completeness_score(
        product_data: ProductData,
        nlp_features: NLPFeatures
    ) -> float:
        """
        Calculate completeness score (0-10)
        Based on:
        - Description length
        - Image count
        - FAQs presence
        - Policies presence
        """
        score = 0
        
        # Description length (0-3 points)
        desc_len = nlp_features.description_length
        if 150 <= desc_len <= 500:
            score += 3
        elif 100 <= desc_len < 150 or 500 < desc_len <= 800:
            score += 2
        elif desc_len >= 50:
            score += 1
        
        # Images (0-2 points)
        if product_data.image_count >= 5:
            score += 2
        elif product_data.image_count >= 3:
            score += 1
        
        # FAQs (0-2 points)
        if product_data.has_faq:
            score += 2
        
        # Policies (0-3 points)
        policies_count = sum([
            product_data.has_return_policy,
            product_data.has_shipping_policy,
            product_data.has_warranty,
        ])
        score += min(3, policies_count)
        
        # Clamp between 0-10
        return max(0, min(10, round(score, 1)))
    
    @staticmethod
    def calculate_structure_score(nlp_features: NLPFeatures) -> float:
        """
        Calculate structure score (0-10)
        Based on:
        - Has bullet points
        - Paragraph length consistency
        - Grade level appropriateness
        """
        score = 0
        
        # Bullet points (0-5 points)
        if nlp_features.has_bullet_points:
            bullet_ratio = nlp_features.clarity_indicators.get("bullet_ratio", 0)
            score += min(5, int(bullet_ratio * 10))
        
        # Paragraph length (0-3 points)
        avg_para = nlp_features.clarity_indicators.get("avg_paragraph_length", 0)
        if 15 <= avg_para <= 40:
            score += 3
        elif 10 <= avg_para < 15 or 40 < avg_para <= 60:
            score += 2
        elif avg_para > 0:
            score += 1
        
        # Grade level (0-2 points)
        grade = nlp_features.clarity_indicators.get("flesch_grade", 10)
        if 6 <= grade <= 8:
            score += 2
        elif 5 <= grade < 6 or 8 < grade <= 10:
            score += 1
        
        # Clamp between 0-10
        return max(0, min(10, round(score, 1)))
    
    @staticmethod
    def calculate_scores(
        product_data: ProductData,
        nlp_features: NLPFeatures
    ) -> ScoreBreakdown:
        """
        Calculate all scores and return breakdown
        """
        clarity = ScoringEngine.calculate_clarity_score(nlp_features)
        trust = ScoringEngine.calculate_trust_score(product_data, nlp_features)
        completeness = ScoringEngine.calculate_completeness_score(product_data, nlp_features)
        structure = ScoringEngine.calculate_structure_score(nlp_features)
        
        # Weighted average (0-100)
        overall = (
            clarity * 0.25 +
            trust * 0.25 +
            completeness * 0.30 +
            structure * 0.20
        ) * 10
        
        return ScoreBreakdown(
            clarity=clarity,
            trust=trust,
            completeness=completeness,
            structure=structure,
            overall=round(overall, 1),
        )


class IssueDetector:
    """Detect and prioritize issues"""
    
    @staticmethod
    def detect_issues(
        product_data: ProductData,
        nlp_features: NLPFeatures,
        scores: ScoreBreakdown
    ) -> List[Issue]:
        """
        Detect all issues and return ranked by impact
        """
        issues = []
        
        # Low trust score issues
        if scores.trust < 5:
            if product_data.review_count < 5:
                issues.append(Issue(
                    priority="HIGH",
                    title="Missing Customer Reviews",
                    description="Your product has very few or no reviews. AI agents rely heavily on social proof.",
                    suggestion="Encourage customers to leave reviews. Consider running a review campaign.",
                    impact="Could boost trust score by 2-3 points",
                ))
            
            if not product_data.has_return_policy:
                issues.append(Issue(
                    priority="HIGH",
                    title="Missing Return Policy",
                    description="No clear return policy detected. This reduces customer confidence.",
                    suggestion="Add a clear, detailed return policy to your product page.",
                    impact="Could boost trust score by 1-2 points",
                ))
        
        # Low clarity issues
        if scores.clarity < 5:
            flesch_ease = nlp_features.clarity_indicators.get("flesch_ease", 50)
            if flesch_ease < 40:
                issues.append(Issue(
                    priority="HIGH",
                    title="Description Too Complex",
                    description="Your description uses complex language that's hard to parse.",
                    suggestion="Simplify language. Use short sentences and common words.",
                    impact="Could boost clarity score by 2-3 points",
                ))
            
            if not nlp_features.has_bullet_points:
                issues.append(Issue(
                    priority="MEDIUM",
                    title="Missing Bullet Points",
                    description="Your description is a wall of text. Structured info is easier for AI to parse.",
                    suggestion="Break down features/specs using bullet points.",
                    impact="Could boost clarity score by 1-2 points",
                ))
        
        # Low completeness issues
        if scores.completeness < 6:
            if nlp_features.description_length < 100:
                issues.append(Issue(
                    priority="HIGH",
                    title="Description Too Short",
                    description="Your description lacks detail. AI needs more info to understand your product.",
                    suggestion="Expand to 150-300 words. Include specs, benefits, use cases.",
                    impact="Could boost completeness score by 2-3 points",
                ))
            
            if product_data.image_count < 3:
                issues.append(Issue(
                    priority="MEDIUM",
                    title="Insufficient Product Images",
                    description=f"Only {product_data.image_count} images detected. More visuals help AI representation.",
                    suggestion="Add 5+ high-quality product images from different angles.",
                    impact="Could boost completeness score by 1-2 points",
                ))
            
            if not product_data.has_faq:
                issues.append(Issue(
                    priority="MEDIUM",
                    title="No FAQ Section",
                    description="Missing FAQ section. This creates ambiguity about common questions.",
                    suggestion="Add 3-5 FAQs about features, compatibility, shipping, etc.",
                    impact="Could boost completeness score by 1-2 points",
                ))
        
        # Low structure issues
        if scores.structure < 5:
            avg_para = nlp_features.clarity_indicators.get("avg_paragraph_length", 100)
            if avg_para > 60:
                issues.append(Issue(
                    priority="MEDIUM",
                    title="Long Paragraphs",
                    description="Paragraphs are too long (avg 60+ words). Harder for AI to parse.",
                    suggestion="Break into shorter paragraphs (20-30 words). Use bullet points.",
                    impact="Could boost structure score by 1-2 points",
                ))
        
        # Weak sentiment
        sentiment = nlp_features.clarity_indicators.get("sentiment", 0)
        if sentiment < 0:
            issues.append(Issue(
                priority="LOW",
                title="Negative Sentiment",
                description="Your description has negative or neutral tone.",
                suggestion="Use positive, confidence-building language.",
                impact="Could improve perceived trust by 0-1 points",
            ))
        
        # Sort by priority (HIGH > MEDIUM > LOW)
        priority_order = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
        issues.sort(key=lambda x: priority_order.get(x.priority, 3))
        
        return issues[:5]  # Return top 5 issues


class AIPerceptionSimulator:
    """Simulate how AI agents perceive the product"""
    
    @staticmethod
    def generate_perception_summary(scores: ScoreBreakdown) -> str:
        """
        Generate human-readable AI perception based on scores
        """
        overall = scores.overall
        clarity = scores.clarity
        trust = scores.trust
        completeness = scores.completeness
        
        if overall >= 75:
            perception = "✅ Strong & Trustworthy"
            reasoning = "Clear, complete, and well-structured. AI will recommend confidently."
        elif overall >= 60:
            perception = "⚠️ Moderate - Room for Improvement"
            reasoning = "Generally clear but has some gaps. AI may hesitate to recommend."
        elif overall >= 45:
            perception = "❌ Weak - Multiple Issues"
            reasoning = "Vague, incomplete, or confusing. AI will likely skip recommending."
        else:
            perception = "❌ Very Poor - Major Gaps"
            reasoning = "Too ambiguous and incomplete. AI sees this as high-risk."
        
        return f"{perception}\n\n{reasoning}"
    
    @staticmethod
    def calculate_benchmark_comparison(scores: ScoreBreakdown) -> Dict:
        """
        Compare against ideal benchmark (10/10 for all metrics)
        """
        ideal_scores = 10
        
        return {
            "clarity": {
                "current": scores.clarity,
                "ideal": ideal_scores,
                "gap": round(ideal_scores - scores.clarity, 1),
            },
            "trust": {
                "current": scores.trust,
                "ideal": ideal_scores,
                "gap": round(ideal_scores - scores.trust, 1),
            },
            "completeness": {
                "current": scores.completeness,
                "ideal": ideal_scores,
                "gap": round(ideal_scores - scores.completeness, 1),
            },
            "structure": {
                "current": scores.structure,
                "ideal": ideal_scores,
                "gap": round(ideal_scores - scores.structure, 1),
            },
            "overall": {
                "current": scores.overall,
                "ideal": 100,
                "gap": round(100 - scores.overall, 1),
            },
        }
    
    @staticmethod
    def calculate_potential_improvement(
        scores: ScoreBreakdown,
        issues: List[Issue]
    ) -> int:
        """
        Calculate potential score if top issues are fixed
        Assumes each HIGH priority issue can improve score by 3-5 points
        """
        high_priority_issues = [i for i in issues if i.priority == "HIGH"]
        medium_priority_issues = [i for i in issues if i.priority == "MEDIUM"]
        
        improvement = (
            len(high_priority_issues) * 4 +
            len(medium_priority_issues) * 2
        )
        
        potential_score = min(95, scores.overall + improvement)
        return round(potential_score - scores.overall, 1)
