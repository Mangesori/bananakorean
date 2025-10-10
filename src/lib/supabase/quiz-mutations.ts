/**
 * 클라이언트에서 호출 가능한 퀴즈 mutation 함수들
 */

import { createClient } from './client';
import { CreateQuizAttemptData, UpdateProgressData } from '@/types/quiz-tracking';

// 퀴즈 시도 기록 저장
export async function saveQuizAttempt(data: CreateQuizAttemptData) {
  try {
    const supabase = createClient();
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
          is_retry: data.is_retry || false,
          hints_used: data.hints_used || 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('퀴즈 시도 저장 오류:', error);
      return { error: '퀴즈 시도 저장에 실패했습니다.' };
    }

    // 진도 업데이트는 세션 완료 시에만 수행하도록 변경
    // (개별 문제마다 업데이트하지 않음)

    return { data: attempt };
  } catch (err) {
    console.error('퀴즈 시도 저장 중 오류:', err);
    return { error: '퀴즈 시도 저장 중 오류가 발생했습니다.' };
  }
}

// 사용자 진도 업데이트
export async function updateUserProgress(data: UpdateProgressData) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: '로그인이 필요합니다.' };
    }

    // 다시 시도인 경우 진도 업데이트 하지 않음
    if (data.is_retry) {
      return { success: true };
    }

    // 기존 진도 조회
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('grammar_name', data.grammar_name)
      .eq('quiz_type', data.quiz_type)
      .single();

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

      const updateData: any = {
        total_attempts: newTotalAttempts,
        correct_attempts: newCorrectAttempts,
        total_time_spent: existingProgress.total_time_spent + (data.time_spent || 0),
        current_streak: newCurrentStreak,
        best_streak: newBestStreak,
        mastery_level: newMasteryLevel,
      };

      // completed_at은 처음 mastery_level 3 달성 시에만 설정
      if (newMasteryLevel >= 3 && !existingProgress.completed_at) {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('user_progress')
        .update(updateData)
        .eq('id', existingProgress.id);

      if (error) {
        console.error('진도 업데이트 오류:', error);
        return { error: '진도 업데이트에 실패했습니다.' };
      }
    } else {
      // 새 진도 생성
      const { error } = await supabase.from('user_progress').insert([
        {
          user_id: user.id,
          grammar_name: data.grammar_name,
          quiz_type: data.quiz_type,
          total_attempts: 1,
          correct_attempts: data.is_correct ? 1 : 0,
          total_time_spent: data.time_spent || 0,
          current_streak: data.is_correct ? 1 : 0,
          best_streak: data.is_correct ? 1 : 0,
          mastery_level: 0,
        },
      ]);

      if (error) {
        console.error('진도 생성 오류:', error);
        return { error: '진도 생성에 실패했습니다.' };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('진도 업데이트 중 오류:', err);
    return { error: '진도 업데이트 중 오류가 발생했습니다.' };
  }
}

// 사용자 통계 조회 (클라이언트용)
export async function getUserStats() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: '로그인이 필요합니다.' };
    }

    // 총 시도 횟수
    const { count: totalAttempts } = await supabase
      .from('quiz_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // 정답 횟수
    const { count: totalCorrect } = await supabase
      .from('quiz_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_correct', true);

    // 현재 연속 학습 일수 계산
    const { data: recentAttempts } = await supabase
      .from('quiz_attempts')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    let currentStreak = 0;
    if (recentAttempts && recentAttempts.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const uniqueDates = new Set(
        recentAttempts.map(attempt => {
          const date = new Date(attempt.created_at);
          date.setHours(0, 0, 0, 0);
          return date.getTime();
        })
      );

      const sortedDates = Array.from(uniqueDates).sort((a, b) => b - a);

      let expectedDate = today.getTime();
      for (const date of sortedDates) {
        if (date === expectedDate) {
          currentStreak++;
          expectedDate -= 24 * 60 * 60 * 1000; // 하루 전
        } else if (date < expectedDate) {
          break;
        }
      }
    }

    // 학습한 문법 수 (1회 이상 시도한 고유 문법 수 - 중복 제거)
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('grammar_name')
      .eq('user_id', user.id)
      .gte('total_attempts', 1);

    // 고유한 문법 이름만 카운트 (퀴즈 타입과 관계없이)
    const uniqueGrammars = new Set(progressData?.map(p => p.grammar_name) || []);
    const completedGrammars = uniqueGrammars.size;

    const accuracyRate =
      totalAttempts && totalAttempts > 0 ? ((totalCorrect || 0) / totalAttempts) * 100 : 0;

    // 세션 수 계산 (10문제 = 1세션)
    const totalSessions = Math.floor((totalAttempts || 0) / 10);

    return {
      data: {
        total_attempts: totalSessions,
        total_correct: totalCorrect || 0,
        accuracy_rate: accuracyRate,
        current_streak: currentStreak,
        completed_grammars: completedGrammars,
      },
    };
  } catch (err) {
    console.error('통계 조회 중 오류:', err);
    return { error: '통계 조회 중 오류가 발생했습니다.' };
  }
}

