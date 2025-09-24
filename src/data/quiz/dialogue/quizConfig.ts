import { QuizLevel, QuizSet, ThemeQuiz } from '@/types/quiz';

// 레벨별 퀴즈 설정
export const quizLevels: QuizLevel[] = [
  {
    level: 'beginner',
    requiredScore: 0,
    questions: [1, 2, 3, 4, 5],
  },
  {
    level: 'intermediate',
    requiredScore: 100,
    questions: [6, 7, 8, 9, 10],
  },
  {
    level: 'advanced',
    requiredScore: 200,
    questions: [11, 12, 13, 14, 15],
  },
];

// 세트별 퀴즈 설정
export const quizSets: QuizSet[] = [
  {
    id: 1,
    name: '기초 문장 세트 1',
    questionIds: [1, 2, 3, 4, 5],
  },
  {
    id: 2,
    name: '기초 문장 세트 2',
    questionIds: [6, 7, 8, 9, 10],
  },
  {
    id: 3,
    name: '기초 문장 세트 3',
    questionIds: [11, 12, 13, 14, 15],
  },
];

// 테마별 퀴즈 설정
export const themeQuizzes: ThemeQuiz[] = [
  {
    theme: 'occupation',
    name: '직업',
    description: '다양한 직업을 한국어로 표현해보세요',
    questionIds: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    theme: 'nationality',
    name: '국적',
    description: '여러 나라의 국적을 한국어로 배워보세요',
    questionIds: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  },
  {
    theme: 'daily_life',
    name: '일상생활',
    description: '일상생활에서 자주 사용하는 표현을 배워보세요',
    questionIds: [8, 9, 10],
  },
];
