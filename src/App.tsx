import React, { useState, useEffect, useCallback, useRef } from 'react';
import { EXAM_QUESTIONS } from './data/questions';
import { ExamInfraction, ExamResult } from './types/exam';
import { calculateExamResults } from './utils/analytics';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ExamHeader } from './components/ExamHeader';
import { Timer40s } from './components/Timer40s';
import { QuestionCard } from './components/QuestionCard';
import { ProgressDashboard } from './components/ProgressDashboard';
import { AppleCalculator } from './components/AppleCalculator';
import { AntiCheatGuard } from './components/AntiCheatGuard';
import { ResultsDashboard } from './components/ResultsDashboard';

export default function App() {
  const [stage, setStage] = useState<'welcome' | 'exam' | 'submitted'>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Exam answers & tracking
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D' | null>>({});
  const [timeSpentPerQuestion, setTimeSpentPerQuestion] = useState<Record<number, number>>({});
  const [timedOutQuestions, setTimedOutQuestions] = useState<number[]>([]);
  const [infractions, setInfractions] = useState<ExamInfraction[]>([]);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  // UI state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [showMobileDashboard, setShowMobileDashboard] = useState(false);
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false);

  // Timing references
  const startTimeRef = useRef<number>(0);
  const questionStartTimeRef = useRef<number>(0);

  // Global keyboard shortcut to toggle calculator ('C')
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key.toLowerCase() === 'c' && stage === 'exam') {
        setIsCalculatorOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [stage]);

  // Start Exam (no candidate ID or full name required)
  const handleStartExam = async () => {
    setAnswers({});
    setTimeSpentPerQuestion({});
    setTimedOutQuestions([]);
    setInfractions([]);
    setCurrentQuestionIndex(0);

    const now = Date.now();
    startTimeRef.current = now;
    questionStartTimeRef.current = now;

    // Request fullscreen for proctored mode
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Browser might restrict if user gesture rules apply, continues securely
    }

    setStage('exam');
  };

  // Submit and compute results
  const finalizeExam = useCallback(() => {
    const endTime = Date.now();
    // Record time spent on current question
    const q = EXAM_QUESTIONS[currentQuestionIndex];
    const durationOnCurrent = Math.round((endTime - questionStartTimeRef.current) / 1000);
    const updatedTimeSpent = {
      ...timeSpentPerQuestion,
      [q.id]: (timeSpentPerQuestion[q.id] || 0) + durationOnCurrent,
    };

    const finalResult = calculateExamResults(
      answers,
      updatedTimeSpent,
      timedOutQuestions,
      infractions,
      startTimeRef.current,
      endTime
    );

    setExamResult(finalResult);
    setStage('submitted');
    setIsCalculatorOpen(false);
    setShowMobileDashboard(false);

    // Exit fullscreen cleanly
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }, [
    currentQuestionIndex,
    timeSpentPerQuestion,
    answers,
    timedOutQuestions,
    infractions,
  ]);

  // Next Question Handler (called either by student clicking next or 40s timer expiring)
  const handleAdvanceQuestion = useCallback(
    (forcedTimeout = false) => {
      const currentQuestion = EXAM_QUESTIONS[currentQuestionIndex];
      const now = Date.now();
      const elapsedOnQuestion = Math.round((now - questionStartTimeRef.current) / 1000);

      // Record elapsed time
      setTimeSpentPerQuestion((prev) => ({
        ...prev,
        [currentQuestion.id]: (prev[currentQuestion.id] || 0) + elapsedOnQuestion,
      }));

      // If forced timeout and no answer was selected, record timeout
      if (forcedTimeout) {
        const hasAnswer = answers[currentQuestion.id];
        if (!hasAnswer) {
          setTimedOutQuestions((prev) =>
            prev.includes(currentQuestion.id) ? prev : [...prev, currentQuestion.id]
          );
        }
      }

      // Check if this was the last question
      if (currentQuestionIndex >= EXAM_QUESTIONS.length - 1) {
        // Immediate submission!
        finalizeExam();
      } else {
        // Advance to next question and reset question timer reference
        questionStartTimeRef.current = Date.now();
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    },
    [currentQuestionIndex, answers, finalizeExam]
  );

  // Handle 40s Timer Expiry
  const handleTimerExpired = useCallback(() => {
    handleAdvanceQuestion(true);
  }, [handleAdvanceQuestion]);

  // Handle Option Select
  const handleSelectAnswer = (optionLabel: 'A' | 'B' | 'C' | 'D') => {
    const q = EXAM_QUESTIONS[currentQuestionIndex];
    setAnswers((prev) => ({
      ...prev,
      [q.id]: optionLabel,
    }));
  };

  // Handle Infractions from AntiCheatGuard
  const handleInfraction = (infraction: ExamInfraction) => {
    setInfractions((prev) => [...prev, infraction]);
  };

  // Force Submit (e.g. from 3 strikes)
  const handleForceSubmit = (reason: string) => {
    const forceInfraction: ExamInfraction = {
      timestamp: Date.now(),
      type: 'fullscreen_exit',
      message: `Exam submitted forcefully: ${reason}`,
    };
    setInfractions((prev) => [...prev, forceInfraction]);
    finalizeExam();
  };

  // Retake exam
  const handleRetake = () => {
    setStage('welcome');
    setExamResult(null);
  };

  const currentQuestion = EXAM_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === EXAM_QUESTIONS.length - 1;

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-black text-white selection:bg-none overflow-hidden flex flex-col justify-between">
      {/* 1. Welcome Screen */}
      {stage === 'welcome' && <WelcomeScreen onStartExam={handleStartExam} />}

      {/* 2. Active Proctored Exam Screen (100dvh locked on mobile, no scroll) */}
      {stage === 'exam' && (
        <div className="h-[100dvh] max-h-[100dvh] flex flex-col justify-between overflow-hidden">
          {/* Proctored Anti-Cheat System (Anti-copy, Focus lock, Fullscreen monitoring) */}
          <AntiCheatGuard
            isActive={true}
            onInfraction={handleInfraction}
            onForceSubmit={handleForceSubmit}
            currentInfractionsCount={infractions.length}
            maxInfractions={3}
          />

          {/* Apple Minimalist Top Bar Header */}
          <ExamHeader
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={EXAM_QUESTIONS.length}
            sectionName={currentQuestion.sectionTitle}
            infractionsCount={infractions.length}
            isCalculatorOpen={isCalculatorOpen}
            onToggleCalculator={() => setIsCalculatorOpen((prev) => !prev)}
            onSubmitExam={() => setShowConfirmSubmitModal(true)}
            onToggleDashboard={() => setShowMobileDashboard(true)}
          />

          {/* Main Stage - Flex layout fitted to 100% viewport height with zero scrolling */}
          <main className="max-w-6xl mx-auto w-full px-2.5 sm:px-6 py-2 sm:py-5 flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-12 gap-2.5 sm:gap-6 overflow-hidden">
            {/* Left/Center Column: Question Card & Dedicated 40s Timer */}
            <div className="lg:col-span-8 flex-1 min-h-0 flex flex-col justify-between gap-2 sm:gap-3.5 overflow-hidden">
              {/* Question Pacing Bar with 40s Circular Timer */}
              <div className="bg-[#121214] border border-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-6 py-1.5 sm:py-2.5 flex items-center justify-between shadow-lg shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-xs font-mono text-zinc-400">
                    <span className="text-white font-bold text-xs sm:text-sm">
                      Question {String(currentQuestion.id).padStart(2, '0')}
                    </span>
                    <span className="text-zinc-600 mx-1">/</span>
                    <span>20</span>
                  </div>
                  <span className="text-zinc-700 hidden sm:inline">|</span>
                  <span className="text-[11px] sm:text-xs text-zinc-400 hidden xs:inline">
                    {currentQuestion.section}
                  </span>
                </div>

                {/* 40-Second Dedicated Countdown Component */}
                <Timer40s
                  questionId={currentQuestion.id}
                  initialSeconds={40}
                  onExpire={handleTimerExpired}
                  isPaused={showConfirmSubmitModal}
                />
              </div>

              {/* Main Interactive Question Card (fits exactly into the remaining height) */}
              <div className="flex-1 min-h-0">
                <QuestionCard
                  question={currentQuestion}
                  selectedAnswer={answers[currentQuestion.id] || null}
                  onSelectAnswer={handleSelectAnswer}
                  onNext={() => handleAdvanceQuestion(false)}
                  isLastQuestion={isLastQuestion}
                />
              </div>
            </div>

            {/* Right Column: Progress Dashboard (Desktop only; on mobile rendered via modal toggle) */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-4 overflow-y-auto">
              <ProgressDashboard
                currentQuestionIndex={currentQuestionIndex}
                answers={answers}
                timedOutQuestions={timedOutQuestions}
              />

              {/* Quick Guidance Box */}
              <div className="bg-[#121214] border border-white/10 rounded-2xl p-4 space-y-1.5 text-xs text-zinc-400 shrink-0">
                <div className="font-semibold text-white tracking-wide uppercase text-[11px] font-mono">
                  Directives
                </div>
                <p className="leading-relaxed">
                  • 40 seconds per question. Timer advances automatically.
                </p>
                <p className="leading-relaxed">
                  • Tap Calculator (C) for trig & physics constants.
                </p>
                <p className="leading-relaxed">
                  • Instant evaluation on select. Immediate submission on Q20.
                </p>
              </div>
            </div>
          </main>

          {/* Built-in Scientific Apple Calculator */}
          <AppleCalculator
            isOpen={isCalculatorOpen}
            onClose={() => setIsCalculatorOpen(false)}
          />

          {/* Mobile Progress Dashboard Modal */}
          {showMobileDashboard && (
            <ProgressDashboard
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              timedOutQuestions={timedOutQuestions}
              isMobileModal={true}
              onCloseMobileModal={() => setShowMobileDashboard(false)}
            />
          )}

          {/* Confirm Early Submission Modal */}
          {showConfirmSubmitModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#18181b] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-pop">
                <h3 className="text-lg font-semibold text-white tracking-tight">
                  Finish and Submit Exam?
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  You have answered {Object.values(answers).filter(Boolean).length} of 20 questions. Your score and performance recommendations will be generated immediately.
                </p>

                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => setShowConfirmSubmitModal(false)}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-medium transition-colors"
                  >
                    Return to Exam
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirmSubmitModal(false);
                      finalizeExam();
                    }}
                    className="flex-1 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-semibold tracking-wide transition-colors"
                  >
                    Confirm & Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Micro Bottom Bar */}
          <footer className="w-full bg-black/80 border-t border-white/5 px-3 sm:px-6 py-1.5 text-center text-[10px] sm:text-[11px] text-zinc-600 font-mono shrink-0">
            Proctored Session · Focus Lock Active
          </footer>
        </div>
      )}

      {/* 3. Submitted / Results Screen (Scrollable for comprehensive review) */}
      {stage === 'submitted' && examResult && (
        <div className="h-[100dvh] max-h-[100dvh] overflow-y-auto">
          <ResultsDashboard result={examResult} onRetake={handleRetake} />
        </div>
      )}
    </div>
  );
}
