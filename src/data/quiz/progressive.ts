import { KoreanQuestion } from '@/types/quiz';

export const progressiveQuestions: KoreanQuestion[] = [
  {
    id: 1,
    baseText: '책을 읽고 있어요.',
    translation: 'I am reading a book.',
    hints: [
      { content: 'be ~ing', hint: '고 있다' },
      { content: 'read', hint: '읽다' },
      { content: 'book', hint: '책' },
    ],
    items: [
      { id: '1', content: '책', combineWithNext: true },
      { id: '2', content: '을', combineWithNext: false },
      { id: '3', content: '읽', combineWithNext: true },
      { id: '4', content: '고', combineWithNext: true },
      { id: '5', content: '있어요' },
    ],
  },
  {
    id: 2,
    baseText: '음악을 듣고 있어요.',
    translation: 'I am listening to music.',
    hints: [
      { content: 'be ~ing', hint: '고 있다' },
      { content: 'listen', hint: '듣다' },
      { content: 'music', hint: '음악' },
    ],
    items: [
      { id: '1', content: '음악', combineWithNext: true },
      { id: '2', content: '을', combineWithNext: false },
      { id: '3', content: '듣', combineWithNext: true },
      { id: '4', content: '고', combineWithNext: true },
      { id: '5', content: '있어요' },
    ],
  },
  {
    id: 3,
    baseText: '공부하고 있어요.',
    translation: 'I am studying.',
    hints: [
      { content: 'be ~ing', hint: '고 있다' },
      { content: 'study', hint: '공부하다' },
    ],
    items: [
      { id: '1', content: '공부하', combineWithNext: true },
      { id: '2', content: '고', combineWithNext: true },
      { id: '3', content: '있어요' },
    ],
  },
  {
    id: 4,
    baseText: '밥을 먹고 있어요.',
    translation: 'I am eating.',
    hints: [
      { content: 'be ~ing', hint: '고 있다' },
      { content: 'eat', hint: '먹다' },
      { content: 'meal', hint: '밥' },
    ],
    items: [
      { id: '1', content: '밥', combineWithNext: true },
      { id: '2', content: '을', combineWithNext: false },
      { id: '3', content: '먹', combineWithNext: true },
      { id: '4', content: '고', combineWithNext: true },
      { id: '5', content: '있어요' },
    ],
  },
  {
    id: 5,
    baseText: '텔레비전을 보고 있어요.',
    translation: 'I am watching television.',
    hints: [
      { content: 'be ~ing', hint: '고 있다' },
      { content: 'watch', hint: '보다' },
      { content: 'television', hint: '텔레비전' },
    ],
    items: [
      { id: '1', content: '텔레비전', combineWithNext: true },
      { id: '2', content: '을', combineWithNext: false },
      { id: '3', content: '보', combineWithNext: true },
      { id: '4', content: '고', combineWithNext: true },
      { id: '5', content: '있어요' },
    ],
  },
];
