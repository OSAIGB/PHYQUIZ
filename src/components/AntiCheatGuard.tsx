import React, { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, ShieldAlert, Maximize2 } from 'lucide-react';
import { ExamInfraction } from '../types/exam';

interface AntiCheatGuardProps {
  isActive: boolean;
  onInfraction: (infraction: ExamInfraction) => void;
  onForceSubmit: (reason: string) => void;
  currentInfractionsCount: number;
  maxInfractions?: number;
}

export const AntiCheatGuard: React.FC<AntiCheatGuardProps> = ({
  isActive,
  onInfraction,
  onForceSubmit,
  currentInfractionsCount,
  maxInfractions = 3,
}) => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showSecurityToast = useCallback((msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Handle Infraction Event
  const triggerInfraction = useCallback((type: 'fullscreen_exit' | 'tab_switch' | 'blur', message: string) => {
    if (!isActive) return;

    const newInfraction: ExamInfraction = {
      timestamp: Date.now(),
      type,
      message,
    };
    onInfraction(newInfraction);

    const nextCount = currentInfractionsCount + 1;
    if (nextCount >= maxInfractions) {
      onForceSubmit(`Maximum security departures (${maxInfractions}) exceeded.`);
    } else {
      setWarningMessage(message);
      setShowWarningModal(true);
    }
  }, [isActive, onInfraction, currentInfractionsCount, maxInfractions, onForceSubmit]);

  // Anti-Copy & Keyboard Protection
  useEffect(() => {
    if (!isActive) return;

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      showSecurityToast('Proctored Security: Text copying is strictly restricted.');
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      showSecurityToast('Proctored Security: Cutting text is restricted.');
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showSecurityToast('Proctored Security: Context menu is disabled.');
    };

    const handleSelectStart = (e: Event) => {
      // Don't block selection inside input fields of calculator
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Prevent Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+U, Ctrl+P, Ctrl+S, F12, DevTools
      if (
        (isCmdOrCtrl && ['c', 'v', 'a', 'u', 'p', 's', 'x'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        (isCmdOrCtrl && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        showSecurityToast('Proctored Security: System shortcut disabled during exam.');
      }
    };

    window.addEventListener('copy', handleCopy);
    window.addEventListener('cut', handleCut);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('selectstart', handleSelectStart);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('cut', handleCut);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('selectstart', handleSelectStart);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, showSecurityToast]);

  // Fullscreen & Screen Focus Monitors
  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        triggerInfraction('tab_switch', 'Tab switch or window minimized detected.');
      }
    };

    const handleWindowBlur = () => {
      // Small timeout to prevent false positives when interacting with system controls
      const timeout = setTimeout(() => {
        if (!document.hasFocus()) {
          triggerInfraction('blur', 'Lost focus from the exam window.');
        }
      }, 300);
      return () => clearTimeout(timeout);
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        triggerInfraction('fullscreen_exit', 'Exited fullscreen examination environment.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isActive, triggerInfraction]);

  const handleReturnToExam = async () => {
    setShowWarningModal(false);
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Ignore if user denies fullscreen browser permission
    }
  };

  return (
    <>
      {/* Non-intrusive Toast Notification for Copy/Restricted actions */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1c1c1e] text-zinc-100 border border-white/10 px-4 py-2.5 rounded-full text-xs font-medium shadow-2xl flex items-center gap-2 animate-bounce">
          <ShieldAlert className="w-3.5 h-3.5 text-zinc-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Strict Fullscreen Exit / Tab Departure Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-white/15 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-[#ff453a] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white tracking-tight">Security Focus Alert</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {warningMessage}
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500 uppercase">Infraction Recorded</span>
              <span className="text-[#ff453a] font-semibold">
                Strike {currentInfractionsCount} of {maxInfractions}
              </span>
            </div>

            <p className="text-[11px] text-zinc-500 text-left">
              Leaving the examination window or exiting fullscreen is prohibited. At strike {maxInfractions}, your test will be immediately submitted.
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={handleReturnToExam}
                className="flex-1 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-1.5"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Resume Secure Exam
              </button>
              <button
                onClick={() => onForceSubmit('Candidate surrendered exam session.')}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl text-xs font-medium transition-colors"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
