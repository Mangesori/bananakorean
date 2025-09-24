import { DialogueQuestion } from '@/types/quiz';

export const obligationQuestions: DialogueQuestion[] = [
  {
    id: 1,
    baseText: '숙제를 해야 해요.',
    translation: 'I have to do my homework.',
    hints: [
      { content: 'have to', hint: '아/어야 하다' },
      { content: 'do', hint: '하다' },
      { content: 'homework', hint: '숙제' },
    ],
    items: [
      { id: '1', content: '숙제', combineWithNext: true },
      { id: '2', content: '를', combineWithNext: false },
      { id: '3', content: '해야', combineWithNext: true },
      { id: '4', content: '해요' },
    ],
  },
  {
    id: 2,
    baseText: '일찍 일어나야 해요.',
    translation: 'I have to wake up early.',
    hints: [
      { content: 'have to', hint: '아/어야 하다' },
      { content: 'wake up', hint: '일어나다' },
      { content: 'early', hint: '일찍' },
    ],
    items: [
      { id: '1', content: '일찍', combineWithNext: false },
      { id: '2', content: '일어나야', combineWithNext: true },
      { id: '3', content: '해요' },
    ],
  },
  {
    id: 3,
    baseText: '약을 먹어야 해요.',
    translation: 'I have to take medicine.',
    hints: [
      { content: 'have to', hint: '아/어야 하다' },
      { content: 'take', hint: '먹다' },
      { content: 'medicine', hint: '약' },
    ],
    items: [
      { id: '1', content: '약', combineWithNext: true },
      { id: '2', content: '을', combineWithNext: false },
      { id: '3', content: '먹어야', combineWithNext: true },
      { id: '4', content: '해요' },
    ],
  },
  {
    id: 4,
    baseText: '한국어를 공부해야 해요.',
    translation: 'I have to study Korean.',
    hints: [
      { content: 'have to', hint: '아/어야 하다' },
      { content: 'study', hint: '공부하다' },
      { content: 'Korean', hint: '한국어' },
    ],
    items: [
      { id: '1', content: '한국어', combineWithNext: true },
      { id: '2', content: '를', combineWithNext: false },
      { id: '3', content: '공부해야', combineWithNext: true },
      { id: '4', content: '해요' },
    ],
  },
  {
    id: 5,
    baseText: '집에 가야 해요.',
    translation: 'I have to go home.',
    hints: [
      { content: 'have to', hint: '아/어야 하다' },
      { content: 'go', hint: '가다' },
      { content: 'home', hint: '집' },
    ],
    items: [
      { id: '1', content: '집', combineWithNext: true },
      { id: '2', content: '에', combineWithNext: false },
      { id: '3', content: '가야', combineWithNext: true },
      { id: '4', content: '해요' },
    ],
  },
];
