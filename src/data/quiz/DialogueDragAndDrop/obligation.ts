import { DialogueQuestion } from '@/types/quiz';

export const obligationQuestions: DialogueQuestion[] = [
  {
    id: 1,
    question: '내일 뭐 할 거예요?',
    questionTranslation: 'What are you going to do tomorrow?',
    answer: '내일 숙제를 해야 해요.',
    answerTranslation: 'I have to do my homework.',
    items: [
      { id: '1', content: '내일', combineWithNext: false },
      { id: '2', content: '숙제', combineWithNext: true },
      { id: '3', content: '를', combineWithNext: false },
      { id: '4', content: '해야', combineWithNext: false },
      { id: '5', content: '해요.' },
    ],
  },
  {
    id: 2,
    question: '내일 몇 시에 일어나야 해요?',
    questionTranslation: 'What time do you have to wake up tomorrow?',
    answer: '6시에 일어나야 해요.',
    answerTranslation: "I have to wake up at 6 o'clock.",
    items: [
      { id: '1', content: '6시', combineWithNext: true },
      { id: '2', content: '에', combineWithNext: false },
      { id: '2', content: '일어나야', combineWithNext: false },
      { id: '3', content: '해요.' },
    ],
  },
  {
    id: 3,
    question: '다음 달에 한국에 갈 거예요. 무엇을 해야 해요?',
    questionTranslation: 'I will go to Korea next month. What do I have to do?',
    answer: '한국 음식을 먹어야 해요.',
    answerTranslation: 'You have to eat Korean food.',
    items: [
      { id: '1', content: '한국', combineWithNext: false },
      { id: '2', content: '음식', combineWithNext: true },
      { id: '3', content: '을', combineWithNext: false },
      { id: '4', content: '먹어야', combineWithNext: false },
      { id: '5', content: '해요.' },
    ],
  },
  {
    id: 4,
    question: '한국어를 잘하고 싶으면 어떻게 해야 해요?',
    questionTranslation: 'How do you have to study Korean if you want to be good at Korean?',
    answer: '매일 한국어를 공부해야 해요.',
    answerTranslation: 'I have to study Korean every day.',
    items: [
      { id: '1', content: '매일', combineWithNext: false },
      { id: '2', content: '한국어', combineWithNext: true },
      { id: '3', content: '를', combineWithNext: false },
      { id: '4', content: '공부해야', combineWithNext: false },
      { id: '5', content: '해요.' },
    ],
  },
  {
    id: 5,
    question: '이따가 술 마시러 가요.',
    questionTranslation: "Let's go have a drink later.",
    answer: '미안해요, 집에 가야 해요.',
    answerTranslation: 'Sorry, I have to go home.',
    items: [
      { id: '1', content: '미안해요,', combineWithNext: false },
      { id: '2', content: '집', combineWithNext: true },
      { id: '3', content: '에', combineWithNext: false },
      { id: '4', content: '가야', combineWithNext: false },
      { id: '5', content: '해요.' },
    ],
  },
];
