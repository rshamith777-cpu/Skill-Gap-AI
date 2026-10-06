"""
Career Role Classifier (SVM Implementation).
Loads trained Support Vector Machine classifier and TF-IDF vectorizer.
Computes predicted role, class probabilities (confidence), and ranking across all roles.
Handles low-confidence predictions gracefully.
"""
import os
import joblib
import numpy as np
from typing import List, Dict, Tuple
from utils.config import MODELS_DIR

class SVMCareerClassifier:
    def __init__(self):
        model_path = os.path.join(MODELS_DIR, "svm_model.pkl")
        vec_path = os.path.join(MODELS_DIR, "vectorizer.pkl")
        
        self.model = None
        self.vectorizer = None
        self.classes = []
        
        if os.path.exists(model_path) and os.path.exists(vec_path):
            try:
                self.model = joblib.load(model_path)
                self.vectorizer = joblib.load(vec_path)
                self.classes = list(self.model.classes_)
            except Exception as e:
                print(f"Error loading SVM artifacts: {e}")
                
    def is_ready(self) -> bool:
        return self.model is not None and self.vectorizer is not None
        
    def predict_role(self, student_skills: List[str]) -> Dict:
        """
        Predicts most suitable career role using trained SVM model.
        Returns:
            predicted_role: str
            confidence: float (0.0 to 1.0)
            is_low_confidence: bool
            role_probabilities: Dict[str, float]
            ranking: List[Tuple[str, float]]
        """
        if not self.is_ready():
            return {
                "predicted_role": "AI/ML Engineer",
                "confidence": 0.0,
                "is_low_confidence": True,
                "message": "SVM model artifacts not found.",
                "role_probabilities": {},
                "ranking": []
            }
            
        if not student_skills:
            return {
                "predicted_role": "Undetermined",
                "confidence": 0.0,
                "is_low_confidence": True,
                "message": "No skills provided for SVM classification.",
                "role_probabilities": {c: 0.0 for c in self.classes},
                "ranking": [(c, 0.0) for c in self.classes]
            }
            
        # Format input string matching training tokens
        text = " ".join([s.strip().replace(" ", "_") for s in student_skills if s.strip()])
        X = self.vectorizer.transform([text])
        
        # Predict probabilities
        probs = self.model.predict_proba(X)[0]
        predicted_idx = int(np.argmax(probs))
        predicted_role = str(self.classes[predicted_idx])
        confidence = float(probs[predicted_idx])
        
        role_probs = {self.classes[i]: round(float(probs[i]) * 100.0, 1) for i in range(len(self.classes))}
        sorted_ranking = sorted(role_probs.items(), key=lambda x: x[1], reverse=True)
        
        is_low_confidence = confidence < 0.45
        
        return {
            "predicted_role": predicted_role,
            "confidence": round(confidence * 100.0, 1),
            "is_low_confidence": is_low_confidence,
            "warning": "Prediction confidence is low. Consider exploring multiple career paths." if is_low_confidence else None,
            "role_probabilities": role_probs,
            "ranking": sorted_ranking
        }
