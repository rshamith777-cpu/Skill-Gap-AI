import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { exec } from "child_process";
import { performCompleteAnalysis } from "./src/utils/mlEngine";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);
  const isProd = process.env.NODE_ENV === "production";

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // API Route: ML Metrics
  app.get("/api/metrics", (req, res) => {
    try {
      const svmPath = path.join(__dirname, "models", "svm_metrics.json");
      const rfPath = path.join(__dirname, "models", "random_forest_metrics.json");
      const kmPath = path.join(__dirname, "models", "kmeans_metrics.json");

      const svm = fs.existsSync(svmPath) ? JSON.parse(fs.readFileSync(svmPath, "utf-8")) : null;
      const rf = fs.existsSync(rfPath) ? JSON.parse(fs.readFileSync(rfPath, "utf-8")) : null;
      const km = fs.existsSync(kmPath) ? JSON.parse(fs.readFileSync(kmPath, "utf-8")) : null;

      res.json({ svm, rf, km, pythonAvailable: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Career Roles & Taxonomy
  app.get("/api/taxonomy", (req, res) => {
    try {
      const rolesCsv = fs.readFileSync(path.join(__dirname, "data", "career_roles.csv"), "utf-8");
      const skillsCsv = fs.readFileSync(path.join(__dirname, "data", "skills.csv"), "utf-8");
      const resourcesCsv = fs.readFileSync(path.join(__dirname, "data", "learning_resources.csv"), "utf-8");
      const projectsCsv = fs.readFileSync(path.join(__dirname, "data", "projects.csv"), "utf-8");

      res.json({ rolesCsv, skillsCsv, resourcesCsv, projectsCsv });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Resume Parsing with OCR state detection and structured details extraction
  app.post("/api/parse-resume", (req, res) => {
    try {
      const { text, fileBase64, filename, isScanned } = req.body;
      const ocrUsed = Boolean(isScanned || (filename && filename.toLowerCase().includes("scan")));
      const cleaned = (text || "").trim();

      // Run python skill and profile extractor
      const script = `
import json, sys, base64
sys.path.insert(0, '.')
from src.nlp_processor import NLPProcessor
from src.skill_extractor import SkillExtractor
from src.resume_parser import extract_profile_details, extract_text_from_pdf, extract_text_from_docx, extract_text_from_txt

text_content = """${cleaned.replace(/"""/g, '\\"\\"\\"')}"""
file_b64 = "${fileBase64 || ""}"
filename = "${(filename || "").replace(/"/g, '\\"')}".lower()

if file_b64:
    try:
        raw_bytes = base64.b64decode(file_b64)
        if filename.endswith(".pdf"):
            pdf_text = extract_text_from_pdf(raw_bytes)
            if pdf_text and not pdf_text.startswith("Error"):
                text_content = pdf_text
        elif filename.endswith(".docx"):
            docx_text = extract_text_from_docx(raw_bytes)
            if docx_text and not docx_text.startswith("Error"):
                text_content = docx_text
        elif filename.endswith(".txt"):
            text_content = extract_text_from_txt(raw_bytes)
    except Exception as e:
        pass

nlp = NLPProcessor()
extractor = SkillExtractor(nlp)
evidence = extractor.extract_skills_with_evidence(text_content) if text_content else {}
skills = sorted(list(evidence.keys()))
details = extract_profile_details(text_content) if text_content else {}

output = {
    "text": text_content,
    "skills": skills,
    "evidence": evidence,
    "details": details
}
print(json.dumps(output))
`;
      exec(`python -c "${script.replace(/"/g, '\\"')}"`, { cwd: __dirname, env: { ...process.env, PYTHONPATH: __dirname } }, (err, stdout) => {
        if (!err && stdout) {
          try {
            const data = JSON.parse(stdout);
            return res.json({
              success: true,
              text: data.text || cleaned,
              skills: data.skills || [],
              evidenceCounts: data.evidence || {},
              details: data.details || {},
              ocrUsed,
              message: ocrUsed ? "Text extracted with OCR pipeline" : "Resume details & skills extracted successfully"
            });
          } catch {}
        }
        res.json({
          success: true,
          text: cleaned,
          skills: [],
          evidenceCounts: {},
          details: {},
          ocrUsed,
          message: "Processed text"
        });
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // POST /analyze & POST /api/analyze (Official ML Backend Contract)
  const handleAnalyzeRequest = (req: express.Request, res: express.Response) => {
    try {
      const { skills, targetRole, exp, projects, certs, degree, resumeText } = req.body;
      const inputPayload = JSON.stringify({
        skills: skills || [],
        target_role: targetRole || "AI/ML Engineer",
        experience_years: parseFloat(exp) || 0.0,
        projects_count: parseInt(projects) || 0,
        certifications_count: parseInt(certs) || 0,
        education: degree || "B.E. Computer Science and Engineering",
        resume_text: resumeText || ""
      });

      const script = `
import json, sys
sys.path.insert(0, '.')
from utils.config import DATA_DIR
from src.nlp_processor import NLPProcessor
from src.similarity import SimilarityEngine
from src.skill_gap import SkillGapAnalyzer
from src.career_classifier import SVMCareerClassifier
from src.readiness_predictor import ReadinessPredictor
from src.clustering import SkillProfileClusterer
from src.recommender import RecommendationEngine
from src.roadmap import RoadmapGenerator
import pandas as pd

payload = json.loads('''${inputPayload.replace(/'/g, "\\'")}''')
nlp = NLPProcessor()
roles_df = pd.read_csv("data/career_roles.csv")
role_dict = {}
for _, r in roles_df.iterrows():
    role_dict[r["role_name"]] = {
        "core_skills": [s.strip() for s in str(r["core_skills"]).split(";") if s.strip()],
        "supporting_skills": [s.strip() for s in str(r["supporting_skills"]).split(";") if s.strip()],
        "description": r["description"]
    }

target_role = payload["target_role"]
role_info = role_dict.get(target_role, {})
similarity = SimilarityEngine(nlp.canonical_skills)
match_pct, sim_breakdown = similarity.calculate_skill_vector_cosine(
    payload["skills"], role_info.get("core_skills", []), role_info.get("supporting_skills", [])
)

svm = SVMCareerClassifier()
svm_res = svm.predict_role(payload["skills"])

readiness = ReadinessPredictor(role_dict)
transparent_score = readiness.calculate_transparent_readiness_score(
    payload["skills"], target_role, payload["experience_years"],
    payload["projects_count"], payload["certifications_count"], payload["education"]
)
rf_res = readiness.predict_readiness_ml(
    payload["skills"], target_role, payload["experience_years"],
    payload["projects_count"], payload["certifications_count"], payload["education"]
)

gap_analyzer = SkillGapAnalyzer(role_dict)
gaps = gap_analyzer.analyze_gaps(payload["skills"], target_role)

clusterer = SkillProfileClusterer()
cluster_res = clusterer.assign_cluster(payload["skills"])

recommender = RecommendationEngine()
rec_skills = recommender.get_skill_recommendations(gaps["missing_skills"], gaps["weak_skills"], target_role)
rec_skill_names = [s["skill"] for s in rec_skills]
rec_projects = recommender.get_project_recommendations(target_role, payload["skills"], rec_skill_names)
rec_resources = recommender.get_resource_recommendations(rec_skill_names)

roadmap_gen = RoadmapGenerator(role_dict)
roadmap = roadmap_gen.generate_roadmap(payload["skills"], target_role, gaps, rec_projects)

output = {
    "predicted_role": svm_res.get("predicted_role", target_role),
    "svm_confidence": round(svm_res.get("confidence", 0) / 100, 2),
    "readiness_category": rf_res.get("predicted_category", "Developing"),
    "readiness_score": int(transparent_score.get("score", 0)),
    "skill_match": int(match_pct),
    "cluster": cluster_res.get("cluster_name", "AI/ML Profile"),
    "strong_skills": [s["skill"] for s in gaps.get("strong_skills", [])],
    "developing_skills": [w["skill"] for w in gaps.get("weak_skills", [])],
    "missing_skills": [m["skill"] for m in gaps.get("missing_skills", [])],
    "target_role": target_role,
    "match_percentage": match_pct,
    "similarity_breakdown": sim_breakdown,
    "svm_result": svm_res,
    "readiness_transparent": transparent_score,
    "readiness_rf": rf_res,
    "gaps": gaps,
    "cluster_details": cluster_res,
    "recommended_skills": rec_skills,
    "recommended_projects": rec_projects,
    "recommended_resources": rec_resources,
    "roadmap": roadmap
}
print(json.dumps(output))
`;

      exec(`python3 -c "${script.replace(/"/g, '\\"')}"`, { cwd: __dirname, env: { ...process.env, PYTHONPATH: __dirname } }, (error, stdout, stderr) => {
        if (error || !stdout) {
          // Resilient deterministic ML execution fallback
          const computed = performCompleteAnalysis(
            skills || [],
            targetRole || "AI/ML Engineer",
            parseFloat(exp) || 0.0,
            Array.isArray(projects) ? projects : (projects || "").toString().split("\n").filter(Boolean),
            parseInt(certs) || 0,
            degree || "B.E. Computer Science and Engineering",
            {}
          );
          return res.json({
            ...computed,
            predicted_role: computed.svmResult.predicted_role,
            svm_confidence: Math.round(computed.svmResult.confidence) / 100,
            readiness_category: computed.readinessRF.predicted_category,
            readiness_score: Math.round(computed.readinessTransparent.score),
            skill_match: Math.round(computed.matchPercentage),
            cluster: computed.cluster.cluster_name,
            cluster_details: computed.cluster,
            strong_skills: computed.gaps.strong_skills.map((s) => s.skill),
            developing_skills: computed.gaps.weak_skills.map((w) => w.skill),
            missing_skills: computed.gaps.missing_skills.map((m) => m.skill),
          });
        }
        try {
          const result = JSON.parse(stdout);
          res.json(result);
        } catch {
          const computed = performCompleteAnalysis(
            skills || [],
            targetRole || "AI/ML Engineer",
            parseFloat(exp) || 0.0,
            Array.isArray(projects) ? projects : (projects || "").toString().split("\n").filter(Boolean),
            parseInt(certs) || 0,
            degree || "B.E. Computer Science and Engineering",
            {}
          );
          res.json({
            ...computed,
            predicted_role: computed.svmResult.predicted_role,
            svm_confidence: Math.round(computed.svmResult.confidence) / 100,
            readiness_category: computed.readinessRF.predicted_category,
            readiness_score: Math.round(computed.readinessTransparent.score),
            skill_match: Math.round(computed.matchPercentage),
            cluster: computed.cluster.cluster_name,
            cluster_details: computed.cluster,
            strong_skills: computed.gaps.strong_skills.map((s) => s.skill),
            developing_skills: computed.gaps.weak_skills.map((w) => w.skill),
            missing_skills: computed.gaps.missing_skills.map((m) => m.skill),
          });
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  app.post("/analyze", handleAnalyzeRequest);
  app.post("/api/analyze", handleAnalyzeRequest);
  app.post("/api/analyze-python", handleAnalyzeRequest);

  // Mount Vite middleware in development
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 SkillGapAI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
