import { DialogueQuestion } from '@/types/quiz';

export const adjectiveQuestions: DialogueQuestion[] = [
  {
    id: 1,
    baseText: '작은 가방을 샀어요.',
    translation: 'I bought a small bag.',
    hints: [
      { content: 'I', hint: '저/나' },
      { content: 'bought', hint: '샀다' },
      { content: 'a', hint: '' },
      { content: 'small', hint: '작다' },
      { content: 'bag', hint: '가방' },
    ],
    items: [
      { id: '1', content: '작은', combineWithNext: false },
      { id: '2', content: '가방', combineWithNext: true },
      { id: '3', content: '을', combineWithNext: false },
      { id: '4', content: '샀어요.' },
    ],
  },
  {
    id: 2,
    baseText: '긴 머리가 예뻐요.',
    translation: 'Long hair is pretty.',
    hints: [
      { content: 'long', hint: '길다' },
      { content: 'hair', hint: '머리' },
      { content: 'is', hint: '' },
      { content: 'pretty', hint: '예쁘다' },
    ],
    items: [
      { id: '1', content: '긴', combineWithNext: false },
      { id: '2', content: '머리', combineWithNext: true },
      { id: '3', content: '가', combineWithNext: false },
      { id: '4', content: '예뻐요.' },
    ],
  },
  {
    id: 3,
    baseText: '새로운 친구를 만났어요.',
    translation: 'I met a new friend.',
    hints: [
      { content: 'I', hint: '저/나' },
      { content: 'met', hint: '만났다' },
      { content: 'a', hint: '' },
      { content: 'new', hint: '새롭다' },
      { content: 'friend', hint: '친구' },
    ],
    items: [
      { id: '1', content: '새로운', combineWithNext: false },
      { id: '2', content: '친구', combineWithNext: true },
      { id: '3', content: '를', combineWithNext: false },
      { id: '4', content: '만났어요.' },
    ],
  },
  {
    id: 4,
    baseText: '맛있는 음식을 먹었어요.',
    translation: 'I ate delicious food.',
    hints: [
      { content: 'I', hint: '저/나' },
      { content: 'ate', hint: '먹다' },
      { content: 'delicious', hint: '맛있다' },
      { content: 'food', hint: '음식' },
    ],
    items: [
      { id: '1', content: '맛있는', combineWithNext: false },
      { id: '2', content: '음식', combineWithNext: true },
      { id: '3', content: '을', combineWithNext: false },
      { id: '4', content: '먹었어요.' },
    ],
  },
  {
    id: 5,
    baseText: '예쁜 꽃을 받았어요.',
    translation: 'I received a pretty flower.',
    hints: [
      { content: 'I', hint: '저/나' },
      { content: 'received', hint: '받았다' },
      { content: 'a', hint: '' },
      { content: 'pretty', hint: '예쁘다' },
      { content: 'flower', hint: '꽃' },
    ],
    items: [
      { id: '1', content: '예쁜', combineWithNext: false },
      { id: '2', content: '꽃', combineWithNext: true },
      { id: '3', content: '을', combineWithNext: false },
      { id: '4', content: '받았어요.' },
    ],
  },
];
