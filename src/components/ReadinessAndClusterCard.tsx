import React from "react";
import { Trees, Network, Award, Layers, CheckCircle2 } from "lucide-react";
import { AnalysisResult } from "../types";

interface ReadinessAndClusterCardProps {
  analysis: AnalysisResult;
}

export const ReadinessAndClusterCard: React.FC<ReadinessAndClusterCardProps> = ({ analysis }) => {
  const { readinessRF, readinessTransparent, cluster, targetRole } = analysis;
  const { breakdown } = readinessTransparent;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
      {/* Left (7 cols): Readiness Classification & Point Decomposition */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6">
        <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Trees className="h-5 w-5 text-emerald-600" />
              <span>Random Forest Readiness & Objective Scoring</span>
            </h3>
            <p className="text-xs text-slate-500">
              Comparing ensemble ML decision trees against our transparent 100-point curriculum rubric.
            </p>
          </div>
        </div>

        {/* Comparison Callout: ML Prediction vs Calculated Score */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
              ML Model Category (Random Forest)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">
                {readinessRF.predicted_category}
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                {readinessRF.confidence}% Conf.
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Classified by 120-tree random forest ensemble
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
            <span className="text-[11px] uppercase font-bold text-indigo-700 tracking-wider block mb-1">
              Transparent Calculated Score
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-indigo-950">
                {readinessTransparent.score} / 100
              </span>
              <span className="text-xs bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full font-semibold">
                {readinessTransparent.benchmark_category}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Deterministic point accumulation
            </p>
          </div>
        </div>

        {/* Point Breakdown Bars */}
        <div className="space-y-2.5 pt-1">
          <div className="text-xs font-semibold text-slate-700 mb-2">
            Rubric Point Allocation Breakdown:
          </div>

          {/* Core Skills */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">
                1. Core Required Skills Coverage ({breakdown.core_matched_count}/{breakdown.core_total_count})
              </span>
              <span className="font-mono font-semibold text-slate-800">
                {breakdown.core_skills_score} / {breakdown.core_max} pts
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{ width: `${(breakdown.core_skills_score / breakdown.core_max) * 100}%` }}
              />
            </div>
          </div>

          {/* Supporting Skills */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">
                2. Supporting Skills Coverage
              </span>
              <span className="font-mono font-semibold text-slate-800">
                {breakdown.supporting_skills_score} / {breakdown.supporting_max} pts
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-400 h-full rounded-full"
                style={{ width: `${(breakdown.supporting_skills_score / breakdown.supporting_max) * 100}%` }}
              />
            </div>
          </div>

          {/* Practical Projects */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">
                3. Practical Portfolio Projects
              </span>
              <span className="font-mono font-semibold text-slate-800">
                {breakdown.projects_score} / {breakdown.projects_max} pts
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${(breakdown.projects_score / breakdown.projects_max) * 100}%` }}
              />
            </div>
          </div>

          {/* Experience */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">
                4. Practical Experience / Internships
              </span>
              <span className="font-mono font-semibold text-slate-800">
                {breakdown.experience_score} / {breakdown.experience_max} pts
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${(breakdown.experience_score / breakdown.experience_max) * 100}%` }}
              />
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">
                5. Relevant Industry Certifications
              </span>
              <span className="font-mono font-semibold text-slate-800">
                {breakdown.certifications_score} / {breakdown.certifications_max} pts
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full"
                style={{ width: `${(breakdown.certifications_score / breakdown.certifications_max) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right (5 cols): K-Means Profile Clustering */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 flex flex-col justify-between">
        <div>
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Network className="h-5 w-5 text-purple-600" />
              <span>K-Means Student Skill Clustering</span>
            </h3>
            <p className="text-xs text-slate-500">
              Unsupervised clustering grouping student profiles into 5 characteristic archetypes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 mb-4">
            <div className="text-[11px] uppercase font-bold text-purple-700 tracking-wider mb-1">
              Assigned Skill Profile Archetype
            </div>
            <div className="text-lg font-extrabold text-purple-950 mb-1">
              {cluster.cluster_name}
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-purple-800 font-semibold mb-2">
              <Layers className="h-3.5 w-3.5" />
              <span>Cluster #{cluster.cluster_id}</span>
              {cluster.distance_to_centroid && (
                <span className="text-purple-600 font-normal">
                  &bull; Dist to Centroid: {cluster.distance_to_centroid}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-2.5 rounded-lg border border-purple-100">
              {cluster.explanation}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Unsupervised Learning Value:
          </div>
          <p className="text-[11px] text-slate-500">
            Unlike static filters, K-Means models the natural grouping of technical students in geometric vector space, helping mentors benchmark peer preparedness.
          </p>
        </div>
      </div>
    </div>
  );
};
