'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const StreakCalendar = ({ attemptsData, currentStreak }) => {
  const t = useTranslations();
  // 최근 30일 데이터 생성
  const generateCalendarData = () => {
    const today = new Date();
    const days = [];

    // 날짜별 시도 횟수 계산
    const attemptsByDate = {};
    if (attemptsData && attemptsData.length > 0) {
      attemptsData.forEach(attempt => {
        const date = new Date(attempt.created_at).toISOString().split('T')[0];
        attemptsByDate[date] = (attemptsByDate[date] || 0) + 1;
      });
    }

    // 최근 30일 데이터 생성
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const attempts = attemptsByDate[dateStr] || 0;

      days.push({
        date: dateStr,
        dayOfMonth: date.getDate(),
        dayOfWeek: date.getDay(),
        attempts: attempts,
        isToday: i === 0,
      });
    }

    return days;
  };

  const calendarData = generateCalendarData();

  // 활동 레벨에 따른 색상
  const getActivityColor = attempts => {
    if (attempts === 0) return 'bg-borderColor dark:bg-borderColor-dark';
    if (attempts < 5) return 'bg-green-200 dark:bg-green-900/30';
    if (attempts < 10) return 'bg-green-400 dark:bg-green-700/50';
    if (attempts < 20) return 'bg-green-600 dark:bg-green-600/70';
    return 'bg-green-800 dark:bg-green-500';
  };

  return (
    <div className="bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark rounded-lg p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-blackColor dark:text-blackColor-dark">
            {t('calendar.title')}
          </h3>
          <p className="text-sm text-contentColor dark:text-contentColor-dark mt-1">
            {t('calendar.subtitle')}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">🔥</span>
            <div>
              <p className="text-xs text-contentColor dark:text-contentColor-dark">
                {t('calendar.streak')}
              </p>
              <p className="text-2xl font-bold text-primaryColor dark:text-primaryColor-dark">
                {currentStreak || 0}{t('calendar.days')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-10 gap-2 mb-4">
        {calendarData.map((day, index) => (
          <div
            key={index}
            className="relative group"
            title={`${day.date}: ${t('calendar.problemsCount', { count: day.attempts })}`}
          >
            <div
              className={`
                aspect-square rounded-md transition-all cursor-pointer
                ${getActivityColor(day.attempts)}
                ${day.isToday ? 'ring-2 ring-primaryColor dark:ring-primaryColor-dark ring-offset-2' : ''}
                hover:scale-110 hover:shadow-md
              `}
            >
              {day.isToday && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-whiteColor">●</span>
                </div>
              )}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
              <div className="bg-blackColor dark:bg-whiteColor-dark text-whiteColor dark:text-blackColor-dark text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                {new Date(day.date).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                })}
                : {t('calendar.problemsCount', { count: day.attempts })}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-blackColor dark:border-t-whiteColor-dark"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 범례 */}
      <div className="flex items-center justify-between text-xs text-contentColor dark:text-contentColor-dark">
        <span>{t('calendar.less')}</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-sm bg-borderColor dark:bg-borderColor-dark"></div>
          <div className="w-4 h-4 rounded-sm bg-green-200 dark:bg-green-900/30"></div>
          <div className="w-4 h-4 rounded-sm bg-green-400 dark:bg-green-700/50"></div>
          <div className="w-4 h-4 rounded-sm bg-green-600 dark:bg-green-600/70"></div>
          <div className="w-4 h-4 rounded-sm bg-green-800 dark:bg-green-500"></div>
        </div>
        <span>{t('calendar.more')}</span>
      </div>

      {/* 통계 요약 */}
      <div className="mt-6 pt-4 border-t border-borderColor dark:border-borderColor-dark grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-contentColor dark:text-contentColor-dark mb-1">
            {t('calendar.activeDays')}
          </p>
          <p className="text-lg font-bold text-blackColor dark:text-blackColor-dark">
            {calendarData.filter(d => d.attempts > 0).length}{t('calendar.days')}
          </p>
        </div>
        <div>
          <p className="text-xs text-contentColor dark:text-contentColor-dark mb-1">
            {t('calendar.totalProblems')}
          </p>
          <p className="text-lg font-bold text-blackColor dark:text-blackColor-dark">
            {t('calendar.problemsCount', { count: calendarData.reduce((sum, d) => sum + d.attempts, 0) })}
          </p>
        </div>
        <div>
          <p className="text-xs text-contentColor dark:text-contentColor-dark mb-1">
            {t('calendar.dailyAverage')}
          </p>
          <p className="text-lg font-bold text-blackColor dark:text-blackColor-dark">
            {(
              calendarData.reduce((sum, d) => sum + d.attempts, 0) / 30
            ).toFixed(1)}
            {t('calendar.problems')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar;
