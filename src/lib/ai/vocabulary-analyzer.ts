/**
 * 어휘 분석기
 * AI가 자동으로 품사를 분석하고 활용형을 생성
 */

import { generateJSON } from './client';
import {
  AnalyzedWord,
  VocabularyAnalysisResponse,
  WordType,
  NounSubtype,
} from '@/types/vocabulary';

/**
 * 어휘 자동 분석
 * AI가 품사, 의미, 활용형 등을 자동으로 분석
 */
export async function analyzeVocabulary(words: string[]): Promise<VocabularyAnalysisResponse> {
  const prompt = `
다음 한국어 어휘를 분석해주세요.
각 어휘에 대해 품사, 의미, 활용형, 사용 예시를 제공하세요.

어휘 목록:
${words.map((w) => `- ${w}`).join('\n')}

각 어휘에 대해 다음 정보를 JSON으로 제공하세요:

1. **품사**: 명사, 동사, 형용사, 부사 중 하나
2. **영어 번역**: 정확한 영어 의미
3. **명사인 경우**:
   - 하위 유형: 장소, 물건, 사람, 시간, 추상 중 하나
   - 적합한 조사: 예) ["에", "에서", "을/를"]
   - 교체 가능한 유사 단어: 3-5개
   - 사용 예시: 2-3개 문장

4. **동사인 경우**:
   - 어간: 동사의 기본형 (예: "시작하다" → "시작")
   - 활용형:
     - 현재: ~해요/어요
     - 과거: ~했어요/었어요
     - 미래: ~ㄹ 거예요
     - 진행: ~고 있어요
   - 교체 가능한 유사 동사: 3-5개
   - 사용 예시: 2-3개 문장

**중요**: 반드시 아래 JSON 형식을 정확히 따라주세요.

JSON 형식:
{
  "words": [
    {
      "word": "헬스장",
      "type": "명사",
      "englishTranslation": "gym",
      "subtype": "장소",
      "particles": ["에", "에서", "을/를"],
      "canReplace": ["학교", "도서관", "체육관"],
      "usageExamples": [
        "헬스장에 갔어요",
        "헬스장에서 운동했어요"
      ]
    },
    {
      "word": "시작하다",
      "type": "동사",
      "englishTranslation": "to start",
      "stem": "시작",
      "conjugations": {
        "present": "시작해요",
        "past": "시작했어요",
        "future": "시작할 거예요",
        "progressive": "시작하고 있어요"
      },
      "canReplace": ["공부하다", "일하다", "준비하다"],
      "usageExamples": [
        "운동을 시작했어요",
        "수업이 시작해요"
      ]
    }
  ]
}
`;

  try {
    const response = await generateJSON<{ words: AnalyzedWord[] }>(prompt);

    // 통계 계산
    const nouns = response.words.filter((w) => w.type === '명사').length;
    const verbs = response.words.filter((w) => w.type === '동사').length;
    const adjectives = response.words.filter((w) => w.type === '형용사').length;
    const adverbs = response.words.filter((w) => w.type === '부사').length;

    return {
      words: response.words,
      totalAnalyzed: response.words.length,
      nouns,
      verbs,
      adjectives,
      adverbs,
    };
  } catch (error) {
    console.error('어휘 분석 오류:', error);
    throw new Error('어휘 분석에 실패했습니다.');
  }
}

/**
 * 단어 타입 간단 추측 (AI 호출 전 사전 필터링용)
 */
export function guessWordType(word: string): WordType {
  // 동사 패턴
  if (word.endsWith('하다') || word.endsWith('되다') || word.endsWith('나다')) {
    return '동사';
  }

  // 부사 패턴
  if (word.endsWith('이') || word.endsWith('히') || word.endsWith('게')) {
    return '부사';
  }

  // 형용사 패턴 (일부)
  if (word.endsWith('스럽다') || word.endsWith('롭다')) {
    return '형용사';
  }

  // 기본값: 명사
  return '명사';
}

/**
 * 명사의 하위 유형 추측
 */
export function guessNounSubtype(word: string): NounSubtype {
  // 장소 키워드
  const placeKeywords = ['장', '원', '관', '실', '집', '점', '터', '소'];
  if (placeKeywords.some((k) => word.includes(k))) {
    return '장소';
  }

  // 사람 키워드
  const personKeywords = ['사람', '선생', '학생', '친구', '가족', '님'];
  if (personKeywords.some((k) => word.includes(k))) {
    return '사람';
  }

  // 시간 키워드
  const timeKeywords = ['시', '분', '일', '월', '년', '주'];
  if (timeKeywords.some((k) => word.includes(k))) {
    return '시간';
  }

  // 기본값: 물건
  return '물건';
}
