import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TestSettings, TypingState } from '../types';
import { getTypingStats } from '../utils/typing';
import TypingDisplay from '../components/TypingDisplay';
import Timer from '../components/Timer';
import Countdown from '../components/Countdown';
import Footer from '../components/Footer';

const TypingTest: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [testSettings, setTestSettings] = useState<TestSettings | null>(null);
  const [showCountdown, setShowCountdown] = useState(true);
  const [typingState, setTypingState] = useState<TypingState>({
    currentWordIndex: 0,
    currentCharIndex: 0,
    typedText: '',
    mistakes: 0,
    correctChars: 0,
    totalChars: 0,
    startTime: null,
    isFinished: false
  });
  const [mistakes, setMistakes] = useState<Set<number>>(new Set());
  const [currentInput, setCurrentInput] = useState('');

  useEffect(() => {
    const savedSettings = localStorage.getItem('testSettings');
    if (savedSettings) {
      setTestSettings(JSON.parse(savedSettings));
    } else {
      navigate('/select-paragraph');
    }
  }, [navigate]);

  const words = testSettings?.paragraph.text.split(' ') || [];
  const fullText = words.join(' ');

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    const startTime = Date.now();
    setTypingState(prev => ({ ...prev, startTime }));
    inputRef.current?.focus();
  };

  const getGlobalCharIndex = useCallback((wordIndex: number, charIndex: number): number => {
    return words.slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? wordIndex : 0) + charIndex;
  }, [words]);

  const finishTest = useCallback(() => {
    if (typingState.isFinished) return;
    
    const timeElapsed = typingState.startTime ? (Date.now() - typingState.startTime) / 1000 : 0;
    const stats = getTypingStats(typingState.correctChars, typingState.totalChars, typingState.mistakes, timeElapsed);
    
    localStorage.setItem('testResults', JSON.stringify({
      ...stats,
      timeElapsed,
      paragraph: testSettings?.paragraph.title || ''
    }));
    
    setTypingState(prev => ({ ...prev, isFinished: true }));
    navigate('/results');
  }, [typingState, testSettings, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typingState.isFinished || !typingState.startTime) return;

    const value = e.target.value;
    const currentWord = words[typingState.currentWordIndex] || '';
    
    // Prevent going back to previous words
    if (value.length === 0 && typingState.currentCharIndex === 0) {
      return;
    }

    // Handle space - move to next word
    if (value.endsWith(' ')) {
      const typedWord = value.slice(0, -1);
      
      // Mark remaining characters in current word as mistakes if not typed
      const newMistakes = new Set(mistakes);
      for (let i = typedWord.length; i < currentWord.length; i++) {
        const globalIndex = getGlobalCharIndex(typingState.currentWordIndex, i);
        newMistakes.add(globalIndex);
      }
      setMistakes(newMistakes);

      // Move to next word
      if (typingState.currentWordIndex < words.length - 1) {
        setTypingState(prev => ({
          ...prev,
          currentWordIndex: prev.currentWordIndex + 1,
          currentCharIndex: 0,
          totalChars: prev.totalChars + 1 // Count space
        }));
        setCurrentInput('');
      } else {
        finishTest();
      }
      return;
    }

    // Update current input and typing state
    const newTotalChars = typingState.totalChars + (value.length > currentInput.length ? 1 : 0);
    let newCorrectChars = typingState.correctChars;
    let newMistakeCount = typingState.mistakes;
    const newMistakes = new Set(mistakes);

    // Check each character in current word
    for (let i = 0; i < value.length && i < currentWord.length; i++) {
      const globalIndex = getGlobalCharIndex(typingState.currentWordIndex, i);
      const isCorrect = value[i] === currentWord[i];
      
      if (i < currentInput.length) {
        // Character was already processed
        continue;
      }
      
      if (isCorrect) {
        newCorrectChars++;
        newMistakes.delete(globalIndex);
      } else {
        newMistakes.add(globalIndex);
        newMistakeCount++;
      }
    }

    setMistakes(newMistakes);
    setCurrentInput(value);
    setTypingState(prev => ({
      ...prev,
      currentCharIndex: value.length,
      correctChars: newCorrectChars,
      totalChars: newTotalChars,
      mistakes: newMistakeCount
    }));

    // Check if test is complete
    if (typingState.currentWordIndex === words.length - 1 && value === currentWord) {
      finishTest();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent backspace if at beginning of word (can't go back to previous word)
    if (e.key === 'Backspace' && currentInput.length === 0 && typingState.currentCharIndex === 0) {
      e.preventDefault();
    }
    
    // Disable paste
    if (e.ctrlKey && e.key === 'v') {
      e.preventDefault();
    }
  };

  if (!testSettings) {
    return <div>Loading...</div>;
  }

  if (showCountdown) {
    return <Countdown onComplete={handleCountdownComplete} />;
  }

  const currentStats = getTypingStats(
    typingState.correctChars, 
    typingState.totalChars, 
    typingState.mistakes, 
    typingState.startTime ? (Date.now() - typingState.startTime) / 1000 : 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 animate-gradient-xy flex flex-col overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-12 h-12 bg-neon-green/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-8 h-8 bg-blue-500/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-10 w-6 h-6 bg-purple-500/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="flex-1 p-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 animate-slide-right">
            <button
              onClick={() => navigate(testSettings.paragraph.difficulty === 'training' ? '/' : '/select-paragraph')}
              className="flex items-center text-gray-400 hover:text-neon-green transition-all duration-300 hover:animate-hover-lift"
            >
              <ArrowLeft className="w-5 h-5 mr-2 animate-bounce-gentle" />
              Back
            </button>
            <div className="text-center animate-slide-up">
              <h1 className="text-2xl font-bold text-white">{testSettings.paragraph.title}</h1>
              <p className="text-gray-400 capitalize animate-pulse">
                {testSettings.paragraph.difficulty === 'training' ? 'Training Mode' : `${testSettings.paragraph.difficulty} Level`}
              </p>
            </div>
            <div className="text-right animate-slide-left">
              <p className="text-gray-400">Typing as</p>
              <p className="text-neon-green font-semibold animate-pulse">{testSettings.userName}</p>
            </div>
          </div>

          {/* Timer */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Timer
              timeLimit={testSettings.timeLimit}
              isActive={!!typingState.startTime && !typingState.isFinished}
              onTimeUp={finishTest}
              startTime={typingState.startTime}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 text-center hover:animate-hover-lift transition-all duration-300">
              <div className="text-2xl font-bold text-neon-green animate-pulse-glow">
                {currentStats.wpm}
              </div>
              <div className="text-gray-400 text-sm">WPM</div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 text-center hover:animate-hover-lift transition-all duration-300">
              <div className="text-2xl font-bold text-blue-400 animate-heartbeat">
                {currentStats.accuracy}%
              </div>
              <div className="text-gray-400 text-sm">Accuracy</div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 text-center hover:animate-hover-lift transition-all duration-300">
              <div className={`text-2xl font-bold text-red-400 ${typingState.mistakes > 0 ? 'animate-wiggle' : ''}`}>
                {typingState.mistakes}
              </div>
              <div className="text-gray-400 text-sm">Mistakes</div>
            </div>
          </div>

          {/* Typing Display */}
          <div className="animate-slide-up" style={{ animationDelay: '0.9s' }}>
            <TypingDisplay
              words={words}
              currentWordIndex={typingState.currentWordIndex}
              currentCharIndex={typingState.currentCharIndex}
              typedText={typingState.typedText}
              mistakes={mistakes}
            />
          </div>

          {/* Input Field */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onPaste={(e) => e.preventDefault()}
              className="w-full max-w-2xl px-6 py-4 bg-gray-800 border border-gray-600 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-neon-green font-mono transition-all duration-300 hover:border-neon-green/50 focus:animate-success-pulse"
              placeholder="Start typing..."
              disabled={typingState.isFinished}
              autoFocus
            />
            <p className="text-gray-400 text-sm mt-2 animate-bounce-gentle">
              Type the text above. Press space to move to the next word.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TypingTest;