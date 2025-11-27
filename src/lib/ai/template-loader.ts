/**
 * 템플릿 로더
 * DialogueDragAndDrop 폴더에서 기존 문제를 로드
 */

import { DialogueQuestion } from '@/types/quiz';
import { getGrammarTopicFileName, GRAMMAR_TOPICS } from './grammar-topics';
import { analyzeGrammar, grammarToString } from './grammar-patterns';

/**
 * 특정 문법 주제의 템플릿 로드
 */
export async function loadTemplatesFromTopic(
  topicId: string,
  limit: number = 5
): Promise<DialogueQuestion[]> {
  try {
    const fileName = getGrammarTopicFileName(topicId);

    if (!fileName) {
      throw new Error(`문법 주제를 찾을 수 없습니다: ${topicId}`);
    }

    // 동적 import로 문제 파일 로드
    const module = await import(`@/data/quiz/DialogueDragAndDrop/${fileName}.ts`);

    let allQuestions: DialogueQuestion[] = [];

    // 1. default export 확인
    if (module.default) {
      allQuestions = module.default;
    }
    // 2. dialogueQuestions export 확인
    else if (module.dialogueQuestions) {
      allQuestions = module.dialogueQuestions;
    }
    // 3. named export 중 배열 찾기 (pastTenseQuestions, locationActionsQuestions 등)
    else {
      const exportedValues = Object.values(module);
      const questionsArray = exportedValues.find((val) => Array.isArray(val));
      if (questionsArray) {
        allQuestions = questionsArray as DialogueQuestion[];
      }
    }

    if (allQuestions.length === 0) {
      throw new Error(`템플릿을 찾을 수 없습니다: ${fileName}`);
    }

    // 랜덤하게 섞고 limit 개수만큼 선택
    const shuffled = shuffleArray([...allQuestions]);
    return shuffled.slice(0, Math.min(limit, shuffled.length));
  } catch (error) {
    console.error('템플릿 로드 오류:', error);
    throw error;
  }
}

/**
 * 템플릿에서 교체 가능한 단어 추출
 * 명사 (특히 장소)를 주로 추출
 */
export function extractReplaceableWords(template: DialogueQuestion): string[] {
  const answer = template.answer;
  const replaceableWords: string[] = [];

  // 확장된 조사 패턴: 더 많은 한국어 조사 지원
  const patterns = [
    /([가-힣]+)에\s/g, // 장소 + 에
    /([가-힣]+)에서\s/g, // 장소 + 에서
    /([가-힣]+)을\s/g, // 목적어 + 을
    /([가-힣]+)를\s/g, // 목적어 + 를
    /([가-힣]+)와\s/g, // 명사 + 와
    /([가-힣]+)과\s/g, // 명사 + 과
    /([가-힣]+)은\s/g, // 주제 + 은
    /([가-힣]+)는\s/g, // 주제 + 는
    /([가-힣]+)가\s/g, // 주어 + 가
    /([가-힣]+)이\s/g, // 주어 + 이
    /([가-힣]+)도\s/g, // 명사 + 도 (also)
    /([가-힣]+)의\s/g, // 소유격 + 의
    /([가-힣]+)만\s/g, // 명사 + 만 (only)
    /([가-힣]+)부터\s/g, // 시작점 + 부터
    /([가-힣]+)까지\s/g, // 종료점 + 까지
  ];

  patterns.forEach((pattern) => {
    const matches = answer.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].length >= 2) {
        replaceableWords.push(match[1]);
      }
    }
  });

  // 중복 제거
  return Array.from(new Set(replaceableWords));
}

/**
 * 배열을 랜덤하게 섞기 (Fisher-Yates shuffle)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 템플릿에서 동사 추출 (다양한 시제 지원)
 */