// 사용자 진도 조회 (클라이언트용)
export async function getUserProgress() {
  try {
    const supabase = createClient();
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

// 사용자 성취 배지 조회 (클라이언트용)
export async function getUserAchievements() {
  try {
    const supabase = createClient();
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
      console.error('배지 조회 오류:', error);
      return { error: '배지 조회에 실패했습니다.' };
    }

    return { data };
  } catch (err) {
    console.error('배지 조회 중 오류:', err);
    return { error: '배지 조회 중 오류가 발생했습니다.' };
  }
}

// 최근 세션의 오답 문제 조회 (학습 진도 표의 오답 확인용)
export async function getLastSessionWrongAttempts(grammarName: string, quizType: string) {
  try {
    const supabase = createClient();
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

// 세션 완료 시 진도 업데이트 (10문제 완료 시)
export async function updateSessionProgress(
  grammarName: string,
  quizType: string,
  sessionAttempts: { is_correct: boolean; time_spent?: number; is_retry: boolean }[]
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: '로그인이 필요합니다.' };
    }

    // 재시도가 아닌 문제들만 필터링
    const validAttempts = sessionAttempts.filter(attempt => !attempt.is_retry);

    if (validAttempts.length === 0) {
      return { success: true }; // 유효한 시도가 없으면 업데이트 안 함
    }

    // 기존 진도 조회
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('grammar_name', grammarName)
      .eq('quiz_type', quizType)
      .single();

    const correctCount = validAttempts.filter(a => a.is_correct).length;
    const totalTimeSpent = validAttempts.reduce((sum, a) => sum + (a.time_spent || 0), 0);

    if (existingProgress) {
      // 기존 진도 업데이트
      const newTotalAttempts = existingProgress.total_attempts + validAttempts.length;
      const newCorrectAttempts = existingProgress.correct_attempts + correctCount;

      // 현재 세션의 연속 정답 계산
      let currentSessionStreak = 0;
      for (const attempt of validAttempts) {
        if (attempt.is_correct) {
          currentSessionStreak++;
        } else {
          currentSessionStreak = 0;
        }
      }

      const newCurrentStreak = currentSessionStreak;
      const newBestStreak = Math.max(existingProgress.best_streak, newCurrentStreak);

      // 숙련도 계산 (정답률 기반)
      const accuracyRate = newCorrectAttempts / newTotalAttempts;
      let newMasteryLevel = 0;
      if (accuracyRate >= 0.9 && newTotalAttempts >= 10) newMasteryLevel = 5;
      else if (accuracyRate >= 0.8 && newTotalAttempts >= 8) newMasteryLevel = 4;
      else if (accuracyRate >= 0.7 && newTotalAttempts >= 6) newMasteryLevel = 3;
      else if (accuracyRate >= 0.6 && newTotalAttempts >= 4) newMasteryLevel = 2;
      else if (accuracyRate >= 0.5 && newTotalAttempts >= 2) newMasteryLevel = 1;

      const updateData: any = {
        total_attempts: newTotalAttempts,
        correct_attempts: newCorrectAttempts,
        total_time_spent: existingProgress.total_time_spent + totalTimeSpent,
        current_streak: newCurrentStreak,
        best_streak: newBestStreak,
        mastery_level: newMasteryLevel,
      };

      // completed_at은 처음 mastery_level 3 달성 시에만 설정
      if (newMasteryLevel >= 3 && !existingProgress.completed_at) {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('user_progress')
        .update(updateData)
        .eq('id', existingProgress.id);

      if (error) {
        console.error('세션 진도 업데이트 오류:', error);
        return { error: '세션 진도 업데이트에 실패했습니다.' };
      }
    } else {
      // 새 진도 생성
      // 숙련도 계산 (정답률 기반)
      const accuracyRate = correctCount / validAttempts.length;
      let newMasteryLevel = 0;
      if (accuracyRate >= 0.9 && validAttempts.length >= 10) newMasteryLevel = 5;
      else if (accuracyRate >= 0.8 && validAttempts.length >= 8) newMasteryLevel = 4;
      else if (accuracyRate >= 0.7 && validAttempts.length >= 6) newMasteryLevel = 3;
      else if (accuracyRate >= 0.6 && validAttempts.length >= 4) newMasteryLevel = 2;
      else if (accuracyRate >= 0.5 && validAttempts.length >= 2) newMasteryLevel = 1;

      const { error } = await supabase.from('user_progress').insert([
        {
          user_id: user.id,
          grammar_name: grammarName,
          quiz_type: quizType,
          total_attempts: validAttempts.length,
          correct_attempts: correctCount,
          total_time_spent: totalTimeSpent,
          current_streak: correctCount === validAttempts.length ? validAttempts.length : 0,
          best_streak: correctCount === validAttempts.length ? validAttempts.length : 0,
          mastery_level: newMasteryLevel,
        },
      ]);

      if (error) {
        console.error('세션 진도 생성 오류:', error);
        return { error: '세션 진도 생성에 실패했습니다.' };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('세션 진도 업데이트 중 오류:', err);
    return { error: '세션 진도 업데이트 중 오류가 발생했습니다.' };
  }
}
