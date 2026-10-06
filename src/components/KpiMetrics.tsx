import React from "react";
import { Activity, Target, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { AnalysisResult } from "../types";

interface KpiMetricsProps {
  analysis: AnalysisResult;
}

export const KpiMetrics: React.FC<KpiMetricsProps> = ({ analysis }) => {
  const { readinessTransparent, matchPercentage, gaps, targetRole } = analysis;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* 1. Readiness Score */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Career Readiness</span>
          <Activity className="h-4 w-4 text-indigo-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
            {readinessTransparent.score}%
          </span>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            {readinessTransparent.benchmark_category}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          Composite score (Skills, Projects, Exp, Certs)
        </p>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${readinessTransparent.score}%` }}
          />
        </div>
      </div>

      {/* 2. Skill Match Cosine Percentage */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Skill Match</span>
          <Target className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
            {matchPercentage}%
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            Cosine Sim
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          Against required {targetRole} skill vector
        </p>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(matchPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* 3. Strong Skills Count */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Strong Skills</span>
          <CheckCircle className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-extrabold text-emerald-700">
            {gaps.counts.strong}
          </span>
          <span className="text-xs text-slate-500">
            verified competencies
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          Possessed with strong evidence
        </p>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min((gaps.counts.strong / 12) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* 4. Missing Skills Needed */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Missing Skills</span>
          <AlertTriangle className="h-4 w-4 text-rose-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-extrabold text-rose-600">
            {gaps.counts.missing}
          </span>
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
            {gaps.counts.high_priority_missing} Core
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          Target role prerequisites absent from profile
        </p>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div
            className="bg-rose-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min((gaps.counts.missing / 10) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
