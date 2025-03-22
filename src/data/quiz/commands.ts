import { KoreanQuestion } from '@/types/quiz';

export const commandQuestions: KoreanQuestion[] = [
  {
    id: 1,
    baseText: '여기에 앉으세요.',
    translation: 'Please sit here.',
    hints: [
      { content: 'please (command)', hint: '으세요' },
      { content: 'sit', hint: '앉다' },
      { content: 'here', hint: '여기에' },
    ],
    items: [
      { id: '1', content: '여기', combineWithNext: true },
      { id: '2', content: '에', combineWithNext: false },
      { id: '3', content: '앉', combineWithNext: true },
      { id: '4', content: '으세요' },
    ],
  },
  {
    id: 2,
    baseText: '책을 읽으세요.',
    translation: 'Please read the book.',
    hints: [
      { content: 'please (command)', hint: '으세요' },
      { content: 'read', hint: '읽다' },
      { content: 'the book', hint: '책을' },
    ],
    items: [
      { id: '1', content: '책', combineWithNext: true },
      { id: '2', content: '을', combineWithNext: false },
      { id: '3', content: '읽', combineWithNext: true },
      { id: '4', content: '으세요' },
    ],
  },
  {
    id: 3,
    baseText: '여기서 놀지 마세요.',
    translation: "Please don't play here.",
    hints: [
      { content: "please don't", hint: '지 마세요' },
      { content: 'play', hint: '놀다' },
      { content: 'here', hint: '여기서' },
    ],
    items: [
      { id: '1', content: '여기', combineWithNext: true },
      { id: '2', content: '서', combineWithNext: false },
      { id: '3', content: '놀', combineWithNext: true },
      { id: '4', content: '지', combineWithNext: true },
      { id: '5', content: '마세요' },
    ],
  },
  {
    id: 4,
    baseText: '전화하지 마세요.',
    translation: "Please don't make a phone call.",
    hints: [
      { content: "please don't", hint: '지 마세요' },
      { content: 'make a phone call', hint: '전화하다' },
    ],
    items: [
      { id: '1', content: '전화', combineWithNext: true },
      { id: '2', content: '하', combineWithNext: true },
      { id: '3', content: '지', combineWithNext: true },
      { id: '4', content: '마세요' },
    ],
  },
  {
    id: 5,
    baseText: '문을 닫으세요.',
    translation: 'Please close the door.',
    hints: [
      { content: 'please (command)', hint: '으세요' },
      { content: 'close', hint: '닫다' },
      { content: 'the door', hint: '문을' },
    ],
    items: [
      { id: '1', content: '문', combineWithNext: true },
      { id: '2', content: '을', combineWithNext: false },
      { id: '3', content: '닫', combineWithNext: true },
      { id: '4', content: '으세요' },
    ],
  },
];
