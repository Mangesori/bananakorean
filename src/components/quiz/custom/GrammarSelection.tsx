'use client';

import { useState, useCallback } from 'react';
import { TopicId, topicMeta, topicIds } from '@/data/quiz/topics/meta';
import { GrammarGroup } from '@/types/custom-quiz';

interface GrammarSelectionProps {
  selectedGrammar: TopicId[];
  onGrammarChange: (grammar: TopicId[]) => void;
  onPrev: () => void;
  onNext: () => void;
}

// 레벨별 문법 그룹 정의
const a1Topics = topicIds.filter(id => topicMeta[id].level === 'A1');
const a2Topics = topicIds.filter(id => topicMeta[id].level === 'A2');
const a3Topics = topicIds.filter(id => topicMeta[id].level === 'A3');

const grammarGroups: GrammarGroup[] = [
  {
    level: 'A1',
    label: 'A1: Absolute Beginner',
    topics: a1Topics,
  },
  {
    level: 'A2',
    label: 'A2: Basic',
    topics: a2Topics,
  },
  {
    level: 'A3',
    label: 'A3: Upper Beginner',
    topics: a3Topics,
  },
];

export default function GrammarSelection({
  selectedGrammar,
  onGrammarChange,
  onPrev,
  onNext,
}: GrammarSelectionProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['A1']);

  // 그룹 토글
  const toggleGroup = useCallback((level: string) => {
    setExpandedGroups(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  }, []);

  // 개별 문법 토글
  const toggleGrammar = useCallback(
    (topicId: TopicId) => {
      if (selectedGrammar.includes(topicId)) {
        onGrammarChange(selectedGrammar.filter(id => id !== topicId));
      } else {
        onGrammarChange([...selectedGrammar, topicId]);
      }
    },
    [selectedGrammar, onGrammarChange]
  );

  // 그룹 전체 선택/해제
  const toggleGroupAll = useCallback(
    (group: GrammarGroup) => {
      const allSelected = group.topics.every(topic =>
        selectedGrammar.includes(topic)
      );

      if (allSelected) {
        // 모두 해제
        onGrammarChange(
          selectedGrammar.filter(id => !group.topics.includes(id))
        );
      } else {
        // 모두 선택
        const newSelection = new Set([...selectedGrammar, ...group.topics]);
        onGrammarChange(Array.from(newSelection));
      }
    },
    [selectedGrammar, onGrammarChange]
  );

  // 전체 선택
  const selectAll = useCallback(() => {
    onGrammarChange([...topicIds]);
  }, [onGrammarChange]);

  // 전체 해제
  const clearAll = useCallback(() => {
    onGrammarChange([]);
  }, [onGrammarChange]);

  const isNextEnabled = selectedGrammar.length >= 1;

  return (
    <div className="max-w-2xl mx-auto">
      {/* 안내 텍스트 */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-800">
          퀴즈에 사용할 문법 주제를 선택하세요.
          <br />
          <span className="text-blue-600">
            선택한 문법을 기반으로 문제가 생성됩니다.
          </span>
        </p>
      </div>

      {/* 전체 선택 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-700">
          선택된 문법: {selectedGrammar.length}개
        </span>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            전체 선택
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={clearAll}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            전체 해제
          </button>
        </div>
      </div>

      {/* 문법 그룹 목록 */}
      <div className="space-y-4 mb-8">
        {grammarGroups.map(group => {
          const isExpanded = expandedGroups.includes(group.level);
          const selectedCount = group.topics.filter(topic =>
            selectedGrammar.includes(topic)
          ).length;
          const allSelected = selectedCount === group.topics.length;
          const someSelected = selectedCount > 0 && !allSelected;

          return (
            <div
              key={group.level}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* 그룹 헤더 */}
              <div
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer
                         hover:bg-gray-100 transition-colors"
                onClick={() => toggleGroup(group.level)}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = someSelected;
                      }
                    }}
                    onChange={e => {
                      e.stopPropagation();
                      toggleGroupAll(group);
                    }}
                    onClick={e => e.stopPropagation()}
                    className="w-5 h-5 text-primary rounded border-gray-300
                             focus:ring-primary cursor-pointer"
                  />
                  <span className="font-semibold text-gray-800">
                    {group.label}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({selectedCount}/{group.topics.length})
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
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

              {/* 문법 목록 */}
              {isExpanded && (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.topics.map(topicId => {
                    const isSelected = selectedGrammar.includes(topicId);
                    return (
                      <label
                        key={topicId}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg cursor-pointer
                          transition-colors
                          ${
                            isSelected
                              ? 'bg-primary/10 border border-primary/30'
                              : 'bg-white border border-gray-200 hover:bg-gray-50'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleGrammar(topicId)}
                          className="w-4 h-4 text-primary rounded border-gray-300
                                   focus:ring-primary cursor-pointer"
                        />
                        <span
                          className={`text-sm ${
                            isSelected
                              ? 'text-primary font-medium'
                              : 'text-gray-700'
                          }`}
                        >
                          {topicMeta[topicId].title}
                        </span>
                      </label>
                    );
                  })}
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
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium
                   hover:bg-gray-50 transition-colors flex items-center gap-2"
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
          onClick={onNext}
          disabled={!isNextEnabled}
          style={{ backgroundColor: '#2563eb' }}
          className="px-8 py-3 text-white rounded-lg font-semibold
                   shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-opacity flex items-center gap-2"
        >
          다음
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

