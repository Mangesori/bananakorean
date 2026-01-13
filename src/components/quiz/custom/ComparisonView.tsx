'use client';

import { ComparisonResult } from '@/types/custom-quiz';
import { DialogueQuestion } from '@/types/quiz';

interface ComparisonViewProps {
  comparisonResult: ComparisonResult;
  onSelectResult?: (type: 'hybrid' | 'from-scratch') => void;
}

export default function ComparisonView({
  comparisonResult,
  onSelectResult,
}: ComparisonViewProps) {
  const { hybrid, fromScratch } = comparisonResult;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-2">생성 방식 비교</h3>
        <p className="text-sm text-gray-600">
          두 방식으로 생성된 문제를 비교해보세요. 각 방식의 장단점을 확인할 수 있습니다.
        </p>
      </div>

      {/* 비교 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 하이브리드 방식 */}
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-md font-bold text-blue-900">하이브리드 방식</h4>
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                템플릿 우선
              </span>
            </div>
            <p className="text-xs text-blue-700 mb-3">
              패턴 기반으로 생성하고, 실패 시 처음부터 생성
            </p>

            {/* 메타데이터 */}
            {hybrid.metadata && (
              <div className="bg-white rounded p-3 mb-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">생성 성공:</span>
                  <span className="font-medium text-green-600">
                    {hybrid.metadata.totalGenerated}/{hybrid.metadata.totalRequested}개
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">템플릿 사용:</span>
                  <span className="font-medium text-blue-600">
                    {hybrid.metadata.templateUsed}개
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">처음부터 생성:</span>
                  <span className="font-medium text-purple-600">
                    {hybrid.metadata.fromScratchUsed}개
                  </span>
                </div>
                {hybrid.metadata.failedCount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">실패:</span>
                    <span className="font-medium text-red-600">
                      {hybrid.metadata.failedCount}개
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 문제 목록 */}
          <div className="space-y-3">
            {hybrid.questions.map((q, idx) => (
              <QuestionCard key={idx} question={q} index={idx} variant="hybrid" />
            ))}
            {hybrid.questions.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                생성된 문제가 없습니다
              </div>
            )}
          </div>

          {/* 선택 버튼 */}
          {onSelectResult && hybrid.questions.length > 0 && (
            <button
              type="button"
              onClick={() => onSelectResult('hybrid')}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              이 결과 사용하기
            </button>
          )}
        </div>

        {/* 처음부터 생성 방식 */}
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-md font-bold text-purple-900">처음부터 생성</h4>
              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                템플릿 없음
              </span>
            </div>
            <p className="text-xs text-purple-700 mb-3">
              AI가 패턴 없이 완전히 새롭게 생성
            </p>

            {/* 메타데이터 */}
            {fromScratch.metadata && (
              <div className="bg-white rounded p-3 mb-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">생성 성공:</span>
                  <span className="font-medium text-green-600">
                    {fromScratch.metadata.totalGenerated}/{fromScratch.metadata.totalRequested}개
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">처음부터 생성:</span>
                  <span className="font-medium text-purple-600">
                    {fromScratch.metadata.fromScratchUsed}개
                  </span>
                </div>
                {fromScratch.metadata.failedCount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">실패:</span>
                    <span className="font-medium text-red-600">
                      {fromScratch.metadata.failedCount}개
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 문제 목록 */}
          <div className="space-y-3">
            {fromScratch.questions.map((q, idx) => (
              <QuestionCard
                key={idx}
                question={q}
                index={idx}
                variant="from-scratch"
              />
            ))}
            {fromScratch.questions.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                생성된 문제가 없습니다
              </div>
            )}
          </div>

          {/* 선택 버튼 */}
          {onSelectResult && fromScratch.questions.length > 0 && (
            <button
              type="button"
              onClick={() => onSelectResult('from-scratch')}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              이 결과 사용하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface QuestionCardProps {
  question: DialogueQuestion;
  index: number;
  variant: 'hybrid' | 'from-scratch';
}

function QuestionCard({ question, index, variant }: QuestionCardProps) {
  const borderColor =
    variant === 'hybrid' ? 'border-blue-200' : 'border-purple-200';
  const bgColor = variant === 'hybrid' ? 'bg-blue-50' : 'bg-purple-50';
  const badgeColor =
    variant === 'hybrid'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-purple-100 text-purple-700';

  return (
    <div
      className={`border ${borderColor} rounded-lg p-4 ${bgColor} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-medium px-2 py-1 rounded ${badgeColor}`}>
          문제 {index + 1}
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-gray-500 mb-1">질문</p>
          <p className="text-sm font-medium text-gray-900">{question.question}</p>
          {question.questionTranslation && (
            <p className="text-xs text-gray-500 mt-1">
              {question.questionTranslation}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">답변</p>
          <p className="text-sm font-medium text-gray-900">{question.answer}</p>
          {question.answerTranslation && (
            <p className="text-xs text-gray-500 mt-1">
              {question.answerTranslation}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">
            드래그 아이템 ({question.items.length}개)
          </p>
          <div className="flex flex-wrap gap-1">
            {question.items.map((item) => (
              <span
                key={item.id}
                className="text-xs bg-white px-2 py-1 rounded border border-gray-200"
              >
                {item.content}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
