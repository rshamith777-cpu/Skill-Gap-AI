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

  // Feature engineering & validation
  items.push({
    id: "chk-core-3",
    text: "Practice cross-validation, hyperparameter tuning & feature engineering",
    stage: "Core",
    completed: false
  });

  // Specialization
  items.push({
    id: "chk-spec-1",
    text: "Deepen specialization with Deep Learning or Advanced Domain Models",
    stage: "Specialization",
    completed: false
  });

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
    stage: "Practice",
    completed: false
  });

  items.push({
    id: "chk-portfolio-1",
    text: "Update portfolio repository with live interactive demo & system architecture",
    stage: "Career Ready",
    completed: false
  });

  items.push({
    id: "chk-viva-1",
    text: "Complete viva voce technical interview preparation & concept revision",
    stage: "Career Ready",
    completed: false
  });

  return { items };
}

/**
 * Generates an Executive Career Intelligence Vector PDF Report (2 Pages, A4)
 * strictly adheres to the SkillGapAI executive consulting design system:
 * 
 * PAGE 1:
 *  - Header: Dark executive banner (#0B1220), teal line (#14B8A6), DOC ID: SG-XXXXXX, Evaluation Date
 *  - 01 CANDIDATE PROFILE: 3-column metadata grid + compact Skill Inventory pills
 *  - 02 ML CAREER DIAGNOSTICS: 4 clean KPI blocks (Readiness, Skill Match, SVM Fit, K-Means Cluster)
 *  - 03 SKILL GAP INTELLIGENCE: Status counters + 3 aligned semantic columns (Strong, Developing, Missing: Core vs Supporting)
 *  - NEXT BEST SKILL: High-contrast executive callout with Decision Basis
 *  - Page 1 Footer: Confidentiality, pagination 01 / 02
 * 
 * PAGE 2:
 *  - Header: Compact dark/teal header
 *  - 04 PERSONALIZED LEARNING ROADMAP: Connected timeline (Stages 01 - 05)
 *  - 05 RECOMMENDED PROJECTS: 2 structured capstone blocks with deliverables
 *  - 06 ACTION CHECKLIST: Progress bar + interactive vector AcroForm checkbox fields
 *  - NEXT MOVE: Executive closing callout (BUILD -> PRACTICE -> MEASURE -> DEPLOY)
 *  - Page 2 Footer: Confidentiality, portable state embedded for seamless re-upload
 */
