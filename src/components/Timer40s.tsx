import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface Timer40sProps {
  questionId: number;
  initialSeconds?: number;
  onExpire: () => void;
  onTick?: (remaining: number) => void;
  isPaused?: boolean;
}

export const Timer40s: React.FC<Timer40sProps> = ({
  questionId,
  initialSeconds = 40,
  onExpire,
  onTick,
  isPaused = false,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);

  // Reset timer whenever questionId changes
  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [questionId, initialSeconds]);

  useEffect(() => {
    if (isPaused) return;

    if (secondsLeft <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const nextVal = prev - 1;
        if (onTick) onTick(nextVal);
        if (nextVal <= 0) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return nextVal;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, isPaused, onExpire, onTick]);

  // SVG circular progress calculation
  const totalDuration = initialSeconds;
  const progressRatio = Math.max(0, secondsLeft / totalDuration);
  const strokeDashoffset = 100 - progressRatio * 100;
  const isUrgent = secondsLeft <= 10;

  return (
    <div className="flex items-center gap-3">
      {/* Sleek Apple Circular Ring */}
      <div className="relative w-11 h-11 flex items-center justify-center">
        <svg className="w-11 h-11 -rotate-90 transform" viewBox="0 0 36 36">
          {/* Background circle track */}
          <path
            className="text-white/10"
            strokeWidth="2.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          {/* Animated active stroke */}
          <path
            className={`transition-all duration-1000 ease-linear ${
              isUrgent ? 'text-[#ff453a]' : 'text-white'
            }`}
            strokeDasharray="100, 100"
            strokeDashoffset={strokeDashoffset}
            strokeWidth="2.5"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>

        {/* Center Countdown Digit */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-mono text-xs sm:text-sm font-bold tabular-nums tracking-tight ${
              isUrgent ? 'text-[#ff453a] animate-pulse' : 'text-white'
            }`}
          >
            {secondsLeft}s
          </span>
        </div>
      </div>

      <div className="hidden sm:flex flex-col text-left">
        <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">Question Timer</span>
        <span className={`text-xs font-mono font-medium ${isUrgent ? 'text-[#ff453a]' : 'text-zinc-300'}`}>
          {isUrgent ? 'Time expiring' : `${secondsLeft}s remaining`}
        </span>
      </div>
    </div>
  );
};
