import { CareerRole, SkillItem, ProjectItem, LearningResource } from "../types";

export const CANONICAL_SKILLS: SkillItem[] = [
  { skill: "Python", category: "Programming", synonyms: ["python", "py", "python3"] },
  { skill: "NumPy", category: "ML/AI", synonyms: ["numpy", "np"] },
  { skill: "Pandas", category: "Data", synonyms: ["pandas", "pd"] },
  { skill: "Scikit-learn", category: "ML/AI", synonyms: ["scikit-learn", "sklearn", "scikit learn"] },
  { skill: "Machine Learning", category: "ML/AI", synonyms: ["machine learning", "ml", "statistical learning"] },
  { skill: "Deep Learning", category: "ML/AI", synonyms: ["deep learning", "dl", "neural networks"] },
  { skill: "TensorFlow", category: "ML/AI", synonyms: ["tensorflow", "tf", "tf2"] },
  { skill: "PyTorch", category: "ML/AI", synonyms: ["pytorch", "torch", "py torch"] },
  { skill: "NLP", category: "ML/AI", synonyms: ["nlp", "natural language processing", "text mining"] },
  { skill: "Computer Vision", category: "ML/AI", synonyms: ["computer vision", "cv", "opencv", "image processing"] },
  { skill: "Statistics", category: "Math/Stats", synonyms: ["statistics", "stats", "hypothesis testing"] },
  { skill: "Probability", category: "Math/Stats", synonyms: ["probability", "bayesian", "probabilistic models"] },
  { skill: "Feature Engineering", category: "ML/AI", synonyms: ["feature engineering", "data preprocessing", "pca"] },
  { skill: "Model Deployment", category: "ML/AI", synonyms: ["model deployment", "model serving", "fastapi"] },
  { skill: "MLOps", category: "ML/AI", synonyms: ["mlops", "mlflow", "dvc", "wandb"] },
  { skill: "SQL", category: "Data", synonyms: ["sql", "postgresql", "mysql", "sqlite", "t-sql"] },
  { skill: "Excel", category: "Data", synonyms: ["excel", "ms excel", "spreadsheets", "vlookup"] },
  { skill: "Power BI", category: "Data", synonyms: ["power bi", "powerbi", "power-bi"] },
  { skill: "Tableau", category: "Data", synonyms: ["tableau", "tableau desktop"] },
  { skill: "Data Visualization", category: "Data", synonyms: ["data visualization", "matplotlib", "seaborn", "plotly"] },
  { skill: "Data Cleaning", category: "Data", synonyms: ["data cleaning", "data wrangling", "data munging"] },
  { skill: "Data Structures", category: "Programming", synonyms: ["data structures", "dsa", "trees", "graphs"] },
  { skill: "Algorithms", category: "Programming", synonyms: ["algorithms", "algorithm design", "sorting"] },
  { skill: "OOP", category: "Programming", synonyms: ["oop", "object-oriented programming", "object oriented"] },
  { skill: "Java", category: "Programming", synonyms: ["java", "core java", "j2se"] },
  { skill: "C++", category: "Programming", synonyms: ["c++", "cpp"] },
  { skill: "JavaScript", category: "Programming", synonyms: ["javascript", "js", "typescript", "es6"] },
  { skill: "Git", category: "DevOps", synonyms: ["git", "github", "gitlab", "version control"] },
  { skill: "REST API", category: "Programming", synonyms: ["rest api", "restful", "api design"] },
  { skill: "Linux", category: "DevOps", synonyms: ["linux", "ubuntu", "bash", "shell scripting"] },
  { skill: "Networking", category: "Security", synonyms: ["networking", "tcp/ip", "dns", "osi model"] },
  { skill: "Cybersecurity Fundamentals", category: "Security", synonyms: ["cybersecurity", "infosec", "information security"] },
  { skill: "Cryptography", category: "Security", synonyms: ["cryptography", "encryption", "rsa", "aes"] },
  { skill: "Security Tools", category: "Security", synonyms: ["security tools", "wireshark", "nmap", "metasploit"] },
  { skill: "Threat Detection", category: "Security", synonyms: ["threat detection", "incident response", "threat hunting"] },
  { skill: "Vulnerability Assessment", category: "Security", synonyms: ["vulnerability assessment", "pentesting", "vulnerability scanning"] },
  { skill: "SIEM", category: "Security", synonyms: ["siem", "splunk", "qradar", "elk security"] },
  { skill: "Ethical Hacking", category: "Security", synonyms: ["ethical hacking", "white hat", "penetration testing"] },
  { skill: "Cloud Fundamentals", category: "Cloud", synonyms: ["cloud fundamentals", "cloud computing", "cloud architecture"] },
  { skill: "AWS", category: "Cloud", synonyms: ["aws", "amazon web services", "ec2", "s3"] },
  { skill: "Azure", category: "Cloud", synonyms: ["azure", "microsoft azure"] },
  { skill: "GCP", category: "Cloud", synonyms: ["gcp", "google cloud", "google cloud platform"] },
  { skill: "Virtualization", category: "Cloud", synonyms: ["virtualization", "docker", "containers", "vmware"] },
  { skill: "Docker", category: "DevOps", synonyms: ["docker", "containerization", "dockerfile"] },
  { skill: "Kubernetes", category: "DevOps", synonyms: ["kubernetes", "k8s"] },
  { skill: "CI/CD", category: "DevOps", synonyms: ["ci/cd", "jenkins", "github actions"] },
  { skill: "Communication", category: "Soft Skills", synonyms: ["communication", "verbal communication"] },
  { skill: "Problem Solving", category: "Soft Skills", synonyms: ["problem solving", "analytical thinking"] },
  { skill: "Teamwork", category: "Soft Skills", synonyms: ["teamwork", "collaboration"] },
  { skill: "Agile", category: "Soft Skills", synonyms: ["agile", "scrum", "kanban"] },
];

