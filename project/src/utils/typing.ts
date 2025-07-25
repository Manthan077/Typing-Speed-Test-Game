import { TypingStats } from '../types';

export const calculateWPM = (correctChars: number, timeElapsed: number): number => {
  if (timeElapsed === 0) return 0;
  const minutes = timeElapsed / 60;
  const words = correctChars / 5; // Standard: 5 characters = 1 word
  return Math.round(words / minutes);
};

export const calculateAccuracy = (correctChars: number, totalChars: number): number => {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
};

export const getTypingStats = (
  correctChars: number,
  totalChars: number,
  mistakes: number,
  timeElapsed: number
): TypingStats => {
  return {
    wpm: calculateWPM(correctChars, timeElapsed),
    accuracy: calculateAccuracy(correctChars, totalChars),
    mistakes,
    correctChars,
    totalChars
  };
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getTimeOptions = () => [
  { label: '30 seconds', value: 30 },
  { label: '1 minute', value: 60 },
  { label: '2 minutes', value: 120 },
  { label: '5 minutes', value: 300 },
  { label: '10 minutes', value: 600 }
];