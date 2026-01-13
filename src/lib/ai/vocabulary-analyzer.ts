/**
 * 어휘 품사 분석기
 * OpenAI를 사용하여 한국어 어휘의 품사를 분석합니다.
 */

import { chatCompletionJSON } from './client';

/**
 * 분석된 어휘 정보
 */
export interface AnalyzedVocabulary {
  word: string;
  type: 'noun' | 'verb' | 'adjective' | 'occupation' | 'nationality' | 'name' | 'location' | 'thing' | 'food' | 'time' | 'person' | 'other';
  subType?: string; // 예: 'occupation', 'place', 'thing' 등 추가 세부 정보
}

/**
 * 어휘 분석 결과
 */
export interface VocabularyAnalysisResult {
  analyzed: AnalyzedVocabulary[];
  errors: string[];
}

/**
 * 어휘 배열을 분석하여 품사 정보를 반환합니다.
 *
 * @param words 분석할 어휘 배열
 * @returns 품사가 태깅된 어휘 배열
 */
export async function analyzeVocabulary(
  words: string[]
): Promise<VocabularyAnalysisResult> {
  if (!words || words.length === 0) {
    return { analyzed: [], errors: [] };
  }

  try {
    const prompt = `다음 한국어 단어들의 품사를 분석해주세요.

단어 목록:
${words.map((w, i) => `${i + 1}. ${w}`).join('\n')}

**중요**: 반드시 다음 JSON 형식으로만 응답하세요:
{
  "vocabulary": [
    { "word": "단어1", "type": "품사타입", "subType": "세부타입" },
    { "word": "단어2", "type": "품사타입", "subType": "세부타입" }
  ]
}

품사 타입 (type) 선택:
- noun: 일반 명사
- verb: 동사 (끝내다, 먹다, 가다 등)
- adjective: 형용사
- location: 장소 명사 (학교, 도서관, 회사 등)
- occupation: 직업 (의사, 선생님 등)
- nationality: 국적 (한국, 미국 등)
- name: 이름
- thing: 물건 (책, 펜 등)
- food: 음식
- time: 시간 관련
- person: 사람
- other: 기타

예시 응답:
{
  "vocabulary": [
    { "word": "끝내다", "type": "verb" },
    { "word": "학교", "type": "location" }
  ]
}`;

    const response = await chatCompletionJSON<{ vocabulary: AnalyzedVocabulary[] }>(
      [{ role: 'user', content: prompt }],
      { temperature: 0.3 } // 낮은 temperature로 일관된 분류
    );

    console.log('AI 응답:', JSON.stringify(response, null, 2)); // 디버깅용

    if (!response || !response.vocabulary) {
      console.error('잘못된 AI 응답:', response);
      return {
        analyzed: [],
        errors: ['AI 응답 형식이 올바르지 않습니다.'],
      };
    }

    // 응답 검증
    const analyzed: AnalyzedVocabulary[] = [];
    const errors: string[] = [];

    for (const item of response.vocabulary) {
      if (!item.word || !item.type) {
        errors.push(`잘못된 분석 결과: ${JSON.stringify(item)}`);
        continue;
      }

      analyzed.push({
        word: item.word,
        type: item.type,
        subType: item.subType,
      });
    }

    // 입력 단어와 비교하여 누락된 단어 확인
    const analyzedWords = new Set(analyzed.map((a) => a.word));
    for (const word of words) {
      if (!analyzedWords.has(word)) {
        errors.push(`분석되지 않은 단어: ${word}`);
        // 기본값으로 추가
        analyzed.push({
          word,
          type: 'other',
        });
      }
    }

    return { analyzed, errors };
  } catch (error) {
    console.error('어휘 분석 중 오류:', error);
    return {
      analyzed: [],
      errors: [
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      ],
    };
  }
}

/**
 * 품사 타입을 한글로 변환 (디버깅/로깅용)
 */
export function getTypeLabel(type: AnalyzedVocabulary['type']): string {
  const labels: Record<AnalyzedVocabulary['type'], string> = {
    noun: '명사',
    verb: '동사',
    adjective: '형용사',
    occupation: '직업',
    nationality: '국적',
    name: '이름',
    location: '장소',
    thing: '물건',
    food: '음식',
    time: '시간',
    person: '사람',
    other: '기타',
  };
  return labels[type] || '알 수 없음';
}
