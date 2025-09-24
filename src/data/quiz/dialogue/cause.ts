import { DialogueQuestion } from '@/types/quiz';

export const causeQuestions: DialogueQuestion[] = [
  {
    id: 1,
    baseText: '비가 오니까 우산을 가져가세요.',
    translation: "Since it's raining, take an umbrella.",
    hints: [
      { content: 'since', hint: '으니까' },
      { content: 'rain comes', hint: '비가 오다' },
      { content: 'take', hint: '가져가다' },
      { content: 'umbrella', hint: '우산' },
    ],
    items: [
      { id: '1', content: '비', combineWithNext: true },
      { id: '2', content: '가', combineWithNext: false },
      { id: '3', content: '오', combineWithNext: true },
      { id: '4', content: '니까', combineWithNext: false },
      { id: '5', content: '우산', combineWithNext: true },
      { id: '6', content: '을', combineWithNext: false },
      { id: '7', content: '가져가세요' },
    ],
  },
  {
    id: 2,
    baseText: '늦었으니까 택시를 탈게요.',
    translation: "Since I'm late, I'll take a taxi.",
    hints: [
      { content: 'since', hint: '으니까' },
      { content: 'late', hint: '늦다' },
      { content: 'will take', hint: '타다' },
      { content: 'taxi', hint: '택시' },
    ],
    items: [
      { id: '1', content: '늦었', combineWithNext: true },
      { id: '2', content: '으니까', combineWithNext: false },
      { id: '3', content: '택시', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '탈게요' },
    ],
  },
  {
    id: 3,
    baseText: '배가 아프니까 약을 먹어요.',
    translation: 'Since my stomach hurts, I take medicine.',
    hints: [
      { content: 'since', hint: '으니까' },
      { content: 'stomach hurts', hint: '배가 아프다' },
      { content: 'take', hint: '먹다' },
      { content: 'medicine', hint: '약' },
    ],
    items: [
      { id: '1', content: '배', combineWithNext: true },
      { id: '2', content: '가', combineWithNext: false },
      { id: '3', content: '아프', combineWithNext: true },
      { id: '4', content: '니까', combineWithNext: false },
      { id: '5', content: '약', combineWithNext: true },
      { id: '6', content: '을', combineWithNext: false },
      { id: '7', content: '먹어요' },
    ],
  },
  {
    id: 4,
    baseText: '추우니까 창문을 닫아요.',
    translation: "Since it's cold, I close the window.",
    hints: [
      { content: 'since', hint: '으니까' },
      { content: 'cold', hint: '춥다' },
      { content: 'close', hint: '닫다' },
      { content: 'window', hint: '창문' },
    ],
    items: [
      { id: '1', content: '추우', combineWithNext: true },
      { id: '2', content: '니까', combineWithNext: false },
      { id: '3', content: '창문', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '닫아요' },
    ],
  },
  {
    id: 5,
    baseText: '피곤하니까 일찍 자요.',
    translation: "Since I'm tired, I go to bed early.",
    hints: [
      { content: 'since', hint: '으니까' },
      { content: 'tired', hint: '피곤하다' },
      { content: 'go to bed', hint: '자다' },
      { content: 'early', hint: '일찍' },
    ],
    items: [
      { id: '1', content: '피곤하', combineWithNext: true },
      { id: '2', content: '니까', combineWithNext: false },
      { id: '3', content: '일찍', combineWithNext: false },
      { id: '4', content: '자요' },
    ],
  },
];
