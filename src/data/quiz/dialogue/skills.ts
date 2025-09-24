import { DialogueQuestion } from '@/types/quiz';

export const skillQuestions: DialogueQuestion[] = [
  {
    id: 1,
    baseText: '한국어를 잘해요.',
    translation: 'I am good at Korean.',
    hints: [
      { content: 'good at', hint: '잘하다' },
      { content: 'Korean', hint: '한국어' },
    ],
    items: [
      { id: '1', content: '한국어', combineWithNext: true },
      { id: '2', content: '를', combineWithNext: false },
      { id: '3', content: '잘해요' },
    ],
  },
  {
    id: 2,
    baseText: '수영을 못해요.',
    translation: 'I cannot swim.',
    hints: [
      { content: 'cannot', hint: '못하다' },
      { content: 'swim', hint: '수영' },
    ],
    items: [
      { id: '1', content: '수영', combineWithNext: true },
      { id: '2', content: '을', combineWithNext: false },
      { id: '3', content: '못해요' },
    ],
  },
  {
    id: 3,
    baseText: '요리를 잘 못해요.',
    translation: 'I am not good at cooking.',
    hints: [
      { content: 'not good at', hint: '잘 못하다' },
      { content: 'cooking', hint: '요리' },
    ],
    items: [
      { id: '1', content: '요리', combineWithNext: true },
      { id: '2', content: '를', combineWithNext: false },
      { id: '3', content: '잘', combineWithNext: true },
      { id: '4', content: '못해요' },
    ],
  },
  {
    id: 4,
    baseText: '피아노를 잘 쳐요.',
    translation: 'I am good at playing the piano.',
    hints: [
      { content: 'good at', hint: '잘' },
      { content: 'play', hint: '치다' },
      { content: 'piano', hint: '피아노' },
    ],
    items: [
      { id: '1', content: '피아노', combineWithNext: true },
      { id: '2', content: '를', combineWithNext: false },
      { id: '3', content: '잘', combineWithNext: true },
      { id: '4', content: '쳐요' },
    ],
  },
  {
    id: 5,
    baseText: '한국말을 잘 못해요.',
    translation: 'I am not good at speaking Korean.',
    hints: [
      { content: 'not good at', hint: '잘 못하다' },
      { content: 'speak', hint: '하다' },
      { content: 'Korean', hint: '한국말' },
    ],
    items: [
      { id: '1', content: '한국말', combineWithNext: true },
      { id: '2', content: '을', combineWithNext: false },
      { id: '3', content: '잘', combineWithNext: true },
      { id: '4', content: '못해요' },
    ],
  },
];
