import React from "react";
import { GraduationCap, Code2, ShieldCheck, Sparkles, BookOpen } from "lucide-react";

interface HeaderProps {
  onLoadDemo: (type: "aiml" | "analyst" | "software") => void;
  onOpenCodeModal: () => void;
  onOpenVivaModal: () => void;
  onDownloadReport?: () => void;
  onToggleHero?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadDemo,
  onOpenCodeModal,
  onOpenVivaModal,
  onDownloadReport
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Title & Academic Branding */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight font-heading">
                SkillGap<span className="text-indigo-600">AI</span>
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                7th Sem ML Project
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600">
              Future Skill Gap Analyzer, Readiness Predictor & Personalized Career Roadmap
            </p>
          </div>
        </div>

        {/* Quick Preloaded Profiles & Report Print */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center bg-indigo-50 rounded-xl p-1 border border-indigo-200 shadow-2xs">
            <span className="text-indigo-950 px-2.5 font-bold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> Preloaded:
            </span>
            <button
              onClick={() => onLoadDemo("aiml")}
              className="px-3 py-1.5 rounded-lg bg-white text-indigo-950 font-semibold hover:bg-indigo-600 hover:text-white transition shadow-2xs cursor-pointer flex items-center gap-1"
              title="Loads Preloaded Profile 1: Aarav Sharma (AI/ML Track)"
            >
              <span>👤 1: Aarav (AI/ML)</span>
            </button>
            <button
              onClick={() => onLoadDemo("analyst")}
              className="px-3 py-1.5 rounded-lg bg-white text-indigo-950 font-semibold hover:bg-indigo-600 hover:text-white transition shadow-2xs ml-1.5 cursor-pointer flex items-center gap-1"
              title="Loads Preloaded Profile 2: Priya Patel (Data Analyst Track)"
            >
              <span>👤 2: Priya (Analyst)</span>
            </button>
          </div>

          {/* Download & Print Report Action */}
          {onDownloadReport && (
            <button
              onClick={onDownloadReport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition shadow-xs cursor-pointer active:scale-95"
              title="Download or Print PDF Career Assessment Report"
            >
              <span>📄 Print / Export PDF</span>
            </button>
          )}

          <button
            onClick={onOpenVivaModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold hover:bg-emerald-100 transition cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-700" />
            Viva Guide
          </button>

          <button
            onClick={onOpenCodeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <Code2 className="h-3.5 w-3.5 text-slate-700" />
            Code
          </button>
        </div>
      </div>
    </header>
  );
};
