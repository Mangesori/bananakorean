'use client';

import { useState } from 'react';
import { GRAMMAR_TOPICS } from '@/lib/ai/grammar-topics';

/**
 * Week 2 Day 1: AI 통합 테스트 페이지
 * OpenAI API 연결 및 기본 기능 테스트
 */

interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp?: string;
}

export default function AITestPage() {
  const [loading, setLoading] = useState(false);
  const [basicTestResult, setBasicTestResult] = useState<TestResult | null>(null);
  const [customTestResult, setCustomTestResult] = useState<TestResult | null>(null);
  const [templateTestResult, setTemplateTestResult] = useState<TestResult | null>(null);

  // 커스텀 테스트 입력
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gpt-4o-mini' | 'gpt-4o'>('gpt-4o-mini');
  const [expectJson, setExpectJson] = useState(false);

  // 템플릿 기반 생성 입력
  const [vocabularyInput, setVocabularyInput] = useState('');
  const [selectedGrammarTopics, setSelectedGrammarTopics] = useState<string[]>(['past-tense']);
  const [numberOfTemplates, setNumberOfTemplates] = useState(5);
  const [numberOfProblems, setNumberOfProblems] = useState(2);

  // 문법 체크박스 핸들러
  const handleGrammarToggle = (topicId: string) => {
    setSelectedGrammarTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const handleSelectAllGrammars = () => {
    setSelectedGrammarTopics(GRAMMAR_TOPICS.map((t) => t.id));
  };

  const handleClearAllGrammars = () => {
    setSelectedGrammarTopics([]);
  };

  // 기본 연결 테스트 (GET)
  const runBasicTest = async () => {
    setLoading(true);
    setBasicTestResult(null);

    try {
      const response = await fetch('/api/ai/test');
      const data = await response.json();

      if (response.ok) {
        setBasicTestResult({
          success: true,
          data,
          timestamp: new Date().toISOString(),
        });
      } else {
        setBasicTestResult({
          success: false,
          error: data.error || data.message || '테스트 실패',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error: any) {
      setBasicTestResult({
        success: false,
        error: error.message || '네트워크 오류',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  // 커스텀 프롬프트 테스트 (POST)
  const runCustomTest = async () => {
    if (!customPrompt.trim()) {
      alert('프롬프트를 입력해주세요.');
      return;
    }

    setLoading(true);
    setCustomTestResult(null);

    try {
      const response = await fetch('/api/ai/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: customPrompt,
          model: selectedModel,
          expectJson,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCustomTestResult({
          success: true,
          data,
          timestamp: new Date().toISOString(),
        });
      } else {
        setCustomTestResult({
          success: false,
          error: data.error || data.message || '테스트 실패',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error: any) {
      setCustomTestResult({
        success: false,
        error: error.message || '네트워크 오류',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  // 템플릿 기반 퀴즈 생성 테스트 (POST)
  const runTemplateTest = async () => {
    const vocabularyWords = vocabularyInput
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v);

    if (vocabularyWords.length === 0) {
      alert('어휘를 입력해주세요.');
      return;
    }

    if (selectedGrammarTopics.length === 0) {
      alert('최소 1개의 문법을 선택해주세요.');
      return;
    }

    setLoading(true);
    setTemplateTestResult(null);

    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vocabularyWords,
          grammarTopics: selectedGrammarTopics,
          numberOfTemplates,
          numberOfProblems,
          model: selectedModel,
          mode: 'test',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTemplateTestResult({
          success: true,
          data,
          timestamp: new Date().toISOString(),
        });
      } else {
        setTemplateTestResult({
          success: false,
          error: data.error || data.message || '생성 실패',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error: any) {
      setTemplateTestResult({
        success: false,
        error: error.message || '네트워크 오류',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI 통합 테스트
          </h1>
          <p className="text-gray-600">
            Week 2 Day 1: OpenAI API 연결 및 기본 기능 테스트
          </p>
        </div>

        {/* 기본 테스트 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            1. 기본 연결 테스트
          </h2>
          <p className="text-gray-600 mb-4">
            OpenAI API 연결 상태, 텍스트 생성, JSON 생성, 비용 추정을 확인합니다.
          </p>

          <button
            onClick={runBasicTest}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '테스트 중...' : '기본 테스트 실행'}
          </button>

          {/* 기본 테스트 결과 */}
          {basicTestResult && (
            <div className="mt-6">
              <div
                className={`p-4 rounded-md ${
                  basicTestResult.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <h3
                  className={`font-semibold mb-2 ${
                    basicTestResult.success ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {basicTestResult.success ? '✅ 테스트 성공' : '❌ 테스트 실패'}
                </h3>

                {basicTestResult.success && basicTestResult.data?.data && (
                  <div className="space-y-4">
                    {/* 간단한 텍스트 생성 */}
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        텍스트 생성 테스트
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        프롬프트: {basicTestResult.data.data.simpleTest.prompt}
                      </p>
                      <p className="text-gray-800">
                        응답: {basicTestResult.data.data.simpleTest.response}
                      </p>
                    </div>

                    {/* JSON 생성 */}
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        JSON 생성 테스트 (퀴즈 문제)
                      </h4>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800 mb-1">
                          질문: {basicTestResult.data.data.jsonTest.response.question}
                        </p>
                        <p className="text-gray-600 mb-1">선택지:</p>
                        <ul className="list-disc list-inside text-gray-700 mb-2">
                          {basicTestResult.data.data.jsonTest.response.options.map(
                            (option: string, index: number) => (
                              <li key={index}>{option}</li>
                            )
                          )}
                        </ul>
                        <p className="text-gray-600">
                          정답: {basicTestResult.data.data.jsonTest.response.correctAnswer}
                        </p>
                        <p className="text-gray-600 mt-1">
                          해설: {basicTestResult.data.data.jsonTest.response.explanation}
                        </p>
                      </div>
                    </div>

                    {/* 비용 추정 */}
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        비용 추정
                      </h4>
                      <p className="text-sm text-gray-600">
                        모델: {basicTestResult.data.data.costEstimate.model}
                      </p>
                      <p className="text-sm text-gray-600">
                        토큰: {basicTestResult.data.data.costEstimate.tokens}
                      </p>
                      <p className="text-sm text-gray-800 font-medium">
                        추정 비용: {basicTestResult.data.data.costEstimate.estimatedCost}
                      </p>
                    </div>

                    <p className="text-sm text-green-700 mt-2">
                      {basicTestResult.data.data.message}
                    </p>
                  </div>
                )}

                {!basicTestResult.success && (
                  <div className="text-red-700">
                    <p className="font-medium">오류: {basicTestResult.error}</p>
                  </div>
                )}

                {/* 전체 응답 (디버깅용) */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    전체 응답 보기 (JSON)
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(basicTestResult, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}
        </div>

        {/* 커스텀 프롬프트 테스트 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            2. 커스텀 프롬프트 테스트
          </h2>
          <p className="text-gray-600 mb-4">
            원하는 프롬프트로 AI 응답을 테스트합니다.
          </p>

          <div className="space-y-4">
            {/* 프롬프트 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프롬프트
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="예: '안녕하세요'를 사용한 대화 문제를 만들어주세요."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 모델 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                모델 선택
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as 'gpt-4o-mini' | 'gpt-4o')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gpt-4o-mini">gpt-4o-mini (권장)</option>
                <option value="gpt-4o">gpt-4o (프리미엄)</option>
              </select>
            </div>

            {/* JSON 모드 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="expectJson"
                checked={expectJson}
                onChange={(e) => setExpectJson(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="expectJson" className="ml-2 text-sm text-gray-700">
                JSON 응답 요청
              </label>
            </div>

            {/* 실행 버튼 */}
            <button
              onClick={runCustomTest}
              disabled={loading || !customPrompt.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '생성 중...' : '커스텀 테스트 실행'}
            </button>
          </div>

          {/* 커스텀 테스트 결과 */}
          {customTestResult && (
            <div className="mt-6">
              <div
                className={`p-4 rounded-md ${
                  customTestResult.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <h3
                  className={`font-semibold mb-2 ${
                    customTestResult.success ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {customTestResult.success ? '✅ 생성 성공' : '❌ 생성 실패'}
                </h3>

                {customTestResult.success && customTestResult.data?.data && (
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">
                      모델: {customTestResult.data.data.model}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      프롬프트: {customTestResult.data.data.prompt}
                    </p>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">응답:</p>
                      <div className="bg-gray-50 p-3 rounded">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800">
                          {typeof customTestResult.data.data.response === 'string'
                            ? customTestResult.data.data.response
                            : JSON.stringify(customTestResult.data.data.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {!customTestResult.success && (
                  <div className="text-red-700">
                    <p className="font-medium">오류: {customTestResult.error}</p>
                  </div>
                )}

                {/* 전체 응답 (디버깅용) */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    전체 응답 보기 (JSON)
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(customTestResult, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}
        </div>

        {/* 템플릿 기반 퀴즈 생성 테스트 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            3. 템플릿 기반 퀴즈 생성 테스트 (품사 자동 분석)
          </h2>
          <p className="text-gray-600 mb-4">
            새로운 어휘를 입력하면 AI가 자동으로 품사를 분석하고, 기존 템플릿과 매칭하여 유사한 문제를 생성합니다.
          </p>

          <div className="space-y-4">
            {/* 어휘 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                새로운 어휘 (쉼표로 구분)
              </label>
              <textarea
                value={vocabularyInput}
                onChange={(e) => setVocabularyInput(e.target.value)}
                placeholder="예: 헬스장, 학원, 시작하다, 끝나다"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                입력한 어휘가 템플릿의 주요 단어를 대체합니다. 명사와 동사를 자동으로 구분합니다.
              </p>
            </div>

            {/* 문법 주제 선택 (체크박스) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  문법 주제 ({selectedGrammarTopics.length}개 선택됨)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllGrammars}
                    className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                  >
                    전체 선택
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllGrammars}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    선택 해제
                  </button>
                </div>
              </div>
              <div className="border border-gray-300 rounded-md p-3 max-h-64 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {GRAMMAR_TOPICS.map((topic) => (
                    <label
                      key={topic.id}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGrammarTopics.includes(topic.id)}
                        onChange={() => handleGrammarToggle(topic.id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{topic.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                여러 문법을 선택하면 각 문법에서 균등하게 템플릿을 로드합니다.
              </p>
            </div>

            {/* 템플릿 개수 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사용할 템플릿 개수
              </label>
              <select
                value={numberOfTemplates}
                onChange={(e) => setNumberOfTemplates(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="3">3개 (빠름)</option>
                <option value="5">5개 (권장)</option>
                <option value="10">10개 (상세)</option>
              </select>
            </div>

            {/* 생성할 문제 개수 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                생성할 문제 개수
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={numberOfProblems}
                onChange={(e) => setNumberOfProblems(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* 생성 버튼 */}
            <button
              onClick={runTemplateTest}
              disabled={loading || !vocabularyInput.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '생성 중...' : '템플릿 기반 문제 생성'}
            </button>
          </div>

          {/* 템플릿 테스트 결과 */}
          {templateTestResult && (
            <div className="mt-6">
              <div
                className={`p-4 rounded-md ${
                  templateTestResult.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <h3
                  className={`font-semibold mb-2 ${
                    templateTestResult.success ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {templateTestResult.success ? '✅ 생성 완료' : '❌ 생성 실패'}
                </h3>

                {templateTestResult.success && templateTestResult.data && (
                  <>
                    {/* 품사 분석 결과 (접기/펼치기) */}
                    <details open className="mt-4 border rounded p-4 bg-white">
                      <summary className="cursor-pointer font-semibold text-gray-800 hover:text-gray-900">
                        📊 품사 분석 결과 (개발자용)
                      </summary>

                      <div className="mt-4 space-y-3">
                        {templateTestResult.data.analysis?.vocabulary.map((word: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200">
                            <div className="font-semibold text-lg text-gray-900">
                              {word.type === '명사' ? '📍' : word.type === '동사' ? '⚡' : '💬'} {word.word}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              • 품사: {word.type}
                              {word.subtype && ` (${word.subtype})`}
                            </div>
                            <div className="text-sm text-gray-600">
                              • 영어: {word.englishTranslation}
                            </div>
                            {word.particles && (
                              <div className="text-sm text-gray-600">
                                • 조사: {word.particles.join(', ')}
                              </div>
                            )}
                            {word.conjugations && (
                              <div className="text-sm text-gray-600">
                                • 과거: {word.conjugations.past} | 현재: {word.conjugations.present}
                              </div>
                            )}
                            <div className="text-sm text-blue-600 mt-1">
                              ✓ 매칭된 템플릿: {word.matchedTemplates || 0}개
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>

                    {/* 생성된 문제 */}
                    <div className="mt-6 space-y-4">
                      <h3 className="font-semibold text-lg text-gray-900">
                        ✨ 생성된 문제 ({templateTestResult.data.generatedProblems?.length || 0}개)
                      </h3>

                      {templateTestResult.data.generatedProblems?.map((problem: any, idx: number) => (
                        <div key={idx} className="border border-gray-300 rounded-lg p-4 bg-white">
                          {/* 문제 헤더 */}
                          <div className="bg-purple-50 p-3 rounded mb-3">
                            <h4 className="font-semibold text-purple-900">문제 #{idx + 1}</h4>
                          </div>

                          {/* 원본 vs 생성 비교 */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* 원본 템플릿 */}
                            <div className="border-r border-gray-200 pr-4">
                              <h5 className="text-sm font-semibold text-gray-700 mb-2">
                                📋 원본 템플릿
                              </h5>
                              <div className="bg-gray-50 p-3 rounded text-sm">
                                <p className="font-medium text-gray-900">
                                  Q: {problem.template.question}
                                </p>
                                <p className="text-gray-700">A: {problem.template.answer}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {problem.template.questionTranslation}
                                </p>
                              </div>
                              <div className="mt-2 text-xs">
                                <span className="text-gray-600">대체:</span>
                                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                                  {problem.replacedWord}
                                </span>
                              </div>
                            </div>

                            {/* AI 생성 문제 */}
                            <div className="pl-4">
                              <h5 className="text-sm font-semibold text-gray-700 mb-2">
                                ✨ AI 생성 문제
                              </h5>
                              <div className="bg-blue-50 p-3 rounded text-sm">
                                <p className="font-medium text-gray-900">
                                  Q: {problem.generated.question}
                                </p>
                                <p className="text-gray-700">A: {problem.generated.answer}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {problem.generated.questionTranslation}
                                </p>
                              </div>
                              <div className="mt-2 text-xs">
                                <span className="text-gray-600">새 어휘:</span>
                                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                  {problem.newVocabulary}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 검증 상태 */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">구조 유사성:</span>
                                <span
                                  className={`px-2 py-1 rounded ${
                                    problem.validation.structureSimilarity > 0.8
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {(problem.validation.structureSimilarity * 100).toFixed(0)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">문법 일치:</span>
                                <span
                                  className={`px-2 py-1 rounded ${
                                    problem.validation.grammarMatch
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {problem.validation.grammarMatch ? '✅ 통과' : '❌ 실패'}
                                </span>
                              </div>
                            </div>
                            {problem.matchScore && (
                              <div className="mt-2 text-sm">
                                <span className="text-gray-600">매칭 점수:</span>
                                <span className="ml-2 font-semibold text-gray-900">
                                  {problem.matchScore}점
                                </span>
                              </div>
                            )}
                          </div>

                          {/* AI 메타데이터 */}
                          <details className="mt-3">
                            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                              AI 메타데이터 보기
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                              {JSON.stringify(problem.metadata, null, 2)}
                            </pre>
                          </details>
                        </div>
                      ))}
                    </div>

                    {/* 통계 */}
                    <div className="mt-6 bg-gray-50 p-4 rounded border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3">📈 생성 통계</h4>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">분석된 어휘</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {templateTestResult.data.statistics.vocabularyCount}개
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">사용된 템플릿</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {templateTestResult.data.statistics.templatesUsed}개
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">생성 성공률</p>
                          <p className="text-lg font-semibold text-green-600">
                            {templateTestResult.data.statistics.successRate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">예상 비용</p>
                          <p className="text-lg font-semibold text-blue-600">
                            {templateTestResult.data.statistics.estimatedCost}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {!templateTestResult.success && (
                  <div className="text-red-700">
                    <p className="font-medium">오류: {templateTestResult.error}</p>
                  </div>
                )}

                {/* 전체 응답 (디버깅용) */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    전체 응답 보기 (JSON)
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(templateTestResult, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}
        </div>

        {/* 도움말 섹션 */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            📖 테스트 가이드
          </h2>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• 기본 테스트는 OpenAI API 연결 상태를 자동으로 확인합니다.</p>
            <p>• 커스텀 테스트로 원하는 프롬프트를 직접 테스트할 수 있습니다.</p>
            <p>• 템플릿 기반 생성은 AI가 자동으로 명사/동사를 구분하여 문제를 만듭니다.</p>
            <p>• gpt-4o-mini 모델이 비용 효율적이며 대부분의 용도로 충분합니다.</p>
            <p>• JSON 모드는 구조화된 데이터(퀴즈 문제 등)가 필요할 때 사용합니다.</p>
            <p>
              • API 키 오류가 발생하면 .env.local 파일의 OPENAI_API_KEY를 확인하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
