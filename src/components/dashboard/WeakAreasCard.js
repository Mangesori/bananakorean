'use client';
import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const WeakAreasCard = ({ progressData }) => {
  const t = useTranslations();

  if (!progressData || progressData.length === 0) {
    return (
      <div className="bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark rounded-lg p-6">
        <h3 className="text-lg font-bold text-blackColor dark:text-blackColor-dark mb-4">
          {t('dashboard.weakAreasTop3')}
        </h3>
        <div className="text-center text-contentColor dark:text-contentColor-dark py-4">
          {t('common.noData')}
        </div>
      </div>
    );
  }

  // 정답률이 낮은 순으로 정렬
  const weakAreas = progressData
    .filter(item => item.total_attempts >= 5) // 최소 5문제 이상 시도한 것만
    .map(item => ({
      grammar: item.grammar_name,
      quizType: item.quiz_type,
      accuracy: ((item.correct_attempts / item.total_attempts) * 100).toFixed(1),
      attempts: item.total_attempts,
      correctAttempts: item.correct_attempts,
    }))
    .sort((a, b) => parseFloat(a.accuracy) - parseFloat(b.accuracy))
    .slice(0, 3);

  if (weakAreas.length === 0) {
    return (
      <div className="bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark rounded-lg p-6">
        <h3 className="text-lg font-bold text-blackColor dark:text-blackColor-dark mb-4">
          {t('dashboard.weakAreasTop3')}
        </h3>
        <div className="text-center text-contentColor dark:text-contentColor-dark py-4">
          {t('dashboard.minAttempts', {count: 5})}
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
    return t('improvement.good');
  };

  return (
    <div className="bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-blackColor dark:text-blackColor-dark">
          {t('dashboard.weakAreasTop3')}
        </h3>
        <span className="text-xs text-contentColor dark:text-contentColor-dark">
          {t('filter.sortByAccuracy')}
        </span>
      </div>

      <div className="space-y-4">
        {weakAreas.map((area, index) => (
          <div
            key={index}
            className="border-l-4 border-secondaryColor2 dark:border-secondaryColor2-dark pl-4 py-3 hover:bg-lightGrey7 dark:hover:bg-lightGrey7-dark transition-colors rounded-r-lg"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getDifficultyIcon(area.accuracy)}</span>
                  <h4 className="font-semibold text-blackColor dark:text-blackColor-dark">
                    {area.grammar}
                  </h4>
                </div>
                <span className="inline-block bg-lightGrey7 dark:bg-lightGrey7-dark text-contentColor dark:text-contentColor-dark text-xs px-2 py-1 rounded-full">
                  {getQuizTypeLabel(area.quizType)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-secondaryColor2 dark:text-secondaryColor2-dark">
                  {area.accuracy}%
                </p>
                <p className="text-xs text-contentColor dark:text-contentColor-dark">
                  {area.correctAttempts}/{area.attempts}
                </p>
              </div>
            </div>

            {/* 진행률 바 */}
            <div className="w-full bg-borderColor dark:bg-borderColor-dark rounded-full h-2 overflow-hidden">
              <div
                className="bg-secondaryColor2 dark:bg-secondaryColor2-dark h-full rounded-full transition-all"
                style={{ width: `${area.accuracy}%` }}
              />
            </div>

            {/* 개선 제안 */}
            <div className="mt-2">
              <p className="text-xs text-contentColor dark:text-contentColor-dark">
                💡 {getImprovementMessage(area.accuracy)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 전체 약점 보기 버튼 */}
      <div className="mt-4 pt-4 border-t border-borderColor dark:border-borderColor-dark">
        <Link
          href="/dashboards/student-weak-areas"
          className="block w-full text-center bg-primaryColor hover:bg-primaryColor/80 text-whiteColor dark:text-whiteColor-dark py-2 rounded-lg transition-colors text-sm font-medium"
        >
          {t('dashboard.viewAllWeakAreas')}
        </Link>
      </div>
    </div>
  );
};

export default WeakAreasCard;