export function extractVerbs(template: DialogueQuestion): string[] {
  const answer = template.answer;
  const verbs: string[] = [];

  // 다양한 동사 패턴 매칭
  const verbPatterns = [
    // 과거형: ~했어요, ~었어요, ~았어요
    /([가-힣]{1,})(?:했|었|았)어요/g,
    // 현재형: ~해요, ~어요, ~아요
    /([가-힣]{1,})(?:해요|어요|아요)/g,
    // 미래형: ~할 거예요, ~ㄹ 거예요
    /([가-힣]{1,})(?:할|ㄹ)\s?거예요/g,
    // 진행형: ~고 있어요
    /([가-힣]{1,})고\s?있어요/g,
    // 명령형: ~(으)세요
    /([가-힣]{1,})(?:으세요|세요)/g,
    // 의무: ~아야 하다/되다
    /([가-힣]{1,})(?:아야|어야)\s?(?:하|되)/g,
    // 능력: ~ㄹ 수 있다
    /([가-힣]{1,})(?:ㄹ|을)\s?수\s?있/g,
  ];

  verbPatterns.forEach((pattern) => {
    const matches = answer.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].length >= 1) {
        verbs.push(match[1]);
      }
    }
  });

  return Array.from(new Set(verbs));
}

/**
 * 템플릿 프롬프트 생성
 */
