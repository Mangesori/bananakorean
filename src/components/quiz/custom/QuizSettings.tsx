'use client';

import { useState } from 'react';
import { CustomQuizSettings } from '@/types/custom-quiz';

interface QuizSettingsProps {
  settings: CustomQuizSettings;
  onSettingsChange: (settings: CustomQuizSettings) => void;
  onPrev: () => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

interface QuizTypeConfig {
  key: keyof CustomQuizSettings;
  label: string;
  description: string;
  max: number;
  enabled: boolean;
  locked?: boolean;
}

const quizTypes: QuizTypeConfig[] = [
  {
    key: 'dialogueDragDrop',
    label: 'Dialogue Drag & Drop',
    description: '문장을 드래그하여 순서를 맞추세요',
    max: 20,
    enabled: true,
  },
  {
    key: 'matching',
    label: 'Matching',
    description: '한국어와 영어를 매칭하세요',
    max: 20,
    enabled: false,
    locked: true,
  },
  {
    key: 'multipleChoice',
    label: 'Multiple Choice',
    description: '올바른 답을 선택하세요',
    max: 20,
    enabled: false,
    locked: true,
  },
  {
    key: 'fillInBlank',
    label: 'Fill in the Blank',
    description: '빈칸에 알맞은 말을 넣으세요',
    max: 20,
    enabled: false,
    locked: true,
  },
  {
    key: 'speaking',
    label: 'Speaking',
    description: '문장을 따라 말해보세요',
    max: 20,
    enabled: false,
    locked: true,
  },
];

export default function QuizSettings({
  settings,
  onSettingsChange,
  onPrev,
  onGenerate,
  isGenerating = false,
}: QuizSettingsProps) {
  const [localSettings, setLocalSettings] = useState<CustomQuizSettings>(settings);

  const handleChange = (key: keyof CustomQuizSettings, value: number) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const totalQuizCount = Object.values(localSettings).reduce((a, b) => a + b, 0);
  const isGenerateEnabled = localSettings.dialogueDragDrop > 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* 안내 텍스트 */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-800">
          생성할 퀴즈의 개수를 설정하세요.
          <br />
          <span className="text-blue-600">
            현재는 Dialogue Drag & Drop만 지원됩니다.
          </span>
        </p>
      </div>

      {/* 퀴즈 타입별 설정 */}
      <div className="space-y-4 mb-8">
        {quizTypes.map(quizType => (
          <div
            key={quizType.key}
            className={`p-4 rounded-lg border ${
              quizType.enabled
                ? 'bg-white border-gray-200'
                : 'bg-gray-50 border-gray-100 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">
                    {quizType.label}
                  </span>
                  {quizType.locked && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {quizType.description}
                </p>
              </div>

              {quizType.enabled ? (
                <div className="flex items-center gap-4">
                  {/* 슬라이더 */}
                  <input
                    type="range"
                    min={0}
                    max={quizType.max}
                    value={localSettings[quizType.key]}
                    onChange={e =>
                      handleChange(quizType.key, parseInt(e.target.value))
                    }
                    className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                             accent-primary"
                  />
                  {/* 숫자 입력 */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={quizType.max}
                      value={localSettings[quizType.key]}
                      onChange={e => {
                        const value = Math.min(
                          Math.max(0, parseInt(e.target.value) || 0),
                          quizType.max
                        );
                        handleChange(quizType.key, value);
                      }}
                      className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center
                               focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <span className="text-sm text-gray-500">개</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-400">0개</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 총 개수 표시 */}
      <div className="p-4 bg-gray-100 rounded-lg mb-8">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700">총 생성 문제</span>
          <span className="text-2xl font-bold text-primary">
            {totalQuizCount}개
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          * 남은 생성 횟수: 무료 주 0회 / 프로 월 17회
        </p>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          disabled={isGenerating}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium
                   hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          이전
        </button>
        <button
          onClick={onGenerate}
          disabled={!isGenerateEnabled || isGenerating}
          style={{ backgroundColor: '#2563eb' }}
          className="px-8 py-3 text-white rounded-lg font-semibold
                   shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-opacity flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              생성 중...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              AI 생성하기
            </>
          )}
        </button>
      </div>
    </div>
  );
}