export function generateSkillGapPdf(
  analysis: AnalysisResult,
  checklist: ChecklistState,
  profile: UserFilledProfile | string
) {
  const prof: UserFilledProfile = typeof profile === "string"
    ? {
        name: profile || "Candidate",
        degree: "B.E. Computer Science and Engineering",
        gradYear: 2026,
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

  const pageWidth = doc.internal.pageSize.getWidth();   // 595.28 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 841.89 pt
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;          // 523.28 pt

  // Deterministic Document ID based on candidate name & date
  const hashSeed = Math.abs(
    (prof.name + prof.targetRole).split("").reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0)
  );
  const docId = `SG-${String(hashSeed % 900000 + 100000)}`;
  const evalDate = new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

  // Embedded portable state token for re-upload continuation
  const portableState = btoa(JSON.stringify({
    docId,
    candidate: prof.name,
    targetRole: prof.targetRole || analysis.targetRole,
    date: evalDate,
    chk: checklist.items.map(item => ({
      id: item.id,
      c: item.completed ? 1 : 0,
      stage: item.stage,
      text: item.text
    }))
  }));

  // =========================================================================
  // PAGE 1 — CAREER DIAGNOSTICS & SKILL GAP INTELLIGENCE
  // =========================================================================

  // 1. Executive Header (Near Black #0B1220)
  doc.setFillColor(11, 18, 32); // #0B1220
  doc.rect(0, 0, pageWidth, 74, "F");

  // Teal Accent Strip (#14B8A6)
  doc.setFillColor(20, 184, 166);
  doc.rect(0, 72, pageWidth, 2.5, "F");

  // Header Title & Tagline (Left)
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("SKILLGAPAI", margin, 32);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(20, 184, 166); // Teal
  doc.text("EXECUTIVE CAREER INTELLIGENCE REPORT", margin, 46);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text("Know Your Gap. Build Your Future.", margin, 58);

  // Header Metadata (Right)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("DOCUMENT ID:", pageWidth - margin, 28, { align: "right" });
  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(docId, pageWidth - margin, 40, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("EVALUATION DATE:", pageWidth - margin, 52, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  doc.text(evalDate, pageWidth - margin, 63, { align: "right" });

  let y = 92;

  // =========================================================================
  // SECTION 01 — CANDIDATE PROFILE & SKILL INVENTORY
  // =========================================================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(11, 18, 32); // #0B1220
  doc.text("01  CANDIDATE PROFILE", margin, y);
  y += 10;

  // Profile Information Card
  doc.setFillColor(248, 250, 252); // #F8FAFC
  doc.setDrawColor(226, 232, 240); // #E2E8F0
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, y, contentWidth, 78, 3, 3, "FD");

  // Row 1 (y + 14)
  const col1X = margin + 14;
  const col2X = margin + 185;
  const col3X = margin + 355;

  // Column 1: Candidate Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("CANDIDATE", col1X, y + 14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(prof.name || "Learner Candidate", col1X, y + 25);

  // Column 2: Education / Degree
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("EDUCATION", col2X, y + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(prof.degree || "B.E. Computer Science and Engineering", col2X, y + 25, { maxWidth: 160 });

  // Column 3: Target Role
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("TARGET ROLE", col3X, y + 14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(3, 105, 161); // Sky-700
  doc.text((prof.targetRole || analysis.targetRole || "AI/ML Engineer").toUpperCase(), col3X, y + 25);

  // Row 2 (y + 38)
  // Graduation Year
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("GRADUATION", col1X, y + 41);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`${prof.gradYear || 2026}`, col1X, y + 51);

  // Experience
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("EXPERIENCE", col2X, y + 41);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const expText = prof.experienceYears > 0 ? `${prof.experienceYears} Years Academic / Industry` : "Fresh Graduate (0-1 Yrs)";
  doc.text(expText, col2X, y + 51);

  // Certifications
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("CERTIFICATIONS", col3X, y + 41);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`${prof.certificationsCount} Relevant Accredited`, col3X, y + 51);

  // Skill Inventory Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin + 10, y + 58, margin + contentWidth - 10, y + 58);

  // Skill Inventory Label & Compact Pills
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text("SKILL INVENTORY:", col1X, y + 69);

  let pillX = col1X + 75;
  const pillY = y + 63;
  const skillsToRender = (prof.userSkills && prof.userSkills.length > 0)
    ? prof.userSkills.slice(0, 9)
    : (analysis.strong_skills || ["Python", "Machine Learning", "SQL", "Git"]).slice(0, 9);

  skillsToRender.forEach((skill) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    const tw = doc.getTextWidth(skill);
    const pw = tw + 10;

    if (pillX + pw < margin + contentWidth - 10) {
      doc.setFillColor(241, 245, 249); // #F1F5F9
      doc.setDrawColor(203, 213, 225); // #CBD5E1
      doc.roundedRect(pillX, pillY, pw, 11, 2, 2, "FD");
      doc.setTextColor(30, 41, 59);
      doc.text(skill, pillX + 5, pillY + 8);
      pillX += pw + 4;
    }
  });

  y += 92;

  // =========================================================================
  // SECTION 02 — ML CAREER DIAGNOSTICS (4 Clean KPI Blocks)
  // =========================================================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(11, 18, 32);
  doc.text("02  ML CAREER DIAGNOSTICS", margin, y);
  y += 10;

  const kpiGap = 8;
  const kpiW = (contentWidth - kpiGap * 3) / 4;
  const kpiH = 56;

  // Metric 1: CAREER READINESS
  const readinessVal = analysis.readiness_score ?? analysis.readinessTransparent?.score ?? 78;
  const readinessCat = (analysis.readiness_category ?? analysis.readinessRF?.predicted_category ?? "Developing").toUpperCase();

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, kpiW, kpiH, 3, 3, "FD");
  doc.setFillColor(20, 184, 166); // Teal top highlight line
  doc.rect(margin, y, kpiW, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("CAREER READINESS", margin + 10, y + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(`${readinessVal}%`, margin + 10, y + 33);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(13, 148, 136); // Teal-600
  doc.text(readinessCat, margin + 10, y + 46);

  // Metric 2: SKILL MATCH (Cosine Similarity)
  const skillMatchVal = analysis.skill_match ?? analysis.matchPercentage ?? 74;

  const m2X = margin + kpiW + kpiGap;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(m2X, y, kpiW, kpiH, 3, 3, "FD");
  doc.setFillColor(59, 130, 246); // Blue top highlight line
  doc.rect(m2X, y, kpiW, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("SKILL MATCH", m2X + 10, y + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(`${skillMatchVal}%`, m2X + 10, y + 33);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(37, 99, 235); // Blue-600
  doc.text("COSINE SIMILARITY", m2X + 10, y + 46);

  // Metric 3: SVM ROLE FIT
  const svmRole = analysis.predicted_role ?? analysis.svmResult?.predicted_role ?? "AI/ML Engineer";
  const svmConf = Math.round((analysis.svm_confidence ? analysis.svm_confidence * 100 : analysis.svmResult?.confidence) || 88);

  const m3X = margin + (kpiW + kpiGap) * 2;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(m3X, y, kpiW, kpiH, 3, 3, "FD");
  doc.setFillColor(124, 58, 237); // Purple top highlight line
  doc.rect(m3X, y, kpiW, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("SVM ROLE FIT", m3X + 10, y + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(`${svmConf}%`, m3X + 10, y + 33);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(109, 40, 217); // Purple-700
  doc.text(svmRole.slice(0, 16).toUpperCase(), m3X + 10, y + 46);

  // Metric 4: K-MEANS PROFILE ARCHETYPE
  const clusterLabel = typeof analysis.cluster === "string"
    ? analysis.cluster
    : analysis.cluster?.cluster_name || analysis.cluster_details?.cluster_name || "Data & ML Builder";

  const m4X = margin + (kpiW + kpiGap) * 3;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(m4X, y, kpiW, kpiH, 3, 3, "FD");
  doc.setFillColor(245, 158, 11); // Amber top highlight line
  doc.rect(m4X, y, kpiW, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("K-MEANS PROFILE", m4X + 10, y + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(clusterLabel.slice(0, 18).toUpperCase(), m4X + 10, y + 30);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(180, 83, 9); // Amber-700
  doc.text("PEER ARCHETYPE", m4X + 10, y + 46);

  y += 68;

  // =========================================================================
  // SECTION 03 — SKILL GAP INTELLIGENCE (3 Aligned Columns)
  // =========================================================================
  const strongSkillsData = analysis.gaps?.strong_skills || (analysis.strong_skills || []).map(s => ({ skill: s, reason: "Verified in background", evidence_level: "Active" }));
  const weakSkillsData = analysis.gaps?.weak_skills || (analysis.developing_skills || []).map(s => ({ skill: s, reason: "Needs project depth", priority: "Medium" }));
  const missingSkillsData = analysis.gaps?.missing_skills || (analysis.missing_skills || []).map((s, idx) => ({ skill: s, priority: idx < 2 ? "High" : "Medium", requirement_type: idx < 2 ? "Core" : "Supporting", reason: "Mandatory benchmark expectation" }));

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(11, 18, 32);
  doc.text("03  SKILL GAP INTELLIGENCE", margin, y);

  // Status Counters (Right side)
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129); // Green
  doc.text(`${String(strongSkillsData.length).padStart(2, '0')} STRONG`, pageWidth - margin - 150, y);
  doc.setTextColor(217, 119, 6);   // Amber
  doc.text(`${String(weakSkillsData.length).padStart(2, '0')} DEVELOPING`, pageWidth - margin - 92, y);
  doc.setTextColor(225, 29, 72);   // Red
  doc.text(`${String(missingSkillsData.length).padStart(2, '0')} MISSING`, pageWidth - margin - 26, y);
  y += 10;

  const colGap = 8;
  const colW = (contentWidth - colGap * 2) / 3;
  const colH = 148;

  // -------------------------------------------------------------------------
  // COLUMN 1: STRONG (VERIFIED SKILLS) - Green Accent
  // -------------------------------------------------------------------------
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(187, 247, 208); // Emerald-200
  doc.roundedRect(margin, y, colW, colH, 3, 3, "FD");

  // Col 1 Header
  doc.setFillColor(240, 253, 244); // Emerald-50
  doc.roundedRect(margin, y, colW, 22, 3, 3, "F");
  doc.setFillColor(16, 185, 129); // Emerald-500 line
  doc.rect(margin, y, colW, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(22, 101, 52); // Emerald-800
  doc.text("STRONG", margin + 10, y + 14);
  doc.setFontSize(6.5);
  doc.setTextColor(21, 128, 61);
  doc.text("VERIFIED SKILLS", margin + colW - 10, y + 14, { align: "right" });

  let sy = y + 32;
  if (strongSkillsData.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("No verified skills detected", margin + 10, sy);
  } else {
    strongSkillsData.slice(0, 6).forEach((item: any) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(22, 101, 52);
      doc.text("✓", margin + 10, sy);
      doc.setTextColor(15, 23, 42);
      doc.text(item.skill, margin + 22, sy);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(item.evidence_level ? `Level: ${item.evidence_level}` : "Verified in candidate background", margin + 22, sy + 8.5);
      sy += 18;
    });
  }

  // -------------------------------------------------------------------------
  // COLUMN 2: DEVELOPING (NEEDS DEPTH) - Amber Accent
  // -------------------------------------------------------------------------
  const c2X = margin + colW + colGap;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(254, 240, 138); // Amber-200
  doc.roundedRect(c2X, y, colW, colH, 3, 3, "FD");

  // Col 2 Header
  doc.setFillColor(254, 252, 232); // Amber-50
  doc.roundedRect(c2X, y, colW, 22, 3, 3, "F");
  doc.setFillColor(245, 158, 11); // Amber-500 line
  doc.rect(c2X, y, colW, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(133, 77, 14); // Amber-800
  doc.text("DEVELOPING", c2X + 10, y + 14);
  doc.setFontSize(6.5);
  doc.setTextColor(180, 83, 9);
  doc.text("NEEDS DEPTH", c2X + colW - 10, y + 14, { align: "right" });

  let wy = y + 32;
  if (weakSkillsData.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("No developing skills needing attention", c2X + 10, wy);
  } else {
    weakSkillsData.slice(0, 6).forEach((item: any) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(217, 119, 6);
      doc.text("◐", c2X + 10, sy >= 0 ? wy : wy);
      doc.setTextColor(15, 23, 42);
      doc.text(item.skill, c2X + 22, wy);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(161, 98, 7);
      doc.text("Medium Priority • Requires deeper project proof", c2X + 22, wy + 8.5);
      wy += 18;
    });
  }

  // -------------------------------------------------------------------------
  // COLUMN 3: MISSING (TO ACQUIRE: CORE vs SUPPORTING) - Red Accent
  // -------------------------------------------------------------------------
  const c3X = margin + (colW + colGap) * 2;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(254, 205, 211); // Rose-200
  doc.roundedRect(c3X, y, colW, colH, 3, 3, "FD");

  // Col 3 Header
  doc.setFillColor(255, 241, 242); // Rose-50
  doc.roundedRect(c3X, y, colW, 22, 3, 3, "F");
  doc.setFillColor(225, 29, 72); // Rose-500 line
  doc.rect(c3X, y, colW, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(159, 18, 57); // Rose-800
  doc.text("MISSING", c3X + 10, y + 14);
  doc.setFontSize(6.5);
  doc.setTextColor(190, 18, 60);
  doc.text("TO ACQUIRE", c3X + colW - 10, y + 14, { align: "right" });

  let my = y + 32;
  const coreMissing = missingSkillsData.filter((s: any) => s.priority === "High" || s.requirement_type === "Core");
  const suppMissing = missingSkillsData.filter((s: any) => s.priority !== "High" && s.requirement_type !== "Core");

  // Section: CORE • HIGH PRIORITY
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(190, 18, 60);
  doc.text("CORE • HIGH PRIORITY", c3X + 10, my);
  my += 10;

  if (coreMissing.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("All core benchmark requirements matched", c3X + 10, my);
    my += 14;
  } else {
    coreMissing.slice(0, 3).forEach((item: any) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(225, 29, 72);
      doc.text("○", c3X + 10, my);
      doc.setTextColor(15, 23, 42);
      doc.text(item.skill, c3X + 20, my);
      my += 14;
    });
  }

  // Section: SUPPORTING • MEDIUM PRIORITY
  my += 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("SUPPORTING • MEDIUM PRIORITY", c3X + 10, my);
  my += 10;

  if (suppMissing.length === 0 && missingSkillsData.length > coreMissing.length) {
    missingSkillsData.slice(coreMissing.length, coreMissing.length + 2).forEach((item: any) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text("○", c3X + 10, my);
      doc.setTextColor(71, 85, 105);
      doc.text(item.skill, c3X + 20, my);
      my += 14;
    });
  } else if (suppMissing.length > 0) {
    suppMissing.slice(0, 3).forEach((item: any) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text("○", c3X + 10, my);
      doc.setTextColor(71, 85, 105);
      doc.text(item.skill, c3X + 20, my);
      my += 14;
    });
  }

  y += colH + 12;

  // =========================================================================
  // NEXT BEST SKILL CALLOUT (High-Contrast Executive Dark Callout)
  // =========================================================================
  const topMissing = missingSkillsData[0]?.skill || "Machine Learning";

  doc.setFillColor(11, 18, 32); // Near Black #0B1220
  doc.roundedRect(margin, y, contentWidth, 52, 3, 3, "F");

  // Teal highlight indicator bar on left
  doc.setFillColor(20, 184, 166);
  doc.rect(margin, y, 3.5, 52, "F");

  // Label: NEXT BEST SKILL
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(20, 184, 166); // Teal
  doc.text("NEXT BEST SKILL", margin + 14, y + 15);

  // Large Skill Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(topMissing.toUpperCase(), margin + 14, y + 33);

  // Badge: HIGH IMPACT
  const titleW = doc.getTextWidth(topMissing.toUpperCase());
  doc.setFillColor(15, 118, 110); // Teal-800
  doc.setDrawColor(45, 212, 191);
  doc.roundedRect(margin + 18 + titleW, y + 22, 60, 12, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text("HIGH IMPACT", margin + 23 + titleW, y + 31);

  // Right Side: WHY THIS SKILL? & DECISION BASIS
  const rightCalloutX = margin + 220;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(20, 184, 166);
  doc.text("WHY THIS SKILL?", rightCalloutX, y + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(226, 232, 240);
  const whyText = `Your existing foundation makes ${topMissing} the highest-value next learning priority for your selected ${prof.targetRole || analysis.targetRole} career direction.`;
  doc.text(whyText, rightCalloutX, y + 24, { maxWidth: contentWidth - 235 });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text("DECISION BASIS: ", rightCalloutX, y + 43);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(20, 184, 166);
  doc.text("Skill Gap  ×  Career Relevance  ×  Prerequisite Readiness", rightCalloutX + 62, y + 43);

  // =========================================================================
  // PAGE 1 FOOTER
  // =========================================================================
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.6);
  doc.line(margin, pageHeight - 26, pageWidth - margin, pageHeight - 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("SKILLGAPAI", margin, pageHeight - 16);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("  •  EXECUTIVE CAREER INTELLIGENCE REPORT  •  CONFIDENTIAL • FOR CAREER PLANNING", margin + 46, pageHeight - 16);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("PAGE 01 / 02", pageWidth - margin, pageHeight - 16, { align: "right" });

  // =========================================================================
  // PAGE 2 — LEARNING ROADMAP & ACTION PLAN
  // =========================================================================
  doc.addPage();

  // Small Executive Header (Page 2)
  doc.setFillColor(11, 18, 32); // #0B1220
  doc.rect(0, 0, pageWidth, 42, "F");

  doc.setFillColor(20, 184, 166); // Teal accent line
  doc.rect(0, 40, pageWidth, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("SKILLGAPAI", margin, 24);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(20, 184, 166);
  doc.text("5-STAGE LEARNING ROADMAP & ACTION PLAN", margin + 75, 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  doc.text(`CANDIDATE: ${(prof.name || "Learner").toUpperCase()}  |  ${(prof.targetRole || analysis.targetRole).toUpperCase()}`, pageWidth - margin, 24, { align: "right" });

  y = 56;

  // =========================================================================
  // SECTION 04 — PERSONALIZED LEARNING ROADMAP (Connected Timeline)
  // =========================================================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(11, 18, 32);
  doc.text("04  PERSONALIZED LEARNING ROADMAP", margin, y);
  y += 10;

  // Connected Timeline Nodes Bar
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 78, 3, 3, "FD");

  // Horizontal connecting line
  const timelineY = y + 16;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(1.5);
  doc.line(margin + 45, timelineY, margin + contentWidth - 45, timelineY);

  const roadmapStages = analysis.roadmap || [
    { stage_title: "FOUNDATION", estimated_duration: "3-4 WEEKS", focus: "Programming Core • Statistics • Linear Algebra • Version Control" },
    { stage_title: "CORE COMPETENCIES", estimated_duration: "4-5 WEEKS", focus: "ML Algorithms • Feature Engineering • Model Evaluation • Data Processing" },
    { stage_title: "SPECIALIZATION", estimated_duration: "4-6 WEEKS", focus: "Deep Learning • NLP • Advanced Models • Optimization" },
    { stage_title: "CAPSTONE", estimated_duration: "4 WEEKS", focus: "End-to-End Project • REST API • Testing • Architecture Documentation" },
    { stage_title: "CAREER READY", estimated_duration: "2-3 WEEKS", focus: "Deployment • Portfolio • Interview Preparation • System Design" }
  ];

  const stageStepW = contentWidth / 5;

  roadmapStages.slice(0, 5).forEach((stg: any, idx: number) => {
    const nodeCenterX = margin + (idx * stageStepW) + (stageStepW / 2);

    // Node Circle
    doc.setFillColor(idx === 0 ? 20 : 255, idx === 0 ? 184 : 255, idx === 0 ? 166 : 255);
    doc.setDrawColor(idx === 0 ? 20 : 100, idx === 0 ? 184 : 116, idx === 0 ? 166 : 139);
    doc.setLineWidth(1.5);
    doc.circle(nodeCenterX, timelineY, 6.5, "FD");

    // Node Number inside
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(idx === 0 ? 255 : 30, idx === 0 ? 255 : 41, idx === 0 ? 255 : 59);
    doc.text(`0${idx + 1}`, nodeCenterX - 3.5, timelineY + 2);

    // Stage Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    const shortTitle = (stg.stage_title || `Stage ${idx + 1}`).replace(/^Stage \d+ — /i, "").toUpperCase();
    doc.text(shortTitle.slice(0, 15), nodeCenterX, y + 33, { align: "center" });

    // Duration
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(20, 184, 166);
    doc.text(stg.estimated_duration || "3-4 WEEKS", nodeCenterX, y + 43, { align: "center" });

    // Key Focus Areas
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    const cleanFocus = (stg.focus || "").replace(/ • /g, "\n");
    doc.text(cleanFocus, nodeCenterX, y + 53, { align: "center", maxWidth: stageStepW - 10 });
  });

  y += 90;

  // =========================================================================
  // SECTION 05 — RECOMMENDED CAPSTONE PROJECTS (2 Structured Blocks)
  // =========================================================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(11, 18, 32);
  doc.text("05  RECOMMENDED CAPSTONE PROJECTS", margin, y);
  y += 10;

  const projGap = 10;
  const projW = (contentWidth - projGap) / 2;
  const projH = 78;

  const projectList = (analysis.recommended_projects || analysis.recommendedProjects || []).slice(0, 2);
  const fallbackProjects = [
    {
      project_title: "End-to-End Predictive ML Service",
      difficulty: "INTERMEDIATE",
      description: "Build, evaluate, and containerize an applied supervised model with automated REST inference API and validation metrics.",
      deliverables: "Git Repository, REST API, Dockerfile, Evaluation Report"
    },
    {
      project_title: "Full-Stack Career Analytics Dashboard",
      difficulty: "ADVANCED",
      description: "Develop a reactive analytics interface evaluating user feature vectors against industry benchmark competency distributions.",
      deliverables: "Clean Codebase, Model Pipeline, Interactive Demo, Documentation"
    }
  ];

  const projectsToDisplay = projectList.length >= 2 ? projectList : fallbackProjects;

  projectsToDisplay.forEach((proj: any, idx: number) => {
    const pX = margin + idx * (projW + projGap);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.8);
    doc.roundedRect(pX, y, projW, projH, 3, 3, "FD");

    // Top Teal line
    doc.setFillColor(20, 184, 166);
    doc.rect(pX, y, projW, 1.5, "F");

    // Project Number & Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(20, 184, 166);
    doc.text(`0${idx + 1}`, pX + 10, y + 14);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text((proj.project_title || "Applied Capstone").slice(0, 32), pX + 24, y + 14);

    // Difficulty Badge
    const diff = (proj.difficulty || "INTERMEDIATE").toUpperCase();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(3, 105, 161); // Sky-700
    doc.text(`[ ${diff} ]`, pX + projW - 10, y + 14, { align: "right" });

    // Description
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(proj.description || "Production-grade portfolio implementation demonstrating end-to-end domain problem solving.", pX + 10, y + 26, { maxWidth: projW - 20 });

    // Deliverables Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(15, 23, 42);
    doc.text("DELIVERABLES:", pX + 10, y + 54);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(proj.deliverables || "Repository • Model Pipeline • REST API • Documentation", pX + 68, y + 54, { maxWidth: projW - 78 });
  });

  y += projH + 12;

  // =========================================================================
  // SECTION 06 — ACTION CHECKLIST (Progress Bar + Real AcroForm Checkboxes)
  // =========================================================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(11, 18, 32);
  doc.text("06  ACTION CHECKLIST", margin, y);

  const completedCount = checklist.items.filter(i => i.completed).length;
  const totalCount = checklist.items.length;
  const percentCompleted = Math.round((completedCount / (totalCount || 1)) * 100);

  // Status Counter at top right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("YOUR PROGRESS:", pageWidth - margin - 110, y);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 184, 166);
  doc.text(`${completedCount} / ${totalCount} COMPLETED  (${percentCompleted}%)`, pageWidth - margin, y, { align: "right" });
  y += 8;

  // Horizontal Progress Bar
  const barW = contentWidth;
  const barH = 5;
  doc.setFillColor(241, 245, 249); // Slate-100 track
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, barW, barH, 2, 2, "FD");

  const fillW = Math.max(8, (barW * percentCompleted) / 100);
  doc.setFillColor(20, 184, 166); // Teal filled progress
  doc.roundedRect(margin, y, fillW, barH, 2, 2, "F");
  y += 12;

  // Checklist Container Card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 140, 3, 3, "FD");

  let chkY = y + 14;
  checklist.items.slice(0, 8).forEach((item, idx) => {
    const isCompleted = Boolean(item.completed);
    const boxSize = 9.5;
    const boxX = margin + 12;

    // Check if AcroForm is available in jsPDF instance
    let acroFormCreated = false;
    try {
      if ((doc as any).AcroFormCheckBox) {
        const checkBoxField = new (doc as any).AcroFormCheckBox();
        checkBoxField.fieldName = `chk_${item.id || idx}`;
        checkBoxField.Rect = [boxX, chkY - 7.5, boxSize, boxSize];
        checkBoxField.appearanceState = isCompleted ? "On" : "Off";
        checkBoxField.value = isCompleted ? "Yes" : "Off";
        doc.addField(checkBoxField);
        acroFormCreated = true;
      }
    } catch {
      acroFormCreated = false;
    }

    // High quality vector box fallback / visual backdrop
    doc.setDrawColor(isCompleted ? 20 : 148, isCompleted ? 184 : 163, isCompleted ? 166 : 184);
    doc.setFillColor(isCompleted ? 20 : 255, isCompleted ? 184 : 255, isCompleted ? 166 : 255);
    doc.setLineWidth(1);
    doc.roundedRect(boxX, chkY - 7.5, boxSize, boxSize, 1.5, 1.5, "FD");

    if (isCompleted && !acroFormCreated) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text("✓", boxX + 2, chkY - 0.5);
    }

    // Task text
    doc.setFont("helvetica", isCompleted ? "normal" : "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(isCompleted ? 71 : 15, isCompleted ? 85 : 23, isCompleted ? 105 : 42);
    doc.text(item.text, boxX + 16, chkY, { maxWidth: contentWidth - 110 });

    // Stage Badge (Right aligned)
    const stageBadgeX = margin + contentWidth - 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(isCompleted ? 13 : 100, isCompleted ? 148 : 116, isCompleted ? 136 : 139);
    doc.text((item.stage || "CORE").toUpperCase(), stageBadgeX, chkY, { align: "right" });

    chkY += 15.5;
  });

  y += 148;

  // =========================================================================
  // NEXT MOVE — EXECUTIVE CLOSING CALLOUT
  // =========================================================================
  doc.setFillColor(11, 18, 32); // #0B1220
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, "F");

  // Teal left accent bar
  doc.setFillColor(20, 184, 166);
  doc.rect(margin, y, 3.5, 38, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(20, 184, 166);
  doc.text("NEXT MOVE", margin + 14, y + 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(226, 232, 240);
  doc.text("Don't try to learn everything at once. Focus next on:", margin + 14, y + 25);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(topMissing.toUpperCase(), margin + 198, y + 25);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(20, 184, 166);
  doc.text("BUILD  →  PRACTICE  →  MEASURE  →  DEPLOY", pageWidth - margin - 12, y + 20, { align: "right" });

  // =========================================================================
  // PAGE 2 FOOTER
  // =========================================================================
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.6);
  doc.line(margin, pageHeight - 26, pageWidth - margin, pageHeight - 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("SKILLGAPAI", margin, pageHeight - 16);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("  •  KNOW YOUR GAP. BUILD YOUR FUTURE.  •  CONFIDENTIAL • PERSONAL CAREER DEVELOPMENT REPORT", margin + 46, pageHeight - 16);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("PAGE 02 / 02", pageWidth - margin, pageHeight - 16, { align: "right" });

  // Embed Portable State Token invisible in PDF for re-upload continuation
  doc.setFontSize(1);
  doc.setTextColor(255, 255, 255);
  doc.text(`SGSTATE:${portableState}`, 2, 2);

  // Save the PDF
  const safeName = (prof.name || "SkillGapAI").replace(/\s+/g, "_");
  doc.save(`${safeName}_SkillGapAI_Career_Report.pdf`);
}

/**
 * Parses an uploaded SkillGapAI PDF to recover candidate progress & checklist state
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
      return { success: false, message: "Invalid report state format in uploaded PDF." };
    }

    const checklistItems = parsed.chk.map((item: any) => ({
      id: item.id,
      text: item.text || item.id,
      stage: item.stage || "Core",
      completed: Boolean(item.c)
    }));

    const completed = checklistItems.filter((i: any) => i.completed).length;
    return {
      success: true,
      checklistState: { items: checklistItems },
      message: `Restored ${completed} / ${checklistItems.length} completed tasks for ${parsed.candidate || "learner"} (Doc ID: ${parsed.docId || "SG"})`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to restore checklist from PDF: ${err.message}`
    };
  }
}
