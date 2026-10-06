import React from "react";
import { CheckCircle2, AlertCircle, XCircle, ArrowUpRight, HelpCircle } from "lucide-react";
import { AnalysisResult } from "../types";

interface SkillGapViewProps {
  analysis: AnalysisResult;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({ analysis }) => {
  const { gaps, targetRole } = analysis;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 mb-6">
      <div className="border-b border-slate-100 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Skill Gap Analysis & Requirement Categorization</span>
          </h3>
          <p className="text-xs text-slate-500">
            Comparing verified profile competencies against benchmark expectations for <strong>{targetRole}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
            🟢 {gaps.counts.strong} Strong
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-100">
            🟡 {gaps.counts.weak} Weak
          </span>
          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-100">
            🔴 {gaps.counts.missing} Missing
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Strong Skills Column */}
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Strong Skills ({gaps.strong_skills.length})
              </h4>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
              Verified
            </span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {gaps.strong_skills.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No strong profile skills identified yet.
              </p>
            ) : (
              gaps.strong_skills.map((item) => (
                <div
                  key={item.skill}
                  className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs hover:border-emerald-300 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">
                      ✓ {item.skill}
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-medium">
                      {item.evidence_level || "Active"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {item.reason}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Weak Skills Column */}
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Weak / Developing ({gaps.weak_skills.length})
              </h4>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold">
              Needs Depth
            </span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {gaps.weak_skills.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No partial skills needing attention.
              </p>
            ) : (
              gaps.weak_skills.map((item) => (
                <div
                  key={item.skill}
                  className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs hover:border-amber-300 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">
                      ~ {item.skill}
                    </span>
                    <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded font-medium">
                      Medium Priority
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {item.reason}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Missing Skills Column */}
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-rose-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Missing Skills ({gaps.missing_skills.length})
              </h4>
            </div>
            <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-semibold">
              To Acquire
            </span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {gaps.missing_skills.length === 0 ? (
              <p className="text-xs text-emerald-600 font-semibold py-2">
                All benchmark role skills are covered!
              </p>
            ) : (
              gaps.missing_skills.map((item) => (
                <div
                  key={item.skill}
                  className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs hover:border-rose-300 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">
                      ✗ {item.skill}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      item.priority === "High"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {item.priority} Priority
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {item.reason}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
