import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Shuffle } from 'lucide-react';
import { getParagraphsByDifficulty, getRandomParagraph } from '../data/paragraphs';
import { getTimeOptions } from '../utils/typing';
import { Paragraph } from '../types';
import Footer from '../components/Footer';

const ParagraphSelection: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [selectedParagraph, setSelectedParagraph] = useState<Paragraph | null>(null);
  const [selectedTime, setSelectedTime] = useState(60);
  const [clickedElement, setClickedElement] = useState<string | null>(null);
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'Anonymous';
  const timeOptions = getTimeOptions();

  const handleElementClick = (elementId: string, action: () => void) => {
    setClickedElement(elementId);
    setTimeout(() => {
      setClickedElement(null);
      action();
    }, 200);
  };

  const handleRandomSelection = () => {
    handleElementClick('random-paragraph', () => {
      const randomParagraph = getRandomParagraph(selectedDifficulty);
      
      // Automatically start the test with the random paragraph
      const testSettings = {
        timeLimit: selectedTime,
        paragraph: randomParagraph,
        userName
      };
      localStorage.setItem('testSettings', JSON.stringify(testSettings));
      navigate('/typing-test');
    });
  };

  const handleStartChallenge = () => {
    if (selectedParagraph) {
      handleElementClick('start-challenge', () => {
        const testSettings = {
          timeLimit: selectedTime,
          paragraph: selectedParagraph,
          userName
        };
        localStorage.setItem('testSettings', JSON.stringify(testSettings));
        navigate('/typing-test');
      });
    }
  };

  const difficulties = [
    { key: 'easy' as const, label: 'Easy', color: 'text-green-400 border-green-400', description: 'Simple words and sentences' },
    { key: 'medium' as const, label: 'Medium', color: 'text-yellow-400 border-yellow-400', description: 'Moderate complexity' },
    { key: 'hard' as const, label: 'Hard', color: 'text-red-400 border-red-400', description: 'Advanced vocabulary and concepts' }
  ];

  const currentParagraphs = getParagraphsByDifficulty(selectedDifficulty);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 animate-gradient-xy flex flex-col overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-16 h-16 bg-neon-green/10 rounded-full animate-float"></div>
        <div className="absolute bottom-1/3 left-20 w-12 h-12 bg-blue-500/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-purple-500/10 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="flex-1 p-6 relative z-10">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6 animate-slide-right">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-400 hover:text-neon-green transition-all duration-300 hover:animate-hover-lift"
            >
              <ArrowLeft className="w-5 h-5 mr-2 animate-bounce-gentle" />
              Back to Home
            </button>
            <div className="text-right animate-slide-left">
              <p className="text-gray-400">Welcome back,</p>
              <p className="text-neon-green font-semibold animate-pulse">{userName}</p>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white text-center mb-2 animate-slide-up">
            Choose Your Challenge
          </h1>
          <p className="text-gray-400 text-center mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Select difficulty, time limit, and paragraph to test your typing skills
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Time Selection and Start Challenge Button */}
          <div className="mb-8 animate-slide-right" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-neon-green animate-rotate-slow" />
              Time Limit
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              {timeOptions.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedTime(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:animate-hover-lift ${
                    selectedTime === option.value
                      ? 'bg-neon-green text-black shadow-lg shadow-neon-green/40 animate-success-pulse'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600 hover:border-neon-green/50'
                  } ${clickedElement === `time-${option.value}` ? 'animate-click-scale' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {option.label}
                </button>
              ))}
              
              {/* Start Challenge Button - moved here */}
              {selectedParagraph && (
                <button
                  onClick={handleStartChallenge}
                  className={`ml-4 px-8 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/40 flex items-center animate-slide-left ${
                    clickedElement === 'start-challenge' ? 'animate-click-bounce' : ''
                  }`}
                >
                  <Play className="w-5 h-5 mr-2 animate-bounce-gentle" />
                  Start Challenge
                </button>
              )}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.9s' }}>
            <h2 className="text-2xl font-semibold text-white mb-4">Difficulty Level</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {difficulties.map((difficulty, index) => (
                <button
                  key={difficulty.key}
                  onClick={() => {
                    handleElementClick(`difficulty-${difficulty.key}`, () => {
                      setSelectedDifficulty(difficulty.key);
                      setSelectedParagraph(null);
                    });
                  }}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 hover:animate-hover-lift ${
                    selectedDifficulty === difficulty.key
                      ? `${difficulty.color} bg-opacity-20 border-opacity-100 animate-success-pulse`
                      : 'border-gray-600 text-gray-400 hover:border-gray-500'
                  } ${clickedElement === `difficulty-${difficulty.key}` ? 'animate-click-scale' : ''}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <h3 className="text-lg font-semibold mb-1">{difficulty.label}</h3>
                  <p className="text-sm opacity-80">{difficulty.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Random Option */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                    <Shuffle className="w-6 h-6 mr-2 text-purple-400 animate-rotate-slow" />
                    Random Challenge
                  </h3>
                  <p className="text-purple-300">Get a randomly generated paragraph for {selectedDifficulty} difficulty and start instantly!</p>
                </div>
                <button
                  onClick={handleRandomSelection}
                  className={`px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/40 flex items-center hover:animate-hover-lift ${
                    clickedElement === 'random-paragraph' ? 'animate-click-bounce' : ''
                  }`}
                >
                  <Shuffle className="w-5 h-5 mr-2 animate-bounce-gentle" />
                  Start Random
                </button>
              </div>
            </div>
          </div>

          {/* Paragraph Selection */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '1.5s' }}>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Choose a Paragraph ({selectedDifficulty})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentParagraphs.map((paragraph, index) => (
                <div
                  key={paragraph.id}
                  onClick={() => {
                    handleElementClick(`paragraph-${paragraph.id}`, () => {
                      setSelectedParagraph(paragraph);
                    });
                  }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-105 hover:animate-hover-lift ${
                    selectedParagraph?.id === paragraph.id
                      ? 'border-neon-green bg-neon-green bg-opacity-10 shadow-lg shadow-neon-green/20 animate-success-pulse'
                      : 'border-gray-700 bg-gray-800 bg-opacity-50 hover:border-gray-600'
                  } ${clickedElement === `paragraph-${paragraph.id}` ? 'animate-click-scale' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="font-semibold text-white mb-2">{paragraph.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {paragraph.text.substring(0, 120)}...
                  </p>
                  <div className="mt-3 text-xs text-gray-500">
                    {paragraph.text.split(' ').length} words
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ParagraphSelection;