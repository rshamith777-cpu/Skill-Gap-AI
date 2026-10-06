import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  Download,
  Upload,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Compass,
  FolderGit2,
  CheckSquare,
  Square,
  ShieldCheck,
  TrendingUp,
  Award,
  Layers
} from "lucide-react";
import { AnalysisResult } from "../types";
import { buildInitialChecklist, ChecklistState, generateSkillGapPdf, parseSkillGapPdfReport } from "../utils/reportPdf";

interface ReportViewProps {
  analysis: AnalysisResult;
  candidateName: string;
  onReset: () => void;
  onNavigateHome: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  analysis,
  candidateName,
  onReset,
  onNavigateHome
}) => {
  const [checklist, setChecklist] = useState<ChecklistState>(() => buildInitialChecklist(analysis));
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Sync checklist when analysis changes
  useEffect(() => {
    setChecklist(buildInitialChecklist(analysis));
  }, [analysis]);

  // Toggle checklist item
  const handleToggleChecklist = (id: string) => {
    setChecklist(prev => ({
      items: prev.items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  // Export vector PDF
  const handleDownloadPdf = () => {
    setIsExporting(true);
    try {
      generateSkillGapPdf(analysis, checklist, candidateName || "Candidate");
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  // Upload previously downloaded PDF to resume progress
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await parseSkillGapPdfReport(file);
    if (res.success && res.checklistState) {
      setChecklist(res.checklistState);
      setUploadStatus(res.message);
    } else {
      setUploadStatus(res.message);
    }
  };

  const completedCount = checklist.items.filter(i => i.completed).length;
  const progressPercent = Math.round((completedCount / checklist.items.length) * 100);

  // Derive highest impact next skill
  const missingCore = (analysis.gaps?.missing_skills || []).filter(s => s.priority === "High");
  const nextBestSkill = missingCore[0]?.skill || "Supervised Machine Learning";
  const strongSkills = analysis.strong_skills || analysis.gaps?.strong_skills?.map(s => s.skill) || [];
  const weakSkills = analysis.developing_skills || analysis.gaps?.weak_skills?.map(s => s.skill) || [];
  const missingSkills = analysis.missing_skills || analysis.gaps?.missing_skills?.map(s => s.skill) || [];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* 1. Header Bar: Report Identity & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
            <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold tracking-widest">
              PERSONAL CAREER INTELLIGENCE REPORT
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight">
            {(analysis.targetRole || "AI / ML ENGINEER").toUpperCase()}
          </h2>
          <p className="text-xs sm:text-sm font-sans text-slate-300 mt-1">
            Prepared for <strong className="text-white">{candidateName || "Candidate"}</strong> &bull; Local Session Only &bull; Zero Cloud Storage
          </p>
        </div>

        {/* Primary CTA: Download PDF Report */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300 hover:from-cyan-300 hover:to-teal-200 transition-all shadow-[0_0_25px_rgba(34,211,238,0.35)] cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Download className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
            <span>{isExporting ? "GENERATING PDF..." : "DOWNLOAD MY REPORT ↓"}</span>
          </button>

          <button
            onClick={onReset}
            className="px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono font-medium text-slate-300 hover:text-white border border-white/10 flex items-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards (Executive Assessment) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Skill Match */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Skill Match</span>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-4xl sm:text-5xl font-heading font-black text-white">
            {analysis.skill_match ?? analysis.matchPercentage ?? 78}%
          </div>
          <div className="mt-3 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-teal-300 h-full rounded-full transition-all duration-1000"
              style={{ width: `${analysis.skill_match ?? analysis.matchPercentage ?? 78}%` }}
            />
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-2">
            Mathematical cosine similarity to industry benchmarks
          </p>
        </div>

        {/* Metric 2: Readiness */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Readiness Level</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-emerald-300">
            {analysis.readiness_category ?? analysis.readinessRF?.predicted_category ?? "Developing"}
          </div>
          <p className="text-xs font-sans text-slate-300 mt-2 leading-relaxed">
            Random Forest ensemble estimation across project depth and verified skills.
          </p>
        </div>

        {/* Metric 3: Profile Archetype */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Profile Archetype</span>
            <Layers className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-base sm:text-lg font-heading font-bold text-purple-200 line-clamp-1">
            {typeof analysis.cluster === "string"
              ? analysis.cluster
              : analysis.cluster?.cluster_name || analysis.cluster_details?.cluster_name || "Data & ML Builder"}
          </div>
          <p className="text-xs font-sans text-slate-300 mt-2 leading-relaxed">
            Identified by K-Means unsupervised clustering across peer student feature vectors.
          </p>
        </div>
      </div>

      {/* 3. Section 01: Current Skill Position */}
      <section className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
              01 — SKILL GAP ANALYSIS & REQUIREMENT CATEGORIZATION
            </span>
            <h3 className="text-xl font-heading font-bold text-white mt-1">
              Skill Gap Analysis & Requirement Categorization
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {strongSkills.length} Strong &bull; {weakSkills.length} Developing &bull; {missingSkills.length} Missing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Strong Skills */}
          <div className="bg-slate-950/70 rounded-xl p-5 border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
              <span>STRONG SKILLS</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                VERIFIED
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {strongSkills.length > 0 ? (
                strongSkills.map((s: string) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  >
                    ✓ {s}
                  </span>
                ))
              ) : (
                <span className="text-xs font-mono text-slate-500 italic">None verified yet</span>
              )}
            </div>
          </div>

          {/* Developing Skills */}
          <div className="bg-slate-950/70 rounded-xl p-5 border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400">
              <span>DEVELOPING</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                NEEDS DEPTH
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {weakSkills.length > 0 ? (
                weakSkills.map((s: string) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  >
                    ~ {s}
                  </span>
                ))
              ) : (
                <span className="text-xs font-mono text-slate-500 italic">No partial skills</span>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-slate-950/70 rounded-xl p-5 border border-rose-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-400">
              <span>MISSING SKILLS</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
                TO ACQUIRE
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {missingSkills.length > 0 ? (
                missingSkills.map((s: string) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-rose-500/10 text-rose-300 border border-rose-500/20"
                  >
                    ✗ {s}
                  </span>
                ))
              ) : (
                <span className="text-xs font-mono text-emerald-400">Profile complete!</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section 02: What to Learn Next (The Main Decision) */}
      <section className="bg-gradient-to-br from-slate-900/90 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
            02 — WHAT TO LEARN NEXT (ML DECISION)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 uppercase tracking-wider">
              HIGHEST IMPACT NEXT SKILL
            </span>
            <h3 className="text-3xl sm:text-4xl font-heading font-black text-white">
              {nextBestSkill}
            </h3>
            <div className="space-y-2 text-xs sm:text-sm font-sans text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Why?</strong> Your current profile establishes fundamental competencies. Prioritizing <strong>{nextBestSkill}</strong> yields the highest marginal boost in role qualification for <strong>{analysis.targetRole}</strong>.
              </p>
              <p className="text-slate-400 text-xs font-mono">
                Determined by SVM feature coefficient weights + role vector cosine distance.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-950/80 p-5 rounded-xl border border-white/10 space-y-3 text-left">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              RANKED LEARNING QUEUE
            </span>
            <div className="space-y-2 text-xs font-mono">
              {missingSkills.slice(0, 4).map((sk: string, idx: number) => (
                <div key={sk} className="flex items-center justify-between p-2 rounded bg-white/5 text-slate-200">
                  <span>0{idx + 1}. {sk}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${idx < 2 ? "bg-cyan-500/20 text-cyan-300" : "bg-white/10 text-slate-400"}`}>
                    {idx < 2 ? "HIGH" : "MED"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section 03: Personalized 5-Stage Roadmap */}
      <section className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
              03 — YOUR LEARNING ROADMAP
            </span>
            <h3 className="text-xl font-heading font-bold text-white mt-1">
              5-Stage Technical Progression
            </h3>
          </div>
          <Compass className="h-5 w-5 text-cyan-400" />
        </div>

        <div className="space-y-4">
          {(analysis.roadmap || []).map((stage: any, idx: number) => (
            <div
              key={stage.stage_title}
              className="p-5 rounded-xl bg-slate-950/70 border border-white/10 space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">0{idx + 1}.</span> {stage.stage_title}
                </h4>
                <span className="text-xs font-mono text-cyan-300 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20 w-fit">
                  {stage.estimated_duration || "3-4 Weeks"}
                </span>
              </div>
              <p className="text-xs font-sans text-slate-300 leading-relaxed">
                {stage.focus}
              </p>
              {stage.skills && stage.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {stage.skills.map((sk: any) => (
                    <span
                      key={sk.skill}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10"
                    >
                      {sk.already_started ? "✓" : "🎯"} {sk.skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. Section 04: Interactive Action Checklist (2-Way PDF Sync) */}
      <section className="bg-slate-900/60 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
              04 — YOUR ACTION CHECKLIST
            </span>
            <h3 className="text-xl font-heading font-bold text-white mt-1">
              Skill Building Milestones
            </h3>
            <p className="text-xs font-sans text-slate-300 mt-0.5">
              Check off items as you complete them. Your checklist is preserved inside your downloaded PDF!
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="bg-slate-950 p-3 rounded-xl border border-white/10 flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-mono text-slate-400">Progress</div>
              <div className="text-base font-mono font-bold text-cyan-400">
                {completedCount} / {checklist.items.length} ({progressPercent}%)
              </div>
            </div>
            <div className="w-16 bg-slate-900 rounded-full h-2 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Checklist Items list */}
        <div className="space-y-3">
          {checklist.items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleToggleChecklist(item.id)}
              className={`w-full p-4 rounded-xl border text-left transition flex items-center justify-between gap-4 cursor-pointer ${
                item.completed
                  ? "bg-cyan-500/10 border-cyan-500/30 text-white"
                  : "bg-slate-950/70 border-white/10 text-slate-300 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.completed ? (
                  <CheckSquare className="h-5 w-5 text-cyan-400 shrink-0" />
                ) : (
                  <Square className="h-5 w-5 text-slate-500 shrink-0" />
                )}
                <div>
                  <span className={`text-xs sm:text-sm font-sans ${item.completed ? "line-through text-slate-300 font-medium" : "text-white"}`}>
                    {item.text}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-slate-400 shrink-0">
                {item.stage}
              </span>
            </button>
          ))}
        </div>

        {/* 2-Way PDF Synchronization Box: Continue My Report */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h5 className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5 text-cyan-400" />
              <span>CONTINUE PREVIOUS REPORT</span>
            </h5>
            <p className="text-xs font-sans text-slate-400 mt-0.5">
              Upload a previously exported SkillGapAI PDF to restore your saved checklist state.
            </p>
            {uploadStatus && (
              <p className="text-xs font-mono text-cyan-400 mt-1">
                {uploadStatus}
              </p>
            )}
          </div>

          <label className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-mono font-medium text-slate-300 hover:text-white border border-white/10 cursor-pointer text-center shrink-0">
            <span>Upload Existing PDF</span>
            <input
              type="file"
              accept=".pdf"
              onChange={handlePdfUpload}
              className="hidden"
            />
          </label>
        </div>
      </section>

      {/* 7. Section 05: Recommended Capstone Projects */}
      <section className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
              05 — CAPSTONE PORTFOLIO TO BUILD
            </span>
            <h3 className="text-xl font-heading font-bold text-white mt-1">
              Verifiable Interview Deliverables
            </h3>
          </div>
          <FolderGit2 className="h-5 w-5 text-cyan-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(analysis.recommended_projects || analysis.recommendedProjects || []).slice(0, 3).map((proj: any) => (
            <div
              key={proj.project_title}
              className="p-5 rounded-xl bg-slate-950/70 border border-white/10 flex flex-col justify-between space-y-4"
            >
              <div>
                <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20 uppercase font-bold inline-block mb-2">
                  {proj.difficulty || "Intermediate"}
                </span>
                <h4 className="text-sm font-heading font-bold text-white mb-1.5">
                  {proj.project_title}
                </h4>
                <p className="text-xs font-sans text-slate-300 leading-relaxed">
                  {proj.description}
                </p>
              </div>
              <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-white/5">
                <span className="text-slate-300">Deliverable:</span> {proj.deliverables}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Bottom "YOUR NEXT MOVE" Final Callout */}
      <section className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/40 rounded-2xl p-8 text-center space-y-4 shadow-[0_0_35px_rgba(6,182,212,0.15)]">
        <h4 className="text-xl sm:text-2xl font-heading font-bold text-white">
          Don't try to learn everything at once.
        </h4>
        <p className="text-xs sm:text-sm font-sans text-slate-300 max-w-xl mx-auto leading-relaxed">
          Your highest-impact next step is <strong className="text-cyan-300">{nextBestSkill}</strong>. Download your report, complete the first checklist milestone, and come back when you're ready for the next move.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={handleDownloadPdf}
            className="px-8 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition shadow-[0_0_20px_rgba(34,211,238,0.4)] cursor-pointer"
          >
            DOWNLOAD REPORT (.PDF) ↓
          </button>
          <button
            onClick={onNavigateHome}
            className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono font-medium text-slate-300 hover:text-white border border-white/10 transition cursor-pointer"
          >
            Return to Home Hero
          </button>
        </div>
      </section>
    </div>
  );
};
