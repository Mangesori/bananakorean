'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
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
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  // 모바일/태블릿 감지 상태
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const [isIOSDevice, setIsIOSDevice] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 입력 모드 상태 (모바일에서 입력 필드 클릭 시 전환)
  const [isInputMode, setIsInputMode] = useState<boolean>(false);

  // 물리적 키보드 연결 감지
  const [hasPhysicalKeyboard, setHasPhysicalKeyboard] = useState<boolean>(false);

  // iOS 키보드 문제 해결을 위한 스크롤 위치 관리
  const [initialScrollY, setInitialScrollY] = useState<number>(0);

  // 안드로이드 VisualViewport 키보드 감지
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
  const [viewportHeight, setViewportHeight] = useState<number>(0);

  // 동적 마진 계산을 위한 상태
  const [dynamicMargin, setDynamicMargin] = useState<number>(0);

  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const totalQuestions = questions.length;

  // 퀴즈 저장 mutation
  const quizMutation = useQuizMutation();

  // 물리적 키보드 감지 (iOS와 안드로이드 모두 지원)
  useEffect(() => {
    if (!isMobileDevice) return;

    let keyCheckTimeout: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 키 입력 감지
      if (e.key && e.key.length > 0) {
        // 모바일 입력 모드가 아닐 때만 물리적 키보드로 간주
        // (입력 모드일 때는 가상 키보드일 가능성이 높음)
        if (!isInputMode) {
          const wasPhysicalKeyboard = hasPhysicalKeyboard;
          setHasPhysicalKeyboard(true);

          // 물리적 키보드가 처음 감지되었다면 입력 필드에 자동 포커스
          if (!wasPhysicalKeyboard) {
            setTimeout(() => {
              inputRef.current?.focus();
            }, 50);
          }
        } else if (!isIOSDevice) {
          // 안드로이드: 입력 모드에서 키 입력 발생 시 디바운싱 적용
          // 여러 키 입력을 하나로 묶어서 처리
          if (keyCheckTimeout) {
            clearTimeout(keyCheckTimeout);
          }

          keyCheckTimeout = setTimeout(() => {
            const windowInnerHeight = window.innerHeight;
            const currentViewportHeight = window.visualViewport?.height || windowInnerHeight;
            const keyboardVisible = windowInnerHeight > currentViewportHeight + 50;

            // 가상 키보드가 없다면 물리적 키보드로 간주
            if (!keyboardVisible && isInputMode) {
              setHasPhysicalKeyboard(true);
              setIsInputMode(false);
              setDynamicMargin(0);
              setInitialScrollY(0);
              setIsKeyboardVisible(false);

              setTimeout(() => {
                inputRef.current?.focus();
              }, 50);
            }
          }, 300); // 300ms 디바운싱
        }
        // iOS 입력 모드일 때는 키 입력을 그대로 허용 (visualViewport로만 감지)
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (keyCheckTimeout) {
        clearTimeout(keyCheckTimeout);
      }
    };
  }, [isMobileDevice, isInputMode, isIOSDevice, hasPhysicalKeyboard]);

  // 모바일/태블릿 감지 로직
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;

      // iOS 디바이스 감지 (iPad의 최신 User Agent도 고려)
      const isIOS =
        /iPad|iPhone|iPod/.test(userAgent) ||
        ((navigator as any).userAgentData?.platform === 'macOS' && navigator.maxTouchPoints > 1) ||
        (navigator.maxTouchPoints > 1 && /Mac/.test(userAgent));

      // 화면 크기 기준 (1536px 미만은 모바일/태블릿, 1536px 이상은 데스크톱)
      const isMobileByWidth = width < 1536;

      // User Agent 기준으로 모바일/태블릿 감지
      const isMobileByUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );

      // 터치 기능 감지
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // 종합 판단: 화면 크기 + (User Agent 또는 터치 기능)
      const isMobile = isMobileByWidth && (isMobileByUA || isTouchDevice);

      setIsMobileDevice(isMobile);
      setIsIOSDevice(isIOS);
    };

    // 초기 감지
    checkDevice();

    // 화면 크기 변경 시 재감지
    const handleResize = () => {
      checkDevice();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // iOS 키보드 감지 및 스크롤 제어 (iOS에서만 작동)
  useEffect(() => {
    if (!isIOSDevice) return;

    let previousViewportHeight = window.visualViewport?.height || window.innerHeight;

    const handleScroll = () => {
      if (isInputMode && isMobileDevice) {
        const currentScrollY = window.scrollY;

        // 키보드로 인해 스크롤이 밀려났을 때 원래 위치로 복원
        if (currentScrollY > initialScrollY) {
          window.scrollTo(0, initialScrollY);
        }
      }
    };

    const handleViewportResize = () => {
      if (!isMobileDevice) return;

      const currentViewportHeight = window.visualViewport?.height || window.innerHeight;
      const heightDifference = currentViewportHeight - previousViewportHeight;

      // 입력 필드에 포커스가 있고, viewport 높이가 크게 증가했다면 (가상 키보드가 내려감)
      // 이는 물리적 키보드 연결로 간주
      if (isInputMode && heightDifference > 100) {
        // 물리적 키보드로 간주하고 일반 레이아웃으로 전환
        setHasPhysicalKeyboard(true);
        setIsInputMode(false);
        setDynamicMargin(0);
        setInitialScrollY(0);

        // 입력 필드에 포커스 유지
        setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
      }
      // 물리적 키보드 모드에서 viewport 높이가 크게 감소했다면 (가상 키보드가 올라옴)
      // 이는 물리적 키보드 연결 끊김으로 간주
      else if (hasPhysicalKeyboard && heightDifference < -100) {
        setHasPhysicalKeyboard(false);
        setIsInputMode(true);
        setInitialScrollY(window.scrollY);
        setTimeout(() => setDynamicMargin(calculateDynamicMargin()), 50);
      } else if (isInputMode) {
        // 일반적인 키보드 높이 변화 (동적 마진 재계산)
        handleScroll();
        setDynamicMargin(calculateDynamicMargin());
      }

      previousViewportHeight = currentViewportHeight;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.visualViewport?.addEventListener('resize', handleViewportResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
    };
  }, [isInputMode, isMobileDevice, isIOSDevice, initialScrollY, hasPhysicalKeyboard]);

  // 동적 마진 계산 함수
  const calculateDynamicMargin = () => {
    if (!isMobileDevice || !isInputMode) return 0;

    const currentViewportHeight = window.visualViewport?.height || window.innerHeight;

    // 디바이스별 상단/하단 영역 높이 설정
    let topAreaHeight, bottomAreaHeight;

    if (isIOSDevice) {
      // iOS 디바이스별 설정 (실제 측정값 기준)
      if (window.innerWidth < 768) {
        // iPhone
        topAreaHeight = 185; // 상단 영역: 헤더(33px) + 진행바(56px) + Q/A(96px)
        bottomAreaHeight = 10; // 하단 영역: 입력필드(52px) + 버튼(48px) + 패딩(36px)
      } else {
        // iPad (비례적으로 조정)
        topAreaHeight = 220; // iPad에서는 약간 더 큰 폰트와 패딩
        bottomAreaHeight = 136; // iPad에서는 약간 더 큰 버튼과 패딩
      }
    } else {
      // 안드로이드 디바이스별 설정 (iOS와 동일한 측정값)
      if (window.innerWidth < 768) {
        // 모바일
        topAreaHeight = 185;
        bottomAreaHeight = 136;
      } else {
        // 태블릿
        topAreaHeight = 220;
        bottomAreaHeight = 156;
      }
    }

    // 사용 가능한 높이 계산
    const availableHeight = currentViewportHeight - topAreaHeight - bottomAreaHeight;

    // Q/A와 입력 필드 사이의 거리 (130px)를 고려한 동적 마진
    const contentHeight = 130; // Q/A와 입력 필드 사이 거리
    const calculatedMargin = Math.max(0, availableHeight - contentHeight);

    return calculatedMargin;
  };

  // 안드로이드 VisualViewport 키보드 감지 및 제어
  useEffect(() => {
    if (!isMobileDevice || isIOSDevice) return;

    let previousViewportHeight = window.visualViewport?.height || window.innerHeight;
    let previousKeyboardVisible = false;
    let resizeCheckTimeout: NodeJS.Timeout | null = null;

    const handleViewportResize = () => {
      // 물리적 키보드 사용 중에는 viewport resize 무시
      if (hasPhysicalKeyboard) {
        // 단, 가상 키보드가 올라왔는지 주기적으로 확인 (물리적 키보드 연결 끊김 감지용)
        if (resizeCheckTimeout) {
          clearTimeout(resizeCheckTimeout);
        }

        resizeCheckTimeout = setTimeout(() => {
          const windowInnerHeight = window.innerHeight;
          const currentViewportHeight = window.visualViewport?.height || windowInnerHeight;
          const keyboardVisible = windowInnerHeight > currentViewportHeight + 50;

          // 가상 키보드가 올라왔다면 물리적 키보드 연결 끊김으로 간주
          if (keyboardVisible) {
            setHasPhysicalKeyboard(false);
            setIsInputMode(true);
            setInitialScrollY(window.scrollY);
            setTimeout(() => setDynamicMargin(calculateDynamicMargin()), 50);
          }
        }, 500); // 500ms 디바운싱
        return;
      }

      const windowInnerHeight = window.innerHeight;
      const currentViewportHeight = window.visualViewport?.height || windowInnerHeight;

      // 키보드 유무 감지
      const keyboardVisible = windowInnerHeight > currentViewportHeight;
      setIsKeyboardVisible(keyboardVisible);
      setViewportHeight(currentViewportHeight);

      // 가상 키보드가 내려갔을 때 (물리적 키보드 연결로 간주)
      if (isInputMode && previousKeyboardVisible && !keyboardVisible) {
        setHasPhysicalKeyboard(true);
        setIsInputMode(false);
        setDynamicMargin(0);
        setInitialScrollY(0);

        // 입력 필드에 포커스 유지
        setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
      } else {
        // 동적 마진 계산
        setDynamicMargin(calculateDynamicMargin());
      }

      previousViewportHeight = currentViewportHeight;
      previousKeyboardVisible = keyboardVisible;
    };

    const handleViewportScroll = () => {
      if (isKeyboardVisible && window.visualViewport) {
        const viewportTopGap =
          (window.visualViewport.pageTop || 0) - (window.visualViewport.offsetTop || 0);
        const translateY = window.scrollY - viewportTopGap;

        // 가상 영역 스크롤 방지
        if (window.scrollY + window.visualViewport.height > document.body.offsetHeight - 2) {
          window.scrollTo(0, document.body.offsetHeight - window.visualViewport.height - 1);
        }
      }
    };

    // 안드로이드에서만 VisualViewport 이벤트 리스너 추가
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
      window.visualViewport.addEventListener('scroll', handleViewportScroll);
      window.addEventListener('scroll', handleViewportScroll);

      // 초기 설정
      handleViewportResize();
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
        window.visualViewport.removeEventListener('scroll', handleViewportScroll);
        window.removeEventListener('scroll', handleViewportScroll);
      }
      if (resizeCheckTimeout) {
        clearTimeout(resizeCheckTimeout);
      }
    };
  }, [isMobileDevice, isIOSDevice, isKeyboardVisible, isInputMode, hasPhysicalKeyboard]);

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

  // 전역 키보드 이벤트 리스너 추가 (엔터 키로 제출/다음)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (isAnswered) {
          e.preventDefault();
          handleNext();
        } else if (userAnswer.trim()) {
          e.preventDefault();
          handleSubmit();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isAnswered, userAnswer]);

  const current = questions[currentIndex];
  const isAnswerToQuestionMode = current?.mode === 'answer-to-question';
  const isAnswerToQuestionLike = useMemo(() => {
    if (!current) return false;
    const hasQuestionParts = Boolean(
      current.questionPrefix ||
        (current.questionItems && current.questionItems.length) ||
        current.questionSuffix
    );
    return current.mode === 'answer-to-question' || hasQuestionParts;
  }, [current]);

  // 정답 검증
  const checkAnswer = () => {
    if (!current) return false;
    const trimmedAnswer = userAnswer.trim().toLowerCase();
    const correctAnswer = current.answer.toLowerCase();
    const alternativeAnswers = current.alternativeAnswers?.map(alt => alt.toLowerCase()) || [];

    return trimmedAnswer === correctAnswer || alternativeAnswers.includes(trimmedAnswer);
  };

  // 답안 제출
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
      quiz_type: 'fill_in_blank',
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

  // 다음 문제로 이동
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

    // 물리적 키보드가 있거나 데스크톱이면 입력 필드에 자동 포커스
    if (!isMobileDevice || hasPhysicalKeyboard) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // 입력 필드 포커스 핸들러 (모바일에서 입력 모드 활성화)
  const handleInputFocus = () => {
    // 물리적 키보드가 연결된 경우 입력 모드로 전환하지 않음
    if (isMobileDevice && !hasPhysicalKeyboard) {
      setIsInputMode(true);
      // iOS에서만 키보드 문제 해결을 위해 현재 스크롤 위치 저장
      if (isIOSDevice) {
        setInitialScrollY(window.scrollY);
      }
      // 동적 마진 계산 (더 빠른 반응)
      setTimeout(() => setDynamicMargin(calculateDynamicMargin()), 50);
    }
  };

  // 입력 필드 블러 핸들러 (모바일에서 입력 모드 비활성화)
  const handleInputBlur = () => {
    // 물리적 키보드가 연결된 경우 입력 모드를 유지
    if (isMobileDevice && !hasPhysicalKeyboard) {
      // 약간의 지연을 두어 다른 상호작용이 있는지 확인
      setTimeout(() => {
        setIsInputMode(false);
        setInitialScrollY(0); // 스크롤 위치 리셋
        setDynamicMargin(0); // 동적 마진 리셋
      }, 100);
    }
  };

  // 입력 모드 종료 핸들러 (뒤로가기 버튼 등)
  const handleExitInputMode = () => {
    setIsInputMode(false);
    setInitialScrollY(0); // 스크롤 위치 리셋
    setDynamicMargin(0); // 동적 마진 리셋
    // 입력 필드에서 포커스 제거
    if (document.activeElement instanceof HTMLInputElement) {
      document.activeElement.blur();
    }
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

  // 결과 화면 (MultipleChoiceReview와 동일한 스타일)
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

  const hasQuestionParts = Boolean(
    current.questionPrefix ||
      (current.questionItems && current.questionItems.length) ||
      current.questionSuffix
  );

  // 하단 스택 공간 확보 및 안전영역 보정
  const feedbackSystemHeight = 80;
  const safeBottom = 'env(safe-area-inset-bottom)';

  // 모바일 입력 모드일 때 특별한 레이아웃
  if (isMobileDevice && isInputMode) {
    const hasQuestionParts = Boolean(
      current.questionPrefix ||
        (current.questionItems && current.questionItems.length) ||
        current.questionSuffix
    );

    // iOS: 기존 복잡한 레이아웃 + 스크롤 제어 (iPad 포함)
    if (isIOSDevice) {
      return (
        <main
          className="bg-bodyBg max-w-4xl mx-auto md:max-w-3xl lg:max-w-4xl px-2 md:px-8 py-6 md:py-6 lg:py-1 xl:py-1 2xl:py-10 rounded-xl overflow-hidden relative select-none animate-in fade-in slide-in-from-bottom-4 duration-300"
          style={{ height: '90svh' }}
          onContextMenu={e => e.preventDefault()}
        >
          <div
            className="wrapper bg-gray-150 -mt-6 lg:-mt-8 xl:-mt-8 2xl:-mt-6 absolute left-0 right-0 mx-0 rounded-xl p-3 md:p-8 select-none flex flex-col h-full transform transition-all duration-300 ease-out"
            onContextMenu={e => e.preventDefault()}
            style={{ paddingBottom: `calc(${feedbackSystemHeight + 10}px + ${safeBottom})` }}
          >
            {/* 상단 헤더 (동일한 위치 유지) */}
            <div className="flex items-center h-8 md:h-10 animate-in slide-in-from-top-2 duration-300 delay-100">
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
            <div className="mt-4 md:mt-6 lg:mt-3 xl:mt-3 2xl:mt-6 mb-3 md:mb-4 lg:mb-0 xl:mb-0 2xl:mb-4 flex-shrink-0 animate-in slide-in-from-top-4 duration-400 delay-200">
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className="bg-primaryColor h-2 rounded-full transition-all duration-500 ease-out"
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
                  {isAnswerToQuestionLike ? (
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
                  {isAnswerToQuestionLike ? (
                    <div
                      className="cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-600 px-1 rounded"
                      onClick={() => setShowAnswerHint(prev => !prev)}
                    >
                      {showAnswerHint && current.answerTranslation && (
                        <div className="absolute bottom-full left-0 mb-2 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg p-3 z-10 text-base whitespace-nowrap transition-all duration-200 ease-in-out">
                          {current.answerTranslation}
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

            <div
              className="mx-0"
              style={{
                marginTop: isMobileDevice && isInputMode ? `${dynamicMargin}px` : '0px',
              }}
            ></div>

            {/* iOS용 하단 입력 영역 */}
            <div
              className="-mx-1 px-0 pt-1 pb-2 flex-shrink-0"
              style={{
                paddingBottom: `calc(8px + ${safeBottom})`,
                transition: isIOSDevice ? 'none' : 'opacity 0.1s ease-out, transform 0.1s ease-out',
              }}
            >
              {/* 피드백 */}
              {showFeedback && (
                <div className="mb-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div
                    className={`p-4 rounded-lg ${
                      isCorrect ? 'bg-gray-300' : 'bg-red-500'
                    } text-white shadow-lg transform transition-all duration-200`}
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
                            {current.alternativeAnswers &&
                              current.alternativeAnswers.length > 0 && (
                                <div className="text-xs opacity-90 mt-1">
                                  다른 가능한 답: {current.alternativeAnswers.join(', ')}
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* iOS 모바일(iPhone)일 때: 한 줄 레이아웃 (8:2 비율), 아이패드는 기존 위아래 레이아웃 유지 */}
              {window.innerWidth < 768 ? (
                // iPhone: 한 줄에 입력필드 8, 버튼 2 비율
                <div className="flex gap-2 items-center">
                  <div className="flex-1" style={{ flexBasis: '80%' }}>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (isAnswered) {
                            handleNext();
                          } else if (userAnswer.trim()) {
                            handleSubmit();
                          }
                        }
                      }}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor/20 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
                      placeholder="답을 입력하세요"
                      disabled={isAnswered}
                      autoFocus
                    />
                  </div>
                  <div style={{ flexBasis: '20%' }}>
                    <button
                      onClick={isAnswered ? handleNext : handleSubmit}
                      disabled={!isAnswered && !userAnswer.trim()}
                      className="w-full py-3 text-lg font-bold rounded-lg shadow-lg bg-primaryColor text-white transition-all duration-200 disabled:opacity-50 hover:bg-primaryColor/90"
                    >
                      {isAnswered ? '다음' : '확인'}
                    </button>
                  </div>
                </div>
              ) : (
                // iPad: 기존 위아래 레이아웃 유지
                <>
                  {/* 입력 필드 */}
                  <div className="mb-2">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (isAnswered) {
                            handleNext();
                          } else if (userAnswer.trim()) {
                            handleSubmit();
                          }
                        }
                      }}
                      className="w-full px-4 py-3 md:py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor/20 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 transform focus:scale-[1.01]"
                      placeholder="답을 입력하세요"
                      disabled={isAnswered}
                      autoFocus
                    />
                  </div>

                  {/* 확인/다음 버튼 */}
                  <button
                    onClick={isAnswered ? handleNext : handleSubmit}
                    disabled={!isAnswered && !userAnswer.trim()}
                    className="w-full py-3 md:py-4 text-lg md:text-xl font-bold rounded-2xl shadow-lg bg-primaryColor text-white uppercase transition-all duration-200 disabled:opacity-50 hover:bg-primaryColor/90 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isAnswered ? '다음' : '확인'}
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      );
    }

    // 안드로이드: 키보드 대응 최적화된 구조 (iOS가 아닌 모바일 디바이스만)
    else {
      return (
        <main
          className="bg-bodyBg max-w-4xl mx-auto md:max-w-3xl lg:max-w-4xl px-2 md:px-8 py-6 md:py-6 lg:py-1 xl:py-1 2xl:py-10 rounded-xl overflow-hidden relative select-none"
          style={{ height: isKeyboardVisible ? `${viewportHeight}px` : '90svh' }}
          onContextMenu={e => e.preventDefault()}
        >
          {/* 상단 고정 영역 */}
          <div className="bg-gray-150 -mt-6 absolute left-0 right-0 mx-0 rounded-t-xl p-3 z-20">
            {/* 헤더 */}
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

            {/* 진행 상태 */}
            <div className="mt-4 md:mt-6 lg:mt-3 xl:mt-3 2xl:mt-6 mb-3 md:mb-4 lg:mb-0 xl:mb-0 2xl:mb-4 flex-shrink-0">
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className="bg-primaryColor h-2 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${(currentIndex / totalQuestions) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="mt-1 md:mt-2 text-center text-xs md:text-sm text-gray-600">
                {progressText}
              </div>
            </div>
          </div>

          {/* 중앙 스크롤 영역 */}
          <div
            className="bg-gray-150 absolute left-0 right-0 mx-0 px-3 overflow-y-auto"
            style={{
              top: '80px', // 헤더 + 진행바 높이
              bottom: isKeyboardVisible && window.innerWidth < 576 ? '80px' : '220px', // 모바일+키보드일 때 더 줄임
              paddingTop: '20px',
              paddingBottom: '20px',
            }}
          >
            <div className="question-wrapper flex flex-wrap w-full gap-2 text-base md:text-lg">
              {/* 질문 */}
              <div className="flex w-full items-center gap-2 mt-6 md:mt-8 lg:mt-3 xl:mt-3 2xl:mt-8 relative">
                <div className="text-xl md:text-2xl font-extrabold text-primaryColor w-6 md:w-8">
                  Q:
                </div>
                <div className="text-xl md:text-2xl font-medium relative">
                  {isAnswerToQuestionLike ? (
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
                  {isAnswerToQuestionLike ? (
                    <div
                      className="cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-600 px-1 rounded"
                      onClick={() => setShowAnswerHint(prev => !prev)}
                    >
                      {showAnswerHint && current.answerTranslation && (
                        <div className="absolute bottom-full left-0 mb-2 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg p-3 z-10 text-base whitespace-nowrap transition-all duration-200 ease-in-out">
                          {current.answerTranslation}
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
          </div>

          {/* 하단 고정 영역 - 키보드 유무에 따른 동적 레이아웃 */}
          <div className="absolute inset-x-0 bg-gray-150 z-10" style={{ bottom: '0px' }}>
            <div className="px-3 pt-4 pb-12">
              {/* 피드백 */}
              {showFeedback && (
                <div className="mb-4">
                  <div
                    className={`p-4 rounded-lg ${isCorrect ? 'bg-gray-300' : 'bg-red-500'} text-white shadow-lg`}
                  >
                    {isCorrect ? (
                      <div className="flex items-center">
                        <div className="bg-primaryColor rounded-full p-2 mr-3">
                          <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
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
                              <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
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
                            {current.alternativeAnswers &&
                              current.alternativeAnswers.length > 0 && (
                                <div className="text-xs opacity-90 mt-1">
                                  다른 가능한 답: {current.alternativeAnswers.join(', ')}
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 입력 필드와 버튼 - 키보드 유무와 화면 크기에 따라 레이아웃 변경 */}
              {isKeyboardVisible && window.innerWidth < 576 ? (
                // 키보드가 있고 모바일 사이즈(sm 미만)일 때: 한 줄에 8:2 비율
                <div className="flex gap-2 items-center">
                  <div className="flex-1" style={{ flexBasis: '80%' }}>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (isAnswered) {
                            handleNext();
                          } else if (userAnswer.trim()) {
                            handleSubmit();
                          }
                        }
                      }}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor/20 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
                      placeholder="답을 입력하세요"
                      disabled={isAnswered}
                      autoFocus
                    />
                  </div>
                  <div style={{ flexBasis: '20%' }}>
                    <button
                      onClick={isAnswered ? handleNext : handleSubmit}
                      disabled={!isAnswered && !userAnswer.trim()}
                      className="w-full py-3 md:py-4 text-lg md:text-xl font-bold rounded-lg shadow-lg bg-primaryColor text-white transition-all duration-200 disabled:opacity-50 hover:bg-primaryColor/90"
                    >
                      {isAnswered ? '다음' : '확인'}
                    </button>
                  </div>
                </div>
              ) : (
                // 키보드가 없거나 태블릿 사이즈(sm 이상)일 때: 기존 위아래 레이아웃
                <>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (isAnswered) {
                            handleNext();
                          } else if (userAnswer.trim()) {
                            handleSubmit();
                          }
                        }
                      }}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor/20 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
                      placeholder="답을 입력하세요"
                      disabled={isAnswered}
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={isAnswered ? handleNext : handleSubmit}
                    disabled={!isAnswered && !userAnswer.trim()}
                    className="w-full py-3 md:py-4 text-lg md:text-xl font-bold rounded-2xl shadow-lg bg-primaryColor text-white uppercase transition-all duration-200 disabled:opacity-50 hover:bg-primaryColor/90"
                  >
                    {isAnswered ? '다음' : '확인'}
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      );
    }
  }

  // 데스크톱 레이아웃
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
              {isAnswerToQuestionLike ? (
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
              {isAnswerToQuestionLike ? (
                <div
                  className="cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-600 px-1 rounded"
                  onClick={() => setShowAnswerHint(prev => !prev)}
                >
                  {showAnswerHint && current.answerTranslation && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg p-3 z-10 text-base whitespace-nowrap transition-all duration-200 ease-in-out">
                      {current.answerTranslation}
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
      </div>

      {/* 하단 고정 영역 (피드백 + 텍스트 필드 + 버튼) */}
      {!isFinished && (
        <div
          className="absolute inset-x-0 z-10 bg-gray-150"
          style={{ bottom: `calc(1px + ${safeBottom})` }}
        >
          <div
            className="w-full max-w-4xl mx-auto px-2 md:px-8"
            style={{ paddingBottom: `calc(12px + ${safeBottom})` }}
          >
            {/* 피드백 (정답: 회색, 오답: 빨간색) */}
            {showFeedback && (
              <div className="mb-4">
                <div
                  className={`p-4 rounded-lg ${
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
                      {/* 헤더 */}
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

                      {/* 액션 버튼들 */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setIsAnswered(false);
                            setUserAnswer('');
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

                      {/* 정답 표시 (토글) */}
                      {showTranslationHint && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                          <div className="text-sm font-medium mb-1">정답</div>
                          <div className="text-lg font-semibold">{current.answer}</div>
                          {current.alternativeAnswers && current.alternativeAnswers.length > 0 && (
                            <div className="text-xs opacity-90 mt-1">
                              다른 가능한 답: {current.alternativeAnswers.join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 입력 필드 */}
            <div className="mb-4">
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    if (isAnswered) {
                      handleNext();
                    } else if (userAnswer.trim()) {
                      handleSubmit();
                    }
                  }
                }}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="답을 입력하세요"
                disabled={isAnswered}
              />
            </div>

            {/* 확인/다음 버튼 */}
            <button
              onClick={isAnswered ? handleNext : handleSubmit}
              disabled={!isAnswered && !userAnswer.trim()}
              className="w-full py-3 md:py-4 text-lg md:text-xl font-bold rounded-2xl shadow-lg bg-primaryColor text-white uppercase transition-all disabled:opacity-50"
            >
              {isAnswered ? '다음' : '확인'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default FillInTheBlankReview;
