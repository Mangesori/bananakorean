'use client';
import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { MultipleChoiceQuestion } from '@/types/quiz';
import { useQuizMutation } from '@/hooks/useQuizMutation';

interface MultipleChoiceProps {
  questions: MultipleChoiceQuestion[];
  title?: string;
  reviewMode?: boolean;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  questions,
  title,
  reviewMode = false,
}) => {
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
  const [shuffledQuestions, setShuffledQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [currentQuestionSet, setCurrentQuestionSet] = useState<MultipleChoiceQuestion[]>([]);
  const [isRetrying, setIsRetrying] = useState<boolean>(false); // 다시 시도 여부
  const lastOptionRef = useRef<HTMLButtonElement | null>(null);
  const bottomFixedRef = useRef<HTMLDivElement | null>(null);
  const [compactLastOption, setCompactLastOption] = useState<boolean>(false);

  // 세션 관리
  const [showIntermediateResult, setShowIntermediateResult] = useState<boolean>(false);
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [sessionAttempts, setSessionAttempts] = useState<
    { is_correct: boolean; time_spent?: number; is_retry: boolean }[]
  >([]); // 세션 동안의 시도 내역

  // 복습 모드일 때는 틀린 문제 개수만큼만, 일반 모드일 때는 10문제
  const QUESTIONS_PER_SESSION = reviewMode ? questions.length : 10;

  // 퀴즈 저장 mutation
  const quizMutation = useQuizMutation();

  // 질문 셔플
  const shuffleQuestions = (arr: MultipleChoiceQuestion[]) => {
    const s = [...arr];
    for (let i = s.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [s[i], s[j]] = [s[j], s[i]];
    }
    return s;
  };

  // 문제 세트 생성 함수 (반복 로직)
  const generateQuestionSet = (baseQuestions: MultipleChoiceQuestion[], targetLength: number) => {
    const result: MultipleChoiceQuestion[] = [];
    const cycles = Math.ceil(targetLength / baseQuestions.length);

    for (let cycle = 0; cycle < cycles; cycle++) {
      const shuffled = shuffleQuestions(baseQuestions);
      for (let i = 0; i < baseQuestions.length && result.length < targetLength; i++) {
        result.push({
          ...shuffled[i],
          id: shuffled[i].id, // 원본 ID 유지 (고유성은 배열 인덱스로 보장)
        });
      }
    }

    return result;
  };

  useEffect(() => {
    setShuffledQuestions(shuffleQuestions(questions));
    // 복습 모드일 때는 문제 반복 없이 한 번만, 일반 모드일 때는 셔플
    setCurrentQuestionSet(reviewMode ? questions : shuffleQuestions(questions));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowFeedback(false);
    setShowTranslationHint(false);
    setShowQuestionHint(false);
    setShowAnswerHint(false);
    setIsFinished(false);
    setShowIntermediateResult(false);
    setSessionScore(0);
    setTotalQuestionsAnswered(0);
  }, [questions, reviewMode]);

  // 모바일 및 태블릿에서 스크롤 방지 (뷰포트 높이는 CSS svh로 고정)
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    document.addEventListener('touchmove', preventTouchMove, { passive: false });

    // 전역 키보드 이벤트 리스너 추가
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

  const current = currentQuestionSet[currentIndex];
  const isAnswerToQuestionMode = current?.mode === 'answer-to-question';
  const isAnswerToQuestionLike = useMemo(() => {
    if (!current) return false;
    if (isAnswerToQuestionMode) return true;
    const text = current.answerTranslation || '';
    return /[\u3131-\uD79D]/.test(text); // 한글 존재 여부로 역방향 유형 추정
  }, [current?.id, isAnswerToQuestionMode]);
  const hasQuestionParts = useMemo(() => {
    if (!current) return false;
    return Boolean(
      current.questionPrefix || current.questionItemsTranslation || current.questionSuffix
    );
  }, [current?.id]);

  const shuffledOptions = useMemo(() => {
    if (!current) return [];
    // 간단한 셔플 (질문 변경 시에만 셔플)
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

    // 점수 업데이트
    if (correctNow) {
      setScore(prev => prev + 1);
      setSessionScore(prev => prev + 1);
    }

    // DB에 퀴즈 시도 저장
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000); // 초 단위
    quizMutation.mutate({
      grammar_name: current.grammarName || '일반',
      quiz_type: 'multiple',
      question_id: current.id?.toString() || `q-${currentIndex}`,
      question_text: current.question || '',
      user_answer: selectedOption || '',
      correct_answer: current.correctAnswer || '',
      is_correct: correctNow,
      is_retry: isRetrying, // 다시 시도 여부 전달
      time_spent: timeSpent,
      hints_used:
        (showQuestionHint ? 1 : 0) + (showAnswerHint ? 1 : 0) + (showTranslationHint ? 1 : 0),
    });

    // 세션 시도 내역에 추가
    setSessionAttempts(prev => [
      ...prev,
      {
        is_correct: correctNow,
        time_spent: timeSpent,
        is_retry: isRetrying,
      },
    ]);

    setIsCorrect(correctNow);
    setIsAnswered(true);
    setShowFeedback(true);

    // 정답이면 다음 문제로 넘어갈 때 isRetrying 초기화
    if (correctNow) {
      setIsRetrying(false);
    }
  };

  const handleNext = () => {
    if (!isAnswered) return;
    const nextIndex = currentIndex + 1;
    const newTotalAnswered = totalQuestionsAnswered + 1;

    // 세션 완료 조건 체크
    if (newTotalAnswered % QUESTIONS_PER_SESSION === 0) {
      setTotalQuestionsAnswered(newTotalAnswered);

      // 세션 완료 시 진도 업데이트
      if (sessionAttempts.length > 0) {
        import('@/lib/supabase/quiz-mutations').then(({ updateSessionProgress }) => {
          updateSessionProgress(
            current.grammarName || '일반',
            'multiple_choice',
            sessionAttempts
          ).then(result => {
            if (result.error) {
              console.error('세션 진도 업데이트 실패:', result.error);
            }
          });
        });
        setSessionAttempts([]); // 세션 시도 내역 초기화
      }

      setShowIntermediateResult(true);
      setShowFeedback(false);
      return;
    }

    // 복습 모드가 아닐 때만 문제 세트 확장 (일반 모드)
    if (!reviewMode && nextIndex >= currentQuestionSet.length) {
      const baseQuestions = questions;
      const newTargetLength = Math.min(72, Math.max(24, newTotalAnswered + 24)); // 최소 24개, 최대 72개
      const newQuestionSet = generateQuestionSet(baseQuestions, newTargetLength);
      setCurrentQuestionSet(newQuestionSet);
    }

    setCurrentIndex(nextIndex);
    setTotalQuestionsAnswered(newTotalAnswered);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsRetrying(false); // 다음 문제로 넘어가면 재시도 상태 초기화
    setShowFeedback(false);
    setShowTranslationHint(false);
    setShowQuestionHint(false);
    setShowAnswerHint(false);
    setQuestionStartTime(Date.now()); // 다음 문제 타이머 시작
  };

  const handleRestart = () => {
    setShuffledQuestions(shuffleQuestions(questions));
    setCurrentQuestionSet(shuffleQuestions(questions));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowFeedback(false);
    setShowTranslationHint(false);
    setShowQuestionHint(false);
    setShowAnswerHint(false);
    setIsFinished(false);
    setShowIntermediateResult(false);
    setSessionScore(0);
    setTotalQuestionsAnswered(0);
    setScore(0);
  };

  const handleContinueSession = () => {
    setShowIntermediateResult(false);
    setSessionScore(0);
    const nextIndex = currentIndex + 1;

    // 복습 모드가 아닐 때만 문제 세트 확장 (일반 모드)
    if (!reviewMode && nextIndex >= currentQuestionSet.length) {
      const baseQuestions = questions;
      const newTotalAnswered = totalQuestionsAnswered;
      const newTargetLength = Math.min(72, Math.max(24, newTotalAnswered + 24));
      const newQuestionSet = generateQuestionSet(baseQuestions, newTargetLength);
      setCurrentQuestionSet(newQuestionSet);
    }

    setCurrentIndex(nextIndex);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowFeedback(false);
    setShowTranslationHint(false);
    setShowQuestionHint(false);
    setShowAnswerHint(false);
    setQuestionStartTime(Date.now()); // 다음 문제 타이머 시작
  };

  // 4번째 보기와 하단 고정 영역의 간격이 너무 좁을 때만 마지막 보기의 세로 패딩 축소 (태블릿 전용 시각 효과)
  const measureLastOptionDistance = useCallback(() => {
    if (!lastOptionRef.current || !bottomFixedRef.current) return;
    const lastRect = lastOptionRef.current.getBoundingClientRect();
    const bottomRect = bottomFixedRef.current.getBoundingClientRect();
    const distance = bottomRect.top - lastRect.bottom;
    const threshold = 8; // 겹치거나 매우 가까운 경우 기준(px)
    setCompactLastOption(distance <= threshold);
  }, []);

  useEffect(() => {
    // 다음 프레임에서 측정하여 레이아웃 확정 후 계산
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

  const isLast = false; // 무한 반복이므로 마지막 문제 개념 제거
  const currentSessionNumber = Math.floor(totalQuestionsAnswered / QUESTIONS_PER_SESSION);

  // 세션별 진행 상황 계산
  const currentSessionProgress = totalQuestionsAnswered % QUESTIONS_PER_SESSION;
  const sessionProgressText = `${totalQuestionsAnswered + 1}/${QUESTIONS_PER_SESSION * Math.max(1, Math.ceil((totalQuestionsAnswered + 1) / QUESTIONS_PER_SESSION))}`;

  if (!current) {
    return (
      <main className="bg-bodyBg max-w-4xl mx-auto md:max-w-3xl lg:max-w-4xl px-4 md:px-8 py-6 md:py-10 rounded-xl h-[85vh] overflow-y-auto relative select-none">
        <div className="wrapper bg-gray-150 rounded-xl p-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-2">
              {reviewMode ? '복습할 문제가 없습니다' : '문제를 불러올 수 없습니다'}
            </h2>
            <p className="text-contentColor dark:text-contentColor-dark mb-6">
              {reviewMode
                ? '최근 세션에서 틀린 문제가 없습니다. 모든 문제를 정확하게 풀었습니다!'
                : '문제를 찾을 수 없습니다.'}
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

  // 통합 결과 화면 (중간 결과만)
  if (showIntermediateResult) {
    const titleText = `세션 ${currentSessionNumber} 완료!`;

    return (
      <main
        className="bg-bodyBg max-w-4xl mx-auto md:max-w-3xl lg:max-w-4xl px-4 md:px-8 py-6 md:py-10 rounded-xl h-[85vh] overflow-y-auto relative select-none"
        onContextMenu={e => e.preventDefault()}
      >
        <div className="wrapper bg-gray-150 -mt-6 absolute left-0 right-0 mx-0 rounded-xl p-4 md:p-8 pb-32 select-none">
          <div className="flex items-center h-10">
            <h2 className="flex-1 text-2xl font-bold text-center">{title || 'Multiple Choice'}</h2>
            <div className="flex justify-end">
              <Link
                href="/quiz/multiple"
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
            <div className="text-2xl font-semibold">{titleText}</div>

            <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
              <div className="text-center space-y-4">
                {/* 세션별 결과 (중간 결과일 때만) */}
                {showIntermediateResult && (
                  <>
                    <div className="text-lg font-medium">이번 세션 결과</div>
                    <div className="text-3xl font-bold text-primaryColor">
                      {sessionScore} / {QUESTIONS_PER_SESSION}
                    </div>
                    <div className="text-sm text-gray-600">
                      세션 정답률: {Math.round((sessionScore / QUESTIONS_PER_SESSION) * 100)}%
                    </div>
                    <hr className="my-4" />
                  </>
                )}

                {/* 전체 결과 */}
                <div className="text-lg font-medium">전체 결과</div>
                <div className="text-3xl font-bold text-primaryColor">
                  {score} / {totalQuestionsAnswered}
                </div>
                <div className="text-sm text-gray-600">
                  전체 정답률: {Math.round((score / Math.max(1, totalQuestionsAnswered)) * 100)}%
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-md">
              <button
                onClick={handleContinueSession}
                className="w-full px-5 py-4 rounded-xl bg-primaryColor text-white font-semibold shadow text-lg"
              >
                계속하기
              </button>

              <Link
                href="/quiz/multiple"
                className="w-full px-5 py-4 rounded-xl bg-white border border-gray-300 text-gray-800 font-semibold text-center hover:bg-gray-50"
              >
                목록으로
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 하단 스택 공간 확보 및 안전영역 보정
  const feedbackSystemHeight = 80;
  const safeBottom = 'env(safe-area-inset-bottom)';

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
            {title}
          </h2>
          <div className="flex justify-end">
            <Link
              href="/quiz/multiple"
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

        {/* 오답 복습 안내 메시지 */}
        {reviewMode && (
          <div className="mt-3 mb-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 text-sm md:text-base text-blue-800 dark:text-blue-200">
              <span className="text-xl">📝</span>
              <span className="font-medium">최근 세션에서 틀린 문제를 복습합니다</span>
            </div>
          </div>
        )}

        {/* 진행 상태 표시 */}
        <div className="mt-4 md:mt-6 lg:mt-3 xl:mt-3 2xl:mt-6 mb-3 md:mb-4 lg:mb-0 xl:mb-0 2xl:mb-4 flex-shrink-0">
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-primaryColor h-2 rounded-full"
              style={{
                width: `${(currentSessionProgress / QUESTIONS_PER_SESSION) * 100}%`,
              }}
            ></div>
          </div>
          <div className="mt-1 md:mt-2 text-center text-xs md:text-sm text-gray-600">
            {sessionProgressText}
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
                // answer-to-question 모드: 영어 질문, 흰 박스+밑줄, 힌트 없음
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
                // question-to-answer 모드: 한국어 질문, 클릭 시 영어 힌트, 박스/밑줄 없음
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

          {/* 답변 (영어 번역 표시) */}
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

        {/* 보기들 (번호 배지) */}
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
                  // 태블릿 전용: 조건 발생 시 4개 모두 얇게
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

      {/* 하단 고정 래퍼: 피드백 + 버튼을 한 컨테이너에 스택 (A 방식) */}
      {!showIntermediateResult && (
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
                          setIsRetrying(true); // 다시 시도 플래그 설정
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

export default MultipleChoice;
