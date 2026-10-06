"""
Training Script: K-Means Clustering for Student Skill Profiles.
Clusters student skill profiles into 5 meaningful archetypes.
Calculates Silhouette Score, cluster centroids, and top characterizing skills.
Saves model and metrics.
"""
import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from utils.config import DATA_DIR, MODELS_DIR

os.makedirs(MODELS_DIR, exist_ok=True)

def train_kmeans():
    dataset_path = os.path.join(DATA_DIR, "career_training.csv")
    vectorizer_path = os.path.join(MODELS_DIR, "vectorizer.pkl")
    
    if not os.path.exists(vectorizer_path):
        from training.train_svm import train_svm
        train_svm()
        
    vectorizer = joblib.load(vectorizer_path)
    df = pd.read_csv(dataset_path)
    
    texts = df["skills"].apply(lambda s: " ".join([item.strip().replace(" ", "_") for item in str(s).split(";")]))
    X = vectorizer.transform(texts)
    
    k = 5
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=15)
    labels = kmeans.fit_predict(X)
    
    sil_score = float(silhouette_score(X, labels))
    feature_names = np.array(vectorizer.get_feature_names_out())
    
    cluster_profiles = {}
    cluster_definitions = {
        0: "Beginner Technical Foundation",
        1: "Data Analytics & Business Intelligence",
        2: "Software Engineering & Full-Stack",
        3: "AI, Machine Learning & Deep Learning",
        4: "Cloud Infrastructure & Cybersecurity Systems"
    }
    
    # Identify top 6 distinguishing features per cluster
    for idx in range(k):
        centroid = kmeans.cluster_centers_[idx]
        top_indices = centroid.argsort()[-8:][::-1]
        top_skills = [feature_names[i].replace("_", " ").title() for i in top_indices]
        cluster_size = int(np.sum(labels == idx))
        
        cluster_profiles[str(idx)] = {
            "name": cluster_definitions[idx],
            "size": cluster_size,
            "percentage": round((cluster_size / len(df)) * 100, 1),
            "top_skills": top_skills,
            "description": f"Students emphasizing {', '.join(top_skills[:4])}."
        }
        
    metrics = {
        "model_name": "K-Means Clustering",
        "n_clusters": k,
        "silhouette_score": round(sil_score, 4),
        "total_samples": int(X.shape[0]),
        "cluster_profiles": cluster_profiles
    }
    
    model_path = os.path.join(MODELS_DIR, "kmeans_model.pkl")
    metrics_path = os.path.join(MODELS_DIR, "kmeans_metrics.json")
    
    joblib.dump(kmeans, model_path)
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)
        
    print(f"K-Means Model trained successfully.")
    print(f"Clusters: {k} | Silhouette Score: {sil_score:.4f}")
    print(f"Saved to: {model_path}, {metrics_path}")
    return metrics

if __name__ == "__main__":
    train_kmeans()
