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
 * 퀴즈 시도 관련 함수
 */

// 퀴즈 시도 기록 저장
export async function saveQuizAttempt(data: CreateQuizAttemptData) {
  try {
    const supabase = await createServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: '로그인이 필요합니다.' };
    }

    const { data: attempt, error } = await supabase
      .from('quiz_attempts')
      .insert([
        {
          user_id: user.id,
          ...data,
          hints_used: data.hints_used || 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('퀴즈 시도 저장 오류:', error);
      return { error: '퀴즈 시도 저장에 실패했습니다.' };
    }

    // 진도 업데이트
    await updateUserProgress({
      grammar_id: data.grammar_id,
      quiz_type: data.quiz_type,
      is_correct: data.is_correct,
      time_spent: data.time_spent,
    });

    return { data: attempt };
  } catch (err) {
    console.error('퀴즈 시도 저장 중 오류:', err);
    return { error: '퀴즈 시도 저장 중 오류가 발생했습니다.' };
  }
}

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
      query = query.eq('grammar_id', grammarId);
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

// 사용자 진도 업데이트
export async function updateUserProgress(data: UpdateProgressData) {
  try {
    const supabase = await createServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: '로그인이 필요합니다.' };
    }

    // 기존 진도 조회
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('grammar_id', data.grammar_id)
      .eq('quiz_type', data.quiz_type)
      .single();

    const now = new Date().toISOString();

    if (existingProgress) {
      // 기존 진도 업데이트
      const newTotalAttempts = existingProgress.total_attempts + 1;
      const newCorrectAttempts = data.is_correct
        ? existingProgress.correct_attempts + 1
        : existingProgress.correct_attempts;

      const newCurrentStreak = data.is_correct ? existingProgress.current_streak + 1 : 0;

      const newBestStreak = Math.max(existingProgress.best_streak, newCurrentStreak);

      // 숙련도 계산 (정답률 기반)
      const accuracyRate = newCorrectAttempts / newTotalAttempts;
      let newMasteryLevel = 0;
      if (accuracyRate >= 0.9 && newTotalAttempts >= 10) newMasteryLevel = 5;
      else if (accuracyRate >= 0.8 && newTotalAttempts >= 8) newMasteryLevel = 4;
      else if (accuracyRate >= 0.7 && newTotalAttempts >= 6) newMasteryLevel = 3;
      else if (accuracyRate >= 0.6 && newTotalAttempts >= 4) newMasteryLevel = 2;
      else if (accuracyRate >= 0.5 && newTotalAttempts >= 2) newMasteryLevel = 1;

      const { data: updatedProgress, error } = await supabase
        .from('user_progress')
        .update({
          total_attempts: newTotalAttempts,
          correct_attempts: newCorrectAttempts,
          total_time_spent: existingProgress.total_time_spent + (data.time_spent || 0),
          current_streak: newCurrentStreak,
          best_streak: newBestStreak,
          mastery_level: newMasteryLevel,
          last_attempted_at: now,
          completed_at: newMasteryLevel >= 3 ? now : existingProgress.completed_at,
        })
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (error) {
        console.error('진도 업데이트 오류:', error);
        return { error: '진도 업데이트에 실패했습니다.' };
      }

      return { data: updatedProgress };
    } else {
      // 새로운 진도 생성
      const { data: newProgress, error } = await supabase
        .from('user_progress')
        .insert([
          {
            user_id: user.id,
            grammar_id: data.grammar_id,
            quiz_type: data.quiz_type,
            total_attempts: 1,
            correct_attempts: data.is_correct ? 1 : 0,
            total_time_spent: data.time_spent || 0,
            current_streak: data.is_correct ? 1 : 0,
            best_streak: data.is_correct ? 1 : 0,
            mastery_level: data.is_correct ? 1 : 0,
            last_attempted_at: now,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('진도 생성 오류:', error);
        return { error: '진도 생성에 실패했습니다.' };
      }

      return { data: newProgress };
    }
  } catch (err) {
    console.error('진도 업데이트 중 오류:', err);
    return { error: '진도 업데이트 중 오류가 발생했습니다.' };
  }
}

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
      .eq('grammar_id', grammarId);

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

    // 병렬로 데이터 조회
    const [progressResult, achievementsResult] = await Promise.all([
      supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id),
      supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', user.id),
    ]);

    const { data: progressData, error: progressError } = progressResult;
    const { data: achievementsData } = achievementsResult;

    if (progressError) {
      console.error('진도 데이터 조회 오류:', progressError);
      return { error: '통계 데이터 조회에 실패했습니다.' };
    }

    // 통계 계산
    const totalAttempts = progressData?.reduce((sum, p) => sum + p.total_attempts, 0) || 0;
    const totalCorrect = progressData?.reduce((sum, p) => sum + p.correct_attempts, 0) || 0;
    const totalTimeSpent = progressData?.reduce((sum, p) => sum + p.total_time_spent, 0) || 0;
    const currentStreak = progressData && progressData.length > 0
      ? Math.max(...progressData.map(p => p.current_streak), 0)
      : 0;
    const bestStreak = progressData && progressData.length > 0
      ? Math.max(...progressData.map(p => p.best_streak), 0)
      : 0;
    const completedGrammars = progressData?.filter(p => p.mastery_level >= 3).length || 0;
    const totalAchievements = achievementsData?.length || 0;

    const stats: UserStats = {
      total_attempts: totalAttempts,
      total_correct: totalCorrect,
      accuracy_rate: totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0,
      total_time_spent: totalTimeSpent,
      current_streak: currentStreak,
      best_streak: bestStreak,
      completed_grammars: completedGrammars,
      total_achievements: totalAchievements,
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
