import OpenAI from 'openai';

/**
 * Week 2 Day 1: AI 통합 기초
 * OpenAI 클라이언트 설정
 */

// OpenAI 클라이언트 인스턴스
let openaiClient: OpenAI | null = null;

/**
 * OpenAI 클라이언트 생성 (싱글톤)
 */
export function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY가 설정되지 않았습니다.');
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return openaiClient;
}

/**
 * GPT-4o mini로 텍스트 생성
 * Week 2에서 주로 사용할 모델
 */
export async function generateWithGPT4oMini(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      ...(systemPrompt
        ? [{ role: 'system' as const, content: systemPrompt }]
        : []),
      { role: 'user' as const, content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('AI 응답이 비어있습니다.');
  }

  return content;
}

/**
 * GPT-4o로 텍스트 생성 (프리미엄 플랜용)
 */
export async function generateWithGPT4o(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      ...(systemPrompt
        ? [{ role: 'system' as const, content: systemPrompt }]
        : []),
      { role: 'user' as const, content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('AI 응답이 비어있습니다.');
  }

  return content;
}

/**
 * JSON 형식으로 생성 (구조화된 데이터용)
 */
export async function generateJSON<T = any>(
  prompt: string,
  systemPrompt?: string,
  model: 'gpt-4o-mini' | 'gpt-4o' = 'gpt-4o-mini'
): Promise<T> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model,
    messages: [
      ...(systemPrompt
        ? [
            {
              role: 'system' as const,
              content: systemPrompt + '\n\n응답은 반드시 유효한 JSON 형식이어야 합니다.',
            },
          ]
        : [
            {
              role: 'system' as const,
              content: '응답은 반드시 유효한 JSON 형식이어야 합니다.',
            },
          ]),
      { role: 'user' as const, content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('AI 응답이 비어있습니다.');
  }

  try {
    return JSON.parse(content) as T;
  } catch (error) {
    console.error('JSON 파싱 오류:', content);
    throw new Error('AI 응답을 JSON으로 파싱할 수 없습니다.');
  }
}

/**
 * 비용 계산 (대략적인 추정)
 * GPT-4o mini: $0.15 / 1M input tokens, $0.60 / 1M output tokens
 * GPT-4o: $3 / 1M input tokens, $10 / 1M output tokens
 */
export function estimateCost(
  model: 'gpt-4o-mini' | 'gpt-4o',
  inputTokens: number,
  outputTokens: number
): number {
  if (model === 'gpt-4o-mini') {
    const inputCost = (inputTokens / 1000000) * 0.15;
    const outputCost = (outputTokens / 1000000) * 0.6;
    return inputCost + outputCost;
  } else {
    // gpt-4o
    const inputCost = (inputTokens / 1000000) * 3;
    const outputCost = (outputTokens / 1000000) * 10;
    return inputCost + outputCost;
  }
}

/**
 * JSON Schema를 사용한 구조화된 출력 생성
 * OpenAI Structured Output 기능 사용
 * 
 * @param prompt 사용자 프롬프트
 * @param schema JSON Schema 정의 (name과 schema 포함)
 * @param systemPrompt 시스템 프롬프트 (선택)
 * @param model 사용할 모델 (기본값: gpt-4o-mini)
 * @returns 스키마를 준수하는 JSON 객체
 */
export async function generateStructuredJSON<T = any>(
  prompt: string,
  schema: {
    name: string;
    schema: object;
  },
  systemPrompt?: string,
  model: 'gpt-4o-mini' | 'gpt-4o' = 'gpt-4o-mini'
): Promise<T> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model,
    messages: [
      ...(systemPrompt
        ? [{ role: 'system' as const, content: systemPrompt }]
        : []),
      { role: 'user' as const, content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 3000,
    response_format: {
      type: 'json_schema',
      json_schema: schema,
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('AI 응답이 비어있습니다.');
  }

  // Structured Output은 항상 유효한 JSON을 반환
  return JSON.parse(content) as T;
}

/**
 * 토큰 수 대략 추정 (1 토큰 ≈ 4 글자)
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
