'use client';

import { useState } from 'react';
import { GeneratedProblem } from '@/types/ai-test';

interface PreviewSectionProps {
  generatedProblems: GeneratedProblem[];
  analysisData: any;
  onStartTest: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function PreviewSection({
  generatedProblems,
  analysisData,
  onStartTest,
  onBack,
  isLoading = false,
}: PreviewSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // 전체 검증 상태 계산
  const allValid = generatedProblems.every(p =>
    p.validation.structureSimilarity >= 0.7 &&
    p.validation.grammarMatch &&
    p.validation.hasTranslation &&
    p.validation.itemsValid
  );

  const avgSimilarity = generatedProblems.reduce((sum, p) =>
    sum + p.validation.structureSimilarity, 0
  ) / generatedProblems.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            생성 결과 미리보기
          </h1>
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← 돌아가기
          </button>
        </div>

        {/* 전체 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">생성된 문제</div>
            <div className="text-2xl font-bold text-blue-600">
              {generatedProblems.length}개
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">평균 유사도</div>
            <div className="text-2xl font-bold text-green-600">
              {(avgSimilarity * 100).toFixed(1)}%
            </div>
          </div>

          <div className={`${allValid ? 'bg-green-50' : 'bg-yellow-50'} rounded-lg p-4`}>
            <div className="text-sm text-gray-600 mb-1">검증 상태</div>
            <div className={`text-2xl font-bold ${allValid ? 'text-green-600' : 'text-yellow-600'}`}>
              {allValid ? '통과' : '주의 필요'}
            </div>
          </div>
        </div>

        {/* 품사 분석 결과 */}
        {analysisData?.vocabularyAnalysis && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              품사 분석 결과
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {analysisData.vocabularyAnalysis.map((analysis: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{analysis.word}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysis.partOfSpeech === '명사' ? 'bg-blue-100 text-blue-800' :
                      analysis.partOfSpeech === '동사' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {analysis.partOfSpeech}
                    </span>
                    {analysis.particles && (
                      <span className="text-sm text-gray-500">
                        ({analysis.particles.join(', ')})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 생성된 문제 목록 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          생성된 문제 목록
        </h3>

        <div className="space-y-3">
          {generatedProblems.map((problem, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* 문제 헤더 */}
              <button
                onClick={() => toggleExpand(index)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700">
                    문제 {index + 1}
                  </span>
                  <span className="text-sm text-gray-500">
                    {problem.generated.grammarName}
                  </span>
                  {problem.matchScore !== undefined && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      매칭: {(problem.matchScore * 100).toFixed(0)}%
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {/* 검증 상태 아이콘 */}
                  {problem.validation.structureSimilarity >= 0.7 &&
                   problem.validation.grammarMatch &&
                   problem.validation.hasTranslation &&
                   problem.validation.itemsValid ? (
                    <span className="text-green-500 text-xl">✓</span>
                  ) : (
                    <span className="text-yellow-500 text-xl">⚠</span>
                  )}
                  <span className="text-gray-400">
                    {expandedIndex === index ? '▲' : '▼'}
                  </span>
                </div>
              </button>

              {/* 문제 상세 */}
              {expandedIndex === index && (
                <div className="px-4 py-4 space-y-4">
                  {/* 질문 */}
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">질문</div>
                    <div className="text-gray-800">
                      {problem.generated.question}
                    </div>
                    {problem.generated.questionTranslation && (
                      <div className="text-sm text-gray-500 mt-1">
                        {problem.generated.questionTranslation}
                      </div>
                    )}
                  </div>

                  {/* 정답 */}
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">정답</div>
                    <div className="text-green-700 font-medium">
                      {problem.generated.answer}
                    </div>
                    {problem.generated.answerTranslation && (
                      <div className="text-sm text-gray-500 mt-1">
                        {problem.generated.answerTranslation}
                      </div>
                    )}
                  </div>

                  {/* Items 배열 */}
                  {problem.generated.items && problem.generated.items.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        드래그 앤 드롭 아이템
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {problem.generated.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm"
                          >
                            {item.content}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 검증 상태 */}
                  <div className="border-t pt-3 mt-3">
                    <div className="text-sm font-medium text-gray-600 mb-2">검증 상태</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className={problem.validation.structureSimilarity >= 0.7 ? 'text-green-500' : 'text-red-500'}>
                          {problem.validation.structureSimilarity >= 0.7 ? '✓' : '✗'}
                        </span>
                        <span className="text-gray-600">
                          구조 유사도: {(problem.validation.structureSimilarity * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={problem.validation.grammarMatch ? 'text-green-500' : 'text-red-500'}>
                          {problem.validation.grammarMatch ? '✓' : '✗'}
                        </span>
                        <span className="text-gray-600">문법 일치</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={problem.validation.hasTranslation ? 'text-green-500' : 'text-red-500'}>
                          {problem.validation.hasTranslation ? '✓' : '✗'}
                        </span>
                        <span className="text-gray-600">번역 존재</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={problem.validation.itemsValid ? 'text-green-500' : 'text-red-500'}>
                          {problem.validation.itemsValid ? '✓' : '✗'}
                        </span>
                        <span className="text-gray-600">Items 유효</span>
                      </div>
                    </div>
                  </div>

                  {/* 메타데이터 */}
                  <div className="text-xs text-gray-500 border-t pt-2 mt-2">
                    <div>어휘: {problem.newVocabulary} (대체: {problem.replacedWord})</div>
                    <div>모델: {problem.metadata.model} | 토큰: {problem.metadata.tokensUsed}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 테스트 시작 버튼 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <button
          onClick={onStartTest}
          disabled={isLoading || generatedProblems.length === 0}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '준비 중...' : '퀴즈 테스트 시작하기'}
        </button>
      </div>
    </div>
  );
}
