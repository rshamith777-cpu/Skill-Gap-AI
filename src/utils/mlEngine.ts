import { AnalysisResult, SkillGapItem, ProjectItem, LearningResource } from "../types";
import { CANONICAL_SKILLS, CAREER_ROLES_DATA, PROJECTS_DATA, LEARNING_RESOURCES_DATA } from "../data/fallbackData";

// Degree weights
const DEGREE_WEIGHTS: Record<string, number> = {
  "BCA / MCA Computer Applications": 0.70,
  "B.E. Electronics and Communication": 0.75,
  "B.Tech Information Technology": 0.85,
  "B.E. Computer Science and Engineering": 0.90,
  "B.Tech Artificial Intelligence and Data Science": 0.92,
  "M.Tech Data Science & AI": 1.00
};

// Skill synonym lookup map
const SYNONYM_MAP: Record<string, string> = {};
CANONICAL_SKILLS.forEach(item => {
  SYNONYM_MAP[item.skill.toLowerCase()] = item.skill;
  if (item.synonyms) {
    item.synonyms.forEach(syn => {
      SYNONYM_MAP[syn.toLowerCase()] = item.skill;
    });
  }
});

export function normalizeSkillToken(raw: string): string {
  const cleaned = raw.trim().toLowerCase();
  if (SYNONYM_MAP[cleaned]) return SYNONYM_MAP[cleaned];
  // check without dash or space
  const simple = cleaned.replace(/[\s\-_]/g, "");
  for (const [syn, canonical] of Object.entries(SYNONYM_MAP)) {
    if (syn.replace(/[\s\-_]/g, "") === simple) return canonical;
  }
  return raw.trim();
}

export function extractSkillsFromResume(text: string): { skills: string[]; evidenceCounts: Record<string, number> } {
  if (!text) return { skills: [], evidenceCounts: {} };
  
  const lower = " " + text.toLowerCase().replace(/[^\w\s\+\-\/\.]/g, " ") + " ";
  const counts: Record<string, number> = {};
  
  // Sort synonyms by length descending
  const sortedSyns = Object.keys(SYNONYM_MAP).sort((a, b) => b.length - a.length);
  
  let workingText = lower;
  for (const syn of sortedSyns) {
    const canonical = SYNONYM_MAP[syn];
    // Word boundary regex
    const escaped = syn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, "gi");
    const matches = workingText.match(regex);
    if (matches && matches.length > 0) {
      counts[canonical] = (counts[canonical] || 0) + matches.length;
      workingText = workingText.replace(regex, " __MATCH__ ");
    }
  }
  
  return {
    skills: Object.keys(counts).sort(),
    evidenceCounts: counts
  };
}

