'use client';

import { useState } from 'react';
import { DialogueQuestion } from '@/types/quiz';
import { QuizGenerationResponse, ComparisonResult } from '@/types/custom-quiz';
import ComparisonView from './ComparisonView';
import QuestionEditor from './QuestionEditor';
import DragItemsDisplay from './DragItemsDisplay';

interface PreviewPanelProps {
  questions?: DialogueQuestion[];
  metadata?: QuizGenerationResponse['metadata'] | null;
  comparisonResult?: ComparisonResult;
  onRegenerateSingle?: (index: number) => Promise<void>;
  onRegenerateAll?: () => Promise<void>;
  onSelectComparisonResult?: (type: 'hybrid' | 'from-scratch') => void;
  onQuestionUpdate?: (index: number, updated: DialogueQuestion) => void;
  onPrev: () => void;
  onComplete: () => void;
  isRegenerating?: boolean;
  regeneratingIndex?: number | null;
}

export default function PreviewPanel({
  questions,
  metadata,
  comparisonResult,
  onRegenerateSingle,
  onRegenerateAll,
  onSelectComparisonResult,
  onQuestionUpdate,
  onPrev,
  onComplete,
  isRegenerating = false,
  regeneratingIndex = null,
}: PreviewPanelProps) {
  // 비교 모드 렌더링
  if (comparisonResult) {
    return (
      <div className="max-w-6xl mx-auto">
        <ComparisonView
          comparisonResult={comparisonResult}
          onSelectResult={onSelectComparisonResult}
        />

        {/* 하단 버튼 */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={onPrev}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            이전
          </button>
          <button
            type="button"
            onClick={onComplete}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            완료
          </button>
        </div>
      </div>
    );
  }

  // 기존 단일 모드 렌더링
  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12 text-gray-500">
        생성된 문제가 없습니다
      </div>
    );
  }
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([0]); // 첫 번째 문제 기본 펼침
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null); // 편집 중인 문제 ID

  const toggleQuestion = (index: number) => {
    setExpandedQuestions(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const expandAll = () => {
    setExpandedQuestions(questions.map((_, i) => i));
  };

  const collapseAll = () => {
    setExpandedQuestions([]);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* 안내 텍스트 */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
        <p className="text-sm text-green-800">
          {questions.length}개의 문제가 생성되었습니다!
          <br />
          <span className="text-green-600">
            문제를 확인하고 필요하면 다시 생성할 수 있습니다.
          </span>
        </p>
        {metadata && (
          <div className="mt-3 pt-3 border-t border-green-200">
            <p className="text-xs text-green-700">
              생성 방식:{' '}
              <span className="font-medium">
                템플릿 {metadata.templateUsed}개 / 처음부터 생성{' '}
                {metadata.fromScratchUsed}개
              </span>
              {metadata.failedCount > 0 && (
                <span className="text-orange-700 ml-2">
                  (실패: {metadata.failedCount}개)
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* 전체 컨트롤 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            전체 펼치기
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={collapseAll}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            전체 접기
          </button>
        </div>
        <button
          onClick={onRegenerateAll}
          disabled={isRegenerating}
          className="text-sm text-primary hover:text-primary/80 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors flex items-center gap-1"
        >
          <svg
            className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`}
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
          전체 다시 생성
        </button>
      </div>

      {/* 문제 목록 */}
      <div className="space-y-3 mb-8">
        {questions.map((question, index) => {
          const isExpanded = expandedQuestions.includes(index);
          const isThisRegenerating = regeneratingIndex === index;

          return (
            <div
              key={question.id}
              className={`border rounded-lg overflow-hidden transition-all ${
                isThisRegenerating
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* 문제 헤더 */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleQuestion(index)}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">
                      Q: {question.question}
                    </p>
                    {question.grammarName && (
                      <span className="text-xs text-gray-500">
                        {question.grammarName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onRegenerateSingle?.(index);
                    }}
                    disabled={isRegenerating || !onRegenerateSingle}
                    className="p-2 text-gray-400 hover:text-primary 
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-colors rounded-full hover:bg-gray-100"
                    title="다시 생성"
                  >
                    <svg
                      className={`w-4 h-4 ${isThisRegenerating ? 'animate-spin' : ''}`}
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
                  </button>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* 문제 상세 */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                  {editingQuestionId === question.id ? (
                    // 편집 모드
                    <QuestionEditor
                      question={question}
                      onSave={(updated) => {
                        onQuestionUpdate?.(index, updated);
                        setEditingQuestionId(null);
                      }}
                      onCancel={() => setEditingQuestionId(null)}
                    />
                  ) : (
                    // 표시 모드
                    <>
                      <div className="pt-3">
                        <div className="text-xs text-gray-500 mb-1">질문</div>
                        <p className="text-gray-800">{question.question}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {question.questionTranslation}
                        </p>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">답변</div>
                        <p className="text-gray-800">{question.answer}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {question.answerTranslation}
                        </p>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          드래그 아이템
                        </div>
                        <DragItemsDisplay
                          items={question.items}
                          mode="display"
                        />
                      </div>
                      {/* 수정 버튼 */}
                      <div className="pt-2 border-t border-gray-100">
                        <button
                          onClick={() => setEditingQuestionId(question.id)}
                          disabled={isRegenerating}
                          className="text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          수정
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          disabled={isRegenerating}
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
          onClick={onComplete}
          disabled={isRegenerating}
          className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold
                   hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors flex items-center gap-2"
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          퀴즈 시작하기
        </button>
      </div>
    </div>
  );
}


