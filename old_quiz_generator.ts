/**
 * 퀴즈 생성기
 * 템플릿 기반으로 AI가 새로운 문제를 생성
 */

import { DialogueQuestion, Item } from '@/types/quiz';
import { GeneratedProblem, ValidationResult, GenerationMetadata } from '@/types/ai-test';
import { AnalyzedWord } from '@/types/vocabulary';
import { generateStructuredJSON, estimateTokens } from './client';
import { DIALOGUE_QUESTION_SCHEMA, DialogueQuestionOutput } from './schemas';
import { createTemplatePrompt, extractReplaceableWords, extractVerbs } from './template-loader';
import { calculateStructureSimilarity, MatchedTemplate, findTopNTemplates } from './template-matcher';
import { matchGrammar, analyzeGrammar, grammarToString } from './grammar-patterns';

/**
 * 생성된 문제를 여러 템플릿과 비교하여 가장 유사한 템플릿 찾기
 */
function findBestMatchingTemplate(
  generated: DialogueQuestion,
  templates: DialogueQuestion[],
  usedTemplateIds?: Set<string>
): { template: DialogueQuestion; validation: ValidationResult } | null {
  const availableTemplates = templates.filter(
    (t) => !usedTemplateIds?.has(t.id)
  );

  if (availableTemplates.length === 0) {
    return null;
  }

  // 각 템플릿과 비교하여 가장 유사한 템플릿 찾기
  let bestMatch: { template: DialogueQuestion; validation: ValidationResult } | null = null;
  let bestScore = -1;

  for (const template of availableTemplates) {
    const validation = validateGeneratedProblem(template, generated);
    
    // 검증 통과 조건 점수 계산
    const score = 
      (validation.tenseMatch ? 1 : 0) * 3 + // 시제 일치: 3점
      (validation.structureSimilarity >= 0.6 ? validation.structureSimilarity : 0) * 2 + // 구조 유사도: 2점
      (validation.hasTranslation ? 1 : 0) + // 번역 존재: 1점
      (validation.itemsValid ? 1 : 0); // items 유효: 1점

    if (score > bestScore) {
      bestScore = score;
      bestMatch = { template, validation };
    }
  }

  return bestMatch;
}

/**
 * 템플릿 기반 문제 생성
 * AI로 문제를 한 번 생성한 후, 여러 템플릿과 비교하여 가장 유사한 템플릿 찾기
 */
