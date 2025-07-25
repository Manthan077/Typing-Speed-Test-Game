import React, { useEffect, useState } from 'react';
import { formatTime } from '../utils/typing';

interface TimerProps {
  timeLimit: number;
  isActive: boolean;
  onTimeUp: () => void;
  startTime: number | null;
}

const Timer: React.FC<TimerProps> = ({ timeLimit, isActive, onTimeUp, startTime }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    if (!isActive || !startTime) return;

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, timeLimit - elapsed);
      
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        onTimeUp();
      }
    };

    // Update immediately
    updateTimer();
    
    // Then update every second
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [isActive, startTime, timeLimit, onTimeUp]);

  const percentage = (timeLeft / timeLimit) * 100;
  const isLowTime = timeLeft <= 10;

  return (
    <div className="text-center mb-6">
      <div className={`text-3xl font-bold mb-3 ${isLowTime ? 'text-red-400 animate-pulse' : 'text-neon-green'}`}>
        {formatTime(timeLeft)}
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${
            isLowTime ? 'bg-red-500' : 'bg-neon-green'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;