"""
Training Script: Support Vector Machine (SVM) Career Classifier.
Trains an SVM model with calibrated probability outputs on student skill profiles.
Saves model, vectorizer, and evaluation metrics (Accuracy, Precision, Recall, F1, Confusion Matrix).
"""
import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.metrics import classification_report, accuracy_score, precision_recall_fscore_support, confusion_matrix

from utils.config import DATA_DIR, MODELS_DIR

os.makedirs(MODELS_DIR, exist_ok=True)

def train_svm():
    dataset_path = os.path.join(DATA_DIR, "career_training.csv")
    df = pd.read_csv(dataset_path)
    
    # Preprocess skills: replace ';' with space for TF-IDF
    texts = df["skills"].apply(lambda s: " ".join([item.strip().replace(" ", "_") for item in str(s).split(";")]))
    labels = df["target_role"]
    
    vectorizer = TfidfVectorizer(token_pattern=r'(?u)\b\w+\b', lowercase=True)
    X = vectorizer.fit_transform(texts)
    y = labels
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # SVM with RBF/linear kernel and probability enabled for confidence estimation
    model = SVC(kernel="linear", probability=True, C=1.0, random_state=42)
    model.fit(X_train, y_train)
    
    # Predictions
    y_pred = model.predict(X_test)
    
    # Metrics
    accuracy = float(accuracy_score(y_test, y_pred))
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average="weighted")
    classes = sorted(list(model.classes_))
    cm = confusion_matrix(y_test, y_pred, labels=classes).tolist()
    class_report = classification_report(y_test, y_pred, output_dict=True)
    
    metrics = {
        "model_name": "Support Vector Machine (Linear Kernel)",
        "accuracy": round(accuracy, 4),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1_score": round(float(f1), 4),
        "classes": classes,
        "confusion_matrix": cm,
        "classification_report": class_report,
        "train_samples": int(X_train.shape[0]),
        "test_samples": int(X_test.shape[0]),
        "features_count": int(X.shape[1])
    }
    
    # Save artifacts
    model_path = os.path.join(MODELS_DIR, "svm_model.pkl")
    vectorizer_path = os.path.join(MODELS_DIR, "vectorizer.pkl")
    metrics_path = os.path.join(MODELS_DIR, "svm_metrics.json")
    
    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vectorizer_path)
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)
        
    print(f"SVM Model trained successfully.")
    print(f"Accuracy: {accuracy*100:.2f}% | F1-Score: {f1*100:.2f}%")
    print(f"Saved to: {model_path}, {vectorizer_path}, {metrics_path}")
    return metrics

if __name__ == "__main__":
    train_svm()
