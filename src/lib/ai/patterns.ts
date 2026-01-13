/**
 * 문법별 대화 패턴 정의
 * 각 문법 주제에 대한 대화 템플릿과 예시를 정의합니다.
 */

import { TopicId } from '@/data/quiz/topics/meta';

/**
 * 어휘 유형 (영문)
 */
export type VocabularyType =
  | 'noun' // 명사
  | 'verb' // 동사
  | 'adjective' // 형용사
  | 'occupation' // 직업
  | 'nationality' // 국적
  | 'name' // 이름
  | 'location' // 장소
  | 'thing' // 물건
  | 'food' // 음식
  | 'time' // 시간
  | 'person' // 사람
  | 'other'; // 기타

/**
 * 대화 패턴
 */
export interface DialoguePattern {
  type: string; // 패턴 유형 (예: '직업', '국적', '동작')
  questionTemplate: string; // 질문 템플릿
  answerTemplate: string; // 답변 템플릿 ({어휘} 플레이스홀더 사용)
  examples: {
    vocabulary: string;
    question: string;
    answer: string;
    questionTranslation: string;
    answerTranslation: string;
  }[];
}

/**
 * 문법 주제별 패턴 정의
 */
export interface GrammarPatternDefinition {
  topicId: TopicId;
  grammarName: string;
  acceptedTypes: VocabularyType[]; // 허용되는 어휘 유형
  patterns: DialoguePattern[];
}

/**
 * 전체 문법 패턴 정의
 */
