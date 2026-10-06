import React from "react";
import { Brain, AlertCircle, Sparkles, ChevronRight, BarChart3 } from "lucide-react";
import { AnalysisResult } from "../types";

interface CareerPredictionCardProps {
  analysis: AnalysisResult;
}

export const CareerPredictionCard: React.FC<CareerPredictionCardProps> = ({ analysis }) => {
  const { svmResult, targetRole } = analysis;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            <span>Support Vector Machine (SVM) Career Classifier</span>
          </h3>
          <p className="text-xs text-slate-500">
            Multi-class supervised classification with calibrated probability estimation over student skill feature space.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Model Confidence:</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            svmResult.confidence >= 70
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : svmResult.confidence >= 50
              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}>
            {svmResult.confidence}%
          </span>
        </div>
      </div>

      {/* Low confidence warning banner */}
      {svmResult.is_low_confidence && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Prediction confidence is low (&lt; 45%).</span>
            <p className="mt-0.5 text-amber-800">
              Your technical skill profile spans multiple interdisciplinary domains. Consider reviewing adjacent tracks like Data Science and Software Engineering.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Predicted Role Card (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-50/80 to-slate-50 rounded-xl p-4 border border-indigo-100">
          <div className="text-[11px] uppercase font-bold tracking-wider text-indigo-600 mb-1">
            Top Predicted Alignment
          </div>
          <div className="text-xl font-extrabold text-slate-900 mb-2">
            {svmResult.predicted_role}
          </div>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Based on maximum-margin hyperplane separation in the TF-IDF feature space, your profile shows the highest affinity with <strong>{svmResult.predicted_role}</strong>.
          </p>

          <div className="pt-2 border-t border-indigo-100/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">Currently Evaluating:</span>
            <span className="font-bold text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-200">
              {targetRole}
            </span>
          </div>
        </div>

        {/* Right: Posterior Probability Distribution (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
            <span className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-slate-500" />
              Role Affinity Distribution (SVM Softmax Output)
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Deterministic %</span>
          </div>

          <div className="space-y-2">
            {svmResult.ranking.map(([role, prob]) => {
              const isSelected = role === targetRole;
              const isTop = role === svmResult.predicted_role;

              return (
                <div key={role} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-medium flex items-center gap-1.5 ${
                      isSelected ? "text-indigo-900 font-bold" : "text-slate-700"
                    }`}>
                      {role}
                      {isTop && (
                        <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-semibold">
                          Top Match
                        </span>
                      )}
                      {isSelected && !isTop && (
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                          Selected
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-slate-600 text-xs font-semibold">
                      {prob}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isTop ? "bg-indigo-600" : isSelected ? "bg-indigo-400" : "bg-slate-300"
                      }`}
                      style={{ width: `${Math.min(prob, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
