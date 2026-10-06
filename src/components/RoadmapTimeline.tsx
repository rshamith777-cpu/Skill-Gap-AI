import React from "react";
import { Compass, CheckCircle2, Clock, FolderGit2, Sparkles, Milestone } from "lucide-react";
import { AnalysisResult } from "../types";

interface RoadmapTimelineProps {
  analysis: AnalysisResult;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ analysis }) => {
  const { roadmap, targetRole } = analysis;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 mb-6">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Compass className="h-5 w-5 text-indigo-600" />
          <span>Personalized 5-Stage Career Roadmap: {targetRole}</span>
        </h3>
        <p className="text-xs text-slate-500">
          Curated timeline sequencing your skill gaps into achievable learning milestones, culminating in viva defense and technical interviews.
        </p>
      </div>

      <div className="relative border-l-2 border-indigo-200 ml-4 md:ml-6 space-y-8 pb-4">
        {roadmap.map((stage, idx) => {
          const isDone = stage.status.includes("Completed");

          return (
            <div key={stage.stage_title} className="relative pl-6 md:pl-8">
              {/* Timeline marker node */}
              <div
                className={`absolute -left-[17px] top-0 h-8 w-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                  isDone
                    ? "bg-emerald-600 border-white text-white shadow-sm"
                    : "bg-white border-indigo-600 text-indigo-700 shadow-sm"
                }`}
              >
                {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
              </div>

              {/* Stage Header */}
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 hover:border-indigo-300 transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{stage.stage_title}</span>
                  </h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      {stage.estimated_duration}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                        isDone
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-indigo-100 text-indigo-800"
                      }`}
                    >
                      {stage.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-3 italic">
                  <strong>Focus:</strong> {stage.focus}
                </p>

                {/* Sub-skills list */}
                {stage.skills && stage.skills.length > 0 && (
                  <div className="space-y-2 mt-3 pt-3 border-t border-slate-200/80">
                    <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block">
                      Target Competencies & Learning Topics:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {stage.skills.map((sk) => (
                        <div
                          key={sk.skill}
                          className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs shadow-2xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800 flex items-center gap-1">
                              {sk.already_started ? "✓" : "🎯"} {sk.skill}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                sk.already_started
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-indigo-50 text-indigo-700"
                              }`}
                            >
                              {sk.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{sk.topic}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects in Stage 4 */}
                {stage.projects && stage.projects.length > 0 && (
                  <div className="space-y-2 mt-3 pt-3 border-t border-slate-200/80">
                    <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block">
                      Recommended Practical Portfolio Projects:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {stage.projects.map((proj) => (
                        <div
                          key={proj.project_title}
                          className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                              <FolderGit2 className="h-3.5 w-3.5 text-indigo-600" />
                              {proj.project_title}
                            </span>
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-semibold">
                              {proj.difficulty}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mb-1.5">
                            {proj.description}
                          </p>
                          <div className="text-[10px] text-slate-500">
                            <strong>Deliverable:</strong> {proj.deliverables}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Items in Stage 5 */}
                {stage.action_items && stage.action_items.length > 0 && (
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-200/80">
                    <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                      Final Viva & Technical Interview Action Items:
                    </span>
                    {stage.action_items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2 rounded border border-slate-200"
                      >
                        <Milestone className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
