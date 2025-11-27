import { createClient } from './server';

/**
 * 구독 및 사용량 제한 관련 함수
 * Week 1 Day 4: 사용량 제한 미들웨어
 */

// 구독 플랜 타입
export type PlanType = 'free' | 'student_pro' | 'teacher_pro' | 'student_premium' | 'teacher_premium';

// 구독 정보 타입
export interface Subscription {
  id: string;
  user_id: string;
  plan_type: PlanType;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  limits: {
    ai_generations_per_week: number | null;
    ai_generations_per_month: number | null;
    max_students: number | null;
    speaking_quizzes_per_month: number | null;
    ai_model: 'gpt-4o-mini' | 'gpt-4o';
  };
  trial_ends_at: string | null;
  current_period_start: string;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

// AI 사용량 타입
export interface AIUsage {
  id: string;
  user_id: string;
  usage_type: 'quiz_generation' | 'speaking_generation';
  problems_generated: number;
  period_type: 'weekly' | 'monthly';
  period_start: string;
  period_end: string;
  metadata: any;
  created_at: string;
}

/**
 * 사용자 구독 정보 가져오기
 */
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('구독 정보 조회 오류:', error);
    return null;
  }

  return data;
}

/**
 * AI 생성 가능 여부 체크
 * @returns { canGenerate: boolean, remaining: number, limit: number, resetDate: Date }
 */
export async function checkAIGenerationLimit(userId: string) {
  const supabase = createClient();

  // 1. 구독 정보 가져오기
  const subscription = await getUserSubscription(userId);
  if (!subscription || subscription.status !== 'active') {
    return {
      canGenerate: false,
      remaining: 0,
      limit: 0,
      resetDate: null,
      error: '활성화된 구독이 없습니다.',
    };
  }

  const { limits } = subscription;

  // 무제한 플랜 (프리미엄)
  if (limits.ai_generations_per_week === null && limits.ai_generations_per_month === null) {
    return {
      canGenerate: true,
      remaining: Infinity,
      limit: Infinity,
      resetDate: null,
    };
  }

  // 2. 현재 기간의 사용량 확인
  const periodType = limits.ai_generations_per_week !== null ? 'weekly' : 'monthly';
  const limit = (periodType === 'weekly' ? limits.ai_generations_per_week : limits.ai_generations_per_month) || 0;

  const now = new Date();
  const { periodStart, periodEnd } = getPeriodDates(now, periodType);

  const { data: usage, error } = await supabase
    .from('user_ai_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('usage_type', 'quiz_generation')
    .eq('period_type', periodType)
    .eq('period_start', periodStart.toISOString().split('T')[0])
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116은 "데이터 없음" 에러
    console.error('사용량 조회 오류:', error);
  }

  const currentUsage = usage?.problems_generated || 0;
  const remaining = Math.max(0, limit - currentUsage);

  return {
    canGenerate: remaining > 0,
    remaining,
    limit,
    resetDate: periodEnd,
    currentUsage,
  };
}

/**
 * AI 생성 사용량 기록
 */
