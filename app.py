"""
AI-Based Future Skill Gap Analyzer and Career Roadmap Recommendation System
Academic 7th Semester Machine Learning Project
Streamlit Web Application (app.py)
"""
import os
import json
import pandas as pd
import numpy as np
import streamlit as st

# Internal ML & NLP Modules
from utils.config import DATA_DIR, MODELS_DIR, CAREER_ROLES
from src.resume_parser import parse_resume_file
from src.nlp_processor import NLPProcessor
from src.skill_extractor import SkillExtractor
from src.similarity import SimilarityEngine
from src.skill_gap import SkillGapAnalyzer
from src.career_classifier import SVMCareerClassifier
from src.readiness_predictor import ReadinessPredictor
from src.clustering import SkillProfileClusterer
from src.recommender import RecommendationEngine
from src.roadmap import RoadmapGenerator

# Page setup
st.set_page_config(
    page_title="SkillGapAI — Career Intelligence & Roadmap System",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling for Academic Presentation
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #475569;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .metric-val {
        font-size: 1.8rem;
        font-weight: 700;
        color: #0f172a;
    }
    .metric-label {
        font-size: 0.85rem;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .badge-strong {
        background-color: #dcfce7;
        color: #166534;
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 0.85rem;
        font-weight: 600;
        display: inline-block;
        margin: 3px;
    }
    .badge-weak {
        background-color: #fef9c3;
        color: #854d0e;
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 0.85rem;
        font-weight: 600;
        display: inline-block;
        margin: 3px;
    }
    .badge-missing {
        background-color: #fee2e2;
        color: #991b1b;
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 0.85rem;
        font-weight: 600;
        display: inline-block;
        margin: 3px;
    }
</style>
""", unsafe_allow_html=True)

@st.cache_resource
def load_system_engines():
    """Initializes and caches all ML and NLP engines."""
    nlp = NLPProcessor()
    extractor = SkillExtractor(nlp)
    
    # Load career roles database
    roles_path = os.path.join(DATA_DIR, "career_roles.csv")
    roles_df = pd.read_csv(roles_path) if os.path.exists(roles_path) else pd.DataFrame()
    role_dict = {}
    for _, r in roles_df.iterrows():
        role_dict[r["role_name"]] = {
            "core_skills": [s.strip() for s in str(r["core_skills"]).split(";") if s.strip()],
            "supporting_skills": [s.strip() for s in str(r["supporting_skills"]).split(";") if s.strip()],
            "description": r["description"],
            "market_demand": r["market_demand"],
            "focus_area": r["focus_area"]
        }
        
    similarity = SimilarityEngine(nlp.canonical_skills)
    skill_gap = SkillGapAnalyzer(role_dict)
    svm_classifier = SVMCareerClassifier()
    readiness_pred = ReadinessPredictor(role_dict)
    clusterer = SkillProfileClusterer()
    recommender = RecommendationEngine()
    roadmap_gen = RoadmapGenerator(role_dict)
    
    return {
        "nlp": nlp,
        "extractor": extractor,
        "roles_df": roles_df,
        "role_dict": role_dict,
        "similarity": similarity,
        "skill_gap": skill_gap,
        "svm": svm_classifier,
        "readiness": readiness_pred,
        "clusterer": clusterer,
        "recommender": recommender,
        "roadmap": roadmap_gen
    }

engines = load_system_engines()

# Header
st.markdown("<div class='main-header'>AI-Based Future Skill Gap Analyzer & Career Roadmap</div>", unsafe_allow_html=True)
st.markdown("<div class='sub-header'>7th Semester Machine Learning Project &bull; Supervised Classification (SVM & Random Forest) &bull; Unsupervised Profile Clustering (K-Means) &bull; Explainable NLP &bull; Local Execution</div>", unsafe_allow_html=True)

# Privacy Notice
st.info("🔒 **Privacy Guarantee**: Your uploaded resume is processed locally in memory and is **not** sent to external AI services or paid APIs.", icon="🛡️")

# Session State Initialization
if "user_skills" not in st.session_state:
    st.session_state.user_skills = []
if "extracted_text" not in st.session_state:
    st.session_state.extracted_text = ""
if "evidence_counts" not in st.session_state:
    st.session_state.evidence_counts = {}

# Sidebar: Student Profile Inputs
with st.sidebar:
    st.header("👤 Student Profile")
    
    # Quick Demo Profile Button
    if st.button("🚀 Load Sample Academic Profile (Demo)", use_container_width=True):
        st.session_state.demo_loaded = True
        st.session_state.user_skills = ["Python", "SQL", "Pandas", "NumPy", "Machine Learning", "Git"]
        st.session_state.evidence_counts = {"Python": 3, "SQL": 1, "Pandas": 2, "NumPy": 2, "Machine Learning": 2, "Git": 1}
        st.session_state.extracted_text = (
            "John Doe - Final Year Student\n"
            "Education: B.E. Computer Science and Engineering\n"
            "Skills: Python, SQL, Pandas, NumPy, Machine Learning, Git\n"
            "Projects: ML Prediction System for Student Performance, Web Application in Python\n"
            "Experience: 6-month Data Science intern working with tabular data and Pandas wrangling."
        )
        st.rerun()

    student_name = st.text_input("Student Name", value="Student Candidate" if "demo_loaded" not in st.session_state else "John Doe")
    education_degree = st.selectbox(
        "Degree / Program",
        [
            "B.E. Computer Science and Engineering",
            "B.Tech Artificial Intelligence and Data Science",
            "B.Tech Information Technology",
            "B.E. Electronics and Communication",
            "BCA / MCA Computer Applications",
            "M.Tech Data Science & AI"
        ]
    )
    graduation_year = st.selectbox("Graduation Year", [2024, 2025, 2026, 2027], index=1)
    experience_years = st.slider("Practical Experience (Years)", 0.0, 5.0, 0.5 if "demo_loaded" in st.session_state else 0.0, 0.5)
    
    projects_input = st.text_area(
        "Academic / Personal Projects (one per line)",
        value="ML prediction system\nWeb application" if "demo_loaded" in st.session_state else "AI chatbot\nData analysis project",
        help="List key projects to evaluate hands-on readiness"
    )
    
    certifications_count = st.number_input("Relevant Certifications Count", min_value=0, max_value=10, value=1 if "demo_loaded" in st.session_state else 0)
    
    st.divider()
    st.header("🎯 Target Career Role")
    career_options = ["Let AI/ML system recommend a career for me"] + CAREER_ROLES
    selected_role_option = st.selectbox("Select Career Goal", career_options)

# Tabs
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "📂 1. Resume & Skill Extraction",
    "📊 2. Gap Analysis & Dashboard",
    "🗺️ 3. Personalized Career Roadmap",
    "🔬 4. ML Models & Academic Viva Evaluation",
    "📚 5. Documentation & Viva Q&A"
])

# ----------------- TAB 1: RESUME & SKILLS -----------------
with tab1:
    col_upload, col_manual = st.columns([1, 1], gap="medium")
    
    with col_upload:
        st.subheader("📄 Resume Upload (Local Extraction)")
        uploaded_file = st.file_uploader(
            "Upload Resume (PDF, DOCX, TXT)",
            type=["pdf", "docx", "txt"],
            help="Files are processed strictly locally in Python"
        )
        
        if uploaded_file is not None:
            file_bytes = uploaded_file.read()
            success, text, msg = parse_resume_file(uploaded_file.name, file_bytes)
            if success:
                st.success(msg)
                st.session_state.extracted_text = text
                # Extract skills using NLP pipeline
                evidence = engines["extractor"].extract_skills_with_evidence(text)
                st.session_state.evidence_counts = evidence
                extracted_skills = sorted(list(evidence.keys()))
                
                # Merge with current list
                merged = sorted(list(set(st.session_state.user_skills + extracted_skills)))
                st.session_state.user_skills = merged
            else:
                st.error(msg)
                
        if st.session_state.extracted_text:
            with st.expander("🔍 View Extracted Resume Plain Text", expanded=False):
                st.text_area("Extracted Text", st.session_state.extracted_text, height=220)

    with col_manual:
        st.subheader("🛠️ Current Skills Review & Manual Addition")
        all_canonical = engines["nlp"].canonical_skills
        
        selected_skills = st.multiselect(
            "Detected & Selected Technical Skills",
            options=all_canonical,
            default=st.session_state.user_skills,
            help="You can add or remove skills to refine your profile."
        )
        st.session_state.user_skills = selected_skills
        
        # Free-text manual skill addition
        custom_input = st.text_input("Add Additional Skill (e.g., PyTorch, Docker, Spring)", "")
        if st.button("➕ Add Skill") and custom_input:
            from utils.preprocessing import normalize_skill_name
            canonical_name = normalize_skill_name(custom_input, engines["nlp"].synonym_map)
            if canonical_name not in st.session_state.user_skills:
                st.session_state.user_skills.append(canonical_name)
                st.session_state.evidence_counts[canonical_name] = 1
                st.success(f"Added '{canonical_name}' to your skill profile!")
                st.rerun()

        st.markdown("**Current Verified Skill Vector:**")
        if st.session_state.user_skills:
            st.write(", ".join([f"`{s}`" for s in st.session_state.user_skills]))
        else:
            st.warning("No skills added yet. Upload a resume or select skills above.")

# ----------------- TAB 2: GAP ANALYSIS & DASHBOARD -----------------
with tab2:
    if not st.session_state.user_skills:
        st.warning("⚠️ Please provide skills in Tab 1 or click 'Load Sample Academic Profile (Demo)' in the sidebar.")
    else:
        # Determine Target Role: user specified or SVM predicted
        svm_result = engines["svm"].predict_role(st.session_state.user_skills)
        
        if selected_role_option == "Let AI/ML system recommend a career for me":
            target_role = svm_result["predicted_role"]
            st.info(f"🤖 **Automated Recommendation**: The system selected **{target_role}** based on your skill profile affinities.", icon="💡")
        else:
            target_role = selected_role_option

        role_info = engines["role_dict"].get(target_role, {})
        core_skills = role_info.get("core_skills", [])
        supp_skills = role_info.get("supporting_skills", [])
        
        # 1. Cosine Similarity & TF-IDF
        skill_match_pct, sim_breakdown = engines["similarity"].calculate_skill_vector_cosine(
            st.session_state.user_skills, core_skills, supp_skills
        )
        tfidf_text_sim = engines["similarity"].calculate_tfidf_text_similarity(
            st.session_state.extracted_text, role_info.get("description", "")
        )
        
        # 2. Skill Gap Analysis
        projects_list = [p.strip() for p in projects_input.split("\n") if p.strip()]
        gap_results = engines["skill_gap"].analyze_gaps(
            st.session_state.user_skills,
            target_role,
            st.session_state.evidence_counts,
            projects_list
        )
        
        # 3. Random Forest Readiness & Calculated Score
        rf_result = engines["readiness"].predict_readiness_ml(
            st.session_state.user_skills,
            target_role,
            experience_years,
            len(projects_list),
            certifications_count,
            education_degree
        )
        transparent_calc = engines["readiness"].calculate_transparent_readiness_score(
            st.session_state.user_skills,
            target_role,
            experience_years,
            len(projects_list),
            certifications_count,
            education_degree
        )
        
        # 4. K-Means Profile Cluster
        cluster_result = engines["clusterer"].assign_cluster(st.session_state.user_skills)

        # TOP KPI CARDS
        m1, m2, m3, m4 = st.columns(4)
        with m1:
            st.markdown(f"""
            <div class='metric-card'>
                <div class='metric-val'>{transparent_calc['score']}%</div>
                <div class='metric-label'>Career Readiness Score</div>
            </div>
            """, unsafe_allow_html=True)
        with m2:
            st.markdown(f"""
            <div class='metric-card'>
                <div class='metric-val'>{skill_match_pct}%</div>
                <div class='metric-label'>Skill Match (Cosine)</div>
            </div>
            """, unsafe_allow_html=True)
        with m3:
            st.markdown(f"""
            <div class='metric-card'>
                <div class='metric-val' style='color:#16a34a;'>{gap_results['counts']['strong']}</div>
                <div class='metric-label'>Strong / Verified Skills</div>
            </div>
            """, unsafe_allow_html=True)
        with m4:
            st.markdown(f"""
            <div class='metric-card'>
                <div class='metric-val' style='color:#dc2626;'>{gap_results['counts']['missing']}</div>
                <div class='metric-label'>Missing Skills Needed</div>
            </div>
            """, unsafe_allow_html=True)
            
        st.write("")
        
        # Career Role & Readiness Insights
        col_c1, col_c2 = st.columns([1, 1], gap="medium")
        
        with col_c1:
            st.subheader("🎯 Machine Learning Career Classification (SVM)")
            st.markdown(f"**Target Role:** `{target_role}`")
            st.markdown(f"**SVM Best Fit Role:** `{svm_result['predicted_role']}` (Confidence: **{svm_result['confidence']}%**)")
            
            if svm_result["is_low_confidence"]:
                st.warning("⚠️ Prediction confidence is low (< 45%). Your skill set is cross-disciplinary. Consider exploring adjacent career tracks.")
                
            # Role probabilities bar chart
            st.markdown("**All Career Alignment Scores (SVM Posterior Probabilities):**")
            chart_df = pd.DataFrame(
                list(svm_result["role_probabilities"].items()),
                columns=["Role", "Probability (%)"]
            ).sort_values(by="Probability (%)", ascending=True)
            st.bar_chart(chart_df.set_index("Role"))

        with col_c2:
            st.subheader("📈 Readiness & Skill Clustering")
            st.markdown(f"**Random Forest ML Category:** `{rf_result['predicted_category']}` (Model Confidence: **{rf_result['confidence']}%**)")
            st.markdown(f"**Calculated Readiness Index:** `{transparent_calc['score']} / 100` ({transparent_calc['benchmark_category']})")
            
            # Progress bar for calculated score
            st.progress(transparent_calc['score'] / 100.0)
            
            st.markdown("---")
            st.markdown(f"**K-Means Skill Profile Archetype:**")
            st.success(f"🏷️ **{cluster_result['cluster_name']}** (Cluster #{cluster_result['cluster_id']})")
            st.caption(f"Cluster rationale: {cluster_result['explanation']}")

        st.divider()

        # Detailed Skill Gap Breakdown
        st.subheader("🔍 Skill Gap Breakdown (Strong 🟢, Weak 🟡, Missing 🔴)")
        
        sg_col1, sg_col2, sg_col3 = st.columns(3)
        with sg_col1:
            st.markdown("#### 🟢 Strong Skills (Verified)")
            if gap_results["strong_skills"]:
                for s in gap_results["strong_skills"]:
                    st.markdown(f"<span class='badge-strong'>✓ {s['skill']}</span>", unsafe_allow_html=True)
                    st.caption(f"{s['reason']}")
            else:
                st.info("No verified strong skills recorded yet.")
                
        with sg_col2:
            st.markdown("#### 🟡 Weak / Developing Skills")
            if gap_results["weak_skills"]:
                for s in gap_results["weak_skills"]:
                    st.markdown(f"<span class='badge-weak'>~ {s['skill']}</span>", unsafe_allow_html=True)
                    st.caption(f"{s['reason']}")
            else:
                st.info("No partial skills identified.")
                
        with sg_col3:
            st.markdown("#### 🔴 Missing Skills (To Acquire)")
            if gap_results["missing_skills"]:
                for s in gap_results["missing_skills"]:
                    priority_label = f"[{s['priority']} Priority]"
                    st.markdown(f"<span class='badge-missing'>✗ {s['skill']} {priority_label}</span>", unsafe_allow_html=True)
                    st.caption(f"{s['reason']}")
            else:
                st.success("Congratulations! You possess all required skills for this role.")

# ----------------- TAB 3: CAREER ROADMAP & RECOMMENDATIONS -----------------
with tab3:
    if not st.session_state.user_skills:
        st.warning("Please configure your skills in Tab 1.")
    else:
        rec_engine = engines["recommender"]
        recommended_skills = rec_engine.get_skill_recommendations(
            gap_results["missing_skills"],
            gap_results["weak_skills"],
            target_role
        )
        rec_skill_names = [r["skill"] for r in recommended_skills]
        recommended_projects = rec_engine.get_project_recommendations(
            target_role,
            st.session_state.user_skills,
            rec_skill_names
        )
        recommended_resources = rec_engine.get_resource_recommendations(rec_skill_names)
        
        roadmap_stages = engines["roadmap"].generate_roadmap(
            st.session_state.user_skills,
            target_role,
            gap_results,
            recommended_projects
        )
        
        st.subheader(f"🗺️ Personalized 5-Stage Career Roadmap for {target_role}")
        st.write("Structured step-by-step pathway from your current level to job-ready production standards.")
        
        for stage in roadmap_stages:
            with st.expander(f"📍 {stage['stage_title']} &bull; Status: {stage['status']} ({stage['estimated_duration']})", expanded=True):
                st.markdown(f"**Focus Area:** {stage['focus']}")
                
                if "skills" in stage and stage["skills"]:
                    st.markdown("**Skills in this stage:**")
                    for sk in stage["skills"]:
                        icon = "✅" if sk["already_started"] else "🎯"
                        st.markdown(f"- **{sk['skill']}** ({sk['badge']}) — {sk['topic']}")
                        st.caption(f"Reason: {sk['why_needed']}")
                        
                if "projects" in stage and stage["projects"]:
                    st.markdown("**Recommended Milestone Projects:**")
                    for proj in stage["projects"]:
                        st.markdown(f"#### 💼 {proj['title']} ({proj['difficulty']})")
                        st.markdown(f"*{proj['description']}*")
                        st.markdown(f"**Skills Built:** `{', '.join(proj['skills_covered'])}`")
                        st.markdown(f"**Expected Deliverables:** {proj['deliverables']}")
                        st.caption(f"💡 Why recommended: {proj['why_recommended']}")
                        st.divider()
                        
                if "action_items" in stage and stage["action_items"]:
                    st.markdown("**Viva, Interview & Career Preparation Checkpoints:**")
                    for item in stage["action_items"]:
                        st.markdown(f"- 📌 {item}")

        st.divider()
        st.subheader("📚 Free Recommended Learning Resources")
        if recommended_resources:
            res_df = pd.DataFrame(recommended_resources)
            st.dataframe(res_df[["skill", "resource_name", "type", "platform", "difficulty", "url"]], use_container_width=True)
        else:
            st.info("No missing resources found for current target skills.")

# ----------------- TAB 4: ML MODELS & EVALUATION (VIVA READY) -----------------
with tab4:
    st.subheader("🔬 Machine Learning Model Architecture & Performance Evaluation")
    st.markdown("""
    This application utilizes three core ML algorithms operating over a preprocessed skill vector space:
    1. **Support Vector Machine (SVM)** — Multi-class career role classifier with probability calibration.
    2. **Random Forest Classifier** — Ensemble readiness predictor evaluating multi-dimensional profile readiness.
    3. **K-Means Clustering** — Unsupervised grouping of engineering students into distinct competency archetypes.
    """)
    
    # Load metrics files
    svm_metrics_path = os.path.join(MODELS_DIR, "svm_metrics.json")
    rf_metrics_path = os.path.join(MODELS_DIR, "random_forest_metrics.json")
    kmeans_metrics_path = os.path.join(MODELS_DIR, "kmeans_metrics.json")
    
    col_m1, col_m2 = st.columns(2)
    
    with col_m1:
        st.markdown("### 1. SVM Career Role Classifier")
        if os.path.exists(svm_metrics_path):
            with open(svm_metrics_path, "r") as f:
                svm_data = json.load(f)
            st.metric("Test Accuracy", f"{svm_data['accuracy']*100:.2f}%")
            st.metric("Weighted F1-Score", f"{svm_data['f1_score']*100:.2f}%")
            st.markdown(f"**Classes ({len(svm_data['classes'])}):** {', '.join(svm_data['classes'])}")
            
            with st.expander("📊 View SVM Confusion Matrix"):
                cm_df = pd.DataFrame(svm_data["confusion_matrix"], index=svm_data["classes"], columns=svm_data["classes"])
                st.dataframe(cm_df)
                
            with st.expander("📋 View Classification Report"):
                st.json(svm_data["classification_report"])
        else:
            st.warning("SVM metrics file not found. Train the model using training/train_svm.py.")

    with col_m2:
        st.markdown("### 2. Random Forest Readiness Classifier")
        if os.path.exists(rf_metrics_path):
            with open(rf_metrics_path, "r") as f:
                rf_data = json.load(f)
            st.metric("Test Accuracy", f"{rf_data['accuracy']*100:.2f}%")
            st.metric("Weighted F1-Score", f"{rf_data['f1_score']*100:.2f}%")
            
            st.markdown("**Feature Importances (Ensemble Tree Splits):**")
            fi_df = pd.DataFrame(list(rf_data["feature_importances"].items()), columns=["Feature", "Importance"]).sort_values(by="Importance", ascending=True)
            st.bar_chart(fi_df.set_index("Feature"))
            
            with st.expander("📊 View Random Forest Confusion Matrix"):
                rf_cm_df = pd.DataFrame(rf_data["confusion_matrix"], index=rf_data["classes"], columns=rf_data["classes"])
                st.dataframe(rf_cm_df)
        else:
            st.warning("Random Forest metrics not found.")

    st.markdown("---")
    st.markdown("### 3. K-Means Student Profile Clustering")
    if os.path.exists(kmeans_metrics_path):
        with open(kmeans_metrics_path, "r") as f:
            km_data = json.load(f)
        st.metric("Silhouette Score", f"{km_data['silhouette_score']:.4f}")
        st.markdown(f"**Optimal Clusters (k):** {km_data['n_clusters']}")
        
        st.markdown("**Cluster Archetype Characteristics:**")
        for cid, prof in km_data["cluster_profiles"].items():
            st.markdown(f"- **Cluster {cid} — {prof['name']}** ({prof['percentage']}% of students):")
            st.caption(f"Top distinguishing skills: {', '.join(prof['top_skills'])}")
    else:
        st.warning("K-Means metrics not found.")

# ----------------- TAB 5: ACADEMIC DOCUMENTATION & VIVA Q&A -----------------
with tab5:
    st.subheader("📚 Academic Project Documentation & Viva Defense Guide")
    
    st.markdown("""
    ### Project Details
    - **Title:** AI-Based Future Skill Gap Analyzer and Career Roadmap Recommendation System
    - **Semester:** 7th Semester B.E./B.Tech Computer Science & Machine Learning
    - **Architecture:** Client-Server / Streamlit Web App with Modular ML Pipeline
    
    #### Key Viva Questions & Answers:
    
    **Q1: Why use Support Vector Machine (SVM) instead of simple rule-matching for career prediction?**  
    *Answer:* Simple keyword matching fails when students have interdisciplinary skills (e.g., both Python and SQL). A linear SVM identifies optimal maximum-margin hyperplanes in a multi-dimensional TF-IDF skill space, learning distinct combination weights that differentiate a Data Scientist from an AI/ML Engineer or Data Analyst.
    
    **Q2: How is the Skill Match percentage calculated mathematically?**  
    *Answer:* Using **Cosine Similarity** between the continuous weighted required vector $\\mathbf{A}$ and student skill indicator vector $\\mathbf{B}$:
    $$\\text{Cosine Similarity} = \\frac{\\mathbf{A} \\cdot \\mathbf{B}}{\\|\\mathbf{A}\\| \\|\\mathbf{B}\\|}$$
    Core skills receive an empirical weight of 1.5 while supporting skills receive 1.0, ensuring that missing core skills penalize the cosine score proportionally.
    
    **Q3: How does the system evaluate explainability?**  
    *Answer:* The system avoids black-box predictions. For every missing skill, the gap analyzer explains whether it is a core or supporting requirement. For career classification, posterior class probabilities are exposed. For readiness, individual point contributions (skills, experience, projects, certifications) are enumerated transparently.
    
    **Q4: What is the Silhouette Score in your K-Means clustering?**  
    *Answer:* The Silhouette Score measures how similar an object is to its own cluster compared to other clusters, ranging from -1 to +1. Our trained model achieves ~0.19 over high-dimensional sparse TF-IDF vectors, reflecting distinct technical profiles while respecting realistic cross-domain skill overlap.
    """)
