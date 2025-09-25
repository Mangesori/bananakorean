import { KoreanQuestion } from '@/types/quiz';

export const purposeQuestions: KoreanQuestion[] = [
  {
    id: 1,
    baseText: '공부하러 도서관에 가요.',
    translation: 'I go to the library to study.',
    hints: [
      { content: 'to study', hint: '공부하러' },
      { content: 'to the library', hint: '도서관에' },
      { content: 'go', hint: '가요' },
    ],
    items: [
      { id: '1', content: '공부', combineWithNext: true },
      { id: '2', content: '하러', combineWithNext: false },
      { id: '3', content: '도서관', combineWithNext: true },
      { id: '4', content: '에', combineWithNext: false },
      { id: '5', content: '가요' },
    ],
  },
  {
    id: 2,
    baseText: '밥 먹으러 식당에 가요.',
    translation: 'I go to the restaurant to eat.',
    hints: [
      { content: 'to eat', hint: '밥 먹으러' },
      { content: 'to the restaurant', hint: '식당에' },
      { content: 'go', hint: '가요' },
    ],
    items: [
      { id: '1', content: '밥', combineWithNext: false },
      { id: '2', content: '먹', combineWithNext: true },
      { id: '3', content: '으러', combineWithNext: false },
      { id: '4', content: '식당', combineWithNext: true },
      { id: '5', content: '에', combineWithNext: false },
      { id: '6', content: '가요' },
    ],
  },
  {
    id: 3,
    baseText: '운동하러 체육관에 와요.',
    translation: 'I come to the gym to exercise.',
    hints: [
      { content: 'to exercise', hint: '운동하러' },
      { content: 'to the gym', hint: '체육관에' },
      { content: 'come', hint: '와요' },
    ],
    items: [
      { id: '1', content: '운동', combineWithNext: true },
      { id: '2', content: '하러', combineWithNext: false },
      { id: '3', content: '체육관', combineWithNext: true },
      { id: '4', content: '에', combineWithNext: false },
      { id: '5', content: '와요' },
    ],
  },
  {
    id: 4,
    baseText: '책 사러 서점에 가요.',
    translation: 'I go to the bookstore to buy books.',
    hints: [
      { content: 'to buy books', hint: '책 사러' },
      { content: 'to the bookstore', hint: '서점에' },
      { content: 'go', hint: '가요' },
    ],
    items: [
      { id: '1', content: '책', combineWithNext: false },
      { id: '2', content: '사', combineWithNext: true },
      { id: '3', content: '러', combineWithNext: false },
      { id: '4', content: '서점', combineWithNext: true },
      { id: '5', content: '에', combineWithNext: false },
      { id: '6', content: '가요' },
    ],
  },
  {
    id: 5,
    baseText: '한국어 배우러 학교에 와요.',
    translation: 'I come to school to learn Korean.',
    hints: [
      { content: 'to learn Korean', hint: '한국어 배우러' },
      { content: 'to school', hint: '학교에' },
      { content: 'come', hint: '와요' },
    ],
    items: [
      { id: '1', content: '한국어', combineWithNext: false },
      { id: '2', content: '배우', combineWithNext: true },
      { id: '3', content: '러', combineWithNext: false },
      { id: '4', content: '학교', combineWithNext: true },
      { id: '5', content: '에', combineWithNext: false },
      { id: '6', content: '와요' },
    ],
  },
];
