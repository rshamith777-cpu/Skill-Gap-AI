import React, { useState } from "react";
import { ArrowRight, Cpu, Activity, Sparkles, Terminal, ChevronRight } from "lucide-react";
import { HlsVideoBackground } from "./HlsVideoBackground";
import { ThreeSkillVector } from "./ThreeSkillVector";
import { GlassNavbar } from "./GlassNavbar";
import { MlEnginePanel } from "./MlEnginePanel";

interface HeroViewProps {
  onNavigateAnalyze: () => void;
}

export const HeroView: React.FC<HeroViewProps> = ({ onNavigateAnalyze }) => {
  const [isMlPanelOpen, setIsMlPanelOpen] = useState(false);

  return (
    <div className="relative w-full min-h-screen bg-slate-950 text-white overflow-hidden flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Cinematic HLS Video & Particle Overlay Background */}
      <HlsVideoBackground />

      {/* 2. Glassmorphic Navigation */}
      <GlassNavbar
        onOpenMlPanel={() => setIsMlPanelOpen(true)}
        onNavigateAnalyze={onNavigateAnalyze}
        currentRoute="/"
      />

      {/* 3. Main Hero Viewport Area */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 sm:gap-12 min-h-[calc(100vh-60px)]">
        {/* Left Side: Bottom-Left Anchored Typography & Action */}
        <div className="w-full lg:max-w-xl xl:max-w-2xl text-left lg:mb-4 lg:ml-2">
          {/* Technical Eyebrow */}
          <div className="inline-flex flex-col gap-1.5 mb-5 sm:mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase text-cyan-400">
                MACHINE LEARNING CAREER INTELLIGENCE
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-slate-400 flex items-center gap-2">
              <span>SVM</span>
              <span className="text-slate-600">&bull;</span>
              <span>RANDOM FOREST</span>
              <span className="text-slate-600">&bull;</span>
              <span>K-MEANS</span>
            </div>
          </div>

          {/* Large Cinematic Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-heading font-black tracking-tight leading-[1.04] text-white uppercase mb-5">
            KNOW YOUR<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400 drop-shadow-[0_0_35px_rgba(34,211,238,0.45)]">
              SKILL GAP.
            </span><br />
            BUILD YOUR<br />
            FUTURE.
          </h1>

          {/* Concise Description */}
          <p className="text-sm sm:text-base font-sans text-slate-300 leading-relaxed max-w-lg mb-8 font-normal">
            Understand where you are, what you're missing, and what you should learn next with explainable Machine Learning.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            {/* Primary Action Button */}
            <button
              onClick={onNavigateAnalyze}
              className="group relative inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-4 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider uppercase text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300 hover:from-cyan-300 hover:to-teal-200 transition-all shadow-[0_0_25px_rgba(34,211,238,0.35)] hover:shadow-[0_0_35px_rgba(34,211,238,0.6)] cursor-pointer active:scale-98"
            >
              <span>ANALYZE MY RESUME</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary Action: ML Engine Reveal */}
            <button
              onClick={() => setIsMlPanelOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs font-mono font-semibold tracking-wider uppercase text-slate-300 hover:text-white backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
            >
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span>SEE HOW THE ML ENGINE WORKS</span>
            </button>
          </div>
        </div>

        {/* Right Side: 3D ML Skill Vector & Technical Status Panel */}
        <div className="w-full lg:w-[460px] xl:w-[520px] flex flex-col items-center relative mt-6 lg:mt-0">
          {/* 3D Visualization */}
          <div className="w-full relative">
            <ThreeSkillVector />
          </div>

          {/* Technical ML Status & Demo Preview Panel */}
          <div className="w-full backdrop-blur-xl bg-slate-950/70 border border-white/10 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="text-xs font-mono font-bold text-white tracking-wider">
                  ML ENGINE
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                READY
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400 pb-2.5 border-b border-white/5">
              <div>
                <span className="text-white block font-bold">SVM</span>
                <span>ROLE CLASSIFY</span>
              </div>
              <div>
                <span className="text-white block font-bold">RANDOM FOREST</span>
                <span>READINESS</span>
              </div>
              <div>
                <span className="text-white block font-bold">K-MEANS</span>
                <span>CLUSTERING</span>
              </div>
            </div>

            {/* Clearly labeled Demo Profile preview */}
            <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  DEMO PROFILE
                </span>
                <span>MATCH: 78%</span>
              </span>
              <span className="text-cyan-300 font-bold">
                AI / ML ENGINEER
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Bottom System Technical Status Bar */}
      <footer className="relative z-10 w-full border-t border-white/10 backdrop-blur-md bg-slate-950/70 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs font-mono text-slate-400">
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-slate-200 font-bold">LOCAL ML PIPELINE</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-medium">NLP READY</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-medium">SVM READY</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-medium">RF READY</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-medium">K-MEANS READY</span>
          </div>

          <div className="sm:hidden text-center text-slate-300">
            NLP &bull; SVM &bull; RF &bull; K-MEANS PIPELINE
          </div>

          <div className="text-slate-400 text-center sm:text-right">
            RESUME &rarr; FEATURE ENGINEERING &rarr; MACHINE LEARNING
          </div>
        </div>
      </footer>

      {/* 5. Interactive ML Engine Slide-Out Panel */}
      <MlEnginePanel
        isOpen={isMlPanelOpen}
        onClose={() => setIsMlPanelOpen(false)}
        onNavigateAnalyze={onNavigateAnalyze}
      />
    </div>
  );
};
