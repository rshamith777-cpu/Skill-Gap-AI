"""
Dataset Generator for SkillGapAI Academic Training Dataset.
Generates a realistic, synthetic academic dataset (1,500 student records)
representing engineering students, their skill vectors, projects, education,
and assigned ground truth for:
1. Career Role (Multi-class: 6 classes for SVM)
2. Readiness Category (Multi-class: 4 classes for Random Forest)
"""
import os
import random
import pandas as pd
import numpy as np
from config import DATA_DIR

random.seed(42)
np.random.seed(42)

DEGREES = [
    "B.E. Computer Science and Engineering",
    "B.Tech Artificial Intelligence and Data Science",
    "B.Tech Information Technology",
    "B.E. Electronics and Communication",
    "BCA / MCA Computer Applications",
    "M.Tech Data Science & AI"
]

ROLE_SKILL_PROFILES = {
    "AI/ML Engineer": {
        "core": ["Python", "NumPy", "Pandas", "Scikit-learn", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision"],
        "supporting": ["Statistics", "SQL", "Model Deployment", "MLOps", "Cloud Fundamentals", "Git", "Docker", "Problem Solving"]
    },
    "Data Scientist": {
        "core": ["Python", "Pandas", "NumPy", "SQL", "Statistics", "Probability", "Machine Learning", "Data Visualization", "Scikit-learn"],
        "supporting": ["Feature Engineering", "NLP", "Deep Learning", "Git", "Communication", "Problem Solving", "Excel", "Data Cleaning"]
    },
    "Data Analyst": {
        "core": ["Excel", "SQL", "Python", "Pandas", "Statistics", "Data Cleaning", "Data Visualization", "Power BI"],
        "supporting": ["Tableau", "Problem Solving", "Communication", "Git", "Probability"]
    },
    "Software Developer": {
        "core": ["Data Structures", "Algorithms", "OOP", "Git", "SQL", "REST API", "Java", "C++", "JavaScript"],
        "supporting": ["Python", "Linux", "Docker", "CI/CD", "Agile", "Problem Solving", "Communication"]
    },
    "Cybersecurity Analyst": {
        "core": ["Networking", "Linux", "Python", "Cybersecurity Fundamentals", "Cryptography", "Security Tools", "Threat Detection", "Vulnerability Assessment"],
        "supporting": ["SIEM", "Ethical Hacking", "Problem Solving", "Communication", "Git"]
    },
    "Cloud Engineer": {
        "core": ["Linux", "Networking", "Python", "Cloud Fundamentals", "AWS", "Virtualization", "Docker", "Kubernetes"],
        "supporting": ["Azure", "GCP", "CI/CD", "Git", "Security Tools", "Problem Solving"]
    }
}

ALL_COMMON = ["Git", "Python", "SQL", "Communication", "Problem Solving"]

def generate_student_records(n_per_role=250):
    records = []
    
    for role, profile in ROLE_SKILL_PROFILES.items():
        core_pool = profile["core"]
        supp_pool = profile["supporting"]
        
        for _ in range(n_per_role):
            degree = random.choice(DEGREES)
            
            # Decide preparedness level for this synthetic student
            level_roll = random.random()
            if level_roll < 0.20:
                readiness = "Beginner"
                k_core = random.randint(1, 3)
                k_supp = random.randint(0, 2)
                exp = round(random.uniform(0.0, 0.5), 1)
                projects = random.randint(0, 1)
                certs = random.randint(0, 1)
            elif level_roll < 0.50:
                readiness = "Developing"
                k_core = random.randint(3, 5)
                k_supp = random.randint(1, 3)
                exp = round(random.uniform(0.2, 1.2), 1)
                projects = random.randint(1, 2)
                certs = random.randint(0, 2)
            elif level_roll < 0.82:
                readiness = "Intermediate"
                k_core = random.randint(5, 7)
                k_supp = random.randint(2, 5)
                exp = round(random.uniform(0.8, 2.2), 1)
                projects = random.randint(2, 4)
                certs = random.randint(1, 3)
            else:
                readiness = "Job Ready"
                k_core = random.randint(7, len(core_pool))
                k_supp = random.randint(3, len(supp_pool))
                exp = round(random.uniform(1.5, 3.8), 1)
                projects = random.randint(3, 6)
                certs = random.randint(2, 4)
                
            sampled_core = random.sample(core_pool, min(k_core, len(core_pool)))
            sampled_supp = random.sample(supp_pool, min(k_supp, len(supp_pool)))
            
            # Chance of picking 1-2 cross-disciplinary skills
            other_skills = []
            if random.random() < 0.4:
                other_role = random.choice([r for r in ROLE_SKILL_PROFILES if r != role])
                other_skills = random.sample(ROLE_SKILL_PROFILES[other_role]["core"], random.randint(1, 2))
                
            student_skills = list(set(sampled_core + sampled_supp + other_skills))
            # Shuffle
            random.shuffle(student_skills)
            
            skills_str = ";".join(student_skills)
            
            records.append({
                "student_id": f"STD_{len(records)+1:04d}",
                "education": degree,
                "experience_years": exp,
                "projects_count": projects,
                "certifications_count": certs,
                "skills": skills_str,
                "skills_count": len(student_skills),
                "target_role": role,
                "readiness_category": readiness
            })
            
    df = pd.DataFrame(records)
    # Shuffle dataset
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    out_file = os.path.join(DATA_DIR, "career_training.csv")
    df.to_csv(out_file, index=False)
    print(f"Generated {len(df)} synthetic academic records -> {out_file}")
    return df

if __name__ == "__main__":
    generate_student_records(250)
