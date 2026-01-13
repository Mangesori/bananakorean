'use client';

interface GenerationProgressProps {
  current: number;
  total: number;
  mode?: string;
}

export default function GenerationProgress({
  current,
  total,
  mode = 'hybrid',
}: GenerationProgressProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* 제목 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-primary animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">퀴즈 생성 중</h3>
          <p className="text-sm text-gray-500 mt-1">
            AI가 맞춤형 문제를 생성하고 있습니다
          </p>
        </div>

        {/* 진행 상황 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {current} / {total} 문제
            </span>
            <span className="text-sm font-medium text-primary">{percentage}%</span>
          </div>

          {/* 진행 바 */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            >
              <div className="h-full w-full animate-pulse bg-white/20" />
            </div>
          </div>
        </div>

        {/* 생성 모드 */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>
            {mode === 'hybrid'
              ? '하이브리드 모드 (템플릿 우선)'
              : mode === 'from-scratch'
                ? '처음부터 생성 모드'
                : '비교 모드'}
          </span>
        </div>

        {/* 안내 메시지 */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-800 text-center">
            고품질 문제 생성을 위해 최대 1분 정도 소요될 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
