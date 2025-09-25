'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { Item, DialogueQuestion } from '@/types/quiz';
import Link from 'next/link';
import Option from '../SentenceDragAndDrop/component/Option';

interface DraggableOptionProps {
  item: Item;
  onItemClick: (item: Item) => void;
}

const DraggableOption: React.FC<DraggableOptionProps> = ({ item, onItemClick }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: item,
  });

  const handleClick = (e: React.MouseEvent) => {
    // 드래그 중에는 클릭 이벤트를 무시
    if (!isDragging) {
      onItemClick(item);
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`cursor-pointer ${isDragging ? 'opacity-50' : ''}`}
    >
      <Option item={item} />
    </div>
  );
};

interface DroppableAreaProps {
  id: string;
  children: React.ReactNode;
  className: string;
  style?: React.CSSProperties;
}

const DroppableArea: React.FC<DroppableAreaProps> = ({ id, children, className, style }) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div ref={setNodeRef} className={className} style={style}>
      {children}
    </div>
  );
};

interface DialogueDragAndDropProps {
  questions: DialogueQuestion[];
  title: string;
}

const DialogueDragAndDrop: React.FC<DialogueDragAndDropProps> = ({ questions, title }) => {
  // 문제를 랜덤하게 섞는 함수
  const shuffleQuestions = (questionsToShuffle: DialogueQuestion[]) => {
    const shuffled = [...questionsToShuffle];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 문제를 섞어서 상태로 관리
  const [shuffledQuestions, setShuffledQuestions] = useState<DialogueQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showQuestionHint, setShowQuestionHint] = useState(false);
  const [showAnswerHint, setShowAnswerHint] = useState(false);
  const [showTranslationHint, setShowTranslationHint] = useState(false);

  // 세션 관리
  const [showIntermediateResult, setShowIntermediateResult] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);

  const QUESTIONS_PER_SESSION = 10;

  // 모바일 및 태블릿에서 스크롤 방지
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // 터치 이벤트 방지
    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    document.addEventListener('touchmove', preventTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener('touchmove', preventTouchMove);
    };
  }, [questions]);

  // 컴포넌트가 마운트될 때와 questions prop이 변경될 때 문제를 섞음
  useEffect(() => {
    setShuffledQuestions(shuffleQuestions(questions));
    setCurrentQuestionIndex(0);
    setIsCorrect(false);
    setShowFeedback(false);
    setShowQuestionHint(false);
    setShowAnswerHint(false);
    setShowTranslationHint(false);
    setScore(0);
    setIsFinished(false);
    setShowIntermediateResult(false);
    setSessionScore(0);
    setTotalQuestionsAnswered(0);
  }, [questions]);

  // 아이템을 랜덤으로 섞는 함수
  const shuffleArray = (array: Item[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [questionItems, setQuestionItems] = useState<Item[]>([]);
  const [answerItems, setAnswerItems] = useState<Item[]>([]);
  const [questionDragItems, setQuestionDragItems] = useState<Item[]>([]);
  const [answerDragItems, setAnswerDragItems] = useState<Item[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [winReady, setwinReady] = useState(false);

  // 문제가 바뀔 때마다 아이템을 랜덤으로 섞기
  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      const currentQuestion = shuffledQuestions[currentQuestionIndex];

      // questionItems가 있는 경우 (Q 부분 드래그 앤 드롭)
      if (currentQuestion.questionItems) {
        const shuffledQuestionItems = shuffleArray(currentQuestion.questionItems);
        setQuestionDragItems(shuffledQuestionItems);
        setQuestionItems(currentQuestion.items || []);
        setAnswerItems([]);
        setAnswerDragItems([]);
      }
      // answerItems가 있는 경우 (A 부분 드래그 앤 드롭)
      else if (currentQuestion.answerItems) {
        const shuffledAnswerItems = shuffleArray(currentQuestion.answerItems);
        setAnswerDragItems(shuffledAnswerItems);
        setQuestionItems([]);
        setAnswerItems([]);
        setQuestionDragItems([]);
      }
      // 일반적인 경우
      else {
        const shuffledItems = shuffleArray(currentQuestion.items);
        setQuestionItems(shuffledItems);
        setAnswerItems([]);
        setQuestionDragItems([]);
        setAnswerDragItems([]);
      }
    }
  }, [currentQuestionIndex, shuffledQuestions]);

  useEffect(() => {
    setwinReady(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setIsDragging(false);

    const { active, over } = event;

    if (!over) return;

    // 드래그한 아이템 찾기
    const draggedItem =
      questionItems.find(item => item.id === active.id) ||
      answerItems.find(item => item.id === active.id) ||
      questionDragItems.find(item => item.id === active.id) ||
      answerDragItems.find(item => item.id === active.id);

    if (!draggedItem) return;

    // 드래그한 아이템이 어느 영역에 있는지 확인
    const isFromQuestion = questionItems.some(item => item.id === active.id);
    const isFromAnswer = answerItems.some(item => item.id === active.id);
    const isFromQuestionDrag = questionDragItems.some(item => item.id === active.id);
    const isFromAnswerDrag = answerDragItems.some(item => item.id === active.id);

    // 드롭 대상 영역 확인
    const isToAnswer = over.id === 'answer-area';
    const isToQuestion = over.id === 'question-area';
    const isToQuestionAnswer = over.id === 'question-answer-area';

    // 드래그 앤 드롭 처리
    if (isFromQuestionDrag && isToAnswer) {
      // Q 부분: questionDragItems → answerItems
      setQuestionDragItems(questionDragItems.filter(item => item.id !== active.id));
      setAnswerItems([...answerItems, draggedItem]);
    } else if (isFromAnswerDrag && isToAnswer) {
      // A 부분: answerDragItems → answerItems
      setAnswerDragItems(answerDragItems.filter(item => item.id !== active.id));
      setAnswerItems([...answerItems, draggedItem]);
    } else if (isFromAnswer && isToQuestion && questionDragItems.length > 0) {
      // Q 부분 복귀: answerItems → questionDragItems
      setAnswerItems(answerItems.filter(item => item.id !== active.id));
      setQuestionDragItems([...questionDragItems, draggedItem]);
    } else if (isFromAnswer && isToQuestion && answerDragItems.length > 0) {
      // A 부분 복귀: answerItems → answerDragItems
      setAnswerItems(answerItems.filter(item => item.id !== active.id));
      setAnswerDragItems([...answerDragItems, draggedItem]);
    } else if (isFromQuestion && isToAnswer) {
      // questionItems에서 answerItems로 이동
      setQuestionItems(questionItems.filter(item => item.id !== active.id));
      setAnswerItems([...answerItems, draggedItem]);
    } else if (isFromAnswer && isToQuestion) {
      // answerItems에서 questionItems로 이동
      setAnswerItems(answerItems.filter(item => item.id !== active.id));
      setQuestionItems([...questionItems, draggedItem]);
    } else if (active.id !== over.id) {
      // 같은 영역 내에서의 순서 변경
      if (isFromQuestion) {
        const oldIndex = questionItems.findIndex(item => item.id === active.id);
        const newIndex = questionItems.findIndex(item => item.id === over.id);

        const newItems = [...questionItems];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);
        setQuestionItems(newItems);
      } else if (isFromAnswer) {
        const oldIndex = answerItems.findIndex(item => item.id === active.id);
        const newIndex = answerItems.findIndex(item => item.id === over.id);

        const newItems = [...answerItems];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);
        setAnswerItems(newItems);
      }
    }
  };

  const handleItemClick = (item: Item) => {
    if (isDragging) return;

    const isInQuestionItems = questionItems.some(i => i.id === item.id);
    const isInAnswerItems = answerItems.some(i => i.id === item.id);
    const isInQuestionDragItems = questionDragItems.some(i => i.id === item.id);
    const isInAnswerDragItems = answerDragItems.some(i => i.id === item.id);

    // 부분적 드래그 앤 드롭 기능 처리
    if (isInQuestionDragItems) {
      // Q 부분 드래그 앤 드롭: questionDragItems → answerItems
      setQuestionDragItems(questionDragItems.filter(i => i.id !== item.id));
      setAnswerItems([...answerItems, item]);
    } else if (isInAnswerDragItems) {
      // A 부분 드래그 앤 드롭: answerDragItems → answerItems
      setAnswerDragItems(answerDragItems.filter(i => i.id !== item.id));
      setAnswerItems([...answerItems, item]);
    } else if (isInAnswerItems && currentQuestion.questionItems) {
      // Q 부분 드래그 앤 드롭 복귀: answerItems → questionDragItems
      setAnswerItems(answerItems.filter(i => i.id !== item.id));
      setQuestionDragItems([...questionDragItems, item]);
    } else if (isInAnswerItems && currentQuestion.answerItems) {
      // A 부분 드래그 앤 드롭 복귀: answerItems → answerDragItems
      setAnswerItems(answerItems.filter(i => i.id !== item.id));
      setAnswerDragItems([...answerDragItems, item]);
    }
    // 기존 로직
    else if (isInQuestionItems) {
      setQuestionItems(questionItems.filter(i => i.id !== item.id));
      setAnswerItems([...answerItems, item]);
    } else if (isInAnswerItems) {
      setAnswerItems(answerItems.filter(i => i.id !== item.id));
      setQuestionItems([...questionItems, item]);
    }
  };

  const handleSubmit = () => {
    if (!shuffledQuestions.length) return;

    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    if (isCorrect || showFeedback) {
      // Next 버튼이 눌렸을 때 (정답이거나 틀렸지만 피드백이 표시된 상태)
      const nextIndex = currentQuestionIndex + 1;
      const newTotalAnswered = totalQuestionsAnswered + 1;

      // 10문제마다 중간 결과 표시 (마지막 문제가 아닌 경우)
      if (newTotalAnswered % QUESTIONS_PER_SESSION === 0 && nextIndex < shuffledQuestions.length) {
        setTotalQuestionsAnswered(newTotalAnswered);
        setShowIntermediateResult(true);
        setShowFeedback(false);
        return;
      }

      if (nextIndex < shuffledQuestions.length) {
        setCurrentQuestionIndex(nextIndex);
        setTotalQuestionsAnswered(newTotalAnswered);
        setAnswerItems([]);
        setAnswerDragItems([]);
        setIsCorrect(false);
        setShowFeedback(false);
        setShowQuestionHint(false);
        setShowAnswerHint(false);
        setShowTranslationHint(false);
      } else {
        setTotalQuestionsAnswered(newTotalAnswered);
        setIsFinished(true);
        setShowFeedback(false);
      }
    } else {
      // Check 버튼이 눌렸을 때
      let userAnswer = '';
      let correctAnswer = '';
      let isCorrect = false;
      let isAlternativeCorrect = false;

      // questionItems가 있는 경우 (Q 부분 드래그 앤 드롭)
      if (currentQuestion.questionItems) {
        userAnswer = answerItems.reduce((result, item, index) => {
          const shouldAddSpace = !item.combineWithNext && index !== answerItems.length - 1;
          return result + item.content + (shouldAddSpace ? ' ' : '');
        }, '');

        correctAnswer =
          currentQuestion.questionItems?.reduce((result, item, index) => {
            const shouldAddSpace =
              !item.combineWithNext && index !== (currentQuestion.questionItems?.length || 0) - 1;
            return result + item.content + (shouldAddSpace ? ' ' : '');
          }, '') || '';

        isCorrect = userAnswer === correctAnswer;
      }
      // answerItems가 있는 경우 (A 부분 드래그 앤 드롭)
      else if (currentQuestion.answerItems) {
        userAnswer = answerItems.reduce((result, item, index) => {
          const shouldAddSpace = !item.combineWithNext && index !== answerItems.length - 1;
          return result + item.content + (shouldAddSpace ? ' ' : '');
        }, '');

        correctAnswer =
          currentQuestion.answerItems?.reduce((result, item, index) => {
            const shouldAddSpace =
              !item.combineWithNext && index !== (currentQuestion.answerItems?.length || 0) - 1;
            return result + item.content + (shouldAddSpace ? ' ' : '');
          }, '') || '';

        isCorrect = userAnswer === correctAnswer;
      } else {
        // 일반적인 경우 (answerItems)
        userAnswer = answerItems.reduce((result, item, index) => {
          const shouldAddSpace = !item.combineWithNext && index !== answerItems.length - 1;
          return result + item.content + (shouldAddSpace ? ' ' : '');
        }, '');

        // 정답 확인 (mode에 따라 다른 비교)
        correctAnswer =
          currentQuestion.mode === 'answer-to-question'
            ? currentQuestion.question
            : currentQuestion.answer;

        isCorrect = userAnswer === correctAnswer;

        // alternativeAnswers 정답 확인
        isAlternativeCorrect = Boolean(
          currentQuestion.alternativeAnswers &&
            currentQuestion.alternativeAnswers.includes(userAnswer)
        );
      }

      if (isCorrect || isAlternativeCorrect) {
        setIsCorrect(true);
        setScore(prev => prev + 1);
        setSessionScore(prev => prev + 1);
      } else {
        // 상태 초기화 (틀렸을 때는 다시 시도할 수 있게)
        if (currentQuestion.questionItems) {
          setAnswerItems([]);
          const shuffledQuestionItems = shuffleArray(currentQuestion.questionItems);
          setQuestionDragItems(shuffledQuestionItems);
        } else if (currentQuestion.answerItems) {
          setAnswerItems([]);
          const shuffledAnswerItems = shuffleArray(currentQuestion.answerItems);
          setAnswerDragItems(shuffledAnswerItems);
        } else {
          setAnswerItems([]);
          const shuffledItems = shuffleArray(currentQuestion.items);
          setQuestionItems(shuffledItems);
        }

        setShowQuestionHint(false);
        setShowAnswerHint(false);
        setShowTranslationHint(false);
      }
      setShowFeedback(true);
    }
  };

  // 현재 문제가 없으면 로딩 표시
  if (shuffledQuestions.length === 0) {
    return <div className="text-center py-10">Loading questions...</div>;
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const isAnswerToQuestionLike = Boolean(
    currentQuestion.mode === 'answer-to-question' ||
      currentQuestion.questionPrefix ||
      (currentQuestion.questionItems && currentQuestion.questionItems.length > 0) ||
      currentQuestion.questionSuffix
  );
  const activeItem = [
    ...questionItems,
    ...answerItems,
    ...questionDragItems,
    ...answerDragItems,
  ].find(item => item.id === activeId);

  const handleRestart = () => {
    setShuffledQuestions(shuffleQuestions(questions));
    setCurrentQuestionIndex(0);
    setIsCorrect(false);
    setShowFeedback(false);
    setShowQuestionHint(false);
    setShowAnswerHint(false);
    setShowTranslationHint(false);
    setScore(0);
    setIsFinished(false);
    setShowIntermediateResult(false);
    setSessionScore(0);
    setTotalQuestionsAnswered(0);
    // 아이템들도 초기화
    setAnswerItems([]);
    setQuestionDragItems([]);
    setAnswerDragItems([]);
  };

  const handleContinueSession = () => {
    setShowIntermediateResult(false);
    setSessionScore(0);
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    setAnswerItems([]);
    setAnswerDragItems([]);
    setIsCorrect(false);
    setShowFeedback(false);
    setShowQuestionHint(false);
    setShowAnswerHint(false);
    setShowTranslationHint(false);
  };

  const isLast = currentQuestionIndex === shuffledQuestions.length - 1;
  const currentSessionNumber = Math.floor(totalQuestionsAnswered / QUESTIONS_PER_SESSION);
  const remainingQuestions = shuffledQuestions.length - totalQuestionsAnswered;

  // 통합 결과 화면 (중간 결과 + 최종 결과)
  if (showIntermediateResult || isFinished) {
    const isComplete = totalQuestionsAnswered >= shuffledQuestions.length;
    const titleText = showIntermediateResult
      ? `세션 ${currentSessionNumber} 완료!`
      : '퀴즈를 모두 완료했어요!';
    return (
      <main
        className="bg-bodyBg max-w-4xl mx-auto md:max-w-3xl lg:max-w-4xl px-4 md:px-8 py-6 md:py-10 rounded-xl h-[85vh] overflow-y-auto relative select-none"
        onContextMenu={e => e.preventDefault()}
      >
        <div className="wrapper bg-gray-150 -mt-6 absolute left-0 right-0 mx-0 rounded-xl p-4 md:p-8 pb-32 select-none">
          <div className="flex items-center h-10">
            <h2 className="flex-1 text-2xl font-bold text-center">{title}</h2>
            <div className="flex justify-end">
              <Link
                href="/quiz/DialogueDragAndDrop"
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
                  {score} / {totalQuestionsAnswered || shuffledQuestions.length}
                </div>
                <div className="text-sm text-gray-600">
                  전체 정답률:{' '}
                  {Math.round(
                    (score / Math.max(1, totalQuestionsAnswered || shuffledQuestions.length)) * 100
                  )}
                  %
                </div>

                {/* 진행 상황 */}
                <div className="text-sm text-gray-700 space-y-1">
                  <div>
                    진행률: {totalQuestionsAnswered} / {shuffledQuestions.length}
                  </div>
                  {!isComplete && <div>남은 문제: {remainingQuestions}개</div>}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-md">
              {!isComplete ? (
                // 아직 완료하지 않은 경우
                <button
                  onClick={handleContinueSession}
                  className="w-full px-5 py-4 rounded-xl bg-primaryColor text-white font-semibold shadow text-lg"
                >
                  계속하기
                </button>
              ) : (
                // 모두 완료한 경우
                <button
                  onClick={handleRestart}
                  className="w-full px-5 py-4 rounded-xl bg-primaryColor text-white font-semibold shadow text-lg"
                >
                  다시 풀기
                </button>
              )}

              <Link
                href="/quiz/DialogueDragAndDrop"
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

  // 레이아웃 상수 (뷰포트 변화에 흔들리지 않도록 고정)
  const feedbackSystemHeight = 80; // 하단 스택 여유 공간
  const dragDropHeight = 160; // 하단 선택 단어 영역 높이 기준
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
              href="/quiz/DialogueDragAndDrop"
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
                width: `${(totalQuestionsAnswered / Math.max(1, shuffledQuestions.length)) * 100}%`,
              }}
            ></div>
          </div>
          <div className="mt-1 md:mt-2 text-center text-xs md:text-sm text-gray-600">
            {totalQuestionsAnswered} / {shuffledQuestions.length}
          </div>
        </div>

        <div className="question-wrapper flex flex-wrap w-full gap-2 text-base md:text-lg flex-shrink-0">
          {/* 질문 부분 */}
          <div className="flex w-full items-center gap-2 mt-6 md:mt-8 lg:mt-3 xl:mt-3 2xl:mt-8 relative">
            <div className="text-xl md:text-2xl font-extrabold text-primaryColor w-6 md:w-8">
              Q:
            </div>
            <div className="text-xl md:text-2xl font-medium relative">
              {isAnswerToQuestionLike ? (
                // answer-to-question 모드일 때
                currentQuestion.questionPrefix || currentQuestion.questionItems ? (
                  // 부분적 드래그 앤 드롭 기능이 있는 경우
                  <div className="flex items-center gap-2">
                    {currentQuestion.questionPrefix && (
                      <span
                        className="cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-600 px-1 rounded"
                        onClick={() => setShowQuestionHint(!showQuestionHint)}
                      >
                        {currentQuestion.questionPrefix}
                      </span>
                    )}
                    {currentQuestion.questionItems && (
                      <span
                        className="relative inline-block align-baseline mb-2 cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-600 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:border-b-2 after:border-black"
                        onClick={() => setShowTranslationHint(!showTranslationHint)}
                      >
                        {showTranslationHint ? (
                          <span className="inline-block bg-white/95 backdrop-blur-sm shadow-lg rounded-md px-3 py-2 text-lg whitespace-normal break-words">
                            {currentQuestion.questionItemsTranslation ||
                              currentQuestion.questionItems.map(item => item.content).join('')}
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-2 opacity-0 select-none text-lg whitespace-normal break-words">
                            {currentQuestion.questionItemsTranslation ||
                              currentQuestion.questionItems.map(item => item.content).join('')}
                          </span>
                        )}
                      </span>
                    )}
                    {currentQuestion.questionSuffix && (
                      <span
                        className="cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-600 px-1 rounded"
                        onClick={() => setShowQuestionHint(!showQuestionHint)}
                      >
                        {currentQuestion.questionSuffix}
                      </span>
                    )}
                    {showQuestionHint && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg p-3 z-10 text-base whitespace-nowrap transition-all duration-200 ease-in-out">
                        {currentQuestion.questionTranslation}
                      </div>
                    )}
                  </div>
                ) : (
                  // 일반적인 빈 칸 표시
                  <span
                    className="relative inline-block align-baseline mb-2 cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-600 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:border-b-2 after:border-black"
                    onClick={() => setShowQuestionHint(!showQuestionHint)}
                  >
                    {showQuestionHint ? (
                      <span className="inline-block bg-white/95 backdrop-blur-sm shadow-lg rounded-md px-3 py-2 text-lg whitespace-normal break-words">
                        {currentQuestion.questionTranslation}
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-2 opacity-0 select-none text-lg whitespace-normal break-words">
                        {currentQuestion.questionTranslation}
                      </span>
                    )}
                  </span>
                )
              ) : (
                // 일반 모드일 때는 question 표시
                <div
                  className="cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-600 px-1 rounded"
                  onClick={() => setShowQuestionHint(!showQuestionHint)}
                >
                  {showQuestionHint && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg p-3 z-10 text-base whitespace-nowrap transition-all duration-200 ease-in-out">
                      {currentQuestion.questionTranslation}
                    </div>
                  )}
                  {currentQuestion.question}
                </div>
              )}
            </div>
          </div>

          {/* 답변 부분 */}
          <div className="flex w/full items-center gap-2 mt-3 lg:mt-2 xl:mt-2 2xl:mt-3 relative">
            <div className="text-xl md:text-2xl font-extrabold text-primaryColor w-6 md:w-8">
              A:
            </div>
            <div className="text-xl md:text-2xl font-medium relative">
              {isAnswerToQuestionLike ? (
                // answer-to-question 모드일 때는 answer 표시
                <div
                  className="cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-600 px-1 rounded"
                  onClick={() => setShowAnswerHint(!showAnswerHint)}
                >
                  {showAnswerHint && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg p-3 z-10 text-base whitespace-nowrap transition-all duration-200 ease-in-out">
                      {currentQuestion.answerTranslation}
                    </div>
                  )}
                  {currentQuestion.answer}
                </div>
              ) : // 일반 모드일 때
              currentQuestion.answerPrefix || currentQuestion.answerItems ? (
                // A 부분에서 부분적 드래그 앤 드롭 기능이 있는 경우
                <div className="flex items-center gap-2">
                  {currentQuestion.answerPrefix && (
                    <span
                      className="cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-600 px-1 rounded"
                      onClick={() => setShowAnswerHint(!showAnswerHint)}
                    >
                      {currentQuestion.answerPrefix}
                    </span>
                  )}
                  {currentQuestion.answerItems && (
                    <span
                      className="relative inline-block align-baseline mb-2 cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-600 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:border-b-2 after:border-black"
                      onClick={() => setShowTranslationHint(!showTranslationHint)}
                    >
                      {showTranslationHint ? (
                        <span className="inline-block bg-white/95 backdrop-blur-sm shadow-lg rounded-md px-3 py-2 text-lg whitespace-normal break-words">
                          {currentQuestion.answerItemsTranslation ||
                            currentQuestion.answerItems.map(item => item.content).join('')}
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-2 opacity-0 select-none text-lg whitespace-normal break-words">
                          {currentQuestion.answerItemsTranslation ||
                            currentQuestion.answerItems.map(item => item.content).join('')}
                        </span>
                      )}
                    </span>
                  )}
                  {currentQuestion.answerSuffix && (
                    <span
                      className="cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-600 px-1 rounded"
                      onClick={() => setShowAnswerHint(!showAnswerHint)}
                    >
                      {currentQuestion.answerSuffix}
                    </span>
                  )}
                  {showAnswerHint && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg p-3 z-10 text-base whitespace-nowrap transition-all duration-200 ease-in-out">
                      {currentQuestion.answerTranslation}
                    </div>
                  )}
                </div>
              ) : (
                // 일반적인 빈 칸 표시
                <span
                  className="relative inline-block align-baseline mb-2 cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-600 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:border-b-2 after:border-black"
                  onClick={() => setShowAnswerHint(!showAnswerHint)}
                >
                  {showAnswerHint ? (
                    <span className="inline-block bg-white/95 backdrop-blur-sm shadow-lg rounded-md px-3 py-2 text-lg whitespace-normal break-words">
                      {currentQuestion.answerTranslation}
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-2 opacity-0 select-none text-lg whitespace-normal break-words">
                      {currentQuestion.answerTranslation}
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="drag-group flex flex-col">
            <div
              className={`answer-wrapper mt-6 md:mt-8 lg:mt-6 xl:mt-6 2xl:mt-8 relative flex-none min-h-0`}
              style={{ height: 130 }}
            >
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <hr className="border-gray-300 mt-[48px]" />
              </div>
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <hr className="border-gray-300 mt-[110px]" />
              </div>
              {winReady && (
                <DroppableArea
                  id="answer-area"
                  className="answers flex flex-wrap gap-2 w-full relative z-10"
                  style={{
                    minHeight: 32,
                  }}
                >
                  {answerItems.map((item, index) => {
                    const nextItem = index < answerItems.length - 1 ? answerItems[index + 1] : null;
                    const isParticleNext =
                      nextItem &&
                      (nextItem.content === '가' ||
                        nextItem.content === '이' ||
                        nextItem.content === '를' ||
                        nextItem.content === '을');
                    return (
                      <div
                        key={item.id}
                        className={`inline-block ${
                          (!item.combineWithNext || item.ignoreSpaceRule) && !isParticleNext
                            ? 'mr-1'
                            : '-mr-1'
                        }`}
                      >
                        <DraggableOption item={item} onItemClick={handleItemClick} />
                      </div>
                    );
                  })}
                </DroppableArea>
              )}
            </div>
            {winReady && (
              <>
                {/* questionDragItems가 있는 경우 (Q 부분 드래그 앤 드롭) */}
                {questionDragItems.length > 0 && (
                  <DroppableArea
                    id="question-area"
                    className="Question option-wrapper mt-1 md:mt-2 flex flex-wrap items-start gap-2 overflow-y-scroll xl:overflow-y-auto 2xl:overflow-y-auto"
                    style={{ height: Math.max(100, dragDropHeight) }}
                  >
                    {questionDragItems.map(item => (
                      <DraggableOption key={item.id} item={item} onItemClick={handleItemClick} />
                    ))}
                  </DroppableArea>
                )}

                {/* answerDragItems가 있는 경우 (A 부분 드래그 앤 드롭) */}
                {answerDragItems.length > 0 && (
                  <DroppableArea
                    id="question-area"
                    className="Question option-wrapper mt-1 md:mt-2 flex flex-wrap items-start gap-2 overflow-y-scroll xl:overflow-y-auto 2xl:overflow-y-auto"
                    style={{ height: Math.max(100, dragDropHeight) }}
                  >
                    {answerDragItems.map(item => (
                      <DraggableOption key={item.id} item={item} onItemClick={handleItemClick} />
                    ))}
                  </DroppableArea>
                )}

                {/* 일반적인 경우 */}
                {questionItems.length > 0 &&
                  questionDragItems.length === 0 &&
                  answerDragItems.length === 0 && (
                    <DroppableArea
                      id="question-area"
                      className="Question option-wrapper mt-1 md:mt-2 flex flex-wrap items-start gap-2 overflow-y-scroll xl:overflow-y-auto 2xl:overflow-y-auto"
                      style={{ height: Math.max(100, dragDropHeight) }}
                    >
                      {questionItems.map(item => (
                        <DraggableOption key={item.id} item={item} onItemClick={handleItemClick} />
                      ))}
                    </DroppableArea>
                  )}

                {/* 모두 비었을 때도 높이 유지 */}
                {questionItems.length === 0 &&
                  questionDragItems.length === 0 &&
                  answerDragItems.length === 0 && (
                    <DroppableArea
                      id="question-area"
                      className="Question option-wrapper mt-1 md:mt-2 flex flex-wrap items-start gap-2 overflow-y-scroll xl:overflow-y-auto 2xl:overflow-y-auto"
                      style={{ height: Math.max(100, dragDropHeight) }}
                    >
                      <></>
                    </DroppableArea>
                  )}
              </>
            )}
          </div>
          <DragOverlay>{activeId ? <Option item={activeItem!} /> : null}</DragOverlay>
        </DndContext>
      </div>

      {/* 하단 고정 래퍼: 피드백 + 버튼을 한 컨테이너에 스택 */}
      {!isFinished && !showIntermediateResult && (
        <div
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
                        onClick={() => setShowFeedback(false)}
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
                        <div className="text-lg font-semibold">
                          {currentQuestion.mode === 'answer-to-question'
                            ? currentQuestion.question
                            : currentQuestion.answer}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleSubmit}
              className={`w-full py-3 md:py-4 text-lg md:text-xl font-bold rounded-2xl shadow-lg bg-primaryColor text-white uppercase transition-all disabled:opacity-50`}
              disabled={!isCorrect && !showFeedback && answerItems.length === 0}
            >
              {isCorrect ? (isLast ? '완료' : '다음') : showFeedback ? '다음' : '확인'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default DialogueDragAndDrop;