export function createTemplatePrompt(
  template: DialogueQuestion,
  newVocabulary: string,
  replacedWord: string,
  vocabularyType: '명사' | '동사',
  analyzedWord?: any  // AnalyzedWord 타입 (동사 활용형 정보 포함)
): string {
  if (vocabularyType === '명사') {
    return `
당신은 한국어 학습 퀴즈를 만드는 AI입니다.

아래 템플릿을 참고하여, "${newVocabulary}"를 사용한 유사한 문제를 생성하세요.

템플릿:
- 질문: ${template.question}
- 답변: ${template.answer}
- 영어 번역 (질문): ${template.questionTranslation}
- 영어 번역 (답변): ${template.answerTranslation}

요구사항:
1. "${replacedWord}"를 "${newVocabulary}"로 대체하세요
2. 같은 문법 구조를 유지하세요
3. 자연스러운 한국어 문장을 만드세요
4. 영어 번역도 함께 생성하세요

5. **⚠️ 질문 형식을 새 어휘 타입에 맞게 조정하세요:**
   - 새 어휘가 직업 명사인 경우 ("가이드", "선생님", "의사", "요리사", "경찰", "회사원", "배우", "운동 선수", "기자" 등):
     → 질문: "직업이 뭐예요?" 또는 "무슨 일을 하세요?"
     → 예: "가이드가 뭐예요?" ❌ "직업이 뭐예요?" ✅
   
   - 새 어휘가 국적 명사인 경우 (XXX + "사람" 패턴: "한국 사람", "뉴질랜드 사람", "미국 사람" 등):
     → 질문: "어느 나라 사람이에요?" 또는 "어디 사람이에요?"
     → 예: "뉴질랜드 사람이 뭐예요?" ❌ "어느 나라 사람이에요?" ✅
   
   - 새 어휘가 장소 명사인 경우 ("학교", "도서관", "식당", "공원" 등):
     → 질문: 템플릿 질문 그대로 사용
   
   - 기타 명사: 템플릿 질문 그대로 사용

6. **⚠️ 매우 중요: 질문과 답변의 주제가 반드시 일치해야 합니다!**
   - 직업 질문 ("직업이 뭐예요?") → 직업 답변 ("저는 가이드예요") ✅
   - 국적 질문 ("어느 나라 사람이에요?") → 국적 답변 ("저는 한국 사람이에요") ✅
   - 장소 질문 → 장소 답변 ✅
   - ❌ 절대 금지: "어느 나라 사람이에요?" → "저는 가이드예요." (주제 불일치!)
   - ❌ 절대 금지: "직업이 뭐예요?" → "저는 한국 사람이에요." (주제 불일치!)

7. **⚠️ 질문과 답변의 문법적 호응:**
   - 질문의 동사와 답변의 동사가 일치하거나 관련되어야 합니다
   - 질문의 조사와 답변의 조사가 일치해야 합니다:
     * "이/가"와 "은/는"은 서로 바꿔 쓸 수 있습니다 (주격 조사)
     * "이/가"와 "을/를"은 바꿔 쓸 수 없습니다 (주격 vs 목적격)
     * "에"와 "에서"는 바꿔 쓸 수 없습니다 (역할이 다름)
   - 질문에 "어떤 영화가"가 있으면 답변은 "그 영화가" 또는 "그 영화는"이어야 합니다

8. **⚠️ 2인칭/3인칭 대명사 사용 금지:**
   - "당신", "그", "그녀" 같은 대명사는 한국어에서 거의 사용하지 않으므로 절대 사용하지 마세요
   - 대신 이름을 사용하거나 생략하세요:
     * "당신은 가이드예요?" ❌ → "가이드예요?" ✅ 또는 "민수 씨는 가이드예요?" ✅
     * "그는 학생이에요" ❌ → "학생이에요" ✅ 또는 "민수 씨는 학생이에요" ✅

9. **⚠️⚠️⚠️ Self-Correction (생성 후 반드시 스스로 검증하고 수정) ⚠️⚠️⚠️**
   
   문제를 생성한 후, 출력하기 전에 다음을 검토하고 문제가 있으면 즉시 수정하세요:
   
   ✓ 주제 일치 확인:
     - 직업 질문("직업이 뭐예요?") → 직업 답변만 가능
     - 국적 질문("어느 나라 사람이에요?") → 국적 답변만 가능
     - 주제가 불일치하면 질문이나 답변을 수정
   
   ✓ 질문 형식 확인:
     - 직업 명사 → "직업이 뭐예요?" (O) / "XXX가 뭐예요?" (X)
     - 국적 명사 → "어느 나라 사람이에요?" (O) / "XXX 사람이 뭐예요?" (X)
   
   ✓ 문법 호응 확인:
     - 질문의 조사와 답변의 조사가 호응하는지
     - 대명사를 사용하지 않았는지
   
   문제가 발견되면 출력하지 말고 먼저 수정하세요!
   검토 완료 후 최종 결과만 출력하세요.

JSON 형식으로 응답:
{
  "question": "생성된 질문",
  "answer": "생성된 답변",
  "questionTranslation": "질문 영어 번역",
  "answerTranslation": "답변 영어 번역"
}
`;
  } else {
    // 동사
    // 템플릿 문법 분석
    const templateGrammar = analyzeGrammar(template.answer);

    // 시제별 활용형 정보 생성
    let tenseInstruction = '';
    let requiredForm = '';

    if (analyzedWord && analyzedWord.conjugations) {
      const tenseMap: Record<string, { name: string; form: string }> = {
        'PAST': {
          name: '과거형',
          form: analyzedWord.conjugations.past || ''
        },
        'PRESENT': {
          name: '현재형',
          form: analyzedWord.conjugations.present || ''
        },
        'FUTURE': {
          name: '미래형',
          form: analyzedWord.conjugations.future || ''
        },
      };

      const tenseInfo = tenseMap[templateGrammar.tense];
      if (tenseInfo && tenseInfo.form) {
        requiredForm = tenseInfo.form;
        tenseInstruction = `
⚠️⚠️⚠️ 매우 중요: 이 문제는 반드시 ${tenseInfo.name}이어야 합니다! ⚠️⚠️⚠️

시제 정보:
- 템플릿 시제: ${tenseInfo.name} (${grammarToString(templateGrammar)})
- 필수 동사 형태: "${newVocabulary}" → "${requiredForm}"
- ❌ 절대 금지: 다른 시제 사용 (${tenseInfo.name === '과거형' ? '현재형, 미래형' : tenseInfo.name === '현재형' ? '과거형, 미래형' : '과거형, 현재형'})

템플릿 예시 (반드시 이 시제를 따라야 합니다):
- 템플릿 답변: "${template.answer}"
  ${tenseInfo.name === '과거형' ? '→ 과거형 동사를 사용하고 있습니다 (예: ~했어요, ~었어요, ~았어요)' : ''}
  ${tenseInfo.name === '현재형' ? '→ 현재형 동사를 사용하고 있습니다 (예: ~해요, ~어요, ~아요)' : ''}
  ${tenseInfo.name === '미래형' ? '→ 미래형 동사를 사용하고 있습니다 (예: ~할 거예요, ~ㄹ 거예요)' : ''}

예시:
${tenseInfo.name === '과거형'
  ? `❌ 잘못된 예: "저는 학교에 가요." (현재형 - 틀림!)\n✅ 올바른 예: "저는 학교에 갔어요." (과거형 - 정답!)`
  : tenseInfo.name === '현재형'
  ? `❌ 잘못된 예: "저는 학교에 갔어요." (과거형 - 틀림!)\n✅ 올바른 예: "저는 학교에 가요." (현재형 - 정답!)`
  : `❌ 잘못된 예: "저는 학교에 가요." (현재형 - 틀림!)\n✅ 올바른 예: "저는 학교에 갈 거예요." (미래형 - 정답!)`
}
`;
      }
    }

    return `
당신은 한국어 학습 퀴즈를 만드는 AI입니다.

아래 템플릿을 참고하여, "${newVocabulary}"를 사용한 유사한 문제를 생성하세요.

템플릿:
- 질문: ${template.question}
- 답변: ${template.answer}
- 영어 번역 (질문): ${template.questionTranslation}
- 영어 번역 (답변): ${template.answerTranslation}
${tenseInstruction}
필수 요구사항:
1. "${replacedWord}"를 "${newVocabulary}"${requiredForm ? `의 ${requiredForm} 형태` : '의 적절한 활용형'}로 대체하세요
2. **시제를 반드시 일치시키세요** - 템플릿이 과거형이면 생성된 답변도 반드시 과거형이어야 합니다
3. 같은 문법 구조를 유지하세요
4. 자연스러운 한국어 문장을 만드세요
5. 영어 번역도 함께 생성하세요
6. 질문은 새로운 동사에 맞게 수정할 수 있습니다
7. **⚠️ 매우 중요: 질문과 답변이 서로 호응해야 합니다!**
   - 질문의 동사와 답변의 동사가 일치하거나 관련되어야 합니다
   - 질문에 "읽었어요?"가 있으면 답변도 "읽었어요"를 사용해야 합니다 (다른 동사 "끝났어요" 등 사용 금지)
   - 질문의 조사와 답변의 조사가 일치해야 합니다:
     * "이/가"와 "은/는"은 서로 바꿔 쓸 수 있습니다 (주격 조사)
     * "이/가"와 "을/를"은 바꿔 쓸 수 없습니다 (주격 vs 목적격)
     * "에"와 "에서"는 바꿔 쓸 수 없습니다 (역할이 다름)
   - 질문에 "어떤 영화가"가 있으면 답변은 "그 영화가" 또는 "그 영화는"이어야 합니다
   - 질문에 "어떤 책을 읽었어요?"가 있으면 답변도 "읽었어요"를 사용해야 합니다

8. **⚠️ 자연스러운 질문 형식 사용:**
   - 직업을 묻는 경우: "직업이 뭐예요?" 또는 "무슨 일을 하세요?" 사용 (예: "가이드가 뭐예요?" ❌ → "직업이 뭐예요?" ✅)
   - 국적/출신지를 묻는 경우: "어느 나라 사람이에요?" 또는 "어디 사람이에요?" 사용 (예: "뉴질랜드 사람이 뭐예요?" ❌ → "어느 나라 사람이에요?" ✅)
   - 질문과 답변이 자연스럽게 호응되도록 해야 합니다

9. **⚠️ 2인칭/3인칭 대명사 사용 금지:**
   - "당신", "그", "그녀" 같은 대명사는 한국어에서 거의 사용하지 않으므로 절대 사용하지 마세요
   - 대신 이름을 사용하거나 생략하세요:
     * "당신은 가이드예요?" ❌ → "가이드예요?" ✅ 또는 "민수 씨는 가이드예요?" ✅
     * "그는 학생이에요" ❌ → "학생이에요" ✅ 또는 "민수 씨는 학생이에요" ✅

10. **⚠️⚠️⚠️ Self-Correction (생성 후 반드시 스스로 검증하고 수정) ⚠️⚠️⚠️**
   
   문제를 생성한 후, 출력하기 전에 다음을 검토하고 문제가 있으면 즉시 수정하세요:
   
   ✓ 시제 확인:
     - 템플릿이 과거형이면 답변도 반드시 과거형
     - 템플릿이 현재형이면 답변도 반드시 현재형
     - 템플릿이 미래형이면 답변도 반드시 미래형
   
   ✓ 동사 호응 확인:
     - 질문의 동사와 답변의 동사가 일치하거나 관련
     - "읽었어요?" → "읽었어요" (O) / "끝났어요" (X)
   
   ✓ 문법 호응 확인:
     - 질문의 조사와 답변의 조사가 호응하는지
     - 대명사를 사용하지 않았는지
   
   문제가 발견되면 출력하지 말고 먼저 수정하세요!
   검토 완료 후 최종 결과만 출력하세요.

⚠️ 중요: 시제를 틀리거나 질문과 답변이 호응하지 않으면 문제가 자동으로 거부되고 다시 생성됩니다!

JSON 형식으로 응답${requiredForm ? ` (필수: "${requiredForm}" 형태 사용!)` : ''}:
{
  "question": "생성된 질문",
  "answer": "생성된 답변 (반드시 ${requiredForm || '적절한 시제'} 사용!)",
  "questionTranslation": "질문 영어 번역",
  "answerTranslation": "답변 영어 번역"
}
${requiredForm ? `\n올바른 JSON 예시:\n{\n  "question": "어제 무엇을 했어요?",\n  "answer": "어제 저는 숙제를 ${requiredForm}.",\n  "questionTranslation": "What did you do yesterday?",\n  "answerTranslation": "Yesterday I finished my homework."\n}` : ''}
`;
  }
}

