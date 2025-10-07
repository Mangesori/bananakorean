'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/supabase/hooks';
import { supabase } from '@/utils/supabaseClient';
import { getUserStats, getUserProgress, getUserAchievements } from '@/lib/supabase/quiz-tracking';

const StudentDashboardPrimary = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createProfile = async () => {
      if (!user) return;

      try {
        // 프로필이 이미 존재하는지 확인
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!existingProfile) {
          // 프로필이 없으면 새로 생성
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.email.split('@')[0],
                role: 'student',
              },
            ])
            .select()
            .single();

          if (profileError && profileError.code !== '23505') {
            console.error('Error creating profile:', profileError);
          }
        }
      } catch (error) {
        console.error('Error checking/creating profile:', error);
      }
    };

    createProfile();
  }, [user]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // 사용자 통계 조회
        const statsResult = await getUserStats();
        if (statsResult.data) {
          setStats(statsResult.data);
        }

        // 사용자 진도 조회
        const progressResult = await getUserProgress();
        if (progressResult.data) {
          setProgress(progressResult.data);
        }

        // 사용자 성취 조회
        const achievementsResult = await getUserAchievements();
        if (achievementsResult.data) {
          setAchievements(achievementsResult.data);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      {/* 전체 통계 섹션 */}
      <section className="mb-30px">
        <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
          <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
            학습 통계
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-lightGrey7 dark:bg-lightGrey7-dark p-6 rounded-lg">
            <h3 className="text-contentColor dark:text-contentColor-dark text-sm font-medium">
              총 시도 횟수
            </h3>
            <p className="text-3xl font-bold text-blackColor dark:text-blackColor-dark mt-2">
              {stats?.total_attempts || 0}
            </p>
          </div>

          <div className="bg-lightGrey7 dark:bg-lightGrey7-dark p-6 rounded-lg">
            <h3 className="text-contentColor dark:text-contentColor-dark text-sm font-medium">
              정답률
            </h3>
            <p className="text-3xl font-bold text-blackColor dark:text-blackColor-dark mt-2">
              {stats?.accuracy_rate?.toFixed(1) || 0}%
            </p>
          </div>

          <div className="bg-lightGrey7 dark:bg-lightGrey7-dark p-6 rounded-lg">
            <h3 className="text-contentColor dark:text-contentColor-dark text-sm font-medium">
              현재 연속 기록
            </h3>
            <p className="text-3xl font-bold text-blackColor dark:text-blackColor-dark mt-2">
              {stats?.current_streak || 0}
            </p>
          </div>

          <div className="bg-lightGrey7 dark:bg-lightGrey7-dark p-6 rounded-lg">
            <h3 className="text-contentColor dark:text-contentColor-dark text-sm font-medium">
              완료한 문법
            </h3>
            <p className="text-3xl font-bold text-blackColor dark:text-blackColor-dark mt-2">
              {stats?.completed_grammars || 0}
            </p>
          </div>
        </div>
      </section>

      {/* 학습 진도 섹션 */}
      <section className="mb-30px">
        <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
          <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
            학습 진도
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-lightGrey7 dark:bg-lightGrey7-dark">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-contentColor dark:text-contentColor-dark uppercase tracking-wider">
                  문법 ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-contentColor dark:text-contentColor-dark uppercase tracking-wider">
                  퀴즈 타입
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-contentColor dark:text-contentColor-dark uppercase tracking-wider">
                  시도 횟수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-contentColor dark:text-contentColor-dark uppercase tracking-wider">
                  정답 횟수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-contentColor dark:text-contentColor-dark uppercase tracking-wider">
                  숙련도
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderColor dark:divide-borderColor-dark">
              {progress.length > 0 ? (
                progress.slice(0, 10).map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blackColor dark:text-blackColor-dark">
                      {item.grammar_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-contentColor dark:text-contentColor-dark">
                      {item.quiz_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-contentColor dark:text-contentColor-dark">
                      {item.total_attempts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-contentColor dark:text-contentColor-dark">
                      {item.correct_attempts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-contentColor dark:text-contentColor-dark">
                      <div className="flex items-center">
                        <div className="w-16 bg-borderColor dark:bg-borderColor-dark rounded-full h-2 mr-2">
                          <div
                            className="bg-primaryColor h-2 rounded-full"
                            style={{ width: `${(item.mastery_level / 5) * 100}%` }}
                          />
                        </div>
                        <span>{item.mastery_level}/5</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-contentColor dark:text-contentColor-dark"
                  >
                    아직 학습 진도가 없습니다. 퀴즈를 풀어보세요!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 성취 배지 섹션 */}
      <section>
        <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
          <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
            성취 배지 ({achievements.length})
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.length > 0 ? (
            achievements.slice(0, 6).map(achievement => (
              <div
                key={achievement.id}
                className="bg-lightGrey7 dark:bg-lightGrey7-dark p-4 rounded-lg"
              >
                <h3 className="font-semibold text-lg text-blackColor dark:text-blackColor-dark">
                  {achievement.achievement_name}
                </h3>
                <p className="text-sm text-contentColor dark:text-contentColor-dark mt-1">
                  {achievement.achievement_description}
                </p>
                <p className="text-xs text-contentColor dark:text-contentColor-dark opacity-70 mt-2">
                  {new Date(achievement.earned_at).toLocaleDateString('ko-KR')}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-contentColor dark:text-contentColor-dark py-8">
              아직 획득한 배지가 없습니다. 열심히 학습해서 배지를 모아보세요!
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboardPrimary;
