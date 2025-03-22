import { DragEndEvent } from '@dnd-kit/core';
import { Dispatch, SetStateAction } from 'react';

export interface WordHint {
  content: string;
  hint: string;
  isGrammar?: boolean;
}

export interface Item {
  id: string;
  content: string;
  combineWithNext?: boolean;
}

export interface WordProps {
  text: string;
  hints: WordHint[];
}

export interface OptionProps {
  item: Item;
}

// DragAndDrop 관련 타입들
export interface DraggableItem extends Item {
  index: number;
}

export interface SortableItemProps {
  id: string;
  item: DraggableItem;
  isDragging?: boolean;
}

export interface DragAndDropProps {
  items: Item[];
  onReorder: (items: Item[]) => void;
}

// 퀴즈 서비스 관련 타입들
export type SetItems = Dispatch<SetStateAction<Item[]>>;

export interface QuizService {
  handleDragEnd: (
    event: DragEndEvent,
    questionItems: Item[],
    setQuestionItems: SetItems,
    answerItems: Item[],
    setAnswerItems: SetItems
  ) => void;
  handleSubmit: (
    answerItems: Item[],
    setAnswerItems: SetItems,
    originalItems: Item[],
    correctAnswer: string,
    setQuestionItems: SetItems
  ) => boolean;
}

// 한국어 퀴즈 문제 관련 타입들
export interface KoreanQuestion {
  id: number;
  baseText: string;
  alternativeTexts?: string[];
  translation: string;
  hints: WordHint[];
  items: Item[];
}

// 이예요/예요 퀴즈 문제 관련 타입들
export type QuizType = 'Multiple Choice' | 'Fill in the blank' | 'Drag and Drop';
export type GrammarType = 'copula' | 'particle' | 'sentence' | 'wordOrder';

export interface QuizVariation {
  type: QuizType;
  grammarType: GrammarType;
  question: string;
  options?: string[];
  correctAnswer?: string;
  words?: string[];
  correctOrder?: number[];
  explanation: string;
}

export interface QuizQuestion {
  id: number;
  baseText: string;
  translation: string;
  variations: QuizVariation[];
}

// 레벨 시스템 관련 타입
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface QuizLevel {
  level: DifficultyLevel;
  requiredScore: number;
  questions: number[];
}

// 세트 시스템 관련 타입
export interface QuizSet {
  id: number;
  name: string;
  questionIds: number[];
  bestScore?: number;
}

// 테마 시스템 관련 타입
export type QuizTheme = 'occupation' | 'nationality' | 'daily_life';

export interface ThemeQuiz {
  theme: QuizTheme;
  name: string;
  description: string;
  questionIds: number[];
}

// 퀴즈 진행 상태 관련 타입
export interface QuizProgress {
  currentScore: number;
  totalQuestions: number;
  completedQuestions: number[];
  currentStreak: number;
  bestStreak: number;
}
