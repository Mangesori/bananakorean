'use client';

import { useState } from 'react';

/**
 * Week 1 Day 4: 구독 시스템 테스트 UI
 *
 * 사용법:
 * 1. 로그인 후 http://localhost:3000/test/subscription 접속
 * 2. "구독 정보 조회" 버튼 클릭
 * 3. "AI 생성 테스트" 버튼으로 사용량 기록 테스트
 */

export default function SubscriptionTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [problemCount, setProblemCount] = useState(10);

  const fetchSubscriptionInfo = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/test/subscription');
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '오류가 발생했습니다');
        setResult(null);
      } else {
        setResult(data);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const testAIGeneration = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/test/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problemsGenerated: problemCount }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || '오류가 발생했습니다');
        setResult(data);
      } else {
        setResult(data);
        setError(null);
        // 성공 후 자동으로 최신 정보 다시 가져오기
        setTimeout(fetchSubscriptionInfo, 1000);
      }
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 구독 시스템 테스트
          </h1>
          <p className="text-gray-600">
            Week 1 Day 4: 사용량 제한 미들웨어 검증
          </p>
        </div>

        {/* 컨트롤 패널 */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <button
                onClick={fetchSubscriptionInfo}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '로딩 중...' : '📊 구독 정보 조회 (GET)'}
              </button>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                생성할 문제 개수:
              </label>
              <input
                type="number"
                value={problemCount}
                onChange={(e) => setProblemCount(Number(e.target.value))}
                min="1"
                max="100"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={testAIGeneration}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '처리 중...' : `🤖 AI 생성 테스트 (POST ${problemCount}개)`}
              </button>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <span className="text-2xl mr-3">❌</span>
              <div>
                <h3 className="text-red-800 font-semibold mb-1">오류 발생</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 결과 표시 */}
        {result && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              {result.success ? '✅ 성공' : '⚠️ 응답'}
            </h2>

            {/* 구독 정보 */}
            {result.data?.subscription && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  📋 구독 정보
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">플랜:</span>
                    <span className="font-semibold text-blue-600">
                      {result.data.subscription.plan_type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">상태:</span>
                    <span className="font-semibold text-green-600">
                      {result.data.subscription.status}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <p className="text-sm text-gray-600 mb-2">제한 설정:</p>
                    <pre className="bg-white p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(result.data.subscription.limits, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* AI 생성 제한 */}
            {result.data?.limits?.aiGeneration && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  🤖 AI 생성 제한
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">생성 가능</p>
                      <p className="text-2xl font-bold">
                        {result.data.limits.aiGeneration.canGenerate ? '✅' : '❌'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">남은 횟수</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {result.data.limits.aiGeneration.remaining === null
                          ? '∞'
                          : result.data.limits.aiGeneration.remaining}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">총 제한</p>
                      <p className="text-2xl font-bold text-gray-700">
                        {result.data.limits.aiGeneration.limit === null
                          ? '∞'
                          : result.data.limits.aiGeneration.limit}
                      </p>
                    </div>
                  </div>
                  {result.data.limits.aiGeneration.resetDate && (
                    <p className="text-xs text-gray-600 text-center">
                      리셋: {new Date(result.data.limits.aiGeneration.resetDate).toLocaleString('ko-KR')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 학생 관리 제한 */}
            {result.data?.limits?.studentManagement && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  👥 학생 관리 제한
                </h3>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">추가 가능</p>
                      <p className="text-2xl font-bold">
                        {result.data.limits.studentManagement.canAddStudent ? '✅' : '❌'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">남은 자리</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {result.data.limits.studentManagement.remaining === null
                          ? '∞'
                          : result.data.limits.studentManagement.remaining}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">최대 인원</p>
                      <p className="text-2xl font-bold text-gray-700">
                        {result.data.limits.studentManagement.limit === null
                          ? '∞'
                          : result.data.limits.studentManagement.limit}
                      </p>
                    </div>
                  </div>
                  {result.data.limits.studentManagement.error && (
                    <p className="text-xs text-red-600 text-center mt-2">
                      {result.data.limits.studentManagement.error}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Speaking 퀴즈 제한 */}
            {result.data?.limits?.speakingQuiz && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  🎤 Speaking 퀴즈 제한
                </h3>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">사용 가능</p>
                      <p className="text-2xl font-bold">
                        {result.data.limits.speakingQuiz.canUseSpeaking ? '✅' : '❌'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">남은 횟수</p>
                      <p className="text-2xl font-bold text-green-600">
                        {result.data.limits.speakingQuiz.remaining === null
                          ? '∞'
                          : result.data.limits.speakingQuiz.remaining}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">총 제한</p>
                      <p className="text-2xl font-bold text-gray-700">
                        {result.data.limits.speakingQuiz.limit === null
                          ? '∞'
                          : result.data.limits.speakingQuiz.limit}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 메시지 */}
            {result.message && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">{result.message}</p>
              </div>
            )}

            {/* Before/After (POST 응답) */}
            {result.data?.before && result.data?.after && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  📊 변경 사항
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">이전:</p>
                    <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(result.data.before, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">이후:</p>
                    <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(result.data.after, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* 전체 응답 (디버깅용) */}
            <details className="mt-4">
              <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                전체 응답 보기 (디버깅용)
              </summary>
              <pre className="mt-2 bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* 도움말 */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">
            💡 테스트 방법
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
            <li>먼저 "구독 정보 조회" 버튼으로 현재 플랜 확인</li>
            <li>"AI 생성 테스트" 버튼으로 사용량 기록 (무료: 주 1회 제한)</li>
            <li>제한 초과 시 403 에러 발생 확인</li>
            <li>
              Supabase SQL Editor에서 플랜 변경:
              <code className="bg-yellow-100 px-2 py-1 rounded ml-2">
                UPDATE subscriptions SET plan_type = 'student_pro' ...
              </code>
            </li>
            <li>상세한 테스트 가이드는 SUBSCRIPTION_TEST_GUIDE.md 참고</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
