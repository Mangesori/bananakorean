'use server';

import { createServerComponentClient } from './server';
import {
  QuizAttempt,
  UserProgress,
  UserAchievement,
  UserLearningGoal,
  UserWeakArea,
  CreateQuizAttemptData,
  UpdateProgressData,
  CreateLearningGoalData,
  UserStats,
  GrammarProgress,
  PeriodStats,
} from '@/types/quiz-tracking';

/**
 * 서버 사이드 퀴즈 tracking 함수들
 * 클라이언트에서 호출하는 함수는 quiz-mutations.ts 참고
 */

// 사용자의 퀴즈 시도 기록 조회
export async function getUserQuizAttempts(
  grammarId?: string,
  quizType?: string,
  limit: number = 50
) {
  try {
    const supabase = await createServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: '로그인이 필요합니다.' };
    }

    let query = supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (grammarId) {
      query = query.eq('grammar_name', grammarId);
    }

    if (quizType) {
      query = query.eq('quiz_type', quizType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('퀴즈 시도 조회 오류:', error);
      return { error: '퀴즈 시도 기록을 가져오는데 실패했습니다.' };
    }

    return { data };
  } catch (err) {
    console.error('퀴즈 시도 조회 중 오류:', err);
    return { error: '퀴즈 시도 조회 중 오류가 발생했습니다.' };
  }
}

/**
 * 사용자 진도 관련 함수
 */

// 사용자 전체 진도 조회
export async function getUserProgress() {
  try {
    const supabase = await createServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: '로그인이 필요합니다.' };
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('진도 조회 오류:', error);
      return { error: '진도 조회에 실패했습니다.' };
    }

    return { data };
  } catch (err) {
    console.error('진도 조회 중 오류:', err);
    return { error: '진도 조회 중 오류가 발생했습니다.' };
  }
}

// 특정 문법의 진도 조회
export async function getGrammarProgress(grammarId: string, quizType?: string) {
  try {
    const supabase = await createServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: '로그인이 필요합니다.' };
    }

    let query = supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('grammar_name', grammarId);

    if (quizType) {
      query = query.eq('quiz_type', quizType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('문법 진도 조회 오류:', error);
      return { error: '문법 진도 조회에 실패했습니다.' };
    }

    return { data };
  } catch (err) {
    console.error('문법 진도 조회 중 오류:', err);
    return { error: '문법 진도 조회 중 오류가 발생했습니다.' };
  }
}

/**
 * 사용자 통계 관련 함수
 */

// 사용자 전체 통계 조회
export async function getUserStats() {
  try {
    const supabase = await createServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: '로그인이 필요합니다.' };
    }

    // quiz_attempts에서 직접 통계 계산
    const { data: attempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select('id, is_correct, created_at, grammar_name')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (attemptsError) {
      console.error('퀴즈 시도 데이터 조회 오류:', attemptsError);
      return { error: '통계 데이터 조회에 실패했습니다.' };
    }

    // 전체 시도 횟수 및 정답 횟수
    const totalAttempts = attempts?.length || 0;
    const totalCorrect = attempts?.filter(a => a.is_correct).length || 0;
    const accuracyRate = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

    // 완료한 세션 수 (10문제 = 1세션)
    const completedSessions = Math.floor(totalAttempts / 10);

    // 연속 학습 일수 계산
    let currentStreak = 0;
    if (attempts && attempts.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 날짜별로 그룹화
      const dateSet = new Set<string>();
      attempts.forEach(attempt => {
        const attemptDate = new Date(attempt.created_at);
        attemptDate.setHours(0, 0, 0, 0);
        dateSet.add(attemptDate.toISOString().split('T')[0]);
      });

      const sortedDates = Array.from(dateSet).sort().reverse();

      // 오늘 또는 어제부터 시작하는 연속 일수 계산
      let checkDate = new Date(today);
      let foundToday = false;

      for (const dateStr of sortedDates) {
        const date = new Date(dateStr);
        const diffDays = Math.floor((checkDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0 || (diffDays === 1 && !foundToday)) {
          currentStreak++;
          checkDate = new Date(date);
          checkDate.setDate(checkDate.getDate() - 1);
          if (diffDays === 0) foundToday = true;
        } else if (diffDays > 1 || (diffDays === 1 && foundToday)) {
          break;
        }
      }
    }

    // 학습한 문법 수 (최소 10문제 이상 풀어본 문법)
    const grammarAttemptCounts = new Map<string, number>();
    attempts?.forEach(attempt => {
      const count = grammarAttemptCounts.get(attempt.grammar_name) || 0;
      grammarAttemptCounts.set(attempt.grammar_name, count + 1);
    });

    const studiedGrammars = Array.from(grammarAttemptCounts.values()).filter(
      count => count >= 10
    ).length;

    const stats: UserStats = {
      total_attempts: completedSessions, // "완료한 세션 수"로 표시
      total_correct: totalCorrect,
      accuracy_rate: accuracyRate,
      total_time_spent: 0, // 향후 추가 가능
      current_streak: currentStreak, // "연속 학습 일수"
      best_streak: currentStreak, // 임시로 현재 연속과 동일 (향후 개선 가능)
      completed_grammars: studiedGrammars, // "학습한 문법 수"
      total_achievements: 0, // 향후 추가 가능
    };

    return { data: stats };
  } catch (err) {
    console.error('사용자 통계 조회 중 오류:', err);
    return { error: '사용자 통계 조회 중 오류가 발생했습니다.' };
  }
}

