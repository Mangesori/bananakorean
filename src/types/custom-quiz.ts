import { TopicId } from '@/data/quiz/topics/meta';
import { DialogueQuestion } from './quiz';

/**
 * 커스텀 퀴즈 생성 상태
 */
export interface CustomQuizState {
  vocabulary: string[];
  selectedGrammar: TopicId[];
  quizCount: number;
  generatedQuestions: DialogueQuestion[];
}

/**
 * 커스텀 퀴즈 설정
 */
export interface CustomQuizSettings {
  dialogueDragDrop: number;
  matching: number;
  multipleChoice: number;
  fillInBlank: number;
  speaking: number;
}

/**
 * 커스텀 퀴즈 단계
 */
export type CustomQuizStep = 1 | 2 | 3 | 4;

/**
 * 문법 레벨별 그룹
 */
export interface GrammarGroup {
  level: 'A1' | 'A2' | 'A3';
  label: string;
  topics: TopicId[];
}

/**
 * 퀴즈 생성 모드
 */
export type QuizGenerationMode = 'hybrid' | 'from-scratch' | 'both';

/**
 * 개별 문제 생성 결과
 */
export interface QuestionGenerationResult {
  question: DialogueQuestion | null;
  success: boolean;
  error?: string;
  method?: 'template' | 'from-scratch'; // 추적용
}

/**
 * 퀴즈 생성 요청
 */
export interface QuizGenerationRequest {
  vocabulary: string[];
  grammarTopics: TopicId[];
  count: number;
  mode?: 'hybrid' | 'from-scratch' | 'both'; // 'both'는 두 방식 모두
}

/**
 * 퀴즈 생성 응답
 */
export interface QuizGenerationResponse {
  success: boolean;
  questions: DialogueQuestion[];
  metadata: {
    totalRequested: number;
    totalGenerated: number;
    failedCount: number;
    templateUsed: number; // 템플릿으로 생성된 수
    fromScratchUsed: number; // 처음부터 생성된 수
  };
  error?: string;
}

/**
 * 비교 결과 (양쪽 모두)
 */
export interface ComparisonResult {
  hybrid: QuizGenerationResponse;
  fromScratch: QuizGenerationResponse;
}
