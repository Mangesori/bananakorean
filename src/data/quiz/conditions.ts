import { KoreanQuestion } from '@/types/quiz';

export const conditionQuestions: KoreanQuestion[] = [
  {
    id: 1,
    baseText: '비가 오면 우산을 가져가요.',
    translation: 'If it rains, I take an umbrella.',
    hints: [
      { content: 'if', hint: '면' },
      { content: 'rain comes', hint: '비가 오다' },
      { content: 'take', hint: '가져가다' },
      { content: 'umbrella', hint: '우산' },
    ],
    items: [
      { id: '1', content: '비', combineWithNext: true },
      { id: '2', content: '가', combineWithNext: false },
      { id: '3', content: '오', combineWithNext: true },
      { id: '4', content: '면', combineWithNext: false },
      { id: '5', content: '우산', combineWithNext: true },
      { id: '6', content: '을', combineWithNext: false },
      { id: '7', content: '가져가요' },
    ],
  },
  {
    id: 2,
    baseText: '시간이 있으면 영화를 볼게요.',
    translation: 'If I have time, I will watch a movie.',
    hints: [
      { content: 'if', hint: '면' },
      { content: 'have time', hint: '시간이 있다' },
      { content: 'will watch', hint: '보다' },
      { content: 'movie', hint: '영화' },
    ],
    items: [
      { id: '1', content: '시간', combineWithNext: true },
      { id: '2', content: '이', combineWithNext: false },
      { id: '3', content: '있', combineWithNext: true },
      { id: '4', content: '으면', combineWithNext: false },
      { id: '5', content: '영화', combineWithNext: true },
      { id: '6', content: '를', combineWithNext: false },
      { id: '7', content: '볼게요' },
    ],
  },
  {
    id: 3,
    baseText: '날씨가 좋으면 공원에 가요.',
    translation: 'If the weather is good, I go to the park.',
    hints: [
      { content: 'if', hint: '면' },
      { content: 'weather is good', hint: '날씨가 좋다' },
      { content: 'go', hint: '가다' },
      { content: 'to the park', hint: '공원에' },
    ],
    items: [
      { id: '1', content: '날씨', combineWithNext: true },
      { id: '2', content: '가', combineWithNext: false },
      { id: '3', content: '좋', combineWithNext: true },
      { id: '4', content: '으면', combineWithNext: false },
      { id: '5', content: '공원', combineWithNext: true },
      { id: '6', content: '에', combineWithNext: false },
      { id: '7', content: '가요' },
    ],
  },
  {
    id: 4,
    baseText: '아프면 병원에 가세요.',
    translation: 'If you are sick, go to the hospital.',
    hints: [
      { content: 'if', hint: '면' },
      { content: 'sick', hint: '아프다' },
      { content: 'go', hint: '가다' },
      { content: 'to the hospital', hint: '병원에' },
    ],
    items: [
      { id: '1', content: '아프', combineWithNext: true },
      { id: '2', content: '면', combineWithNext: false },
      { id: '3', content: '병원', combineWithNext: true },
      { id: '4', content: '에', combineWithNext: false },
      { id: '5', content: '가세요' },
    ],
  },
  {
    id: 5,
    baseText: '돈이 있으면 여행을 갈 거예요.',
    translation: 'If I have money, I will go on a trip.',
    hints: [
      { content: 'if', hint: '면' },
      { content: 'have money', hint: '돈이 있다' },
      { content: 'will go', hint: '가다' },
      { content: 'trip', hint: '여행' },
    ],
    items: [
      { id: '1', content: '돈', combineWithNext: true },
      { id: '2', content: '이', combineWithNext: false },
      { id: '3', content: '있', combineWithNext: true },
      { id: '4', content: '으면', combineWithNext: false },
      { id: '5', content: '여행', combineWithNext: true },
      { id: '6', content: '을', combineWithNext: false },
      { id: '7', content: '갈', combineWithNext: true },
      { id: '8', content: '거예요' },
    ],
  },
];
