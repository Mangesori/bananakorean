/**
 * 퀴즈 데이터 처리를 위한 헬퍼 함수들
 */

import { topicMeta, TopicId } from '@/data/quiz/topics/meta';
import { DialogueQuestion, MultipleChoiceQuestion, FillInTheBlankQuestion } from '@/types/quiz';

/**
 * questions 배열에 topicId에 해당하는 grammarName을 자동으로 추가
 *
 * @example
 * ```typescript
 * const questions = [{ id: 1, question: '...' }, ...];
 * export const basicVerbQuestions = addGrammarName(questions, 'basic-verbs');
 * ```
 *
 * @param questions grammarName이 없는 문제 배열
 * @param topicId topic ID (예: 'basic-verbs', 'introduction')
 * @returns grammarName이 추가된 문제 배열
 */
export function addGrammarName<
  T extends Partial<DialogueQuestion | MultipleChoiceQuestion | FillInTheBlankQuestion>,
>(questions: T[], topicId: TopicId): (T & { grammarName: string })[] {
  const grammarName = topicMeta[topicId]?.title;

  if (!grammarName) {
    console.warn(`⚠️ No grammar name found for topic: ${topicId}`);
    return questions.map(q => ({ ...q, grammarName: 'Unknown' }));
  }

  return questions.map(q => ({
    ...q,
    grammarName,
  }));
}

/**
 * 여러 토픽의 questions를 병합하면서 각각의 grammarName을 추가
 *
 * @param topicQuestions [{ topicId, questions }] 형태의 배열
 * @returns 모든 questions를 병합하고 grammarName이 추가된 배열
 */
export function mergeQuestionsWithGrammar<
  T extends Partial<DialogueQuestion | MultipleChoiceQuestion | FillInTheBlankQuestion>,
>(topicQuestions: Array<{ topicId: TopicId; questions: T[] }>): (T & { grammarName: string })[] {
  return topicQuestions.flatMap(({ topicId, questions }) => addGrammarName(questions, topicId));
}

/**
 * topicId로부터 grammarName을 가져오는 헬퍼 함수
 *
 * @param topicId topic ID
 * @returns grammarName (없으면 'Unknown')
 */
export function getGrammarName(topicId: TopicId): string {
  return topicMeta[topicId]?.title || 'Unknown';
}
