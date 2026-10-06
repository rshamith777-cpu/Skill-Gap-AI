"""
Student Skill Profile Clustering Engine (K-Means).
Assigns student profile to one of 5 meaningful archetypes:
0: Beginner Technical Foundation
1: Data Analytics & Business Intelligence
2: Software Engineering & Full-Stack
3: AI, Machine Learning & Deep Learning
4: Cloud Infrastructure & Cybersecurity Systems
Provides distance to centroids and human-readable cluster rationale.
"""
import os
import joblib
import numpy as np
from typing import List, Dict
from utils.config import MODELS_DIR, CLUSTER_NAMES

class SkillProfileClusterer:
    def __init__(self):
        model_path = os.path.join(MODELS_DIR, "kmeans_model.pkl")
        vec_path = os.path.join(MODELS_DIR, "vectorizer.pkl")
        
        self.kmeans = None
        self.vectorizer = None
        
        if os.path.exists(model_path) and os.path.exists(vec_path):
            try:
                self.kmeans = joblib.load(model_path)
                self.vectorizer = joblib.load(vec_path)
            except Exception as e:
                print(f"Error loading K-Means artifacts: {e}")
                
    def assign_cluster(self, student_skills: List[str]) -> Dict:
        """
        Assigns the student to a skill cluster.
        Returns cluster index, archetype title, and explanation.
        """
        if self.kmeans is None or self.vectorizer is None or not student_skills:
            return {
                "cluster_id": 0,
                "cluster_name": CLUSTER_NAMES[0],
                "explanation": "Defaulting to foundational cluster because profile has minimal skills recorded.",
                "distance_to_center": 0.0
            }
            
        text = " ".join([s.strip().replace(" ", "_") for s in student_skills if s.strip()])
        X = self.vectorizer.transform([text])
        
        cluster_id = int(self.kmeans.predict(X)[0])
        cluster_name = CLUSTER_NAMES.get(cluster_id, f"Cluster {cluster_id}")
        
        # Calculate Euclidean distance to cluster centroid
        centroid = self.kmeans.cluster_centers_[cluster_id]
        dist = float(np.linalg.norm(X.toarray()[0] - centroid))
        
        # Explain why
        explanations = {
            0: "Your profile shares highest affinity with students starting their journey with core programming syntax and basic tools.",
            1: "Your profile aligns closely with students emphasizing SQL, spreadsheets, data visualization, and analytical reporting.",
            2: "Your profile clusters with software engineers focused on data structures, object-oriented design, databases, and APIs.",
            3: "Your profile aligns with AI/ML specialists developing machine learning, deep learning, PyTorch/TensorFlow, and predictive models.",
            4: "Your profile clusters with systems engineers building infrastructure, Linux administration, cybersecurity defense, and cloud platforms."
        }
        
        return {
            "cluster_id": cluster_id,
            "cluster_name": cluster_name,
            "explanation": explanations.get(cluster_id, "Clustered based on your technical skill vector density."),
            "distance_to_centroid": round(dist, 3)
        }
