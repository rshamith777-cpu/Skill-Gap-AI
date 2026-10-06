"""
Configuration and constants for SkillGapAI Academic ML System.
"""
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "models")
METRICS_DIR = os.path.join(BASE_DIR, "models")

CAREER_ROLES = [
    "AI/ML Engineer",
    "Data Scientist",
    "Data Analyst",
    "Software Developer",
    "Cybersecurity Analyst",
    "Cloud Engineer"
]

READINESS_CATEGORIES = [
    "Beginner",
    "Developing",
    "Intermediate",
    "Job Ready"
]

CLUSTER_NAMES = {
    0: "Beginner Technical Foundation",
    1: "Data Analytics & Business Intelligence",
    2: "Software Engineering & Full-Stack",
    3: "AI, Machine Learning & Deep Learning",
    4: "Cloud Infrastructure & Cybersecurity Systems"
}
