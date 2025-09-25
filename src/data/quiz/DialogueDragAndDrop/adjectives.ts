import { DialogueQuestion } from '@/types/quiz';

export const adjectiveQuestions: DialogueQuestion[] = [
  {
    id: 1,
    question: '쇼핑몰에서 무엇을 샀어요?',
    questionTranslation: 'What did you buy at the shopping mall?',
    answer: '작은 가방을 샀어요.',
    answerTranslation: 'I bought a small bag.',
    items: [
      { id: '1', content: '작은', combineWithNext: false },
      { id: '2', content: '가방', combineWithNext: true },
      { id: '3', content: '을', combineWithNext: false },
      { id: '4', content: '샀어요.' },
    ],
  },
  {
    id: 2,
    question: '미용실에서 머리를 잘랐어요?',
    questionTranslation: 'Did you cut your hair at the hair salon?',
    answer: '네, 긴 머리를 잘랐어요.',
    answerTranslation: 'Yes, I cut my long hair.',
    items: [
      { id: '1', content: '네,', combineWithNext: false },
      { id: '2', content: '긴', combineWithNext: false },
      { id: '3', content: '머리', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '잘랐어요.' },
    ],
  },
  {
    id: 3,
    question: '누구를 만났어요?',
    questionTranslation: 'Who did you meet?',
    answer: '새로운 친구를 만났어요.',
    answerTranslation: 'I met a new friend.',
    items: [
      { id: '1', content: '새로운', combineWithNext: false },
      { id: '2', content: '친구', combineWithNext: true },
      { id: '3', content: '를', combineWithNext: false },
      { id: '4', content: '만났어요.' },
    ],
  },
  {
    id: 4,
    question: '뭐를 먹었어요?',
    questionTranslation: 'What did you eat?',
    answer: '맛있는 음식을 먹었어요.',
    answerTranslation: 'I ate delicious food.',
    items: [
      { id: '1', content: '맛있는', combineWithNext: false },
      { id: '2', content: '음식', combineWithNext: true },
      { id: '3', content: '을', combineWithNext: false },
      { id: '4', content: '먹었어요.' },
    ],
  },
  {
    id: 5,
    question: '남자친구에게 무엇을 받았어요?',
    questionTranslation: 'What did you receive from your boyfriend?',
    answer: '예쁜 꽃을 받았어요.',
    answerTranslation: 'I received a pretty flower.',
    items: [
      { id: '1', content: '예쁜', combineWithNext: false },
      { id: '2', content: '꽃', combineWithNext: true },
      { id: '3', content: '을', combineWithNext: false },
      { id: '4', content: '받았어요.' },
    ],
  },
];
