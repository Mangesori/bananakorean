'use client';

import { useState } from 'react';
import { GRAMMAR_TOPICS } from '@/lib/ai/grammar-topics';

interface GenerationFormProps {
  vocabularyInput: string;
  setVocabularyInput: (value: string) => void;
  selectedGrammarTopics: string[];
  setSelectedGrammarTopics: (value: string[]) => void;
  numberOfProblems: number;
  setNumberOfProblems: (value: number) => void;
  quizType: 'drag-drop' | 'multiple-choice';
  setQuizType: (value: 'drag-drop' | 'multiple-choice') => void;
  onGenerate: () => void;
  isLoading?: boolean;
}

export default function GenerationForm({
  vocabularyInput,
  setVocabularyInput,
  selectedGrammarTopics,
  setSelectedGrammarTopics,
  numberOfProblems,
  setNumberOfProblems,
  quizType,
  setQuizType,
  onGenerate,
  isLoading = false,
}: GenerationFormProps) {
  const [showAllTopics, setShowAllTopics] = useState(false);
  const displayedTopics = showAllTopics ? GRAMMAR_TOPICS : GRAMMAR_TOPICS.slice(0, 10);

  const handleTopicToggle = (topicId: string) => {
    if (selectedGrammarTopics.includes(topicId)) {
      setSelectedGrammarTopics(selectedGrammarTopics.filter(id => id !== topicId));
    } else {
      setSelectedGrammarTopics([...selectedGrammarTopics, topicId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedGrammarTopics.length === GRAMMAR_TOPICS.length) {
      setSelectedGrammarTopics([]);
    } else {
      setSelectedGrammarTopics(GRAMMAR_TOPICS.map(t => t.id));
    }
  };

  const canGenerate = vocabularyInput.trim().length > 0 && selectedGrammarTopics.length > 0;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          AI 퀴즈 생성 및 테스트
        </h1>
        <p className="text-gray-600">
          AI로 문제를 생성하고 실제 퀴즈 컴포넌트에서 바로 테스트해보세요
        </p>
      </div>

      {/* 어휘 입력 */}
      <div>
        <label htmlFor="vocabulary" className="block text-sm font-medium text-gray-700 mb-2">
          어휘 입력 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="vocabulary"
          value={vocabularyInput}
          onChange={(e) => setVocabularyInput(e.target.value)}
          placeholder="예: 사과, 바나나, 오렌지 (쉼표로 구분)"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          disabled={isLoading}
        />
        <p className="mt-1 text-sm text-gray-500">
          여러 단어를 입력할 때는 쉼표(,)로 구분해주세요
        </p>
      </div>

      {/* 문법 주제 선택 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            문법 주제 선택 <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            disabled={isLoading}
          >
            {selectedGrammarTopics.length === GRAMMAR_TOPICS.length ? '전체 해제' : '전체 선택'}
          </button>
        </div>

        <div className="border border-gray-300 rounded-md p-4 max-h-64 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {displayedTopics.map((topic) => (
              <label
                key={topic.id}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedGrammarTopics.includes(topic.id)}
                  onChange={() => handleTopicToggle(topic.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-700">{topic.label}</span>
              </label>
            ))}
          </div>

          {!showAllTopics && GRAMMAR_TOPICS.length > 10 && (
            <button
              type="button"
              onClick={() => setShowAllTopics(true)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
              disabled={isLoading}
            >
              + {GRAMMAR_TOPICS.length - 10}개 더 보기
            </button>
          )}

          {showAllTopics && (
            <button
              type="button"
              onClick={() => setShowAllTopics(false)}
              className="mt-3 text-sm text-gray-600 hover:text-gray-800 font-medium"
              disabled={isLoading}
            >
              접기
            </button>
          )}
        </div>

        <p className="mt-1 text-sm text-gray-500">
          {selectedGrammarTopics.length}개 선택됨
        </p>
      </div>

      {/* 퀴즈 타입 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          퀴즈 타입 선택
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="drag-drop"
              checked={quizType === 'drag-drop'}
              onChange={(e) => setQuizType(e.target.value as 'drag-drop' | 'multiple-choice')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-700">드래그 앤 드롭 (Drag & Drop)</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="multiple-choice"
              checked={quizType === 'multiple-choice'}
              onChange={(e) => setQuizType(e.target.value as 'drag-drop' | 'multiple-choice')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-700">객관식 (Multiple Choice)</span>
          </label>
        </div>
      </div>

      {/* 문제 개수 설정 */}
      <div>
        <label htmlFor="problemCount" className="block text-sm font-medium text-gray-700 mb-2">
          문제 개수: {numberOfProblems}개
        </label>
        <input
          id="problemCount"
          type="range"
          min="1"
          max="10"
          value={numberOfProblems}
          onChange={(e) => setNumberOfProblems(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          disabled={isLoading}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1개</span>
          <span>5개</span>
          <span>10개</span>
        </div>
      </div>

      {/* 생성 버튼 */}
      <div>
        <button
          onClick={onGenerate}
          disabled={!canGenerate || isLoading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              문제 생성 중...
            </span>
          ) : (
            '문제 생성하기'
          )}
        </button>
      </div>
    </div>
  );
}
