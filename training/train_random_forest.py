"""
Training Script: Random Forest Classifier for Career Readiness Prediction.
Predicts readiness categories: Beginner, Developing, Intermediate, Job Ready.
Input Features:
- Skill Count
- Target Role Core Skill Coverage Ratio
- Experience Years
- Projects Count
- Certifications Count
- Education Level Score
Saves model, feature scaler/pipeline, and evaluation metrics.
"""
import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, precision_recall_fscore_support, confusion_matrix

from utils.config import DATA_DIR, MODELS_DIR

os.makedirs(MODELS_DIR, exist_ok=True)

# Degree weight mapping
DEGREE_WEIGHTS = {
    "BCA / MCA Computer Applications": 0.70,
    "B.E. Electronics and Communication": 0.75,
    "B.Tech Information Technology": 0.85,
    "B.E. Computer Science and Engineering": 0.90,
    "B.Tech Artificial Intelligence and Data Science": 0.92,
    "M.Tech Data Science & AI": 1.00
}

def load_role_core_skills():
    roles_path = os.path.join(DATA_DIR, "career_roles.csv")
    df = pd.read_csv(roles_path)
    role_core_dict = {}
    for _, row in df.iterrows():
        role = row["role_name"].strip()
        core = [s.strip() for s in str(row["core_skills"]).split(";") if s.strip()]
        role_core_dict[role] = set(core)
    return role_core_dict

def engineer_features(df, role_core_dict):
    feature_rows = []
    for _, row in df.iterrows():
        student_skills = set([s.strip() for s in str(row["skills"]).split(";") if s.strip()])
        role = row["target_role"].strip()
        core_skills = role_core_dict.get(role, set())
        
        # Coverage metrics
        core_coverage = len(student_skills.intersection(core_skills)) / max(len(core_skills), 1)
        skill_count = len(student_skills)
        exp_years = float(row["experience_years"])
        projects = int(row["projects_count"])
        certs = int(row["certifications_count"])
        edu_score = DEGREE_WEIGHTS.get(str(row["education"]).strip(), 0.80)
        
        feature_rows.append([
            skill_count,
            core_coverage,
            exp_years,
            projects,
            certs,
            edu_score
        ])
    return np.array(feature_rows)

def train_random_forest():
    dataset_path = os.path.join(DATA_DIR, "career_training.csv")
    df = pd.read_csv(dataset_path)
    role_core_dict = load_role_core_skills()
    
    X = engineer_features(df, role_core_dict)
    y = df["readiness_category"].values
    
    feature_names = [
        "skill_count",
        "core_coverage_ratio",
        "experience_years",
        "projects_count",
        "certifications_count",
        "education_score"
    ]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    rf = RandomForestClassifier(
        n_estimators=120,
        max_depth=8,
        min_samples_split=4,
        random_state=42
    )
    rf.fit(X_train, y_train)
    
    y_pred = rf.predict(X_test)
    
    accuracy = float(accuracy_score(y_test, y_pred))
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average="weighted")
    classes = ["Beginner", "Developing", "Intermediate", "Job Ready"]
    cm = confusion_matrix(y_test, y_pred, labels=classes).tolist()
    class_report = classification_report(y_test, y_pred, labels=classes, output_dict=True)
    
    # Feature importances
    importances = {name: round(float(imp), 4) for name, imp in zip(feature_names, rf.feature_importances_)}
    
    metrics = {
        "model_name": "Random Forest Classifier (Ensemble)",
        "accuracy": round(accuracy, 4),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1_score": round(float(f1), 4),
        "classes": classes,
        "feature_names": feature_names,
        "feature_importances": importances,
        "confusion_matrix": cm,
        "classification_report": class_report,
        "train_samples": int(X_train.shape[0]),
        "test_samples": int(X_test.shape[0])
    }
    
    model_path = os.path.join(MODELS_DIR, "random_forest_model.pkl")
    metrics_path = os.path.join(MODELS_DIR, "random_forest_metrics.json")
    
    joblib.dump(rf, model_path)
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)
        
    print(f"Random Forest Model trained successfully.")
    print(f"Accuracy: {accuracy*100:.2f}% | F1-Score: {f1*100:.2f}%")
    print(f"Saved to: {model_path}, {metrics_path}")
    return metrics

if __name__ == "__main__":
    train_random_forest()
