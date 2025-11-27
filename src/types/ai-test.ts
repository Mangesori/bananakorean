/**
 * AI 테스트 관련 타입 정의
 */

import { DialogueQuestion } from './quiz';
import { AnalyzedWord } from './vocabulary';

/**
 * 템플릿 기반 퀴즈 생성 요청
 */
export interface TemplateGenerationRequest {
  vocabularyWords: string[];
  grammarTopics: string[];
  numberOfTemplates: number;
  numberOfProblems: number;
  model?: 'gpt-4o-mini' | 'gpt-4o';
  mode?: 'test' | 'production';
}

/**
 * 생성된 문제 정보
 */
export interface GeneratedProblem {
  template: DialogueQuestion;
  generated: DialogueQuestion;
  replacedWord: string;
  newVocabulary: string;
  validation: ValidationResult;
  metadata: GenerationMetadata;
  matchScore?: number;
}

/**
 * 검증 결과
 */
export interface ValidationResult {
  structureSimilarity: number; // 0-1
  grammarMatch: boolean; // 시제+양태+상 모두 일치
  tenseMatch: boolean; // 시제만 일치
  hasTranslation: boolean;
  itemsValid: boolean;
  questionAnswerCoherence?: boolean; // 질문과 답변의 호응 여부
}

/**
 * 생성 메타데이터
 */
export interface GenerationMetadata {
  tokensUsed: number;
  generationTime: number; // ms
  model: string;
}

/**
 * 템플릿 생성 응답 (테스트 모드)
 */
export interface TemplateGenerationTestResponse {
  success: boolean;
  mode: 'test';
  analysis: {
    vocabulary: AnalyzedWord[];
  };
  generatedProblems: GeneratedProblem[];
  statistics: {
    templatesUsed: number;
    problemsGenerated: number;
    successRate: number;
    totalTokens: number;
    estimatedCost: string;
    vocabularyCount: number;
  };
}

/**
 * 템플릿 생성 응답 (프로덕션 모드)
 */
export interface TemplateGenerationProductionResponse {
  success: boolean;
  mode: 'production';
  problems: DialogueQuestion[];
  count: number;
}

/**
 * 통합 응답 타입
 */
export type TemplateGenerationResponse =
  | TemplateGenerationTestResponse
  | TemplateGenerationProductionResponse;
