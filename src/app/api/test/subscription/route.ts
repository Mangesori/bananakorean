import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  checkAIGenerationLimit,
  recordAIGeneration,
  checkStudentManagementLimit,
  checkSpeakingQuizLimit,
  getUserSubscription,
} from '@/lib/supabase/subscription';

/**
 * Week 1 Day 4: 사용량 제한 미들웨어 테스트 API
 *
 * GET: 현재 사용자의 구독 정보 및 모든 제한 조회
 * POST: AI 생성 사용량 기록 테스트
 */

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: '인증 필요' }, { status: 401 });
    }

    // 1. 구독 정보 조회
    const subscription = await getUserSubscription(user.id);

    if (!subscription) {
      return NextResponse.json({
        error: '구독 정보를 찾을 수 없습니다. DB 마이그레이션을 확인하세요.',
      }, { status: 404 });
    }

    // 2. AI 생성 제한 체크
    const aiLimit = await checkAIGenerationLimit(user.id);

    // 3. 학생 관리 제한 체크 (현재 학생 0명으로 가정)
    const studentLimit = await checkStudentManagementLimit(user.id, 0);

    // 4. Speaking 퀴즈 제한 체크
    const speakingLimit = await checkSpeakingQuizLimit(user.id);

    return NextResponse.json({
      success: true,
      message: '구독 시스템이 정상 작동합니다.',
      data: {
        subscription: {
          plan_type: subscription.plan_type,
          status: subscription.status,
          limits: subscription.limits,
          trial_ends_at: subscription.trial_ends_at,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
        },
        limits: {
          aiGeneration: aiLimit,
          studentManagement: studentLimit,
          speakingQuiz: speakingLimit,
        },
      },
    });
  } catch (error: any) {
    console.error('테스트 API 오류:', error);
    return NextResponse.json(
      {
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * POST: AI 생성 사용량 기록 테스트
 *
 * Request Body:
 * {
 *   "problemsGenerated": 10  // 생성할 문제 개수 (기본값: 10)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: '인증 필요' }, { status: 401 });
    }

    const body = await request.json();
    const problemsGenerated = body.problemsGenerated || 10;

    // 1. AI 생성 제한 체크
    const limitCheck = await checkAIGenerationLimit(user.id);

    if (!limitCheck.canGenerate) {
      return NextResponse.json({
        success: false,
        error: '생성 제한 초과',
        message: `${limitCheck.limit}회 제한을 모두 사용했습니다. ${limitCheck.resetDate ? `리셋: ${new Date(limitCheck.resetDate).toLocaleString('ko-KR')}` : ''}`,
        data: limitCheck,
      }, { status: 403 });
    }

    // 2. 사용량 기록
    await recordAIGeneration(user.id, problemsGenerated, {
      test: true,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
    });

    // 3. 업데이트된 제한 정보 반환
    const updatedLimit = await checkAIGenerationLimit(user.id);

    return NextResponse.json({
      success: true,
      message: `${problemsGenerated}개 문제 생성 기록 완료`,
      data: {
        generated: problemsGenerated,
        before: limitCheck,
        after: updatedLimit,
      },
    });
  } catch (error: any) {
    console.error('사용량 기록 오류:', error);
    return NextResponse.json(
      {
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
