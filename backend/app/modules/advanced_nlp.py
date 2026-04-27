"""
Advanced NLP analysis module with confidence scoring and explainability
"""
from textblob import TextBlob
from collections import Counter
import re
import math


class AdvancedNLPAnalyzer:
    """Advanced NLP analysis with confidence scores and explanations"""
    
    def __init__(self, description: str, title: str = ""):
        self.description = description
        self.title = title
        self.full_text = f"{title} {description}"
    
    def get_sentiment_analysis(self) -> dict:
        """Detailed sentiment analysis"""
        blob = TextBlob(self.description)
        polarity = blob.sentiment.polarity  # -1 to 1
        subjectivity = blob.sentiment.subjectivity  # 0 to 1
        
        # Determine sentiment label
        if polarity > 0.5:
            label = "Very Positive"
        elif polarity > 0.1:
            label = "Positive"
        elif polarity < -0.5:
            label = "Very Negative"
        elif polarity < -0.1:
            label = "Negative"
        else:
            label = "Neutral"
        
        # Objectivity score (1 - subjectivity)
        objectivity = 1 - subjectivity
        
        return {
            "polarity": round(polarity, 3),
            "subjectivity": round(subjectivity, 3),
            "objectivity": round(objectivity, 3),
            "label": label,
            "confidence": round(abs(polarity), 2),  # Higher confidence for extreme values
            "explanation": self._explain_sentiment(polarity, subjectivity)
        }
    
    def _explain_sentiment(self, polarity: float, subjectivity: float) -> str:
        """Explain sentiment findings"""
        if subjectivity > 0.7:
            return "Description is highly subjective - focus on objective benefits"
        elif polarity < -0.1:
            return "Negative language detected - consider more positive framing"
        elif polarity > 0.5 and subjectivity < 0.3:
            return "Strong objective positive tone - excellent for trust building"
        else:
            return "Balanced and neutral tone - consider emphasizing key benefits"
    
    def get_readability_score(self) -> dict:
        """Calculate comprehensive readability metrics"""
        sentences = self._get_sentences()
        words = self._get_words()
        syllables = self._count_syllables()
        
        if len(sentences) == 0 or len(words) == 0:
            return {
                "flesch_reading_ease": 0,
                "flesch_kincaid_grade": 0,
                "avg_sentence_length": 0,
                "avg_word_length": 0,
                "label": "Unreadable",
                "confidence": 0.0,
                "explanation": "Text is too short to analyze"
            }
        
        # Flesch Reading Ease (0-100, higher is easier)
        fre = 206.835 - 1.015 * (len(words) / len(sentences)) - 84.6 * (syllables / len(words))
        fre = max(0, min(100, fre))  # Clamp 0-100
        
        # Flesch-Kincaid Grade Level (US grade)
        fkg = 0.39 * (len(words) / len(sentences)) + 11.8 * (syllables / len(words)) - 15.59
        fkg = max(0, fkg)
        
        # Readability label
        if fre >= 80:
            label = "Very Easy"
        elif fre >= 60:
            label = "Easy"
        elif fre >= 40:
            label = "Average"
        elif fre >= 20:
            label = "Hard"
        else:
            label = "Very Hard"
        
        avg_sentence_length = len(words) / len(sentences) if sentences else 0
        avg_word_length = sum(len(w) for w in words) / len(words) if words else 0
        
        return {
            "flesch_reading_ease": round(fre, 1),
            "flesch_kincaid_grade": round(fkg, 1),
            "avg_sentence_length": round(avg_sentence_length, 1),
            "avg_word_length": round(avg_word_length, 1),
            "label": label,
            "confidence": round(1 - abs(fre - 60) / 100, 2),  # Optimal is 60
            "explanation": self._explain_readability(fre, fkg, avg_word_length)
        }
    
    def _explain_readability(self, fre: float, fkg: float, avg_word_length: float) -> str:
        """Explain readability findings"""
        if fre >= 70:
            return "Excellent readability - easy for all users"
        elif fre >= 50:
            return "Good readability - suitable for target audience"
        elif avg_word_length > 6:
            return "Use shorter words to improve readability"
        else:
            return "Consider shorter sentences to improve flow"
    
    def get_keyword_analysis(self) -> dict:
        """Analyze keyword usage and density"""
        words = self._get_words()
        stopwords = self._get_stopwords()
        
        # Filter stopwords and get keyword frequency
        keywords = [w for w in words if w not in stopwords and len(w) > 3]
        keyword_freq = Counter(keywords)
        top_keywords = keyword_freq.most_common(10)
        
        # Calculate keyword density for top keywords
        total_words = len(words)
        keyword_densities = {}
        
        for keyword, count in top_keywords:
            density = (count / total_words * 100) if total_words > 0 else 0
            keyword_densities[keyword] = {
                "count": count,
                "density_percent": round(density, 2)
            }
        
        # Optimal keyword density is 1-3%
        healthy_keywords = sum(1 for d in keyword_densities.values() 
                              if 1 <= d["density_percent"] <= 3)
        
        return {
            "top_keywords": [{"keyword": k, "count": c} for k, c in top_keywords],
            "keyword_densities": keyword_densities,
            "total_unique_keywords": len(keyword_freq),
            "keyword_diversity": round(len(keyword_freq) / len(words) * 100, 2) if words else 0,
            "confidence": round(min(healthy_keywords / len(top_keywords), 1), 2),
            "explanation": self._explain_keywords(healthy_keywords, len(top_keywords))
        }
    
    def _explain_keywords(self, healthy: int, total: int) -> str:
        """Explain keyword findings"""
        ratio = healthy / total if total > 0 else 0
        if ratio >= 0.7:
            return "Excellent keyword distribution - balanced usage"
        elif ratio >= 0.3:
            return "Good keyword distribution - consider focusing on main keywords"
        else:
            return "Keyword distribution needs improvement - focus on 3-5 main keywords"
    
    def get_spam_score(self) -> dict:
        """Detect spammy language patterns"""
        spam_patterns = {
            "excessive_caps": len(re.findall(r'[A-Z]{3,}', self.description)) / max(len(self.description.split()), 1),
            "excessive_punctuation": len(re.findall(r'[!?]{2,}', self.description)) / max(len(self.description.split()), 1),
            "suspicious_phrases": self._detect_suspicious_phrases(),
            "excessive_numbers": len(re.findall(r'\d+', self.description)) / max(len(self.description.split()), 1),
            "excessive_symbols": len(re.findall(r'[$%*&@#^]', self.description)) / max(len(self.description.split()), 1),
        }
        
        # Calculate spam score (0-100)
        spam_score = (
            spam_patterns["excessive_caps"] * 20 +
            spam_patterns["excessive_punctuation"] * 20 +
            spam_patterns["suspicious_phrases"] * 30 +
            spam_patterns["excessive_numbers"] * 10 +
            spam_patterns["excessive_symbols"] * 20
        )
        spam_score = min(spam_score, 100)
        
        label = "Clean" if spam_score < 15 else "Moderate" if spam_score < 40 else "High Spam Risk"
        
        return {
            "spam_score": round(spam_score, 1),
            "label": label,
            "patterns": spam_patterns,
            "confidence": round(1 - spam_score / 100, 2),
            "explanation": f"Spam risk is {label} - {self._explain_spam(spam_score)}"
        }
    
    def _detect_suspicious_phrases(self) -> float:
        """Detect suspicious spam phrases"""
        suspicious = [
            r"click here", r"buy now", r"limited time",
            r"act now", r"don't miss", r"exclusive offer",
            r"guaranteed", r"best seller", r"top rated",
            r"money back", r"risk free", r"free"
        ]
        
        count = 0
        for phrase in suspicious:
            count += len(re.findall(phrase, self.description.lower()))
        
        return min(count / max(len(self.description.split()), 1), 1)
    
    def _explain_spam(self, score: float) -> str:
        """Explain spam score"""
        if score < 15:
            return "Description maintains professional tone"
        elif score < 40:
            return "Reduce marketing language - focus on facts"
        else:
            return "High promotional language detected - consider more objective description"
    
    def get_confidence_breakdown(self) -> dict:
        """Get confidence scores for each analysis component"""
        sentiment = self.get_sentiment_analysis()
        readability = self.get_readability_score()
        keywords = self.get_keyword_analysis()
        spam = self.get_spam_score()
        
        return {
            "sentiment_confidence": sentiment.get("confidence", 0.5),
            "readability_confidence": readability.get("confidence", 0.5),
            "keyword_confidence": keywords.get("confidence", 0.5),
            "spam_confidence": spam.get("confidence", 0.5),
            "overall_confidence": round(
                (sentiment.get("confidence", 0.5) +
                 readability.get("confidence", 0.5) +
                 keywords.get("confidence", 0.5) +
                 spam.get("confidence", 0.5)) / 4, 2
            )
        }
    
    def _get_sentences(self) -> list:
        """Split text into sentences"""
        return re.split(r'[.!?]+', self.description)
    
    def _get_words(self) -> list:
        """Extract words from text"""
        words = re.findall(r'\b\w+\b', self.description.lower())
        return words
    
    def _count_syllables(self) -> int:
        """Estimate syllable count"""
        count = 0
        vowels = 'aeiou'
        previous_was_vowel = False
        
        for char in self.description.lower():
            is_vowel = char in vowels
            if is_vowel and not previous_was_vowel:
                count += 1
            previous_was_vowel = is_vowel
        
        # Adjust for silent e
        if self.description.lower().endswith('e'):
            count -= 1
        
        # Words have at least one syllable
        return max(count, len(self.description.split()))
    
    def _get_stopwords(self) -> set:
        """Common English stopwords"""
        return {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'is', 'was', 'be', 'are', 'been', 'have',
            'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
            'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you',
            'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'when', 'where'
        }
    
    def analyze_full(self) -> dict:
        """Run complete advanced analysis"""
        return {
            "sentiment": self.get_sentiment_analysis(),
            "readability": self.get_readability_score(),
            "keywords": self.get_keyword_analysis(),
            "spam_detection": self.get_spam_score(),
            "confidence_breakdown": self.get_confidence_breakdown()
        }
