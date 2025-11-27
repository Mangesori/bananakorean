import { GeneratedProblem } from '@/types/ai-test';
import { DialogueQuestion, MultipleChoiceQuestion } from '@/types/quiz';
import { generateJSON } from './client';

/**
 * AI 생성 문제를 DialogueQuestion 형식으로 변환
 * Drag & Drop 퀴즈에서 사용
 */
export function convertToDialogueQuestion(
  generatedProblem: GeneratedProblem
): DialogueQuestion {
  return {
    ...generatedProblem.generated,
    // items 배열이 이미 quiz-generator.ts에서 생성됨
  };
}

/**
 * AI 생성 문제를 MultipleChoiceQuestion 형식으로 변환
 * 오답 선택지를 AI로 생성
 */
export async function convertToMultipleChoice(
  generatedProblem: GeneratedProblem,
  model: 'gpt-4o-mini' | 'gpt-4o' = 'gpt-4o-mini'
): Promise<MultipleChoiceQuestion> {
  const generated = generatedProblem.generated;

  // AI로 오답 3개 생성
  const distractors = await generateDistractors(
    generated.question,
    generated.answer,
    generated.grammarName || '문법',
    model
  );

  // 정답 + 오답 섞기
  const options = shuffleArray([generated.answer, ...distractors]);

  return {
    id: generated.id,
    question: generated.question,
    questionTranslation: generated.questionTranslation,
    answerTranslation: generated.answerTranslation,
    options,
    correctAnswer: generated.answer,
    grammarName: generated.grammarName,
    mode: generated.mode,
    questionPrefix: generated.questionPrefix,
    questionSuffix: generated.questionSuffix,
    answerPrefix: generated.answerPrefix,
    answerSuffix: generated.answerSuffix,
  };
}

/**
 * AI로 그럴듯한 오답 3개 생성
 */
async function generateDistractors(
  question: string,
  correctAnswer: string,
  grammarName: string,
  model: 'gpt-4o-mini' | 'gpt-4o'
): Promise<string[]> {
  const prompt = `다음 한국어 문법 문제에 대한 그럴듯한 오답 3개를 생성해주세요.

문법 주제: ${grammarName}
질문: ${question}
정답: ${correctAnswer}

요구사항:
1. 오답은 문법적으로 틀리지만 학습자가 실수할 수 있는 그럴듯한 답이어야 합니다
2. 정답과 비슷한 길이와 구조를 가져야 합니다
3. 정답과 명확히 구분되어야 합니다
4. 한국어 문법 규칙을 고려하여 흔한 실수를 반영해야 합니다

JSON 형식으로만 응답하세요:
{
  "distractors": ["오답1", "오답2", "오답3"]
}`;

  try {
    const response = await generateJSON<{ distractors: string[] }>(
      prompt,
      undefined,
      model
    );

    if (!response.distractors || response.distractors.length !== 3) {
      throw new Error('Invalid distractor generation response');
    }

    return response.distractors;
  } catch (error) {
    console.error('Error generating distractors:', error);
    // 폴백: 간단한 변형 생성
    return generateFallbackDistractors(correctAnswer);
  }
}

/**
 * AI 실패 시 폴백 오답 생성
 */
function generateFallbackDistractors(correctAnswer: string): string[] {
  // 간단한 변형으로 오답 생성
  const distractors: string[] = [];

  // 변형 1: 조사 변경
  if (correctAnswer.includes('을')) {
    distractors.push(correctAnswer.replace('을', '를'));
  } else if (correctAnswer.includes('를')) {
    distractors.push(correctAnswer.replace('를', '을'));
  } else {
    distractors.push(correctAnswer + '요');
  }

  // 변형 2: 어미 변경
  if (correctAnswer.endsWith('다')) {
    distractors.push(correctAnswer.slice(0, -1) + '요');
  } else if (correctAnswer.endsWith('요')) {
    distractors.push(correctAnswer.slice(0, -1) + '다');
  } else {
    distractors.push(correctAnswer + '다');
  }

  // 변형 3: 단순 변형
  distractors.push(correctAnswer + ' (틀림)');

  return distractors.slice(0, 3);
}

/**
 * 배열을 랜덤하게 섞기 (Fisher-Yates 알고리즘)
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
 * 여러 문제를 한번에 변환 (병렬 처리)
 */
export async function convertMultipleToDialogue(
  generatedProblems: GeneratedProblem[]
): Promise<DialogueQuestion[]> {
  return generatedProblems.map(convertToDialogueQuestion);
}

/**
 * 여러 문제를 한번에 Multiple Choice로 변환 (병렬 처리)
 */
export async function convertMultipleToMultipleChoice(
  generatedProblems: GeneratedProblem[],
  model: 'gpt-4o-mini' | 'gpt-4o' = 'gpt-4o-mini'
): Promise<MultipleChoiceQuestion[]> {
  return Promise.all(
    generatedProblems.map(p => convertToMultipleChoice(p, model))
  );
}
