import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, X, Plus, ShieldCheck, HelpCircle } from "lucide-react";
import { CANONICAL_SKILLS, CAREER_ROLES_DATA } from "../data/fallbackData";
import { normalizeSkillToken, extractSkillsFromResume } from "../utils/mlEngine";

interface ProfileFormProps {
  studentName: string;
  setStudentName: (v: string) => void;
  degree: string;
  setDegree: (v: string) => void;
  gradYear: number;
  setGradYear: (v: number) => void;
  experienceYears: number;
  setExperienceYears: (v: number) => void;
  projectsInput: string;
  setProjectsInput: (v: string) => void;
  certificationsCount: number;
  setCertificationsCount: (v: number) => void;
  userSkills: string[];
  setUserSkills: (skills: string[]) => void;
  targetRole: string;
  setTargetRole: (r: string) => void;
  extractedText: string;
  setExtractedText: (t: string) => void;
  evidenceCounts: Record<string, number>;
  setEvidenceCounts: (c: Record<string, number>) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  studentName,
  setStudentName,
  degree,
  setDegree,
  gradYear,
  setGradYear,
  experienceYears,
  setExperienceYears,
  projectsInput,
  setProjectsInput,
  certificationsCount,
  setCertificationsCount,
  userSkills,
  setUserSkills,
  targetRole,
  setTargetRole,
  extractedText,
  setExtractedText,
  evidenceCounts,
  setEvidenceCounts
}) => {
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [showTextPreview, setShowTextPreview] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Clear / Remove Uploaded File and Reset to clean state
  const handleRemoveFile = () => {
    setUploadedFileName(null);
    setUploadMessage(null);
    setExtractedText("");
    setStudentName("");
    setExperienceYears(0.0);
    setProjectsInput("");
    setCertificationsCount(0);
    setUserSkills([]);
    setEvidenceCounts({});
  };

  // Local file reader & auto-fill engine
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsParsing(true);
    setUploadMessage(null);

    try {
      // 1. Read base64 to send to backend for accurate pypdf parsing
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const fileBase64 = btoa(binary);

      let text = "";
      if (file.name.endsWith(".txt")) {
        text = new TextDecoder().decode(bytes);
      }

      // Call /api/parse-resume with base64 for full python pypdf extraction
      const resp = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          fileBase64,
          filename: file.name
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        const extracted = data.text || "";
        setExtractedText(extracted);

        // Auto-fill extracted candidate fields if found
        if (data.details) {
          if (data.details.name) setStudentName(data.details.name);
          if (data.details.degree) setDegree(data.details.degree);
          if (data.details.gradYear) setGradYear(data.details.gradYear);
          if (data.details.experienceYears !== undefined && data.details.experienceYears > 0) {
            setExperienceYears(data.details.experienceYears);
          }
          if (data.details.projects) setProjectsInput(data.details.projects);
          if (data.details.certificationsCount !== undefined) {
            setCertificationsCount(data.details.certificationsCount);
          }
        }

        // Auto-fill skills
        const foundSkills = data.skills || [];
        if (foundSkills.length > 0) {
          const merged = Array.from(new Set([...userSkills, ...foundSkills])).sort();
          setUserSkills(merged);
          setEvidenceCounts({ ...evidenceCounts, ...(data.evidenceCounts || {}) });
          setUploadMessage(`Successfully parsed ${file.name}. Auto-filled profile details & extracted ${foundSkills.length} skills!`);
        } else {
          setUploadMessage(`Successfully parsed ${file.name}. Profile details filled.`);
        }
        return;
      }

      // Client-side fallback if server not reachable
      const fallbackCleaned = binary.replace(/[^\x20-\x7E\t\n\r]/g, " ");
      setExtractedText(fallbackCleaned);
      const { skills, evidenceCounts: counts } = extractSkillsFromResume(fallbackCleaned);
      if (skills.length > 0) {
        const merged = Array.from(new Set([...userSkills, ...skills])).sort();
        setUserSkills(merged);
        setEvidenceCounts({ ...evidenceCounts, ...counts });
        setUploadMessage(`Parsed ${file.name} locally. Detected ${skills.length} skills.`);
      }
    } catch (err: any) {
      setUploadMessage(`Extracted with warnings: ${err.message}`);
    } finally {
      setIsParsing(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setUserSkills(userSkills.filter(s => s !== skillToRemove));
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillInput.trim()) return;

    const normalized = normalizeSkillToken(customSkillInput);
    if (!userSkills.includes(normalized)) {
      setUserSkills([...userSkills, normalized].sort());
      setEvidenceCounts({ ...evidenceCounts, [normalized]: 1 });
    }
    setCustomSkillInput("");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 mb-6">
      <div className="border-b border-slate-100 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Profile & Technical Competencies</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-normal">
              Stage 1 / Diagnosis
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Upload your resume or enter skills manually. The system performs NLP extraction and synonym mapping locally.
          </p>
        </div>

        {/* Privacy Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200/60 shrink-0">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Local NLP: No external APIs used</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Resume Upload & Text (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {!uploadedFileName && !extractedText ? (
            <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300 hover:border-indigo-400 transition text-center relative">
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center py-2 pointer-events-none">
                <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  {isParsing ? "Extracting plain text locally..." : "Upload Resume (.PDF, .DOCX, .TXT)"}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Drag and drop or click to browse. Processed in-memory.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {uploadedFileName || "Uploaded Resume Document"}
                  </div>
                  <div className="text-[11px] text-indigo-700">
                    {extractedText ? `${extractedText.length} characters parsed in-memory` : "Parsed"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 text-xs font-semibold border border-rose-200 transition cursor-pointer flex items-center gap-1 shrink-0"
                title="Remove uploaded resume and reset form"
              >
                <X className="h-3.5 w-3.5" />
                <span>Remove File</span>
              </button>
            </div>
          )}

          {uploadMessage && (
            <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-800 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>{uploadMessage}</div>
            </div>
          )}

          {extractedText && (
            <div>
              <button
                type="button"
                onClick={() => setShowTextPreview(!showTextPreview)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5" />
                {showTextPreview ? "Hide Extracted Plain Text" : `View Extracted Resume Text (${extractedText.length} chars)`}
              </button>
              {showTextPreview && (
                <textarea
                  readOnly
                  value={extractedText}
                  className="w-full mt-2 h-36 text-xs p-3 font-mono bg-slate-900 text-slate-200 rounded-lg border border-slate-700 resize-none"
                />
              )}
            </div>
          )}

          {/* Academic Info */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Student Name"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Degree / Program
                </label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  <option value="B.E. Computer Science and Engineering">B.E. Computer Science</option>
                  <option value="B.Tech Artificial Intelligence and Data Science">B.Tech AI & Data Science</option>
                  <option value="B.Tech Information Technology">B.Tech Information Tech</option>
                  <option value="B.E. Electronics and Communication">B.E. Electronics & Comm</option>
                  <option value="BCA / MCA Computer Applications">BCA / MCA Applications</option>
                  <option value="M.Tech Data Science & AI">M.Tech Data Science & AI</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Graduation Year
                </label>
                <select
                  value={gradYear}
                  onChange={(e) => setGradYear(parseInt(e.target.value, 10))}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Practical Experience (Internships/Work)
                </label>
                <span className="text-xs font-mono font-medium text-indigo-600">
                  {experienceYears} Years
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="0.5"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Skills, Projects & Goal Selection (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Target Role Selector */}
          <div className="bg-gradient-to-r from-indigo-50/70 to-slate-50 p-3.5 rounded-xl border border-indigo-100">
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Target Career Role Goal
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white font-medium text-indigo-950"
            >
              <option value="Let AI/ML system recommend a career for me">
                🤖 Let AI/ML system recommend a career for me (SVM Classifier)
              </option>
              {CAREER_ROLES_DATA.map((r) => (
                <option key={r.role_name} value={r.role_name}>
                  🎯 {r.role_name} — {r.focus_area}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Selecting automated recommendation triggers the SVM model to evaluate your profile's highest-likelihood role.
            </p>
          </div>

          {/* Current Verified Skills Tag List */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-800">
                Verified Technical Skills ({userSkills.length})
              </label>
              {userSkills.length > 0 && (
                <button
                  type="button"
                  onClick={() => setUserSkills([])}
                  className="text-[11px] text-rose-600 hover:text-rose-800 cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="min-h-[90px] max-h-[140px] overflow-y-auto p-2.5 bg-slate-50/80 rounded-xl border border-slate-200 flex flex-wrap gap-1.5 content-start">
              {userSkills.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-2">
                  No skills selected yet. Click skills below, upload a resume, or use a quick demo preset above.
                </div>
              ) : (
                userSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-800 border border-slate-200 shadow-2xs group"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      title={`Remove ${s}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Quick Add Custom Skill */}
          <form onSubmit={handleAddCustomSkill} className="flex gap-2">
            <input
              type="text"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              placeholder="Add skill (e.g., PyTorch, Docker, Spring, Power BI)..."
              className="grow text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </form>

          {/* Projects and Certifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Completed Projects (One per line)
              </label>
              <textarea
                value={projectsInput}
                onChange={(e) => setProjectsInput(e.target.value)}
                placeholder="ML prediction system&#10;Web application"
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Relevant Certifications Count
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={certificationsCount}
                onChange={(e) => setCertificationsCount(parseInt(e.target.value, 10) || 0)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                AWS, Coursera, DeepLearning.AI, HackerRank, etc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
