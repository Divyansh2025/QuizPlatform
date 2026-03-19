import { useEffect, useState } from 'react';

export default function Timer({
  duration,
  onTimeUp,
  isPaused,
}: {
  duration: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, timeLeft <= 0]); // eslint-disable-line

  const percentage = (timeLeft / duration) * 100;
  const isLow = timeLeft <= 5;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18" cy="18" r="15.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-800"
          />
          <circle
            cx="18" cy="18" r="15.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${percentage} 100`}
            strokeLinecap="round"
            className={`transition-all duration-1000 ${isLow ? 'text-red-500' : 'text-violet-500'}`}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${isLow ? 'text-red-400 animate-pulse' : 'text-white'}`}>
          {timeLeft}
        </span>
      </div>
    </div>
  );
}
