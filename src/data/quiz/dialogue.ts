import { DialogueQuestion } from '@/types/quiz';

export const dialogueQuestions: DialogueQuestion[] = [
  {
    id: 1,
    question: '직업이 뭐예요?',
    questionTranslation: 'What is your job?',
    answer: '저는 학생이에요.',
    answerTranslation: 'I am a student.',
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '학생', combineWithNext: true },
      { id: '4', content: '이에요.', combineWithNext: false },
    ],
  },
];
