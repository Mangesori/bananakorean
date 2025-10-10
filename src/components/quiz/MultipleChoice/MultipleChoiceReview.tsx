'use client';
import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MultipleChoiceQuestion } from '@/types/quiz';
import { useQuizMutation } from '@/hooks/useQuizMutation';

interface MultipleChoiceReviewProps {
  questions: MultipleChoiceQuestion[];
  title?: string;
  grammarName: string;
  topic: string;
}

const MultipleChoiceReview: React.FC<MultipleChoiceReviewProps> = ({
  questions,
  title,
  grammarName,
  topic,
}) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [showTranslationHint, setShowTranslationHint] = useState<boolean>(false);
  const [showQuestionHint, setShowQuestionHint] = useState<boolean>(false);
  const [showAnswerHint, setShowAnswerHint] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const lastOptionRef = useRef<HTMLButtonElement | null>(null);
  const bottomFixedRef = useRef<HTMLDivElement | null>(null);
  const [compactLastOption, setCompactLastOption] = useState<boolean>(false);

  const totalQuestions = questions.length;

  const quizMutation = useQuizMutation();

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowFeedback(false);
    setShowTranslationHint(false);
    setShowQuestionHint(false);
    setShowAnswerHint(false);
    setIsFinished(false);
    setScore(0);
  }, [questions]);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    document.addEventListener('touchmove', preventTouchMove, { passive: false });

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isAnswered && selectedOption) {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === 'Enter' && isAnswered) {
        e.preventDefault();
        handleNext();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener('touchmove', preventTouchMove);
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isAnswered, selectedOption]);

  const current = questions[currentIndex];
  const isAnswerToQuestionMode = current?.mode === 'answer-to-question';
  const isAnswerToQuestionLike = useMemo(() => {
    if (!current) return false;
    if (isAnswerToQuestionMode) return true;
    const text = current.answerTranslation || '';
    return /[\u3131-\uD79D]/.test(text);
  }, [current?.id, isAnswerToQuestionMode]);
  const hasQuestionParts = useMemo(() => {
    if (!current) return false;
    return Boolean(
      current.questionPrefix || current.questionItemsTranslation || current.questionSuffix
    );
  }, [current?.id]);

  const shuffledOptions = useMemo(() => {
    if (!current) return [];
    const arr = [...current.options];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [current?.id]);

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (isAnswered || !selectedOption) return;
    const correctNow = selectedOption === current.correctAnswer;

    if (correctNow) {
      setScore(prev => prev + 1);
    }

    // 복습 모드이므로 is_review: true로 저장 (진도 통계에 영향 없음)
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    quizMutation.mutate({
      grammar_name: grammarName,
      quiz_type: 'multiple',
      question_id: current.id?.toString() || `q-${currentIndex}`,
      question_text: current.question || '',
      user_answer: selectedOption || '',
      correct_answer: current.correctAnswer || '',
      is_correct: correctNow,
      is_retry: isRetrying,
      is_review: true, // 복습 모드 플래그
      time_spent: timeSpent,
      hints_used:
        (showQuestionHint ? 1 : 0) + (showAnswerHint ? 1 : 0) + (showTranslationHint ? 1 : 0),
    });

    setIsCorrect(correctNow);
    setIsAnswered(true);
    setShowFeedback(true);

    if (correctNow) {
      setIsRetrying(false);
    }
  };

  const handleNext = () => {
    if (!isAnswered) return;
    const nextIndex = currentIndex + 1;

    // 모든 문제를 다 푼 경우
    if (nextIndex >= totalQuestions) {
      setIsFinished(true);
      setShowFeedback(false);
      return;
    }

    setCurrentIndex(nextIndex);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsRetrying(false);
    setShowFeedback(false);
    setShowTranslationHint(false);
    setShowQuestionHint(false);
    setShowAnswerHint(false);
    setQuestionStartTime(Date.now());
  };

  const measureLastOptionDistance = useCallback(() => {
    if (!lastOptionRef.current || !bottomFixedRef.current) return;
    const lastRect = lastOptionRef.current.getBoundingClientRect();
    const bottomRect = bottomFixedRef.current.getBoundingClientRect();
    const distance = bottomRect.top - lastRect.bottom;
    const threshold = 8;
    setCompactLastOption(distance <= threshold);
  }, []);

  useEffect(() => {
    const r = requestAnimationFrame(measureLastOptionDistance);
    const onResize = () => measureLastOptionDistance();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    const RO = (window as any).ResizeObserver;
    const ro = RO ? new RO(onResize) : null;
    if (ro) {
      if (lastOptionRef.current) ro.observe(lastOptionRef.current);
      if (bottomFixedRef.current) ro.observe(bottomFixedRef.current);
    }
    return () => {
      cancelAnimationFrame(r);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      if (ro) ro.disconnect();
    };
  }, [current?.id, isAnswered, showFeedback, selectedOption, measureLastOptionDistance]);

  const progressText = `${currentIndex + 1}/${totalQuestions}`;
  const feedbackSystemHeight = 80;
  const safeBottom = 'env(safe-area-inset-bottom)';

  if (!current) {
    return (
      <main className="bg-bodyBg max-w-4xl mx-auto md:max-w-3xl lg:max-w-4xl px-4 md:px-8 py-6 md:py-10 rounded-xl h-[85vh] overflow-y-auto relative select-none">
        <div className="wrapper bg-gray-150 rounded-xl p-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-2">
              복습할 문제가 없습니다
            </h2>
            <p className="text-contentColor dark:text-contentColor-dark mb-6">
              최근 세션에서 틀린 문제가 없습니다. 모든 문제를 정확하게 풀었습니다!
            </p>
            <a
              href="/dashboards/student-dashboard"
              className="inline-block px-6 py-3 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition-colors"
            >
              대시보드로 돌아가기
            </a>
          </div>
        </div>
      </main>
    );
  }

  // 결과 화면
  if (isFinished) {
    return (
      <main
        className="bg-bodyBg max-w-4xl mx-auto md:max-w-3xl lg:max-w-4xl px-4 md:px-8 py-6 md:py-10 rounded-xl h-[85vh] overflow-y-auto relative select-none"
        onContextMenu={e => e.preventDefault()}
      >
        <div className="wrapper bg-gray-150 -mt-6 absolute left-0 right-0 mx-0 rounded-xl p-4 md:p-8 pb-32 select-none">
          <div className="flex items-center h-10">
            <h2 className="flex-1 text-2xl font-bold text-center">오답 다시 풀기</h2>
            <div className="flex justify-end">
              <Link
                href="/dashboards/student-dashboard"
                className="flex items-center justify-center hover:text-gray-600 transition-colors -mt-1 p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-x"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Link>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="text-2xl font-semibold">복습 완료!</div>

            <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
              <div className="text-center space-y-4">
                <div className="text-lg font-medium">결과</div>
                <div className="text-3xl font-bold text-primaryColor">
                  {score} / {totalQuestions}
                </div>
                <div className="text-sm text-gray-600">
                  정답률: {Math.round((score / Math.max(1, totalQuestions)) * 100)}%
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-md">
              <button
                onClick={() => router.push(`/quiz/multiple/${topic}`)}
                className="w-full px-5 py-4 rounded-xl bg-primaryColor text-white font-semibold shadow text-lg"
              >
                새로운 문제 풀기
              </button>

              <Link
                href="/dashboards/student-dashboard"
                className="w-full px-5 py-4 rounded-xl bg-white border border-gray-300 text-gray-800 font-semibold text-center hover:bg-gray-50"
              >
                대시보드로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="bg-bodyBg max-w-4xl mx-auto md:max-w-3xl lg:max-w-4xl px-2 md:px-8 py-6 md:py-6 lg:py-1 xl:py-1 2xl:py-10 rounded-xl overflow-hidden relative select-none"
      style={{ height: '90svh' }}
      onContextMenu={e => e.preventDefault()}
    >
      <div
        className="wrapper bg-gray-150 -mt-6 lg:-mt-8 xl:-mt-8 2xl:-mt-6 absolute left-0 right-0 mx-0 rounded-xl p-3 md:p-8 select-none flex flex-col h-full"
        onContextMenu={e => e.preventDefault()}
        style={{ paddingBottom: `calc(${feedbackSystemHeight + 10}px + ${safeBottom})` }}
      >
        <div className="flex items-center h-8 md:h-10">
          <h2 className="flex-1 text-lg md:text-2xl font-bold text-center leading-8 md:leading-10 pt-[1px]">
            오답 다시 풀기
          </h2>
          <div className="flex justify-end">
            <Link
              href="/dashboards/student-dashboard"
              className="flex items-center justify-center hover:text-gray-600 transition-colors -mt-1 p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-x"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Link>
          </div>
        </div>

        {/* 진행 상태 표시 */}
        <div className="mt-4 md:mt-6 lg:mt-3 xl:mt-3 2xl:mt-6 mb-3 md:mb-4 lg:mb-0 xl:mb-0 2xl:mb-4 flex-shrink-0">
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-primaryColor h-2 rounded-full"
              style={{
                width: `${(currentIndex / totalQuestions) * 100}%`,
              }}
            ></div>
          </div>
          <div className="mt-1 md:mt-2 text-center text-xs md:text-sm text-gray-600">
            {progressText}
          </div>
        </div>

        <div className="question-wrapper flex flex-wrap w-full gap-2 text-base md:text-lg flex-shrink-0">
          {/* 질문 */}
          <div className="flex w-full items-center gap-2 mt-6 md:mt-8 lg:mt-3 xl:mt-3 2xl:mt-8 relative">
            <div className="text-xl md:text-2xl font-extrabold text-primaryColor w-6 md:w-8">
              Q:
            </div>
            <div className="text-xl md:text-2xl font-medium relative">
              {isAnswerToQuestionMode ? (
                hasQuestionParts ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    {current.questionPrefix && (
                      <span className="cursor-default px-1">{current.questionPrefix}</span>
                    )}
                    {current.questionItemsTranslation && (
                      <span className="relative inline-block align-baseline mb-2 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:border-b-2 after:border-black">
                        <span className="bg-white/95 backdrop-blur-sm shadow-lg rounded-md px-3 py-2 inline-block text-lg whitespace-normal break-words">
                          {current.questionItemsTranslation}
                        </span>
                      </span>
                    )}
                    {current.questionSuffix && (
                      <span className="cursor-default px-1">{current.questionSuffix}</span>
                    )}
                  </div>
                ) : (
                  <span className="relative inline-block align-baseline mb-2 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:border-b-2 after:border-black">
                    <span className="bg-white/95 backdrop-blur-sm shadow-lg rounded-md px-3 py-2 inline-block text-lg whitespace-normal break-words">
                      {current.question}
                    </span>
                  </span>
                )
              ) : (
                <div
                  className="cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-600 px-1 rounded"
                  onClick={() => setShowQuestionHint(prev => !prev)}
                  title="번역 힌트 보기"
                >
                  {showQuestionHint && current.questionTranslation && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg p-3 z-10 text-base whitespace-nowrap transition-all duration-200 ease-in-out">
                      {current.questionTranslation}
                    </div>
                  )}
                  {current.question}
                </div>
              )}
            </div>
          </div>

          {/* 답변 */}
          <div className="flex w-full items-center gap-2 mt-3 lg:mt-2 xl:mt-2 2xl:mt-3 relative">
            <div className="text-xl md:text-2xl font-extrabold text-primaryColor w-6 md:w-8">
              A:
            </div>
            <div className="text-xl md:text-2xl font-medium relative">
              {isAnswerToQuestionMode ? (
                <div
                  className="cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-600 px-1 rounded"
                  onClick={() => setShowAnswerHint(prev => !prev)}
                >
                  {showAnswerHint && (current.explanation || current.answerTranslation) && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg p-3 z-10 text-base whitespace-nowrap transition-all duration-200 ease-in-out">
                      {current.explanation || current.answerTranslation}
                    </div>
                  )}
                  <div className="cursor-default px-1">{current.answerTranslation || ''}</div>
                </div>
              ) : (
                <span className="relative inline-block align-baseline mb-2 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:border-b-2 after:border-black">
                  <span className="bg-white/95 backdrop-blur-sm shadow-lg rounded-md px-3 py-2 inline-block text-lg whitespace-normal break-words">
                    {current.answerTranslation || ''}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 보기들 */}
        <div className="mt-6 md:mt-8 lg:mt-6 xl:mt-6 2xl:mt-8 grid gap-2">
          {shuffledOptions.map((option, i) => {
            const selected = selectedOption === option;
            const correctNow = isAnswered && option === current.correctAnswer;
            const wrongNow = isAnswered && selected && option !== current.correctAnswer;
            const indexLabel = i + 1;
            return (
              <button
                key={`${current.id}-${option}`}
                type="button"
                ref={i === 3 ? lastOptionRef : undefined}
                className={
                  `text-left border rounded-2xl px-4 py-3 ` +
                  (compactLastOption
                    ? 'lg:py-[9px] xl:py-[9px] 2xl:py-3 '
                    : 'lg:py-3 xl:py-3 2xl:py-3 ') +
                  `transition flex items-center gap-3 shadow-sm ` +
                  (correctNow
                    ? 'bg-primaryColor/10 border-primaryColor'
                    : wrongNow
                      ? 'bg-red-50 border-red-500'
                      : selected
                        ? 'border-primaryColor'
                        : 'bg-white hover:border-gray-500')
                }
                onClick={() => handleSelect(option)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !isAnswered && selectedOption) {
                    handleSubmit();
                  }
                }}
                disabled={isAnswered}
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 text-gray-700 text-sm shrink-0">
                  {indexLabel}
                </span>
                <span className="text-base leading-6">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 하단 고정 영역 */}
      {!isFinished && (
        <div
          ref={bottomFixedRef}
          className="absolute inset-x-0 z-10 bg-gray-150"
          style={{ bottom: `calc(1px + ${safeBottom})` }}
        >
          <div
            className="w-full max-w-4xl mx-auto px-2 md:px-8"
            style={{ paddingBottom: `calc(12px + ${safeBottom})` }}
          >
            {showFeedback && (
              <div
                className={`w-full mb-2 md:mb-3 flex flex-col p-3 rounded-2xl ${
                  isCorrect ? 'bg-gray-300' : 'bg-red-500'
                } text-white shadow-lg`}
              >
                {isCorrect ? (
                  <div className="flex items-center">
                    <div className="bg-primaryColor rounded-full p-2 mr-3">
                      <svg
                        className="w-5 h-5"
                        fill="white"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium">잘 했어요!</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-red-600 rounded-full p-1 mr-2">
                          <svg
                            className="w-5 h-5"
                            fill="white"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
                          </svg>
                        </div>
                        <span className="text-lg font-medium">다시 시도해 보세요!</span>
                      </div>
                      <button
                        onClick={() => setShowFeedback(false)}
                        className="p-1 hover:bg-red-600 rounded-full transition-colors"
                      >
                        <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsAnswered(false);
                          setSelectedOption(null);
                          setShowFeedback(false);
                          setIsRetrying(true);
                        }}
                        className="flex-1 bg-white text-red-700 hover:bg-gray-100 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        다시 시도
                      </button>
                      <button
                        onClick={() => setShowTranslationHint(prev => !prev)}
                        className="flex-1 bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        {showTranslationHint ? '정답 숨기기' : '정답 보기'}
                      </button>
                    </div>
                    {showTranslationHint && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                        <div className="text-sm font-medium mb-1">정답</div>
                        <div className="text-lg font-semibold">{current.correctAnswer}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => (isAnswered ? handleNext() : handleSubmit())}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (isAnswered) {
                    handleNext();
                  } else if (selectedOption) {
                    handleSubmit();
                  }
                }
              }}
              className={`w-full py-3 md:py-4 text-lg md:text-xl font-bold rounded-2xl shadow-lg bg-primaryColor text-white uppercase transition-all disabled:opacity-50`}
              disabled={!isAnswered && !selectedOption}
            >
              {isAnswered ? '다음' : '확인'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default MultipleChoiceReview;
