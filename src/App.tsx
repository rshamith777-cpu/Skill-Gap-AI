import React, { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { ProfileForm } from "./components/ProfileForm";
import { KpiMetrics } from "./components/KpiMetrics";
import { CareerPredictionCard } from "./components/CareerPredictionCard";
import { ReadinessAndClusterCard } from "./components/ReadinessAndClusterCard";
import { SkillGapView } from "./components/SkillGapView";
import { RoadmapTimeline } from "./components/RoadmapTimeline";
import { ProjectsAndResources } from "./components/ProjectsAndResources";
import { ModelEvaluationView } from "./components/ModelEvaluationView";
import { VivaDocView } from "./components/VivaDocView";
import { CodeExplorerModal } from "./components/CodeExplorerModal";
import { performCompleteAnalysis } from "./utils/mlEngine";
import { generateSkillGapPdf, buildInitialChecklist } from "./utils/reportPdf";
import { ModelMetrics } from "./types";
import {
  LayoutDashboard,
  Compass,
  FolderGit2,
  Activity,
  BookOpen
} from "lucide-react";

export default function App() {
  // Student Profile State: Initialized with preloaded Profile 1 (Aarav Sharma - AI/ML)
  const [studentName, setStudentName] = useState("Aarav Sharma");
  const [degree, setDegree] = useState("B.E. Computer Science and Engineering");
  const [gradYear, setGradYear] = useState(2025);
  const [experienceYears, setExperienceYears] = useState(0.5);
  const [projectsInput, setProjectsInput] = useState("ML prediction system\nImage classification demo");
  const [certificationsCount, setCertificationsCount] = useState(1);
  const [userSkills, setUserSkills] = useState<string[]>([
    "Python",
    "SQL",
    "Pandas",
    "NumPy",
    "Machine Learning",
    "Git"
  ]);
  const [targetRole, setTargetRole] = useState("AI/ML Engineer");
  const [extractedText, setExtractedText] = useState(
    "Aarav Sharma - Final Year Computer Science Student\nEducation: B.E. Computer Science and Engineering\nSkills: Python, SQL, Pandas, NumPy, Machine Learning, Git\nProjects: ML Prediction System for Student Performance, Web Application in Python\nExperience: 6-month Data Science intern working with tabular data and Pandas wrangling."
  );
  const [evidenceCounts, setEvidenceCounts] = useState<Record<string, number>>({
    Python: 3,
    SQL: 1,
    Pandas: 2,
    NumPy: 2,
    "Machine Learning": 2,
    Git: 1
  });

  // UI Navigation State
  const [activeTab, setActiveTab] = useState<"dashboard" | "roadmap" | "projects" | "models" | "viva">("dashboard");
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Model Metrics from backend
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);

  useEffect(() => {
    fetch("/api/metrics")
      .then((res) => res.json())
      .then((data) => {
        if (data.svm && data.rf) {
          setMetrics(data);
        }
      })
      .catch(() => {});
  }, []);

  // Demo Profile Loaders
  const handleLoadDemo = (type: "aiml" | "analyst" | "software") => {
    if (type === "aiml") {
      setStudentName("Aarav Sharma");
      setDegree("B.E. Computer Science and Engineering");
      setExperienceYears(0.5);
      setGradYear(2025);
      setProjectsInput("ML prediction system\nImage classification demo");
      setCertificationsCount(1);
      setUserSkills(["Python", "SQL", "Pandas", "NumPy", "Machine Learning", "Git"]);
      setTargetRole("AI/ML Engineer");
      setEvidenceCounts({ Python: 3, SQL: 1, Pandas: 2, NumPy: 2, "Machine Learning": 2, Git: 1 });
      setExtractedText("Aarav Sharma - Student Demo for AI/ML Engineer track.");
    } else if (type === "analyst") {
      setStudentName("Priya Patel");
      setDegree("B.Tech Information Technology");
      setExperienceYears(1.0);
      setGradYear(2025);
      setProjectsInput("Retail Sales KPI Dashboard\nCustomer Churn Analysis");
      setCertificationsCount(2);
      setUserSkills(["Excel", "SQL", "Python", "Pandas", "Statistics", "Git"]);
      setTargetRole("Data Analyst");
      setEvidenceCounts({ Excel: 3, SQL: 3, Python: 2, Pandas: 2, Statistics: 1, Git: 1 });
      setExtractedText("Priya Patel - Aspiring Data Analyst with Excel & SQL experience.");
    } else {
      setStudentName("Rohan Verma");
      setDegree("B.E. Computer Science and Engineering");
      setExperienceYears(1.5);
      setGradYear(2024);
      setProjectsInput("E-Commerce Microservice API\nReal-Time Chat App");
      setCertificationsCount(1);
      setUserSkills(["Data Structures", "Algorithms", "OOP", "Java", "SQL", "Git"]);
      setTargetRole("Software Developer");
      setEvidenceCounts({ "Data Structures": 3, Algorithms: 3, OOP: 2, Java: 3, SQL: 2, Git: 2 });
      setExtractedText("Rohan Verma - Software Developer candidate focusing on DSA & Backend.");
    }
  };

  // Dynamic Analysis Calculation
  const analysis = useMemo(() => {
    const projectsList = projectsInput
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    return performCompleteAnalysis(
      userSkills,
      targetRole,
      experienceYears,
      projectsList,
      certificationsCount,
      degree,
      evidenceCounts
    );
  }, [
    userSkills,
    targetRole,
    experienceYears,
    projectsInput,
    certificationsCount,
    degree,
    evidenceCounts
  ]);

  // Primary Default View: The Clean, Rich Academic Dashboard (Original Frontend)
  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <Header
        onLoadDemo={handleLoadDemo}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
        onOpenVivaModal={() => setActiveTab("viva")}
        onDownloadReport={() => {
          const chk = buildInitialChecklist(analysis);
          generateSkillGapPdf(analysis, chk, {
            name: studentName,
            degree,
            gradYear,
            experienceYears,
            projectsInput,
            certificationsCount,
            userSkills,
            targetRole,
          });
        }}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Profile Input & Diagnostics Section */}
        <ProfileForm
          studentName={studentName}
          setStudentName={setStudentName}
          degree={degree}
          setDegree={setDegree}
          gradYear={gradYear}
          setGradYear={setGradYear}
          experienceYears={experienceYears}
          setExperienceYears={setExperienceYears}
          projectsInput={projectsInput}
          setProjectsInput={setProjectsInput}
          certificationsCount={certificationsCount}
          setCertificationsCount={setCertificationsCount}
          userSkills={userSkills}
          setUserSkills={setUserSkills}
          targetRole={targetRole}
          setTargetRole={setTargetRole}
          extractedText={extractedText}
          setExtractedText={setExtractedText}
          evidenceCounts={evidenceCounts}
          setEvidenceCounts={setEvidenceCounts}
        />

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 mb-6 flex overflow-x-auto gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "dashboard"
                ? "border-indigo-600 text-indigo-600 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>1. Gap Analysis & Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("roadmap")}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "roadmap"
                ? "border-indigo-600 text-indigo-600 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>2. 5-Stage Career Roadmap</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "projects"
                ? "border-indigo-600 text-indigo-600 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FolderGit2 className="h-4 w-4" />
            <span>3. Capstone Projects & Free Resources</span>
          </button>

          <button
            onClick={() => setActiveTab("models")}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "models"
                ? "border-indigo-600 text-indigo-600 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>4. ML Models Evaluation (Viva Metrics)</span>
          </button>

          <button
            onClick={() => setActiveTab("viva")}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "viva"
                ? "border-indigo-600 text-indigo-600 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>5. Academic Viva Voce Guide</span>
          </button>
        </div>

        {/* Tab 1: Dashboard & Gap Analysis */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <KpiMetrics analysis={analysis} />
            <CareerPredictionCard analysis={analysis} />
            <ReadinessAndClusterCard analysis={analysis} />
            <SkillGapView analysis={analysis} />
          </div>
        )}

        {/* Tab 2: 5-Stage Career Roadmap */}
        {activeTab === "roadmap" && (
          <RoadmapTimeline analysis={analysis} />
        )}

        {/* Tab 3: Capstone Projects & Resources */}
        {activeTab === "projects" && (
          <ProjectsAndResources analysis={analysis} />
        )}

        {/* Tab 4: ML Models Evaluation */}
        {activeTab === "models" && (
          <ModelEvaluationView metrics={metrics} />
        )}

        {/* Tab 5: Academic Viva Guide */}
        {activeTab === "viva" && (
          <VivaDocView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <strong>SkillGapAI / SKILLIQ</strong> &bull; 7th Semester Machine Learning Academic Project. Built with Python, Scikit-learn, and React.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              Inspect Python Source Files
            </button>
          </div>
        </div>
      </footer>

      {/* Source Code Modal */}
      <CodeExplorerModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