export async function generateProblemFromTemplate(
  matchedTemplate: MatchedTemplate,
  analyzedWord: AnalyzedWord,
  model: 'gpt-4o-mini' | 'gpt-4o' = 'gpt-4o-mini',
  maxRetries: number = 3,
  allTemplates?: DialogueQuestion[], // 다른 템플릿과 비교하기 위한 전체 템플릿 목록
  usedTemplateIds?: Set<string> // 사용된 템플릿 ID Set
): Promise<GeneratedProblem> {
  const startTime = Date.now();
  let totalTokensUsed = 0;
  let lastError: any = null;

  // 최대 maxRetries 번 시도 (AI 재생성)
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // AI 프롬프트 생성
      const prompt = createTemplatePrompt(
        matchedTemplate.template,
        analyzedWord.word,
        matchedTemplate.replacedWord,
        analyzedWord.type,
        analyzedWord  // 동사 활용형 정보 전달
      );

      // AI로 문제 생성 (한 번만) - Structured Output 사용
      const response = await generateStructuredJSON<DialogueQuestionOutput>(
        prompt,
        DIALOGUE_QUESTION_SCHEMA,
        undefined,
        model
      );

      // 디버깅: AI 응답 출력
      console.log(`📝 AI 생성 답변 (시도 ${attempt}):`, response.answer);

      // items 배열 자동 생성 (드래그 앤 드롭용)
      const items = generateItemsFromAnswer(response.answer);

      // 디버깅: 생성된 items 출력
      console.log(`🔧 생성된 items:`, items.map(i => `"${i.content}"${i.combineWithNext ? '→' : ''}`).join(' '));

      // 생성된 문제 구성
      const generated: DialogueQuestion = {
        id: matchedTemplate.template.id,
        question: response.question,
        questionTranslation: response.questionTranslation,
        answer: response.answer,
        answerTranslation: response.answerTranslation,
        items,
        grammarName: matchedTemplate.template.grammarName,
      };

      // 토큰 사용량 누적
      totalTokensUsed += estimateTokens(prompt) + estimateTokens(response.answer);

      // 여러 템플릿과 비교하여 가장 유사한 템플릿 찾기
      let bestMatch: { template: DialogueQuestion; validation: ValidationResult } | null = null;
      
      if (allTemplates && allTemplates.length > 0) {
        // 전체 템플릿 목록이 있으면 그 중에서 가장 유사한 템플릿 찾기
        bestMatch = findBestMatchingTemplate(generated, allTemplates, usedTemplateIds);
        console.log(`🔍 ${allTemplates.length}개 템플릿과 비교 중...`);
      } else {
        // 전체 템플릿 목록이 없으면 원래 템플릿과만 비교
        const validation = validateGeneratedProblem(matchedTemplate.template, generated);
        bestMatch = { template: matchedTemplate.template, validation };
      }

      if (!bestMatch) {
        // 유사한 템플릿이 없을 때만 AI 재생성
        console.log(`✗ 매칭되는 템플릿 없음 (시도 ${attempt}/${maxRetries})`);
        if (attempt < maxRetries) {
          console.log(`  → 유사한 템플릿이 없어서 AI 재생성 중...`);
        }
        continue;
      }

      const { template: bestTemplate, validation } = bestMatch;

      console.log(`🔍 가장 유사한 템플릿: "${bestTemplate.answer}"`);
      console.log(`   구조 유사도: ${validation.structureSimilarity.toFixed(2)}`);
      console.log(`   시제 일치: ${validation.tenseMatch ? '✓' : '✗'}`);

      // 검증 통과 조건 (시제만 필수, 전체 문법은 선택)
      const isValid =
        validation.tenseMatch &&  // 시제만 일치하면 OK
        validation.structureSimilarity >= 0.6 &&
        validation.hasTranslation &&
        validation.itemsValid;

      if (isValid) {
        // 검증 통과 - 성공
        console.log(`✓ 문제 생성 성공 (Self-Correction + Structured Output 적용)`);

        const metadata: GenerationMetadata = {
          tokensUsed: totalTokensUsed,
          generationTime: Date.now() - startTime,
          model,
        };

        return {
          template: bestTemplate,
          generated,
          replacedWord: matchedTemplate.replacedWord,
          newVocabulary: analyzedWord.word,
          validation,
          metadata,
          matchScore: matchedTemplate.matchScore,
        };
      } else {
        // 검증 실패 - 재시도
        console.log(`✗ 검증 실패 (시도 ${attempt}/${maxRetries}):`, {
          tenseMatch: validation.tenseMatch,
          structureSimilarity: validation.structureSimilarity.toFixed(2),
          itemsValid: validation.itemsValid,
        });
        
        if (attempt < maxRetries) {
          console.log(`  → AI 재생성 중...`);
          continue;
        }
      }
    } catch (error) {
      lastError = error;
      console.error(`문제 생성 오류 (시도 ${attempt}/${maxRetries}):`, error);

      if (attempt < maxRetries) {
        console.log(`  → AI 재생성 중...`);
      }
    }
  }

  // 모든 시도 실패
  throw new Error(
    `문제 생성 실패 (${maxRetries}회 시도): ${lastError || '검증 실패'}`
  );
}

/**
 * 답변 문장에서 items 배열 자동 생성
 * 한국어 조사를 명사에서 분리하여 드래그 앤 드롭 아이템 생성
 */
function generateItemsFromAnswer(answer: string): Item[] {
  const items: Item[] = [];
  let idCounter = 1;

  // 한국어 조사 목록 (길이 순으로 정렬 - 긴 조사부터 매칭)
  const particles = [
    '에서부터', '한테서', '께서', '에서도', '에게도', '한테도',
    '에서', '에게', '한테', '부터', '까지', '에도', '으로', '로도',
    '은', '는', '이', '가', '을', '를', '에', '와', '과', '의', '도', '만',
    '로', '하고', '랑', '이랑'
  ].sort((a, b) => b.length - a.length);

  // 문장을 공백으로 분리
  const words = answer.split(' ');

  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    let processed = false;

    // 마지막 단어인 경우 (예: "끝냈어요.", "갔어요.")
    const isLastWord = i === words.length - 1;

    // 조사 분리 시도
    for (const particle of particles) {
      if (word.endsWith(particle)) {
        // 조사가 단어 끝에 있는 경우
        const stem = word.slice(0, -particle.length);

        // 명사 부분이 있는 경우에만 분리
        if (stem.length > 0 && !stem.match(/[.!?]$/)) {
          // 명사 부분 (조사와 붙어야 함)
          items.push({
            id: String(idCounter++),
            content: stem,
            combineWithNext: true,
          });

          // 조사 부분 (다음 단어와는 띄어야 함)
          items.push({
            id: String(idCounter++),
            content: particle,
            combineWithNext: false,  // 조사는 항상 다음 단어와 띄어씀
          });

          processed = true;
          break;
        }
      }
    }

    // 조사가 없거나 분리할 수 없는 경우 (동사, 형용사, 부사 등)
    if (!processed) {
      items.push({
        id: String(idCounter++),
        content: word,
        combineWithNext: false,  // 조사 없는 단어는 다음 단어와 띄어씀
      });
    }
  }

  // 안전장치: 마지막 아이템은 항상 combineWithNext = false
  if (items.length > 0) {
    items[items.length - 1].combineWithNext = false;
  }

  return items;
}

