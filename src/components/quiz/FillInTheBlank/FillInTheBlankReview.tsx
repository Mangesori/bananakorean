'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DialogueQuestion } from '@/types/quiz';
import { useQuizMutation } from '@/hooks/useQuizMutation';

interface FillInTheBlankReviewProps {
  questions: DialogueQuestion[];
  title?: string;
  grammarName: string;
  topic: string;
}

const FillInTheBlankReview: React.FC<FillInTheBlankReviewProps> = ({
  questions,
  title,
  grammarName,
  topic,
}) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [showQuestionHint, setShowQuestionHint] = useState<boolean>(false);
  const [showAnswerHint, setShowAnswerHint] = useState<boolean>(false);
  const [showTranslationHint, setShowTranslationHint] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalQuestions = questions.length;
  const quizMutation = useQuizMutation();

  useEffect(() => {
    setCurrentIndex(0);
    setUserAnswer('');
    setIsAnswered(false);
    setIsCorrect(false);
    setShowFeedback(false);
    setShowQuestionHint(false);
    setShowAnswerHint(false);
    setShowTranslationHint(false);
    setIsFinished(false);
    setScore(0);
  }, [questions]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isAnswered && userAnswer.trim()) {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === 'Enter' && isAnswered) {
        e.preventDefault();
        handleNext();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isAnswered, userAnswer]);

  const current = questions[currentIndex];

  const checkAnswer = () => {
    const trimmedAnswer = userAnswer.trim().toLowerCase();
    const correctAnswer = (current?.answer || '').toLowerCase().trim();
    const alternativeAnswers = (current?.alternativeAnswers || []).map(ans =>
      ans.toLowerCase().trim()
    );

    return trimmedAnswer === correctAnswer || alternativeAnswers.includes(trimmedAnswer);
  };

  const handleSubmit = () => {
    if (!userAnswer.trim() || isAnswered) return;

    const correct = checkAnswer();
    setIsCorrect(correct);
    setIsAnswered(true);
    setShowFeedback(true);

    if (correct) {
      setScore(prev => prev + 1);
    }

    // 복습 모드이므로 is_review: true로 저장
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    quizMutation.mutate({
      grammar_name: grammarName,
      quiz_type: 'fill_blank',
      question_id: current.id?.toString() || `q-${currentIndex}`,
      question_text: current.question || '',
      user_answer: userAnswer.trim(),
      correct_answer: current.answer || '',
      is_correct: correct,
      is_retry: isRetrying,
      is_review: true, // 복습 모드 플래그
      time_spent: timeSpent,
      hints_used:
        (showQuestionHint ? 1 : 0) + (showAnswerHint ? 1 : 0) + (showTranslationHint ? 1 : 0),
    });

    if (correct) {
      setIsRetrying(false);
    }
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= totalQuestions) {
      setIsFinished(true);
      setShowFeedback(false);
      return;
    }

    setCurrentIndex(nextIndex);
    setUserAnswer('');
    setIsAnswered(false);
    setIsCorrect(false);
    setIsRetrying(false);
    setShowFeedback(false);
    setShowQuestionHint(false);
    setShowAnswerHint(false);
    setShowTranslationHint(false);
    setQuestionStartTime(Date.now());
  };

  const progressText = `${currentIndex + 1}/${totalQuestions}`;

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
                onClick={() => router.push(`/quiz/fill-blank/${topic}`)}
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
        style={{ paddingBottom: 'calc(90px + env(safe-area-inset-bottom))' }}
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

        {/* 질문 */}
        <div className="question-wrapper flex flex-col w-full gap-4 text-base md:text-lg flex-shrink-0">
          <div className="flex w-full items-center gap-2 mt-6 md:mt-8 lg:mt-3 xl:mt-3 2xl:mt-8 relative">
            <div className="text-xl md:text-2xl font-extrabold text-primaryColor w-6 md:w-8">
              Q:
            </div>
            <div className="text-xl md:text-2xl font-medium relative">
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
            </div>
          </div>

          {/* 답변 입력 */}
          <div className="flex w-full items-center gap-2 mt-3 lg:mt-2 xl:mt-2 2xl:mt-3">
            <div className="text-xl md:text-2xl font-extrabold text-primaryColor w-6 md:w-8">
              A:
            </div>
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !isAnswered && userAnswer.trim()) {
                    handleSubmit();
                  } else if (e.key === 'Enter' && isAnswered) {
                    handleNext();
                  }
                }}
                disabled={isAnswered}
                className={`w-full px-4 py-3 text-lg border-2 rounded-xl ${
                  isAnswered
                    ? isCorrect
                      ? 'border-primaryColor bg-primaryColor/10'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-300 focus:border-primaryColor'
                } outline-none transition-colors`}
                placeholder="답을 입력하세요"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        {/* 피드백 */}
        {showFeedback && (
          <div className="mt-6 flex-shrink-0">
            <div
              className={`w-full flex flex-col p-4 rounded-2xl ${
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
                        setUserAnswer('');
                        setShowFeedback(false);
                        setIsRetrying(true);
                        setTimeout(() => inputRef.current?.focus(), 50);
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
                      <div className="text-lg font-semibold">{current.answer}</div>
                      {current.alternativeAnswers && current.alternativeAnswers.length > 0 && (
                        <>
                          <div className="text-sm font-medium mt-2 mb-1">다른 정답</div>
                          <div className="text-base">{current.alternativeAnswers.join(', ')}</div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gray-150" style={{ bottom: 'calc(1px + env(safe-area-inset-bottom))' }}>
          <div
            className="w-full max-w-4xl mx-auto px-2 md:px-8"
            style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}
          >
            <button
              onClick={() => (isAnswered ? handleNext() : handleSubmit())}
              className={`w-full py-3 md:py-4 text-lg md:text-xl font-bold rounded-2xl shadow-lg bg-primaryColor text-white uppercase transition-all disabled:opacity-50`}
              disabled={!isAnswered && !userAnswer.trim()}
            >
              {isAnswered ? '다음' : '확인'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FillInTheBlankReview;
