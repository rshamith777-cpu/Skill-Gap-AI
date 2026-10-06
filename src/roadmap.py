"""
Personalized Career Roadmap Generator.
Structures the student's journey into 5 distinct milestones:
Stage 1: Foundation & Prerequisites
Stage 2: Core Technical Competencies
Stage 3: Advanced Specializations & Tooling
Stage 4: Practical Portfolio Projects
Stage 5: Career Preparation & Viva/Interview Readiness
"""
from typing import List, Dict, Set

# Curated stage mappings for canonical skills
SKILL_STAGE_MAP = {
    # Stage 1: Foundation
    "Python": ("Stage 1 — Foundation", "Object-oriented programming, data structures, and script automation in Python."),
    "Java": ("Stage 1 — Foundation", "Core Java syntax, OOP inheritance, and collections framework."),
    "C++": ("Stage 1 — Foundation", "Pointers, memory allocation, and STL containers."),
    "Excel": ("Stage 1 — Foundation", "Lookup functions, pivot tables, and conditional formatting."),
    "Statistics": ("Stage 1 — Foundation", "Descriptive statistics, normal distributions, and hypothesis testing."),
    "Probability": ("Stage 1 — Foundation", "Bayes theorem, random variables, and probability distributions."),
    "Linux": ("Stage 1 — Foundation", "Command-line navigation, file permissions, shell scripting, and process control."),
    "Networking": ("Stage 1 — Foundation", "OSI model, TCP/IP handshake, DNS, routing, and subnetting."),
    "Git": ("Stage 1 — Foundation", "Branching workflows, merge conflict resolution, and GitHub collaboration."),
    
    # Stage 2: Core Skills
    "NumPy": ("Stage 2 — Core Skills", "N-dimensional array manipulation, vectorization, and linear algebra routines."),
    "Pandas": ("Stage 2 — Core Skills", "DataFrame wrangling, aggregation, missing value imputation, and grouping."),
    "SQL": ("Stage 2 — Core Skills", "Complex relational JOINs, subqueries, indexing, and window functions."),
    "Scikit-learn": ("Stage 2 — Core Skills", "Supervised classification, regression pipelines, and cross-validation."),
    "Machine Learning": ("Stage 2 — Core Skills", "Bias-variance tradeoff, regularization, decision trees, and ensemble algorithms."),
    "Data Cleaning": ("Stage 2 — Core Skills", "Outlier detection, normalization, and categorical encoding pipelines."),
    "Data Visualization": ("Stage 2 — Core Skills", "Exploratory visual storytelling with Matplotlib, Seaborn, and Plotly."),
    "Data Structures": ("Stage 2 — Core Skills", "Arrays, hash maps, binary search trees, and dynamic arrays."),
    "Algorithms": ("Stage 2 — Core Skills", "Sorting, searching, recursion, graph traversal, and dynamic programming."),
    "OOP": ("Stage 2 — Core Skills", "Encapsulation, polymorphism, abstract design patterns, and SOLID principles."),
    "Cloud Fundamentals": ("Stage 2 — Core Skills", "Cloud deployment models, compute virtualization, storage buckets, and IAM."),
    "Cybersecurity Fundamentals": ("Stage 2 — Core Skills", "CIA triad, defense-in-depth, attack vectors, and authentication standards."),
    "REST API": ("Stage 2 — Core Skills", "API endpoint design, HTTP status codes, JSON serialization, and CRUD operations."),
    "Power BI": ("Stage 2 — Core Skills", "Data modeling, DAX measures, relational schemas, and interactive reports."),
    
    # Stage 3: Advanced Skills
    "Deep Learning": ("Stage 3 — Advanced Skills", "Backpropagation, activation functions, optimizers, and multilayer perceptrons."),
    "TensorFlow": ("Stage 3 — Advanced Skills", "Computation graphs, Keras sequential/functional API, and model checkpointing."),
    "PyTorch": ("Stage 3 — Advanced Skills", "Tensors, autograd engine, custom nn.Module architectures, and training loops."),
    "NLP": ("Stage 3 — Advanced Skills", "Tokenization, TF-IDF, word embeddings, sequence models, and Transformer concepts."),
    "Computer Vision": ("Stage 3 — Advanced Skills", "Convolutional filters, image feature extraction, OpenCV processing, and CNNs."),
    "Feature Engineering": ("Stage 3 — Advanced Skills", "Target encoding, interaction terms, PCA dimensionality reduction, and scaling."),
    "AWS": ("Stage 3 — Advanced Skills", "EC2, S3, RDS, IAM roles, Lambda serverless, and VPC networking."),
    "Azure": ("Stage 3 — Advanced Skills", "Virtual machines, Azure Blob, Resource Groups, and Entra ID."),
    "Docker": ("Stage 3 — Advanced Skills", "Multi-stage Dockerfiles, image optimization, and container networks."),
    "Kubernetes": ("Stage 3 — Advanced Skills", "Pod specifications, Deployments, Services, ConfigMaps, and cluster scaling."),
    "Cryptography": ("Stage 3 — Advanced Skills", "Symmetric AES encryption, public-key RSA, SHA-256 hashing, and digital certificates."),
    "Security Tools": ("Stage 3 — Advanced Skills", "Packet inspection with Wireshark, network scanning with Nmap, and vulnerability probes."),
    "Threat Detection": ("Stage 3 — Advanced Skills", "Log analysis, intrusion detection indicators (IOCs), and forensic timelines."),
    "Vulnerability Assessment": ("Stage 3 — Advanced Skills", "CVSS scoring, OWASP Top 10 auditing, and penetration scanning."),
    "Model Deployment": ("Stage 3 — Advanced Skills", "Production serving with FastAPI, serialization with ONNX, and latency benchmarks."),
    "MLOps": ("Stage 3 — Advanced Skills", "Model versioning with MLflow/DVC, automated retraining pipelines, and data drift tracking."),
    "CI/CD": ("Stage 3 — Advanced Skills", "Automated test runners, build pipelines, and continuous deployment workflows.")
}

