interface QuizQuestion {
  id: number;
  baseText: string;
  translation: string;
  hints: {
    content: string;
    hint: string;
    isGrammar?: boolean;
  }[];
  items: {
    id: string;
    content: string;
    combineWithNext?: boolean; // 다음 단어와 공백 없이 붙일지 여부
  }[];
}

export const koreanQuestions: QuizQuestion[] = [
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
    baseText: '이거는 책상이에요.',
    translation: 'This is a desk.',
    hints: [
      { content: 'This', hint: '이거' },
      { content: 'is', hint: '는' },
      { content: 'a', hint: '' },
      { content: 'desk', hint: '책상' },
    ],
    items: [
      { id: '1', content: '이거', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '책상', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
  {
    id: 5,
    baseText: '저거는 의자예요.',
    translation: 'That is a chair.',
    hints: [
      { content: 'That', hint: '저거' },
      { content: 'is', hint: '는' },
      { content: 'a', hint: '' },
      { content: 'chair', hint: '의자' },
    ],
    items: [
      { id: '1', content: '저거', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '의자', combineWithNext: true },
      { id: '4', content: '예요.' },
    ],
  },
  {
    id: 6,
    baseText: '이거는 핸드폰이에요.',
    translation: 'This is a cell phone.',
    hints: [
      { content: 'This', hint: '이거' },
      { content: 'is', hint: '는' },
      { content: 'a', hint: '' },
      { content: 'cell phone', hint: '핸드폰' },
    ],
    items: [
      { id: '1', content: '이거', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '핸드폰', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
  {
    id: 7,
    baseText: '저거는 컴퓨터예요.',
    translation: 'That is a computer.',
    hints: [
      { content: 'That', hint: '저거' },
      { content: 'is', hint: '는' },
      { content: 'a', hint: '' },
      { content: 'computer', hint: '컴퓨터' },
    ],
    items: [
      { id: '1', content: '저거', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '컴퓨터', combineWithNext: true },
      { id: '4', content: '예요.' },
    ],
  },
  {
    id: 8,
    baseText: '이거는 가방이에요.',
    translation: 'This is a bag.',
    hints: [
      { content: 'This', hint: '이거' },
      { content: 'is', hint: '는' },
      { content: 'a', hint: '' },
      { content: 'bag', hint: '가방' },
    ],
    items: [
      { id: '1', content: '이거', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '가방', combineWithNext: true },
      { id: '4', content: '이에요.' },
    ],
  },
  {
    id: 9,
    baseText: '저거는 모자예요.',
    translation: 'That is a hat.',
    hints: [
      { content: 'That', hint: '저거' },
      { content: 'is', hint: '는' },
      { content: 'a', hint: '' },
      { content: 'hat', hint: '모자' },
    ],
    items: [
      { id: '1', content: '저거', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '모자', combineWithNext: true },
      { id: '4', content: '예요.' },
    ],
  },
  {
    id: 10,
    baseText: '이거는 제 거예요.',
    translation: 'This is mine.',
    hints: [
      { content: 'This', hint: '이거' },
      { content: 'is', hint: '는' },
      { content: 'mine', hint: '제 거' },
    ],
    items: [
      { id: '1', content: '이거', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '제 거', combineWithNext: true },
      { id: '4', content: '예요.' },
    ],
  },
];
