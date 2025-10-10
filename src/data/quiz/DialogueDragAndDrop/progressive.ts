import { DialogueQuestion } from '@/types/quiz';
import { addGrammarName } from '@/lib/quiz/helpers';

const questions: Omit<DialogueQuestion, 'grammarName'>[] = [
  {
    id: 1,
    question: '뭐 하고 있어요?',
    questionTranslation: 'What are you doing?',
    answer: '책을 읽고 있어요.',
    answerTranslation: 'I am reading a book.',    items: [
      { id: '1', content: '책', combineWithNext: true },
      { id: '2', content: '을', combineWithNext: false },
      { id: '3', content: '읽', combineWithNext: true },
      { id: '4', content: '고', combineWithNext: false },
      { id: '5', content: '있어요' },
    ],
  },
  {
    id: 2,
    question: '뭐 하고 있어요?',
    questionTranslation: 'What are you doing?',
    answer: '음악을 듣고 있어요.',
    answerTranslation: 'I am listening to music.',    items: [
      { id: '1', content: '음악', combineWithNext: true },
      { id: '2', content: '을', combineWithNext: false },
      { id: '3', content: '듣', combineWithNext: true },
      { id: '4', content: '고', combineWithNext: false },
      { id: '5', content: '있어요' },
    ],
  },
  {
    id: 3,
    question: '뭐 하고 있어요?',
    questionTranslation: 'What are you doing?',
    answer: '공부하고 있어요.',
    answerTranslation: 'I am studying.',    items: [
      { id: '1', content: '공부하', combineWithNext: true },
      { id: '2', content: '고', combineWithNext: false },
      { id: '3', content: '있어요' },
    ],
  },
  {
    id: 4,
    question: '뭐 하고 있어요?',
    questionTranslation: 'What are you doing?',
    answer: '밥을 먹고 있어요.',
    answerTranslation: 'I am eating.',    items: [
      { id: '1', content: '밥', combineWithNext: true },
      { id: '2', content: '을', combineWithNext: false },
      { id: '3', content: '먹', combineWithNext: true },
      { id: '4', content: '고', combineWithNext: false },
      { id: '5', content: '있어요' },
    ],
  },
  {
    id: 5,
    question: '뭐 하고 있어요?',
    questionTranslation: 'What are you doing?',
    answer: '텔레비전을 보고 있어요.',
    answerTranslation: 'I am watching television.',    items: [
      { id: '1', content: '텔레비전', combineWithNext: true },
      { id: '2', content: '을', combineWithNext: false },
      { id: '3', content: '보', combineWithNext: true },
      { id: '4', content: '고', combineWithNext: false },
      { id: '5', content: '있어요' },
    ],
  },
];

export const progressiveQuestions = addGrammarName(questions, 'progressive');
