import React from 'react';
import { Calculator, ShieldAlert, Send, LayoutGrid } from 'lucide-react';

interface ExamHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  sectionName: string;
  infractionsCount: number;
  isCalculatorOpen: boolean;
  onToggleCalculator: () => void;
  onSubmitExam: () => void;
  onToggleDashboard?: () => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  currentQuestionIndex,
  totalQuestions,
  sectionName,
  infractionsCount,
  isCalculatorOpen,
  onToggleCalculator,
  onSubmitExam,
  onToggleDashboard,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-black/90 backdrop-blur-xl border-b border-white/10 px-3 sm:px-6 py-2.5 sm:py-3.5 transition-colors shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-6">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="text-sm sm:text-base font-semibold tracking-tight text-white whitespace-nowrap">
            Apex Physics
          </span>
          <span className="hidden sm:inline-block text-zinc-600">/</span>
          <span className="hidden sm:inline-block text-xs text-zinc-400 font-mono whitespace-nowrap">
            Assessment
          </span>
        </div>

        {/* Zone 2: Question counter & Section (compact on mobile) */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-zinc-400 whitespace-nowrap">
          <span className="font-mono text-white font-semibold text-xs sm:text-sm">
            Q{String(currentQuestionIndex + 1).padStart(2, '0')}/{totalQuestions}
          </span>
          <span aria-hidden="true" className="text-zinc-700 hidden sm:inline">·</span>
          <span className="text-zinc-400 font-medium hidden md:inline truncate max-w-[180px]">
            {sectionName}
          </span>
          {infractionsCount > 0 && (
            <>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span className="text-[#ff453a] flex items-center gap-1 font-mono text-[11px] font-medium">
                <ShieldAlert className="w-3 h-3" />
                <span>{infractionsCount} flag{infractionsCount > 1 ? 's' : ''}</span>
              </span>
            </>
          )}
        </div>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {onToggleDashboard && (
            <button
              onClick={onToggleDashboard}
              className="lg:hidden p-2 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors"
              title="View Question Progress"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onToggleCalculator}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
              isCalculatorOpen
                ? 'bg-white text-black border-white shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
            }`}
            title="Toggle Scientific Calculator"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Calc</span>
          </button>

          <button
            onClick={onSubmitExam}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3 h-3 text-zinc-400" />
            <span className="hidden xs:inline">Finish</span>
          </button>
        </div>
      </div>
    </header>
  );
};
