/**
 * Week 2 Day 1: AI 통합 기초
 * AI 관련 타입 정의
 */

// 퀴즈 타입
export type QuizType =
  | 'multiple_choice'
  | 'dialogue_drag_drop'
  | 'fill_in_blank'
  | 'sentence_drag_drop'
  | 'matching';

// 문법 레벨
export type GrammarLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// AI 생성 요청
export interface AIGenerationRequest {
  vocabulary: string[]; // 한국어 단어/표현 목록
  grammar: string[]; // 문법 항목 (예: "introduction", "negation")
  grammarLevel: GrammarLevel;
  quizTypes: {
    type: QuizType;
    count: number;
  }[];
  totalProblems: number;
}

// 생성된 문제 (기본 구조)
export interface GeneratedProblem {
  id: string;
  type: QuizType;
  grammar: string;
  question: string;
  options?: string[]; // Multiple choice용
  correctAnswer: string | string[];
  dialogue?: {
    question: string;
    answer: string;
  }; // Dialogue용
  words?: string[]; // Drag & Drop용
  explanation?: string;
  vocabulary: string[]; // 사용된 어휘
}

// AI 응답
export interface AIGenerationResponse {
  problems: GeneratedProblem[];
  totalCount: number;
  metadata: {
    model: string;
    tokensUsed: number;
    cost: number;
    generatedAt: string;
  };
}

// AI 비용 추적
export interface AIUsageLog {
  userId: string;
  requestType: 'quiz_generation' | 'speaking_generation';
  model: string;
  tokensUsed: number;
  cost: number;
  problemsGenerated: number;
  createdAt: string;
}
