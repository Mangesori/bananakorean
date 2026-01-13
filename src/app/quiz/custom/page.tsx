'use client';

import { useState, useCallback } from 'react';
import { parseAnswerToItems } from '@/lib/quiz/parser';

// ... (existing helper to process questions)
const processQuestionsWithParser = (questions: DialogueQuestion[]): DialogueQuestion[] => {
  return questions.map(q => {
    // 이미 아이템이 있고 originalWordIndex가 있다면 건너뛰기 (이미 처리된 경우)
    if (q.items && q.items.length > 0 && q.items[0].originalWordIndex !== undefined) {
      return q;
    }
    // 그렇지 않으면 파서 적용
    return {
      ...q,
      items: parseAnswerToItems(q.answer)
    };
  });
};


import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import StepIndicator from '@/components/quiz/custom/StepIndicator';
import VocabularyInput from '@/components/quiz/custom/VocabularyInput';
import GrammarSelection from '@/components/quiz/custom/GrammarSelection';
import QuizSettings from '@/components/quiz/custom/QuizSettings';
import PreviewPanel from '@/components/quiz/custom/PreviewPanel';
import GenerationProgress from '@/components/quiz/custom/GenerationProgress';
import { TopicId } from '@/data/quiz/topics/meta';
import { DialogueQuestion } from '@/types/quiz';
import {
  CustomQuizStep,
  CustomQuizSettings,
  QuizGenerationResponse,
  ComparisonResult,
  QuizGenerationMode,
} from '@/types/custom-quiz';

const defaultSettings: CustomQuizSettings = {
  dialogueDragDrop: 10,
  matching: 0,
  multipleChoice: 0,
  fillInBlank: 0,
  speaking: 0,
};

