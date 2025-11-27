'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTranslations } from 'next-intl';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GrammarAccuracyChart = ({ progressData }) => {
  const t = useTranslations();

  if (!progressData || progressData.length === 0) {
    return (
      <div className="text-center text-contentColor dark:text-contentColor-dark py-8">
        {t('common.noData')}
      </div>
    );
  }

  // 문법별로 그룹화하여 전체 정답률 계산
  const groupedByGrammar = progressData.reduce((acc, item) => {
    const grammarName = item.grammar_name;
    if (!acc[grammarName]) {
      acc[grammarName] = {
        grammar: grammarName,
        totalAttempts: 0,
        correctAttempts: 0,
      };
    }
    acc[grammarName].totalAttempts += item.total_attempts;
    acc[grammarName].correctAttempts += item.correct_attempts;
    return acc;
  }, {});

  // 정답률 계산 및 정렬 (높은 순)
  const sortedData = Object.values(groupedByGrammar)
    .map(item => ({
      grammar: item.grammar,
      accuracy: ((item.correctAttempts / item.totalAttempts) * 100).toFixed(1),
      attempts: item.totalAttempts,
    }))
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 10); // 상위 10개만

  const data = {
    labels: sortedData.map(item => item.grammar),
    datasets: [
      {
        label: t('stats.accuracy') + ' (%)',
        data: sortedData.map(item => item.accuracy),
        backgroundColor: sortedData.map(item => {
          const acc = parseFloat(item.accuracy);
          if (acc >= 80) return 'rgba(75, 192, 192, 0.6)'; // 초록
          if (acc >= 60) return 'rgba(255, 206, 86, 0.6)'; // 노랑
          return 'rgba(255, 99, 132, 0.6)'; // 빨강
        }),
        borderColor: sortedData.map(item => {
          const acc = parseFloat(item.accuracy);
          if (acc >= 80) return 'rgba(75, 192, 192, 1)';
          if (acc >= 60) return 'rgba(255, 206, 86, 1)';
          return 'rgba(255, 99, 132, 1)';
        }),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: t('chart.grammarAccuracy'),
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#1a202c',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const accuracy = context.parsed.y;
            const attempts = sortedData[index].attempts;
            return [
              `${t('stats.accuracy')}: ${accuracy}%`,
              `${t('stats.attempts')}: ${attempts}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + '%';
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-[400px]">
      <Bar data={data} options={options} />
    </div>
  );
};

export default GrammarAccuracyChart;
