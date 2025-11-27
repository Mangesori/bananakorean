/**
 * 어휘 분석 관련 타입 정의
 * AI가 자동으로 품사를 분석하고 활용형을 생성하는데 사용
 */

export type WordType = '명사' | '동사' | '형용사' | '부사';
export type NounSubtype = '장소' | '물건' | '사람' | '시간' | '추상';

/**
 * 분석된 어휘 정보
 */
export interface AnalyzedWord {
  word: string;
  type: WordType;
  englishTranslation: string;

  // 명사인 경우
  subtype?: NounSubtype;
  particles?: string[];
  canReplace?: string[];

  // 동사인 경우
  stem?: string;
  conjugations?: {
    present: string;
    past: string;
    future: string;
    progressive?: string;
  };

  // 공통
  usageExamples?: string[];
  matchedTemplates?: number;
}

/**
 * 어휘 분석 요청
 */
export interface VocabularyAnalysisRequest {
  words: string[];
}

/**
 * 어휘 분석 응답
 */
export interface VocabularyAnalysisResponse {
  words: AnalyzedWord[];
  totalAnalyzed: number;
  nouns: number;
  verbs: number;
  adjectives: number;
  adverbs: number;
}
