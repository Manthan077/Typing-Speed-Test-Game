export interface TypingStats {
  wpm: number;
  accuracy: number;
  mistakes: number;
  correctChars: number;
  totalChars: number;
}

export interface Paragraph {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'training';
  title: string;
}

export interface TestSettings {
  timeLimit: number;
  paragraph: Paragraph;
  userName: string;
}

export interface TypingState {
  currentWordIndex: number;
  currentCharIndex: number;
  typedText: string;
  mistakes: number;
  correctChars: number;
  totalChars: number;
  startTime: number | null;
  isFinished: boolean;
}