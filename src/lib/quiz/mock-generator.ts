/**
 * 모의 데이터 생성기
 * AI 연동 전까지 테스트용으로 기존 템플릿에서 랜덤으로 문제 선택
 */

import { TopicId } from '@/data/quiz/topics/meta';
import { DialogueQuestion } from '@/types/quiz';
import { QuizGenerationRequest, QuizGenerationResponse } from '@/types/custom-quiz';

// 기존 데이터 import
import { introductionQuestions } from '@/data/quiz/DialogueDragAndDrop/introduction';
import { demonstrativeQuestions } from '@/data/quiz/DialogueDragAndDrop/demonstratives';
import { negationQuestions } from '@/data/quiz/DialogueDragAndDrop/negation';
import { locationQuestions } from '@/data/quiz/DialogueDragAndDrop/locations';
import { existenceQuestions } from '@/data/quiz/DialogueDragAndDrop/existence';
import { basicVerbQuestions } from '@/data/quiz/DialogueDragAndDrop/basic-verbs';
import { negativeSentenceQuestions } from '@/data/quiz/DialogueDragAndDrop/negative-sentences';
import { movementQuestions } from '@/data/quiz/DialogueDragAndDrop/movement';
import { locationActionQuestions } from '@/data/quiz/DialogueDragAndDrop/location-actions';
import { pastTenseQuestions } from '@/data/quiz/DialogueDragAndDrop/past-tense';
import { timeExpressionQuestions } from '@/data/quiz/DialogueDragAndDrop/time-expressions';
import { durationQuestions } from '@/data/quiz/DialogueDragAndDrop/duration';
import { positionQuestions } from '@/data/quiz/DialogueDragAndDrop/positions';
import { purposeQuestions } from '@/data/quiz/DialogueDragAndDrop/purpose';
import { commandQuestions } from '@/data/quiz/DialogueDragAndDrop/commands';
import { startEndQuestions } from '@/data/quiz/DialogueDragAndDrop/start-end';
import { directionMethodQuestions } from '@/data/quiz/DialogueDragAndDrop/direction-method';
import { desireQuestions } from '@/data/quiz/DialogueDragAndDrop/desires';
import { futureQuestions } from '@/data/quiz/DialogueDragAndDrop/future';
import { abilityQuestions } from '@/data/quiz/DialogueDragAndDrop/ability';
import { obligationQuestions } from '@/data/quiz/DialogueDragAndDrop/obligation';
import { skillQuestions } from '@/data/quiz/DialogueDragAndDrop/skills';
import { adjectiveQuestions } from '@/data/quiz/DialogueDragAndDrop/adjectives';
import { progressiveQuestions } from '@/data/quiz/DialogueDragAndDrop/progressive';
import { reasonQuestions } from '@/data/quiz/DialogueDragAndDrop/reasons';
import { contrastQuestions } from '@/data/quiz/DialogueDragAndDrop/contrast';
import { causeQuestions } from '@/data/quiz/DialogueDragAndDrop/cause';
import { conditionQuestions } from '@/data/quiz/DialogueDragAndDrop/conditions';
import { timeRelationQuestions } from '@/data/quiz/DialogueDragAndDrop/time-relations';
import { sequenceQuestions } from '@/data/quiz/DialogueDragAndDrop/sequence';

/**
 * 문법 주제별 질문 매핑
 */
const questionsByTopic: Record<TopicId, DialogueQuestion[]> = {
  introduction: introductionQuestions,
  demonstratives: demonstrativeQuestions,
  negation: negationQuestions,
  locations: locationQuestions,
  existence: existenceQuestions,
  'basic-verbs': basicVerbQuestions,
  'negative-sentences': negativeSentenceQuestions,
  movement: movementQuestions,
  'location-actions': locationActionQuestions,
  'past-tense': pastTenseQuestions,
  'time-expressions': timeExpressionQuestions,
  duration: durationQuestions,
  positions: positionQuestions,
  purpose: purposeQuestions,
  commands: commandQuestions,
  'start-end': startEndQuestions,
  'direction-method': directionMethodQuestions,
  desires: desireQuestions,
  future: futureQuestions,
  ability: abilityQuestions,
  obligation: obligationQuestions,
  skills: skillQuestions,
  adjectives: adjectiveQuestions,
  progressive: progressiveQuestions,
  reasons: reasonQuestions,
  contrast: contrastQuestions,
  cause: causeQuestions,
  conditions: conditionQuestions,
  'time-relations': timeRelationQuestions,
  sequence: sequenceQuestions,
};

/**
 * 배열을 섞는 유틸리티 함수
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
 * 특정 문법 주제들에서 랜덤으로 질문 선택
 */
export function getRandomQuestionsFromTopics(
  topics: TopicId[],
  count: number
): DialogueQuestion[] {
  // 선택된 주제의 모든 질문 수집
  const allQuestions: DialogueQuestion[] = [];

  for (const topic of topics) {
    const questions = questionsByTopic[topic];
    if (questions) {
      allQuestions.push(...questions);
    }
  }

  if (allQuestions.length === 0) {
    return [];
  }

  // 섞은 후 요청된 개수만큼 반환
  const shuffled = shuffleArray(allQuestions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * 모의 퀴즈 생성 (AI 연동 전 테스트용)
 */
export async function generateMockQuiz(
  request: QuizGenerationRequest
): Promise<QuizGenerationResponse> {
  try {
    // 약간의 지연을 주어 실제 API 호출 느낌
    await new Promise(resolve => setTimeout(resolve, 500));

    const questions = getRandomQuestionsFromTopics(
      request.grammarTopics,
      request.count
    );

    if (questions.length === 0) {
      return {
        success: false,
        questions: [],
        metadata: {
          totalRequested: request.count,
          totalGenerated: 0,
          failedCount: request.count,
          templateUsed: 0,
          fromScratchUsed: 0,
        },
        error: '선택한 문법 주제에 해당하는 문제가 없습니다.',
      };
    }

    // 고유 ID 부여 (중복 방지)
    const uniqueQuestions = questions.map((q, index) => ({
      ...q,
      id: Date.now() + index,
    }));

    return {
      success: true,
      questions: uniqueQuestions,
      metadata: {
        totalRequested: request.count,
        totalGenerated: uniqueQuestions.length,
        failedCount: request.count - uniqueQuestions.length,
        templateUsed: 0,
        fromScratchUsed: 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      questions: [],
      metadata: {
        totalRequested: request.count,
        totalGenerated: 0,
        failedCount: request.count,
        templateUsed: 0,
        fromScratchUsed: 0,
      },
      error: '문제 생성 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 단일 문제 재생성 (AI 연동 전 테스트용)
 */
export async function regenerateSingleQuestion(
  topics: TopicId[],
  excludeIds: number[]
): Promise<DialogueQuestion | null> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const allQuestions: DialogueQuestion[] = [];

  for (const topic of topics) {
    const questions = questionsByTopic[topic];
    if (questions) {
      allQuestions.push(...questions);
    }
  }

  // 이미 사용된 ID 제외
  const availableQuestions = allQuestions.filter(
    q => !excludeIds.includes(q.id)
  );

  if (availableQuestions.length === 0) {
    // 제외할 질문이 없으면 전체에서 선택
    const shuffled = shuffleArray(allQuestions);
    return shuffled[0] ? { ...shuffled[0], id: Date.now() } : null;
  }

  const shuffled = shuffleArray(availableQuestions);
  return shuffled[0] ? { ...shuffled[0], id: Date.now() } : null;
}


