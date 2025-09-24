import { DialogueQuestion } from '@/types/quiz';

export const contrastQuestions: DialogueQuestion[] = [
  {
    id: 1,
    baseText: '비가 오지만 학교에 가요.',
    translation: "Although it's raining, I go to school.",
    hints: [
      { content: 'although/but', hint: '지만' },
      { content: 'rain comes', hint: '비가 오다' },
      { content: 'go', hint: '가다' },
      { content: 'to school', hint: '학교에' },
    ],
    items: [
      { id: '1', content: '비', combineWithNext: true },
      { id: '2', content: '가', combineWithNext: false },
      { id: '3', content: '오', combineWithNext: true },
      { id: '4', content: '지만', combineWithNext: false },
      { id: '5', content: '학교', combineWithNext: true },
      { id: '6', content: '에', combineWithNext: false },
      { id: '7', content: '가요' },
    ],
  },
  {
    id: 2,
    baseText: '바쁘지만 시간이 있어요.',
    translation: "Although I'm busy, I have time.",
    hints: [
      { content: 'although/but', hint: '지만' },
      { content: 'busy', hint: '바쁘다' },
      { content: 'have', hint: '있다' },
      { content: 'time', hint: '시간' },
    ],
    items: [
      { id: '1', content: '바쁘', combineWithNext: true },
      { id: '2', content: '지만', combineWithNext: false },
      { id: '3', content: '시간', combineWithNext: true },
      { id: '4', content: '이', combineWithNext: false },
      { id: '5', content: '있어요' },
    ],
  },
  {
    id: 3,
    baseText: '한국어는 어렵지만 재미있어요.',
    translation: 'Korean is difficult but fun.',
    hints: [
      { content: 'although/but', hint: '지만' },
      { content: 'difficult', hint: '어렵다' },
      { content: 'fun', hint: '재미있다' },
      { content: 'Korean', hint: '한국어' },
    ],
    items: [
      { id: '1', content: '한국어', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '어렵', combineWithNext: true },
      { id: '4', content: '지만', combineWithNext: false },
      { id: '5', content: '재미있어요' },
    ],
  },
  {
    id: 4,
    baseText: '피곤한데 공부해야 해요.',
    translation: "Although I'm tired, I have to study.",
    hints: [
      { content: 'although/but', hint: 'ㄴ/은데' },
      { content: 'tired', hint: '피곤하다' },
      { content: 'have to', hint: '아/어야 하다' },
      { content: 'study', hint: '공부하다' },
    ],
    items: [
      { id: '1', content: '피곤한', combineWithNext: true },
      { id: '2', content: '데', combineWithNext: false },
      { id: '3', content: '공부해야', combineWithNext: true },
      { id: '4', content: '해요' },
    ],
  },
  {
    id: 5,
    baseText: '비싸지만 맛있어요.',
    translation: "Although it's expensive, it's delicious.",
    hints: [
      { content: 'although/but', hint: '지만' },
      { content: 'expensive', hint: '비싸다' },
      { content: 'delicious', hint: '맛있다' },
    ],
    items: [
      { id: '1', content: '비싸', combineWithNext: true },
      { id: '2', content: '지만', combineWithNext: false },
      { id: '3', content: '맛있어요' },
    ],
  },
];