export default function CustomQuizPage() {
  const router = useRouter();

  // 현재 단계
  const [currentStep, setCurrentStep] = useState<CustomQuizStep>(1);

  // 상태 관리
  const [vocabulary, setVocabulary] = useState<string[]>([]);
  const [selectedGrammar, setSelectedGrammar] = useState<TopicId[]>([]);
  const [settings, setSettings] = useState<CustomQuizSettings>(defaultSettings);
  const [generatedQuestions, setGeneratedQuestions] = useState<DialogueQuestion[]>([]);
  const [generationMode, setGenerationMode] = useState<QuizGenerationMode>('from-scratch');
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  // 로딩 상태
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [generationMetadata, setGenerationMetadata] = useState<
    QuizGenerationResponse['metadata'] | null
  >(null);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });

  // 단계 이동
  const goToStep = useCallback((step: CustomQuizStep) => {
    setCurrentStep(step);
  }, []);

  // 퀴즈 생성 (실제 AI API 호출)
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setGenerationProgress({ current: 0, total: settings.dialogueDragDrop });

    try {
      // 진행 상황 시뮬레이션 (실제로는 서버에서 스트리밍으로 받을 수 있음)
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          const estimated = Math.min(prev.current + 1, prev.total - 1);
          return { ...prev, current: estimated };
        });
      }, 500);

      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vocabulary,
          grammarTopics: selectedGrammar,
          count: settings.dialogueDragDrop,
          mode: generationMode,
        }),
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (!response.ok) {
        // 제한 초과 에러인 경우 더 자세한 메시지 표시
        if (response.status === 403 && data.error === 'AI 생성 제한 초과') {
          const resetDate = data.resetDate
            ? new Date(data.resetDate).toLocaleDateString('ko-KR')
            : '다음 기간';
          const message = data.message
            ? `${data.message}\n\n리셋 날짜: ${resetDate}`
            : `AI 생성 제한을 초과했습니다.\n\n리셋 날짜: ${resetDate}`;
          throw new Error(message);
        }
        throw new Error(data.error || data.message || '문제 생성에 실패했습니다.');
      }

      if (data.success) {
        // 비교 모드 vs 단일 모드 처리
        if (generationMode === 'both') {
           const result = data.data as ComparisonResult;
           // 하이브리드와 처음부터 생성 결과 모두 처리
           const processedHybrid = {
             ...result.hybrid,
             questions: processQuestionsWithParser(result.hybrid.questions)
           };
           const processedFromScratch = {
             ...result.fromScratch,
             questions: processQuestionsWithParser(result.fromScratch.questions)
           };
           
          // 비교 모드: ComparisonResult
          setComparisonResult({
            hybrid: processedHybrid,
            fromScratch: processedFromScratch
          });
          setGenerationProgress({
            current: settings.dialogueDragDrop,
            total: settings.dialogueDragDrop,
          });
        } else {
          // 단일 모드: QuizGenerationResponse
          const result = data.data as QuizGenerationResponse;
          if (result.success) {
            setGenerationProgress({
              current: result.questions.length,
              total: settings.dialogueDragDrop,
            });
            // 파서 적용하여 저장
            setGeneratedQuestions(processQuestionsWithParser(result.questions));
            setGenerationMetadata(result.metadata);
          }
        }

        // 완료 표시 후 이동
        setTimeout(() => {
          setCurrentStep(4);
        }, 500);
      } else {
        alert(data.data.error || '문제 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('퀴즈 생성 오류:', error);
      alert(
        error instanceof Error
          ? error.message
          : '문제 생성 중 오류가 발생했습니다.'
      );
    } finally {
      setIsGenerating(false);
      setGenerationProgress({ current: 0, total: 0 });
    }
  }, [vocabulary, selectedGrammar, settings.dialogueDragDrop, generationMode]);

  // 단일 문제 재생성
  const handleRegenerateSingle = useCallback(
    async (index: number) => {
      setRegeneratingIndex(index);
      try {
        const response = await fetch('/api/ai/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vocabulary,
            grammarTopics: selectedGrammar,
            count: 1,
            mode: generationMode === 'both' ? 'hybrid' : generationMode,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '문제 재생성에 실패했습니다.');
        }

        if (data.success && data.data.questions.length > 0) {
          const newQuestion = processQuestionsWithParser([data.data.questions[0]])[0];
          setGeneratedQuestions(prev => {
            const updated = [...prev];
            updated[index] = newQuestion;
            return updated;
          });
        }
      } catch (error) {
        console.error('단일 재생성 오류:', error);
        alert(
          error instanceof Error
            ? error.message
            : '문제 재생성에 실패했습니다.'
        );
      } finally {
        setRegeneratingIndex(null);
      }
    },
    [vocabulary, selectedGrammar, generationMode]
  );

  // 질문 업데이트 핸들러
  const handleQuestionUpdate = useCallback(
    (index: number, updated: DialogueQuestion) => {
      setGeneratedQuestions(prev => {
        const newQuestions = [...prev];
        newQuestions[index] = updated;
        return newQuestions;
      });
    },
    []
  );

  // 전체 재생성
  const handleRegenerateAll = useCallback(async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vocabulary,
          grammarTopics: selectedGrammar,
          count: settings.dialogueDragDrop,
          mode: generationMode === 'both' ? 'hybrid' : generationMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '문제 생성에 실패했습니다.');
      }

      if (data.success && data.data.success) {
        setGeneratedQuestions(processQuestionsWithParser(data.data.questions));
        setGenerationMetadata(data.data.metadata);
      } else {
        alert(data.data.error || '문제 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('전체 재생성 오류:', error);
      alert(
        error instanceof Error
          ? error.message
          : '문제 생성 중 오류가 발생했습니다.'
      );
    } finally {
      setIsGenerating(false);
    }
  }, [vocabulary, selectedGrammar, settings.dialogueDragDrop, generationMode]);

  // ...

  // 퀴즈 완료 (실제 퀴즈 시작)
  const handleComplete = useCallback(() => {
    // 생성된 문제를 sessionStorage에 저장하고 퀴즈 페이지로 이동
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(
        'customQuizQuestions',
        JSON.stringify(generatedQuestions)
      );
      router.push('/quiz/custom/play');
    }
  }, [generatedQuestions, router]);

  // 🆕 비교 모드에서 결과 선택
  const handleSelectComparisonResult = useCallback(
    (type: 'hybrid' | 'from-scratch') => {
      if (!comparisonResult) return;

      const selectedResult =
        type === 'hybrid' ? comparisonResult.hybrid : comparisonResult.fromScratch;

      // 이미 handleGenerate에서 파싱되었으므로 그대로 사용
      setGeneratedQuestions(selectedResult.questions);
      setGenerationMetadata(selectedResult.metadata);
      setComparisonResult(null); // 비교 모드 종료

      console.log(`${type} 결과 선택됨:`, selectedResult.questions.length, '개 문제');
    },
    [comparisonResult]
  );

  return (
    <PageWrapper>
      {/* 생성 진행 상황 표시 */}
      {isGenerating && generationProgress.total > 0 && (
        <GenerationProgress
          current={generationProgress.current}
          total={generationProgress.total}
          mode={generationMode}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">커스텀 모드</h1>
          <p className="text-gray-600 mt-2">
            나만의 어휘와 문법으로 퀴즈를 만들어보세요
          </p>
        </div>

        {/* 단계 표시 */}
        <StepIndicator currentStep={currentStep} />

        {/* 단계별 컨텐츠 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {currentStep === 1 && (
            <VocabularyInput
              vocabulary={vocabulary}
              onVocabularyChange={setVocabulary}
              onNext={() => goToStep(2)}
            />
          )}

          {currentStep === 2 && (
            <>
              <GrammarSelection
                selectedGrammar={selectedGrammar}
                onGrammarChange={setSelectedGrammar}
                onPrev={() => goToStep(1)}
                onNext={() => goToStep(3)}
              />

              {/* 생성 방식 선택 (삭제: 커스텀 모드는 이제 항상 From Scratch) */}
            </>
          )}

          {currentStep === 3 && (
            <QuizSettings
              settings={settings}
              onSettingsChange={setSettings}
              onPrev={() => goToStep(2)}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          )}

          {currentStep === 4 && (
            <PreviewPanel
              questions={comparisonResult ? undefined : generatedQuestions}
              metadata={comparisonResult ? undefined : generationMetadata}
              comparisonResult={comparisonResult ?? undefined}
              onRegenerateSingle={comparisonResult ? undefined : handleRegenerateSingle}
              onRegenerateAll={comparisonResult ? undefined : handleRegenerateAll}
              onSelectComparisonResult={handleSelectComparisonResult}
              onQuestionUpdate={handleQuestionUpdate}
              onPrev={() => goToStep(3)}
              onComplete={handleComplete}
              isRegenerating={isGenerating || regeneratingIndex !== null}
              regeneratingIndex={regeneratingIndex}
            />
          )}
        </div>
      </div>
    </PageWrapper>
  );
}


