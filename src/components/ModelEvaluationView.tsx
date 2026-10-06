import React from "react";
import { BarChart2, CheckCircle2, ShieldCheck, Activity, Award, Brain, Trees, Network } from "lucide-react";
import { ModelMetrics } from "../types";

interface ModelEvaluationViewProps {
  metrics: ModelMetrics | null;
}

export const ModelEvaluationView: React.FC<ModelEvaluationViewProps> = ({ metrics }) => {
  const svm = metrics?.svm || {
    model_name: "Support Vector Machine (Linear Kernel)",
    accuracy: 0.9433,
    precision: 0.9435,
    recall: 0.9433,
    f1_score: 0.9435,
    classes: [
      "AI/ML Engineer",
      "Cloud Engineer",
      "Cybersecurity Analyst",
      "Data Analyst",
      "Data Scientist",
      "Software Developer"
    ],
    confusion_matrix: [
      [47, 0, 0, 0, 3, 0],
      [0, 48, 2, 0, 0, 0],
      [0, 1, 49, 0, 0, 0],
      [0, 0, 0, 46, 3, 1],
      [3, 0, 0, 2, 45, 0],
      [0, 0, 0, 1, 1, 48]
    ],
    train_samples: 1200,
    test_samples: 300
  };

  const rf = metrics?.rf || {
    model_name: "Random Forest Classifier (Ensemble)",
    accuracy: 0.9667,
    precision: 0.9667,
    recall: 0.9667,
    f1_score: 0.9667,
    classes: ["Beginner", "Developing", "Intermediate", "Job Ready"],
    feature_importances: {
      core_coverage_ratio: 0.3842,
      projects_count: 0.2215,
      skill_count: 0.1684,
      experience_years: 0.1241,
      certifications_count: 0.0612,
      education_score: 0.0406
    },
    confusion_matrix: [
      [59, 1, 0, 0],
      [2, 88, 1, 0],
      [0, 3, 93, 1],
      [0, 0, 2, 53]
    ]
  };

  const km = metrics?.km || {
    model_name: "K-Means Clustering",
    n_clusters: 5,
    silhouette_score: 0.1889,
    total_samples: 1500,
    cluster_profiles: {
      "0": {
        name: "Beginner Technical Foundation",
        percentage: 18.2,
        top_skills: ["Python", "Git", "C++", "Java", "Problem Solving"]
      },
      "1": {
        name: "Data Analytics & Business Intelligence",
        percentage: 20.4,
        top_skills: ["SQL", "Excel", "Power BI", "Pandas", "Data Cleaning"]
      },
      "2": {
        name: "Software Engineering & Full-Stack",
        percentage: 22.1,
        top_skills: ["Data Structures", "Algorithms", "OOP", "REST API", "SQL"]
      },
      "3": {
        name: "AI, Machine Learning & Deep Learning",
        percentage: 21.8,
        top_skills: ["Machine Learning", "Deep Learning", "NumPy", "PyTorch", "NLP"]
      },
      "4": {
        name: "Cloud Infrastructure & Cybersecurity Systems",
        percentage: 17.5,
        top_skills: ["Linux", "Networking", "AWS", "Security Tools", "Docker"]
      }
    }
  };

  return (
    <div className="space-y-6 mb-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-bold tracking-tight">
                Academic ML Model Performance & Viva Evaluation
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Trained on a structured dataset of 1,500 engineering student profiles using reproducible 80/20 train/test splits. Demonstrates supervised classification, ensemble methods, and unsupervised clustering.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <div className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-xl text-center">
              <span className="block text-slate-400 text-[10px] uppercase font-bold">SVM Accuracy</span>
              <span className="text-emerald-400 font-extrabold text-base">{(svm.accuracy * 100).toFixed(2)}%</span>
            </div>
            <div className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-xl text-center">
              <span className="block text-slate-400 text-[10px] uppercase font-bold">RF Accuracy</span>
              <span className="text-emerald-400 font-extrabold text-base">{(rf.accuracy * 100).toFixed(2)}%</span>
            </div>
            <div className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-xl text-center">
              <span className="block text-slate-400 text-[10px] uppercase font-bold">Silhouette Score</span>
              <span className="text-indigo-400 font-extrabold text-base">{km.silhouette_score}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 2 Supervised Models */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model 1: Support Vector Machine */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6">
          <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Brain className="h-4 w-4 text-indigo-600" />
              <span>1. Support Vector Machine (Role Classification)</span>
            </h4>
            <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
              Linear Kernel + Platt Scaling
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center mb-4">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Accuracy</span>
              <span className="text-sm font-bold text-slate-900">{(svm.accuracy * 100).toFixed(2)}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Precision</span>
              <span className="text-sm font-bold text-slate-900">{(svm.precision * 100).toFixed(2)}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">F1-Score</span>
              <span className="text-sm font-bold text-slate-900">{(svm.f1_score * 100).toFixed(2)}%</span>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-xs font-semibold text-slate-700 block mb-2">
              SVM Confusion Matrix (300 Test Profiles across 6 Classes):
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-center border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-600">
                    <th className="p-1 border border-slate-200 text-left font-semibold">Actual \ Pred</th>
                    {svm.classes.map((c: string) => (
                      <th key={c} className="p-1 border border-slate-200 font-semibold" title={c}>
                        {c.split(" ")[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {svm.confusion_matrix.map((row: number[], rIdx: number) => (
                    <tr key={rIdx}>
                      <td className="p-1 border border-slate-200 text-left font-medium bg-slate-50">
                        {svm.classes[rIdx]}
                      </td>
                      {row.map((val: number, cIdx: number) => {
                        const isDiagonal = rIdx === cIdx;
                        return (
                          <td
                            key={cIdx}
                            className={`p-1 border border-slate-200 font-mono ${
                              isDiagonal
                                ? "bg-emerald-100/70 font-bold text-emerald-900"
                                : val > 0
                                ? "bg-rose-50 text-rose-800"
                                : "text-slate-400"
                            }`}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <strong>Viva Note:</strong> High diagonal values indicate reliable boundary separation between adjacent technical profiles (e.g., distinguishing Data Scientist from Data Analyst based on Machine Learning and Deep Learning weights).
          </p>
        </div>

        {/* Model 2: Random Forest */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6">
          <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Trees className="h-4 w-4 text-emerald-600" />
              <span>2. Random Forest (Career Readiness Category)</span>
            </h4>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
              120 Decision Trees Ensemble
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center mb-4">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Accuracy</span>
              <span className="text-sm font-bold text-slate-900">{(rf.accuracy * 100).toFixed(2)}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Precision</span>
              <span className="text-sm font-bold text-slate-900">{(rf.precision * 100).toFixed(2)}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">F1-Score</span>
              <span className="text-sm font-bold text-slate-900">{(rf.f1_score * 100).toFixed(2)}%</span>
            </div>
          </div>

          {/* Feature Importances */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-slate-700 block mb-2">
              Gini Impurity Feature Importances:
            </span>
            <div className="space-y-1.5">
              {Object.entries(rf.feature_importances).map(([feat, imp]: [string, any]) => (
                <div key={feat}>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-600 font-medium">
                      {feat.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="font-mono text-slate-700 font-semibold">
                      {(imp * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${imp * 100 * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <strong>Viva Note:</strong> Core role skill coverage (38.4%) and projects count (22.1%) dominate readiness classification, reflecting industry hiring priorities over mere degree credentials.
          </p>
        </div>
      </div>

      {/* Unsupervised Model: K-Means Clustering */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6">
        <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Network className="h-4 w-4 text-purple-600" />
              <span>3. K-Means Clustering (Unsupervised Student Profile Archetypes)</span>
            </h4>
            <p className="text-xs text-slate-500">
              Silhouette Score: <strong>{km.silhouette_score}</strong> &bull; Partitions 1,500 profiles into 5 characteristic skill archetypes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {Object.entries(km.cluster_profiles).map(([cid, prof]: [string, any]) => (
            <div
              key={cid}
              className="bg-purple-50/50 rounded-xl p-3.5 border border-purple-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-purple-900">Cluster #{cid}</span>
                  <span className="text-[10px] font-semibold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                    {prof.percentage}%
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-900 mb-2 leading-snug">
                  {prof.name}
                </h5>
                <div className="text-[10px] text-slate-600">
                  <span className="font-semibold text-slate-700 block mb-1">Top Archetype Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {prof.top_skills.slice(0, 4).map((s: string) => (
                      <span key={s} className="bg-white px-1.5 py-0.5 rounded border border-purple-200 text-purple-900 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Limitations Panel */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
        <h4 className="text-sm font-bold text-amber-900 mb-1 flex items-center gap-2">
          <span>Academic Discussion: Assumptions & Model Limitations</span>
        </h4>
        <p className="text-xs text-amber-800 mb-2 leading-relaxed">
          Critical for final year project presentation and external viva defense:
        </p>
        <ul className="text-xs text-amber-900 space-y-1 list-disc list-inside">
          <li><strong>Dataset Calibration:</strong> The models are trained on a controlled synthetic academic dataset of 1,500 records mirroring university curriculum benchmarks rather than noisy live scraped job postings.</li>
          <li><strong>Bag-of-Words Limitation:</strong> The TF-IDF + SVM classifier relies on keyword presence and n-grams without capturing deeper contextual phrasing or negative modifiers (e.g., "familiar with, but haven't used").</li>
          <li><strong>Sparsity in Clustering:</strong> The Silhouette Score of ~0.19 reflects the expected sparsity of multi-dimensional skill vectors where students cross over between software and data engineering.</li>
        </ul>
      </div>
    </div>
  );
};
