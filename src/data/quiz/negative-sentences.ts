import { KoreanQuestion } from '@/types/quiz';
// 읽다, 마시다, 듣다, 공부하다, 보다, 만나다, 먹다, 사다, 좋아하다, 자다, 배우다, 공부하다, 쇼핑하다, 이야기하다, 운동하다, 요리하다, 일하다, 전화하다
// 음악, 노래, 한국어, 영어, 밥, 우유, 커피, 피자, 맥주, 아침, 점심, 저녁, 공부, 운동, 쇼핑, 이야기, 요리, 일, 전화

export const negativeSentenceQuestions: KoreanQuestion[] = [
  {
    id: 1,
    baseText: '저는 책을 안 읽어요.',
    translation: "I don't read a book.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'read', hint: '읽다' },
      { content: 'a', hint: '' },
      { content: 'book', hint: '책' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '책', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '읽어요.' },
    ],
  },
  {
    id: 2,
    baseText: '저는 물을 안 마셔요.',
    translation: "I don't drink water.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'drink', hint: '마시다' },
      { content: 'water', hint: '물' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '물', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '마셔요.' },
    ],
  },
  {
    id: 3,
    baseText: '저는 음악을 안 들어요.',
    translation: "I don't listen to music.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'listen to', hint: '듣다' },
      { content: 'music', hint: '음악' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '음악', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '들어요.' },
    ],
  },
  {
    id: 4,
    baseText: '저는 한국어 공부를 안 해요.',
    translation: "I don't study Korean.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'study', hint: '공부하다' },
      { content: 'Korean', hint: '한국어' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '한국어', combineWithNext: false },
      { id: '4', content: '공부', combineWithNext: true },
      { id: '5', content: '를', combineWithNext: false },
      { id: '6', content: '안', combineWithNext: false },
      { id: '7', content: '해요.' },
    ],
  },
  {
    id: 5,
    baseText: '저는 텔레비전을 안 봐요.',
    translation: "I don't watch television.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'watch', hint: '보다' },
      { content: 'television', hint: '텔레비전' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '텔레비전', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '봐요.' },
    ],
  },
  {
    id: 6,
    baseText: '저는 친구를 안 만나요.',
    translation: "I don't meet a friend.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'meet', hint: '만나다' },
      { content: 'a', hint: '' },
      { content: 'friend', hint: '친구' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '친구', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '만나요.' },
    ],
  },
  {
    id: 7,
    baseText: '저는 밥을 안 먹어요.',
    translation: "I don't eat rice.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'eat', hint: '먹다' },
      { content: 'rice', hint: '밥' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '밥', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '먹어요.' },
    ],
  },
  {
    id: 8,
    baseText: '저는 우유를 안 사요.',
    translation: "I don't buy milk.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'buy', hint: '사다' },
      { content: 'milk', hint: '우유' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '우유', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '사요.' },
    ],
  },
  {
    id: 9,
    baseText: '저는 운동을 안 좋아해요.',
    translation: "I don't like exercise.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'like', hint: '좋아하다' },
      { content: 'exercise', hint: '운동' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '운동', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '좋아해요.' },
    ],
  },
  {
    id: 10,
    baseText: '저는 잠을 안 자요.',
    translation: "I don't sleep.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'sleep', hint: '자다' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '잠', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '자요.' },
    ],
  },
  {
    id: 11,
    baseText: '저는 영어를 안 배워요.',
    translation: "I don't learn English.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'learn', hint: '배우다' },
      { content: 'English', hint: '영어' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '영어', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '배워요.' },
    ],
  },
  {
    id: 12,
    baseText: '저는 한국어를 안 가르쳐요.',
    translation: "I don't teach Korean.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'teach', hint: '가르치다' },
      { content: 'Korean', hint: '한국어' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '한국어', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '가르쳐요.' },
    ],
  },
  {
    id: 13,
    baseText: '저는 공부를 안 해요.',
    translation: "I don't study.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'study', hint: '공부하다' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '공부', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '해요.' },
    ],
  },
  {
    id: 14,
    baseText: '저는 쇼핑을 안 해요.',
    translation: "I don't go shopping.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'go shopping', hint: '쇼핑하다' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '쇼핑', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '해요.' },
    ],
  },
  {
    id: 15,
    baseText: '저는 이야기를 안 해요.',
    translation: "I don't talk.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'talk', hint: '이야기하다' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '이야기', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '해요.' },
    ],
  },
  {
    id: 16,
    baseText: '저는 운동을 안 해요.',
    translation: "I don't exercise.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'exercise', hint: '운동하다' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '운동', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '해요.' },
    ],
  },
  {
    id: 17,
    baseText: '저는 요리를 안 해요.',
    translation: "I don't cook.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'cook', hint: '요리하다' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '요리', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '해요.' },
    ],
  },
  {
    id: 18,
    baseText: '저는 일을 안 해요.',
    translation: "I don't work.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'work', hint: '일하다' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '일', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '해요.' },
    ],
  },
  {
    id: 19,
    baseText: '저는 전화를 안 해요.',
    translation: "I don't call.",
    hints: [
      { content: 'I', hint: '저' },
      { content: "don't", hint: '안' },
      { content: 'call', hint: '전화하다' },
    ],
    items: [
      { id: '1', content: '저', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '전화', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '해요.' },
    ],
  },
  {
    id: 20,
    baseText: '민수는 영화를 안 봐요.',
    translation: "Min-su doesn't watch a movie.",
    hints: [
      { content: 'Min-su', hint: '민수' },
      { content: "doesn't", hint: '안' },
      { content: 'watch', hint: '보다' },
      { content: 'a', hint: '' },
      { content: 'movie', hint: '영화' },
    ],
    items: [
      { id: '1', content: '민수', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '영화', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '봐요.' },
    ],
  },
  {
    id: 21,
    baseText: '유나는 커피를 안 마셔요.',
    translation: "Yuna doesn't drink coffee.",
    hints: [
      { content: 'Yuna', hint: '유나' },
      { content: "doesn't", hint: '안' },
      { content: 'drink', hint: '마시다' },
      { content: 'coffee', hint: '커피' },
    ],
    items: [
      { id: '1', content: '유나', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '커피', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '마셔요.' },
    ],
  },
  {
    id: 22,
    baseText: '민수는 노래를 안 들어요.',
    translation: "Min-su doesn't listen to a song.",
    hints: [
      { content: 'Min-su', hint: '민수' },
      { content: "doesn't", hint: '안' },
      { content: 'listen to', hint: '듣다' },
      { content: 'a', hint: '' },
      { content: 'song', hint: '노래' },
    ],
    items: [
      { id: '1', content: '민수', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '노래', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '들어요.' },
    ],
  },
  {
    id: 23,
    baseText: '유나는 피자를 안 먹어요.',
    translation: "Yuna doesn't eat pizza.",
    hints: [
      { content: 'Yuna', hint: '유나' },
      { content: "doesn't", hint: '안' },
      { content: 'eat', hint: '먹다' },
      { content: 'pizza', hint: '피자' },
    ],
    items: [
      { id: '1', content: '유나', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '피자', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '먹어요.' },
    ],
  },
  {
    id: 24,
    baseText: '민수는 맥주를 안 마셔요.',
    translation: "Min-su doesn't drink beer.",
    hints: [
      { content: 'Min-su', hint: '민수' },
      { content: "doesn't", hint: '안' },
      { content: 'drink', hint: '마시다' },
      { content: 'beer', hint: '맥주' },
    ],
    items: [
      { id: '1', content: '민수', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '맥주', combineWithNext: true },
      { id: '4', content: '를', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '마셔요.' },
    ],
  },
  {
    id: 25,
    baseText: '유나는 아침을 안 먹어요.',
    translation: "Yuna doesn't eat breakfast.",
    hints: [
      { content: 'Yuna', hint: '유나' },
      { content: "doesn't", hint: '안' },
      { content: 'eat', hint: '먹다' },
      { content: 'breakfast', hint: '아침' },
    ],
    items: [
      { id: '1', content: '유나', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '아침', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '먹어요.' },
    ],
  },
  {
    id: 26,
    baseText: '유나는 점심을 안 먹어요.',
    translation: "Yuna doesn't eat lunch.",
    hints: [
      { content: 'Yuna', hint: '유나' },
      { content: "doesn't", hint: '안' },
      { content: 'eat', hint: '먹다' },
      { content: 'lunch', hint: '점심' },
    ],
    items: [
      { id: '1', content: '유나', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '점심', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '먹어요.' },
    ],
  },
  {
    id: 27,
    baseText: '유나는 저녁을 안 먹어요.',
    translation: "Yuna doesn't eat dinner.",
    hints: [
      { content: 'Yuna', hint: '유나' },
      { content: "doesn't", hint: '안' },
      { content: 'eat', hint: '먹다' },
      { content: 'dinner', hint: '저녁' },
    ],
    items: [
      { id: '1', content: '유나', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '저녁', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '먹어요.' },
    ],
  },
  {
    id: 28,
    baseText: '민수는 선생님을 안 만나요.',
    translation: "Min-su doesn't meet a teacher.",
    hints: [
      { content: 'Min-su', hint: '민수' },
      { content: "doesn't", hint: '안' },
      { content: 'meet', hint: '만나다' },
      { content: 'a', hint: '' },
      { content: 'teacher', hint: '선생님' },
    ],
    items: [
      { id: '1', content: '민수', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '선생님', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '만나요.' },
    ],
  },
  {
    id: 29,
    baseText: '민수는 쇼핑을 안 좋아해요.',
    translation: "Min-su doesn't like shopping.",
    hints: [
      { content: 'Min-su', hint: '민수' },
      { content: "doesn't", hint: '안' },
      { content: 'like', hint: '좋아하다' },
      { content: 'shopping', hint: '쇼핑' },
    ],
    items: [
      { id: '1', content: '민수', combineWithNext: true },
      { id: '2', content: '는', combineWithNext: false },
      { id: '3', content: '쇼핑', combineWithNext: true },
      { id: '4', content: '을', combineWithNext: false },
      { id: '5', content: '안', combineWithNext: false },
      { id: '6', content: '좋아해요.' },
    ],
  },
];
