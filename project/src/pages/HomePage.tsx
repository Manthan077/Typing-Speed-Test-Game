import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Keyboard, Zap, Trophy, Users, Target } from 'lucide-react';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const [name, setName] = useState('');
  const [showError, setShowError] = useState(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleButtonClick = (buttonType: string, action: () => void) => {
    setClickedButton(buttonType);
    setTimeout(() => {
      setClickedButton(null);
      action();
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setShowError(true);
      return;
    }
    handleButtonClick('journey', () => {
      localStorage.setItem('userName', name.trim());
      navigate('/select-paragraph');
    });
  };

  const handleTraining = () => {
    if (!name.trim()) {
      setShowError(true);
      return;
    }
    handleButtonClick('training', () => {
      localStorage.setItem('userName', name.trim());
      
      const trainingSettings = {
        timeLimit: 60,
        paragraph: {
          id: 'training-classic',
          difficulty: 'training',
          title: 'Classic Training',
          text: 'The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. It has been used for typing practice and font testing for many years. The sentence is short but comprehensive, making it perfect for improving typing skills and testing keyboard layouts.'
        },
        userName: name.trim()
      };
      localStorage.setItem('testSettings', JSON.stringify(trainingSettings));
      navigate('/typing-test');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 animate-gradient-xy flex flex-col overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-neon-green/10 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-blue-500/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-purple-500/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-neon-green/20 rounded-full animate-bounce-gentle" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          {/* Logo and Title */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <Keyboard className="w-16 h-16 text-neon-green mr-4 animate-bounce-gentle" />
              <h1 className="text-6xl font-bold text-white animate-slide-right">
                Type<span className="text-neon-green animate-pulse">Forge</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-8 animate-slide-left" style={{ animationDelay: '0.3s' }}>
              Master your typing skills with advanced speed tests
            </p>

            {/* Name Input Form - Moved to top */}
            <form onSubmit={handleSubmit} className="space-y-6 mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setShowError(false);
                  }}
                  placeholder="Enter your name to begin"
                  className={`w-full max-w-md mx-auto px-6 py-4 bg-gray-800 border rounded-lg text-white text-lg text-center focus:outline-none focus:ring-2 transition-all duration-300 hover:animate-hover-lift ${
                    showError 
                      ? 'border-red-500 focus:ring-red-500 animate-wiggle' 
                      : 'border-gray-600 focus:ring-neon-green focus:border-neon-green hover:border-neon-green/50'
                  }`}
                />
                {showError && (
                  <p className="text-red-500 text-sm mt-2 animate-slide-up">
                    Please enter your name to continue
                  </p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="submit"
                  className={`px-8 py-4 bg-neon-green text-black font-semibold rounded-lg hover:bg-neon-green/90 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/40 focus:outline-none focus:ring-2 focus:ring-neon-green ${
                    clickedButton === 'journey' ? 'animate-click-bounce' : ''
                  }`}
                >
                  Start Your Journey
                </button>
                <button
                  type="button"
                  onClick={handleTraining}
                  className={`px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center ${
                    clickedButton === 'training' ? 'animate-click-bounce' : ''
                  }`}
                >
                  <Target className="w-5 h-5 mr-2 animate-rotate-slow" />
                  Quick Training
                </button>
              </div>
            </form>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-neon-green transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/20 animate-slide-right hover:animate-hover-lift cursor-pointer" style={{ animationDelay: '0.9s' }}>
              <Zap className="w-12 h-12 text-neon-green mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold text-white mb-2">Speed Training</h3>
              <p className="text-gray-400 text-sm">Advanced typing mechanics with real-time feedback</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-neon-green transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/20 animate-slide-up hover:animate-hover-lift cursor-pointer" style={{ animationDelay: '1.2s' }}>
              <Trophy className="w-12 h-12 text-neon-green mx-auto mb-4 animate-bounce-gentle" />
              <h3 className="text-lg font-semibold text-white mb-2">Track Progress</h3>
              <p className="text-gray-400 text-sm">Detailed statistics and performance analytics</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 animate-slide-left" style={{ animationDelay: '1.5s' }}>
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Multiplayer Duels</h3>
              <p className="text-gray-500 text-sm">Coming Soon</p>
            </div>
          </div>

          {/* Typing Games Coming Soon */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '1.8s' }}>
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:animate-hover-lift cursor-pointer">
              <h3 className="text-2xl font-bold text-white mb-2 animate-heartbeat">🎮 Typing Games</h3>
              <p className="text-purple-300">Exciting typing games coming soon! Stay tuned for fun challenges and adventures.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;