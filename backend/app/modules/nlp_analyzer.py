"""
NLP Analysis Module
Analyzes product descriptions using NLP techniques
"""

from textblob import TextBlob
import re
import math
from typing import Dict, Tuple
from app.schemas import NLPFeatures


class ReadabilityAnalyzer:
    """Calculate readability metrics"""
    
    @staticmethod
    def flesch_kincaid_grade(text: str) -> float:
        """
        Calculate Flesch-Kincaid Grade Level
        Lower is better (easier to read)
        Optimal: 6-8 (high school level)
        """
        sentences = text.split(".")
        sentences = [s for s in sentences if s.strip()]
        
        words = text.split()
        
        if not sentences or not words:
            return 0.0
        
        syllables = sum(ReadabilityAnalyzer._count_syllables(word) for word in words)
        
        grade = (0.39 * len(words) / len(sentences)) + (11.8 * syllables / len(words)) - 15.59
        return max(0, round(grade, 1))
    
    @staticmethod
    def _count_syllables(word: str) -> int:
        """Estimate syllable count for a word"""
        word = word.lower()
        count = 0
        vowels = "aeiouy"
        previous_was_vowel = False
        
        for char in word:
            is_vowel = char in vowels
            if is_vowel and not previous_was_vowel:
                count += 1
            previous_was_vowel = is_vowel
        
        # Adjust for silent e
        if word.endswith("e"):
            count -= 1
        
        # Minimum syllables
        if count == 0:
            count = 1
        
        return count
    
    @staticmethod
    def flesch_reading_ease(text: str) -> float:
        """
        Flesch Reading Ease Score (0-100)
        90-100: Very Easy (5th grade)
        80-90: Easy (6th grade)
        70-80: Fairly Easy (7th grade)
        60-70: Standard (8th-9th grade) ← GOOD for product descriptions
        50-60: Fairly Difficult (10-12th grade)
        30-50: Difficult (College)
        0-30: Very Difficult (College graduate)
        """
        sentences = text.split(".")
        sentences = [s for s in sentences if s.strip()]
        
        words = text.split()
        
        if not sentences or not words:
            return 0.0
        
        syllables = sum(ReadabilityAnalyzer._count_syllables(word) for word in words)
        
        score = 206.835 - 1.015 * (len(words) / len(sentences)) - 84.6 * (syllables / len(words))
        return max(0, min(100, round(score, 1)))


class SentimentAnalyzer:
    """Analyze sentiment and trust indicators"""
    
    @staticmethod
    def analyze_sentiment(text: str) -> float:
        """
        Analyze sentiment polarity (-1.0 to 1.0)
        -1: Very negative
        0: Neutral
        1: Very positive
        
        For product descriptions, we want 0.3-0.7 (positive but not over-the-top)
        """
        blob = TextBlob(text)
        return round(blob.sentiment.polarity, 2)
    
    @staticmethod
    def analyze_subjectivity(text: str) -> float:
        """
        Analyze subjectivity (0.0 to 1.0)
        0: Very objective
        1: Very subjective
        
        Product descriptions should be ~0.4-0.6 (balanced)
        """
        blob = TextBlob(text)
        return round(blob.sentiment.subjectivity, 2)
    
    @staticmethod
    def detect_trust_indicators(text: str) -> Dict[str, bool]:
        """Detect trust-building language"""
        text_lower = text.lower()
        
        return {
            "has_guarantee": bool(re.search(r"\bguarantee|warranty|promise\b", text_lower)),
            "has_certifications": bool(re.search(r"\bcertified|fda|iso|tested\b", text_lower)),
            "has_money_back": bool(re.search(r"\bmoney.?back|refund|satisfaction\b", text_lower)),
            "has_free_shipping": bool(re.search(r"\bfree\s+shipping|free\s+delivery\b", text_lower)),
            "has_expert_claim": bool(re.search(r"\bexpert|professional|doctor|scientist\b", text_lower)),
            "has_urgency": bool(re.search(r"\blimited|exclusive|only\s+\d+|hurry|urgent\b", text_lower)),
        }


class KeywordAnalyzer:
    """Analyze keyword density and relevance"""
    
    @staticmethod
    def extract_keywords(text: str, top_n: int = 10) -> list:
        """
        Extract top keywords from text
        Removes common stop words
        """
        stop_words = {
            "the", "a", "an", "and", "or", "but", "is", "are", "was", "were",
            "be", "been", "being", "have", "has", "had", "do", "does", "did",
            "will", "would", "could", "should", "may", "might", "can", "this",
            "that", "these", "those", "i", "you", "he", "she", "it", "we", "they",
            "what", "which", "who", "when", "where", "why", "how", "in", "on",
            "at", "to", "for", "of", "with", "by", "from", "as", "it", "your"
        }
        
        # Split into words and clean
        words = re.findall(r"\b[a-z]+\b", text.lower())
        
        # Filter out stop words and short words
        words = [w for w in words if w not in stop_words and len(w) > 3]
        
        # Count frequency
        from collections import Counter
        word_freq = Counter(words)
        
        return word_freq.most_common(top_n)
    
    @staticmethod
    def calculate_keyword_diversity(text: str) -> float:
        """
        Calculate keyword diversity (0-1)
        Higher = more diverse vocabulary
        """
        words = re.findall(r"\b[a-z]+\b", text.lower())
        if not words:
            return 0.0
        
        unique_words = len(set(words))
        diversity = unique_words / len(words)
        return round(diversity, 2)


class StructureAnalyzer:
    """Analyze text structure and formatting"""
    
    @staticmethod
    def has_bullet_points(text: str) -> bool:
        """Check if text has bullet points"""
        return bool(re.search(r"[•\-*]\s|^\s*[-*•]\s", text, re.MULTILINE))
    
    @staticmethod
    def bullet_point_ratio(text: str) -> float:
        """Calculate percentage of text in bullet points"""
        lines = text.split("\n")
        bullet_lines = [l for l in lines if re.match(r"^\s*[-*•]\s", l)]
        
        if not lines:
            return 0.0
        
        return round(len(bullet_lines) / len(lines), 2)
    
    @staticmethod
    def average_paragraph_length(text: str) -> float:
        """Calculate average paragraph length (words)"""
        paragraphs = text.split("\n\n")
        paragraphs = [p for p in paragraphs if p.strip()]
        
        if not paragraphs:
            return 0.0
        
        total_words = sum(len(p.split()) for p in paragraphs)
        return round(total_words / len(paragraphs), 1)


class NLPAnalyzer:
    """Main NLP analyzer orchestrator"""
    
    @staticmethod
    def analyze_description(description: str) -> NLPFeatures:
        """
        Perform comprehensive NLP analysis
        """
        if not description:
            description = ""
        
        # Readability
        flesch_grade = ReadabilityAnalyzer.flesch_kincaid_grade(description)
        flesch_ease = ReadabilityAnalyzer.flesch_reading_ease(description)
        
        # Sentiment
        sentiment = SentimentAnalyzer.analyze_sentiment(description)
        subjectivity = SentimentAnalyzer.analyze_subjectivity(description)
        trust_indicators = SentimentAnalyzer.detect_trust_indicators(description)
        
        # Keywords
        keywords = KeywordAnalyzer.extract_keywords(description, top_n=10)
        keyword_diversity = KeywordAnalyzer.calculate_keyword_diversity(description)
        
        # Structure
        has_bullets = StructureAnalyzer.has_bullet_points(description)
        bullet_ratio = StructureAnalyzer.bullet_point_ratio(description)
        avg_para_length = StructureAnalyzer.average_paragraph_length(description)
        
        # Clarity indicators
        clarity_indicators = {
            "flesch_grade": flesch_grade,  # Lower is better (6-8 optimal)
            "flesch_ease": flesch_ease,  # Higher is better (60-70 optimal)
            "avg_paragraph_length": avg_para_length,  # Shorter is better
            "has_bullet_points": has_bullets,
            "bullet_ratio": bullet_ratio,
            "sentiment": sentiment,
            "subjectivity": subjectivity,
            "keyword_diversity": keyword_diversity,
            "trust_indicators": trust_indicators,
        }
        
        return NLPFeatures(
            readability_score=round(flesch_ease / 10, 1),  # Normalize to 0-10
            sentiment_score=round((sentiment + 1) * 5, 1),  # Normalize to 0-10
            description_length=len(description),
            keyword_count=len(keywords),
            has_bullet_points=has_bullets,
            clarity_indicators=clarity_indicators,
        )