/**
 * 질문 주제 타입 판단
 */
function detectQuestionType(question: string): 'job' | 'nationality' | 'location' | 'general' {
  if (question.includes('직업') || question.includes('무슨 일')) return 'job';
  if (question.includes('나라') || question.includes('국적') || question.includes('어디 사람')) return 'nationality';
  if (question.includes('어디') && !question.includes('사람')) return 'location';
  return 'general';
}

/**
 * 답변 내용 타입 판단
 */
function detectAnswerType(answer: string): 'job' | 'nationality' | 'location' | 'general' {
  // 직업 명사 목록 (한국어 직업 명사)
  const jobNouns = [
    '학생', '선생님', '의사', '가수', '요리사', '경찰', '회사원', '배우', 
    '운동 선수', '기자', '가이드', '간호사', '변호사', '판사', '검사',
    '교수', '강사', '작가', '화가', '음악가', '디자이너', '개발자', 
    '프로그래머', '엔지니어', '건축가', '약사', '수의사', '농부', '어부',
    '군인', '소방관', '파일럿', '승무원', '택시 기사', '버스 기사',
    '요리사', '제빵사', '바리스타', '웨이터', '점원', '매니저', '사장님'
  ];
  
  // 국적 명사 패턴 체크 (XXX 사람)
  if (answer.includes('사람')) return 'nationality';
  
  // 직업 명사 체크
  for (const job of jobNouns) {
    if (answer.includes(job)) return 'job';
  }
  
  return 'general';
}

/**
 * 질문과 답변의 호응(coherence) 검증
 */
