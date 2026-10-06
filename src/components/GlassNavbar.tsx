import React from "react";
import { ArrowRight, Cpu } from "lucide-react";

interface GlassNavbarProps {
  onOpenMlPanel: () => void;
  onNavigateAnalyze: () => void;
  currentRoute?: string;
}

export const GlassNavbar: React.FC<GlassNavbarProps> = ({
  onOpenMlPanel,
  onNavigateAnalyze,
  currentRoute = "/",
}) => {
  return (
    <header className="fixed top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 z-40 max-w-7xl mx-auto">
      <nav className="backdrop-blur-xl bg-slate-950/65 border border-white/10 rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Brand Left */}
        <button
          onClick={() => {
            if (currentRoute !== "/") {
              window.location.href = "/";
            }
          }}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1px] shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Cpu className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="text-base font-extrabold tracking-wider text-white flex items-center gap-1.5 font-heading">
              SKILLGAP<span className="text-cyan-400">AI</span>
            </div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
              KNOW YOUR GAP. BUILD YOUR FUTURE.
            </div>
          </div>
        </button>

        {/* Minimal Navigation Right */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onOpenMlPanel}
            className="text-xs font-mono font-medium text-slate-300 hover:text-cyan-400 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            How ML Works
          </button>

          <button
            onClick={onNavigateAnalyze}
            className="group relative inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 transition-all shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] cursor-pointer active:scale-95"
          >
            <span>Analyze My Resume</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </nav>
    </header>
  );
};