export const CAREER_ROLES_DATA: CareerRole[] = [
  {
    role_name: "AI/ML Engineer",
    core_skills: ["Python", "NumPy", "Pandas", "Scikit-learn", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision"],
    supporting_skills: ["Statistics", "SQL", "Model Deployment", "MLOps", "Cloud Fundamentals", "Git", "Docker"],
    description: "Designs, builds, evaluates, and deploys predictive machine learning and deep learning models to production environments.",
    market_demand: "Very High",
    focus_area: "Artificial Intelligence & Production Systems"
  },
  {
    role_name: "Data Scientist",
    core_skills: ["Python", "Pandas", "NumPy", "SQL", "Statistics", "Probability", "Machine Learning", "Data Visualization", "Scikit-learn"],
    supporting_skills: ["Feature Engineering", "NLP", "Deep Learning", "Git", "Communication", "Problem Solving"],
    description: "Extracts actionable business insights and formulates probabilistic statistical models and predictive algorithms from structured and unstructured data.",
    market_demand: "High",
    focus_area: "Statistical Modeling & Business Insights"
  },
  {
    role_name: "Data Analyst",
    core_skills: ["Excel", "SQL", "Python", "Pandas", "Statistics", "Data Cleaning", "Data Visualization", "Power BI"],
    supporting_skills: ["Tableau", "Problem Solving", "Communication", "Git"],
    description: "Analyzes historical business trends, transforms operational data, and creates visual dashboards and KPI tracking reports for decision makers.",
    market_demand: "High",
    focus_area: "Data Analytics & BI Dashboards"
  },
  {
    role_name: "Software Developer",
    core_skills: ["Programming", "Data Structures", "Algorithms", "OOP", "Git", "Database", "SQL", "REST API", "Software Development"],
    supporting_skills: ["Python", "Java", "C++", "JavaScript", "Linux", "Docker", "CI/CD", "Agile"],
    description: "Architects, codes, tests, and maintains scalable software applications, backend services, and robust APIs following software engineering best practices.",
    market_demand: "Very High",
    focus_area: "Full-Stack & Backend Systems"
  },
  {
    role_name: "Cybersecurity Analyst",
    core_skills: ["Networking", "Linux", "Python", "Cybersecurity Fundamentals", "Cryptography", "Security Tools", "Threat Detection", "Vulnerability Assessment"],
    supporting_skills: ["SIEM", "Ethical Hacking", "Problem Solving", "Communication", "Git"],
    description: "Monitors enterprise infrastructure, defends against security breaches, conducts threat hunting, vulnerability scanning, and incident mitigation.",
    market_demand: "Very High",
    focus_area: "Infrastructure Security & Threat Intelligence"
  },
  {
    role_name: "Cloud Engineer",
    core_skills: ["Linux", "Networking", "Python", "Cloud Fundamentals", "AWS", "Virtualization", "Databases", "Security"],
    supporting_skills: ["Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Git", "Cloud Architecture"],
    description: "Architects, provisions, and automates high-availability cloud infrastructure, migration pipelines, container orchestration, and serverless architectures.",
    market_demand: "High",
    focus_area: "Cloud Architecture & DevOps Systems"
  }
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    role: "AI/ML Engineer",
    project_title: "Deep Learning Image Classifier",
    difficulty: "Intermediate",
    skills_covered: ["Python", "PyTorch", "Deep Learning", "Computer Vision"],
    description: "Build a Convolutional Neural Network (ResNet/Custom CNN) trained on CIFAR-10 or medical scans to classify visual images with Grad-CAM visualization.",
    deliverables: "PyTorch training pipeline + interactive inference script"
  },
  {
    role: "AI/ML Engineer",
    project_title: "NLP Sentiment Analysis & Semantic Search",
    difficulty: "Intermediate",
    skills_covered: ["Python", "NLP", "Scikit-learn", "PyTorch"],
    description: "Develop a Transformer-based or TF-IDF + LSTM sentiment analyzer and document semantic search system using cosine similarity over embeddings.",
    deliverables: "Trained NLP model + evaluation report + live API"
  },
  {
    role: "AI/ML Engineer",
    project_title: "End-to-End MLOps Model Deployment Pipeline",
    difficulty: "Advanced",
    skills_covered: ["Python", "Scikit-learn", "Model Deployment", "MLOps", "Docker"],
    description: "Package a trained scikit-learn/PyTorch pipeline inside FastAPI and Docker with continuous monitoring and automated drift detection.",
    deliverables: "Dockerized REST API + Swagger documentation + Dockerfile"
  },
  {
    role: "Data Scientist",
    project_title: "Customer Churn Prediction & Survival Analysis",
    difficulty: "Intermediate",
    skills_covered: ["Python", "Pandas", "NumPy", "Scikit-learn", "Statistics", "Probability"],
    description: "Conduct exploratory data analysis, hypothesis testing, feature importance analysis using SHAP, and train Random Forest/XGBoost for customer retention.",
    deliverables: "Jupyter Notebook with EDA + model comparison + executive summary"
  },
  {
    role: "Data Scientist",
    project_title: "Sales Demand Forecasting System",
    difficulty: "Intermediate",
    skills_covered: ["Python", "Pandas", "NumPy", "Statistics", "Machine Learning"],
    description: "Forecast retail inventory demand using time series decomposition (ARIMA/Prophet) and regression ensemble trees.",
    deliverables: "Forecast evaluation dashboard + error metrics (RMSE/MAPE)"
  },
  {
    role: "Data Analyst",
    project_title: "Interactive Business Intelligence Sales KPI Dashboard",
    difficulty: "Beginner",
    skills_covered: ["Excel", "SQL", "Power BI", "Data Visualization"],
    description: "Extract transaction data using complex SQL queries (JOINs, Window functions), clean dirty rows, and design executive Power BI dashboards.",
    deliverables: "Interactive Power BI dashboard (.pbix) + SQL scripts"
  },
  {
    role: "Data Analyst",
    project_title: "Healthcare Patient Admission Trends & Cost Analysis",
    difficulty: "Intermediate",
    skills_covered: ["SQL", "Python", "Pandas", "Data Cleaning", "Data Visualization"],
    description: "Wrangle hospital patient records, perform statistical correlation tests on wait times and readmission rates, and export findings to Tableau.",
    deliverables: "Analytical report + Seaborn visualization charts"
  },
  {
    role: "Software Developer",
    project_title: "Scalable Microservices E-Commerce REST API",
    difficulty: "Intermediate",
    skills_covered: ["Data Structures", "OOP", "REST API", "SQL", "Git", "Docker"],
    description: "Design an e-commerce backend with authentication, product catalog, cart checkout, and relational PostgreSQL database schema.",
    deliverables: "RESTful OpenAPI spec + automated unit tests + Git repository"
  },
  {
    role: "Cybersecurity Analyst",
    project_title: "Automated Network Intrusion & Port Scanner",
    difficulty: "Intermediate",
    skills_covered: ["Python", "Networking", "Linux", "Security Tools"],
    description: "Create a multi-threaded network scanner with TCP SYN/ACK handshake detection and banner grabbing to discover active host vulnerabilities.",
    deliverables: "Python CLI tool + vulnerability summary report"
  },
  {
    role: "Cloud Engineer",
    project_title: "Automated Multi-Tier AWS Infrastructure via Terraform",
    difficulty: "Intermediate",
    skills_covered: ["Linux", "Networking", "Cloud Fundamentals", "AWS", "Virtualization"],
    description: "Provision a high-availability VPC with public/private subnets, Application Load Balancer, and auto-scaling EC2 instances.",
    deliverables: "Terraform IaC scripts + architecture topology diagram"
  }
];

