import jsPDF from "jspdf";
import { AnalysisResult } from "../types";

export interface ChecklistState {
  items: {
    id: string;
    text: string;
    stage: string;
    completed: boolean;
  }[];
}

export interface UserFilledProfile {
  name: string;
  degree: string;
  gradYear: number;
  experienceYears: number;
  projectsInput: string;
  certificationsCount: number;
  userSkills: string[];
  targetRole: string;
}

export function buildInitialChecklist(analysis: AnalysisResult): ChecklistState {
  const items: ChecklistState["items"] = [];

  // Stage 1 / Foundation items
  items.push({
    id: "chk-foundation-1",
    text: "Complete core programming & Python syntax foundations",
    stage: "Foundation",
    completed: (analysis.gaps?.strong_skills || []).some(s => s.skill.toLowerCase().includes("python"))
  });

  items.push({
    id: "chk-foundation-2",
    text: "Solidify Linear Algebra, Probability & Statistics essentials",
    stage: "Foundation",
    completed: (analysis.gaps?.strong_skills || []).some(s => s.skill.toLowerCase().includes("stat"))
  });

  // Next Best Skill / Core ML
  const missingCore = (analysis.gaps?.missing_skills || []).filter(s => s.priority === "High");
  const topSkill = missingCore[0]?.skill || "Supervised Machine Learning";

  items.push({
    id: "chk-core-1",
    text: `Master ${topSkill} algorithms & practical scikit-learn implementations`,
    stage: "Core",
    completed: false
  });

  if (missingCore[1]) {
    items.push({
      id: "chk-core-2",
      text: `Acquire proficiency in ${missingCore[1].skill}`,
      stage: "Core",
      completed: false
    });
  }

  // Projects
  const topProject = (analysis.recommended_projects || analysis.recommendedProjects || [])[0];
  const projectTitle = topProject ? topProject.project_title : "End-to-End Prediction System";
  items.push({
    id: "chk-project-1",
    text: `Build and document capstone portfolio: ${projectTitle}`,
    stage: "Practice",
    completed: false
  });

  // Deployment & Portfolio
  items.push({
    id: "chk-deploy-1",
    text: "Containerize model with Docker and publish REST API endpoint",
    stage: "Career Ready",
    completed: false
  });

  items.push({
    id: "chk-portfolio-1",
    text: "Publish GitHub repository with clean README and live architecture demo",
    stage: "Career Ready",
    completed: false
  });

  return { items };
}

/**
 * Generates an executive 2-page, high-density vector PDF Career Report
 * covering:
 * - Page 1: Student Profile, ML Executive Dashboard, In-Depth Skill Gap Diagnosis
 * - Page 2: Personalized 5-Stage Learning Roadmap, Capstone Project Deliverables & Action Checklist
 */