export async function recordAIGeneration(
  userId: string,
  problemsGenerated: number,
  metadata?: any
) {
  const supabase = createClient();

  // 구독 정보 가져오기
  const subscription = await getUserSubscription(userId);
  if (!subscription) {
    throw new Error('구독 정보를 찾을 수 없습니다.');
  }

  const { limits } = subscription;
  const periodType = limits.ai_generations_per_week !== null ? 'weekly' : 'monthly';
  const now = new Date();
  const { periodStart, periodEnd } = getPeriodDates(now, periodType);

  // 기존 사용량 확인
  const { data: existingUsage } = await supabase
    .from('user_ai_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('usage_type', 'quiz_generation')
    .eq('period_type', periodType)
    .eq('period_start', periodStart.toISOString().split('T')[0])
    .single();

  if (existingUsage) {
    // 기존 사용량 업데이트
    const { error } = await supabase
      .from('user_ai_usage')
      .update({
        problems_generated: existingUsage.problems_generated + problemsGenerated,
        metadata: { ...existingUsage.metadata, ...metadata },
      })
      .eq('id', existingUsage.id);

    if (error) {
      throw new Error('사용량 업데이트 실패: ' + error.message);
    }
  } else {
    // 새로운 사용량 기록
    const { error } = await supabase.from('user_ai_usage').insert({
      user_id: userId,
      usage_type: 'quiz_generation',
      problems_generated: problemsGenerated,
      period_type: periodType,
      period_start: periodStart.toISOString().split('T')[0],
      period_end: periodEnd.toISOString().split('T')[0],
      metadata,
    });

    if (error) {
      throw new Error('사용량 기록 실패: ' + error.message);
    }
  }

  return { success: true };
}

/**
 * 학생 관리 제한 체크
 */
export async function checkStudentManagementLimit(userId: string, currentStudentCount: number) {
  const subscription = await getUserSubscription(userId);
  if (!subscription || subscription.status !== 'active') {
    return {
      canAddStudent: false,
      remaining: 0,
      limit: 0,
      error: '활성화된 구독이 없습니다.',
    };
  }

  const { limits } = subscription;
  const maxStudents = limits.max_students;

  // 무제한 플랜
  if (maxStudents === null) {
    return {
      canAddStudent: true,
      remaining: Infinity,
      limit: Infinity,
    };
  }

  // 무료 플랜 (학생 관리 불가)
  if (maxStudents === 0 || subscription.plan_type === 'free') {
    return {
      canAddStudent: false,
      remaining: 0,
      limit: 0,
      error: '학생 관리 기능은 유료 플랜에서만 사용할 수 있습니다.',
    };
  }

  const remaining = Math.max(0, maxStudents - currentStudentCount);

  return {
    canAddStudent: remaining > 0,
    remaining,
    limit: maxStudents,
    currentCount: currentStudentCount,
  };
}

/**
 * Speaking 퀴즈 제한 체크
 */
export async function checkSpeakingQuizLimit(userId: string) {
  const supabase = createClient();

  // 구독 정보 가져오기
  const subscription = await getUserSubscription(userId);
  if (!subscription || subscription.status !== 'active') {
    return {
      canUseSpeaking: false,
      remaining: 0,
      limit: 0,
      error: '활성화된 구독이 없습니다.',
    };
  }

  const { limits } = subscription;

  // 무제한 플랜
  if (limits.speaking_quizzes_per_month === null) {
    return {
      canUseSpeaking: true,
      remaining: Infinity,
      limit: Infinity,
      resetDate: null,
    };
  }

  // 무료 플랜 제한
  const limit = limits.speaking_quizzes_per_month || 0;
  const now = new Date();
  const { periodStart, periodEnd } = getPeriodDates(now, 'monthly');

  const { data: usage } = await supabase
    .from('user_ai_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('usage_type', 'speaking_generation')
    .eq('period_type', 'monthly')
    .eq('period_start', periodStart.toISOString().split('T')[0])
    .single();

  const currentUsage = usage?.problems_generated || 0;
  const remaining = Math.max(0, limit - currentUsage);

  return {
    canUseSpeaking: remaining > 0,
    remaining,
    limit,
    resetDate: periodEnd,
    currentUsage,
  };
}

/**
 * 기간 계산 헬퍼 함수
 */
function getPeriodDates(date: Date, periodType: 'weekly' | 'monthly') {
  const periodStart = new Date(date);
  const periodEnd = new Date(date);

  if (periodType === 'weekly') {
    // 주간: 월요일 시작
    const dayOfWeek = periodStart.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 일요일이면 -6, 아니면 월요일까지의 차이
    periodStart.setDate(periodStart.getDate() + diff);
    periodStart.setHours(0, 0, 0, 0);

    periodEnd.setDate(periodStart.getDate() + 6);
    periodEnd.setHours(23, 59, 59, 999);
  } else {
    // 월간: 1일 시작
    periodStart.setDate(1);
    periodStart.setHours(0, 0, 0, 0);

    periodEnd.setMonth(periodEnd.getMonth() + 1, 0); // 다음 달 0일 = 이번 달 마지막 날
    periodEnd.setHours(23, 59, 59, 999);
  }

  return { periodStart, periodEnd };
}

/**
 * 구독 플랜 업데이트
 */
export async function updateSubscriptionPlan(userId: string, newPlan: PlanType) {
  const supabase = createClient();

  // 플랜별 제한 정보 가져오기
  const { data: limits } = await supabase.rpc('get_plan_limits', { p_plan_type: newPlan });

  const { error } = await supabase
    .from('subscriptions')
    .update({
      plan_type: newPlan,
      limits: limits || {},
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    throw new Error('구독 플랜 업데이트 실패: ' + error.message);
  }

  return { success: true };
}

/**
 * 구독 취소
 */
export async function cancelSubscription(userId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    throw new Error('구독 취소 실패: ' + error.message);
  }

  return { success: true };
}
