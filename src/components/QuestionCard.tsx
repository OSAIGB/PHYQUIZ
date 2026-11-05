import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, X, Send, AlertCircle } from 'lucide-react';
import { Question } from '../types/exam';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
  onSelectAnswer: (answer: 'A' | 'B' | 'C' | 'D') => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  isLastQuestion,
}) => {
  const [poppedOption, setPoppedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);

  // Reset local pop state when question changes
  useEffect(() => {
    setPoppedOption(null);
  }, [question.id]);

  const handleOptionClick = (label: 'A' | 'B' | 'C' | 'D') => {
    setPoppedOption(label);
    onSelectAnswer(label);
  };

  // Support quick keyboard shortcuts: A, B, C, D or 1, 2, 3, 4, Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const key = e.key.toUpperCase();
      if (key === 'A' || key === '1') handleOptionClick('A');
      else if (key === 'B' || key === '2') handleOptionClick('B');
      else if (key === 'C' || key === '3') handleOptionClick('C');
      else if (key === 'D' || key === '4') handleOptionClick('D');
      else if (e.key === 'Enter') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext]);

  const hasAnswered = selectedAnswer !== null;
  const isSelectedWrong = hasAnswered && selectedAnswer !== question.correctAnswer;
  const isSelectedCorrect = hasAnswered && selectedAnswer === question.correctAnswer;

  return (
    <div className="bg-[#121214] border border-white/10 rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 shadow-2xl relative flex flex-col justify-between h-full select-none overflow-hidden">
      {/* Question Header & Metadata - Ultra compact on mobile */}
      <div className="flex items-center justify-between gap-2 pb-2 sm:pb-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-400 truncate">
          <span className="font-semibold text-white tracking-wide truncate">{question.source}</span>
          <span aria-hidden="true" className="text-zinc-700">·</span>
          <span className="truncate">{question.topic}</span>
        </div>
        <div className="text-[10px] sm:text-xs font-mono text-zinc-400 shrink-0 hidden xs:block">
          {question.formula}
        </div>
      </div>

      {/* Main Question Text - Fluid font size to fit on mobile without scrolling */}
      <div className="py-2.5 sm:py-5 flex-1 min-h-0 flex items-center">
        <h2 className="text-sm sm:text-lg md:text-xl font-normal sm:font-medium tracking-tight text-white leading-snug sm:leading-relaxed text-balance">
          {question.prompt}
        </h2>
      </div>

      {/* 4 Options Grid - Space optimized for mobile zero-scroll */}
      <div className="space-y-1.5 sm:space-y-3 py-1 sm:py-3 shrink-0">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.label;
          const isCorrect = option.label === question.correctAnswer;
          const isWrong = isSelected && !isCorrect;

          let optionStyle = 'bg-[#18181b]/80 hover:bg-[#202023] border-white/5 text-zinc-300';
          let letterStyle = 'bg-black/50 text-zinc-400 border-white/10';
          let popAnimation = '';

          if (hasAnswered) {
            if (isWrong) {
              // Wrong option POPS vividly with shake and red alert
              optionStyle = 'bg-red-950/60 border-red-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.45)] ring-1 ring-red-500';
              letterStyle = 'bg-red-600 text-white border-red-400 font-bold';
              popAnimation = 'animate-shake animate-pop';
            } else if (isCorrect) {
              // Correct option POPS with bright green/white highlight
              optionStyle = 'bg-emerald-950/60 border-emerald-400 text-white shadow-[0_0_25px_rgba(52,211,153,0.35)] ring-1 ring-emerald-400';
              letterStyle = 'bg-emerald-500 text-white border-emerald-300 font-bold';
              popAnimation = 'animate-pop';
            } else {
              optionStyle = 'bg-[#18181b]/40 border-white/5 text-zinc-600 opacity-50';
            }
          }

          return (
            <button
              key={option.label}
              onClick={() => handleOptionClick(option.label)}
              className={`w-full text-left p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 flex items-center justify-between group active:scale-[0.98] ${optionStyle} ${popAnimation}`}
            >
              <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                {/* Key Label circle */}
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl font-mono text-[11px] sm:text-xs font-semibold flex items-center justify-center border shrink-0 transition-all ${letterStyle}`}
                >
                  {option.label}
                </div>
                <span className="text-xs sm:text-base font-normal tracking-tight truncate sm:whitespace-normal">
                  {option.text}
                </span>
              </div>

              {/* Status Indicator Icon */}
              <div className="shrink-0 ml-2">
                {isWrong && (
                  <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center animate-pop shadow-md">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                {hasAnswered && isCorrect && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-pop shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Immediate Pop Feedback Message (if wrong or correct option selected) */}
      {hasAnswered && (
        <div
          className={`py-1.5 px-3 rounded-lg text-[11px] sm:text-xs font-medium flex items-center justify-between gap-2 shrink-0 animate-pop my-1 ${
            isSelectedWrong
              ? 'bg-red-500/15 border border-red-500/30 text-red-300'
              : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            {isSelectedWrong ? (
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            ) : (
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            )}
            <span className="truncate">
              {isSelectedWrong
                ? `Incorrect option! Correct answer is ${question.correctAnswer}.`
                : 'Correct answer! Excellent calculation.'}
            </span>
          </div>
          <span className="font-mono text-[10px] text-zinc-400 shrink-0 hidden xs:inline">
            Tap Next to proceed
          </span>
        </div>
      )}

      {/* Card Footer Navigation */}
      <div className="pt-2 sm:pt-4 border-t border-white/5 flex items-center justify-between gap-2 shrink-0">
        <div className="text-[10px] text-zinc-500 font-mono hidden sm:block">
          Shortcuts: <kbd className="px-1 py-0.5 rounded bg-white/5 text-zinc-300">A</kbd> <kbd className="px-1 py-0.5 rounded bg-white/5 text-zinc-300">B</kbd> <kbd className="px-1 py-0.5 rounded bg-white/5 text-zinc-300">C</kbd> <kbd className="px-1 py-0.5 rounded bg-white/5 text-zinc-300">D</kbd> or <kbd className="px-1 py-0.5 rounded bg-white/5 text-zinc-300">Enter</kbd>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onNext}
            className={`w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              hasAnswered
                ? 'bg-white text-black hover:bg-zinc-200 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
          >
            <span>{isLastQuestion ? 'Submit Exam' : hasAnswered ? 'Next Question' : 'Skip / Next'}</span>
            {isLastQuestion ? (
              <Send className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
