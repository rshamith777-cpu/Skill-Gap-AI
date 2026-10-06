"""
Skill Extraction Engine.
Extracts canonical skills from preprocessed text using dictionary-guided
multi-word boundary matching, synonym resolution, and frequency weighting.
"""
import re
from typing import List, Dict, Tuple, Set
from src.nlp_processor import NLPProcessor

class SkillExtractor:
    def __init__(self, nlp_processor: NLPProcessor = None):
        self.nlp = nlp_processor or NLPProcessor()
        self.canonical_skills = self.nlp.canonical_skills
        self.synonym_map = self.nlp.synonym_map
        
    def extract_skills_with_evidence(self, text: str) -> Dict[str, int]:
        """
        Scans text for canonical skills and their synonyms.
        Returns a dictionary of {canonical_skill: mention_count}.
        """
        if not text:
            return {}
            
        cleaned_text = " " + self.nlp.preprocess(text) + " "
        detected_counts: Dict[str, int] = {}
        
        # Sort synonyms by length descending to match multi-word phrases first (e.g. "machine learning" before "learning")
        sorted_synonyms = sorted(self.synonym_map.keys(), key=lambda s: len(s), reverse=True)
        
        for syn in sorted_synonyms:
            canonical = self.synonym_map[syn]
            # Match with boundary check
            # For short tokens like 'c', 'r', 'ai', 'ml', require exact word boundaries
            pattern = r'(?<![a-z0-9])' + re.escape(syn) + r'(?![a-z0-9])'
            matches = list(re.finditer(pattern, cleaned_text))
            if matches:
                detected_counts[canonical] = detected_counts.get(canonical, 0) + len(matches)
                # Mask out matched span to prevent sub-string double counting
                cleaned_text = re.sub(pattern, " __MATCHED__ ", cleaned_text)
                
        return detected_counts
        
    def extract_skills(self, text: str) -> List[str]:
        """Returns sorted list of unique extracted canonical skill names."""
        counts = self.extract_skills_with_evidence(text)
        return sorted(list(counts.keys()))
