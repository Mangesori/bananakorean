'use client';
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useTranslations } from 'next-intl';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LearningActivityChart = ({ attemptsData }) => {
  const t = useTranslations();
  const [period, setPeriod] = useState('week'); // 'week' | 'month'

  if (!attemptsData || attemptsData.length === 0) {
    return (
      <div className="text-center text-contentColor dark:text-contentColor-dark py-8">
        {t('common.noData')}
      </div>
    );
  }

  // 날짜별로 그룹화
  const groupByDate = attempts => {
    const grouped = {};
    attempts.forEach(attempt => {
      const date = new Date(attempt.created_at).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = { total: 0, correct: 0 };
      }
      grouped[date].total++;
      if (attempt.is_correct) {
        grouped[date].correct++;
      }
    });
    return grouped;
  };

  const groupedData = groupByDate(attemptsData);

  // 기간에 따른 데이터 생성
  const generateChartData = () => {
    const today = new Date();
    const days = period === 'week' ? 7 : 30;
    const labels = [];
    const totals = [];
    const corrects = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayData = groupedData[dateStr] || { total: 0, correct: 0 };

      labels.push(
        period === 'week'
          ? [
              t('calendar.sun'),
              t('calendar.mon'),
              t('calendar.tue'),
              t('calendar.wed'),
              t('calendar.thu'),
              t('calendar.fri'),
              t('calendar.sat'),
            ][date.getDay()]
          : `${date.getMonth() + 1}/${date.getDate()}`
      );
      totals.push(dayData.total);
      corrects.push(dayData.correct);
    }

    return { labels, totals, corrects };
  };

  const chartData = generateChartData();

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: t('chart.totalProblems'),
        data: chartData.totals,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: t('chart.correctProblems'),
        data: chartData.corrects,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: period === 'week' ? t('chart.learningActivity7days') : t('chart.learningActivity30days'),
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#1a202c',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value} ${t('chart.problems')}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
          callback: function (value) {
            return value + ' ' + t('chart.problems');
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div>
      {/* 기간 선택 버튼 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setPeriod('week')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            period === 'week'
              ? 'bg-primaryColor text-whiteColor'
              : 'bg-lightGrey7 dark:bg-lightGrey7-dark text-contentColor dark:text-contentColor-dark hover:bg-lightGrey6 dark:hover:bg-lightGrey6-dark'
          }`}
        >
          {t('chart.last7days')}
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            period === 'month'
              ? 'bg-primaryColor text-whiteColor'
              : 'bg-lightGrey7 dark:bg-lightGrey7-dark text-contentColor dark:text-contentColor-dark hover:bg-lightGrey6 dark:hover:bg-lightGrey6-dark'
          }`}
        >
          {t('chart.last30days')}
        </button>
      </div>

      {/* 차트 */}
      <div className="h-[350px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LearningActivityChart;
