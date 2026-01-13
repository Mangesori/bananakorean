/**
 * OpenAI 클라이언트 설정
 */

import OpenAI from 'openai';

// OpenAI 클라이언트 인스턴스 (싱글톤)
let openaiClient: OpenAI | null = null;

/**
 * OpenAI 클라이언트 가져오기
 */
export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'OpenAI API 키가 설정되지 않았습니다. .env.local 파일에 OPENAI_API_KEY를 추가해주세요.'
      );
    }

    openaiClient = new OpenAI({
      apiKey,
    });
  }

  return openaiClient;
}

/**
 * OpenAI Chat Completion 호출
 */
export async function chatCompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: 'text' | 'json';
  }
): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: options?.model || 'gpt-5.2',
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 1000,
    response_format:
      options?.responseFormat === 'json' ? { type: 'json_object' } : undefined,
  });

  return response.choices[0]?.message?.content || '';
}

/**
 * JSON 응답 파싱
 */
export async function chatCompletionJSON<T>(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<T> {
  const content = await chatCompletion(messages, {
    ...options,
    responseFormat: 'json',
  });

  try {
    return JSON.parse(content) as T;
  } catch (error) {
    throw new Error(`JSON 파싱 실패: ${content}`);
  }
}

/**
 * API 키 확인
 */
export function hasOpenAIKey(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

