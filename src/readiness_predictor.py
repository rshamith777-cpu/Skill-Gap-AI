"""
Readiness Prediction Engine.
Distinguishes between:
1. Machine Learning Predicted Category (Random Forest Ensemble)
2. Transparent Calculated Readiness Score (Deterministic 0-100 composite index)
"""
import os
import joblib
import numpy as np
from typing import List, Dict, Set
from utils.config import MODELS_DIR

DEGREE_WEIGHTS = {
    "BCA / MCA Computer Applications": 0.70,
    "B.E. Electronics and Communication": 0.75,
    "B.Tech Information Technology": 0.85,
    "B.E. Computer Science and Engineering": 0.90,
    "B.Tech Artificial Intelligence and Data Science": 0.92,
    "M.Tech Data Science & AI": 1.00
}

class ReadinessPredictor:
    def __init__(self, role_database: Dict[str, Dict] = None):
        self.role_database = role_database or {}
        model_path = os.path.join(MODELS_DIR, "random_forest_model.pkl")
        self.rf_model = None
        if os.path.exists(model_path):
            try:
                self.rf_model = joblib.load(model_path)
            except Exception as e:
                print(f"Error loading Random Forest model: {e}")
                
    def calculate_transparent_readiness_score(
        self,
        student_skills: List[str],
        target_role: str,
        experience_years: float,
        projects_count: int,
        certifications_count: int,
        education_degree: str
    ) -> Dict:
        """
        Calculates an objective, transparent readiness score out of 100 points:
        - Core Skill Coverage: up to 40 pts
        - Supporting Skill Coverage: up to 15 pts
        - Practical Projects: up to 20 pts (5 pts per project, max 4)
        - Practical Experience: up to 15 pts (5 pts per year, max 3 yrs)
        - Relevant Certifications: up to 10 pts (3.3 pts each, max 3)
        """
        role_info = self.role_database.get(target_role, {})
        core_skills = set([s.strip() for s in role_info.get("core_skills", []) if s.strip()])
        supp_skills = set([s.strip() for s in role_info.get("supporting_skills", []) if s.strip()])
        student_set = set(student_skills)
        
        # 1. Core coverage (max 40)
        core_matches = len(student_set.intersection(core_skills))
        core_ratio = core_matches / max(len(core_skills), 1)
        core_score = round(core_ratio * 40.0, 1)
        
        # 2. Supporting coverage (max 15)
        supp_matches = len(student_set.intersection(supp_skills))
        supp_ratio = supp_matches / max(len(supp_skills), 1)
        supp_score = round(supp_ratio * 15.0, 1)
        
        # 3. Projects (max 20)
        proj_score = min(projects_count * 5.0, 20.0)
        
        # 4. Experience (max 15)
        exp_score = min(experience_years * 5.0, 15.0)
        
        # 5. Certifications (max 10)
        cert_score = min(certifications_count * 3.33, 10.0)
        
        total_score = round(core_score + supp_score + proj_score + exp_score + cert_score, 1)
        total_score = max(0.0, min(100.0, total_score))
        
        # Benchmark level
        if total_score >= 80:
            benchmark = "Job Ready"
        elif total_score >= 60:
            benchmark = "Intermediate"
        elif total_score >= 35:
            benchmark = "Developing"
        else:
            benchmark = "Beginner"
            
        breakdown = {
            "core_skills_score": core_score,
            "core_max": 40,
            "supporting_skills_score": supp_score,
            "supporting_max": 15,
            "projects_score": proj_score,
            "projects_max": 20,
            "experience_score": exp_score,
            "experience_max": 15,
            "certifications_score": cert_score,
            "certifications_max": 10,
            "core_matched_count": core_matches,
            "core_total_count": len(core_skills)
        }
        
        return {
            "score": total_score,
            "benchmark_category": benchmark,
            "breakdown": breakdown
        }
        
    def predict_readiness_ml(
        self,
        student_skills: List[str],
        target_role: str,
        experience_years: float,
        projects_count: int,
        certifications_count: int,
        education_degree: str
    ) -> Dict:
        """
        Uses Random Forest Classifier to infer readiness category.
        """
        role_info = self.role_database.get(target_role, {})
        core_skills = set([s.strip() for s in role_info.get("core_skills", []) if s.strip()])
        student_set = set(student_skills)
        
        core_coverage = len(student_set.intersection(core_skills)) / max(len(core_skills), 1)
        edu_score = DEGREE_WEIGHTS.get(education_degree, 0.80)
        
        features = np.array([[
            len(student_skills),
            core_coverage,
            experience_years,
            projects_count,
            certifications_count,
            edu_score
        ]])
        
        if self.rf_model is not None:
            predicted_category = str(self.rf_model.predict(features)[0])
            probs = self.rf_model.predict_proba(features)[0]
            classes = list(self.rf_model.classes_)
            class_probs = {classes[i]: round(float(probs[i]) * 100.0, 1) for i in range(len(classes))}
            confidence = round(float(np.max(probs)) * 100.0, 1)
        else:
            # Fallback heuristic if model unpickling issue
            calc = self.calculate_transparent_readiness_score(
                student_skills, target_role, experience_years, projects_count, certifications_count, education_degree
            )
            predicted_category = calc["benchmark_category"]
            confidence = 80.0
            class_probs = {predicted_category: 80.0}
            
        return {
            "predicted_category": predicted_category,
            "confidence": confidence,
            "probabilities": class_probs
        }
