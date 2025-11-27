'use client';

interface TestResult {
  questionId: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent?: number;
}

interface TestResultsProps {
  results: TestResult[];
  onRegenerate: () => void;
  onBackToPreview: () => void;
}

export default function TestResults({
  results,
  onRegenerate,
  onBackToPreview,
}: TestResultsProps) {
  const correctCount = results.filter(r => r.isCorrect).length;
  const totalCount = results.length;
  const accuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
  const totalTime = results.reduce((sum, r) => sum + (r.timeSpent || 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          테스트 결과
        </h1>

        {/* 전체 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">정답률</div>
            <div className="text-2xl font-bold text-blue-600">
              {accuracy.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {correctCount} / {totalCount}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">정답 수</div>
            <div className="text-2xl font-bold text-green-600">
              {correctCount}개
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">총 소요 시간</div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.floor(totalTime / 60)}분 {totalTime % 60}초
            </div>
          </div>
        </div>
      </div>

      {/* 문제별 결과 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          문제별 상세 결과
        </h3>

        <div className="space-y-3">
          {results.map((result, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${
                result.isCorrect
                  ? 'border-green-300 bg-green-50'
                  : 'border-red-300 bg-red-50'
              }`}
            >
              {/* 결과 헤더 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">
                    문제 {index + 1}
                  </span>
                  {result.isCorrect ? (
                    <span className="text-green-600 text-xl">✓</span>
                  ) : (
                    <span className="text-red-600 text-xl">✗</span>
                  )}
                </div>
                {result.timeSpent !== undefined && (
                  <span className="text-sm text-gray-500">
                    {result.timeSpent}초
                  </span>
                )}
              </div>

              {/* 질문 */}
              <div className="mb-2">
                <div className="text-sm font-medium text-gray-600">질문</div>
                <div className="text-gray-800">{result.question}</div>
              </div>

              {/* 답변 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm font-medium text-gray-600">당신의 답변</div>
                  <div className={`font-medium ${
                    result.isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.userAnswer || '(응답 없음)'}
                  </div>
                </div>
                {!result.isCorrect && (
                  <div>
                    <div className="text-sm font-medium text-gray-600">정답</div>
                    <div className="font-medium text-green-700">
                      {result.correctAnswer}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={onBackToPreview}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-md font-medium hover:bg-gray-700 transition-colors"
          >
            미리보기로 돌아가기
          </button>
          <button
            onClick={onRegenerate}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            새로운 문제 생성하기
          </button>
        </div>
      </div>

      {/* 피드백 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          학습 팁
        </h3>
        <div className="text-gray-600 space-y-2 text-sm">
          {accuracy >= 80 ? (
            <>
              <p>🎉 훌륭합니다! 문법을 잘 이해하고 있습니다.</p>
              <p>더 어려운 문법 주제나 다양한 어휘로 도전해보세요.</p>
            </>
          ) : accuracy >= 60 ? (
            <>
              <p>👍 좋아요! 기본은 이해하셨네요.</p>
              <p>틀린 문제를 다시 복습하고 비슷한 문제를 더 풀어보세요.</p>
            </>
          ) : (
            <>
              <p>💪 힘내세요! 연습이 완벽을 만듭니다.</p>
              <p>해당 문법 주제의 기본 개념을 다시 학습하고 천천히 연습해보세요.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
