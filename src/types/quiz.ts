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
  ignoreSpaceRule?: boolean;
  // Metadata for editor merging rules
  isParticle?: boolean;
  originalWordIndex?: number;
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

// 객관식(단일 선택) 퀴즈 타입
export interface MultipleChoiceQuestion {
  id: number;
  question: string;
  questionTranslation?: string;
  answerTranslation?: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  grammarName?: string; // 문법 이름 (예: '은/는', '이에요/예요', '이거/그거/저거')
  // 아래 필드는 대화형의 questionPrefix/questionItems/suffix를 MCQ에 반영하기 위한 선택 필드
  questionPrefix?: string;
  questionItemsTranslation?: string;
  questionSuffix?: string;
  // answer 조각 정보 (MCQ에서 부분 영어 표시)
  answerPrefix?: string;
  answerItemsTranslation?: string;
  answerSuffix?: string;
  mode?: 'question-to-answer' | 'answer-to-question';
}

// 퀴즈 진행 상태 관련 타입
export interface QuizProgress {
  currentScore: number;
  totalQuestions: number;
  completedQuestions: number[];
  currentStreak: number;
  bestStreak: number;
}

export interface DialogueQuestion {
  id: number;
  question: string;
  questionTranslation: string;
  answer: string;
  alternativeAnswers?: string[];
  answerTranslation: string;
  items: Item[];
  grammarName?: string; // 문법 이름 (예: '은/는', '이에요/예요', '이거/그거/저거')
  mode?: 'question-to-answer' | 'answer-to-question'; // 새로운 모드 옵션
  // 새로운 필드들: question 내에서 부분적 드래그 앤 드롭 지원
  questionPrefix?: string; // 고정으로 표시될 앞부분
  questionItems?: Item[]; // 드래그 앤 드롭할 question 부분
  questionSuffix?: string; // 고정으로 표시될 뒷부분
  questionItemsTranslation?: string; // questionItems에 대한 영어 번역
  // answer 부분에서 부분적 드래그 앤 드롭 지원
  answerPrefix?: string; // answer에서 고정으로 표시될 앞부분
  answerItems?: Item[]; // answer에서 드래그 앤 드롭할 부분
  answerSuffix?: string; // answer에서 고정으로 표시될 뒷부분
  answerItemsTranslation?: string; // answerItems에 대한 영어 번역
}

// 빈칸 채우기 퀴즈 타입
export interface FillInTheBlankQuestion {
  id: number;
  sentence: string; // 빈칸이 포함된 문장 (예: "저는 ___에 가요")
  translation: string; // 영어 번역
  blanks: BlankField[]; // 빈칸 정보들
  hints?: WordHint[]; // 힌트 정보
}

export interface BlankField {
  id: string;
  correctAnswers: string[]; // 정답들 (여러 정답 가능)
  hint?: string; // 개별 빈칸 힌트
  position: number; // 문장에서의 위치 (0부터 시작)
}
