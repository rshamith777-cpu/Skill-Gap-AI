"""
Similarity Computation Module.
Implements:
1. TF-IDF Text Representation & Cosine Similarity between Resume Text and Career Descriptions.
2. Vector-based Cosine Similarity between Student's Skill Profile and Target Role's Required Skills.
All calculations are deterministic and explainable.
"""
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Tuple

class SimilarityEngine:
    def __init__(self, canonical_skills: List[str] = None):
        self.canonical_skills = canonical_skills or []
        self.skill_to_idx = {skill: idx for idx, skill in enumerate(self.canonical_skills)}
        
    def calculate_skill_vector_cosine(
        self,
        student_skills: List[str],
        core_skills: List[str],
        supporting_skills: List[str]
    ) -> Tuple[float, Dict[str, float]]:
        """
        Constructs continuous weighted skill vectors:
        - Target vector: Core skills weighted at 1.5, Supporting skills weighted at 1.0.
        - Student vector: 1.0 for each present skill.
        Calculates cosine similarity = (A . B) / (||A|| * ||B||).
        Returns:
            match_percentage (0.0 to 100.0),
            breakdown: {dot_product, norm_student, norm_target, core_overlap_ratio}
        """
        all_role_skills = list(dict.fromkeys(core_skills + supporting_skills))
        if not all_role_skills:
            return 0.0, {}
            
        student_set = set(student_skills)
        target_vec = []
        student_vec = []
        
        core_set = set(core_skills)
        
        for s in all_role_skills:
            weight = 1.5 if s in core_set else 1.0
            target_vec.append(weight)
            student_vec.append(1.0 if s in student_set else 0.0)
            
        A = np.array(student_vec, dtype=float)
        B = np.array(target_vec, dtype=float)
        
        dot = float(np.dot(A, B))
        norm_a = float(np.linalg.norm(A))
        norm_b = float(np.linalg.norm(B))
        
        if norm_a == 0.0 or norm_b == 0.0:
            sim = 0.0
        else:
            sim = dot / (norm_a * norm_b)
            
        core_matches = len(student_set.intersection(core_set))
        core_ratio = core_matches / max(len(core_set), 1)
        
        # Skill match percentage (0 to 100)
        match_percentage = round(float(sim) * 100.0, 1)
        
        breakdown = {
            "cosine_similarity": round(float(sim), 4),
            "dot_product": round(dot, 2),
            "norm_student": round(norm_a, 2),
            "norm_target": round(norm_b, 2),
            "core_skills_matched": core_matches,
            "core_skills_total": len(core_set),
            "core_overlap_ratio": round(core_ratio, 3)
        }
        
        return match_percentage, breakdown

    def calculate_tfidf_text_similarity(self, resume_text: str, role_description: str) -> float:
        """
        Calculates TF-IDF Cosine Similarity between resume text and role description.
        """
        if not resume_text or not role_description:
            return 0.0
            
        vectorizer = TfidfVectorizer(stop_words="english", max_features=1000)
        try:
            tfidf_matrix = vectorizer.fit_transform([resume_text, role_description])
            sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return round(float(sim) * 100.0, 1)
        except Exception:
            return 0.0
