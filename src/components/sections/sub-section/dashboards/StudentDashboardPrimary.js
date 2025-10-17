'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/supabase/hooks';
import { supabase } from '@/utils/supabaseClient';
import { getUserStats, getUserProgress, getUserAchievements } from '@/lib/supabase/quiz-mutations';
import { useQuery } from '@tanstack/react-query';
import { topicMeta } from '@/data/quiz/topics/meta';

// 스켈레톤 로더 컴포넌트
const StatCardSkeleton = () => (
  <div className="bg-lightGrey7 dark:bg-lightGrey7-dark p-6 rounded-lg animate-pulse">
    <div className="h-4 bg-borderColor dark:bg-borderColor-dark rounded w-24 mb-2"></div>
    <div className="h-9 bg-borderColor dark:bg-borderColor-dark rounded w-16 mt-2"></div>
  </div>
);

const ProgressCardSkeleton = () => (
  <div className="bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark rounded-lg p-5 animate-pulse">
    <div className="mb-4">
      <div className="h-6 bg-borderColor dark:bg-borderColor-dark rounded w-32 mb-2"></div>
      <div className="h-6 bg-borderColor dark:bg-borderColor-dark rounded w-24"></div>
    </div>
    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-borderColor dark:border-borderColor-dark">
      <div className="flex-1">
        <div className="h-3 bg-borderColor dark:bg-borderColor-dark rounded w-16 mb-1"></div>
        <div className="h-8 bg-borderColor dark:bg-borderColor-dark rounded w-8"></div>
      </div>
      <div className="flex-1">
        <div className="h-3 bg-borderColor dark:bg-borderColor-dark rounded w-16 mb-1"></div>
        <div className="h-8 bg-borderColor dark:bg-borderColor-dark rounded w-8"></div>
      </div>
      <div className="flex-1">
        <div className="h-3 bg-borderColor dark:bg-borderColor-dark rounded w-16 mb-1"></div>
        <div className="h-8 bg-borderColor dark:bg-borderColor-dark rounded w-12"></div>
      </div>
    </div>
    <div className="flex gap-2">
      <div className="flex-1 h-10 bg-borderColor dark:bg-borderColor-dark rounded-lg"></div>
      <div className="flex-1 h-10 bg-borderColor dark:bg-borderColor-dark rounded-lg"></div>
    </div>
  </div>
);

const AchievementCardSkeleton = () => (
  <div className="bg-lightGrey7 dark:bg-lightGrey7-dark p-4 rounded-lg animate-pulse">
    <div className="h-6 bg-borderColor dark:bg-borderColor-dark rounded w-32 mb-2"></div>
    <div className="h-4 bg-borderColor dark:bg-borderColor-dark rounded w-full mt-1"></div>
    <div className="h-3 bg-borderColor dark:bg-borderColor-dark rounded w-24 mt-2"></div>
  </div>
);

