export interface SkillItem {
  skill: string;
  category: string;
  synonyms?: string[];
}

export interface CareerRole {
  role_name: string;
  core_skills: string[];
  supporting_skills: string[];
  description: string;
  market_demand: string;
  focus_area: string;
}

export interface ProjectItem {
  role: string;
  project_title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  skills_covered: string[];
  description: string;
  deliverables: string;
  why_recommended?: string;
  gaps_addressed?: string[];
}

export interface LearningResource {
  skill: string;
  resource_name: string;
  type: string;
  platform: string;
  difficulty: string;
  cost: string;
  url: string;
}

export interface SkillGapItem {
  skill: string;
  status: "Strong" | "Weak" | "Missing";
  priority?: "High" | "Medium" | "Low";
  is_core?: boolean;
  reason: string;
  evidence_level?: string;
}

export interface AnalysisResult {
  targetRole: string;
  matchPercentage: number;
  similarityBreakdown: {
    cosine_similarity: number;
    dot_product: number;
    core_skills_matched: number;
    core_skills_total: number;
    core_overlap_ratio: number;
  };
  svmResult: {
    predicted_role: string;
    confidence: number;
    is_low_confidence: boolean;
    warning?: string | null;
    role_probabilities: Record<string, number>;
    ranking: [string, number][];
  };
  readinessTransparent: {
    score: number;
    benchmark_category: string;
    breakdown: {
      core_skills_score: number;
      core_max: number;
      supporting_skills_score: number;
      supporting_max: number;
      projects_score: number;
      projects_max: number;
      experience_score: number;
      experience_max: number;
      certifications_score: number;
      certifications_max: number;
      core_matched_count: number;
      core_total_count: number;
    };
  };
  readinessRF: {
    predicted_category: string;
    confidence: number;
    probabilities: Record<string, number>;
  };
  gaps: {
    target_role: string;
    strong_skills: SkillGapItem[];
    weak_skills: SkillGapItem[];
    missing_skills: SkillGapItem[];
    counts: {
      strong: number;
      weak: number;
      missing: number;
      high_priority_missing: number;
    };
  };
  cluster: any;
  predicted_role?: string;
  svm_confidence?: number;
  readiness_category?: string;
  readiness_score?: number;
  skill_match?: number;
  cluster_details?: {
    cluster_id: number;
    cluster_name: string;
    explanation: string;
    distance_to_centroid?: number;
  };
  strong_skills?: string[];
  developing_skills?: string[];
  missing_skills?: string[];
  recommended_projects?: ProjectItem[];
  recommendedProjects: ProjectItem[];
  recommendedSkills: {
    skill: string;
    priority: string;
    status: string;
    why_recommended: string;
    learning_type: string;
  }[];
  recommendedResources: LearningResource[];
  roadmap: {
    stage_title: string;
    focus: string;
    status: string;
    estimated_duration: string;
    skills?: {
      skill: string;
      already_started: boolean;
      topic: string;
      why_needed: string;
      badge: string;
    }[];
    projects?: ProjectItem[];
    action_items?: string[];
  }[];
}

export interface ModelMetrics {
  svm?: {
    model_name: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    classes: string[];
    confusion_matrix: number[][];
    classification_report: any;
    train_samples: number;
    test_samples: number;
  };
  rf?: {
    model_name: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    classes: string[];
    feature_names: string[];
    feature_importances: Record<string, number>;
    confusion_matrix: number[][];
  };
  km?: {
    model_name: string;
    n_clusters: number;
    silhouette_score: number;
    total_samples: number;
    cluster_profiles: Record<
      string,
      {
        name: string;
        size: number;
        percentage: number;
        top_skills: string[];
        description: string;
      }
    >;
  };
}
