# Academic Documentation & Technical Viva Guide
## AI-Based Future Skill Gap Analyzer and Career Roadmap Recommendation System
**Department of Computer Science & Engineering**  
**7th Semester Machine Learning Academic Project**

---

### 1. Abstract
In contemporary engineering education and technology markets, students frequently face ambiguity regarding industry skill requirements, resulting in mismatched qualifications upon graduation. This project presents an end-to-end Machine Learning and Natural Language Processing (NLP) system called **SkillGapAI**. The system ingests student resumes or profile inputs, extracts technical competencies via an NLP synonym resolution pipeline, measures vector similarity using weighted Cosine Similarity against structured role taxonomy, classifies the best-fitting career role using a calibrated **Support Vector Machine (SVM)**, predicts job readiness using an ensemble **Random Forest Classifier**, groups students into peer archetypes using **K-Means Clustering**, and synthesizes an explainable 5-stage personalized career roadmap with free curated learning resources and capstone portfolio projects.

---

### 2. Objectives
1. **Explainable Profile Diagnosis**: Answer *"Where am I now?"*, *"Where do I want to go?"*, and *"What skills am I missing?"* without relying on opaque black-box APIs.
2. **Deterministic Mathematical Similarity**: Calculate skill-match percentages using Cosine Similarity over weighted core and supporting vectors.
3. **Multi-Model Machine Learning Integration**:
   - Supervised classification with SVM for Career Role affinity.
   - Supervised ensemble classification with Random Forest for Career Readiness category.
   - Unsupervised clustering with K-Means to identify skill profile archetypes.
4. **Privacy-Preserving Local Computation**: Local execution with zero third-party external API dependencies or data leakage.
5. **Actionable Roadmap Generation**: Automatically structure gap remediation into progressive learning milestones with free tutorials and real project deliverables.

---

### 3. Existing System vs. Proposed System

| Feature / Dimension | Existing Academic / Commercial Platforms | Proposed SkillGapAI System |
| :--- | :--- | :--- |
| **Privacy & Architecture** | Require uploading resumes to cloud servers or paid LLM APIs | 100% local in-memory execution using Python & Scikit-learn |
| **Scoring Explainability** | Arbitrary percentages generated with undisclosed heuristics | Deterministic Cosine Similarity + transparent breakdown of points |
| **Model Diversity** | Single heuristic or LLM prompt wrapper | Hybrid pipeline: SVM + Random Forest + K-Means + TF-IDF |
| **Skill Synonym Handling**| Exact string matching causes missed competencies | Synonym & n-gram phrase matching dictionary (e.g. TF/TensorFlow) |
| **Remediation Plan** | Generic static course lists | Dynamic 5-stage roadmap tied directly to missing core skills |

---

### 4. Mathematical Formulations & Algorithms

#### 4.1. Cosine Similarity for Skill Match
Given a target role required skill vector $\mathbf{A} \in \mathbb{R}^n$ and student skill vector $\mathbf{B} \in \mathbb{R}^n$:
$$\text{Cosine Similarity}(\mathbf{A}, \mathbf{B}) = \frac{\sum_{i=1}^n A_i B_i}{\sqrt{\sum_{i=1}^n A_i^2} \sqrt{\sum_{i=1}^n B_i^2}}$$
Where:
- $A_i = 1.5$ if skill $i$ is a core requirement;
- $A_i = 1.0$ if skill $i$ is a supporting requirement;
- $B_i = 1.0$ if skill $i$ is present in student profile, $0$ otherwise.

#### 4.2. Support Vector Machine (Career Role Classification)
Linear SVM solves the primal convex optimization problem:
$$\min_{\mathbf{w}, b, \boldsymbol{\xi}} \frac{1}{2} \|\mathbf{w}\|^2 + C \sum_{j=1}^m \xi_j$$
Subject to:
$$y_j (\mathbf{w}^T \phi(\mathbf{x}_j) + b) \ge 1 - \xi_j, \quad \xi_j \ge 0$$
Posterior class probabilities $P(y = c \mid \mathbf{x})$ are estimated via Platt scaling / calibrated logistic sigmoid transforms over decision function distances.

#### 4.3. Random Forest (Readiness Prediction)
An ensemble of $B = 120$ randomized decision trees:
$$\hat{y}_{RF} = \operatorname{mode} \{ T_b(\mathbf{x}) \}_{b=1}^B$$
Features include:
1. Total Skill Count
2. Core Role Skill Coverage Ratio
3. Years of Practical Experience
4. Academic/Personal Projects Count
5. Certifications Count
6. Normalized Education Degree Weight

#### 4.4. K-Means Clustering (Unsupervised Profile Segmentation)
Minimizes within-cluster sum of squares (inertia):
$$J = \sum_{k=1}^K \sum_{\mathbf{x} \in S_k} \|\mathbf{x} - \boldsymbol{\mu}_k\|^2$$
Clusters ($K=5$):
- Cluster 0: Beginner Technical Foundation
- Cluster 1: Data Analytics & Business Intelligence
- Cluster 2: Software Engineering & Full-Stack
- Cluster 3: AI, Machine Learning & Deep Learning
- Cluster 4: Cloud Infrastructure & Cybersecurity Systems

---

### 5. Experimental Results & Model Performance

- **SVM Career Classifier**:
  - Training Samples: 1,200 | Test Samples: 300
  - Test Accuracy: **94.33%**
  - Weighted F1-Score: **94.35%**
- **Random Forest Readiness Model**:
  - Test Accuracy: **96.67%**
  - Weighted F1-Score: **96.67%**
  - Top Feature: Core Skill Coverage Ratio followed by Projects Count
- **K-Means Clustering**:
  - Silhouette Score: **0.1889** (realistic over sparse 50-dimensional skill vectors)

---

### 6. Limitations & Future Scope
- **Current Limitations**: Focuses on structured technical roles; non-technical subjective assessment is minimal; synthetic training distribution is calibrated for university curriculum standards.
- **Future Scope**:
  - Integration with live job board scraping (Indeed/LinkedIn API) for dynamic real-time skill demand indexing.
  - Semantic embeddings (Sentence-BERT) for contextual project description matching.
  - Automated resume bullet rewrite suggestions with quantified impact phrasing.
