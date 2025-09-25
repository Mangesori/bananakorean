import { DialogueQuestion } from '@/types/quiz';

export const skillQuestions: DialogueQuestion[] = [
  {
    id: 1,
    question: '한국어를 잘해요?',
    questionTranslation: 'Are you good at Korean?',
    answer: '한국어를 잘해요.',
    answerTranslation: 'I am good at Korean.',
    items: [
      { id: '1', content: '한국어', combineWithNext: true },
      { id: '2', content: '를', combineWithNext: false },
      { id: '3', content: '잘해요' },
    ],
  },
  {
    id: 2,
    question: '수영을 잘해요?',
    questionTranslation: 'Are you good at swimming?',
    answer: '수영을 못해요.',
    answerTranslation: 'I cannot swim.',
    items: [
      { id: '1', content: '수영', combineWithNext: true },
      { id: '2', content: '을', combineWithNext: false },
      { id: '3', content: '못해요' },
    ],
  },
  {
    id: 3,
    question: '요리를 잘해요?',
    questionTranslation: 'Are you good at cooking?',
    answer: '요리를 잘 못해요.',
    answerTranslation: 'I am not good at cooking.',
    items: [
      { id: '1', content: '요리', combineWithNext: true },
      { id: '2', content: '를', combineWithNext: false },
      { id: '3', content: '잘', combineWithNext: false },
      { id: '4', content: '못해요' },
    ],
  },
  {
    id: 4,
    question: '피아노를 잘 쳐요?',
    questionTranslation: 'Are you good at playing the piano?',
    answer: '피아노를 잘 쳐요.',
    answerTranslation: 'I am good at playing the piano.',
    items: [
      { id: '1', content: '피아노', combineWithNext: true },
      { id: '2', content: '를', combineWithNext: false },
      { id: '3', content: '잘', combineWithNext: false },
      { id: '4', content: '쳐요' },
    ],
  },
  {
    id: 5,
    question: '한국말을 잘해요?',
    questionTranslation: 'Are you good at speaking Korean?',
    answer: '한국말을 잘 못해요.',
    answerTranslation: 'I am not good at speaking Korean.',
    items: [
      { id: '1', content: '한국말', combineWithNext: true },
      { id: '2', content: '을', combineWithNext: false },
      { id: '3', content: '잘', combineWithNext: false },
      { id: '4', content: '못해요' },
    ],
  },
];