export const LEARNING_RESOURCES_DATA: LearningResource[] = [
  { skill: "Python", resource_name: "Python Official Tutorial", type: "Documentation", platform: "Python.org", difficulty: "Beginner", cost: "Free", url: "https://docs.python.org/3/tutorial/" },
  { skill: "Python", resource_name: "Python for Everybody (FreeCodeCamp)", type: "Course", platform: "YouTube / FreeCodeCamp", difficulty: "Beginner", cost: "Free", url: "https://www.py4e.com/" },
  { skill: "NumPy", resource_name: "NumPy Quickstart & User Guide", type: "Documentation", platform: "NumPy.org", difficulty: "Beginner", cost: "Free", url: "https://numpy.org/doc/stable/user/quickstart.html" },
  { skill: "Pandas", resource_name: "Pandas 10-Minute Walkthrough", type: "Documentation", platform: "Pandas PyData", difficulty: "Beginner", cost: "Free", url: "https://pandas.pydata.org/docs/user_guide/10min.html" },
  { skill: "Scikit-learn", resource_name: "Scikit-Learn Machine Learning in Python", type: "Documentation", platform: "Scikit-Learn.org", difficulty: "Intermediate", cost: "Free", url: "https://scikit-learn.org/stable/tutorial/" },
  { skill: "Machine Learning", resource_name: "Stanford Machine Learning Specialization", type: "Course", platform: "DeepLearning.AI / Coursera", difficulty: "Intermediate", cost: "Free", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
  { skill: "Deep Learning", resource_name: "Deep Learning Specialization (Andrew Ng)", type: "Course", platform: "YouTube / Coursera", difficulty: "Intermediate", cost: "Free", url: "https://www.deeplearning.ai/courses/deep-learning-specialization/" },
  { skill: "TensorFlow", resource_name: "TensorFlow Core Tutorials", type: "Documentation", platform: "TensorFlow.org", difficulty: "Intermediate", cost: "Free", url: "https://www.tensorflow.org/tutorials" },
  { skill: "PyTorch", resource_name: "PyTorch 60-Minute Blitz", type: "Documentation", platform: "PyTorch.org", difficulty: "Intermediate", cost: "Free", url: "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html" },
  { skill: "NLP", resource_name: "Hugging Face NLP Course", type: "Course", platform: "Hugging Face", difficulty: "Intermediate", cost: "Free", url: "https://huggingface.co/learn/nlp-course" },
  { skill: "Computer Vision", resource_name: "OpenCV Python Tutorials", type: "Documentation", platform: "OpenCV.org", difficulty: "Intermediate", cost: "Free", url: "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html" },
  { skill: "Statistics", resource_name: "Khan Academy Statistics and Probability", type: "Course", platform: "Khan Academy", difficulty: "Beginner", cost: "Free", url: "https://www.khanacademy.org/math/statistics-probability" },
  { skill: "SQL", resource_name: "Mode Analytics SQL Tutorial for Data Analysis", type: "Practice", platform: "Mode Analytics", difficulty: "Beginner", cost: "Free", url: "https://mode.com/sql-tutorial/" },
  { skill: "Power BI", resource_name: "Microsoft Power BI Guided Learning", type: "Documentation", platform: "Microsoft Learn", difficulty: "Beginner", cost: "Free", url: "https://learn.microsoft.com/power-bi/" },
  { skill: "Data Structures", resource_name: "NeetCode 150 & Algorithms Roadmap", type: "Practice", platform: "NeetCode", difficulty: "Intermediate", cost: "Free", url: "https://neetcode.io/roadmap" },
  { skill: "Linux", resource_name: "Linux Journey - Learn Linux Command Line", type: "Tutorial", platform: "Linux Journey", difficulty: "Beginner", cost: "Free", url: "https://linuxjourney.com/" },
  { skill: "Cloud Fundamentals", resource_name: "AWS Skill Builder Cloud Practitioner Essentials", type: "Course", platform: "Amazon AWS", difficulty: "Beginner", cost: "Free", url: "https://explore.skillbuilder.aws/" },
  { skill: "Docker", resource_name: "Docker Getting Started Guide", type: "Documentation", platform: "Docker Docs", difficulty: "Beginner", cost: "Free", url: "https://docs.docker.com/get-started/" }
];
