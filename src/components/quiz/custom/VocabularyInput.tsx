'use client';

import { useState, useCallback } from 'react';

interface VocabularyInputProps {
  vocabulary: string[];
  onVocabularyChange: (vocabulary: string[]) => void;
  onNext: () => void;
}

export default function VocabularyInput({
  vocabulary,
  onVocabularyChange,
  onNext,
}: VocabularyInputProps) {
  const [inputValue, setInputValue] = useState('');

  // 다음 버튼 클릭 시 입력 필드의 내용을 어휘 목록에 추가하고 다음 단계로 이동
  const handleNext = () => {
    let finalVocabulary = [...vocabulary];
    
    // 입력 필드에 값이 있으면 어휘 추가
    if (inputValue.trim()) {
      const words = inputValue
        .split(/[,，\n]/)
        .map(word => word.trim())
        .filter(word => word.length > 0 && !vocabulary.includes(word));
      
      if (words.length > 0) {
        finalVocabulary = [...vocabulary, ...words];
        onVocabularyChange(finalVocabulary);
      }
    }
    
    // 어휘가 1개 이상 있으면 다음 단계로 이동
    if (finalVocabulary.length >= 1) {
      onNext();
    }
  };

  const isNextEnabled = vocabulary.length >= 1 || inputValue.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* 안내 텍스트 */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-800">
          퀴즈에 사용할 한국어 어휘를 입력하세요.
          <br />
          <span className="text-blue-600">
            단어, 표현, 관용구 모두 입력 가능합니다.
          </span>
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="mb-6">
        <label
          htmlFor="vocabulary-input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          어휘 입력 (쉼표 또는 줄바꿈으로 구분)
        </label>
        <textarea
          id="vocabulary-input"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="예: 길을 잃어버리다, 잠이 오다, 잠을 못 자다"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   resize-none text-gray-800 placeholder-gray-400"
          rows={3}
        />
      </div>

      {/* 다음 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!isNextEnabled}
          style={{ backgroundColor: '#2563eb' }}
          className="px-8 py-3 text-white rounded-lg font-semibold
                   hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-opacity flex items-center gap-2 shadow-md"
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

