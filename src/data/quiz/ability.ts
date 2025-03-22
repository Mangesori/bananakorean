import { KoreanQuestion } from '@/types/quiz';

export const abilityQuestions: KoreanQuestion[] = [
  {
    id: 1,
    baseText: '한국어를 할 수 있어요.',
    translation: 'I can speak Korean.',
    hints: [
      { content: 'I', hint: '저/나' },
      { content: 'can', hint: 'ㄹ 수 있다' },
      { content: 'speak', hint: '말하다' },
      { content: 'Korean', hint: '한국어' },
    ],
    items: [
      { id: '1', content: '한국어', combineWithNext: true },
      { id: '2', content: '를', combineWithNext: false },
      { id: '3', content: '할', combineWithNext: false },
      { id: '4', content: '수', combineWithNext: false },
      { id: '5', content: '있어요.' },
    ],
  },
  {
    id: 2,
    baseText: '수영을 할 수 없어요.',
    translation: 'I cannot swim.',
    hints: [
      { content: 'I', hint: '저/나' },
      { content: 'cannot', hint: 'ㄹ 수 없다' },
      { content: 'swim', hint: '수영하다' },
    ],
    items: [
      { id: '1', content: '수영', combineWithNext: true },
      { id: '2', content: '을', combineWithNext: false },
      { id: '3', content: '할', combineWithNext: false },
      { id: '4', content: '수', combineWithNext: false },
      { id: '5', content: '없어요.' },
    ],
  },
  {
    id: 3,
    baseText: '피아노를 칠 수 있어요.',
    translation: 'I can play the piano.',
    hints: [
      { content: 'I', hint: '저/나' },
      { content: 'can', hint: 'ㄹ 수 있다' },
      { content: 'play', hint: '치다' },
      { content: 'the', hint: '' },
      { content: 'piano', hint: '피아노' },
    ],
    items: [
      { id: '1', content: '피아노', combineWithNext: true },
      { id: '2', content: '를', combineWithNext: false },
      { id: '3', content: '칠', combineWithNext: false },
      { id: '4', content: '수', combineWithNext: false },
      { id: '5', content: '있어요.' },
    ],
  },
  {
    id: 4,
    baseText: '한국 음식을 만들 수 있어요.',
    translation: 'I can make Korean food.',
    hints: [
      { content: 'I', hint: '저/나' },
      { content: 'can', hint: 'ㄹ 수 있다' },
      { content: 'make', hint: '만들다' },
      { content: 'Korean', hint: '한국' },
      { content: 'food', hint: '음식' },
    ],
    items: [
      { id: '1', content: '한국', combineWithNext: false },
      { id: '2', content: '음식', combineWithNext: true },
      { id: '3', content: '을', combineWithNext: false },
      { id: '4', content: '만들', combineWithNext: false },
      { id: '5', content: '수', combineWithNext: false },
      { id: '6', content: '있어요.' },
    ],
  },
  {
    id: 5,
    baseText: '지금 갈 수 없어요.',
    translation: 'I cannot go now.',
    hints: [
      { content: 'I', hint: '저/나' },
      { content: 'cannot', hint: 'ㄹ 수 없다' },
      { content: 'go', hint: '가다' },
      { content: 'now', hint: '지금' },
    ],
    items: [
      { id: '1', content: '지금', combineWithNext: false },
      { id: '2', content: '갈', combineWithNext: false },
      { id: '3', content: '수', combineWithNext: false },
      { id: '4', content: '없어요.' },
    ],
  },
];
