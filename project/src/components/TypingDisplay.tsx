import React from 'react';

interface TypingDisplayProps {
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  typedText: string;
  mistakes: Set<number>;
}

const TypingDisplay: React.FC<TypingDisplayProps> = ({
  words,
  currentWordIndex,
  currentCharIndex,
  typedText,
  mistakes
}) => {
  const renderWord = (word: string, wordIndex: number) => {
    const isCurrentWord = wordIndex === currentWordIndex;
    const isCompletedWord = wordIndex < currentWordIndex;
    const isPastWord = wordIndex < currentWordIndex;
    
    return (
      <span
        key={wordIndex}
        className={`inline-block mr-2 mb-1 transition-all duration-300 ${
          isCurrentWord ? 'bg-gray-700 px-1 rounded animate-pulse' : ''
        } ${isPastWord ? 'opacity-70' : ''}`}
      >
        {word.split('').map((char, charIndex) => {
          const globalCharIndex = words.slice(0, wordIndex).join(' ').length + 
                                 (wordIndex > 0 ? wordIndex : 0) + charIndex;
          let className = 'text-gray-400 transition-all duration-200';
          
          if (isCompletedWord || (isCurrentWord && charIndex < currentCharIndex)) {
            className = mistakes.has(globalCharIndex) 
              ? 'text-red-500 bg-red-900/50 animate-wiggle' 
              : 'text-neon-green animate-success-pulse';
          } else if (isCurrentWord && charIndex === currentCharIndex) {
            className = 'text-white bg-neon-green animate-pulse';
          }
          
          return (
            <span key={charIndex} className={className}>
              {char}
            </span>
          );
        })}
        {isCurrentWord && currentCharIndex === word.length && (
          <span className="text-white bg-neon-green animate-pulse"> </span>
        )}
      </span>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6 font-mono text-lg leading-8 min-h-[200px] max-h-[400px] overflow-y-auto border border-gray-700 hover:border-neon-green/30 transition-all duration-300 animate-fade-in">
      <div className="flex flex-wrap">
        {words.map((word, index) => renderWord(word, index))}
      </div>
    </div>
  );
};

export default TypingDisplay;