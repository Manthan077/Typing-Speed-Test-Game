import React, { useState, useEffect } from 'react';

interface CountdownProps {
  onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        {count > 0 ? (
          <div className="text-8xl font-bold text-neon-green animate-scale-in animate-pulse-glow">
            {count}
          </div>
        ) : (
          <div className="text-6xl font-bold text-neon-green animate-scale-in animate-heartbeat">
            Go!
          </div>
        )}
      </div>
    </div>
  );
};

export default Countdown;