export function generateSkillGapPdf(
  analysis: AnalysisResult,
  checklist: ChecklistState,
  profile: UserFilledProfile | string
) {
  const prof: UserFilledProfile = typeof profile === "string"
    ? {
        name: profile || "Candidate",
        degree: "Computer Science and Engineering",
        gradYear: 2025,
        experienceYears: 0.5,
        projectsInput: (analysis.recommended_projects || analysis.recommendedProjects || [])[0]?.project_title || "Academic Projects",
        certificationsCount: 1,
        userSkills: (analysis.strong_skills || analysis.gaps?.strong_skills?.map(s => s.skill) || []),
        targetRole: analysis.targetRole || "AI/ML Engineer"
      }
    : profile;

  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  // ==========================================
  // PAGE 1: PROFILE, DASHBOARD & SKILL GAP
  // ==========================================

  // 1. Top Header Banner - Professional Deep Slate & Teal Brand
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 90, "F");

  // Accent Line
  doc.setFillColor(13, 148, 136); // teal-600
  doc.rect(0, 0, pageWidth, 4, "F");

  // SkillGapAI Logo / Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.text("SkillGapAI", margin, 36);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(45, 212, 191); // teal-400
  doc.text("EXECUTIVE CAREER REPORT & SKILL GAP DIAGNOSTIC SYSTEM", margin, 52);

  doc.setTextColor(148, 163, 184);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Know Your Gap. Build Your Future. • Standard AI/ML Diagnostic Benchmark", margin, 66);

  // Top Right Info Box
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.setFont("helvetica", "bold");
  doc.text(`CANDIDATE: ${(prof.name || "Learner").toUpperCase()}`, pageWidth - margin, 36, { align: "right" });
  doc.setTextColor(56, 189, 248);
  doc.text(`TARGET GOAL: ${(prof.targetRole || analysis.targetRole || "AI/ML Engineer").toUpperCase()}`, pageWidth - margin, 50, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(`DATE: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}  |  DOC ID: SG-${Math.floor(100000 + Math.random() * 900000)}`, pageWidth - margin, 64, { align: "right" });

  let y = 104;

  // 2. Section: What the Candidate Filled (Student Profile Record)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("1. CANDIDATE PROFILE & TECHNICAL INPUTS", margin, y);
  y += 12;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 68, 4, 4, "FD");

  doc.setFontSize(8);
  // Column 1
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("Candidate Name:", margin + 12, y + 16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(prof.name || "Not specified", margin + 85, y + 16);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("Degree / Stream:", margin + 12, y + 32);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(prof.degree || "B.E. Computer Science and Engineering", margin + 85, y + 32, { maxWidth: 190 });

  // Column 2
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("Grad Year:", margin + 285, y + 16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(`${prof.gradYear || 2025}`, margin + 338, y + 16);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("Experience:", margin + 285, y + 32);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(`${prof.experienceYears} Years`, margin + 342, y + 32);

  // Column 3
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("Target Role:", margin + 395, y + 16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(2, 132, 199);
  doc.text(prof.targetRole || analysis.targetRole, margin + 452, y + 16);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("Certifications:", margin + 395, y + 32);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(`${prof.certificationsCount} Certified`, margin + 458, y + 32);

  // Line 3: Existing Skills Chips
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("Filled Skills:", margin + 12, y + 50);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  const skillsStr = (prof.userSkills || []).join(", ");
  doc.text(skillsStr || "None specified", margin + 85, y + 50, { maxWidth: contentWidth - 95 });

  y += 82;

  // 3. Section: Executive ML Intelligence Dashboard (4 Key Metrics)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("2. ML EXECUTIVE DASHBOARD (AI BENCHMARKS)", margin, y);
  y += 12;

  const cardW = (contentWidth - 18) / 4;
  const cardH = 64;

  // Metric 1: Readiness Score
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin, y, cardW, cardH, 4, 4, "FD");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("CAREER READINESS", margin + 10, y + 16);
  doc.setFontSize(18);
  doc.setTextColor(30, 27, 75);
  doc.text(`${analysis.readiness_score ?? analysis.readinessTransparent?.score ?? 78}%`, margin + 10, y + 40);
  doc.setFontSize(7.5);
  doc.setTextColor(99, 102, 241);
  doc.text(analysis.readiness_category ?? analysis.readinessRF?.predicted_category ?? "Developing", margin + 10, y + 54);

  // Metric 2: Skill Match Cosine
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin + cardW + 6, y, cardW, cardH, 4, 4, "FD");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(5, 150, 105);
  doc.text("SKILL MATCH", margin + cardW + 16, y + 16);
  doc.setFontSize(18);
  doc.setTextColor(6, 78, 59);
  doc.text(`${analysis.skill_match ?? analysis.matchPercentage ?? 75}%`, margin + cardW + 16, y + 40);
  doc.setFontSize(7.5);
  doc.setTextColor(16, 185, 129);
  doc.text("Cosine Similarity", margin + cardW + 16, y + 54);

  // Metric 3: SVM Predicted Role
  doc.setFillColor(240, 249, 255); // sky-50
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(margin + (cardW + 6) * 2, y, cardW, cardH, 4, 4, "FD");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(2, 132, 199);
  doc.text("PREDICTED CAREER (SVM)", margin + (cardW + 6) * 2 + 10, y + 16);
  doc.setFontSize(10.5);
  doc.setTextColor(12, 74, 110);
  const svmRole = analysis.predicted_role ?? analysis.svmResult?.predicted_role ?? "AI/ML Engineer";
  doc.text(svmRole.slice(0, 18), margin + (cardW + 6) * 2 + 10, y + 36);
  doc.setFontSize(7.5);
  doc.setTextColor(14, 165, 233);
  doc.text(`Confidence: ${Math.round((analysis.svm_confidence ? analysis.svm_confidence * 100 : analysis.svmResult?.confidence) || 85)}%`, margin + (cardW + 6) * 2 + 10, y + 54);

  // Metric 4: K-Means Cluster
  doc.setFillColor(250, 245, 255); // purple-50
  doc.setDrawColor(233, 213, 255);
  doc.roundedRect(margin + (cardW + 6) * 3, y, cardW, cardH, 4, 4, "FD");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(147, 51, 234);
  doc.text("PROFILE CLUSTER", margin + (cardW + 6) * 3 + 10, y + 16);
  doc.setFontSize(9.5);
  doc.setTextColor(88, 28, 135);
  const clusterLabel = typeof analysis.cluster === "string"
    ? analysis.cluster
    : analysis.cluster?.cluster_name || analysis.cluster_details?.cluster_name || "Data & ML Profile";
  doc.text(clusterLabel.slice(0, 18), margin + (cardW + 6) * 3 + 10, y + 36);
  doc.setFontSize(7.5);
  doc.setTextColor(168, 85, 247);
  doc.text("K-Means Archetype", margin + (cardW + 6) * 3 + 10, y + 54);

  y += 82;

  // 4. Section: SKILL GAP ANALYSIS & REQUIREMENT CATEGORIZATION
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("3. SKILL GAP ANALYSIS & REQUIREMENT CATEGORIZATION", margin, y);

  const strongSkillsData = analysis.gaps?.strong_skills || (analysis.strong_skills || []).map(s => ({ skill: s, reason: "Verified competency in profile", evidence_level: "Active" }));
  const weakSkillsData = analysis.gaps?.weak_skills || (analysis.developing_skills || []).map(s => ({ skill: s, reason: "Partial evidence; requires deepening", priority: "Medium" }));
  const missingSkillsData = analysis.gaps?.missing_skills || (analysis.missing_skills || []).map((s, idx) => ({ skill: s, priority: idx < 2 ? "High" : "Medium", requirement_type: idx < 2 ? "Core" : "Supporting", reason: "Mandatory requirement for benchmark role" }));

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129);
  doc.text(`${strongSkillsData.length} Strong`, pageWidth - margin - 150, y);
  doc.setTextColor(217, 119, 6);
  doc.text(`${weakSkillsData.length} Weak`, pageWidth - margin - 95, y);
  doc.setTextColor(225, 29, 72);
  doc.text(`${missingSkillsData.length} Missing`, pageWidth - margin - 45, y);
  y += 12;

  const col3W = (contentWidth - 16) / 3;
  const col3H = 148;

  // Box A: Strong (Verified)
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, col3W, col3H, 4, 4, "FD");

  doc.setFillColor(220, 252, 231);
  doc.roundedRect(margin, y, col3W, 20, 4, 4, "F");
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(`STRONG SKILLS (${strongSkillsData.length})`, margin + 8, y + 14);
  doc.setFontSize(7);
  doc.setTextColor(21, 128, 61);
  doc.text("VERIFIED", margin + col3W - 42, y + 14);

  let sy = y + 30;
  if (strongSkillsData.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("No strong profile skills identified.", margin + 8, sy);
  } else {
    strongSkillsData.slice(0, 7).forEach((item: any) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`[✓]  ${item.skill}`, margin + 8, sy);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      const sub = item.evidence_level ? `Level: ${item.evidence_level}` : "Verified in candidate background";
      doc.text(sub, margin + 18, sy + 8.5);
      sy += 16;
    });
  }

  // Box B: Developing / Weak (Needs Depth)
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(254, 240, 138);
  doc.roundedRect(margin + col3W + 8, y, col3W, col3H, 4, 4, "FD");

  doc.setFillColor(254, 249, 195);
  doc.roundedRect(margin + col3W + 8, y, col3W, 20, 4, 4, "F");
  doc.setTextColor(133, 77, 14);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(`WEAK / DEVELOPING (${weakSkillsData.length})`, margin + col3W + 16, y + 14);
  doc.setFontSize(7);
  doc.setTextColor(161, 98, 7);
  doc.text("NEEDS DEPTH", margin + col3W + 8 + col3W - 55, y + 14);

  let wy = y + 30;
  if (weakSkillsData.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("No developing skills needing attention.", margin + col3W + 16, wy);
  } else {
    weakSkillsData.slice(0, 7).forEach((item: any) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`[~]  ${item.skill}`, margin + col3W + 16, wy);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(161, 98, 7);
      doc.text("Medium Priority • Needs deeper project proof", margin + col3W + 26, wy + 8.5);
      wy += 16;
    });
  }

  // Box C: Missing Skills (Core vs Supporting Requirement Categorization)
  doc.setFillColor(255, 241, 242);
  doc.setDrawColor(254, 205, 211);
  doc.roundedRect(margin + (col3W + 8) * 2, y, col3W, col3H, 4, 4, "FD");

  doc.setFillColor(255, 228, 230);
  doc.roundedRect(margin + (col3W + 8) * 2, y, col3W, 20, 4, 4, "F");
  doc.setTextColor(159, 18, 57);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(`MISSING SKILLS (${missingSkillsData.length})`, margin + (col3W + 8) * 2 + 8, y + 14);
  doc.setFontSize(7);
  doc.setTextColor(190, 18, 60);
  doc.text("TO ACQUIRE", margin + (col3W + 8) * 2 + col3W - 48, y + 14);

  let my = y + 30;
  if (missingSkillsData.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(22, 101, 52);
    doc.text("100% Target Role Skill Match achieved!", margin + (col3W + 8) * 2 + 8, my);
  } else {
    missingSkillsData.slice(0, 7).forEach((item: any) => {
      const isHigh = item.priority === "High";
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`[-]  ${item.skill}`, margin + (col3W + 8) * 2 + 8, my);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      if (isHigh) {
        doc.setTextColor(190, 18, 60);
        doc.text("CORE • High Priority", margin + (col3W + 8) * 2 + 18, my + 8.5);
      } else {
        doc.setTextColor(100, 116, 139);
        doc.text("SUPPORTING • Medium Priority", margin + (col3W + 8) * 2 + 18, my + 8.5);
      }
      my += 16;
    });
  }

  y += col3H + 12;

  // 5. Section: Next Best Skill Decision Callout
  const topMissing = missingSkillsData[0]?.skill || "Supervised Machine Learning";
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 48, 4, 4, "F");

  doc.setTextColor(45, 212, 191);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("NEXT BEST SKILL DECISION ENGINE (AI RECOMMENDATION)", margin + 14, y + 15);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.text(topMissing.toUpperCase(), margin + 14, y + 33);

  doc.setTextColor(203, 213, 225);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(
    `Based on your profile, mastering ${topMissing} delivers the highest-impact closure to your career gap for ${prof.targetRole || analysis.targetRole}.`,
    margin + 195,
    y + 22,
    { maxWidth: contentWidth - 210 }
  );

  // Page 1 Footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("SkillGapAI Academic Report &bull; Page 1 of 2: Diagnostics & Gap Analysis", margin, pageHeight - 20);
  doc.text("Confidential &bull; In-Memory Evaluation", pageWidth - margin, pageHeight - 20, { align: "right" });

  // ===================================================
  // PAGE 2: 5-STAGE ROADMAP, CAPSTONES & ACTION CHECKLIST
  // ===================================================
  doc.addPage();

  // Top Accent on Page 2
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 50, "F");
  doc.setFillColor(6, 182, 212);
  doc.rect(0, 0, pageWidth, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("SkillGapAI — 5-STAGE LEARNING ROADMAP & ACTION PLAN", margin, 32);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(6, 182, 212);
  doc.text(`CANDIDATE: ${(prof.name || "Learner").toUpperCase()}`, pageWidth - margin, 32, { align: "right" });

  y = 70;

  // 6. Section: 5-Stage Personalized Roadmap
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("4. PERSONALIZED 5-STAGE ROADMAP", margin, y);
  y += 12;

  const roadmapStages = analysis.roadmap || [
    { stage_title: "Stage 1 — Foundation", estimated_duration: "3-4 Weeks", focus: "Programming core, Linear Algebra, and version control." },
    { stage_title: "Stage 2 — Core Competencies", estimated_duration: "4-5 Weeks", focus: "Core domain models, data manipulation, and feature engineering." },
    { stage_title: "Stage 3 — Specialization", estimated_duration: "4-6 Weeks", focus: "Advanced domain architectures and optimization techniques." },
    { stage_title: "Stage 4 — Capstone Projects", estimated_duration: "4 Weeks", focus: "Building end-to-end production systems with documentation." },
    { stage_title: "Stage 5 — Career Ready", estimated_duration: "2-3 Weeks", focus: "Docker deployment, API hosting, and viva interview preparation." }
  ];

  roadmapStages.slice(0, 5).forEach((stage: any, idx: number) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 38, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(79, 70, 229);
    doc.text(`Stage 0${idx + 1}: ${stage.stage_title}`, margin + 10, y + 14);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(6, 182, 212);
    doc.text(stage.estimated_duration || "3-4 Weeks", pageWidth - margin - 10, y + 14, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(stage.focus, margin + 10, y + 28, { maxWidth: contentWidth - 20 });

    y += 44;
  });

  y += 10;

  // 7. Section: Capstone Portfolio Projects
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("5. RECOMMENDED CAPSTONE PROJECTS TO BUILD", margin, y);
  y += 12;

  const projects = (analysis.recommended_projects || analysis.recommendedProjects || []).slice(0, 2);
  projects.forEach((proj: any) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 54, 4, 4, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(proj.project_title, margin + 10, y + 16);

    doc.setFontSize(7.5);
    doc.setTextColor(2, 132, 199);
    doc.text(`[${proj.difficulty || "Intermediate"}]`, margin + 10 + doc.getTextWidth(proj.project_title) + 8, y + 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(proj.description, margin + 10, y + 29, { maxWidth: contentWidth - 20 });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Deliverable:", margin + 10, y + 43);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text(proj.deliverables, margin + 65, y + 43, { maxWidth: contentWidth - 75 });

    y += 62;
  });

  y += 10;

  // 8. Section: Action Checklist
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("6. YOUR ACTION CHECKLIST", margin, y);

  const completedCount = checklist.items.filter(i => i.completed).length;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(79, 70, 229);
  doc.text(`Progress: ${completedCount} / ${checklist.items.length} Completed`, pageWidth - margin, y, { align: "right" });
  y += 14;

  checklist.items.slice(0, 5).forEach(item => {
    // Checkbox
    doc.setDrawColor(100, 116, 139);
    doc.setLineWidth(1);
    if (item.completed) {
      doc.setFillColor(79, 70, 229);
      doc.roundedRect(margin, y - 8, 10, 10, 2, 2, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("x", margin + 2.5, y - 0.5);
    } else {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, y - 8, 10, 10, 2, 2, "FD");
    }

    // Text
    doc.setFont("helvetica", item.completed ? "bold" : "normal");
    if (item.completed) {
      doc.setTextColor(15, 23, 42);
    } else {
      doc.setTextColor(51, 65, 85);
    }
    doc.setFontSize(8);
    doc.text(`[${item.stage.toUpperCase()}]  ${item.text}`, margin + 18, y);

    y += 18;
  });

  // Page 2 Footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("SkillGapAI Academic Report &bull; Page 2 of 2: Roadmap, Projects & Checklist", margin, pageHeight - 20);
  doc.text("Generated by SkillGapAI", pageWidth - margin, pageHeight - 20, { align: "right" });

  const safeName = (prof.name || "SkillGapAI").replace(/\s+/g, "_");
  doc.save(`${safeName}_SkillGapAI_Career_Report.pdf`);
}

/**
 * Parses an uploaded SkillGapAI PDF to recover the checklist state
 */
export async function parseSkillGapPdfReport(file: File): Promise<{ success: boolean; checklistState?: ChecklistState; message: string }> {
  try {
    const text = await file.text();
    const match = text.match(/SGSTATE:([A-Za-z0-9+/=]+)/);
    if (!match || !match[1]) {
      return {
        success: false,
        message: "No SkillGapAI state token found in this PDF. Please make sure this is an exported SkillGapAI Report."
      };
    }

    const jsonStr = atob(match[1]);
    const parsed = JSON.parse(jsonStr);

    if (!parsed || !parsed.chk) {
      return { success: false, message: "Invalid report state format." };
    }

    const checklistItems = parsed.chk.map((item: any) => ({
      id: item.id,
      text: item.text || item.id,
      stage: item.stage || "Plan",
      completed: Boolean(item.c)
    }));

    return {
      success: true,
      checklistState: { items: checklistItems },
      message: `Successfully loaded progress report for ${parsed.candidate || "learner"}!`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to restore checklist from PDF: ${err.message}`
    };
  }
}
