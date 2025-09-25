import { KoreanQuestion } from '@/types/quiz';

export const positionQuestions: KoreanQuestion[] = [
  {
    id: 1,
    baseText: '책이 책상 위에 있어요.',
    translation: 'The book is on the desk.',
    hints: [
      { content: 'The book', hint: '책' },
      { content: 'is', hint: '있어요' },
      { content: 'on', hint: '위에' },
      { content: 'the desk', hint: '책상' },
    ],
    items: [
      { id: '1', content: '책', combineWithNext: true },
      { id: '2', content: '이', combineWithNext: false },
      { id: '3', content: '책상', combineWithNext: false },
      { id: '4', content: '위', combineWithNext: true },
      { id: '5', content: '에', combineWithNext: false },
      { id: '6', content: '있어요' },
    ],
  },
  {
    id: 2,
    baseText: '고양이가 의자 아래에 있어요.',
    translation: 'The cat is under the chair.',
    hints: [
      { content: 'The cat', hint: '고양이' },
      { content: 'is', hint: '있어요' },
      { content: 'under', hint: '아래에' },
      { content: 'the chair', hint: '의자' },
    ],
    items: [
      { id: '1', content: '고양이', combineWithNext: true },
      { id: '2', content: '가', combineWithNext: false },
      { id: '3', content: '의자', combineWithNext: false },
      { id: '4', content: '아래', combineWithNext: true },
      { id: '5', content: '에', combineWithNext: false },
      { id: '6', content: '있어요' },
    ],
  },
  {
    id: 3,
    baseText: '우체국이 은행 앞에 있어요.',
    translation: 'The post office is in front of the bank.',
    hints: [
      { content: 'The post office', hint: '우체국' },
      { content: 'is', hint: '있어요' },
      { content: 'in front of', hint: '앞에' },
      { content: 'the bank', hint: '은행' },
    ],
    items: [
      { id: '1', content: '우체국', combineWithNext: true },
      { id: '2', content: '이', combineWithNext: false },
      { id: '3', content: '은행', combineWithNext: false },
      { id: '4', content: '앞', combineWithNext: true },
      { id: '5', content: '에', combineWithNext: false },
      { id: '6', content: '있어요' },
    ],
  },
  {
    id: 4,
    baseText: '화장실이 교실 뒤에 있어요.',
    translation: 'The bathroom is behind the classroom.',
    hints: [
      { content: 'The bathroom', hint: '화장실' },
      { content: 'is', hint: '있어요' },
      { content: 'behind', hint: '뒤에' },
      { content: 'the classroom', hint: '교실' },
    ],
    items: [
      { id: '1', content: '화장실', combineWithNext: true },
      { id: '2', content: '이', combineWithNext: false },
      { id: '3', content: '교실', combineWithNext: false },
      { id: '4', content: '뒤', combineWithNext: true },
      { id: '5', content: '에', combineWithNext: false },
      { id: '6', content: '있어요' },
    ],
  },
  {
    id: 5,
    baseText: '가방이 침대 옆에 있어요.',
    translation: 'The bag is next to the bed.',
    hints: [
      { content: 'The bag', hint: '가방' },
      { content: 'is', hint: '있어요' },
      { content: 'next to', hint: '옆에' },
      { content: 'the bed', hint: '침대' },
    ],
    items: [
      { id: '1', content: '가방', combineWithNext: true },
      { id: '2', content: '이', combineWithNext: false },
      { id: '3', content: '침대', combineWithNext: false },
      { id: '4', content: '옆', combineWithNext: true },
      { id: '5', content: '에', combineWithNext: false },
      { id: '6', content: '있어요' },
    ],
  },
];
