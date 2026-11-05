import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Printer,
  RotateCcw,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ExamResult } from '../types/exam';
import { EXAM_QUESTIONS } from '../data/questions';

interface ResultsDashboardProps {
  result: ExamResult;
  onRetake: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onRetake }) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const avgTimePerQuestion = Math.round(result.totalDurationSeconds / result.totalQuestions);

  const filteredQuestions = EXAM_QUESTIONS.filter((q) => {
    const isCorrect = result.answers[q.id] === q.correctAnswer;
    if (filter === 'correct') return isCorrect;
    if (filter === 'incorrect') return !isCorrect;
    return true;
  });

  const toggleExpand = (id: number) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6 sm:space-y-10 select-none">
      {/* Top Bar for Results View */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-white/10 no-print">
        <div>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 font-semibold block">
            Assessment Completed
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            Official Performance Analysis
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#18181b] hover:bg-[#202023] text-zinc-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Print</span>
          </button>
          <button
            onClick={onRetake}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-200 text-black transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Exam</span>
          </button>
        </div>
      </div>

      {/* Hero Scorecard */}
      <div className="bg-[#121214] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Main Score & Grade */}
          <div className="md:col-span-7 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="font-semibold text-white">Projectile Motion Exam</span>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span>20 Questions</span>
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-7xl font-extralight tracking-tight font-mono text-white">
                  {result.score}
                </span>
                <span className="text-2xl sm:text-4xl font-light text-zinc-600 font-mono">
                  / {result.totalQuestions}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2.5">
                <span className="text-lg sm:text-xl font-medium tracking-tight text-white">
                  {result.grade}
                </span>
                <span className="text-xs sm:text-sm font-mono text-zinc-400">
                  ({result.percentage}%)
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 max-w-lg leading-relaxed">
              {result.percentage >= 70
                ? 'Strong grasp of projectile motion principles. Review targeted questions below for complete mastery.'
                : 'Key gaps identified in component resolution and cliff drops. Study the formula guidelines below.'}
            </p>
          </div>

          {/* Quick Metrics Bento */}
          <div className="md:col-span-5 grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className="bg-[#18181b]/70 border border-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-500 font-medium block">
                Total Time
              </span>
              <span className="text-base sm:text-lg font-mono font-medium text-white mt-0.5 block">
                {formatSeconds(result.totalDurationSeconds)}
              </span>
              <span className="text-[10px] text-zinc-500 block">
                ~{avgTimePerQuestion}s / question
              </span>
            </div>

            <div className="bg-[#18181b]/70 border border-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-500 font-medium block">
                Timed Out Qs
              </span>
              <span className="text-base sm:text-lg font-mono font-medium text-white mt-0.5 block">
                {result.timedOutQuestions.length}
              </span>
              <span className="text-[10px] text-zinc-500 block">
                40s per question
              </span>
            </div>

            <div className="bg-[#18181b]/70 border border-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-500 font-medium block">
                Proctor Status
              </span>
              <span className="text-base sm:text-lg font-medium text-white mt-0.5 block">
                {result.infractions.length === 0 ? 'Verified' : `${result.infractions.length} Flags`}
              </span>
              <span className="text-[10px] text-zinc-500 block">
                {result.infractions.length === 0 ? 'Zero departures' : 'Alerts logged'}
              </span>
            </div>

            <div className="bg-[#18181b]/70 border border-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-500 font-medium block">
                Accuracy
              </span>
              <span className="text-base sm:text-lg font-mono font-medium text-white mt-0.5 block">
                {result.percentage}%
              </span>
              <span className="text-[10px] text-zinc-500 block">
                {result.score}/{result.totalQuestions} correct
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Breakdown 3-Card Grid */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
          Exam Section Performance
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* JUPEB */}
          <div className="bg-[#121214] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                Section A · JUPEB
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {result.sectionScores.JUPEB.percentage}%
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-mono text-white">
              {result.sectionScores.JUPEB.score} <span className="text-zinc-600 text-sm">/ 10</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full rounded-full"
                style={{ width: `${result.sectionScores.JUPEB.percentage}%` }}
              />
            </div>
          </div>

          {/* UNIBEN */}
          <div className="bg-[#121214] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                Section B · UNIBEN
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {result.sectionScores.UNIBEN.percentage}%
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-mono text-white">
              {result.sectionScores.UNIBEN.score} <span className="text-zinc-600 text-sm">/ 5</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full rounded-full"
                style={{ width: `${result.sectionScores.UNIBEN.percentage}%` }}
              />
            </div>
          </div>

          {/* JAMB */}
          <div className="bg-[#121214] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                Section C · JAMB
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {result.sectionScores.JAMB.percentage}%
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-mono text-white">
              {result.sectionScores.JAMB.score} <span className="text-zinc-600 text-sm">/ 5</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full rounded-full"
                style={{ width: `${result.sectionScores.JAMB.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Targeted Recommendations Engine */}
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Personalized Recommendations for Improvement
          </h2>
          <p className="text-[11px] sm:text-xs text-zinc-400">
            Coaching tailored to your responses.
          </p>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {result.recommendations.map((rec, index) => {
            const isCritical = rec.status === 'critical';
            const isMastered = rec.status === 'mastered';

            return (
              <div
                key={index}
                className="bg-[#121214] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2 sm:space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isCritical ? (
                      <AlertCircle className="w-3.5 h-3.5 text-[#ff453a] shrink-0" />
                    ) : isMastered ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    )}
                    <h3 className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                      {rec.title}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-wider shrink-0 ${
                      isCritical
                        ? 'text-[#ff453a]'
                        : isMastered
                        ? 'text-emerald-400'
                        : 'text-zinc-400'
                    }`}
                  >
                    {isCritical ? 'Needs Attention' : isMastered ? 'Mastered' : 'Good'}
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed">
                  {rec.advice}
                </p>

                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs">
                  <div className="font-mono text-zinc-400 text-[10px] sm:text-[11px]">
                    Formula: <span className="text-white font-sans">{rec.keyFormula}</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-zinc-500 font-mono">
                    Questions: {rec.relatedQuestions.map((q) => `Q${q}`).join(', ')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Physics Trajectory Cheat Sheet Card */}
      <div className="bg-[#121214] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-zinc-400" />
          <h3 className="text-xs sm:text-sm font-semibold text-white tracking-tight">
            Essential Formula Blueprint
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-xs font-mono">
          <div className="bg-[#18181b] p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase block font-semibold">Maximum Height</span>
            <div className="text-white text-xs sm:text-sm font-medium">H = (u sin θ)² / (2g)</div>
          </div>

          <div className="bg-[#18181b] p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase block font-semibold">Time of Flight</span>
            <div className="text-white text-xs sm:text-sm font-medium">T = (2u sin θ) / g</div>
          </div>

          <div className="bg-[#18181b] p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase block font-semibold">Horizontal Range</span>
            <div className="text-white text-xs sm:text-sm font-medium">R = (u² sin 2θ) / g</div>
          </div>

          <div className="bg-[#18181b] p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase block font-semibold">Height vs Range</span>
            <div className="text-white text-xs sm:text-sm font-medium">H / R = (tan θ) / 4</div>
          </div>
        </div>
      </div>

      {/* Detailed Question Review & Solutions */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              Question-by-Question Solution Review
            </h2>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#18181b] border border-white/5 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors text-xs ${
                filter === 'all' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All (20)
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-2.5 py-1 rounded-lg transition-colors text-xs ${
                filter === 'incorrect' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Missed ({result.totalQuestions - result.score})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-2.5 py-1 rounded-lg transition-colors text-xs ${
                filter === 'correct' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Correct ({result.score})
            </button>
          </div>
        </div>

        {/* Question Cards List */}
        <div className="space-y-2 sm:space-y-3">
          {filteredQuestions.map((q) => {
            const studentChoice = result.answers[q.id];
            const isCorrect = studentChoice === q.correctAnswer;
            const isExpanded = expandedQuestion === q.id;
            const isTimedOut = result.timedOutQuestions.includes(q.id);

            return (
              <div
                key={q.id}
                className="bg-[#121214] border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden transition-all"
              >
                {/* Header Row */}
                <button
                  onClick={() => toggleExpand(q.id)}
                  className="w-full p-3.5 sm:p-5 flex items-start sm:items-center justify-between gap-3 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0">
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg shrink-0 flex items-center justify-center font-mono text-xs font-semibold ${
                        isCorrect
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-[#ff453a] border border-red-500/20'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-zinc-500">
                        <span className="font-mono text-white font-medium">Q{q.id}</span>
                        <span>·</span>
                        <span className="truncate">{q.source}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-200 truncate mt-0.5">
                        {q.prompt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right text-[11px] sm:text-xs font-mono">
                      <div className="flex items-center gap-1">
                        <span className="text-zinc-500">Pick:</span>
                        <span
                          className={`font-semibold ${
                            isCorrect ? 'text-emerald-400' : 'text-[#ff453a]'
                          }`}
                        >
                          {studentChoice || (isTimedOut ? 'Time' : '-')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-zinc-500">Ans:</span>
                        <span className="text-white font-semibold">{q.correctAnswer}</span>
                      </div>
                    </div>

                    <div className="text-zinc-500">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-white/5 space-y-3 bg-black/20">
                    <p className="text-xs sm:text-sm text-white pt-2 leading-relaxed">
                      {q.prompt}
                    </p>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt) => {
                        const isThisStudentChoice = studentChoice === opt.label;
                        const isThisCorrect = q.correctAnswer === opt.label;

                        return (
                          <div
                            key={opt.label}
                            className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                              isThisCorrect
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-white font-medium'
                                : isThisStudentChoice
                                ? 'bg-red-500/10 border-red-500/30 text-[#ff453a]'
                                : 'bg-[#18181b]/50 border-white/5 text-zinc-400'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded font-mono text-[10px] flex items-center justify-center bg-black/40 border border-white/10 font-bold">
                                {opt.label}
                              </span>
                              <span className="truncate">{opt.text}</span>
                            </div>

                            {isThisCorrect && (
                              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                                Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Solution Explanation */}
                    <div className="bg-[#18181b] border border-white/5 rounded-xl p-3 sm:p-4 space-y-1.5">
                      <div className="text-[11px] font-semibold text-white uppercase font-mono">
                        Solution & Derivation:
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        {q.explanation}
                      </p>
                      <div className="pt-1 text-[11px] font-mono text-zinc-400">
                        Formula: <span className="text-white">{q.formula}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
