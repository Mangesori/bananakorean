import { KoreanQuestion } from '@/types/quiz';
// 학생, 선생님, 의사, 가수, 요리사, 경찰, 회사원, 배우, 운동 선수, 기자, 한국 사람, 중국 사람, 일본 사람, 미국 사람, 영국 사람, 프랑스 사람, 독일 사람, 호주 사람, 베트남 사람, 인도 사람

export const introductionQuestions: KoreanQuestion[] = [
  {
    id: 1,
    baseText: '저는 학생이에요.',
    translation: 'I am a student.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '이에요' },
      { content: 'a', hint: '' },
      { content: 'student', hint: '학생' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '학생', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
  {
    id: 2,
    baseText: '저는 선생님이에요.',
    translation: 'I am a teacher.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '이에요' },
      { content: 'a', hint: '' },
      { content: 'teacher', hint: '선생님' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '선생님', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
  {
    id: 3,
    baseText: '저는 의사예요.',
    translation: 'I am a doctor.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '예요' },
      { content: 'a', hint: '' },
      { content: 'doctor', hint: '의사' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '의사', combineWithNext: true },
      { id: '4', content: '예요.' },
    ],
  },
  {
    id: 4,
    baseText: '저는 가수예요.',
    translation: 'I am a singer.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '예요' },
      { content: 'a', hint: '' },
      { content: 'singer', hint: '가수' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '가수', combineWithNext: true },
      { id: '4', content: '예요.' },
    ],
  },
  {
    id: 5,
    baseText: '저는 요리사예요.',
    translation: 'I am a cook.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '예요' },
      { content: 'a', hint: '' },
      { content: 'cook', hint: '요리사' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '요리사', combineWithNext: true },
      { id: '4', content: '예요.' },
    ],
  },
  {
    id: 6,
    baseText: '저는 경찰이에요.',
    translation: 'I am a police officer.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '이에요' },
      { content: 'a', hint: '' },
      { content: 'police officer', hint: '경찰' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '경찰', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
  {
    id: 7,
    baseText: '저는 회사원이에요.',
    translation: 'I am an office worker.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '이에요' },
      { content: 'an', hint: '' },
      { content: 'office worker', hint: '회사원' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '회사원', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
  {
    id: 8,
    baseText: '저는 배우예요.',
    translation: 'I am an actor.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '예요' },
      { content: 'an', hint: '' },
      { content: 'actor', hint: '배우' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '배우', combineWithNext: true },
      { id: '4', content: '예요.' },
    ],
  },
  {
    id: 9,
    baseText: '저는 운동 선수예요.',
    translation: 'I am an athlete.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '예요' },
      { content: 'an', hint: '' },
      { content: 'athlete', hint: '운동 선수' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '운동 선수', combineWithNext: true },
      { id: '4', content: '예요.' },
    ],
  },
  {
    id: 10,
    baseText: '저는 기자예요.',
    translation: 'I am a journalist.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '예요' },
      { content: 'a', hint: '' },
      { content: 'journalist', hint: '기자' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '기자', combineWithNext: true },
      { id: '4', content: '예요.' },
    ],
  },
  {
    id: 11,
    baseText: '저는 한국 사람이에요.',
    translation: 'I am Korean.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '이에요' },
      { content: 'Korean', hint: '한국 사람' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '한국 사람', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
  {
    id: 12,
    baseText: '저는 중국 사람이에요.',
    translation: 'I am Chinese.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '이에요' },
      { content: 'Chinese', hint: '중국 사람' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '중국 사람', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
  {
    id: 13,
    baseText: '저는 일본 사람이에요.',
    translation: 'I am Japanese.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '이에요' },
      { content: 'Japanese', hint: '일본 사람' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '일본 사람', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
  {
    id: 14,
    baseText: '저는 미국 사람이에요.',
    translation: 'I am American.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '이에요' },
      { content: 'American', hint: '미국 사람' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '미국 사람', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
  {
    id: 15,
    baseText: '저는 영국 사람이에요.',
    translation: 'I am British.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '이에요' },
      { content: 'British', hint: '영국 사람' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '영국 사람', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
  {
    id: 16,
    baseText: '저는 프랑스 사람이에요.',
    translation: 'I am French.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '이에요' },
      { content: 'French', hint: '프랑스 사람' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '프랑스 사람', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
  {
    id: 17,
    baseText: '저는 독일 사람이에요.',
    translation: 'I am German.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '이에요' },
      { content: 'German', hint: '독일 사람' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '독일 사람', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
  {
    id: 18,
    baseText: '저는 호주 사람이에요.',
    translation: 'I am Australian.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '이에요' },
      { content: 'Australian', hint: '호주 사람' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '호주 사람', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
  {
    id: 19,
    baseText: '저는 베트남 사람이에요.',
    translation: 'I am Vietnamese.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '이에요' },
      { content: 'Vietnamese', hint: '베트남 사람' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '베트남 사람', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
  {
    id: 20,
    baseText: '저는 인도 사람이에요.',
    translation: 'I am Indian.',
    hints: [
      { content: 'I', hint: '저' },
      { content: 'am', hint: '이에요' },
      { content: 'Indian', hint: '인도 사람' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '인도 사람', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
];