/**
 * 성취 배지 관련 함수
 */

// 성취 배지 추가
export async function addUserAchievement(
  achievementType: string,
  achievementName: string,
  achievementDescription?: string,
  metadata?: Record<string, any>
) {
  try {
    const supabase = await createServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: '로그인이 필요합니다.' };
    }

    // 이미 같은 배지를 받았는지 확인
    const { data: existingAchievement } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', user.id)
      .eq('achievement_type', achievementType)
      .eq('achievement_name', achievementName)
      .single();

    if (existingAchievement) {
      return { error: '이미 받은 배지입니다.' };
    }

    const { data: achievement, error } = await supabase
      .from('user_achievements')
      .insert([
        {
          user_id: user.id,
          achievement_type: achievementType,
          achievement_name: achievementName,
          achievement_description: achievementDescription,
          metadata: metadata,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('성취 배지 추가 오류:', error);
      return { error: '성취 배지 추가에 실패했습니다.' };
    }

    return { data: achievement };
  } catch (err) {
    console.error('성취 배지 추가 중 오류:', err);
    return { error: '성취 배지 추가 중 오류가 발생했습니다.' };
  }
}

// 사용자 성취 배지 조회
export async function getUserAchievements() {
  try {
    const supabase = await createServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: '로그인이 필요합니다.' };
    }

    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('성취 배지 조회 오류:', error);
      return { error: '성취 배지 조회에 실패했습니다.' };
    }

    return { data };
  } catch (err) {
    console.error('성취 배지 조회 중 오류:', err);
    return { error: '성취 배지 조회 중 오류가 발생했습니다.' };
  }
}

/**
 * 학습 목표 관련 함수
 */

// 학습 목표 생성
export async function createLearningGoal(data: CreateLearningGoalData) {
  try {
    const supabase = await createServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: '로그인이 필요합니다.' };
    }

    const { data: goal, error } = await supabase
      .from('user_learning_goals')
      .insert([
        {
          user_id: user.id,
          ...data,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('학습 목표 생성 오류:', error);
      return { error: '학습 목표 생성에 실패했습니다.' };
    }

    return { data: goal };
  } catch (err) {
    console.error('학습 목표 생성 중 오류:', err);
    return { error: '학습 목표 생성 중 오류가 발생했습니다.' };
  }
}

// 사용자 학습 목표 조회
export async function getUserLearningGoals() {
  try {
    const supabase = await createServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: '로그인이 필요합니다.' };
    }

    const { data, error } = await supabase
      .from('user_learning_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('학습 목표 조회 오류:', error);
      return { error: '학습 목표 조회에 실패했습니다.' };
    }

    return { data };
  } catch (err) {
    console.error('학습 목표 조회 중 오류:', err);
    return { error: '학습 목표 조회 중 오류가 발생했습니다.' };
  }
}

// 최근 세션의 오답 문제 조회 (서버 컴포넌트용)
export async function getLastSessionWrongAttempts(grammarName: string, quizType: string) {
  try {
    const supabase = await createServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: '로그인이 필요합니다.' };
    }

    // 해당 문법+퀴즈타입의 최근 10개 시도 조회
    const { data: recentAttempts, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', user.id)
      .eq('grammar_name', grammarName)
      .eq('quiz_type', quizType)
      .eq('is_retry', false) // 재시도가 아닌 것만
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('최근 세션 오답 조회 오류:', error);
      return { error: '최근 세션 오답 조회에 실패했습니다.' };
    }

    // 오답만 필터링
    const wrongAttempts = recentAttempts?.filter(attempt => !attempt.is_correct) || [];

    return { data: wrongAttempts };
  } catch (err) {
    console.error('최근 세션 오답 조회 중 오류:', err);
    return { error: '최근 세션 오답 조회 중 오류가 발생했습니다.' };
  }
}
