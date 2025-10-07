'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/supabase/hooks';
import { supabase } from '@/utils/supabaseClient';
import { getUserStats, getUserProgress, getUserAchievements } from '@/lib/supabase/quiz-tracking';

// 스켈레톤 로더 컴포넌트
const StatCardSkeleton = () => (
  <div className="bg-lightGrey7 dark:bg-lightGrey7-dark p-6 rounded-lg animate-pulse">
    <div className="h-4 bg-borderColor dark:bg-borderColor-dark rounded w-24 mb-2"></div>
    <div className="h-9 bg-borderColor dark:bg-borderColor-dark rounded w-16 mt-2"></div>
  </div>
);

const TableRowSkeleton = () => (
  <tr>
    <td className="px-6 py-4">
      <div className="h-4 bg-borderColor dark:bg-borderColor-dark rounded w-16 animate-pulse"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-borderColor dark:bg-borderColor-dark rounded w-24 animate-pulse"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-borderColor dark:bg-borderColor-dark rounded w-12 animate-pulse"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-borderColor dark:bg-borderColor-dark rounded w-12 animate-pulse"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-borderColor dark:bg-borderColor-dark rounded w-20 animate-pulse"></div>
    </td>
  </tr>
);

const AchievementCardSkeleton = () => (
  <div className="bg-lightGrey7 dark:bg-lightGrey7-dark p-4 rounded-lg animate-pulse">
    <div className="h-6 bg-borderColor dark:bg-borderColor-dark rounded w-32 mb-2"></div>
    <div className="h-4 bg-borderColor dark:bg-borderColor-dark rounded w-full mt-1"></div>
    <div className="h-3 bg-borderColor dark:bg-borderColor-dark rounded w-24 mt-2"></div>
  </div>
);

const StudentDashboardPrimary = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState(null);
  const [achievements, setAchievements] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [loadingAchievements, setLoadingAchievements] = useState(true);
  const profileChecked = useRef(false);

  useEffect(() => {
    const createProfile = async () => {
      if (!user || profileChecked.current) return;

      profileChecked.current = true;

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
                full_name: user.user_metadata?.full_name || user.email.split('@')[0],
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

      // 점진적으로 데이터 로드
      try {
        // 1. 통계 먼저 로드
        getUserStats().then(statsResult => {
          if (statsResult.data) {
            setStats(statsResult.data);
          }
          setLoadingStats(false);
        });

        // 2. 진도 로드
        getUserProgress().then(progressResult => {
          if (progressResult.data) {
            setProgress(progressResult.data);
          }
          setLoadingProgress(false);
        });

        // 3. 성취 로드
        getUserAchievements().then(achievementsResult => {
          if (achievementsResult.data) {
            setAchievements(achievementsResult.data);
          }
          setLoadingAchievements(false);
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoadingStats(false);
        setLoadingProgress(false);
        setLoadingAchievements(false);
      }
    };

    loadDashboardData();
  }, [user]);

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
          {loadingStats ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
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
            </>
          )}
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
              {loadingProgress ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : progress && progress.length > 0 ? (
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
            성취 배지 {!loadingAchievements && achievements && `(${achievements.length})`}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadingAchievements ? (
            <>
              <AchievementCardSkeleton />
              <AchievementCardSkeleton />
              <AchievementCardSkeleton />
            </>
          ) : achievements && achievements.length > 0 ? (
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