/**
 * 선택한 문법 주제들의 템플릿만 로드
 *
 * @param grammarTopics - 문법 주제 ID 배열 (예: ['past-tense', 'ability', 'desires'])
 * @returns 선택한 문법 주제들의 모든 템플릿
 *
 * @example
 * const templates = await loadTemplatesByGrammarTopics(['past-tense', 'ability']);
 * // → past-tense.ts와 ability.ts의 모든 문제를 로드
 */
export async function loadTemplatesByGrammarTopics(
  grammarTopics: string[]
): Promise<DialogueQuestion[]> {
  const allTemplates: DialogueQuestion[] = [];

  console.log(`[템플릿 로더] ${grammarTopics.length}개 문법 주제 로드 시작:`, grammarTopics);

  for (const topicId of grammarTopics) {
    try {
      const topic = GRAMMAR_TOPICS.find((t) => t.id === topicId);

      if (!topic) {
        console.warn(`[템플릿 로더] 알 수 없는 문법 주제: ${topicId}`);
        continue;
      }

      // 동적 import로 문제 파일 로드
      const module = await import(`@/data/quiz/DialogueDragAndDrop/${topic.fileName}.ts`);

      let questions: DialogueQuestion[] = [];

      // 1. default export 확인
      if (module.default) {
        questions = module.default;
      }
      // 2. dialogueQuestions export 확인
      else if (module.dialogueQuestions) {
        questions = module.dialogueQuestions;
      }
      // 3. named export 중 배열 찾기
      else {
        const exportedValues = Object.values(module);
        const questionsArray = exportedValues.find((val) => Array.isArray(val));
        if (questionsArray) {
          questions = questionsArray as DialogueQuestion[];
        }
      }

      if (questions.length > 0) {
        // 각 템플릿에 문법 출처 표시
        questions.forEach(q => {
          (q as any).grammarTopicId = topicId;
        });

        allTemplates.push(...questions);
        console.log(
          `[템플릿 로더] ${topic.label} (${topic.fileName}): ${questions.length}개 템플릿 로드`
        );
      } else {
        console.warn(`[템플릿 로더] ${topic.fileName}에서 템플릿을 찾을 수 없습니다`);
      }
    } catch (error) {
      console.error(`[템플릿 로더] ${topicId} 로드 실패:`, error);
    }
  }

  console.log(`[템플릿 로더] 총 ${allTemplates.length}개 템플릿 로드 완료`);

  return allTemplates;
}