class RoadmapGenerator:
    def __init__(self, role_database: Dict = None):
        self.role_database = role_database or {}
        
    def generate_roadmap(
        self,
        student_skills: List[str],
        target_role: str,
        gap_analysis: Dict,
        recommended_projects: List[Dict]
    ) -> List[Dict]:
        """
        Synthesizes student's current profile, missing skills, and target role
        into an actionable 5-Stage Roadmap with milestones.
        """
        student_set = set(student_skills)
        missing_skills = gap_analysis.get("missing_skills", [])
        weak_skills = gap_analysis.get("weak_skills", [])
        
        # Collect target learning skills
        skills_to_learn = [m["skill"] for m in missing_skills] + [w["skill"] for w in weak_skills]
        
        # Bucket skills into stages
        stages_dict = {
            "Stage 1 — Foundation": {
                "stage_title": "Stage 1 — Foundation",
                "focus": "Core programming, algorithmic reasoning, and mathematical underpinnings",
                "skills": [],
                "status": "In Progress",
                "estimated_duration": "3-4 Weeks"
            },
            "Stage 2 — Core Skills": {
                "stage_title": "Stage 2 — Core Skills",
                "focus": f"Fundamental tools and critical workflows required for {target_role}",
                "skills": [],
                "status": "Upcoming",
                "estimated_duration": "4-6 Weeks"
            },
            "Stage 3 — Advanced Skills": {
                "stage_title": "Stage 3 — Advanced Skills",
                "focus": "Specialized frameworks, production tooling, and architectural patterns",
                "skills": [],
                "status": "Upcoming",
                "estimated_duration": "6-8 Weeks"
            },
            "Stage 4 — Practical Projects": {
                "stage_title": "Stage 4 — Practical Projects",
                "focus": "Building production-grade capstone artifacts demonstrating end-to-end competency",
                "projects": recommended_projects,
                "status": "Upcoming",
                "estimated_duration": "4-5 Weeks"
            },
            "Stage 5 — Career Preparation": {
                "stage_title": "Stage 5 — Career Preparation",
                "focus": "Viva defense preparation, GitHub portfolio curation, technical interview drills, and resume alignment",
                "action_items": [
                    "Host code repositories on GitHub with clean READMEs and architectural diagrams",
                    "Practice explainability viva questions on SVM, Random Forest, and K-Means",
                    "Conduct mock technical interview sessions focusing on system design and ML metrics",
                    "Tailor resume bullet points using quantified impact metrics"
                ],
                "status": "Final Milestone",
                "estimated_duration": "2-3 Weeks"
            }
        }
        
        for skill in skills_to_learn:
            stage_info = SKILL_STAGE_MAP.get(skill, ("Stage 2 — Core Skills", f"In-depth mastery of {skill}."))
            stage_key = stage_info[0]
            desc = stage_info[1]
            is_present = skill in student_set
            
            skill_card = {
                "skill": skill,
                "already_started": is_present,
                "topic": desc,
                "why_needed": f"Required for {target_role} role qualification.",
                "badge": "Strengthen" if is_present else "Learn From Scratch"
            }
            
            if stage_key in stages_dict:
                stages_dict[stage_key]["skills"].append(skill_card)
                
        # If student already has mostly foundation skills, mark Stage 1 completed
        stage1_skills = [s for s in ["Python", "Git", "Statistics", "SQL"] if s in student_set]
        if len(stage1_skills) >= 2:
            stages_dict["Stage 1 — Foundation"]["status"] = "Completed / Refined"
            
        return list(stages_dict.values())
