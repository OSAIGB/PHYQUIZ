import React from 'react';
import { ShieldCheck, Clock, Calculator, Lock, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStartExam: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartExam }) => {
  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-black text-white flex flex-col justify-between p-4 sm:p-10 relative overflow-hidden select-none">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-zinc-800/20 blur-[130px] pointer-events-none rounded-full" />

      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-3 sm:pb-6 border-b border-white/10 relative z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-white">
            Apex Physics
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-xs text-zinc-400 font-mono">Examination Portal</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Proctor Active</span>
        </div>
      </div>

      {/* Main Content - Scaled to fit on all viewports without scrolling */}
      <main className="max-w-3xl mx-auto w-full my-auto py-2 sm:py-6 space-y-4 sm:space-y-6 relative z-10 flex-1 flex flex-col justify-center">
        {/* Title */}
        <div className="space-y-1.5 sm:space-y-3 text-center sm:text-left">
          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-zinc-500">
            JUPEB · UNIBEN POST-UTME · JAMB PHYSICS
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-white leading-tight">
            Projectile Motion Examination
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed max-w-2xl text-balance">
            20 multiple-choice questions on trajectory geometry, velocity components, flight times, and energy conservation.
          </p>
        </div>

        {/* 4 Protocol Directives Bento */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
          <div className="bg-[#121214] border border-white/10 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-1 sm:space-y-1.5">
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="text-xs sm:text-xs font-semibold uppercase tracking-wider truncate">
                40s Per Question
              </span>
            </div>
            <p className="text-xs sm:text-xs text-zinc-400 leading-normal sm:leading-relaxed">
              Auto-advances when timer lapses.
            </p>
          </div>

          <div className="bg-[#121214] border border-white/10 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-1 sm:space-y-1.5">
            <div className="flex items-center gap-2 text-white">
              <Lock className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="text-xs sm:text-xs font-semibold uppercase tracking-wider truncate">
                Anti-Copy Guard
              </span>
            </div>
            <p className="text-xs sm:text-xs text-zinc-400 leading-normal sm:leading-relaxed">
              Text selection & copying disabled.
            </p>
          </div>

          <div className="bg-[#121214] border border-white/10 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-1 sm:space-y-1.5">
            <div className="flex items-center gap-2 text-white">
              <Calculator className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="text-xs sm:text-xs font-semibold uppercase tracking-wider truncate">
                Calculator (C)
              </span>
            </div>
            <p className="text-xs sm:text-xs text-zinc-400 leading-normal sm:leading-relaxed">
              Trig & physics constants included.
            </p>
          </div>

          <div className="bg-[#121214] border border-white/10 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-1 sm:space-y-1.5">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="text-xs sm:text-xs font-semibold uppercase tracking-wider truncate">
                Instant Feedback
              </span>
            </div>
            <p className="text-xs sm:text-xs text-zinc-400 leading-normal sm:leading-relaxed">
              Immediate score & recommendations.
            </p>
          </div>
        </div>

        {/* Action Button - No name or candidate id inputs */}
        <div className="bg-[#121214] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="text-[11px] sm:text-xs text-zinc-400 text-center sm:text-left">
            Ready to test your knowledge? Question 01 timer begins immediately.
          </div>

          <button
            onClick={onStartExam}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black hover:bg-zinc-200 font-semibold text-xs tracking-wider uppercase rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-xl shrink-0 active:scale-95"
          >
            <span>Begin Exam</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full pt-3 sm:pt-6 border-t border-white/10 text-center sm:text-left text-[10px] sm:text-xs text-zinc-600 flex flex-col sm:flex-row items-center justify-between gap-1 shrink-0 relative z-10">
        <div>Apex Academic Assessment System</div>
        <div className="font-mono text-[10px]">Strict Integrity Protocol</div>
      </footer>
    </div>
  );
};
