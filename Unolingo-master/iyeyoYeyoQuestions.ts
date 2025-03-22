interface QuizVariation {
  type: 'Multiple Choice' | 'Fill in the blank' | 'Drag and Drop';
  grammarType: 'copula' | 'particle' | 'sentence' | 'wordOrder';
  question: string;
  options?: string[];
  correctAnswer?: string;
  words?: string[];
  correctOrder?: number[];
  explanation: string;
}

interface QuizQuestion {
  id: number;
  baseText: string;
  translation: string;
  variations: QuizVariation[];
}

export const iyeyoYeyoQuestions: QuizQuestion[] = [
  {
    id: 1,
    baseText: '저는 학생이에요.',
    translation: 'I am a student.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저는 학생(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '학생' ends in consonant 'ㅇ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저(_) 학생이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저는 학생(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '학생' because it ends in a consonant 'ㅇ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저(_) 학생이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저', '는', '학생', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저' (I) is the subject, '는' is the topic marker, '학생' (student) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 2,
    baseText: '저는 가수예요.',
    translation: 'I am a singer.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저는 가수(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '가수' ends in 'ㅜ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저(_) 가수예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저는 가수(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '가수' because it ends in a vowel 'ㅜ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저(_) 가수예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저', '는', '가수', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저' (I) is the subject, '는' is the topic marker, '가수' (singer) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 3,
    baseText: '저는 선생님이에요.',
    translation: 'I am a teacher.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저는 선생님(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '선생님' ends in 'ㅁ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저(_) 선생님이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저는 선생님(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '선생님' because it ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저(_) 선생님이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저', '는', '선생님', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저' (I) is the subject, '는' is the topic marker, '선생님' (teacher) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 4,
    baseText: '저는 의사예요.',
    translation: 'I am a doctor.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저는 의사(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '의사' ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저(_) 의사예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저는 의사(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '의사' because it ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저(_) 의사예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저', '는', '의사', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저' (I) is the subject, '는' is the topic marker, '의사' (doctor) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 5,
    baseText: '저는 회사원이에요.',
    translation: 'I am an office worker.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저는 회사원(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '회사원' ends in a consonant 'ㄴ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저(_) 회사원이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저는 회사원(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '회사원' because it ends in a consonant 'ㄴ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저(_) 회사원이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저', '는', '회사원', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저' (I) is the subject, '는' is the topic marker, '회사원' (office worker) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 6,
    baseText: '저는 가수예요.',
    translation: 'I am a singer.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저는 가수(_____)',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '가수' ends in 'ㅜ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저(_) 가수예요',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저는 가수(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '가수' because it ends in a vowel 'ㅜ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저(_) 가수예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저', '는', '가수', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저' (I) is the subject, '는' is the topic marker, '가수' (singer) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 7,
    baseText: '저는 배우예요.',
    translation: 'I am an actor.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저는 배우(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '배우' ends in a vowel 'ㅜ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저(_) 배우예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저는 배우(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '배우' because it ends in a vowel 'ㅜ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저(_) 배우예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저', '는', '배우', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저' (I) is the subject, '는' is the topic marker, '배우' (actor) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 8,
    baseText: '저는 경찰이에요.',
    translation: 'I am a police officer.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저는 경찰(_____)',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '경찰' ends in a consonant 'ㄹ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저(_) 경찰이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저는 경찰(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '경찰' because it ends in a consonant 'ㄹ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저(_) 경찰이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저', '는', '경찰', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저' (I) is the subject, '는' is the topic marker, '경찰' (police officer) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 9,
    baseText: '저는 요리사예요.',
    translation: 'I am a chef.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저는 요리사(_____)',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '요리사' ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저(_) 요리사예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저' ends in a vowel 'ㅓ' .",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저는 요리사(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '이에요' after '요리사' because it ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저(_) 요리사예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저', '는', '요리사', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저' (I) is the subject, '는' is the topic marker, '요리사' (chef) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 10,
    baseText: '저는 운동선수예요.',
    translation: 'I am an athlete.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저는 운동선수(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '운동선수' ends in a vowel 'ㅜ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저(_) 운동선수예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저는 운동선수(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '운동선수' because it ends in a vowel 'ㅜ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저(_) 운동선수예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저', '는', '운동선수', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저' (I) is the subject, '는' is the topic marker, '운동선수' (athlete) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 11,
    baseText: '이거는 책상이에요.',
    translation: 'This is a desk.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '이거는 책상(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '책상' ends in a consonant 'ㅇ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '이거(_) 책상이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '이거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이거는 책상(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '책상' because it ends in a consonant 'ㅇ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이거(_) 책상이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '이거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['이거', '는', '책상', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '이거' (this thing) is the subject, '는' is the topic marker, '책상' (desk) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 12,
    baseText: '저거는 의자예요.',
    translation: 'That is a chair.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저거는 의자(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '의자' ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저거(_) 의자예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저거는 의자(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '의자' because it ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저거(_) 의자예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저거', '는', '의자', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저거' (that thing) is the subject, '는' is the topic marker, '의자' (chair) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 13,
    baseText: '그거는 핸드폰이에요.',
    translation: 'That is a cell phone.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '그거는 핸드폰(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '핸드폰' ends in a consonant 'ㄴ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '그거(_) 핸드폰이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '그거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그거는 핸드폰(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '핸드폰' because it ends in a consonant 'ㄴ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그거(_) 핸드폰이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '그거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['그거', '는', '핸드폰', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '그거' (that thing) is the subject, '는' is the topic marker, '핸드폰' (cell phone) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 14,
    baseText: '그거는 펜이에요.',
    translation: 'That is a pen.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '그거는 펜(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '펜' ends in a consonant 'ㅂ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '그거(_) 펜이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '그거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그거는 펜(_____).',
        correctAnswer: '이에요',
        explanation: "The correct word is '이에요' after '펜' because it ends in a consonant 'ㅂ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그거(_) 펜이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '그거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['그거', '는', '펜', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '그거' (that thing) is the subject, '는' is the topic marker, '펜' (pen) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 15,
    baseText: '이거는 우유예요.',
    translation: 'This is milk.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '이거는 우유(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '우유' ends in a vowel 'ㅜ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '이거(_) 우유예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '이거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이거는 우유(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '우유' because it ends in a vowel 'ㅜ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이거(_) 우유예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '이거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['이거', '는', '우유', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '이거' (this thing) is the subject, '는' is the topic marker, '우유' (milk) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 16,
    baseText: '이거는 가방이에요.',
    translation: 'This is a bag.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '이거는 가방(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '가방' ends in a consonant 'ㅇ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '이거(_) 가방이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '이거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이거는 가방(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '가방' because it ends in a consonant 'ㅇ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이거(_) 가방이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '이거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['이거', '는', '가방', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '이거' (this thing) is the subject, '는' is the topic marker, '가방' (bag) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 17,
    baseText: '저거는 컴퓨터예요.',
    translation: 'That is a computer.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저거는 컴퓨터(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '컴퓨터' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저거(_) 컴퓨터예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저거는 컴퓨터(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '컴퓨터' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저거(_) 컴퓨터예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저거', '는', '컴퓨터', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저거' (that thing) is the subject, '는' is the topic marker, '컴퓨터' (computer) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 18,
    baseText: '이거는 침대예요.',
    translation: 'This is a bed.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '이거는 침대(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '침대' ends in a vowel 'ㅐ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '이거(_) 침대예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '이거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이거는 침대(_____).',
        correctAnswer: '이에요',
        explanation: "The correct word is '이에요' after '침대' because it ends in a vowel 'ㅐ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이거(_) 침대예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '이거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['이거', '는', '침대', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '이거' (this thing) is the subject, '는' is the topic marker, '침대' (bed) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 19,
    baseText: '그거는 우산이에요.',
    translation: 'This is an umbrella.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '그거는 우산(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '우산' ends in a consonant 'ㄴ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '그거(_) 우산이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '그거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그거는 우산(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '우산' because it ends in a consonant 'ㄴ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그거(_) 우산이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '이거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['그거', '는', '우산', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '그거' (that thing) is the subject, '는' is the topic marker, '우산' (umbrella) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 20,
    baseText: '저거는 모자예요.',
    translation: 'That is a hat.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저거는 모자(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '모자' ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저거(_) 모자예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저거는 모자(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '모자' because it ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저거(_) 모자예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저거', '는', '모자', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저거' (that thing) is the subject, '는' is the topic marker, '모자' (hat) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 21,
    baseText: '저는 한국사람이에요.',
    translation: 'I am Korean.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저는 한국사람(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '한국사람' ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저(_) 한국사람이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저는 한국사람(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '한국사람' because it ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저(_) 한국사람이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저', '는', '한국사람', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저' (I) is the subject, '는' is the topic marker, '한국사람' (Korean person) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 22,
    baseText: '저 남자는 학생이에요.',
    translation: 'That man is a student.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저 남자는 학생(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '학생' ends in a consonant 'ㅇ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저 남자(_) 학생이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저 남자' ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저 남자는 학생(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '학생' because it ends in a consonant 'ㅇ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저 남자(_) 학생이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저 남자' because it ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저 남자', '는', '학생', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저 남자' (that man) is the subject, '는' is the topic marker, '학생' (student) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 23,
    baseText: '그 여자는 선생님이에요.',
    translation: 'That woman is a teacher.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '그 여자는 선생님(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '선생님' ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '그 여자(_) 선생님이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '그 여자' ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그 여자는 선생님(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '선생님' because it ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그 여자(_) 선생님이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '그 여자' because it ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['그 여자', '는', '선생님', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '그 여자' (that woman) is the subject, '는' is the topic marker, '선생님' (teacher) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 24,
    baseText: '이 사람은 의사예요.',
    translation: 'This person is a doctor.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '이 사람은 의사(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '의사' ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '이 사람(_) 의사이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '은',
        explanation:
          "Use '은' after words ending in a consonant. '이 사람' ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이 사람은 의사(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '의사' because it ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이 사람(_) 의사이에요.',
        correctAnswer: '은',
        explanation:
          "The correct word is '은' after '이 사람' because it ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['이 사람', '은', '의사', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '이 사람' (this person) is the subject, '은' is the topic marker, '의사' (doctor) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 25,
    baseText: '저 사람은 배우예요.',
    translation: 'That person is an actor.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저 사람은 배우(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '배우' ends in a vowel 'ㅜ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저 사람(_) 배우예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '은',
        explanation:
          "Use '은' after words ending in a consonant. '저 사람' ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저 사람은 배우(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '배우' because it ends in a vowel 'ㅜ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저 사람(_) 배우예요.',
        correctAnswer: '은',
        explanation:
          "The correct word is '은' after '저 사람' because it ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저 사람', '은', '배우', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저 사람' (that person) is the subject, '은' is the topic marker, '배우' (actor) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 26,
    baseText: '이 의사는 한국 사람이에요.',
    translation: 'This doctor is Korean.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '이 의사는 한국 사람(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '한국 사람' ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '이 의사(_) 한국 사람이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '이 의사' ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이 의사는 한국 사람(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '한국사람' because it ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이 의사(_) 한국 사람이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '이 의사' because it ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['이 의사', '는', '한국 사람', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '이 의사' (this doctor) is the subject, '는' is the topic marker, '한국사람' (Korean person) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 27,
    baseText: '저 여자는 가수예요.',
    translation: 'That woman is a singer.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저 여자는 가수(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '가수' ends in a vowel 'ㅜ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저 여자(_) 가수예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저 여자' ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저 여자는 가수(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '가수' because it ends in a vowel 'ㅜ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저 여자(_) 가수예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저 여자' because it ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저 여자', '는', '가수', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저 여자' (that woman) is the subject, '는' is the topic marker, '가수' (singer) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 28,
    baseText: '저 사람은 학생이에요.',
    translation: 'That person is a student.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저 사람은 학생(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '학생' ends in a consonant 'ㅇ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저 사람(_) 학생이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '은',
        explanation:
          "Use '은' after words ending in a consonant. '저 사람' ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저 사람은 학생(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '학생' because it ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저 사람(_) 학생이에요.',
        correctAnswer: '은',
        explanation:
          "The correct word is '은' after '저 사람' because it ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저 사람', '은', '학생', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저 사람' (that person) is the subject, '은' is the topic marker, '학생' (student) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 29,
    baseText: '그 사람은 가수예요.',
    translation: 'That person is a singer.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '그 사람은 가수(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '가수' ends in a vowel 'ㅜ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '그 사람(_) 가수예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '은',
        explanation:
          "Use '은' after words ending in a consonant. '그 사람' ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그 사람은 가수(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '가수' because it ends in a vowel 'ㅜ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그 사람(_) 가수예요.',
        correctAnswer: '은',
        explanation:
          "The correct word is '은' after '그 사람' because it ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['그 사람', '은', '가수', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '그 사람' (that person) is the subject, '은' is the topic marker, '가수' (singer) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 30,
    baseText: '그 사람은 한국 사람이에요.',
    translation: 'That person is Korean.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '그 사람은 한국 사람(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '사람' ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '그 사람(_) 한국 사람이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '은',
        explanation:
          "Use '은' after words ending in a consonant. '그 사람' ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그 사람은 한국 사람(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '한국 사람' because it ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그 사람(_) 한국 사람이에요.',
        correctAnswer: '은',
        explanation:
          "The correct word is '은' after '그 사람' because it ends in a consonant 'ㅁ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['그 사람', '은', '한국', '사람', '이에요'],
        correctOrder: [0, 1, 2, 3, 4],
        explanation:
          "This sentence follows the basic Korean structure where '그 사람' (that person) is the subject, '은' is the topic marker, '한국 사람' (Korean person) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 31,
    baseText: '이거는 핸드폰이에요.',
    translation: 'This is a cell phone.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '이거는 핸드폰(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '핸드폰' ends in a consonant 'ㄴ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '이거(_) 핸드폰이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '이거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이거는 핸드폰(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '핸드폰' because it ends in a consonant 'ㄴ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이거(_) 핸드폰이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '이거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['이거', '는', '핸드폰', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '이거' (this thing) is the subject, '는' is the topic marker, '핸드폰' (cell phone) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 32,
    baseText: '그거는 컴퓨터예요.',
    translation: 'That is a computer.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '그거는 컴퓨터(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '컴퓨터' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '그거(_) 컴퓨터예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '그거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그거는 컴퓨터(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '컴퓨터' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그거(_) 컴퓨터예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '그거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['그거', '는', '컴퓨터', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '그거' (that thing) is the subject, '는' is the topic marker, '컴퓨터' (computer) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 33,
    baseText: '저거는 침대예요.',
    translation: 'That is a bed.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저거는 침대(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '침대' ends in a vowel 'ㅐ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저거(_) 침대예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저거는 침대(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '침대' because it ends in a vowel 'ㅐ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저거(_) 침대예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저거', '는', '침대', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저거' (that thing) is the subject, '는' is the topic marker, '침대' (bed) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 34,
    baseText: '이거는 우산이에요.',
    translation: 'This is an umbrella.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '이거는 우산(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '우산' ends in a consonant 'ㄴ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '이거(_) 우산이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '이거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이거는 우산(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '우산' because it ends in a consonant 'ㄴ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이거(_) 우산이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '이거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['이거', '는', '우산', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '이거' (this thing) is the subject, '는' is the topic marker, '우산' (umbrella) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 35,
    baseText: '저거는 책상이에요.',
    translation: 'That is a desk.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저거는 책상(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '책상' ends in a consonant 'ㅇ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저거(_) 책상이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저거는 책상(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '책상' because it ends in a consonant 'ㅇ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저거(_) 책상이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저거', '는', '책상', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저거' (that thing) is the subject, '는' is the topic marker, '책상' (desk) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 36,
    baseText: '이거는 의자예요.',
    translation: 'This is a chair.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '이거는 의자(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '의자' ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '이거(_) 의자예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '이거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이거는 의자(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '의자' because it ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이거(_) 의자예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '이거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['이거', '는', '의자', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '이거' (this thing) is the subject, '는' is the topic marker, '의자' (chair) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 37,
    baseText: '그거는 펜이에요.',
    translation: 'That is a pen.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '그거는 펜(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '펜' ends in a consonant 'ㄴ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '그거(_) 펜이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '그거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그거는 펜(_____).',
        correctAnswer: '이에요',
        explanation: "The correct word is '이에요' after '펜' because it ends in a consonant 'ㄴ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그거(_) 펜이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '그거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['그거', '는', '펜', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '그거' (that thing) is the subject, '는' is the topic marker, '펜' (pen) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 38,
    baseText: '저거는 가방이에요.',
    translation: 'That is a bag.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저거는 가방(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '가방' ends in a consonant 'ㅇ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저거(_) 가방이에요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '저거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저거는 가방(_____).',
        correctAnswer: '이에요',
        explanation:
          "The correct word is '이에요' after '가방' because it ends in a consonant 'ㅇ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저거(_) 가방이에요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '저거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저거', '는', '가방', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저거' (that thing) is the subject, '는' is the topic marker, '가방' (bag) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 39,
    baseText: '이거는 모자예요.',
    translation: 'This is a hat.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '이거는 모자(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '모자' ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '이거(_) 모자예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '이거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이거는 모자(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '모자' because it ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이거(_) 모자예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '이거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['이거', '는', '모자', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '이거' (this thing) is the subject, '는' is the topic marker, '모자' (hat) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 40,
    baseText: '그거는 컴퓨터예요.',
    translation: 'That is a computer.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '그거는 컴퓨터(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '컴퓨터' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '그거(_) 컴퓨터예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '그거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그거는 컴퓨터(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '컴퓨터' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '그거(_) 컴퓨터예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '그거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['그거', '는', '컴퓨터', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '그거' (that thing) is the subject, '는' is the topic marker, '컴퓨터' (computer) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 41,
    baseText: '이 우산은 제 거예요.',
    translation: 'This umbrella is mine.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '이 우산은 제 거(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '이 우산(_) 제 거예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '은',
        explanation:
          "Use '은' after words ending in a consonant. '이 우산' ends in a consonant 'ㄴ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이 우산은 제 거(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이 우산(_) 제 거예요.',
        correctAnswer: '은',
        explanation:
          "The correct word is '은' after '이 우산' because it ends in a consonant 'ㄴ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['이 우산', '은', '제 거', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '이 우산' (this umbrella) is the subject, '은' is the topic marker, '제 거' (my thing) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 42,
    baseText: '이 컴퓨터는 제 거예요.',
    translation: 'This computer is mine.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '이 컴퓨터는 제 거(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '이 컴퓨터(_) 제 거예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '컴퓨터' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이 컴퓨터는 제 거(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이 컴퓨터(_) 제 거예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '컴퓨터' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['이 컴퓨터', '는', '제 거', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '이 컴퓨터' (this computer) is the subject, '는' is the topic marker, '제 거' (my thing) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 43,
    baseText: '이 핸드폰은 제 거예요.',
    translation: 'This cell phone is mine.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '이 핸드폰은 제 거(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '이 핸드폰(_) 제 거예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '은',
        explanation:
          "Use '은' after words ending in a consonant. '핸드폰' ends in a consonant 'ㄴ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이 핸드폰은 제 거(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이 핸드폰(_) 제 거예요.',
        correctAnswer: '은',
        explanation: "The correct word is '은' after '핸드폰' because it ends in a consonant 'ㄴ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['이 핸드폰', '은', '제 거', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '이 핸드폰' (this cell phone) is the subject, '은' is the topic marker, '제 거' (my thing) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 44,
    baseText: '이 가방은 제 거예요.',
    translation: 'This bag is mine.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '이 가방은 제 거(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '이 가방(_) 제 거예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '은',
        explanation: "Use '은' after words ending in a consonant. '가방' ends in a consonant 'ㅇ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이 가방은 제 거(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이 가방(_) 제 거예요.',
        correctAnswer: '은',
        explanation: "The correct word is '은' after '가방' because it ends in a consonant 'ㅇ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['이 가방', '은', '제 거', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '이 가방' (this bag) is the subject, '은' is the topic marker, '제 거' (my thing) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 45,
    baseText: '이 모자는 제 거예요.',
    translation: 'This hat is mine.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '이 모자는 제 거(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '이 모자(_) 제 거예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '모자' ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이 모자는 제 거(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이 모자(_) 제 거예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '모자' because it ends in a vowel 'ㅏ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['이 모자', '는', '제 거', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '이 모자' (this hat) is the subject, '은' is the topic marker, '제 거' (my thing) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 46,
    baseText: '저 책상은 제 거예요.',
    translation: 'That desk is mine.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '저 책상은 제 거(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '예요',
        explanation: "Use '예요' after nouns ending in a vowel. '거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '저 책상(_) 제 거예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '은',
        explanation:
          "Use '은' after words ending in a consonant. '저 책상' ends in a consonant 'ㅇ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저 책상은 제 거(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '저 책상(_) 책상이에요.',
        correctAnswer: '은',
        explanation: "The correct word is '은' after '책상' because it ends in a consonant 'ㅇ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['저거', '는', '책상', '이에요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '저거' (that thing) is the subject, '는' is the topic marker, '책상' (desk) is the noun, and '이에요' is the copula that makes it a complete polite statement",
      },
    ],
  },
  {
    id: 47,
    baseText: '이 시계는 제 거예요.',
    translation: 'This watch is mine.',
    variations: [
      {
        type: 'Multiple Choice',
        grammarType: 'copula',
        question: '이 시계는 제 거(_____).',
        options: ['이에요', '예요', '있어요', '없어요'],
        correctAnswer: '이에요',
        explanation:
          "Use '이에요' after nouns ending in a consonant (받침). '거' ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Multiple Choice',
        grammarType: 'particle',
        question: '이 시계(_) 제 거예요.',
        options: ['은', '는', '을', '를'],
        correctAnswer: '는',
        explanation: "Use '는' after words ending in a vowel. '이 시계' ends in a vowel 'ㅖ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이 시계는 제 거(_____).',
        correctAnswer: '예요',
        explanation: "The correct word is '예요' after '거' because it ends in a vowel 'ㅓ'.",
      },
      {
        type: 'Fill in the blank',
        grammarType: 'sentence',
        question: '이 시계(_) 제 거예요.',
        correctAnswer: '는',
        explanation: "The correct word is '는' after '시계' because it ends in a vowel 'ㅖ'.",
      },
      {
        type: 'Drag and Drop',
        grammarType: 'wordOrder',
        question: 'Arrange the words to make a correct sentence',
        words: ['이 시계', '는', '제 거', '예요'],
        correctOrder: [0, 1, 2, 3],
        explanation:
          "This sentence follows the basic Korean structure where '이 시계' (this watch) is the subject, '는' is the topic marker, '제 거' (my thing) is the noun, and '예요' is the copula that makes it a complete polite statement",
      },
    ],
  },
];