export const grammarPatterns: GrammarPatternDefinition[] = [
  // 1. 은/는, 이에요/예요
  {
    topicId: 'introduction',
    grammarName: '은/는, 이에요/예요',
    acceptedTypes: ['noun', 'occupation', 'nationality', 'name'],
    patterns: [
      {
        type: '직업',
        questionTemplate: '직업이 뭐예요?',
        answerTemplate: '저는 {어휘}이에요/예요.',
        examples: [
          {
            vocabulary: '학생',
            question: '직업이 뭐예요?',
            answer: '저는 학생이에요.',
            questionTranslation: 'What is your job?',
            answerTranslation: 'I am a student.',
          },
          {
            vocabulary: '의사',
            question: '무슨 일을 하세요?',
            answer: '저는 의사예요.',
            questionTranslation: 'What do you do for a living?',
            answerTranslation: 'I am a doctor.',
          },
        ],
      },
      {
        type: '국적',
        questionTemplate: '어느 나라 사람이에요?',
        answerTemplate: '저는 {국적} 사람이에요.',
        examples: [
          {
            vocabulary: '한국',
            question: '어느 나라 사람이에요?',
            answer: '저는 한국 사람이에요.',
            questionTranslation: 'Where are you from?',
            answerTranslation: 'I am Korean.',
          },
          {
            vocabulary: '미국',
            question: '케빈 씨는 어느 나라 사람이에요?',
            answer: '케빈 씨는 미국 사람이에요.',
            questionTranslation: 'Where is Kevin from?',
            answerTranslation: 'Kevin is American.',
          },
        ],
      },
      {
        type: '이름',
        questionTemplate: '이름이 뭐예요?',
        answerTemplate: '제 이름은 {이름}이에요/예요.',
        examples: [
          {
            vocabulary: '민수',
            question: '이름이 뭐예요?',
            answer: '제 이름은 민수예요.',
            questionTranslation: 'What is your name?',
            answerTranslation: 'My name is Minsu.',
          },
        ],
      },
    ],
  },

  // 2. 이거, 그거, 저거
  {
    topicId: 'demonstratives',
    grammarName: '이거, 그거, 저거',
    acceptedTypes: ['noun', 'thing'],
    patterns: [
      {
        type: '물건',
        questionTemplate: '이거는 뭐예요?',
        answerTemplate: '이거는 {물건}이에요/예요.',
        examples: [
          {
            vocabulary: '책',
            question: '이거는 뭐예요?',
            answer: '이거는 책이에요.',
            questionTranslation: 'What is this?',
            answerTranslation: 'This is a book.',
          },
          {
            vocabulary: '펜',
            question: '이거는 뭐예요?',
            answer: '이거는 펜이에요.',
            questionTranslation: 'What is this?',
            answerTranslation: 'This is a pen.',
          },
        ],
      },
      {
        type: '물건',
        questionTemplate: '그거는 뭐예요?',
        answerTemplate: '이거는 {어휘}이에요/예요.',
        examples: [
          {
            vocabulary: '책',
            question: '그거는 뭐예요?',
            answer: '이거는 책이에요.',
            questionTranslation: 'What is that?',
            answerTranslation: 'This is a book.',
          },
          {
            vocabulary: '가방',
            question: '그거는 뭐예요?',
            answer: '이거는 가방이에요.',
            questionTranslation: 'What is that?',
            answerTranslation: 'This is a bag.',
          },
        ],
      },
      {
        type: '물건',
        questionTemplate: '저거는 뭐예요?',
        answerTemplate: '저거는 {물건}이에요/예요.',
        examples: [
          {
            vocabulary: '책',
            question: '저거는 뭐예요?',
            answer: '저거는 책이에요.',
            questionTranslation: 'What is that?',
            answerTranslation: 'That is a book.',
          },
          {
            vocabulary: '펜',
            question: '저거는 뭐예요?',
            answer: '저거는 펜이에요.',
            questionTranslation: 'What is that?',
            answerTranslation: 'That is a pen.',
          },
        ],
      },
    ],
  },

  // 3. 이/가 아니에요
  {
    topicId: 'negation',
    grammarName: '이/가 아니에요',
    acceptedTypes: ['noun', 'thing', 'occupation', 'nationality'],
    patterns: [
      {
        type: '부정',
        questionTemplate: '{이/그/저} 사람은 {어휘}이에요/예요?',
        answerTemplate: '아니요, {어휘}이/가 아니에요.',
        examples: [
          {
            vocabulary: '학생',
            question: '이 사람은 학생이에요?',
            answer: '아니요, 학생이 아니에요.',
            questionTranslation: 'Is this person a student?',
            answerTranslation: 'No, this person is not a student.',
          },
          {
            vocabulary: '한국 사람',
            question: '그 사람은 한국 사람이에요?',
            answer: '아니요, 한국 사람이 아니에요.',
            questionTranslation: 'Is that person Korean?',
            answerTranslation: 'No, that person is not Korean.',
          },
          {
            vocabulary: '의사',
            question: '저 사람은 의사예요?',
            answer: '아니요, 의사가 아니에요.',
            questionTranslation: 'Is that person a doctor?',
            answerTranslation: 'No, that person is not a doctor.',
          },
        ],
      },
      {
        type: '부정',
        questionTemplate: '{이거/그거/저거}는 {물건}이에요/예요?',
        answerTemplate: '아니요, {물건}이/가 아니에요.',
        examples: [
          {
            vocabulary: '책',
            question: '이거는 책이에요?',
            answer: '아니요, 책이 아니에요.',
            questionTranslation: 'Is this a book?',
            answerTranslation: 'No, it is not a book.',
          },
          {
            vocabulary: '펜',
            question: '그거는 펜이에요?',
            answer: '아니요, 펜이 아니에요.',
            questionTranslation: 'Is that a pen?',
            answerTranslation: 'No, it is not a pen.',
          },
          {
            vocabulary: '가방',
            question: '저거는 가방이에요?',
            answer: '아니요, 가방이 아니에요.',
            questionTranslation: 'Is that a bag?',
            answerTranslation: 'No, it is not a bag.',
          },
        ],
      },
      {
        type: '부정',
        questionTemplate: '{이/그/저} {어휘}은 {어휘} 거예요?',
        answerTemplate: '아니요, {어휘} 거가 아니에요.',
        examples: [
          {
            vocabulary: '책',
            question: '이 책은 안나 씨 거예요?',
            answer: '아니요, 안나 씨 거가 아니에요.',
            questionTranslation: 'Is this book Anna\'s?',
            answerTranslation: 'No, it is not Anna\'s.',
          },
          {
            vocabulary: '책',
            question: '이 책은 안나 씨 거예요?',
            answer: '아니요, 제 거가 아니에요.',
            questionTranslation: 'Anna, Is this book yours?',
            answerTranslation: 'No, it is not mine.',
          },
          {
            vocabulary: '펜',
            question: '그 펜은 안나 씨 거예요?',
            answer: '아니요, 안나 씨 거가 아니에요.',
            questionTranslation: 'Is that pen Anna\'s?',
            answerTranslation: 'No, it is not Anna\'s.',
          },
          {
            vocabulary: '펜',
            question: '그 펜은 안나 씨 거예요?',
            answer: '아니요, 제 거가 아니에요.',
            questionTranslation: 'Anna, Is that pen yours?',
            answerTranslation: 'No, it is not mine.',
          },
          {
            vocabulary: '가방',
            question: '저 가방은 안나 씨 거예요?',
            answer: '아니요, 안나 씨 거가 아니에요.',
            questionTranslation: 'Is that bag Anna\'s?',
            answerTranslation: 'No, it is not Anna\'s.',
          },
          {
            vocabulary: '가방',
            question: '저 가방은 안나 씨 거예요?',
            answer: '아니요, 제 거가 아니에요.',
            questionTranslation: 'Anna, Is that bag yours?',
            answerTranslation: 'No, it is not mine.',
          },
        ],
      },
    ],
  },

  // 4. 여기, 거기, 저기
  {
    topicId: 'locations',
    grammarName: '여기, 거기, 저기',
    acceptedTypes: ['location', 'noun'],
    patterns: [
      {
        type: '장소',
        questionTemplate: '{여기/저기}는 어디예요?',
        answerTemplate: '{여기/저기}는 {장소}이에요/예요.',
        examples: [
          {
            vocabulary: '학교',
            question: '여기는 어디예요?',
            answer: '여기는 학교예요.',
            questionTranslation: 'Where is this?',
            answerTranslation: 'This is a school.',
          },
          {
            vocabulary: '도서관',
            question: '저기는 어디예요?',
            answer: '저기는 도서관이에요.',
            questionTranslation: 'Where is that over there?',
            answerTranslation: 'That over there is a library.',
          },
        ],
      },
      {
        type: '장소',
        questionTemplate: '{이/저} {명사}은/는 뭐예요?',
        answerTemplate: '{이/저} {명사}은/는 {장소}이에요/예요.',
        examples: [
          {
            vocabulary: '건물',
            question: '이 건물은 뭐예요?',
            answer: '이 건물은 학교예요.',
            questionTranslation: 'What is this building?',
            answerTranslation: 'This building is a school.',
          },
          {
            vocabulary: '건물',
            question: '저 건물은 뭐예요?',
            answer: '저 건물은 도서관이에요.',
            questionTranslation: 'What is that building over there?',
            answerTranslation: 'That building over there is a library.',
          },
        ],
      },
    ],
  },

  // 5. 있어요/없어요
  {
    topicId: 'existence',
    grammarName: '있어요/없어요',
    acceptedTypes: ['noun', 'location', 'thing', 'person', 'name', 'time', 'food'],
    patterns: [
      {
        type: '존재',
        questionTemplate: '{명사}이/가 어디에 있어요?',
        answerTemplate: '{명사}이/가 {장소}에 있어요.',
        examples: [
          {
            vocabulary: '의자',
            question: '의자가 어디에 있어요?',
            answer: '의자가 교실에 있어요.',
            questionTranslation: 'Where is the chair?',
            answerTranslation: 'The chair is in the classroom.',
          },
          {
            vocabulary: '선생님',
            question: '선생님이 어디에 있어요?',
            answer: '선생님이 교실에 있어요.',
            questionTranslation: 'Where is the teacher?',
            answerTranslation: 'The teacher is in the classroom.',
          },
          {
            vocabulary: '의자',
            question: '의자가 어디에 있어요?',
            answer: '교실에 의자가 있어요.',
            questionTranslation: 'Where is the chair?',
            answerTranslation: 'The chair is in the classroom.',
          },
          {
            vocabulary: '선생님',
            question: '선생님이 어디에 있어요?',
            answer: '교실에 선생님이 있어요.',
            questionTranslation: 'Where is the teacher?',
            answerTranslation: 'The teacher is in the classroom.',
          },
        ],
      },
      {
        type: '존재',
        questionTemplate: '{장소}에 뭐가 있어요?',
        answerTemplate: '{물건}이/가 {장소}에 있어요.',
        examples: [
          {
            vocabulary: '책상',
            question: '교실에 뭐가 있어요?',
            answer: '책상이 교실에 있어요.',
            questionTranslation: 'What is there in the classroom?',
            answerTranslation: 'There are desks in the classroom.',
          },
          {
            vocabulary: '책상',
            question: '교실에 뭐가 있어요?',
            answer: '교실에 책상이 있어요.',
            questionTranslation: 'What is there in the classroom?',
            answerTranslation: 'There are desks in the classroom.',
          },
          {
            vocabulary: '책상',
            question: '뭐가 교실에 있어요?',
            answer: '책상이 교실에 있어요.',
            questionTranslation: 'What is there in the classroom?',
            answerTranslation: 'There are desks in the classroom.',
          },
          {
            vocabulary: '책상',
            question: '뭐가 교실에 있어요?',
            answer: '교실에 책상이 있어요.',
            questionTranslation: 'What is there in the classroom?',
            answerTranslation: 'There are desks in the classroom.',
          },
        ],
      },
      {
        type: '부정존재',
        questionTemplate: '{장소}에 {명사}이/가 있어요?',
        answerTemplate: '{명사}이/가 {장소}에 없어요.',
        examples: [
          {
            vocabulary: '책상',
            question: '교실에 책상이 있어요?',
            answer: '책상이 교실에 없어요.',
            questionTranslation: 'Are there desks in the classroom?',
            answerTranslation: 'There are no desks in the classroom.',
          },
          {
            vocabulary: '선생님',
            question: '교실에 선생님이 있어요?',
            answer: '선생님이 교실에 없어요.',
            questionTranslation: 'Is the teacher in the classroom?',
            answerTranslation: 'The teacher is not in the classroom.',
          },
          {
            vocabulary: '책상',
            question: '교실에 책상이 있어요?',
            answer: '교실에 책상이 없어요.',
            questionTranslation: 'Are there desks in the classroom?',
            answerTranslation: 'There are no desks in the classroom.',
          },
          {
            vocabulary: '선생님',
            question: '교실에 선생님이 있어요?',
            answer: '교실에 선생님이 없어요.',
            questionTranslation: 'Is the teacher in the classroom?',
            answerTranslation: 'The teacher is not in the classroom.',
          },
        ],
      },
      {
        type: '존재',
        questionTemplate: '{장소}에 누가 있어요?',
        answerTemplate: '{사람}이/가 {장소}에 있어요.',
        examples: [
          {
            vocabulary: '선생님',
            question: '교실에 누가 있어요?',
            answer: '선생님이 교실에 있어요.',
            questionTranslation: 'Who is in the classroom?',
            answerTranslation: 'A teacher is in the classroom.',
          },
          {
            vocabulary: '민수',
            question: '교실에 누가 있어요?',
            answer: '민수가 교실에 있어요.',
            questionTranslation: 'Who is in the classroom?',
            answerTranslation: 'Min-su is in the classroom.',
          },
          {
            vocabulary: '선생님',
            question: '교실에 누가 있어요?',
            answer: '교실에 선생님이 있어요.',
            questionTranslation: 'Who is in the classroom?',
            answerTranslation: 'A teacher is in the classroom.',
          },
          {
            vocabulary: '민수',
            question: '교실에 누가 있어요?',
            answer: '교실에 민수가 있어요.',
            questionTranslation: 'Who is in the classroom?',
            answerTranslation: 'Min-su is in the classroom.',
          },
        ],
      },
      {
        type: '존재',
        questionTemplate: '{시간} {명사}이/가 있어요?',
        answerTemplate: '네, {시간} {명사}이/가 있어요.',
        examples: [
          {
            vocabulary: '핸드폰',
            question: '핸드폰이 있어요?',
            answer: '네, 핸드폰이 있어요.',
            questionTranslation: 'Do you have a phone?',
            answerTranslation: 'Yes, I have a phone.',
          },
          {
            vocabulary: '핸드폰',
            question: '지금 핸드폰이 있어요?',
            answer: '네, 지금 핸드폰이 있어요.',
            questionTranslation: 'Do you have a phone now?',
            answerTranslation: 'Yes, I have a phone now.',
          },
          {
            vocabulary: '선생님',
            question: '선생님이 있어요?',
            answer: '네, 선생님이 있어요.',
            questionTranslation: 'Do you have a teacher?',
            answerTranslation: 'Yes, I have a teacher.',
          },
          {
            vocabulary: '선생님',
            question: '지금 선생님이 있어요?',
            answer: '네, 지금 선생님이 있어요.',
            questionTranslation: 'Do you have a teacher now?',
            answerTranslation: 'Yes, I have a teacher now.',
          },
        ],
      },
      {
        type: '부정존재',
        questionTemplate: '{시간} {명사}이/가 있어요?',
        answerTemplate: '아니요, {시간} {명사}이/가 없어요.',
        examples: [
          {
            vocabulary: '충전기',
            question: '충전기가 있어요?',
            answer: '아니요, 충전기가 없어요.',
            questionTranslation: 'Do you have a charger?',
            answerTranslation: 'No, I do not have a charger.',
          },
          {
            vocabulary: '충전기',
            question: '지금 충전기가 있어요?',
            answer: '아니요, 지금 충전기가 없어요.',
            questionTranslation: 'Do you have a charger now?',
            answerTranslation: 'No, I do not have a charger now.',
          },
          {
            vocabulary: '선생님',
            question: '선생님이 있어요?',
            answer: '아니요, 선생님이 없어요.',
            questionTranslation: 'Do you have a teacher?',
            answerTranslation: 'No, I do not have a teacher.',
          },
          {
            vocabulary: '선생님',
            question: '지금 선생님이 있어요?',
            answer: '아니요, 지금 선생님이 없어요.',
            questionTranslation: 'Do you have a teacher now?',
            answerTranslation: 'No, I do not have a teacher now.',
          },
        ],
      },
      {
        type: '수량',
        questionTemplate: '{명사}이/가 몇 {단위명사} 있어요?',
        answerTemplate: '{명사}이/가 {숫자} {단위명사} 있어요.',
        examples: [
          {
            vocabulary: '사람',
            question: '사람이 몇 명 있어요?',
            answer: '사람이 두 명 있어요.',
            questionTranslation: 'How many people are there?',
            answerTranslation: 'There are two people.',
          },
          {
            vocabulary: '사과',
            question: '사과가 몇 개 있어요?',
            answer: '사과가 다섯 개 있어요.',
            questionTranslation: 'How many apples are there?',
            answerTranslation: 'There are five apples.',
          },
          {
            vocabulary: '커피',
            question: '커피가 몇 잔 있어요?',
            answer: '커피가 세 잔 있어요.',
            questionTranslation: 'How many cups of coffee are there?',
            answerTranslation: 'There are three cups of coffee.',
          },
          {
            vocabulary: '고양이',
            question: '고양이가 몇 마리 있어요?',
            answer: '고양이가 세 마리 있어요.',
            questionTranslation: 'How many cats are there?',
            answerTranslation: 'There are three cats.',
          },
          {
            vocabulary: '책',
            question: '책이 몇 권 있어요?',
            answer: '책이 여덟 권 있어요.',
            questionTranslation: 'How many books are there?',
            answerTranslation: 'There are eight books.',
          },
          {
            vocabulary: '맥주',
            question: '맥주가 몇 병 있어요?',
            answer: '맥주가 세 병 있어요.',
            questionTranslation: 'How many bottles of beer are there?',
            answerTranslation: 'There are three bottles of beer.',
          },
        ],
      },
      {
        type: '수량',
        questionTemplate: '{장소}에 {명사}이/가 몇 {단위명사} 있어요?',
        answerTemplate: '{장소}에 {명사}이/가 {숫자} {단위명사} 있어요.',
        examples: [
          {
            vocabulary: '사람',
            question: '식당에 사람이 몇 명 있어요?',
            answer: '식당에 사람이 일곱 명 있어요.',
            questionTranslation: 'How many people are there in the restaurant?',
            answerTranslation: 'There are seven people in the restaurant.',
          },
          {
            vocabulary: '커피',
            question: '카페에 커피가 몇 잔 있어요?',
            answer: '카페에 커피가 세 잔 있어요.',
            questionTranslation: 'How many cups of coffee are there in the cafe?',
            answerTranslation: 'There are three cups of coffee in the cafe.',
          },
          {
            vocabulary: '책',
            question: '도서관에 책이 몇 권 있어요?',
            answer: '도서관에 책이 여덟 권 있어요.',
            questionTranslation: 'How many books are there in the library?',
            answerTranslation: 'There are eight books in the library.',
          },
          {
            vocabulary: '고양이',
            question: '집에 고양이가 몇 마리 있어요?',
            answer: '집에 고양이가 네 마리 있어요.',
            questionTranslation: 'How many cats are there in the house?',
            answerTranslation: 'There are four cats in the house.',
          },
          {
            vocabulary: '맥주',
            question: '식당에 맥주가 몇 병 있어요?',
            answer: '식당에 맥주가 열 병 있어요.',
            questionTranslation: 'How many bottles of beer are there in the restaurant?',
            answerTranslation: 'There are ten bottles of beer in the restaurant.',
          },
        ],
      },
    ],
  },

  // 6. 을/를, 아요/어요
  {
    topicId: 'basic-verbs',
    grammarName: '을/를, 아요/어요',
    acceptedTypes: ['verb', 'noun', 'thing', 'food', 'person', 'name'],
    patterns: [
      {
        type: '동작',
        questionTemplate: '무엇을 {동사}?',
        answerTemplate: '저는 {목적어}을/를 {동사}.',
        examples: [
          {
            vocabulary: '읽다',
            question: '무엇을 읽어요?',
            answer: '저는 책을 읽어요.',
            questionTranslation: 'What do you read?',
            answerTranslation: 'I read a book.',
          },
          {
            vocabulary: '읽다',
            question: '뭐를 읽어요?',
            answer: '저는 책을 읽어요.',
            questionTranslation: 'What do you read?',
            answerTranslation: 'I read a book.',
          },
          {
            vocabulary: '읽다',
            question: '뭐 읽어요?',
            answer: '저는 책을 읽어요.',
            questionTranslation: 'What do you read?',
            answerTranslation: 'I read a book.',
          },
          {
            vocabulary: '읽다',
            question: '뭘 읽어요?',
            answer: '저는 책을 읽어요.',
            questionTranslation: 'What do you read?',
            answerTranslation: 'I read a book.',
          },
          {
            vocabulary: '먹다',
            question: '무엇을 먹어요?',
            answer: '저는 밥을 먹어요.',
            questionTranslation: 'What do you eat?',
            answerTranslation: 'I eat rice.',
          },
          {
            vocabulary: '마시다',
            question: '무엇을 마셔요?',
            answer: '저는 커피를 마셔요.',
            questionTranslation: 'What do you drink?',
            answerTranslation: 'I drink coffee.',
          },
        ],
      },
      {
        type: '동작',
        questionTemplate: '누구를 만나요?',
        answerTemplate: '저는 {사람}을/를 만나요.',
        examples: [
          {
            vocabulary: '친구',
            question: '누구를 만나요?',
            answer: '저는 친구를 만나요.',
            questionTranslation: 'Who do you meet?',
            answerTranslation: 'I meet a friend.',
          },
          {
            vocabulary: '민수',
            question: '누구를 만나요?',
            answer: '저는 민수를 만나요.',
            questionTranslation: 'Who do you meet?',
            answerTranslation: 'I meet Min-su.',
          },
        ],
      },
      {
        type: '동작',
        questionTemplate: '뭘 해요?',
        answerTemplate: '저는 {동사}.',
        examples: [
          {
            vocabulary: '공부하다',
            question: '무엇을 해요?',
            answer: '저는 공부해요.',
            questionTranslation: 'What do you do?',
            answerTranslation: 'I study.',
          },
          {
            vocabulary: '공부하다',
            question: '뭐를 해요?',
            answer: '저는 공부해요.',
            questionTranslation: 'What do you do?',
            answerTranslation: 'I study.',
          },
          {
            vocabulary: '공부하다',
            question: '뭐 해요?',
            answer: '저는 공부해요.',
            questionTranslation: 'What do you do?',
            answerTranslation: 'I study.',
          },
          {
            vocabulary: '공부하다',
            question: '뭘 해요?',
            answer: '저는 공부해요.',
            questionTranslation: 'What do you do?',
            answerTranslation: 'I study.',
          },
        ],
      },
      {
        type: '동작',
        questionTemplate: '{이름}는 무엇을 {동사}?',
        answerTemplate: '{이름}는 {목적어}을/를 {동사}.',
        examples: [
          {
            vocabulary: '영화',
            question: '민수는 무엇을 봐요?',
            answer: '민수는 영화를 봐요.',
            questionTranslation: 'What does Min-su watch?',
            answerTranslation: 'Min-su watches a movie.',
          },
          {
            vocabulary: '영화',
            question: '민수는 뭐를 봐요?',
            answer: '민수는 영화를 봐요.',
            questionTranslation: 'What does Min-su watch?',
            answerTranslation: 'Min-su watches a movie.',
          },
          {
            vocabulary: '영화',
            question: '민수는 뭐 봐요?',
            answer: '민수는 영화를 봐요.',
            questionTranslation: 'What does Min-su watch?',
            answerTranslation: 'Min-su watches a movie.',
          },
          {
            vocabulary: '영화',
            question: '민수는 뭘 봐요?',
            answer: '민수는 영화를 봐요.',
            questionTranslation: 'What does Min-su watch?',
            answerTranslation: 'Min-su watches a movie.',
          },
        ],
      },
    ],
  },

  // 7. 안
  {
    topicId: 'negative-sentences',
    grammarName: '안',
    acceptedTypes: ['verb', 'noun', 'thing', 'food', 'name'],
    patterns: [
      {
        type: '부정동작',
        questionTemplate: '{목적어}을/를 {동사}?',
        answerTemplate: '아니요, 저는 {목적어}을/를 안 {동사}.',
        examples: [
          {
            vocabulary: '책',
            question: '책을 읽어요?',
            answer: '아니요, 저는 책을 안 읽어요.',
            questionTranslation: 'Do you read books?',
            answerTranslation: "No, I don't read books.",
          },
          {
            vocabulary: '커피',
            question: '커피를 마셔요?',
            answer: '아니요, 저는 커피를 안 마셔요.',
            questionTranslation: 'Do you drink coffee?',
            answerTranslation: "No, I don't drink coffee.",
          },
        ],
      },
      {
        type: '부정동작',
        questionTemplate: '{이름}는 {목적어}을/를 {동사}?',
        answerTemplate: '아니요, {이름}는 {목적어}을/를 안 {동사}.',
        examples: [
          {
            vocabulary: '영화',
            question: '민수는 영화를 봐요?',
            answer: '아니요, 민수는 영화를 안 봐요.',
            questionTranslation: 'Does Min-su watch movies?',
            answerTranslation: "No, Min-su doesn't watch movies.",
          },
        ],
      },
      {
        type: '부정동작',
        questionTemplate: '{하다동사}?',
        answerTemplate: '아니요, {하다명사형}을/를 안 해요.',
        examples: [
          {
            vocabulary: '공부하다',
            question: '공부해요?',
            answer: '아니요, 공부 안 해요.',
            questionTranslation: 'Do you study?',
            answerTranslation: 'No, I do not study.',
          },
          {
            vocabulary: '공부하다',
            question: '공부해요?',
            answer: '아니요, 공부를 안 해요.',
            questionTranslation: 'Do you study?',
            answerTranslation: 'No, I do not study.',
          },
          {
            vocabulary: '일하다',
            question: '일해요?',
            answer: '아니요, 일 안 해요.',
            questionTranslation: 'Do you work?',
            answerTranslation: 'No, I do not work.',
          },
          {
            vocabulary: '일하다',
            question: '일해요?',
            answer: '아니요, 일을 안 해요.',
            questionTranslation: 'Do you work?',
            answerTranslation: 'No, I do not work.',
          },
        ],
      },
    ],
  },

  // 8. 에 가요/와요
  {
    topicId: 'movement',
    grammarName: '에 가요/와요',
    acceptedTypes: ['location', 'name', 'person'],
    patterns: [
      {
        type: '이동',
        questionTemplate: '어디에 가요?',
        answerTemplate: '저는 {장소}에 가요.',
        examples: [
          {
            vocabulary: '학교',
            question: '어디에 가요?',
            answer: '저는 학교에 가요.',
            questionTranslation: 'Where do you go?',
            answerTranslation: 'I go to school.',
          },
          {
            vocabulary: '집',
            question: '어디에 가요?',
            answer: '저는 집에 가요.',
            questionTranslation: 'Where do you go?',
            answerTranslation: 'I go home.',
          },
        ],
      },
      {
        type: '이동',
        questionTemplate: '{이름}는 어디에 가요?',
        answerTemplate: '{이름}는 {장소}에 가요.',
        examples: [
          {
            vocabulary: '친구 집',
            question: '민수는 어디에 가요?',
            answer: '민수는 친구 집에 가요.',
            questionTranslation: 'Where does Min-su go?',
            answerTranslation: "Min-su goes to his friend's house.",
          },
        ],
      },
      {
        type: '이동',
        questionTemplate: '{이름}와/과/하고 어디에 가요?',
        answerTemplate: '저는 {이름}와/과/하고 {장소}에 가요.',
        examples: [
          {
            vocabulary: '영화관',
            question: '친구하고 어디에 가요?',
            answer: '저는 친구하고 영화관에 가요.',
            questionTranslation: 'Where do you go with a friend?',
            answerTranslation: 'I go to the movie theater with a friend.',
          },
          {
            vocabulary: '영화관',
            question: '친구와 어디에 가요?',
            answer: '저는 친구와 영화관에 가요.',
            questionTranslation: 'Where do you go with a friend?',
            answerTranslation: 'I go to the movie theater with a friend.',
          },
          {
            vocabulary: '도서관',
            question: '동생과 어디에 가요?',
            answer: '저는 동생과 도서관에 가요.',
            questionTranslation: 'Where do you go with your younger sibling?',
            answerTranslation: 'I go to the library with my younger sibling.',
          },
        ],
      },
      {
        type: '부정이동',
        questionTemplate: '{장소}에 가요?',
        answerTemplate: '아니요. 저는 {장소}에 안 가요.',
        examples: [
          {
            vocabulary: '학교',
            question: '학교에 가요?',
            answer: '아니요. 저는 학교에 안 가요.',
            questionTranslation: 'Do you go to school?',
            answerTranslation: "No. I don't go to school.",
          },
        ],
      },
      {
        type: '이동',
        questionTemplate: '{이름}는 오늘 집에 와요?',
        answerTemplate: '네, {이름}는 오늘 집에 와요.',
        examples: [
          {
            vocabulary: '엄마',
            question: '엄마는 오늘 집에 와요?',
            answer: '네, 엄마는 오늘 집에 와요.',
            questionTranslation: 'Does mom come home today?',
            answerTranslation: 'Yes, mom comes home today.',
          },
        ],
      },
    ],
  },

  // 9. 에서
  {
    topicId: 'location-actions',
    grammarName: '에서',
    acceptedTypes: ['location', 'verb', 'noun', 'thing', 'food', 'person'],
    patterns: [
      {
        type: '장소동작',
        questionTemplate: '어디에서 {동사}?',
        answerTemplate: '저는 {장소}에서 {동사}.',
        examples: [
          {
            vocabulary: '도서관',
            question: '어디에서 공부해요?',
            answer: '저는 도서관에서 공부해요.',
            questionTranslation: 'Where do you study?',
            answerTranslation: 'I study at the library.',
          },
          {
            vocabulary: '공원',
            question: '어디에서 산책해요?',
            answer: '저는 공원에서 산책해요.',
            questionTranslation: 'Where do you walk?',
            answerTranslation: 'I walk in the park.',
          },
          {
            vocabulary: '헬스장',
            question: '어디에서 운동해요?',
            answer: '저는 헬스장에서 운동해요.',
            questionTranslation: 'Where do you exercise?',
            answerTranslation: 'I exercise at the gym.',
          },
          {
            vocabulary: '회사',
            question: '어디에서 일해요?',
            answer: '저는 회사에서 일해요.',
            questionTranslation: 'Where do you work?',
            answerTranslation: 'I work at the company.',
          },
          {
            vocabulary: '백화점',
            question: '어디에서 쇼핑해요?',
            answer: '저는 백화점에서 쇼핑해요.',
            questionTranslation: 'Where do you shop?',
            answerTranslation: 'I shop at the department store.',
          },
          {
            vocabulary: '식당',
            question: '어디에서 요리해요?',
            answer: '저는 식당에서 요리해요.',
            questionTranslation: 'Where do you cook?',
            answerTranslation: 'I cook at the restaurant.',
          },
        ],
      },
      {
        type: '장소동작',
        questionTemplate: '어디에서 {목적어}을/를 {동사}?',
        answerTemplate: '저는 {장소}에서 {목적어}을/를 {동사}.',
        examples: [
          {
            vocabulary: '책',
            question: '어디에서 책을 빌려요?',
            answer: '저는 도서관에서 책을 빌려요.',
            questionTranslation: 'Where do you borrow a book?',
            answerTranslation: 'I borrow a book at the library.',
          },
          {
            vocabulary: '한국어',
            question: '어디에서 한국어를 배워요?',
            answer: '저는 학교에서 한국어를 배워요.',
            questionTranslation: 'Where do you study Korean?',
            answerTranslation: 'I study Korean at the school.',
          },
          {
            vocabulary: '영어',
            question: '어디에서 영어를 공부해요?',
            answer: '저는 미국에서 영어를 공부해요.',
            questionTranslation: 'Where do you study English?',
            answerTranslation: 'I study English in the United States.',
          },
          {
            vocabulary: '돈',
            question: '어디에서 돈을 찾아요?',
            answer: '저는 은행에서 돈을 찾아요.',
            questionTranslation: 'Where do you withdraw money?',
            answerTranslation: 'I withdraw money at the bank.',
          },
        ],
      },
      {
        type: '장소동작',
        questionTemplate: '어디에서 {명사}와/과/하고 {동사}?',
        answerTemplate: '저는 {장소}에서 {명사}와/과/하고 {동사}.',
        examples: [
          {
            vocabulary: '친구',
            question: '어디에서 친구하고 이야기해요?',
            answer: '저는 카페에서 친구하고 이야기해요.',
            questionTranslation: 'Where do you talk with a friend?',
            answerTranslation: 'I talk to a friend at the cafe.',
          },
          {
            vocabulary: '친구',
            question: '어디에서 친구와 이야기해요?',
            answer: '저는 카페에서 친구와 이야기해요.',
            questionTranslation: 'Where do you talk with a friend?',
            answerTranslation: 'I talk to a friend at the cafe.',
          },
          {
            vocabulary: '아빠',
            question: '어디에서 아빠하고 이야기해요?',
            answer: '저는 집에서 아빠하고 이야기해요.',
            questionTranslation: 'Where do you talk with your father?',
            answerTranslation: 'I talk to my father at home.',
          },
          {
            vocabulary: '가족',
            question: '어디에서 가족과 이야기해요?',
            answer: '저는 집에서 가족과 이야기해요.',
            questionTranslation: 'Where do you talk with your family?',
            answerTranslation: 'I talk to my family at home.',
          },
        ],
      },
      {
        type: '장소동작',
        questionTemplate: '어디에서 {명사}한테 {동사}?',
        answerTemplate: '저는 {장소}에서 {명사}한테 {동사}.',
        examples: [
          {
            vocabulary: '엄마',
            question: '어디에서 엄마한테 전화해요?',
            answer: '저는 학교에서 엄마한테 전화해요.',
            questionTranslation: 'Where do you call your mother?',
            answerTranslation: 'I call my mother at school.',
          },
        ],
      },
      {
        type: '장소동작',
        questionTemplate: '{장소}에서 {목적어}을/를 {동사}?',
        answerTemplate: '아니요. 저는 {장소}에서 {목적어}을/를 안 {동사}.',
        examples: [
          {
            vocabulary: '수업',
            question: '교실에서 수업을 들어요?',
            answer: '아니요. 저는 교실에서 수업을 안 들어요.',
            questionTranslation: 'Do you take a class in the classroom?',
            answerTranslation: "No. I don't take a class in the classroom.",
          },
          {
            vocabulary: '한국어',
            question: '학교에서 한국어를 배워요?',
            answer: '아니요. 저는 학교에서 한국어를 안 배워요.',
            questionTranslation: 'Do you learn Korean at school?',
            answerTranslation: "No. I don't learn Korean at school.",
          },
          {
            vocabulary: '책',
            question: '집에서 책을 읽어요?',
            answer: '아니요. 저는 집에서 책을 안 읽어요.',
            questionTranslation: 'Do you read books at home?',
            answerTranslation: "No. I don't read books at home.",
          },
        ],
      },
      {
        type: '장소동작',
        questionTemplate: '{장소}에서 {하다동사}?',
        answerTemplate: '아니요. 저는 {장소}에서 {하다명사형}을/를 안 해요.',
        examples: [
          {
            vocabulary: '공부하다',
            question: '도서관에서 공부해요?',
            answer: '아니요. 저는 도서관에서 공부를 안 해요.',
            questionTranslation: 'Do you study at the library?',
            answerTranslation: "No. I don't study at the library.",
          },
          {
            vocabulary: '일하다',
            question: '회사에서 일해요?',
            answer: '아니요. 저는 회사에서 일을 안 해요.',
            questionTranslation: 'Do you work at the company?',
            answerTranslation: "No. I don't work at the company.",
          },
          {
            vocabulary: '쇼핑하다',
            question: '백화점에서 쇼핑해요?',
            answer: '아니요. 저는 백화점에서 쇼핑을 안 해요.',
            questionTranslation: 'Do you shop at the department store?',
            answerTranslation: "No. I don't shop at the department store.",
          },
          {
            vocabulary: '운동하다',
            question: '공원에서 운동해요?',
            answer: '아니요. 저는 공원에서 운동을 안 해요.',
            questionTranslation: 'Do you exercise at the park?',
            answerTranslation: "No. I don't exercise at the park.",
          },
        ],
      },
    ],
  },

  // 10. 았어요/었어요
  {
    topicId: 'past-tense',
    grammarName: '았어요/었어요',
    acceptedTypes: ['verb', 'location', 'time', 'name', 'person', 'noun', 'thing'],
    patterns: [
      {
        type: '과거동작',
        questionTemplate: '{시간} 어디에 갔어요?',
        answerTemplate: '{사람}은/는 {시간} {장소}에 갔어요.',
        examples: [
          {
            vocabulary: '화장실',
            question: '어디에 갔어요?',
            answer: '저는 화장실에 갔어요.',
            questionTranslation: 'Where did you go?',
            answerTranslation: 'I went to the bathroom.',
          },
          {
            vocabulary: '학교',
            question: '어제 어디에 갔어요?',
            answer: '저는 어제 학교에 갔어요.',
            questionTranslation: 'Where did you go yesterday?',
            answerTranslation: 'I went to school yesterday.',
          },
          {
            vocabulary: '한국',
            question: '지난주에 어디에 갔어요?',
            answer: '저는 지난주에 한국에 갔어요.',
            questionTranslation: 'Where did you go last week?',
            answerTranslation: 'I went to Korea last week.',
          },
          {
            vocabulary: '집',
            question: '민수는 어제 어디에 갔어요?',
            answer: '민수는 어제 집에 갔어요.',
            questionTranslation: 'Where did Min-su go yesterday?',
            answerTranslation: 'Min-su went home yesterday.',
          },
          {
            vocabulary: '도서관',
            question: '선생님은 지난주에 어디에 갔어요?',
            answer: '선생님은 지난주에 도서관에 갔어요.',
            questionTranslation: 'Where did the teacher go last week?',
            answerTranslation: 'The teacher went to the library last week.',
          },
        ],
      },
      {
        type: '과거동작',
        questionTemplate: '{시간} 누가 {장소}에 갔어요?',
        answerTemplate: '{사람}이/가 {시간} {장소}에 갔어요.',
        examples: [
          {
            vocabulary: '도서관',
            question: '누가 도서관에 갔어요?',
            answer: '민수가 도서관에 갔어요.',
            questionTranslation: 'Who went to the library?',
            answerTranslation: 'Min-su went to the library.',
          },
          {
            vocabulary: '영화관',
            question: '어제 누가 영화관에 갔어요?',
            answer: '유나가 어제 영화관에 갔어요.',
            questionTranslation: 'Who went to the movie theater yesterday?',
            answerTranslation: 'Yuna went to the movie theater yesterday.',
          },
          {
            vocabulary: '한국',
            question: '지난주에 누가 한국에 갔어요?',
            answer: '선생님이 지난주에 한국에 갔어요.',
            questionTranslation: 'Who went to Korea last week?',
            answerTranslation: 'The teacher went to Korea last week.',
          },
        ],
      },
      {
        type: '과거동작',
        questionTemplate: '{시간} 누가 {장소}에 왔어요?',
        answerTemplate: '{사람}이/가 {시간} {장소}에 왔어요.',
        examples: [
          {
            vocabulary: '집',
            question: '누가 집에 왔어요?',
            answer: '언니가 집에 왔어요.',
            questionTranslation: 'Who came to the house?',
            answerTranslation: 'My sister came to the house.',
          },
          {
            vocabulary: '학교',
            question: '어제 누가 학교에 왔어요?',
            answer: '오빠가 어제 학교에 왔어요.',
            questionTranslation: 'Who came to school yesterday?',
            answerTranslation: 'My brother came to school yesterday.',
          },
        ],
      },
      {
        type: '과거동작',
        questionTemplate: '누구하고 {장소}에 갔어요?',
        answerTemplate: '저는 {사람}와/과/하고 {장소}에 갔어요.',
        examples: [
          {
            vocabulary: '엄마',
            question: '누구하고 쇼핑몰에 갔어요?',
            answer: '저는 엄마하고 쇼핑몰에 갔어요.',
            questionTranslation: 'Who did you go to the shopping mall with?',
            answerTranslation: 'I went to the shopping mall with my mother.',
          },
          {
            vocabulary: '친구',
            question: '누구하고 영화관에 갔어요?',
            answer: '저는 친구와 영화관에 갔어요.',
            questionTranslation: 'Who did you go to the movie theater with?',
            answerTranslation: 'I went to the movie theater with my friend.',
          },
          {
            vocabulary: '가족',
            question: '누구하고 한국에 갔어요?',
            answer: '저는 가족과 한국에 갔어요.',
            questionTranslation: 'Who did you go to Korea with?',
            answerTranslation: 'I went to Korea with my family.',
          },
        ],
      },
      {
        type: '과거동작',
        questionTemplate: '어디에서 {목적어}을/를 {과거형동사}?',
        answerTemplate: '저는 {장소}에서 {목적어}을/를 {과거형동사}.',
        examples: [
          {
            vocabulary: '듣다',
            question: '어디에서 수업을 들었어요?',
            answer: '저는 교실에서 수업을 들었어요.',
            questionTranslation: 'Where did you take a class?',
            answerTranslation: 'I took a class at the classroom.',
          },
          {
            vocabulary: '빌리다',
            question: '어디에서 책을 빌렸어요?',
            answer: '저는 도서관에서 책을 빌렸어요.',
            questionTranslation: 'Where did you borrow a book?',
            answerTranslation: 'I borrowed a book at the library.',
          },
          {
            vocabulary: '마시다',
            question: '어디에서 커피를 마셨어요?',
            answer: '저는 카페에서 커피를 마셨어요.',
            questionTranslation: 'Where did you drink coffee?',
            answerTranslation: 'I drank coffee at the cafe.',
          },
          {
            vocabulary: '산책하다',
            question: '어디에서 산책했어요?',
            answer: '저는 공원에서 산책했어요.',
            questionTranslation: 'Where did you take a walk?',
            answerTranslation: 'I took a walk in the park.',
          },
        ],
      },
      {
        type: '과거존재',
        questionTemplate: '{장소}에 뭐가 있었어요?',
        answerTemplate: '{장소}에 {물건}이/가 있었어요.',
        examples: [
          {
            vocabulary: '책상',
            question: '교실에 뭐가 있었어요?',
            answer: '교실에 책상이 있었어요.',
            questionTranslation: 'What was in the classroom?',
            answerTranslation: 'There were desks in the classroom.',
          },
          {
            vocabulary: '의자',
            question: '학교에 뭐가 있었어요?',
            answer: '학교에 의자가 있었어요.',
            questionTranslation: 'What was in the school?',
            answerTranslation: 'There were chairs in the school.',
          },
        ],
      },
      {
        type: '과거존재',
        questionTemplate: '{장소}에 누가 있었어요?',
        answerTemplate: '{장소}에 {사람}이/가 있었어요.',
        examples: [
          {
            vocabulary: '선생님',
            question: '교실에 누가 있었어요?',
            answer: '교실에 선생님이 있었어요.',
            questionTranslation: 'Who was in the classroom?',
            answerTranslation: 'A teacher was in the classroom.',
          },
          {
            vocabulary: '민수',
            question: '교실에 누가 있었어요?',
            answer: '교실에 민수가 있었어요.',
            questionTranslation: 'Who was in the classroom?',
            answerTranslation: 'Min-su was in the classroom.',
          },
          {
            vocabulary: '학생',
            question: '학교에 누가 있었어요?',
            answer: '학교에 학생이 있었어요.',
            questionTranslation: 'Who was in school?',
            answerTranslation: 'Students were in school.',
          },
        ],
      },
      {
        type: '부정과거',
        questionTemplate: '{시간} {장소}에 갔어요?',
        answerTemplate: '아니요, {시간} {장소}에 안 갔어요.',
        examples: [
          {
            vocabulary: '학교',
            question: '지난주에 학교에 갔어요?',
            answer: '아니요, 지난주에 학교에 안 갔어요.',
            questionTranslation: 'Did you go to school last week?',
            answerTranslation: "No, I didn't go to school last week.",
          },
          {
            vocabulary: '집',
            question: '어제 집에 갔어요?',
            answer: '아니요, 어제 집에 안 갔어요.',
            questionTranslation: 'Did you go home yesterday?',
            answerTranslation: "No, I didn't go home yesterday.",
          },
        ],
      },
      {
        type: '부정과거',
        questionTemplate: '{장소}에 갔어요?',
        answerTemplate: '아니요, {장소}에 안 갔어요.',
        examples: [
          {
            vocabulary: '화장실',
            question: '화장실에 갔어요?',
            answer: '아니요, 화장실에 안 갔어요.',
            questionTranslation: 'Did you go to the bathroom?',
            answerTranslation: "No, I didn't go to the bathroom.",
          },
        ],
      },
      {
        type: '부정과거존재',
        questionTemplate: '{장소}에 {명사}이/가 있었어요?',
        answerTemplate: '아니요, {장소}에 {명사}이/가 없었어요.',
        examples: [
          {
            vocabulary: '책상',
            question: '교실에 책상이 있었어요?',
            answer: '아니요, 교실에 책상이 없었어요.',
            questionTranslation: 'Were there desks in the classroom?',
            answerTranslation: 'No, there were no desks in the classroom.',
          },
          {
            vocabulary: '선생님',
            question: '교실에 선생님이 있었어요?',
            answer: '아니요, 교실에 선생님이 없었어요.',
            questionTranslation: 'Was the teacher in the classroom?',
            answerTranslation: 'No, the teacher was not in the classroom.',
          },
        ],
      },
    ],
  },

  // 11. 에(시간)
  {
    topicId: 'time-expressions',
    grammarName: '에(시간)',
    acceptedTypes: ['time', 'verb'],
    patterns: [
      {
        type: '시간표현',
        questionTemplate: '몇 시에 {동사}?',
        answerTemplate: '저는 {시간}에 {동사}.',
        examples: [
          {
            vocabulary: '일어나다',
            question: '몇 시에 일어나요?',
            answer: '저는 일곱 시에 일어나요.',
            questionTranslation: 'What time do you wake up?',
            answerTranslation: "I wake up at 7 o'clock.",
          },
        ],
      },
      {
        type: '시간표현',
        questionTemplate: '몇 시에 {목적어}을/를 {동사}?',
        answerTemplate: '저는 {시간}에 {목적어}을/를 {동사}.',
        examples: [
          {
            vocabulary: '아침',
            question: '몇 시에 아침을 먹어요?',
            answer: '저는 아홉 시에 아침을 먹어요.',
            questionTranslation: 'What time do you eat breakfast?',
            answerTranslation: "I eat breakfast at 9 o'clock.",
          },
        ],
      },
    ],
  },

  // 12. 부터&까지
  {
    topicId: 'duration',
    grammarName: '부터&까지',
    acceptedTypes: ['time', 'verb'],
    patterns: [
      {
        type: '기간',
        questionTemplate: '언제부터 언제까지 {동사}?',
        answerTemplate: '{시작}부터 {끝}까지 {동사}.',
        examples: [
          {
            vocabulary: '공부하다',
            question: '언제부터 언제까지 공부해요?',
            answer: '9시부터 5시까지 공부해요.',
            questionTranslation: 'From when to when do you study?',
            answerTranslation: 'I study from 9 to 5.',
          },
        ],
      },
      {
        type: '기간',
        questionTemplate: '몇 시부터 몇 시까지 {동사}?',
        answerTemplate: '저는 {시작}부터 {끝}까지 {동사}.',
        examples: [
          {
            vocabulary: '영화',
            question: '몇 시부터 몇 시까지 영화를 봐요?',
            answer: '저는 일곱 시부터 열 시까지 영화를 봐요.',
            questionTranslation: 'From what time to what time do you watch movies?',
            answerTranslation: 'I watch a movie from 7 to 10.',
          },
        ],
      },
      {
        type: '기간',
        questionTemplate: '{이름}는 언제부터 언제까지 {동사}?',
        answerTemplate: '{이름}는 {시작}부터 {끝}까지 {동사}.',
        examples: [
          {
            vocabulary: '쇼핑',
            question: '유나는 언제부터 언제까지 쇼핑해요?',
            answer: '유나는 오후부터 저녁까지 쇼핑해요.',
            questionTranslation: 'From when to when does Yuna go shopping?',
            answerTranslation: 'Yuna goes shopping from afternoon to evening.',
          },
        ],
      },
    ],
  },

  // 13. 위&아래&앞&뒤
  {
    topicId: 'positions',
    grammarName: '위&아래&앞&뒤',
    acceptedTypes: ['noun', 'thing'],
    patterns: [
      {
        type: '위치',
        questionTemplate: '{물건}이/가 어디에 있어요?',
        answerTemplate: '{물건}이/가 {물건} {위치}에 있어요.',
        examples: [
          {
            vocabulary: '책',
            question: '책이 어디에 있어요?',
            answer: '책이 책상 위에 있어요.',
            questionTranslation: 'Where is the book?',
            answerTranslation: 'The book is on the desk.',
          },
        ],
      },
    ],
  },

  // 14. 으러 가요/와요
  {
    topicId: 'purpose',
    grammarName: '으러 가요/와요',
    acceptedTypes: ['verb'],
    patterns: [
      {
        type: '목적',
        questionTemplate: '뭐 하러 {장소}에 가요?',
        answerTemplate: '저는 {동사}러/으러 {장소}에 가요.',
        examples: [
          {
            vocabulary: '공부하다',
            question: '뭐 하러 도서관에 가요?',
            answer: '저는 공부하러 도서관에 가요.',
            questionTranslation: 'What are you going to the library for?',
            answerTranslation: 'I go to the library to study.',
          },
        ],
      },
      {
        type: '목적',
        questionTemplate: '뭐 하러 {장소}에 가요?',
        answerTemplate: '저는 {목적어}을/를 {동사}러/으러 {장소}에 가요.',
        examples: [
          {
            vocabulary: '밥',
            question: '뭐 하러 식당에 가요?',
            answer: '저는 밥 먹으러 식당에 가요.',
            questionTranslation: 'What are you going to the restaurant for?',
            answerTranslation: 'I go to the restaurant to eat.',
          },
        ],
      },
      {
        type: '목적',
        questionTemplate: '왜 {장소}에 가요?',
        answerTemplate: '{동사}으러/러 {장소}에 가요.',
        examples: [
          {
            vocabulary: '먹다',
            question: '왜 식당에 가요?',
            answer: '밥을 먹으러 식당에 가요.',
            questionTranslation: 'Why do you go to the restaurant?',
            answerTranslation: 'I go to the restaurant to eat.',
          },
        ],
      },
    ],
  },

  // 15. 으세요/지 마세요
  {
    topicId: 'commands',
    grammarName: '으세요/지 마세요',
    acceptedTypes: ['verb'],
    patterns: [
      {
        type: '명령',
        questionTemplate: '뭐 해야 해요?',
        answerTemplate: '{동사}(으)세요.',
        examples: [
          {
            vocabulary: '앉다',
            question: '뭐 해야 해요?',
            answer: '앉으세요.',
            questionTranslation: 'What should I do?',
            answerTranslation: 'Please sit down.',
          },
        ],
      },
      {
        type: '금지',
        questionTemplate: '뭐 하면 안 돼요?',
        answerTemplate: '{동사}지 마세요.',
        examples: [
          {
            vocabulary: '담배를 피우다',
            question: '여기서 뭐 하면 안 돼요?',
            answer: '담배를 피우지 마세요.',
            questionTranslation: 'What should I not do here?',
            answerTranslation: 'Please do not smoke.',
          },
        ],
      },
    ],
  },

  // 16. 에서&까지
  {
    topicId: 'start-end',
    grammarName: '에서&까지',
    acceptedTypes: ['location'],
    patterns: [
      {
        type: '경로',
        questionTemplate: '어디에서 어디까지 가요?',
        answerTemplate: '{출발}에서 {도착}까지 가요.',
        examples: [
          {
            vocabulary: '서울',
            question: '어디에서 어디까지 가요?',
            answer: '서울에서 부산까지 가요.',
            questionTranslation: 'From where to where do you go?',
            answerTranslation: 'I go from Seoul to Busan.',
          },
        ],
      },
      {
        type: '경로',
        questionTemplate: '{출발}에서 {도착}까지 어떻게 가요?',
        answerTemplate: '{출발}에서 {도착}까지 {수단}(으)로 가요.',
        examples: [
          {
            vocabulary: '기차',
            question: '서울에서 부산까지 어떻게 가요?',
            answer: '서울에서 부산까지 기차로 가요.',
            questionTranslation: 'How do you go from Seoul to Busan?',
            answerTranslation: 'I go from Seoul to Busan by train.',
          },
        ],
      },
      {
        type: '경로',
        questionTemplate: '{출발}에서 {도착}까지 어떻게 가요?',
        answerTemplate: '{출발}에서 {도착}까지 {수단}을/를 타고 가요.',
        examples: [
          {
            vocabulary: '버스',
            question: '집에서 회사까지 어떻게 가요?',
            answer: '집에서 회사까지 버스를 타고 가요.',
            questionTranslation: 'How do you go from home to the company?',
            answerTranslation: 'I take the bus from home to the company.',
          },
        ],
      },
      {
        type: '경로',
        questionTemplate: '{출발}에서 {도착}까지 어떻게 가요?',
        answerTemplate: '{출발}에서 {도착}까지 걸어서 가요.',
        examples: [
          {
            vocabulary: '집',
            question: '집에서 학교까지 어떻게 가요?',
            answer: '집에서 학교까지 걸어서 가요.',
            questionTranslation: 'How do you go from home to school?',
            answerTranslation: 'I walk from home to school.',
          },
        ],
      },
    ],
  },

  // 17. 으로
  {
    topicId: 'direction-method',
    grammarName: '으로',
    acceptedTypes: ['noun', 'location'],
    patterns: [
      {
        type: '방향',
        questionTemplate: '어디로 {동사}?',
        answerTemplate: '{장소}(으)로 {동사}.',
        examples: [
          {
            vocabulary: '제주도',
            question: '어디로 여행을 가요?',
            answer: '제주도로 여행을 가요.',
            questionTranslation: 'Where do you go on a trip?',
            answerTranslation: 'I go on a trip to Jeju Island.',
          },
        ],
      },
      {
        type: '방향',
        questionTemplate: '{시간}에 어디로 {동사}?',
        answerTemplate: '{시간}에 {장소}(으)로 {동사}.',
        examples: [
          {
            vocabulary: '미국',
            question: '방학에 어디로 여행을 가요?',
            answer: '방학에 미국으로 여행을 가요.',
            questionTranslation: 'Where do you go on a trip during the vacation?',
            answerTranslation: 'I go on a trip to the United States during the vacation.',
          },
        ],
      },
      {
        type: '수단',
        questionTemplate: '뭐로 가요?',
        answerTemplate: '{명사}(으)로 가요.',
        examples: [
          {
            vocabulary: '버스',
            question: '뭐로 가요?',
            answer: '버스로 가요.',
            questionTranslation: 'How do you go?',
            answerTranslation: 'I go by bus.',
          },
        ],
      },
    ],
  },

  // 18. 고 싶다, 고 싶어하다
  {
    topicId: 'desires',
    grammarName: '고 싶다, 고 싶어하다',
    acceptedTypes: ['verb', 'time', 'location', 'noun', 'thing', 'food', 'person'],
    patterns: [
      {
        type: '희망',
        questionTemplate: '{시간} 뭐 하고 싶어요?',
        answerTemplate: '{목적어}을/를 {동사}고 싶어요.',
        examples: [
          {
            vocabulary: '책',
            question: '오늘 뭐 하고 싶어요?',
            answer: '책을 읽고 싶어요.',
            questionTranslation: 'What do you want to do today?',
            answerTranslation: 'I want to read a book today.',
          },
          {
            vocabulary: '책',
            question: '어제 뭐 하고 싶었어요?',
            answer: '책을 읽고 싶었어요.',
            questionTranslation: 'What did you want to do yesterday?',
            answerTranslation: 'I wanted to read a book yesterday.',
          },
          {
            vocabulary: '음악',
            question: '뭐 하고 싶어요?',
            answer: '음악을 듣고 싶어요.',
            questionTranslation: 'What do you want to do?',
            answerTranslation: 'I want to listen to music.',
          },
        ],
      },
      {
        type: '희망',
        questionTemplate: '{시간} 뭐 하고 싶어요?',
        answerTemplate: '{장소}에 {동사}고 싶어요.',
        examples: [
          {
            vocabulary: '영화관',
            question: '오늘 뭐 하고 싶어요?',
            answer: '영화관에 가고 싶어요.',
            questionTranslation: 'What do you want to do today?',
            answerTranslation: 'I want to go to the movie theater today.',
          },
          {
            vocabulary: '한국',
            question: '지난주에 뭐 하고 싶었어요?',
            answer: '한국에 가고 싶었어요.',
            questionTranslation: 'What did you want to do last week?',
            answerTranslation: 'I wanted to go to Korea last week.',
          },
        ],
      },
      {
        type: '희망',
        questionTemplate: '{시간} 뭐 하고 싶어요?',
        answerTemplate: '{장소}에서 {동사}고 싶어요.',
        examples: [
          {
            vocabulary: '도서관',
            question: '오늘 뭐 하고 싶어요?',
            answer: '도서관에서 공부하고 싶어요.',
            questionTranslation: 'What do you want to do today?',
            answerTranslation: 'I want to study at the library today.',
          },
          {
            vocabulary: '카페',
            question: '어제 뭐 하고 싶었어요?',
            answer: '카페에서 커피를 마시고 싶었어요.',
            questionTranslation: 'What did you want to do yesterday?',
            answerTranslation: 'I wanted to drink coffee at the cafe yesterday.',
          },
          {
            vocabulary: '공원',
            question: '뭐 하고 싶어요?',
            answer: '공원에서 산책하고 싶어요.',
            questionTranslation: 'What do you want to do?',
            answerTranslation: 'I want to take a walk in the park.',
          },
        ],
      },
      {
        type: '희망',
        questionTemplate: '{시간} 뭐 하고 싶어요?',
        answerTemplate: '{목적어}을/를 {장소}에서 {동사}고 싶어요.',
        examples: [
          {
            vocabulary: '책',
            question: '오늘 뭐 하고 싶어요?',
            answer: '책을 도서관에서 읽고 싶어요.',
            questionTranslation: 'What do you want to do today?',
            answerTranslation: 'I want to read a book at the library today.',
          },
          {
            vocabulary: '음식',
            question: '어제 뭐 하고 싶었어요?',
            answer: '음식을 레스토랑에서 먹고 싶었어요.',
            questionTranslation: 'What did you want to do yesterday?',
            answerTranslation: 'I wanted to eat food at the restaurant yesterday.',
          },
        ],
      },
      {
        type: '희망',
        questionTemplate: '{시간} 뭐 하고 싶어요?',
        answerTemplate: '{사람}와/과/하고 {동사}고 싶어요.',
        examples: [
          {
            vocabulary: '친구',
            question: '오늘 뭐 하고 싶어요?',
            answer: '친구와 놀고 싶어요.',
            questionTranslation: 'What do you want to do today?',
            answerTranslation: 'I want to play with my friend today.',
          },
          {
            vocabulary: '친구',
            question: '오늘 뭐 하고 싶어요?',
            answer: '친구하고 놀고 싶어요.',
            questionTranslation: 'What do you want to do today?',
            answerTranslation: 'I want to play with my friend today.',
          },
          {
            vocabulary: '가족',
            question: '지난주에 뭐 하고 싶었어요?',
            answer: '가족과 여행하고 싶었어요.',
            questionTranslation: 'What did you want to do last week?',
            answerTranslation: 'I wanted to travel with my family last week.',
          },
          {
            vocabulary: '가족',
            question: '지난주에 뭐 하고 싶었어요?',
            answer: '가족하고 여행하고 싶었어요.',
            questionTranslation: 'What did you want to do last week?',
            answerTranslation: 'I wanted to travel with my family last week.',
          },
          {
            vocabulary: '동생',
            question: '뭐 하고 싶어요?',
            answer: '동생과 영화 보고 싶어요.',
            questionTranslation: 'What do you want to do?',
            answerTranslation: 'I want to watch a movie with my younger sibling.',
          },
        ],
      },
      {
        type: '희망',
        questionTemplate: '{시간} 뭐 하고 싶어요?',
        answerTemplate: '{사람}와/과/하고 {장소}에 {동사}고 싶어요.',
        examples: [
          {
            vocabulary: '영화관',
            question: '오늘 뭐 하고 싶어요?',
            answer: '친구와 영화관에 가고 싶어요.',
            questionTranslation: 'What do you want to do today?',
            answerTranslation: 'I want to go to the movie theater with my friend today.',
          },
          {
            vocabulary: '영화관',
            question: '오늘 뭐 하고 싶어요?',
            answer: '친구하고 영화관에 가고 싶어요.',
            questionTranslation: 'What do you want to do today?',
            answerTranslation: 'I want to go to the movie theater with my friend today.',
          },
          {
            vocabulary: '한국',
            question: '뭐 하고 싶어요?',
            answer: '가족과 한국에 가고 싶어요.',
            questionTranslation: 'What do you want to do?',
            answerTranslation: 'I want to go to Korea with my family.',
          },
        ],
      },
      {
        type: '희망',
        questionTemplate: '{시간} 뭐 하고 싶어요?',
        answerTemplate: '{사람}와/과/하고 {장소}에서 {동사}고 싶어요.',
        examples: [
          {
            vocabulary: '카페',
            question: '오늘 뭐 하고 싶어요?',
            answer: '친구와 카페에서 공부하고 싶어요.',
            questionTranslation: 'What do you want to do today?',
            answerTranslation: 'I want to study at the cafe with my friend today.',
          },
          {
            vocabulary: '카페',
            question: '오늘 뭐 하고 싶어요?',
            answer: '친구하고 카페에서 공부하고 싶어요.',
            questionTranslation: 'What do you want to do today?',
            answerTranslation: 'I want to study at the cafe with my friend today.',
          },
          {
            vocabulary: '공원',
            question: '뭐 하고 싶어요?',
            answer: '동생과 공원에서 놀고 싶어요.',
            questionTranslation: 'What do you want to do?',
            answerTranslation: 'I want to play in the park with my younger sibling.',
          },
        ],
      },
      {
        type: '희망',
        questionTemplate: '{시간} 뭐 하고 싶어요?',
        answerTemplate: '저는 {동사}고 싶어요.',
        examples: [
          {
            vocabulary: '먹다',
            question: '뭐 하고 싶어요?',
            answer: '저는 피자를 먹고 싶어요.',
            questionTranslation: 'What do you want to do?',
            answerTranslation: 'I want to eat pizza.',
          },
          {
            vocabulary: '먹다',
            question: '어제 뭐 하고 싶었어요?',
            answer: '저는 피자를 먹고 싶었어요.',
            questionTranslation: 'What did you want to do yesterday?',
            answerTranslation: 'I wanted to eat pizza yesterday.',
          },
        ],
      },
    ],
  },

  // 19. 을 거예요
  {
    topicId: 'future',
    grammarName: '을 거예요',
    acceptedTypes: ['verb', 'noun'],
    patterns: [
      {
        type: '미래',
        questionTemplate: '내일 뭐 할 거예요?',
        answerTemplate: '저는 내일 {미래형동사} 거예요.',
        examples: [
          {
            vocabulary: '공부하다',
            question: '내일 뭐 할 거예요?',
            answer: '저는 내일 공부할 거예요.',
            questionTranslation: 'What will you do tomorrow?',
            answerTranslation: 'I will study tomorrow.',
          },
        ],
      },
      {
        type: '미래',
        questionTemplate: '오늘 {시간}에 뭐 할 거예요?',
        answerTemplate: '{장소}에서 {미래형동사} 거예요.',
        examples: [
          {
            vocabulary: '공부하다',
            question: '오늘 오후에 뭐 할 거예요?',
            answer: '도서관에서 공부할 거예요.',
            questionTranslation: 'What are you going to do this afternoon?',
            answerTranslation: 'I am going to study at the library.',
          },
        ],
      },
      {
        type: '미래',
        questionTemplate: '오늘 {시간}에 뭐 할 거예요?',
        answerTemplate: '{목적어}을/를 {미래형동사} 거예요.',
        examples: [
          {
            vocabulary: '영화',
            question: '오늘 저녁에 뭐 할 거예요?',
            answer: '집에서 영화를 볼 거예요.',
            questionTranslation: 'What are you going to do this evening?',
            answerTranslation: 'I am going to watch a movie at home.',
          },
        ],
      },
      {
        type: '미래',
        questionTemplate: '오늘 {시간}에 뭐 할 거예요?',
        answerTemplate: '{장소}에 {동사}러/으러 갈 거예요.',
        examples: [
          {
            vocabulary: '사진',
            question: '오늘 저녁에 뭐 할 거예요?',
            answer: '바다에 사진을 찍으러 갈 거예요.',
            questionTranslation: 'What are you going to do this evening?',
            answerTranslation: 'I am going to go to the sea to take pictures.',
          },
        ],
      },
      {
        type: '미래',
        questionTemplate: '언제 {명사}이/가 {동사}을 거예요?',
        answerTemplate: '{명사}이/가 {시간}에 {동사}을 거예요.',
        examples: [
          {
            vocabulary: '수업',
            question: '언제 수업이 끝날 거예요?',
            answer: '수업이 1시에 끝날 거예요.',
            questionTranslation: 'When will the class end?',
            answerTranslation: 'The class will end at 1.',
          },
        ],
      },
    ],
  },

  // 20. 수 있다/없다
  {
    topicId: 'ability',
    grammarName: '수 있다/없다',
    acceptedTypes: ['verb', 'noun'],
    patterns: [
      {
        type: '능력',
        questionTemplate: '{목적어}을/를 {동사}(으)ㄹ 수 있어요?',
        answerTemplate: '네, {동사}(으)ㄹ 수 있어요.',
        examples: [
          {
            vocabulary: '한국어',
            question: '한국어를 할 수 있어요?',
            answer: '네, 할 수 있어요.',
            questionTranslation: 'Can you speak Korean?',
            answerTranslation: 'Yes, I can.',
          },
        ],
      },
      {
        type: '능력',
        questionTemplate: '{목적어}을/를 {동사}(으)ㄹ 수 있어요?',
        answerTemplate: '아니요, {동사}(으)ㄹ 수 없어요.',
        examples: [
          {
            vocabulary: '요리',
            question: '요리를 할 수 있어요?',
            answer: '아니요, 할 수 없어요.',
            questionTranslation: 'Can you cook?',
            answerTranslation: 'No, I cannot.',
          },
        ],
      },
      {
        type: '능력',
        questionTemplate: '{목적어}을/를 {동사}(으)ㄹ 수 있어요?',
        answerTemplate: '조금 {동사}(으)ㄹ 수 있어요.',
        examples: [
          {
            vocabulary: '그림',
            question: '그림을 그릴 수 있어요?',
            answer: '조금 그릴 수 있어요.',
            questionTranslation: 'Can you draw pictures?',
            answerTranslation: 'I can draw a little.',
          },
        ],
      },
      {
        type: '능력',
        questionTemplate: '{동사}(으)ㄹ 수 있어요?',
        answerTemplate: '네, {동사}(으)ㄹ 수 있어요.',
        examples: [
          {
            vocabulary: '수영하다',
            question: '수영할 수 있어요?',
            answer: '네, 수영할 수 있어요.',
            questionTranslation: 'Can you swim?',
            answerTranslation: 'Yes, I can swim.',
          },
        ],
      },
    ],
  },

  // 21. 아야/어야 해요
  {
    topicId: 'obligation',
    grammarName: '아야/어야 해요',
    acceptedTypes: ['verb', 'noun'],
    patterns: [
      {
        type: '의무',
        questionTemplate: '뭐 해야 해요?',
        answerTemplate: '{동사}아야/어야 해요.',
        examples: [
          {
            vocabulary: '가다',
            question: '뭐 해야 해요?',
            answer: '학교에 가야 해요.',
            questionTranslation: 'What do you have to do?',
            answerTranslation: 'I have to go to school.',
          },
        ],
      },
      {
        type: '의무',
        questionTemplate: '언제 {동사}아야/어야 해요?',
        answerTemplate: '{명사}이/가 {시간}에 {동사}아야/어야 해요.',
        examples: [
          {
            vocabulary: '수업',
            question: '언제 수업이 끝나야 해요?',
            answer: '수업이 1시에 끝나야 해요.',
            questionTranslation: 'When must the class end?',
            answerTranslation: 'The class must end at 1.',
          },
        ],
      },
    ],
  },

  // 22. 못하다&잘하다&잘 못하다
  {
    topicId: 'skills',
    grammarName: '못하다&잘하다&잘 못하다',
    acceptedTypes: ['verb', 'noun'],
    patterns: [
      {
        type: '능력정도',
        questionTemplate: '{명사} 잘해요?',
        answerTemplate: '네, {명사} 잘해요. / 아니요, {명사} 못해요.',
        examples: [
          {
            vocabulary: '요리',
            question: '요리 잘해요?',
            answer: '네, 요리 잘해요.',
            questionTranslation: 'Are you good at cooking?',
            answerTranslation: 'Yes, I am good at cooking.',
          },
        ],
      },
    ],
  },

  // 23. 형용사 + 은
  {
    topicId: 'adjectives',
    grammarName: '형용사 + 은',
    acceptedTypes: ['adjective', 'noun'],
    patterns: [
      {
        type: '수식',
        questionTemplate: '어떤 {명사}을/를 좋아해요?',
        answerTemplate: '저는 {형용사}(으)ㄴ {명사}을/를 좋아해요.',
        examples: [
          {
            vocabulary: '크다',
            question: '어떤 가방을 좋아해요?',
            answer: '저는 큰 가방을 좋아해요.',
            questionTranslation: 'What kind of bag do you like?',
            answerTranslation: 'I like big bags.',
          },
        ],
      },
    ],
  },

  // 24. 고 있다
  {
    topicId: 'progressive',
    grammarName: '고 있다',
    acceptedTypes: ['verb'],
    patterns: [
      {
        type: '진행',
        questionTemplate: '지금 뭐 하고 있어요?',
        answerTemplate: '저는 지금 {동사}고 있어요.',
        examples: [
          {
            vocabulary: '먹다',
            question: '지금 뭐 하고 있어요?',
            answer: '저는 지금 밥을 먹고 있어요.',
            questionTranslation: 'What are you doing now?',
            answerTranslation: 'I am eating now.',
          },
        ],
      },
    ],
  },

  // 25. 아서/어서
  {
    topicId: 'reasons',
    grammarName: '아서/어서',
    acceptedTypes: ['verb', 'adjective'],
    patterns: [
      {
        type: '이유',
        questionTemplate: '왜 {결과}?',
        answerTemplate: '{원인}아서/어서 {결과}.',
        examples: [
          {
            vocabulary: '피곤하다',
            question: '왜 집에 가요?',
            answer: '피곤해서 집에 가요.',
            questionTranslation: 'Why do you go home?',
            answerTranslation: 'I go home because I am tired.',
          },
        ],
      },
    ],
  },

  // 26. 지만, 는데
  {
    topicId: 'contrast',
    grammarName: '지만, 는데',
    acceptedTypes: ['verb', 'adjective'],
    patterns: [
      {
        type: '대조',
        questionTemplate: '{상황1}?',
        answerTemplate: '{상황1}지만 {상황2}.',
        examples: [
          {
            vocabulary: '비싸다',
            question: '그 식당 어때요?',
            answer: '비싸지만 맛있어요.',
            questionTranslation: 'How is that restaurant?',
            answerTranslation: 'It is expensive but delicious.',
          },
        ],
      },
    ],
  },

  // 27. 으니까
  {
    topicId: 'cause',
    grammarName: '으니까',
    acceptedTypes: ['verb', 'adjective'],
    patterns: [
      {
        type: '원인',
        questionTemplate: '왜 {결과}?',
        answerTemplate: '{원인}(으)니까 {결과}.',
        examples: [
          {
            vocabulary: '덥다',
            question: '왜 창문을 열어요?',
            answer: '더우니까 창문을 열어요.',
            questionTranslation: 'Why do you open the window?',
            answerTranslation: 'I open the window because it is hot.',
          },
        ],
      },
    ],
  },

  // 28. 면
  {
    topicId: 'conditions',
    grammarName: '면',
    acceptedTypes: ['verb', 'adjective'],
    patterns: [
      {
        type: '조건',
        questionTemplate: '언제 {결과}?',
        answerTemplate: '{조건}(으)면 {결과}.',
        examples: [
          {
            vocabulary: '시간이 있다',
            question: '언제 영화를 봐요?',
            answer: '시간이 있으면 영화를 봐요.',
            questionTranslation: 'When do you watch a movie?',
            answerTranslation: 'I watch a movie if I have time.',
          },
        ],
      },
    ],
  },

  // 29. 때
  {
    topicId: 'time-relations',
    grammarName: '때',
    acceptedTypes: ['verb', 'noun'],
    patterns: [
      {
        type: '시점',
        questionTemplate: '언제 {동작}?',
        answerTemplate: '{시점}(으)ㄹ 때 {동작}.',
        examples: [
          {
            vocabulary: '어리다',
            question: '언제 한국에 갔어요?',
            answer: '어릴 때 한국에 갔어요.',
            questionTranslation: 'When did you go to Korea?',
            answerTranslation: 'I went to Korea when I was young.',
          },
        ],
      },
    ],
  },

  // 30. 기 전, 은 후
  {
    topicId: 'sequence',
    grammarName: '기 전, 은 후',
    acceptedTypes: ['verb'],
    patterns: [
      {
        type: '전후',
        questionTemplate: '언제 {동작2}?',
        answerTemplate: '{동작1}기 전에/은 후에 {동작2}.',
        examples: [
          {
            vocabulary: '자다',
            question: '언제 양치해요?',
            answer: '자기 전에 양치해요.',
            questionTranslation: 'When do you brush your teeth?',
            answerTranslation: 'I brush my teeth before sleeping.',
          },
        ],
      },
    ],
  },
  // New A1
  { topicId: 'choice', grammarName: '거나, (이)나', acceptedTypes: ['noun', 'verb'], patterns: [] },
  { topicId: 'shall-we', grammarName: '(으)ㄹ까요?', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'comparison-advanced', grammarName: '보다 더', acceptedTypes: ['noun'], patterns: [] },
  { topicId: 'honorific-sida', grammarName: '(으)시다', acceptedTypes: ['verb', 'adjective'], patterns: [] },
  { topicId: 'contrast-but', grammarName: '지만, 근데', acceptedTypes: ['verb', 'adjective'], patterns: [] },

  // New A2
  { topicId: 'know-how', grammarName: '(으)ㄹ 줄 알아요/몰라요', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'benefactive', grammarName: '아/어 주다', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'experience', grammarName: '아/어 보다', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'offer-help', grammarName: '아/어 드릴까요?', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'promise-help', grammarName: '아/어 드릴게요', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'request-help', grammarName: '아/어 주시겠어요?', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'confirmation', grammarName: '지요?', acceptedTypes: ['verb', 'adjective', 'noun'], patterns: [] },
  { topicId: 'exclamation', grammarName: '네요', acceptedTypes: ['verb', 'adjective', 'noun'], patterns: [] },
  { topicId: 'intent-short', grammarName: '(으)려고', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'intent-long', grammarName: '(으)려고 해요', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'sequential-action', grammarName: '아서/어서 2', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'suggestion', grammarName: '(으)ㄹ까요? 2', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'future-prediction', grammarName: '(으)ㄹ 거예요 2', acceptedTypes: ['verb', 'adjective'], patterns: [] },
  { topicId: 'interruption', grammarName: '다가', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'gerund', grammarName: '는 것', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'let-us', grammarName: '(으)ㅂ시다', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'decision', grammarName: '기로 하다', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'permission', grammarName: '아도/어도 되다', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'prohibition', grammarName: '(으)면 안 되다', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'promise', grammarName: '(으)ㄹ게요', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'conjecture', grammarName: '겠어요', acceptedTypes: ['verb', 'adjective'], patterns: [] },
  { topicId: 'change-of-state', grammarName: '게 되다', acceptedTypes: ['verb', 'adjective'], patterns: [] },
  { topicId: 'simultaneous', grammarName: '(으)면서', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'intent-will', grammarName: '(으)ㄹ래요', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'because-of', grammarName: '기 때문에', acceptedTypes: ['verb', 'adjective', 'noun'], patterns: [] },
  { topicId: 'while-during', grammarName: '는 동안에', acceptedTypes: ['verb', 'noun'], patterns: [] },
  { topicId: 'background-info', grammarName: '(형용사) + (으)ㄴ데요', acceptedTypes: ['adjective', 'noun'], patterns: [] },
  { topicId: 'background-action', grammarName: '(동사) + 는데요', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'indirect-quote-statement', grammarName: '다고 하다', acceptedTypes: ['verb', 'adjective'], patterns: [] },
  { topicId: 'indirect-quote-action', grammarName: 'ㄴ/는다고 하다', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'indirect-quote-past', grammarName: '았/었다고 하다', acceptedTypes: ['verb', 'adjective'], patterns: [] },
  { topicId: 'indirect-quote-future', grammarName: '(으)ㄹ 거라고 하다', acceptedTypes: ['verb', 'adjective'], patterns: [] },
  { topicId: 'indirect-quote-suggestion', grammarName: '자고 하다', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'indirect-quote-question', grammarName: '냐고 하다', acceptedTypes: ['verb', 'adjective'], patterns: [] },
  { topicId: 'indirect-quote-command', grammarName: '(으)라고 하다', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'noun-modifier-present', grammarName: '(동사) + 는', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'noun-modifier-past', grammarName: '(동사) + (으)ㄴ', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'noun-modifier-future', grammarName: '(동사) + (으)ㄹ', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'guess-adj', grammarName: '형용사 + (으)ㄴ 것 같다', acceptedTypes: ['adjective'], patterns: [] },
  { topicId: 'guess-verb-present', grammarName: '(동사) + 는 것 같다', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'guess-verb-past', grammarName: '(동사) + (으)ㄴ 것 같다', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'guess-future', grammarName: '(동사/형용사) + (으)ㄹ 것 같다', acceptedTypes: ['verb', 'adjective'], patterns: [] },
  { topicId: 'background-adj', grammarName: '(형용사) + (으)ㄴ데', acceptedTypes: ['adjective'], patterns: [] },
  { topicId: 'background-verb', grammarName: '(동사) + 는데', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'become', grammarName: '아/어지다', acceptedTypes: ['adjective'], patterns: [] },
  { topicId: 'even-if', grammarName: '아/어도', acceptedTypes: ['verb', 'adjective'], patterns: [] },
  { topicId: 'experience-exist', grammarName: '(으)ㄴ 적이 있다/없다', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'know-adj', grammarName: '(형용사) + (으)ㄴ지 알다', acceptedTypes: ['adjective'], patterns: [] },
  { topicId: 'know-verb', grammarName: '(동사) + 는지 알다', acceptedTypes: ['verb'], patterns: [] },
  { topicId: 'time-since-action', grammarName: '(으)ㄴ 지', acceptedTypes: ['verb'], patterns: [] },
];

/**
 * TopicId로 패턴 찾기
 */
export function getPatternByTopicId(
  topicId: TopicId
): GrammarPatternDefinition | undefined {
  return grammarPatterns.find(p => p.topicId === topicId);
}

/**
 * 어휘 유형에 맞는 문법 주제 찾기
 */
export function findCompatibleTopics(
  vocabularyType: VocabularyType
): TopicId[] {
  return grammarPatterns
    .filter(p => p.acceptedTypes.includes(vocabularyType))
    .map(p => p.topicId);
}

/**
 * 어휘 유형과 문법 주제가 호환되는지 확인
 */
export function isVocabularyCompatible(
  vocabularyType: VocabularyType,
  topicId: TopicId
): boolean {
  const pattern = getPatternByTopicId(topicId);
  if (!pattern) return false;
  return pattern.acceptedTypes.includes(vocabularyType);
}

