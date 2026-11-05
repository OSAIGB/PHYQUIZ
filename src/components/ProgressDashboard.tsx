import React from 'react';
import { X } from 'lucide-react';
import { EXAM_QUESTIONS } from '../data/questions';

interface ProgressDashboardProps {
  currentQuestionIndex: number;
  answers: Record<number, 'A' | 'B' | 'C' | 'D' | null>;
  timedOutQuestions: number[];
  isMobileModal?: boolean;
  onCloseMobileModal?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  currentQuestionIndex,
  answers,
  timedOutQuestions,
  isMobileModal = false,
  onCloseMobileModal,
}) => {
  const answeredCount = Object.values(answers).filter((a) => a !== null && a !== undefined).length;
  const totalCount = EXAM_QUESTIONS.length;
  const progressPercentage = Math.round((answeredCount / totalCount) * 100);

  // Group questions by section
  const sections = [
    { name: 'Section A · JUPEB', range: [0, 9] },
    { name: 'Section B · UNIBEN', range: [10, 14] },
    { name: 'Section C · JAMB', range: [15, 19] },
  ];

  const content = (
    <div className="bg-[#121214] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 sm:space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-500 font-semibold block">
            Progress Tracking
          </span>
          <span className="text-xs sm:text-sm font-medium text-white">
            {answeredCount} of {totalCount} answered ({progressPercentage}%)
          </span>
        </div>
        {isMobileModal && onCloseMobileModal ? (
          <button
            onClick={onCloseMobileModal}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="text-right hidden sm:block">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold block">
              Pacing
            </span>
            <span className="text-xs font-mono text-zinc-300">
              40s / question
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-white h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Sectioned Question Grid */}
      <div className="space-y-3 sm:space-y-4">
        {sections.map((sec) => (
          <div key={sec.name} className="space-y-1.5 sm:space-y-2">
            <div className="text-[10px] sm:text-[11px] font-medium text-zinc-400">
              {sec.name}
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
              {EXAM_QUESTIONS.slice(sec.range[0], sec.range[1] + 1).map((q, idx) => {
                const globalIndex = sec.range[0] + idx;
                const isCurrent = globalIndex === currentQuestionIndex;
                const answer = answers[q.id];
                const isAnswered = answer !== null && answer !== undefined;
                const isTimedOut = timedOutQuestions.includes(q.id);

                return (
                  <div
                    key={q.id}
                    className={`h-8 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center font-mono text-[11px] sm:text-xs transition-all relative ${
                      isCurrent
                        ? 'border-2 border-white text-white font-bold bg-white/15 shadow-sm ring-1 ring-white/30'
                        : isAnswered
                        ? 'bg-white text-black font-semibold border border-white'
                        : isTimedOut
                        ? 'bg-red-500/10 border border-red-500/30 text-[#ff453a]'
                        : 'bg-[#18181b] border border-white/5 text-zinc-500'
                    }`}
                  >
                    <span>{String(q.id).padStart(2, '0')}</span>
                    {isAnswered && !isCurrent && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-zinc-800 text-[8px] sm:text-[9px] text-white rounded-full flex items-center justify-center border border-zinc-700 font-bold">
                        {answer}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-3 text-[10px] sm:text-[11px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded bg-white border border-white"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded border-2 border-white bg-white/20"></div>
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded bg-red-500/20 border border-red-500/40"></div>
          <span>Timed Out</span>
        </div>
      </div>
    </div>
  );

  if (isMobileModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-150">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
