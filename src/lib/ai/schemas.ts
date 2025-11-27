/**
 * OpenAI Structured Output용 JSON Schema 정의
 */

/**
 * 대화 문제 스키마
 * AI가 생성하는 한국어 대화 문제의 구조를 정의
 */
export const DIALOGUE_QUESTION_SCHEMA = {
  name: 'dialogue_question',
  schema: {
    type: 'object',
    properties: {
      question: {
        type: 'string',
        description: '한국어 질문 문장 (자연스러운 형식)'
      },
      answer: {
        type: 'string',
        description: '한국어 답변 문장 (질문과 호응)'
      },
      questionTranslation: {
        type: 'string',
        description: '질문의 영어 번역'
      },
      answerTranslation: {
        type: 'string',
        description: '답변의 영어 번역'
      }
    },
    required: ['question', 'answer', 'questionTranslation', 'answerTranslation'],
    additionalProperties: false
  }
} as const;

/**
 * 대화 문제 출력 타입
 */
export interface DialogueQuestionOutput {
  question: string;
  answer: string;
  questionTranslation: string;
  answerTranslation: string;
}