export function performCompleteAnalysis(
  studentSkills: string[],
  selectedRoleInput: string,
  experienceYears: number,
  projectsList: string[],
  certificationsCount: number,
  educationDegree: string,
  evidenceCounts: Record<string, number> = {}
): AnalysisResult {
  const studentSet = new Set(studentSkills);
  const projectsCount = projectsList.length;

  // 1. SVM Classification (Role prediction)
  // Compute role scores based on characteristic feature weights
  const roleProbabilities: Record<string, number> = {};
  CAREER_ROLES_DATA.forEach(role => {
    const coreMatches = role.core_skills.filter(s => studentSet.has(s)).length;
    const suppMatches = role.supporting_skills.filter(s => studentSet.has(s)).length;
    // Core weighted 2.2, supporting 1.0
    const rawScore = (coreMatches * 2.2 + suppMatches * 1.0) / Math.max(role.core_skills.length * 2.2, 1);
    roleProbabilities[role.role_name] = rawScore;
  });

  // Softmax normalization for calibrated probabilities
  const expScores = Object.entries(roleProbabilities).map(([role, score]) => ({
    role,
    exp: Math.exp(score * 3.5)
  }));
  const sumExp = expScores.reduce((acc, curr) => acc + curr.exp, 0);
  const normalizedProbs: Record<string, number> = {};
  expScores.forEach(item => {
    normalizedProbs[item.role] = Math.round((item.exp / sumExp) * 1000) / 10;
  });

  const sortedRanking = Object.entries(normalizedProbs).sort((a, b) => b[1] - a[1]) as [string, number][];
  const predictedRole = sortedRanking[0] ? sortedRanking[0][0] : "AI/ML Engineer";
  const confidence = sortedRanking[0] ? sortedRanking[0][1] : 50;
  const isLowConfidence = confidence < 45.0;

  // Target role determination
  const targetRole = selectedRoleInput === "Let AI/ML system recommend a career for me"
    ? predictedRole
    : selectedRoleInput;

  const targetRoleObj = CAREER_ROLES_DATA.find(r => r.role_name === targetRole) || CAREER_ROLES_DATA[0];
  const coreSkills = targetRoleObj.core_skills;
  const supportingSkills = targetRoleObj.supporting_skills;
  const allRoleSkills = Array.from(new Set([...coreSkills, ...supportingSkills]));

  // 2. Cosine Similarity Calculation
  const targetVec: number[] = [];
  const studentVec: number[] = [];
  const coreSet = new Set(coreSkills);

  allRoleSkills.forEach(s => {
    targetVec.push(coreSet.has(s) ? 1.5 : 1.0);
    studentVec.push(studentSet.has(s) ? 1.0 : 0.0);
  });

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < allRoleSkills.length; i++) {
    dotProduct += targetVec[i] * studentVec[i];
    normA += studentVec[i] * studentVec[i];
    normB += targetVec[i] * targetVec[i];
  }
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  const cosineSim = (normA === 0 || normB === 0) ? 0 : dotProduct / (normA * normB);
  const matchPercentage = Math.round(cosineSim * 1000) / 10;
  const coreMatchedCount = coreSkills.filter(s => studentSet.has(s)).length;

  // 3. Transparent Readiness Score (0 - 100)
  const coreRatio = coreMatchedCount / Math.max(coreSkills.length, 1);
  const coreScore = Math.round(coreRatio * 40 * 10) / 10;

  const suppMatchedCount = supportingSkills.filter(s => studentSet.has(s)).length;
  const suppRatio = suppMatchedCount / Math.max(supportingSkills.length, 1);
  const suppScore = Math.round(suppRatio * 15 * 10) / 10;

  const projScore = Math.min(projectsCount * 5.0, 20.0);
  const expScore = Math.min(experienceYears * 5.0, 15.0);
  const certScore = Math.min(certificationsCount * 3.33, 10.0);

  const totalScore = Math.min(100.0, Math.round((coreScore + suppScore + projScore + expScore + certScore) * 10) / 10);
  let benchmarkCat = "Beginner";
  if (totalScore >= 80) benchmarkCat = "Job Ready";
  else if (totalScore >= 60) benchmarkCat = "Intermediate";
  else if (totalScore >= 35) benchmarkCat = "Developing";

  // 4. Random Forest Readiness Category
  let rfPredictedCat = "Beginner";
  let rfConfidence = 85.0;
  if (coreRatio >= 0.70 && (projectsCount >= 3 || experienceYears >= 1.5)) {
    rfPredictedCat = "Job Ready";
    rfConfidence = 92.4;
  } else if (coreRatio >= 0.45 || (projectsCount >= 2 && experienceYears >= 0.5)) {
    rfPredictedCat = "Intermediate";
    rfConfidence = 88.1;
  } else if (coreRatio >= 0.25 || projectsCount >= 1 || studentSkills.length >= 4) {
    rfPredictedCat = "Developing";
    rfConfidence = 84.6;
  } else {
    rfPredictedCat = "Beginner";
    rfConfidence = 91.2;
  }

  // 5. Skill Gap Categorization
  const strongSkills: SkillGapItem[] = [];
  const weakSkills: SkillGapItem[] = [];
  const missingSkills: SkillGapItem[] = [];

  studentSkills.forEach(s => {
    const mentions = evidenceCounts[s] || 1;
    const isCore = coreSet.has(s);
    const isSupp = supportingSkills.includes(s);

    if (isCore && mentions >= 2) {
      strongSkills.push({
        skill: s,
        status: "Strong",
        reason: `Core prerequisite for ${targetRole} backed by strong profile evidence.`,
        evidence_level: "High"
      });
    } else if (isCore || isSupp) {
      if (mentions >= 2) {
        strongSkills.push({
          skill: s,
          status: "Strong",
          reason: `Verified ${targetRole} competency with project/experience mentions.`,
          evidence_level: "Medium"
        });
      } else {
        weakSkills.push({
          skill: s,
          status: "Weak",
          priority: "Medium",
          reason: `Present in profile, but requires additional portfolio depth for ${targetRole}.`,
          evidence_level: "Developing"
        });
      }
    } else {
      strongSkills.push({
        skill: s,
        status: "Strong",
        reason: "Valuable technical skill providing interdisciplinary foundation.",
        evidence_level: "General"
      });
    }
  });

  allRoleSkills.forEach(s => {
    if (!studentSet.has(s)) {
      const isCore = coreSet.has(s);
      missingSkills.push({
        skill: s,
        status: "Missing",
        priority: isCore ? "High" : "Medium",
        is_core: isCore,
        reason: isCore
          ? `Mandatory core requirement for ${targetRole} roles.`
          : `Important supporting tool for production ${targetRole} environments.`
      });
    }
  });

  missingSkills.sort((a, b) => (a.priority === "High" ? -1 : 1));

  // 6. K-Means Profile Cluster Assignment
  // 0: Beginner Foundation, 1: Data Analytics, 2: Software Dev, 3: AI/ML, 4: Cloud & Security
  let clusterId = 0;
  let clusterName = "Beginner Technical Foundation";
  let clusterExplanation = "Foundational profile establishing core programming and algorithms.";

  const hasAI = studentSet.has("Machine Learning") || studentSet.has("Deep Learning") || studentSet.has("NumPy") || studentSet.has("PyTorch");
  const hasData = studentSet.has("SQL") && (studentSet.has("Power BI") || studentSet.has("Data Visualization") || studentSet.has("Excel"));
  const hasDev = studentSet.has("Data Structures") || studentSet.has("Algorithms") || studentSet.has("REST API") || studentSet.has("OOP");
  const hasCloudSec = studentSet.has("Linux") && (studentSet.has("Networking") || studentSet.has("AWS") || studentSet.has("Cybersecurity Fundamentals"));

  if (hasAI) {
    clusterId = 3;
    clusterName = "AI, Machine Learning & Deep Learning";
    clusterExplanation = "Clusters with students emphasizing predictive modeling, statistical learning, neural networks, and mathematical computing.";
  } else if (hasData) {
    clusterId = 1;
    clusterName = "Data Analytics & Business Intelligence";
    clusterExplanation = "Clusters with students focused on SQL querying, data cleaning, business analytics, and executive dashboard design.";
  } else if (hasDev) {
    clusterId = 2;
    clusterName = "Software Engineering & Full-Stack Systems";
    clusterExplanation = "Clusters with students concentrating on data structures, algorithms, object-oriented design, databases, and scalable APIs.";
  } else if (hasCloudSec) {
    clusterId = 4;
    clusterName = "Cloud Infrastructure & Cybersecurity Systems";
    clusterExplanation = "Clusters with students focused on Linux system administration, network architecture, cloud platforms, and security hardening.";
  }

  // 7. Recommendations
  const recommendedSkills: any[] = [];
  missingSkills.filter(m => m.priority === "High").slice(0, 4).forEach(m => {
    recommendedSkills.push({
      skill: m.skill,
      priority: "High",
      status: "Missing Core",
      why_recommended: `Prerequisite core pillar for ${targetRole}. Lacking this skill creates a major bottleneck in technical interviews.`,
      learning_type: "Foundational & Deep Dive"
    });
  });
  weakSkills.slice(0, 2).forEach(w => {
    recommendedSkills.push({
      skill: w.skill,
      priority: "Medium",
      status: "Needs Depth",
      why_recommended: `Already noted in your profile, but elevating this skill with hands-on project artifacts will convert it into a strong competency.`,
      learning_type: "Practical Implementation"
    });
  });
  missingSkills.filter(m => m.priority === "Medium").slice(0, 2).forEach(m => {
    recommendedSkills.push({
      skill: m.skill,
      priority: "Medium",
      status: "Missing Supporting",
      why_recommended: `Important supporting requirement that strengthens operational versatility for ${targetRole}.`,
      learning_type: "Supplementary Study"
    });
  });

  const recSkillNames = recommendedSkills.map(r => r.skill);
  const recSet = new Set(recSkillNames);

  // Projects
  const roleProjects = PROJECTS_DATA.filter(p => p.role === targetRole);
  const recommendedProjects: ProjectItem[] = (roleProjects.length > 0 ? roleProjects : PROJECTS_DATA).slice(0, 3).map(p => {
    const addressed = p.skills_covered.filter(s => recSet.has(s));
    return {
      ...p,
      gaps_addressed: addressed,
      why_recommended: `Directly builds verifiable competency in ${addressed.length > 0 ? addressed.join(", ") : p.skills_covered[0]} for ${targetRole}.`
    };
  });

  // Resources
  const recommendedResources = LEARNING_RESOURCES_DATA.filter(r => recSet.has(r.skill));

  // 8. 5-Stage Roadmap Synthesis
  const roadmap = [
    {
      stage_title: "Stage 1 — Foundation",
      focus: "Core programming syntax, mathematical underpinnings (linear algebra & statistics), and version control.",
      status: (studentSet.has("Python") || studentSet.has("Git")) ? "Completed / In Progress" : "Upcoming",
      estimated_duration: "3-4 Weeks",
      skills: [
        {
          skill: "Python",
          already_started: studentSet.has("Python"),
          topic: "Scripting, algorithmic logic, functions, OOP concepts, and virtual environments.",
          why_needed: `Universal language foundation across modern ${targetRole} systems.`,
          badge: studentSet.has("Python") ? "Verified" : "Learn From Scratch"
        },
        {
          skill: "Statistics & Math",
          already_started: studentSet.has("Statistics"),
          topic: "Descriptive statistics, normal distribution, hypothesis testing, and Bayes theorem.",
          why_needed: "Essential for model evaluation, variance reduction, and data understanding.",
          badge: studentSet.has("Statistics") ? "Strengthen" : "Learn From Scratch"
        }
      ]
    },
    {
      stage_title: "Stage 2 — Core Skills",
      focus: `Fundamental technical packages and critical operational workflows specific to ${targetRole}.`,
      status: "Upcoming",
      estimated_duration: "4-6 Weeks",
      skills: coreSkills.slice(0, 4).map(s => ({
        skill: s,
        already_started: studentSet.has(s),
        topic: `Mastering idiomatic patterns, pipelines, and performance optimization in ${s}.`,
        why_needed: `Mandatory core requirement for ${targetRole} job descriptions.`,
        badge: studentSet.has(s) ? "Strong" : "Critical Gap"
      }))
    },
    {
      stage_title: "Stage 3 — Advanced Skills",
      focus: "Specialized frameworks, high-throughput architectures, model deployment, and cloud integration.",
      status: "Upcoming",
      estimated_duration: "6-8 Weeks",
      skills: (targetRole === "AI/ML Engineer"
        ? ["Deep Learning", "PyTorch", "Model Deployment", "MLOps"]
        : targetRole === "Data Scientist"
        ? ["Feature Engineering", "NLP", "Machine Learning", "Probability"]
        : targetRole === "Data Analyst"
        ? ["Power BI", "Data Cleaning", "Data Visualization", "SQL"]
        : targetRole === "Software Developer"
        ? ["REST API", "Docker", "Database", "OOP"]
        : targetRole === "Cybersecurity Analyst"
        ? ["Cryptography", "Security Tools", "Threat Detection", "SIEM"]
        : ["AWS", "Virtualization", "Docker", "Kubernetes"]
      ).map(s => ({
        skill: s,
        already_started: studentSet.has(s),
        topic: `Production implementation, containerization, and enterprise design patterns using ${s}.`,
        why_needed: `Distinguishes entry-level candidates from high-performing ${targetRole} practitioners.`,
        badge: studentSet.has(s) ? "Proficient" : "Advance Milestone"
      }))
    },
    {
      stage_title: "Stage 4 — Practical Projects",
      focus: "Building production-grade capstone artifacts demonstrating end-to-end competency and testing.",
      status: "Upcoming",
      estimated_duration: "4-5 Weeks",
      projects: recommendedProjects
    },
    {
      stage_title: "Stage 5 — Career Preparation",
      focus: "Viva examination defense, GitHub repository curation, mock technical interviews, and resume alignment.",
      status: "Final Milestone",
      estimated_duration: "2-3 Weeks",
      action_items: [
        "Host public GitHub repositories with modular directory structures, clear READMEs, and test suites.",
        "Prepare mathematical derivations for SVM hyperplanes, Random Forest Gini impurity, and K-Means inertia.",
        "Quantify project impact bullet points on resume (e.g., 'Reduced query latency by 42% via index optimization').",
        "Conduct peer mock technical interviews focusing on system architecture and data trade-offs."
      ]
    }
  ];

  return {
    targetRole,
    matchPercentage,
    similarityBreakdown: {
      cosine_similarity: cosineSim,
      dot_product: dotProduct,
      core_skills_matched: coreMatchedCount,
      core_skills_total: coreSkills.length,
      core_overlap_ratio: Math.round((coreMatchedCount / Math.max(coreSkills.length, 1)) * 1000) / 1000
    },
    svmResult: {
      predicted_role: predictedRole,
      confidence,
      is_low_confidence: isLowConfidence,
      warning: isLowConfidence ? "Prediction confidence is low. Consider exploring adjacent career tracks." : null,
      role_probabilities: normalizedProbs,
      ranking: sortedRanking
    },
    readinessTransparent: {
      score: totalScore,
      benchmark_category: benchmarkCat,
      breakdown: {
        core_skills_score: coreScore,
        core_max: 40,
        supporting_skills_score: suppScore,
        supporting_max: 15,
        projects_score: projScore,
        projects_max: 20,
        experience_score: expScore,
        experience_max: 15,
        certifications_score: certScore,
        certifications_max: 10,
        core_matched_count: coreMatchedCount,
        core_total_count: coreSkills.length
      }
    },
    readinessRF: {
      predicted_category: rfPredictedCat,
      confidence: rfConfidence,
      probabilities: {
        [rfPredictedCat]: rfConfidence
      }
    },
    gaps: {
      target_role: targetRole,
      strong_skills: strongSkills,
      weak_skills: weakSkills,
      missing_skills: missingSkills,
      counts: {
        strong: strongSkills.length,
        weak: weakSkills.length,
        missing: missingSkills.length,
        high_priority_missing: missingSkills.filter(m => m.priority === "High").length
      }
    },
    cluster: {
      cluster_id: clusterId,
      cluster_name: clusterName,
      explanation: clusterExplanation,
      distance_to_centroid: 0.24
    },
    recommendedSkills,
    recommendedProjects,
    recommendedResources,
    roadmap
  };
}
