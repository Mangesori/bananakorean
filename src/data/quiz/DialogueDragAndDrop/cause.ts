import { DialogueQuestion } from '@/types/quiz';
import { addGrammarName } from '@/lib/quiz/helpers';

const questions: Omit<DialogueQuestion, 'grammarName'>[] = [
  {
    id: 1,
    question: '비가 오니까 우산을 가져가세요.',
    questionTranslation: "Because it's raining, take an umbrella.",
    answer: '네, 알겠습니다.',
    answerTranslation: 'Okay, I got it.',    mode: 'answer-to-question',
    items: [
      { id: '1', content: '비', combineWithNext: true },
      { id: '2', content: '가', combineWithNext: false },
      { id: '3', content: '오', combineWithNext: true },
      { id: '4', content: '니까', combineWithNext: false },
      { id: '5', content: '우산', combineWithNext: true },
      { id: '6', content: '을', combineWithNext: false },
      { id: '7', content: '가져가세요.' },
    ],
  },
  {
    id: 2,
    question: '늦었으니까 택시를 탈까요?',
    questionTranslation: "Because we're late, shall we take a taxi?",
    answer: '네, 알겠습니다.',
    answerTranslation: 'Okay, I got it.',    mode: 'answer-to-question',
    items: [
      { id: '1', content: '늦었', combineWithNext: true },
      { id: '2', content: '으니까', combineWithNext: false },
      { id: '3', content: '택시', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '탈까요?' },
    ],
  },
  {
    id: 3,
    question: '배가 아프니까 약을 드세요.',
    questionTranslation: 'Because your stomach hurts, take medicine.',
    answer: '네, 알겠습니다.',
    answerTranslation: 'Okay, I got it.',    mode: 'answer-to-question',
    items: [
      { id: '1', content: '배', combineWithNext: true },
      { id: '2', content: '가', combineWithNext: false },
      { id: '3', content: '아프', combineWithNext: true },
      { id: '4', content: '니까', combineWithNext: false },
      { id: '5', content: '약', combineWithNext: true },
      { id: '6', content: '을', combineWithNext: false },
      { id: '7', content: '드세요.' },
    ],
  },
  {
    id: 4,
    question: '추우니까 창문을 닫아 주세요.',
    questionTranslation: "Because it's cold, please close the window.",
    answer: '네, 알겠습니다.',
    answerTranslation: 'Okay, I got it.',    mode: 'answer-to-question',
    items: [
      { id: '1', content: '추우', combineWithNext: true },
      { id: '2', content: '니까', combineWithNext: false },
      { id: '3', content: '창문', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '닫아', combineWithNext: false },
      { id: '6', content: '주세요.' },
    ],
  },
  {
    id: 5,
    question: '피곤하니까 일찍 자세요.',
    questionTranslation: "Because you're tired, go to bed early.",
    answer: '네, 알겠습니다.',
    answerTranslation: 'Okay, I got it.',    mode: 'answer-to-question',
    items: [
      { id: '1', content: '피곤하', combineWithNext: true },
      { id: '2', content: '니까', combineWithNext: false },
      { id: '3', content: '일찍', combineWithNext: false },
      { id: '4', content: '자', combineWithNext: true },
      { id: '5', content: '세요.' },
    ],
  },
];

export const causeQuestions = addGrammarName(questions, 'cause');
