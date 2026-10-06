import React, { useState } from "react";
import { X, Copy, Check, Download, FileCode, Database, Terminal } from "lucide-react";

interface CodeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FILES_LIST = [
  { name: "app.py", category: "Streamlit UI", path: "app.py", desc: "Interactive Streamlit web app with 5 tabs and viva metrics" },
  { name: "train_svm.py", category: "Training", path: "training/train_svm.py", desc: "Support Vector Machine training pipeline (Linear kernel, calibrated)" },
  { name: "train_random_forest.py", category: "Training", path: "training/train_random_forest.py", desc: "Random Forest 120-tree readiness classifier" },
  { name: "train_kmeans.py", category: "Training", path: "training/train_kmeans.py", desc: "K-Means clustering (5 archetypes, Silhouette score)" },
  { name: "similarity.py", category: "ML Logic", path: "src/similarity.py", desc: "Weighted Cosine Similarity & TF-IDF text matching" },
  { name: "skill_gap.py", category: "ML Logic", path: "src/skill_gap.py", desc: "Strong, Weak, Missing gap analysis & priority assignment" },
  { name: "career_roles.csv", category: "Data", path: "data/career_roles.csv", desc: "Role skill taxonomies & industry descriptions" },
  { name: "career_training.csv", category: "Data", path: "data/career_training.csv", desc: "1,500 labeled student profiles for training" },
  { name: "requirements.txt", category: "Config", path: "requirements.txt", desc: "All open-source Python dependencies" },
  { name: "README.md", category: "Documentation", path: "README.md", desc: "Academic project documentation and setup instructions" }
];

export const CodeExplorerModal: React.FC<CodeExplorerModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(FILES_LIST[0]);
  const [copied, setCopied] = useState(false);
  const [fileContent, setFileContent] = useState<string>("// Loading file...");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      loadFile(selectedFile.path);
    }
  }, [isOpen, selectedFile]);

  const loadFile = async (filePath: string) => {
    setLoading(true);
    try {
      // In web app, we can fetch from root or fallback
      const res = await fetch(`/${filePath}`);
      if (res.ok) {
        const text = await res.text();
        setFileContent(text);
      } else {
        setFileContent(`// Viewing file: ${filePath}\n// File is saved locally in project repository under root directory.`);
      }
    } catch {
      setFileContent(`// Viewing file: ${filePath}\n// Saved locally.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = selectedFile.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Academic Project Source Code & Dataset Explorer
              </h3>
              <p className="text-xs text-slate-500">
                View, copy, or download any Python training script, dataset, or Streamlit app for project submission.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content body: 2 columns */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* File sidebar (4 cols) */}
          <div className="md:col-span-4 border-r border-slate-200 p-3 space-y-1 overflow-y-auto bg-slate-50/50">
            <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1">
              Project Files ({FILES_LIST.length})
            </div>
            {FILES_LIST.map((f) => {
              const isSelected = f.path === selectedFile.path;
              return (
                <button
                  key={f.path}
                  onClick={() => setSelectedFile(f)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition cursor-pointer flex flex-col ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-xs font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs">{f.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-sans ${
                      isSelected ? "bg-indigo-700 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      {f.category}
                    </span>
                  </div>
                  <span className={`text-[11px] mt-0.5 line-clamp-1 ${
                    isSelected ? "text-indigo-100 font-normal" : "text-slate-400"
                  }`}>
                    {f.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Code Viewer (8 cols) */}
          <div className="md:col-span-8 flex flex-col bg-slate-900 text-slate-200 overflow-hidden">
            {/* Action Bar */}
            <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-xs">
              <span className="font-mono text-indigo-300 font-semibold">
                {selectedFile.path}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download File
                </button>
              </div>
            </div>

            {/* Code content */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed">
              <pre className="whitespace-pre">{fileContent}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-slate-400" />
            <span>To run locally: <code>streamlit run app.py</code></span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-medium hover:bg-slate-300 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
