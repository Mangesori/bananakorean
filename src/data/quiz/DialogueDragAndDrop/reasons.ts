import { DialogueQuestion } from '@/types/quiz';
import { addGrammarName } from '@/lib/quiz/helpers';

const questions: Omit<DialogueQuestion, 'grammarName'>[] = [
  {
    id: 1,
    question: '어제 어디에 갔어요?',
    questionTranslation: 'Where did you go yesterday?',
    answer: '배가 아파서 병원에 갔어요.',
    answerTranslation: 'Because my stomach hurt, I went to the hospital.',
items: [
      { id: '1', content: '배', combineWithNext: true },
      { id: '2', content: '가', combineWithNext: false },
      { id: '3', content: '아파', combineWithNext: true },
      { id: '4', content: '서', combineWithNext: false },
      { id: '5', content: '병원', combineWithNext: true },
      { id: '6', content: '에', combineWithNext: false },
      { id: '7', content: '갔어요.' },
    ],
  },
  {
    id: 2,
    question: '지금 어디에 있어요?',
    questionTranslation: 'Where are you now?',
    answer: '비가 와서 집에 있어요.',
    answerTranslation: "Because it's raining, I'm staying at home.",
    items: [
      { id: '1', content: '비', combineWithNext: true },
      { id: '2', content: '가', combineWithNext: false },
      { id: '3', content: '와', combineWithNext: true },
      { id: '4', content: '서', combineWithNext: false },
      { id: '5', content: '집', combineWithNext: true },
      { id: '6', content: '에', combineWithNext: false },
      { id: '7', content: '있어요.' },
    ],
  },
  {
    id: 3,
    question: '어제 몇 시에 잤어요?',
    questionTranslation: 'What time did you go to bed yesterday?',
    answer: '피곤해서 일찍 잤어요.',
    answerTranslation: 'Because I was tired, I went to bed early.',
items: [
      { id: '1', content: '피곤해', combineWithNext: true },
      { id: '2', content: '서', combineWithNext: false },
      { id: '2', content: '일찍', combineWithNext: false },
      { id: '3', content: '잤어요.' },
    ],
  },
  {
    id: 4,
    question: '지난 주말에 파티에 갔어요?',
    questionTranslation: 'Did you go to a party last weekend?',
    answer: '바빠서 못 갔어요.',
    answerTranslation: "Because I was busy, I couldn't go.",
    items: [
      { id: '1', content: '바빠', combineWithNext: true },
      { id: '2', content: '서', combineWithNext: false },
      { id: '3', content: '못', combineWithNext: true },
      { id: '4', content: '갔어요.' },
    ],
  },
  {
    id: 5,
    question: '그 영화를 또 봤어요?',
    questionTranslation: 'Did you watch that movie again?',
    answer: '네, 재미있어서 또 봤어요.',
    answerTranslation: 'Yes, because it was fun, I watched it again.',
items: [
      { id: '1', content: '재미있', combineWithNext: true },
      { id: '2', content: '어서', combineWithNext: false },
      { id: '3', content: '또', combineWithNext: false },
      { id: '4', content: '봤어요.' },
    ],
  },
];

export const reasonQuestions = addGrammarName(questions, 'reasons');
