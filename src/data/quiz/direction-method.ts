import { KoreanQuestion } from '@/types/quiz';

export const directionMethodQuestions: KoreanQuestion[] = [
  {
    id: 1,
    baseText: '왼쪽으로 가세요.',
    translation: 'Please go to the left.',
    hints: [
      { content: 'to', hint: '으로' },
      { content: 'left', hint: '왼쪽' },
      { content: 'please go', hint: '가세요' },
    ],
    items: [
      { id: '1', content: '왼쪽', combineWithNext: true },
      { id: '2', content: '으로', combineWithNext: false },
      { id: '3', content: '가세요' },
    ],
  },
  {
    id: 2,
    baseText: '지하철로 학교에 가요.',
    translation: 'I go to school by subway.',
    hints: [
      { content: 'by', hint: '로' },
      { content: 'subway', hint: '지하철' },
      { content: 'to school', hint: '학교에' },
      { content: 'go', hint: '가요' },
    ],
    items: [
      { id: '1', content: '지하철', combineWithNext: true },
      { id: '2', content: '로', combineWithNext: false },
      { id: '3', content: '학교', combineWithNext: true },
      { id: '4', content: '에', combineWithNext: false },
      { id: '5', content: '가요' },
    ],
  },
  {
    id: 3,
    baseText: '한국어로 이야기해요.',
    translation: "Let's speak in Korean.",
    hints: [
      { content: 'in', hint: '로' },
      { content: 'Korean', hint: '한국어' },
      { content: 'speak', hint: '이야기해요' },
    ],
    items: [
      { id: '1', content: '한국어', combineWithNext: true },
      { id: '2', content: '로', combineWithNext: false },
      { id: '3', content: '이야기해요' },
    ],
  },
  {
    id: 4,
    baseText: '연필로 편지를 써요.',
    translation: 'I write a letter with a pencil.',
    hints: [
      { content: 'with', hint: '로' },
      { content: 'pencil', hint: '연필' },
      { content: 'letter', hint: '편지' },
      { content: 'write', hint: '써요' },
    ],
    items: [
      { id: '1', content: '연필', combineWithNext: true },
      { id: '2', content: '로', combineWithNext: false },
      { id: '3', content: '편지', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '써요' },
    ],
  },
  {
    id: 5,
    baseText: '오른쪽으로 돌아가세요.',
    translation: 'Please turn to the right.',
    hints: [
      { content: 'to', hint: '으로' },
      { content: 'right', hint: '오른쪽' },
      { content: 'please turn', hint: '돌아가세요' },
    ],
    items: [
      { id: '1', content: '오른쪽', combineWithNext: true },
      { id: '2', content: '으로', combineWithNext: false },
      { id: '3', content: '돌아가세요' },
    ],
  },
];
