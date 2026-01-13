import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAIGenerationLimit, recordAIGeneration } from '@/lib/supabase/subscription';
import { QuizGenerator } from '@/lib/ai/quiz-generator';
import { TopicId } from '@/data/quiz/topics/meta';
import {
  QuizGenerationRequest,
  QuizGenerationResponse,
  ComparisonResult,
} from '@/types/custom-quiz';

/**
 * AI 퀴즈 생성 API
 *
 * POST: 퀴즈 생성 요청
 * - mode='hybrid': 템플릿 우선, 실패 시 from-scratch
 * - mode='from-scratch': 템플릿 없이 처음부터 생성
 * - mode='both': 두 방식 모두 생성하여 비교
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
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    // 2. 요청 바디 파싱 및 검증
    const body = await request.json();
    const { vocabulary, grammarTopics, count, mode } = body as QuizGenerationRequest;

    // 입력 검증
    if (!vocabulary || !Array.isArray(vocabulary) || vocabulary.length === 0) {
      return NextResponse.json(
        { error: '어휘 목록이 필요합니다' },
        { status: 400 }
      );
    }

    if (!grammarTopics || !Array.isArray(grammarTopics) || grammarTopics.length === 0) {
      return NextResponse.json(
        { error: '문법 주제가 필요합니다' },
        { status: 400 }
      );
    }

    if (!count || count < 1 || count > 50) {
      return NextResponse.json(
        { error: '문제 개수는 1~50개 사이여야 합니다' },
        { status: 400 }
      );
    }

    // 3. 구독 제한 확인
    const limitCheck = await checkAIGenerationLimit(user.id);

    if (!limitCheck.canGenerate) {
      // 디버깅을 위한 상세 정보 로깅
      console.error('AI 생성 제한 초과:', {
        userId: user.id,
        canGenerate: limitCheck.canGenerate,
        remaining: limitCheck.remaining,
        limit: limitCheck.limit,
        currentUsage: limitCheck.currentUsage,
        error: limitCheck.error,
        resetDate: limitCheck.resetDate,
      });

      const errorMessage = limitCheck.error 
        ? limitCheck.error 
        : limitCheck.remaining === 0 && limitCheck.limit > 0
        ? `${limitCheck.limit}회 제한을 모두 사용했습니다.`
        : 'AI 생성 제한을 초과했습니다.';

      return NextResponse.json(
        {
          error: 'AI 생성 제한 초과',
          message: errorMessage,
          resetDate: limitCheck.resetDate,
          remaining: limitCheck.remaining,
          limit: limitCheck.limit,
          currentUsage: limitCheck.currentUsage,
        },
        { status: 403 }
      );
    }

    // 생성 가능한 개수 제한
    const maxGeneratable = Math.min(count, limitCheck.remaining);
    if (maxGeneratable < count) {
      console.warn(
        `요청 개수(${count})가 남은 제한(${limitCheck.remaining})을 초과하여 ${maxGeneratable}개로 조정`
      );
    }

    // 4. 퀴즈 생성
    const generator = new QuizGenerator();
    let result: QuizGenerationResponse | ComparisonResult;

    if (mode === 'both') {
      // 두 방식 모두 생성하여 비교
      const [hybrid, fromScratch] = await Promise.all([
        generator.generateQuestions({
          vocabulary,
          grammarTopics: grammarTopics as TopicId[],
          count: maxGeneratable,
          mode: 'hybrid',
        }),
        generator.generateQuestions({
          vocabulary,
          grammarTopics: grammarTopics as TopicId[],
          count: maxGeneratable,
          mode: 'from-scratch',
        }),
      ]);

      result = { hybrid, fromScratch } as ComparisonResult;

      // 사용량 기록 (두 방식 모두 생성했으므로 실제 생성된 개수의 평균)
      const totalGenerated = Math.max(
        hybrid.questions.length,
        fromScratch.questions.length
      );
      await recordAIGeneration(user.id, totalGenerated, {
        mode: 'both',
        vocabulary: vocabulary.slice(0, 5),
        grammarTopics,
        timestamp: new Date().toISOString(),
      });
    } else {
      // 단일 모드 생성
      result = await generator.generateQuestions({
        vocabulary,
        grammarTopics: grammarTopics as TopicId[],
        count: maxGeneratable,
        mode: mode || 'hybrid',
      });

      // 사용량 기록
      await recordAIGeneration(user.id, result.questions.length, {
        mode: mode || 'hybrid',
        vocabulary: vocabulary.slice(0, 5),
        grammarTopics,
        timestamp: new Date().toISOString(),
      });
    }

    // 5. 성공 응답
    return NextResponse.json({
      success: true,
      data: result,
      limit: {
        remaining: limitCheck.remaining - maxGeneratable,
        resetDate: limitCheck.resetDate,
      },
    });
  } catch (error: any) {
    console.error('AI 퀴즈 생성 오류:', error);
    return NextResponse.json(
      {
        error: '퀴즈 생성 중 오류가 발생했습니다',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET: API 상태 확인 (선택적)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    const limitCheck = await checkAIGenerationLimit(user.id);

    return NextResponse.json({
      success: true,
      message: 'AI 퀴즈 생성 API가 정상 작동 중입니다',
      limit: limitCheck,
    });
  } catch (error: any) {
    console.error('API 상태 확인 오류:', error);
    return NextResponse.json(
      {
        error: '상태 확인 중 오류가 발생했습니다',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
