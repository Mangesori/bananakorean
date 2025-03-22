import { KoreanQuestion } from '@/types/quiz';

export const futureQuestions: KoreanQuestion[] = [
  {
    id: 1,
    baseText: '내일 친구를 만날 거예요.',
    translation: 'I will meet my friend tomorrow.',
    hints: [
      { content: 'will', hint: 'ㄹ 거예요' },
      { content: 'meet', hint: '만나다' },
      { content: 'friend', hint: '친구' },
      { content: 'tomorrow', hint: '내일' },
    ],
    items: [
      { id: '1', content: '내일', combineWithNext: false },
      { id: '2', content: '친구', combineWithNext: true },
      { id: '3', content: '를', combineWithNext: false },
      { id: '4', content: '만날', combineWithNext: true },
      { id: '5', content: '거예요' },
    ],
  },
  {
    id: 2,
    baseText: '주말에 공부할 거예요.',
    translation: 'I will study on the weekend.',
    hints: [
      { content: 'will', hint: 'ㄹ 거예요' },
      { content: 'study', hint: '공부하다' },
      { content: 'on the weekend', hint: '주말에' },
    ],
    items: [
      { id: '1', content: '주말', combineWithNext: true },
      { id: '2', content: '에', combineWithNext: false },
      { id: '3', content: '공부할', combineWithNext: true },
      { id: '4', content: '거예요' },
    ],
  },
  {
    id: 3,
    baseText: '다음 주에 한국에 갈 거예요.',
    translation: 'I will go to Korea next week.',
    hints: [
      { content: 'will', hint: 'ㄹ 거예요' },
      { content: 'go', hint: '가다' },
      { content: 'to Korea', hint: '한국에' },
      { content: 'next week', hint: '다음 주' },
    ],
    items: [
      { id: '1', content: '다음', combineWithNext: true },
      { id: '2', content: '주', combineWithNext: true },
      { id: '3', content: '에', combineWithNext: false },
      { id: '4', content: '한국', combineWithNext: true },
      { id: '5', content: '에', combineWithNext: false },
      { id: '6', content: '갈', combineWithNext: true },
      { id: '7', content: '거예요' },
    ],
  },
  {
    id: 4,
    baseText: '오후에 운동할 거예요.',
    translation: 'I will exercise in the afternoon.',
    hints: [
      { content: 'will', hint: 'ㄹ 거예요' },
      { content: 'exercise', hint: '운동하다' },
      { content: 'in the afternoon', hint: '오후에' },
    ],
    items: [
      { id: '1', content: '오후', combineWithNext: true },
      { id: '2', content: '에', combineWithNext: false },
      { id: '3', content: '운동할', combineWithNext: true },
      { id: '4', content: '거예요' },
    ],
  },
  {
    id: 5,
    baseText: '내년에 결혼할 거예요.',
    translation: 'I will get married next year.',
    hints: [
      { content: 'will', hint: 'ㄹ 거예요' },
      { content: 'get married', hint: '결혼하다' },
      { content: 'next year', hint: '내년' },
    ],
    items: [
      { id: '1', content: '내년', combineWithNext: true },
      { id: '2', content: '에', combineWithNext: false },
      { id: '3', content: '결혼할', combineWithNext: true },
      { id: '4', content: '거예요' },
    ],
  },
];