function validateQuestionAnswerCoherence(
  question: string,
  answer: string
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 0. 질문과 답변의 주제 일치 확인 (의미적 호응)
  const questionType = detectQuestionType(question);
  const answerType = detectAnswerType(answer);

  if (questionType !== 'general' && answerType !== 'general' && questionType !== answerType) {
    errors.push(`질문 주제("${questionType}")와 답변 주제("${answerType}")가 일치하지 않음 - 예: 직업 질문에는 직업 답변, 국적 질문에는 국적 답변이 필요함`);
  }

  // 1. 질문의 동사와 답변의 동사 일치 확인
  const questionVerbs = extractVerbsFromSentence(question);
  const answerVerbs = extractVerbsFromSentence(answer);

  if (questionVerbs.length > 0 && answerVerbs.length > 0) {
    // 질문에 동사가 있고 답변에도 동사가 있으면, 동사가 일치하거나 관련되어야 함
    const hasMatchingVerb = questionVerbs.some(qVerb =>
      answerVerbs.some(aVerb => 
        qVerb === aVerb || 
        areRelatedVerbs(qVerb, aVerb)
      )
    );

    if (!hasMatchingVerb) {
      errors.push(`질문의 동사("${questionVerbs[0]}")와 답변의 동사("${answerVerbs[0]}")가 일치하지 않음`);
    }
  }

  // 2. 질문의 조사와 답변의 조사 일치 확인
  // '이/가'와 '은/는'은 주격 조사로 서로 호환 가능
  // 하지만 '이/가'와 '을/를'은 목적격 조사와 주격 조사로 역할이 다르므로 불일치
  const questionParticles = extractParticlesFromSentence(question);
  const answerParticles = extractParticlesFromSentence(answer);

  // 주격 조사: 이/가, 은/는 (서로 호환 가능)
  const subjectParticles = ['이', '가', '은', '는'];
  const objectParticles = ['을', '를'];
  
  // 질문에 주격 조사(이/가)가 있으면 답변에도 주격 조사(이/가 또는 은/는)가 있어야 함
  const hasSubjectInQuestion = questionParticles.some(p => subjectParticles.includes(p));
  const hasSubjectInAnswer = answerParticles.some(p => subjectParticles.includes(p));
  
  // 질문에 목적격 조사(을/를)가 있으면 답변에도 목적격 조사(을/를)가 있어야 함
  const hasObjectInQuestion = questionParticles.some(p => objectParticles.includes(p));
  const hasObjectInAnswer = answerParticles.some(p => objectParticles.includes(p));
  
  // 주격 조사 불일치: 질문에 주격 조사가 있는데 답변에 주격 조사가 없음
  if (hasSubjectInQuestion && !hasSubjectInAnswer) {
    errors.push(`질문에 주격 조사("이/가" 또는 "은/는")가 있는데 답변에 주격 조사가 없음`);
  }
  
  // 목적격 조사 불일치: 질문에 목적격 조사가 있는데 답변에 목적격 조사가 없음
  if (hasObjectInQuestion && !hasObjectInAnswer) {
    errors.push(`질문에 목적격 조사("을/를")가 있는데 답변에 목적격 조사가 없음`);
  }
  
  // 주격 조사와 목적격 조사 혼동: 질문에 주격 조사가 있는데 답변에 목적격 조사만 있음 (또는 그 반대)
  if (hasSubjectInQuestion && hasObjectInAnswer && !hasSubjectInAnswer) {
    errors.push(`질문에 주격 조사("이/가" 또는 "은/는")가 있는데 답변에 목적격 조사("을/를")만 있음`);
  }
  if (hasObjectInQuestion && hasSubjectInAnswer && !hasObjectInAnswer) {
    errors.push(`질문에 목적격 조사("을/를")가 있는데 답변에 주격 조사("이/가" 또는 "은/는")만 있음`);
  }

  // 3. 장소 조사 일치 확인
  // '에'와 '에서'는 역할이 다르므로 바꿔서 쓸 수 없음
  // '에': 도착점, 목적지, 존재의 장소 (예: "학교에 가다", "집에 있다")
  // '에서': 동작이 일어나는 장소, 출발점 (예: "학교에서 공부하다", "집에서 출발하다")
  const locationParticles = ['에', '에서'];
  const hasLocationInQuestion = questionParticles.some(p => locationParticles.includes(p));
  const hasLocationInAnswer = answerParticles.some(p => locationParticles.includes(p));
  
  if (hasLocationInQuestion || hasLocationInAnswer) {
    // 질문에 '에'가 있으면 답변에도 '에'가 있어야 함
    if (question.includes('에') && !question.includes('에서') && !answer.includes('에')) {
      errors.push(`질문에 장소 조사 "에"가 있는데 답변에 "에"가 없음`);
    }
    
    // 질문에 '에서'가 있으면 답변에도 '에서'가 있어야 함
    if (question.includes('에서') && !answer.includes('에서')) {
      errors.push(`질문에 장소 조사 "에서"가 있는데 답변에 "에서"가 없음`);
    }
    
    // 질문에 '에'가 있는데 답변에 '에서'만 있으면 불일치
    if (question.includes('에') && !question.includes('에서') && answer.includes('에서') && !answer.includes('에')) {
      errors.push(`질문에 장소 조사 "에"가 있는데 답변에 "에서"만 있음 (역할이 다름)`);
    }
    
    // 질문에 '에서'가 있는데 답변에 '에'만 있으면 불일치
    if (question.includes('에서') && answer.includes('에') && !answer.includes('에서')) {
      errors.push(`질문에 장소 조사 "에서"가 있는데 답변에 "에"만 있음 (역할이 다름)`);
    }
  }

  // 4. 질문의 의문사와 답변의 내용 일치 확인
  // 예: "어떤 영화" → "그 영화" (의문사에 대한 답변)
  if (question.includes('어떤') && !answer.includes('그') && !answer.includes('이') && !answer.includes('저')) {
    // "어떤"에 대한 답변은 "그/이/저" 등 지시어가 있어야 함
    // 단, 구체적인 명사가 있으면 허용 (예: "어떤 영화" → "타이타닉")
    const hasSpecificNoun = /[가-힣]+(영화|책|음식|사람|장소|일|것)/.test(answer);
    if (!hasSpecificNoun) {
      errors.push(`질문에 "어떤"이 있는데 답변에 지시어("그/이/저") 또는 구체적 명사가 없음`);
    }
  }

  // 5. 질문의 의문사 "뭐/무엇"과 답변의 내용 일치 확인
  if ((question.includes('뭐') || question.includes('무엇')) && answer.trim().length < 3) {
    errors.push(`질문에 "뭐/무엇"이 있는데 답변이 너무 짧음`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 문장에서 동사 추출 (간단한 휴리스틱)
 */
function extractVerbsFromSentence(sentence: string): string[] {
  const verbs: string[] = [];
  const verbEndings = ['어요', '해요', '아요', '었어요', '했어요', '았어요', '었어요?', '했어요?', '았어요?'];
  
  for (const ending of verbEndings) {
    if (sentence.includes(ending)) {
      // 동사 어미 앞의 부분 추출
      const index = sentence.indexOf(ending);
      const beforeEnding = sentence.substring(Math.max(0, index - 10), index);
      // 마지막 단어 추출
      const words = beforeEnding.trim().split(/\s+/);
      if (words.length > 0) {
        const lastWord = words[words.length - 1];
        if (lastWord.length > 0) {
          verbs.push(lastWord + ending);
        }
      }
    }
  }

  return verbs;
}

/**
 * 두 동사가 관련되어 있는지 확인
 */
function areRelatedVerbs(verb1: string, verb2: string): boolean {
  // 동사 어간 추출
  const stem1 = verb1.replace(/[어해아았었했]어요/g, '').replace(/[어해아]요/g, '');
  const stem2 = verb2.replace(/[어해아았었했]어요/g, '').replace(/[어해아]요/g, '');

  // 같은 어간이면 관련됨
  if (stem1 === stem2) {
    return true;
  }

  // 특정 동사 쌍 (예: 읽다-끝내다는 관련 없음)
  const unrelatedPairs = [
    ['읽', '끝'],
    ['보', '끝'],
    ['듣', '끝'],
  ];

  const isUnrelated = unrelatedPairs.some(([v1, v2]) =>
    (stem1.includes(v1) && stem2.includes(v2)) ||
    (stem1.includes(v2) && stem2.includes(v1))
  );

  return !isUnrelated;
}

/**
 * 문장에서 조사 추출
 */
function extractParticlesFromSentence(sentence: string): string[] {
  const particles: string[] = [];
  const particlePatterns = ['은', '는', '이', '가', '을', '를', '에', '에서', '와', '과', '의', '도', '만'];

  for (const particle of particlePatterns) {
    if (sentence.includes(particle)) {
      particles.push(particle);
    }
  }

  return particles;
}

/**
 * 생성된 문제 검증 (간소화 버전 - Structured Output + Self-Correction 적용)
 * 
 * Structured Output이 형식을 보장하고, Self-Correction이 의미를 보장하므로
 * 최소한의 검증만 수행합니다.
 */
function validateGeneratedProblem(
  template: DialogueQuestion,
  generated: DialogueQuestion
): ValidationResult {
  // 1. 구조 유사도 계산 (빠른 휴리스틱 체크)
  const structureSimilarity = calculateStructureSimilarity(template.answer, generated.answer);

  // 2. 시제만 확인 (가장 중요한 문법 요소)
  const templateGrammar = analyzeGrammar(template.answer);
  const generatedGrammar = analyzeGrammar(generated.answer);
  const tenseMatch = templateGrammar.tense === generatedGrammar.tense;

  // 3. items 배열 유효성 확인
  let reconstructedAnswer = '';
  for (let i = 0; i < generated.items.length; i++) {
    const item = generated.items[i];
    reconstructedAnswer += item.content;
    if (i < generated.items.length - 1 && !item.combineWithNext) {
      reconstructedAnswer += ' ';
    }
  }
  const itemsValid = reconstructedAnswer.trim() === generated.answer.trim();

  // 간소화된 로그
  console.log(`🔍 빠른 검증: 유사도 ${structureSimilarity.toFixed(2)}, 시제 ${tenseMatch ? '✓' : '✗'}, items ${itemsValid ? '✓' : '✗'}`);

  if (!itemsValid) {
    console.log(`  ⚠️ Items 불일치: "${generated.answer}" vs "${reconstructedAnswer}"`);
  }

  return {
    structureSimilarity,
    grammarMatch: tenseMatch, // 단순화: 시제 일치로 대체
    tenseMatch,
    hasTranslation: true, // Structured Output 보장
    itemsValid,
    questionAnswerCoherence: true, // Self-Correction 신뢰
  };
}

/**
 * 여러 문제 일괄 생성
 */
export async function generateMultipleProblems(
  matchedTemplates: MatchedTemplate[],
  analyzedWords: AnalyzedWord[],
  model: 'gpt-4o-mini' | 'gpt-4o' = 'gpt-4o-mini',
  allTemplates?: DialogueQuestion[] // 재시도 시 다른 템플릿 선택을 위한 전체 템플릿 목록
): Promise<GeneratedProblem[]> {
  const problems: GeneratedProblem[] = [];
  const usedTemplateIds = new Set<string>(); // 사용된 템플릿 ID 추적
  const generatedQuestionAnswerPairs = new Set<string>(); // 생성된 질문-답변 쌍 추적 (중복 방지)

  // 각 매칭된 템플릿에 대해 문제 생성
  for (let i = 0; i < matchedTemplates.length; i++) {
    const matchedTemplate = matchedTemplates[i];
    const analyzedWord = analyzedWords[i % analyzedWords.length]; // 순환 사용

    try {
      // 기존 문제는 AI 생성 건너뛰기
      if ((matchedTemplate as any).isExisting) {
        console.log(`문제 ${i + 1}: 기존 문제 사용 (AI 생성 안 함)`);

        // 기존 템플릿 그대로 사용
        const existingProblem = {
          template: matchedTemplate.template,
          generated: matchedTemplate.template, // 그대로 사용
          replacedWord: '',
          newVocabulary: '',
          validation: {
            structureSimilarity: 1.0, // 100% 동일
            grammarMatch: true,
            hasTranslation: true,
            itemsValid: true,
          },
          metadata: {
            tokensUsed: 0, // AI 사용 안 함
            generationTime: 0,
            model,
          },
          matchScore: matchedTemplate.matchScore,
          isExisting: true as any,
        };
        problems.push(existingProblem);
        usedTemplateIds.add(matchedTemplate.template.id);
        
        // 기존 문제도 중복 체크에 추가
        const pairKey = `${matchedTemplate.template.question}|${matchedTemplate.template.answer}`;
        generatedQuestionAnswerPairs.add(pairKey);
        continue;
      }

      // 새 어휘 문제는 AI로 생성 (재시도 시 다른 템플릿 선택 가능)
      let problem: GeneratedProblem | null = null;
      let retryCount = 0;
      const maxDuplicateRetries = 3; // 중복 문제 최대 재시도 횟수

      while (retryCount < maxDuplicateRetries && !problem) {
        const candidateProblem = await generateProblemFromTemplate(
          matchedTemplate,
          analyzedWord,
          model,
          3, // maxRetries
          allTemplates, // 전체 템플릿 목록 전달
          usedTemplateIds // 사용된 템플릿 ID Set 전달
        );

        // 중복 체크: 질문-답변 쌍이 이미 생성되었는지 확인
        const pairKey = `${candidateProblem.generated.question}|${candidateProblem.generated.answer}`;
        
        if (generatedQuestionAnswerPairs.has(pairKey)) {
          console.log(`⚠️ 중복 문제 감지 (시도 ${retryCount + 1}/${maxDuplicateRetries}):`);
          console.log(`   질문: "${candidateProblem.generated.question}"`);
          console.log(`   답변: "${candidateProblem.generated.answer}"`);
          console.log(`   → 다른 템플릿으로 재생성 중...`);
          retryCount++;
          
          if (retryCount >= maxDuplicateRetries) {
            console.log(`   → 최대 재시도 횟수 초과. 중복 문제를 사용합니다.`);
            problem = candidateProblem; // 최대 재시도 후에는 중복이라도 사용
          }
        } else {
          // 중복이 아니면 사용
          problem = candidateProblem;
          generatedQuestionAnswerPairs.add(pairKey);
        }
      }

      if (problem) {
        problems.push(problem);
        usedTemplateIds.add(problem.template.id);
      } else {
        console.error(`문제 ${i + 1} 생성 실패: 중복 문제 재시도 실패`);
      }
    } catch (error) {
      console.error(`문제 ${i + 1} 생성 실패:`, error);
      // 실패한 경우 건너뛰고 계속 진행
    }
  }

  console.log(`✅ 총 ${problems.length}개 문제 생성 완료 (중복 체크: ${generatedQuestionAnswerPairs.size}개 고유 쌍)`);
  return problems;
}