const StudentDashboardPrimary = () => {
  const { user, refreshSession } = useAuth();
  const profileChecked = useRef(false);
  const sessionRefreshed = useRef(false);
  const [showAllProgress, setShowAllProgress] = useState(false);

  // 페이지 로드 시 세션 갱신 (Server Action redirect 후)
  useEffect(() => {
    if (!sessionRefreshed.current) {
      sessionRefreshed.current = true;
      console.log('[StudentDashboard] Refreshing session on mount');
      refreshSession();
    }
  }, [refreshSession]);

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
                name: user.user_metadata?.name || user.email.split('@')[0],
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

  // React Query를 사용한 데이터 페칭
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      const result = await getUserStats();
      return result.data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5분
  });

  const { data: progress, isLoading: loadingProgress } = useQuery({
    queryKey: ['userProgress', user?.id],
    queryFn: async () => {
      const result = await getUserProgress();
      return result.data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5분
  });

  const { data: achievements, isLoading: loadingAchievements } = useQuery({
    queryKey: ['userAchievements', user?.id],
    queryFn: async () => {
      const result = await getUserAchievements();
      return result.data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5분
  });

  return (
    <div className="p-5 md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
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
                  완료한 세션 수
                </h3>
                <p className="text-3xl font-bold text-blackColor dark:text-blackColor-dark mt-2">
                  {stats?.total_attempts || 0}
                </p>
                <p className="text-xs text-contentColor dark:text-contentColor-dark mt-1">
                  10문제 = 1세션
                </p>
              </div>

              <div className="bg-lightGrey7 dark:bg-lightGrey7-dark p-6 rounded-lg">
                <h3 className="text-contentColor dark:text-contentColor-dark text-sm font-medium">
                  정답률
                </h3>
                <p className="text-3xl font-bold text-blackColor dark:text-blackColor-dark mt-2">
                  {stats?.accuracy_rate?.toFixed(1) || 0}%
                </p>
                <p className="text-xs text-contentColor dark:text-contentColor-dark mt-1">
                  전체 문제 정답률
                </p>
              </div>

              <div className="bg-lightGrey7 dark:bg-lightGrey7-dark p-6 rounded-lg">
                <h3 className="text-contentColor dark:text-contentColor-dark text-sm font-medium">
                  연속 학습 일수
                </h3>
                <p className="text-3xl font-bold text-blackColor dark:text-blackColor-dark mt-2">
                  {stats?.current_streak || 0}
                </p>
                <p className="text-xs text-contentColor dark:text-contentColor-dark mt-1">
                  매일 학습 연속 기록
                </p>
              </div>

              <div className="bg-lightGrey7 dark:bg-lightGrey7-dark p-6 rounded-lg">
                <h3 className="text-contentColor dark:text-contentColor-dark text-sm font-medium">
                  학습한 문법 수
                </h3>
                <p className="text-3xl font-bold text-blackColor dark:text-blackColor-dark mt-2">
                  {stats?.completed_grammars || 0}
                </p>
                <p className="text-xs text-contentColor dark:text-contentColor-dark mt-1">
                  1세션 이상 완료한 문법
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
        
        {loadingProgress ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProgressCardSkeleton />
            <ProgressCardSkeleton />
            <ProgressCardSkeleton />
            <ProgressCardSkeleton />
            <ProgressCardSkeleton />
            <ProgressCardSkeleton />
          </div>
        ) : progress && progress.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(showAllProgress ? progress : progress.slice(0, 6)).map(item => {
                // 한글 grammar_name을 topic ID로 변환
                const getTopicIdFromGrammarName = grammarName => {
                  const entry = Object.entries(topicMeta).find(
                    ([_, meta]) => meta.title === grammarName
                  );
                  return entry ? entry[0] : null;
                };

                // 퀴즈 타입을 읽기 쉬운 형태로 변환
                const getQuizTypeLabel = quizType => {
                  switch (quizType) {
                    case 'dialogue_drag_drop':
                      return 'Drag and Drop';
                    case 'fill_in_blank':
                      return 'Fill in the Blank';
                    case 'multiple_choice':
                      return 'Multiple Choice';
                    default:
                      return quizType;
                  }
                };

                // 퀴즈 타입에 따른 URL 경로 결정
                const getQuizPath = (quizType, grammarName, mode = 'review') => {
                  const topicId = getTopicIdFromGrammarName(grammarName);
                  if (!topicId) return null;

                  const queryParam = mode === 'retake' ? '?mode=retake' : '?reviewMode=last-session';

                  switch (quizType) {
                    case 'dialogue_drag_drop':
                      return `/quiz/DialogueDragAndDrop/${topicId}${queryParam}`;
                    case 'fill_in_blank':
                      return `/quiz/fill-blank/${topicId}${queryParam}`;
                    case 'multiple_choice':
                      return `/quiz/multiple/${topicId}${queryParam}`;
                    default:
                      return null;
                  }
                };

                const reviewPath = getQuizPath(item.quiz_type, item.grammar_name, 'review');
                const retakePath = getQuizPath(item.quiz_type, item.grammar_name, 'retake');
                const accuracyRate = ((item.correct_attempts / item.total_attempts) * 100).toFixed(0);
                const hasWrongAnswers = item.correct_attempts < item.total_attempts;

                return (
                  <div key={item.id} className="bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark rounded-lg p-5 hover:shadow-md transition-shadow">
                    {/* 상단: 문법명과 퀴즈 타입 */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-blackColor dark:text-blackColor-dark mb-1">
                        {item.grammar_name}
                      </h3>
                      <span className="inline-block bg-lightGrey7 dark:bg-lightGrey7-dark text-contentColor dark:text-contentColor-dark text-xs px-3 py-1 rounded-full">
                        {getQuizTypeLabel(item.quiz_type)}
                      </span>
                    </div>

                    {/* 통계 정보 */}
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-borderColor dark:border-borderColor-dark">
                      <div className="flex-1">
                        <p className="text-xs text-contentColor dark:text-contentColor-dark mb-1">시도 횟수</p>
                        <p className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">{item.total_attempts}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-contentColor dark:text-contentColor-dark mb-1">정답 횟수</p>
                        <p className="text-2xl font-bold text-primaryColor dark:text-primaryColor-dark">{item.correct_attempts}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-contentColor dark:text-contentColor-dark mb-1">정답률</p>
                        <p className={`text-2xl font-bold ${
                          accuracyRate >= 80 
                            ? 'text-primaryColor dark:text-primaryColor-dark' 
                            : accuracyRate >= 60 
                            ? 'text-secondaryColor3 dark:text-secondaryColor3-dark' 
                            : 'text-secondaryColor2 dark:text-secondaryColor2-dark'
                        }`}>
                          {accuracyRate}%
                        </p>
                      </div>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="flex gap-2">
                      {hasWrongAnswers && reviewPath ? (
                        <a
                          href={reviewPath}
                          className="flex-1 bg-primaryColor hover:bg-primaryColor/80 text-whiteColor dark:text-whiteColor-dark text-sm font-medium py-2 px-4 rounded-lg transition-colors text-center"
                        >
                          오답 확인
                        </a>
                      ) : (
                        <button className="flex-1 bg-borderColor dark:bg-borderColor-dark text-contentColor dark:text-contentColor-dark text-sm font-medium py-2 px-4 rounded-lg cursor-not-allowed opacity-50">
                          오답 없음
                        </button>
                      )}
                      {retakePath ? (
                        <a
                          href={retakePath}
                          className="flex-1 bg-secondaryColor hover:bg-secondaryColor/80 text-whiteColor dark:text-whiteColor-dark text-sm font-medium py-2 px-4 rounded-lg transition-colors text-center"
                        >
                          다시 풀기
                        </a>
                      ) : (
                        <button className="flex-1 bg-borderColor dark:bg-borderColor-dark text-contentColor dark:text-contentColor-dark text-sm font-medium py-2 px-4 rounded-lg cursor-not-allowed opacity-50">
                          -
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* 더 보기/접기 버튼 */}
            {progress.length > 6 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAllProgress(!showAllProgress)}
                  className="bg-primaryColor hover:bg-primaryColor/80 text-whiteColor dark:text-whiteColor-dark px-6 py-2 rounded-lg transition-colors font-medium"
                >
                  {showAllProgress ? '접기' : `더 보기 (${progress.length - 6}개)`}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-contentColor dark:text-contentColor-dark py-8">
            아직 학습 진도가 없습니다. 퀴즈를 풀어보세요!
          </div>
        )}
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
