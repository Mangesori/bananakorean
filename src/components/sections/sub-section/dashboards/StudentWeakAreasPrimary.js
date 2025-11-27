'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/supabase/hooks';
import { getUserGrammarProgress } from '@/lib/supabase/quiz-mutations';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

const StudentWeakAreasPrimary = () => {
  const { user } = useAuth();
  const t = useTranslations();
  const [sortBy, setSortBy] = useState('accuracy'); // 'accuracy' | 'attempts'
  const [filterQuizType, setFilterQuizType] = useState('all'); // 'all' | 'dialogue_drag_drop' | 'fill_in_blank' | 'multiple_choice'

  // 문법별 진도 조회
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['userGrammarProgress', user?.id],
    queryFn: async () => {
      const result = await getUserGrammarProgress();
      return result.data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="container-fluid">
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor"></div>
        </div>
      </div>
    );
  }

  if (!progressData || progressData.length === 0) {
    return (
      <div className="container-fluid">
        <div className="mb-6">
          <Link
            href="/dashboards/student-dashboard"
            className="inline-flex items-center gap-2 text-primaryColor hover:text-primaryColor/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common.backToDashboard')}
          </Link>
        </div>
        <div className="bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark rounded-lg p-8 text-center">
          <p className="text-contentColor dark:text-contentColor-dark">
            {t('dashboard.noAttemptsYet')}
          </p>
        </div>
      </div>
    );
  }

  // 퀴즈 타입 레이블 변환
  const getQuizTypeLabel = quizType => {
    switch (quizType) {
      case 'dialogue_drag_drop':
        return t('quizTypes.dragDrop');
      case 'fill_in_blank':
        return t('quizTypes.fillInBlank');
      case 'multiple_choice':
        return t('quizTypes.multipleChoice');
      default:
        return quizType;
    }
  };

  // 난이도 아이콘
  const getDifficultyIcon = accuracy => {
    const acc = parseFloat(accuracy);
    if (acc < 40) return '🔴';
    if (acc < 60) return '🟡';
    return '🟢';
  };

  // 개선 제안 메시지
  const getImprovementMessage = accuracy => {
    const acc = parseFloat(accuracy);
    if (acc < 40) return t('improvement.veryWeak');
    if (acc < 60) return t('improvement.weak');
    if (acc < 80) return t('improvement.good');
    return t('improvement.excellent');
  };

  // 필터 적용
  let filteredData = progressData;
  if (filterQuizType !== 'all') {
    filteredData = filteredData.filter(item => item.quiz_type === filterQuizType);
  }

  // 문법별로 그룹화 (같은 문법이지만 다른 퀴즈 타입인 경우)
  const groupedByGrammar = filteredData.reduce((acc, item) => {
    const key = filterQuizType === 'all' ? item.grammar_name : `${item.grammar_name}_${item.quiz_type}`;
    if (!acc[key]) {
      acc[key] = {
        grammar_name: item.grammar_name,
        quiz_type: filterQuizType === 'all' ? 'combined' : item.quiz_type,
        total_attempts: 0,
        correct_attempts: 0,
        items: [],
      };
    }
    acc[key].total_attempts += item.total_attempts;
    acc[key].correct_attempts += item.correct_attempts;
    acc[key].items.push(item);
    return acc;
  }, {});

  // 정답률 계산 및 정렬
  const processedData = Object.values(groupedByGrammar)
    .filter(group => group.total_attempts >= 3) // 최소 3문제 이상 시도한 것만
    .map(group => ({
      grammar: group.grammar_name,
      quizType: group.quiz_type,
      accuracy: ((group.correct_attempts / group.total_attempts) * 100).toFixed(1),
      attempts: group.total_attempts,
      correctAttempts: group.correct_attempts,
      items: group.items,
    }));

  // 정렬 적용
  const sortedData = [...processedData].sort((a, b) => {
    if (sortBy === 'accuracy') {
      return parseFloat(a.accuracy) - parseFloat(b.accuracy); // 낮은 순
    } else {
      return b.attempts - a.attempts; // 많은 순
    }
  });

  return (
    <div className="p-5 md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      {/* 헤더 */}
      <section className="mb-30px">
        <Link
          href="/dashboards/student-dashboard"
          className="inline-flex items-center gap-2 text-primaryColor hover:text-primaryColor/80 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('common.backToDashboard')}
        </Link>

        <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
          <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
            {t('dashboard.weakAreas')}
          </h2>
          <p className="text-contentColor dark:text-contentColor-dark mt-2 text-sm">
            {t('dashboard.analysisDescription')}
          </p>
        </div>

        {/* 통계 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-lightGrey7 dark:bg-lightGrey7-dark p-6 rounded-lg">
            <h3 className="text-contentColor dark:text-contentColor-dark text-sm font-medium">
              {t('stats.analyzedGrammars')}
            </h3>
            <p className="text-3xl font-bold text-blackColor dark:text-blackColor-dark mt-2">
              {sortedData.length}
            </p>
            <p className="text-xs text-contentColor dark:text-contentColor-dark mt-1">
              {t('stats.minAttemptsDesc', { count: 3 })}
            </p>
          </div>
          <div className="bg-lightGrey7 dark:bg-lightGrey7-dark p-6 rounded-lg">
            <h3 className="text-contentColor dark:text-contentColor-dark text-sm font-medium">
              {t('stats.avgAccuracy')}
            </h3>
            <p className="text-3xl font-bold text-blackColor dark:text-blackColor-dark mt-2">
              {sortedData.length > 0
                ? (
                    sortedData.reduce((sum, item) => sum + parseFloat(item.accuracy), 0) /
                    sortedData.length
                  ).toFixed(1)
                : 0}
              %
            </p>
            <p className="text-xs text-contentColor dark:text-contentColor-dark mt-1">
              {t('stats.allGrammarsAvg')}
            </p>
          </div>
          <div className="bg-lightGrey7 dark:bg-lightGrey7-dark p-6 rounded-lg">
            <h3 className="text-contentColor dark:text-contentColor-dark text-sm font-medium">
              {t('stats.needsImprovement')}
            </h3>
            <p className="text-3xl font-bold text-blackColor dark:text-blackColor-dark mt-2">
              {sortedData.filter(item => parseFloat(item.accuracy) < 60).length}
            </p>
            <p className="text-xs text-contentColor dark:text-contentColor-dark mt-1">
              {t('stats.below60')}
            </p>
          </div>
          <div className="bg-lightGrey7 dark:bg-lightGrey7-dark p-6 rounded-lg">
            <h3 className="text-contentColor dark:text-contentColor-dark text-sm font-medium">
              {t('stats.excellent')}
            </h3>
            <p className="text-3xl font-bold text-blackColor dark:text-blackColor-dark mt-2">
              {sortedData.filter(item => parseFloat(item.accuracy) >= 80).length}
            </p>
            <p className="text-xs text-contentColor dark:text-contentColor-dark mt-1">
              {t('stats.above80')}
            </p>
          </div>
        </div>

        {/* 필터 및 정렬 */}
        <div className="bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark rounded-lg p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 퀴즈 타입 필터 */}
            <div>
              <label className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-2">
                {t('filter.quizType')}
              </label>
              <select
                value={filterQuizType}
                onChange={e => setFilterQuizType(e.target.value)}
                className="w-full px-4 py-2.5 border border-borderColor dark:border-borderColor-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor bg-whiteColor dark:bg-whiteColor-dark text-blackColor dark:text-blackColor-dark"
              >
                <option value="all">{t('filter.all')}</option>
                <option value="dialogue_drag_drop">Drag & Drop</option>
                <option value="fill_in_blank">Fill in the Blank</option>
                <option value="multiple_choice">Multiple Choice</option>
              </select>
            </div>

            {/* 정렬 */}
            <div>
              <label className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-2">
                {t('filter.sortBy')}
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-borderColor dark:border-borderColor-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor bg-whiteColor dark:bg-whiteColor-dark text-blackColor dark:text-blackColor-dark"
              >
                <option value="accuracy">{t('filter.sortByAccuracy')}</option>
                <option value="attempts">{t('filter.sortByAttempts')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* 약점 문법 리스트 */}
        {sortedData.length === 0 ? (
          <div className="text-center text-contentColor dark:text-contentColor-dark py-8">
            {t('dashboard.minAttempts', { count: 3 })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedData.map((area, index) => (
              <div
                key={index}
                className="bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark rounded-lg p-5"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{getDifficultyIcon(area.accuracy)}</span>
                    <h3 className="text-lg font-bold text-blackColor dark:text-blackColor-dark">
                      {area.grammar}
                    </h3>
                  </div>
                  {filterQuizType === 'all' ? (
                    <div className="flex flex-wrap gap-1">
                      {area.items.map((item, i) => (
                        <span
                          key={i}
                          className="inline-block bg-lightGrey7 dark:bg-lightGrey7-dark text-contentColor dark:text-contentColor-dark text-xs px-2 py-0.5 rounded"
                        >
                          {getQuizTypeLabel(item.quiz_type)}:{' '}
                          {((item.correct_attempts / item.total_attempts) * 100).toFixed(0)}%
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="inline-block bg-lightGrey7 dark:bg-lightGrey7-dark text-contentColor dark:text-contentColor-dark text-xs px-2 py-1 rounded">
                      {getQuizTypeLabel(area.quizType)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-borderColor dark:border-borderColor-dark">
                  <div className="flex-1 text-center">
                    <p className="text-xs text-contentColor dark:text-contentColor-dark mb-1">
                      {t('stats.accuracy')}
                    </p>
                    <p className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
                      {area.accuracy}%
                    </p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-xs text-contentColor dark:text-contentColor-dark mb-1">
                      {t('stats.correct')}
                    </p>
                    <p className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
                      {area.correctAttempts}
                    </p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-xs text-contentColor dark:text-contentColor-dark mb-1">
                      {t('stats.attempts')}
                    </p>
                    <p className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
                      {area.attempts}
                    </p>
                  </div>
                </div>

                {/* 진행률 바 */}
                <div className="w-full bg-borderColor dark:bg-borderColor-dark rounded-full h-2 overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all ${
                      parseFloat(area.accuracy) < 40
                        ? 'bg-red-500'
                        : parseFloat(area.accuracy) < 60
                        ? 'bg-yellow-500'
                        : parseFloat(area.accuracy) < 80
                        ? 'bg-blue-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${area.accuracy}%` }}
                  />
                </div>

                {/* 개선 제안 */}
                <div className="mb-3">
                  <p className="text-xs text-contentColor dark:text-contentColor-dark">
                    💡 {getImprovementMessage(area.accuracy)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/quiz?grammar=${encodeURIComponent(area.grammar)}`}
                    className="flex-1 text-center px-3 py-2 bg-primaryColor hover:bg-primaryColor/80 text-whiteColor dark:text-whiteColor-dark rounded-lg transition-colors text-sm font-medium"
                  >
                    {t('common.solve')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentWeakAreasPrimary;
