import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, RotateCcw, Home, Target, Clock, AlertCircle } from 'lucide-react';
import Footer from '../components/Footer';

interface TestResults {
  wpm: number;
  accuracy: number;
  mistakes: number;
  correctChars: number;
  totalChars: number;
  timeElapsed: number;
  paragraph: string;
}

const ResultsScreen: React.FC = () => {
  const [results, setResults] = useState<TestResults | null>(null);
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedResults = localStorage.getItem('testResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleButtonClick = (buttonType: string, action: () => void) => {
    setClickedButton(buttonType);
    setTimeout(() => {
      setClickedButton(null);
      action();
    }, 200);
  };

  const handleTryAgain = () => {
    handleButtonClick('try-again', () => {
      navigate('/select-paragraph');
    });
  };

  const handleBackToHome = () => {
    handleButtonClick('back-home', () => {
      navigate('/');
    });
  };

  const getPerformanceLevel = (wpm: number, accuracy: number) => {
    if (wpm >= 60 && accuracy >= 95) return { level: 'Excellent', color: 'text-neon-green', icon: '🏆' };
    if (wpm >= 40 && accuracy >= 90) return { level: 'Great', color: 'text-blue-400', icon: '🎯' };
    if (wpm >= 25 && accuracy >= 85) return { level: 'Good', color: 'text-yellow-400', icon: '👍' };
    if (wpm >= 15 && accuracy >= 75) return { level: 'Fair', color: 'text-orange-400', icon: '📈' };
    return { level: 'Keep Practicing', color: 'text-red-400', icon: '💪' };
  };

  if (!results) {
    return <div>Loading...</div>;
  }

  const performance = getPerformanceLevel(results.wpm, results.accuracy);
  const userName = localStorage.getItem('userName') || 'Anonymous';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 animate-gradient-xy flex flex-col overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-20 h-20 bg-neon-green/10 rounded-full animate-float"></div>
        <div className="absolute bottom-1/4 left-10 w-16 h-16 bg-blue-500/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-12 h-12 bg-purple-500/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-neon-green/20 rounded-full animate-bounce-gentle" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          {/* Header */}
          <div className="mb-8">
            <Trophy className="w-16 h-16 text-neon-green mx-auto mb-4 animate-bounce-gentle" />
            <h1 className="text-4xl font-bold text-white mb-2 animate-slide-up">
              Test Complete!
            </h1>
            <p className="text-xl text-gray-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              Great job, <span className="text-neon-green font-semibold animate-pulse">{userName}</span>!
            </p>
          </div>

          {/* Performance Badge */}
          <div className="mb-8 animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-6xl mb-2 animate-bounce-gentle">{performance.icon}</div>
            <div className={`text-2xl font-bold ${performance.color} mb-2 animate-heartbeat`}>
              {performance.level}
            </div>
            <div className="text-gray-400 animate-fade-in">on "{results.paragraph}"</div>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 animate-slide-right hover:animate-hover-lift transition-all duration-300" style={{ animationDelay: '0.9s' }}>
              <div className="text-4xl font-bold text-neon-green mb-2 animate-pulse-glow">
                {results.wpm}
              </div>
              <div className="text-gray-400 mb-1">Words Per Minute</div>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1 animate-rotate-slow" />
                {Math.round(results.timeElapsed)}s
              </div>
            </div>

            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 animate-slide-up hover:animate-hover-lift transition-all duration-300" style={{ animationDelay: '1.2s' }}>
              <div className="text-4xl font-bold text-blue-400 mb-2 animate-heartbeat">
                {results.accuracy}%
              </div>
              <div className="text-gray-400 mb-1">Accuracy</div>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Target className="w-4 h-4 mr-1 animate-bounce-gentle" />
                {results.correctChars}/{results.totalChars}
              </div>
            </div>

            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 animate-slide-left hover:animate-hover-lift transition-all duration-300" style={{ animationDelay: '1.5s' }}>
              <div className={`text-4xl font-bold text-red-400 mb-2 ${results.mistakes > 0 ? 'animate-wiggle' : ''}`}>
                {results.mistakes}
              </div>
              <div className="text-gray-400 mb-1">Mistakes</div>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                Errors made
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-neon-green/10 to-blue-500/10 backdrop-blur-sm rounded-lg p-6 border border-neon-green/30 mb-8 animate-fade-in hover:animate-hover-lift transition-all duration-300" style={{ animationDelay: '1.8s' }}>
            <h3 className="text-lg font-semibold text-white mb-3 animate-bounce-gentle">💡 Pro Tips</h3>
            <div className="text-sm text-gray-300 space-y-1">
              {results.wpm < 30 && <p className="animate-slide-right">• Focus on accuracy first, speed will follow naturally</p>}
              {results.accuracy < 90 && <p className="animate-slide-left">• Take your time to avoid mistakes - they slow you down more than typing slowly</p>}
              {results.mistakes > 10 && <p className="animate-slide-up">• Practice proper finger positioning for better accuracy</p>}
              <p className="animate-fade-in">• Regular practice is key to improvement</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '2.1s' }}>
            <button
              onClick={handleTryAgain}
              className={`px-8 py-4 bg-neon-green text-black font-semibold rounded-lg hover:bg-neon-green/90 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/40 flex items-center justify-center hover:animate-hover-lift ${
                clickedButton === 'try-again' ? 'animate-click-bounce' : ''
              }`}
            >
              <RotateCcw className="w-5 h-5 mr-2 animate-rotate-slow" />
              Try Again
            </button>
            <button
              onClick={handleBackToHome}
              className={`px-8 py-4 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center hover:animate-hover-lift ${
                clickedButton === 'back-home' ? 'animate-click-bounce' : ''
              }`}
            >
              <Home className="w-5 h-5 mr-2 animate-bounce-gentle" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResultsScreen;