'use client';

import { useState, useEffect } from 'react';
import { DialogueQuestion, Item } from '@/types/quiz';
import { parseAnswerToItems } from '@/lib/quiz/parser';
import { translateKoreanToEnglish } from '@/lib/ai/translation-service';
import DragItemsEditor from './DragItemsEditor';

interface QuestionEditorProps {
  question: DialogueQuestion;
  onSave: (updated: DialogueQuestion) => void;
  onCancel: () => void;
}



export default function QuestionEditor({
  question,
  onSave,
  onCancel,
}: QuestionEditorProps) {
  const [editedQuestion, setEditedQuestion] = useState(question.question);
  const [editedQuestionTranslation, setEditedQuestionTranslation] = useState(
    question.questionTranslation
  );
  const [editedAnswer, setEditedAnswer] = useState(question.answer);
  const [editedAnswerTranslation, setEditedAnswerTranslation] = useState(
    question.answerTranslation
  );

  // Initialize with parsed items to ensure metadata (originalWordIndex) is present
  const [editedItems, setEditedItems] = useState<Item[]>(() => parseAnswerToItems(question.answer));

  const [isTranslatingQuestion, setIsTranslatingQuestion] = useState(false);
  const [isTranslatingAnswer, setIsTranslatingAnswer] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Initialize items from answer string on mount if items are empty
  useEffect(() => {
    if (!question.items || question.items.length === 0) {
      const parsedItems = parseAnswerToItems(question.answer);
      setEditedItems(parsedItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Auto-translate question
  const handleTranslateQuestion = async () => {
    setIsTranslatingQuestion(true);
    setErrors([]);
    try {
      const translation = await translateKoreanToEnglish(editedQuestion);
      setEditedQuestionTranslation(translation);
    } catch (error) {
      console.error('Translation error:', error);
      setErrors(['질문 번역에 실패했습니다. 다시 시도해주세요.']);
    } finally {
      setIsTranslatingQuestion(false);
    }
  };

  // Auto-translate answer
  const handleTranslateAnswer = async () => {
    setIsTranslatingAnswer(true);
    setErrors([]);
    try {
      const translation = await translateKoreanToEnglish(tempAnswer);
      setEditedAnswerTranslation(translation);
    } catch (error) {
      console.error('Translation error:', error);
      setErrors(['답변 번역에 실패했습니다. 다시 시도해주세요.']);
    } finally {
      setIsTranslatingAnswer(false);
    }
  };

  const [tempAnswer, setTempAnswer] = useState(question.answer);

  // Handle manual answer update
  const handleUpdatePreview = () => {
    setEditedAnswer(tempAnswer);
    const parsedItems = parseAnswerToItems(tempAnswer);
    setEditedItems(parsedItems);
  };

  // Initial load sync
  // Note: We might want to run this once on mount if items are empty? 
  // But question.items comes from props.


  // Validate and save
  const handleSave = () => {
    const newErrors: string[] = [];

    if (!editedQuestion.trim()) {
      newErrors.push('질문을 입력해주세요');
    }
    if (!tempAnswer.trim()) {
      newErrors.push('답변을 입력해주세요');
    }
    if (tempAnswer !== editedAnswer) {
      newErrors.push('답변 변경사항을 적용해주세요 ("적용" 버튼 클릭)');
    }
    if (editedItems.length === 0) {
      newErrors.push('드래그 아이템이 비어있습니다');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save updated question
    onSave({
      ...question,
      question: editedQuestion,
      questionTranslation: editedQuestionTranslation,
      answer: editedAnswer,
      answerTranslation: editedAnswerTranslation,
      items: editedItems,
    });
  };

  return (
    <div className="space-y-4 bg-blue-50 p-5 rounded-lg border-2 border-blue-200">
      <div className="text-sm font-semibold text-blue-900 mb-2">
        문제 수정
      </div>

      {/* Question Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-700">
            질문 (Korean)
          </label>
          <button
            onClick={handleTranslateQuestion}
            disabled={isTranslatingQuestion || !editedQuestion.trim()}
            className="text-xs text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTranslatingQuestion ? '번역 중...' : '자동 번역'}
          </button>
        </div>
        <input
          value={editedQuestion}
          onChange={(e) => setEditedQuestion(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="한국어 질문을 입력하세요"
        />
        <input
          value={editedQuestionTranslation}
          onChange={(e) => setEditedQuestionTranslation(e.target.value)}
          placeholder="English translation"
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Answer Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-700">
            답변 (Korean)
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleUpdatePreview}
              disabled={tempAnswer === editedAnswer}
              className={`text-xs px-2 py-1 rounded transition-colors border ${tempAnswer === editedAnswer
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-primary text-primary hover:bg-primary/10'
                }`}
            >
              적용
            </button>
            <button
              onClick={handleTranslateAnswer}
              disabled={isTranslatingAnswer || !tempAnswer.trim()}
              className="text-xs text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isTranslatingAnswer ? '번역 중...' : '자동 번역'}
            </button>
          </div>
        </div>
        <input
          value={tempAnswer}
          onChange={(e) => setTempAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleUpdatePreview();
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="한국어 답변을 입력하세요"
        />
        <input
          value={editedAnswerTranslation}
          onChange={(e) => setEditedAnswerTranslation(e.target.value)}
          placeholder="English translation"
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Drag Items Editor */}
      <DragItemsEditor
        answerText={editedAnswer}
        items={editedItems}
        onChange={setEditedItems}
      />

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-red-700">
              {err}
            </p>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end pt-3 border-t border-blue-300">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          완료
        </button>
      </div>
    </div>
  );
}
