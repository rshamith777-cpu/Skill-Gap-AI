import React from "react";
import { BookOpen, HelpCircle, CheckCircle2, FileText, Sparkles, Scale } from "lucide-react";

export const VivaDocView: React.FC = () => {
  return (
    <div className="space-y-6 mb-6">
      {/* Title Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Academic Project Viva Defense & Viva Voce Guide
            </h3>
            <p className="text-xs text-slate-500">
              Department of Computer Science & Engineering &bull; 7th Semester Machine Learning Project
            </p>
          </div>
        </div>
      </div>

      {/* Top 6 Viva Questions & Examiner Answers */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-indigo-600" />
          <span>Core Viva Voce Questions & Model Answers</span>
        </h4>

        <div className="space-y-4">
          {/* Q1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h5 className="text-xs font-bold text-indigo-950 mb-1 flex items-center gap-1.5">
              <span>Q1: Why did you choose Support Vector Machine (SVM) for career role prediction rather than Naive Bayes or simple heuristic matching?</span>
            </h5>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Answer:</strong> Simple heuristics fail when candidates possess overlapping multi-domain skills (e.g. knowing both Python and SQL applies equally to Data Analyst, Data Scientist, and Software Developer). A linear SVM constructs maximum-margin separating hyperplanes in high-dimensional TF-IDF space. Because text classification with sparse orthogonal features rarely suffers from multicollinearity, SVM provides robust generalization without overfitting, yielding <strong>94.33% accuracy</strong>.
            </p>
          </div>

          {/* Q2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h5 className="text-xs font-bold text-indigo-950 mb-1 flex items-center gap-1.5">
              <span>Q2: How is the Skill Match percentage calculated mathematically? Is it arbitrary?</span>
            </h5>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Answer:</strong> No, it is not arbitrary. We calculate continuous <strong>Cosine Similarity</strong> between the student's binary skill vector <strong>B</strong> and the target role's weighted vector <strong>A</strong>:
              <span className="block my-2 font-mono bg-white p-2 rounded border border-slate-200 text-center text-slate-800 text-[11px]">
                Cosine Sim = (A &bull; B) / (||A|| &times; ||B||) &times; 100%
              </span>
              Core role skills are assigned a higher weight (1.5) compared to supporting skills (1.0). This mathematically penalizes missing core prerequisites while rewarding practical breadth.
            </p>
          </div>

          {/* Q3 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h5 className="text-xs font-bold text-indigo-950 mb-1 flex items-center gap-1.5">
              <span>Q3: Why distinguish Random Forest predicted category from the calculated readiness score?</span>
            </h5>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Answer:</strong> This is a core tenet of <em>explainable machine learning</em>. The Random Forest ensemble predicts an empirical category (Beginner, Developing, Intermediate, Job Ready) based on split thresholds learned across 120 trees. Simultaneously, the calculated score (0-100) exposes an exact point accumulation (Core skills: 40, Supporting: 15, Projects: 20, Experience: 15, Certifications: 10) so the student and academic mentor can audit exactly where points were gained or lost.
            </p>
          </div>

          {/* Q4 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h5 className="text-xs font-bold text-indigo-950 mb-1 flex items-center gap-1.5">
              <span>Q4: How does your K-Means clustering algorithm group students? What is the Silhouette Score?</span>
            </h5>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Answer:</strong> K-Means groups student profiles into $k=5$ archetypes by minimizing within-cluster inertia $\sum ||x - \mu_k||^2$. The resulting clusters represent natural student specializations: Foundation, Analytics, Full-Stack, AI/ML, and Cloud/Security. The Silhouette Score of <strong>0.1889</strong> validates that the clusters possess distinct centroids despite realistic cross-disciplinary overlaps.
            </p>
          </div>

          {/* Q5 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h5 className="text-xs font-bold text-indigo-950 mb-1 flex items-center gap-1.5">
              <span>Q5: How does the system handle privacy and data security?</span>
            </h5>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Answer:</strong> Resumes contain personally identifiable information (PII). Our system performs resume parsing (PDF/DOCX/TXT) and NLP keyword extraction strictly in local memory. No resumes or user data are transmitted to external third-party APIs or cloud LLMs.
            </p>
          </div>

          {/* Q6 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h5 className="text-xs font-bold text-indigo-950 mb-1 flex items-center gap-1.5">
              <span>Q6: How does the NLP pipeline avoid missing skills with non-standard abbreviations?</span>
            </h5>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Answer:</strong> We constructed a dedicated canonical synonym taxonomy in <code>data/skills.csv</code>. The extractor normalizes token aliases (such as <code>ML</code> &rarr; <code>Machine Learning</code>, <code>tf</code> &rarr; <code>TensorFlow</code>, <code>py torch</code> &rarr; <code>PyTorch</code>, <code>dsa</code> &rarr; <code>Data Structures</code>) using word-boundary regexes and n-gram priority matching, eliminating false negative drops.
            </p>
          </div>
        </div>
      </div>

      {/* System Architecture & Methodology */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Scale className="h-5 w-5 text-slate-700" />
          <span>System Pipeline & Mathematical Overview</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">1. Pipeline Flow:</span>
            Student Input / Resume &rarr; Local Text Extraction &rarr; Stopword Removal & Synonym Mapping &rarr; TF-IDF Vectorization &rarr; Multi-class SVM Classification &rarr; Random Forest Readiness Ensemble &rarr; K-Means Clustering &rarr; Skill Gap Categorization (🟢 🟡 🔴) &rarr; 5-Stage Career Roadmap.
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">2. Core Technologies Used:</span>
            Python 3.10, Scikit-learn (SVC, RandomForestClassifier, KMeans, TfidfVectorizer), Pandas, NumPy, NLTK, Streamlit, Express/React for dual-platform viva presentation.
          </div>
        </div>
      </div>
    </div>
  );
};
