'use client';

import { useState } from 'react';
import { GeneratedProblem } from '@/types/ai-test';
import { DialogueQuestion, MultipleChoiceQuestion } from '@/types/quiz';
import DialogueDragAndDrop from '@/components/quiz/DialogueDragAndDrop/DialogueDragAndDrop';
import MultipleChoice from '@/components/quiz/MultipleChoice/MultipleChoice';
import GenerationForm from '@/components/test/GenerationForm';
import PreviewSection from '@/components/test/PreviewSection';
import TestResults from '@/components/test/TestResults';
import {
  convertMultipleToDialogue,
  convertMultipleToMultipleChoice,
} from '@/lib/ai/quiz-converter';

type QuizMode = 'generate' | 'preview' | 'test' | 'results';
type QuizType = 'drag-drop' | 'multiple-choice';

export default function AIQuizTestPage() {
  // 현재 모드
  const [mode, setMode] = useState<QuizMode>('generate');
  const [quizType, setQuizType] = useState<QuizType>('drag-drop');

  // 생성 폼 상태
  const [vocabularyInput, setVocabularyInput] = useState('');
  const [selectedGrammarTopics, setSelectedGrammarTopics] = useState<string[]>([]);
  const [numberOfProblems, setNumberOfProblems] = useState(5);

  // 생성 결과
  const [generatedProblems, setGeneratedProblems] = useState<GeneratedProblem[]>([]);
  const [analysisData, setAnalysisData] = useState<any>(null);

  // 퀴즈 데이터
  const [dialogueQuestions, setDialogueQuestions] = useState<DialogueQuestion[]>([]);
  const [multipleChoiceQuestions, setMultipleChoiceQuestions] = useState<MultipleChoiceQuestion[]>([]);

  // 로딩 상태
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  // 에러 상태
  const [error, setError] = useState<string | null>(null);

  /**
   * 문제 생성하기
   */
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const vocabularyWords = vocabularyInput
        .split(',')
        .map(v => v.trim())
        .filter(v => v.length > 0);

      if (vocabularyWords.length === 0) {
        throw new Error('최소 1개의 어휘를 입력해주세요.');
      }

      if (selectedGrammarTopics.length === 0) {
        throw new Error('최소 1개의 문법 주제를 선택해주세요.');
      }

      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vocabularyWords,
          grammarTopics: selectedGrammarTopics,
          numberOfProblems,
          model: 'gpt-4o-mini',
          mode: 'test',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '문제 생성에 실패했습니다.');
      }

      if (!data.success) {
        throw new Error(data.error || '문제 생성에 실패했습니다.');
      }

      setGeneratedProblems(data.generatedProblems || []);
      setAnalysisData(data.analysis || null);
      setMode('preview');
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * 테스트 시작
   */
  const handleStartTest = async () => {
    setIsConverting(true);
    setError(null);

    try {
      if (quizType === 'drag-drop') {
        // Drag & Drop으로 변환
        const questions = await convertMultipleToDialogue(generatedProblems);
        setDialogueQuestions(questions);
      } else {
        // Multiple Choice로 변환 (오답 생성 필요)
        const questions = await convertMultipleToMultipleChoice(
          generatedProblems,
          'gpt-4o-mini'
        );
        setMultipleChoiceQuestions(questions);
      }

      setMode('test');
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err instanceof Error ? err.message : '퀴즈 변환에 실패했습니다.');
    } finally {
      setIsConverting(false);
    }
  };

  /**
   * 미리보기로 돌아가기
   */
  const handleBackToPreview = () => {
    setMode('preview');
  };

  /**
   * 생성 폼으로 돌아가기
   */
  const handleBackToGenerate = () => {
    setMode('generate');
    setError(null);
  };

  /**
   * 새로운 문제 생성 (초기화)
   */
  const handleRegenerate = () => {
    setMode('generate');
    setGeneratedProblems([]);
    setAnalysisData(null);
    setDialogueQuestions([]);
    setMultipleChoiceQuestions([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* 에러 표시 */}
      {error && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-red-50 border border-red-300 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-red-600 text-xl">⚠</span>
              <div>
                <div className="font-semibold text-red-800">오류 발생</div>
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 생성 폼 */}
      {mode === 'generate' && (
        <GenerationForm
          vocabularyInput={vocabularyInput}
          setVocabularyInput={setVocabularyInput}
          selectedGrammarTopics={selectedGrammarTopics}
          setSelectedGrammarTopics={setSelectedGrammarTopics}
          numberOfProblems={numberOfProblems}
          setNumberOfProblems={setNumberOfProblems}
          quizType={quizType}
          setQuizType={setQuizType}
          onGenerate={handleGenerate}
          isLoading={isGenerating}
        />
      )}

      {/* 미리보기 섹션 */}
      {mode === 'preview' && (
        <PreviewSection
          generatedProblems={generatedProblems}
          analysisData={analysisData}
          onStartTest={handleStartTest}
          onBack={handleBackToGenerate}
          isLoading={isConverting}
        />
      )}

      {/* 퀴즈 테스트 */}
      {mode === 'test' && (
        <div className="max-w-7xl mx-auto">
          {/* 뒤로가기 버튼 */}
          <div className="mb-4">
            <button
              onClick={handleBackToPreview}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span>←</span>
              <span>미리보기로 돌아가기</span>
            </button>
          </div>

          {/* 퀴즈 컴포넌트 */}
          {quizType === 'drag-drop' && dialogueQuestions.length > 0 && (
            <DialogueDragAndDrop
              questions={dialogueQuestions}
              title="AI 생성 문제 테스트 (Drag & Drop)"
              reviewMode={false}
            />
          )}

          {quizType === 'multiple-choice' && multipleChoiceQuestions.length > 0 && (
            <MultipleChoice
              questions={multipleChoiceQuestions}
              title="AI 생성 문제 테스트 (Multiple Choice)"
            />
          )}
        </div>
      )}

      {/* 결과 화면 (현재는 사용되지 않지만 향후 확장 가능) */}
      {mode === 'results' && (
        <TestResults
          results={[]}
          onRegenerate={handleRegenerate}
          onBackToPreview={handleBackToPreview}
        />
      )}
    </div>
  );
}
