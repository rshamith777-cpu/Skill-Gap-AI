import React, { useState } from "react";
import { X, ArrowDown, ChevronRight, Activity, Cpu, CheckCircle2 } from "lucide-react";

interface MlEnginePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateAnalyze: () => void;
}

interface PipelineStage {
  id: string;
  name: string;
  label: string;
  subhead: string;
  desc: string;
  details: string[];
}

const STAGES: PipelineStage[] = [
  {
    id: "resume",
    name: "RESUME",
    label: "DOCUMENT INGESTION",
    subhead: "RAW INPUT DATA",
    desc: "Ingests raw candidate documents (.pdf, .docx, .txt) with local parsing and OCR fallbacks for scanned images.",
    details: [
      "Zero external API transmission (100% in-memory)",
      "Handles dirty ASCII, double spaces, and layout artifacts",
    ],
  },
  {
    id: "nlp",
    name: "NLP",
    label: "RESUME UNDERSTANDING",
    subhead: "SYNONYM & ENTITY EXTRACTION",
    desc: "NLP extracts relevant skills and information from the uploaded resume using canonical dictionary mappings.",
    details: [
      "Synonym resolution: 'ML' → 'Machine Learning', 'tf' → 'TensorFlow'",
      "Stopword filtering & regex boundary tokenization",
    ],
  },
  {
    id: "fe",
    name: "FEATURE ENGINEERING",
    label: "VECTOR SPACE FORMULATION",
    subhead: "TF-IDF & COMPOSITE VECTORS",
    desc: "Transforms textual profiles and skill indicators into sparse weighted numerical vectors in high-dimensional Euclidean space.",
    details: [
      "TfidfVectorizer token weighting across vocabulary",
      "Continuous Core (1.5x) vs Supporting (1.0x) importance weights",
    ],
  },
  {
    id: "svm",
    name: "SVM",
    label: "CAREER CLASSIFICATION",
    subhead: "SUPERVISED DISCRIMINATIVE LEARNING",
    desc: "SVM learns patterns from labeled career profiles and predicts the most suitable career role.",
    details: [
      "Linear kernel maximizing separation margin between adjacent tracks",
      "Platt scaling calibration yielding calibrated confidence percentages",
      "94.33% benchmark accuracy across 6 technical roles",
    ],
  },
  {
    id: "rf",
    name: "RANDOM FOREST",
    label: "READINESS PREDICTION",
    subhead: "ENSEMBLE DECISION TREES",
    desc: "Random Forest combines multiple decision trees to estimate the student's career-readiness category.",
    details: [
      "120 randomized trees voting on readiness: Beginner, Developing, Intermediate, Job Ready",
      "Gini impurity splits prioritized on Core Skill Coverage and Capstone Projects",
      "96.67% benchmark accuracy on academic test profiles",
    ],
  },
  {
    id: "kmeans",
    name: "K-MEANS",
    label: "PROFILE CLUSTERING",
    subhead: "UNSUPERVISED PEER ARCHETYPES",
    desc: "K-Means discovers groups of students with similar skill profiles.",
    details: [
      "Partitions student skill vectors into 5 distinct clusters",
      "Measures Euclidean distance to cluster centroid to explain student positioning",
    ],
  },
  {
    id: "gap",
    name: "SKILL GAP",
    label: "COSINE SIMILARITY & GAPS",
    subhead: "DETERMINISTIC DIAGNOSIS",
    desc: "Computes exact Cosine Similarity between candidate vector and target role benchmark, segmenting into Strong, Developing, and Missing.",
    details: [
      "Formula: Cosine Sim = (A • B) / (||A|| * ||B||)",
      "High/Medium priority rules assigned to missing core skills",
    ],
  },
  {
    id: "roadmap",
    name: "CAREER ROADMAP",
    label: "PERSONALIZED MILESTONES",
    subhead: "ACTIONABLE REMEDIATION",
    desc: "Generates a personalized 5-stage learning path with curated free tutorials and project deliverables.",
    details: [
      "Stage 1 Foundation → Stage 2 Core → Stage 3 Advanced → Stage 4 Projects → Stage 5 Career Prep",
      "Directly links missing skills to practical portfolio builds",
    ],
  },
];

export const MlEnginePanel: React.FC<MlEnginePanelProps> = ({
  isOpen,
  onClose,
  onNavigateAnalyze,
}) => {
  const [activeStageId, setActiveStageId] = useState<string>("svm");

  if (!isOpen) return null;

  const currentStage = STAGES.find((s) => s.id === activeStageId) || STAGES[3];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-md transition-all">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-out glass drawer */}
      <div className="relative w-full max-w-2xl h-full bg-slate-950/90 border-l border-white/10 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-lg font-mono font-bold text-white tracking-wider">
                  THE ML ENGINE
                </h3>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">
                End-to-End Machine Learning Pipeline Architecture
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sequential Pipeline Breadcrumb */}
          <div className="mb-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-2">
              PIPELINE EXECUTION FLOW (CLICK ANY STAGE):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {STAGES.map((s, idx) => {
                const isActive = s.id === activeStageId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveStageId(s.id)}
                    className={`p-2 rounded-lg text-left text-xs font-mono transition-all cursor-pointer border ${
                      isActive
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                        : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                    }`}
                  >
                    <div className="text-[9px] text-slate-500">0{idx + 1}</div>
                    <div className="font-bold truncate">{s.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Stage Detail Card */}
          <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                STAGE SPECIFICATION &bull; {currentStage.subhead}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                ACTIVE
              </span>
            </div>

            <h4 className="text-xl font-mono font-extrabold text-white mb-2 tracking-tight">
              {currentStage.label}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {currentStage.desc}
            </p>

            <div className="space-y-2 pt-3 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                MATHEMATICAL / ALGORITHMIC PRINCIPLES:
              </span>
              {currentStage.details.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-mono text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between gap-3">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Deterministic results. No paid APIs.
          </span>
          <button
            onClick={() => {
              onClose();
              onNavigateAnalyze();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
          >
            <span>Run Pipeline on My Resume</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
