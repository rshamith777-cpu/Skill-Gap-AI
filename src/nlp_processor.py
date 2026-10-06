"""
NLP Processing Pipeline for SkillGapAI.
Performs text preprocessing, tokenization, stopword removal,
and synonym mapping for skill extraction.
"""
import re
from typing import List, Set, Dict, Tuple
from utils.preprocessing import clean_text, load_skill_dictionary, normalize_skill_name

try:
    from nltk.corpus import stopwords
    from nltk.tokenize import word_tokenize
    NLTK_STOPWORDS = set(stopwords.words("english"))
except Exception:
    NLTK_STOPWORDS = {
        "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your",
        "he", "him", "his", "she", "her", "it", "its", "they", "them", "what", "which",
        "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was",
        "were", "be", "been", "being", "have", "has", "had", "having", "do", "does",
        "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as",
        "until", "while", "of", "at", "by", "for", "with", "about", "against", "between",
        "into", "through", "during", "before", "after", "above", "below", "to", "from",
        "up", "down", "in", "out", "on", "off", "over", "under", "again", "further",
        "then", "once", "here", "there", "when", "where", "why", "how", "all", "any",
        "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor",
        "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can",
        "will", "just", "don", "should", "now"
    }

class NLPProcessor:
    def __init__(self):
        self.canonical_skills, self.synonym_map, self.skill_categories = load_skill_dictionary()
        
    def preprocess(self, text: str) -> str:
        """Standardizes text for NLP analysis."""
        return clean_text(text)
        
    def extract_tokens(self, text: str) -> List[str]:
        """Tokenizes text and removes standard English stopwords."""
        cleaned = self.preprocess(text)
        tokens = cleaned.split()
        return [t for t in tokens if t not in NLTK_STOPWORDS and len(t) > 1]
        
    def get_skill_synonym_map(self) -> Dict[str, str]:
        return self.synonym_map
        
    def get_skill_category(self, skill_name: str) -> str:
        return self.skill_categories.get(skill_name, "General Technical")
