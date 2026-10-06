import React from "react";
import { FolderGit2, BookOpen, ExternalLink, Code2, Sparkles, CheckCircle2 } from "lucide-react";
import { AnalysisResult } from "../types";

interface ProjectsAndResourcesProps {
  analysis: AnalysisResult;
}

export const ProjectsAndResources: React.FC<ProjectsAndResourcesProps> = ({ analysis }) => {
  const { recommendedProjects, recommendedResources, targetRole } = analysis;

  return (
    <div className="space-y-6 mb-6">
      {/* Portfolio Projects Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6">
        <div className="border-b border-slate-100 pb-4 mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-indigo-600" />
              <span>Recommended Capstone Projects for {targetRole}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Targeted projects addressing your specific skill gaps to showcase in viva presentations and GitHub portfolios.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedProjects.map((proj) => (
            <div
              key={proj.project_title}
              className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 flex flex-col justify-between hover:border-indigo-300 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    proj.difficulty === "Beginner"
                      ? "bg-emerald-100 text-emerald-800"
                      : proj.difficulty === "Intermediate"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {proj.difficulty}
                  </span>
                  {proj.gaps_addressed && proj.gaps_addressed.length > 0 && (
                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                      Bridges {proj.gaps_addressed.length} Gap{proj.gaps_addressed.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                  {proj.project_title}
                </h4>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {proj.description}
                </p>

                <div className="mb-3">
                  <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Skills Developed:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {proj.skills_covered.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700 block">Deliverables:</span>
                <span>{proj.deliverables}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Free Curated Learning Resources */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6">
        <div className="border-b border-slate-100 pb-4 mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              <span>Curated Free Learning Resources</span>
            </h3>
            <p className="text-xs text-slate-500">
              Zero-cost official documentation, university courses, and guided practice platforms for missing skills.
            </p>
          </div>
        </div>

        {recommendedResources.length === 0 ? (
          <div className="text-xs text-slate-500 p-4 text-center bg-slate-50 rounded-xl">
            No active skill gaps identified that require supplementary documentation.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Target Skill</th>
                  <th className="py-2.5 px-3">Resource Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Platform</th>
                  <th className="py-2.5 px-3">Difficulty</th>
                  <th className="py-2.5 px-3 text-right">Access Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recommendedResources.map((res, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {res.skill}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">
                      {res.resource_name}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                        {res.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {res.platform}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        res.difficulty === "Beginner"
                          ? "bg-emerald-50 text-emerald-700"
                          : res.difficulty === "Intermediate"
                          ? "bg-indigo-50 text-indigo-700"
                          : "bg-purple-50 text-purple-700"
                      }`}>
                        {res.difficulty}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                      >
                        Free Link <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
