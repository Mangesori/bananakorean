/**
 * 퀴즈 데이터 처리를 위한 헬퍼 함수들
 */

import { topicMeta, TopicId } from '@/data/quiz/topics/meta';
import { DialogueQuestion, MultipleChoiceQuestion, FillInTheBlankQuestion, Item } from '@/types/quiz';

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

/**
 * Items를 combineWithNext 플래그 기반으로 그룹화
 *
 * @example
 * ```typescript
 * const items = [
 *   { id: '1', content: '저', combineWithNext: true },
 *   { id: '2', content: '는', combineWithNext: false },
 *   { id: '3', content: '헬스장', combineWithNext: true },
 *   { id: '4', content: '에서', combineWithNext: false },
 *   { id: '5', content: '운동해요.' }
 * ];
 * const groups = groupItemsByFlag(items);
 * // Result: [
 * //   [{ id: '1', content: '저', ... }, { id: '2', content: '는', ... }],
 * //   [{ id: '3', content: '헬스장', ... }, { id: '4', content: '에서', ... }],
 * //   [{ id: '5', content: '운동해요.', ... }]
 * // ]
 * ```
 *
 * @param items 그룹화할 아이템 배열
 * @returns 그룹화된 아이템 배열의 배열
 */
export function groupItemsByFlag(items: Item[]): Item[][] {
  const groups: Item[][] = [];
  let currentGroup: Item[] = [];

  items.forEach((item, index) => {
    currentGroup.push(item);

    // combineWithNext가 false이거나 마지막 아이템이면 그룹 종료
    if (!item.combineWithNext || index === items.length - 1) {
      groups.push([...currentGroup]);
      currentGroup = [];
    }
  });

  return groups;
}
