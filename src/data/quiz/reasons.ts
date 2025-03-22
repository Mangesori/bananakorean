import { KoreanQuestion } from '@/types/quiz';

export const reasonQuestions: KoreanQuestion[] = [
  {
    id: 1,
    baseText: '배가 아파서 병원에 갔어요.',
    translation: 'Because my stomach hurt, I went to the hospital.',
    hints: [
      { content: 'because', hint: '아서/어서' },
      { content: 'stomach hurts', hint: '배가 아프다' },
      { content: 'went', hint: '가다' },
      { content: 'hospital', hint: '병원' },
    ],
    items: [
      { id: '1', content: '배', combineWithNext: true },
      { id: '2', content: '가', combineWithNext: false },
      { id: '3', content: '아파서', combineWithNext: false },
      { id: '4', content: '병원', combineWithNext: true },
      { id: '5', content: '에', combineWithNext: false },
      { id: '6', content: '갔어요' },
    ],
  },
  {
    id: 2,
    baseText: '비가 와서 집에 있어요.',
    translation: "Because it's raining, I'm staying at home.",
    hints: [
      { content: 'because', hint: '아서/어서' },
      { content: 'rain comes', hint: '비가 오다' },
      { content: 'stay', hint: '있다' },
      { content: 'at home', hint: '집에' },
    ],
    items: [
      { id: '1', content: '비', combineWithNext: true },
      { id: '2', content: '가', combineWithNext: false },
      { id: '3', content: '와서', combineWithNext: false },
      { id: '4', content: '집', combineWithNext: true },
      { id: '5', content: '에', combineWithNext: false },
      { id: '6', content: '있어요' },
    ],
  },
  {
    id: 3,
    baseText: '피곤해서 일찍 잤어요.',
    translation: 'Because I was tired, I went to bed early.',
    hints: [
      { content: 'because', hint: '아서/어서' },
      { content: 'tired', hint: '피곤하다' },
      { content: 'went to bed', hint: '자다' },
      { content: 'early', hint: '일찍' },
    ],
    items: [
      { id: '1', content: '피곤해서', combineWithNext: false },
      { id: '2', content: '일찍', combineWithNext: false },
      { id: '3', content: '잤어요' },
    ],
  },
  {
    id: 4,
    baseText: '바빠서 못 갔어요.',
    translation: "Because I was busy, I couldn't go.",
    hints: [
      { content: 'because', hint: '아서/어서' },
      { content: 'busy', hint: '바쁘다' },
      { content: "couldn't go", hint: '못 가다' },
    ],
    items: [
      { id: '1', content: '바빠서', combineWithNext: false },
      { id: '2', content: '못', combineWithNext: true },
      { id: '3', content: '갔어요' },
    ],
  },
  {
    id: 5,
    baseText: '재미있어서 또 봤어요.',
    translation: 'Because it was fun, I watched it again.',
    hints: [
      { content: 'because', hint: '아서/어서' },
      { content: 'fun', hint: '재미있다' },
      { content: 'watched again', hint: '또 보다' },
    ],
    items: [
      { id: '1', content: '재미있어서', combineWithNext: false },
      { id: '2', content: '또', combineWithNext: true },
      { id: '3', content: '봤어요' },
    ],
  },
];
