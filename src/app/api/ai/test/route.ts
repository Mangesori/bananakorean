import { NextRequest, NextResponse } from 'next/server';
import { generateWithGPT4oMini, generateJSON, estimateCost } from '@/lib/ai/client';
import { createClient } from '@/lib/supabase/server';

/**
 * Week 2 Day 1: AI 통합 테스트 API
 * OpenAI API 연결 확인 및 기본 생성 테스트
 */

export async function GET(request: NextRequest) {
  try {
    // 1. 인증 확인
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    // 2. 간단한 텍스트 생성 테스트
    const simplePrompt = '안녕하세요를 영어로 번역해주세요. 짧게 답변해주세요.';
    const simpleResponse = await generateWithGPT4oMini(simplePrompt);

    // 3. JSON 생성 테스트
    const jsonPrompt = `
다음 한국어 단어 "안녕하세요"를 사용한 간단한 객관식 문제 1개를 JSON 형식으로 생성해주세요.

형식:
{
  "question": "질문 내용",
  "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
  "correctAnswer": "정답",
  "explanation": "해설"
}
`;

    const jsonResponse = await generateJSON<{
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }>(jsonPrompt);

    // 4. 비용 추정
    const estimatedCost = estimateCost(500, 'gpt-4o-mini');

    return NextResponse.json({
      success: true,
      data: {
        simpleTest: {
          prompt: simplePrompt,
          response: simpleResponse,
        },
        jsonTest: {
          prompt: '한국어 문제 생성 테스트',
          response: jsonResponse,
        },
        costEstimate: {
          tokens: 500,
          model: 'gpt-4o-mini',
          estimatedCost: `$${estimatedCost.toFixed(6)}`,
        },
        message: 'OpenAI API 연결 및 기본 기능 테스트 성공!',
      },
    });
  } catch (error: any) {
    console.error('AI 테스트 오류:', error);

    // OpenAI API 키 관련 오류 처리
    if (error.message?.includes('OPENAI_API_KEY')) {
      return NextResponse.json(
        {
          error: 'OpenAI API 키가 설정되지 않았습니다.',
          message: '.env.local 파일에 OPENAI_API_KEY를 추가해주세요.',
          guide: 'https://platform.openai.com/api-keys 에서 API 키를 발급받을 수 있습니다.',
        },
        { status: 500 }
      );
    }

    // 일반 오류
    return NextResponse.json(
      {
        error: 'AI 테스트 실패',
        message: error.message || '알 수 없는 오류가 발생했습니다.',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST: 커스텀 프롬프트 테스트
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 인증 확인
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    // 2. 요청 파라미터
    const body = await request.json();
    const { prompt, model = 'gpt-4o-mini', expectJson = false } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'prompt가 필요합니다.' }, { status: 400 });
    }

    // 3. AI 생성
    let response;
    if (expectJson) {
      response = await generateJSON(prompt, undefined, model);
    } else {
      response =
        model === 'gpt-4o-mini'
          ? await generateWithGPT4oMini(prompt)
          : await (await import('@/lib/ai/client')).generateWithGPT4o(prompt);
    }

    return NextResponse.json({
      success: true,
      data: {
        prompt,
        model,
        response,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('커스텀 AI 테스트 오류:', error);

    return NextResponse.json(
      {
        error: 'AI 생성 실패',
        message: error.message || '알 수 없는 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
