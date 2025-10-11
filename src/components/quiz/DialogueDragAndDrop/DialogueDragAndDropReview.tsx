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
import { useRouter } from 'next/navigation';
import Option from '../SentenceDragAndDrop/component/Option';
import { useQuizMutation } from '@/hooks/useQuizMutation';

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

interface DialogueDragAndDropReviewProps {
  questions: DialogueQuestion[];
  title?: string;
  grammarName: string;
  topic: string;
}

const DialogueDragAndDropReview: React.FC<DialogueDragAndDropReviewProps> = ({
  questions,
  title,
  grammarName,
  topic,
}) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showQuestionHint, setShowQuestionHint] = useState(false);
  const [showAnswerHint, setShowAnswerHint] = useState(false);
  const [showTranslationHint, setShowTranslationHint] = useState(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const totalQuestions = questions.length;

  // 퀴즈 저장 mutation
  const quizMutation = useQuizMutation();

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

  // 모바일 및 태블릿에서 스크롤 방지
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    document.addEventListener('touchmove', preventTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener('touchmove', preventTouchMove);
    };
  }, [questions]);

  // 문제가 바뀔 때마다 아이템을 랜덤으로 섞기
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentIndex];

      if (currentQuestion.questionItems) {
        const shuffledQuestionItems = shuffleArray(currentQuestion.questionItems);
        setQuestionDragItems(shuffledQuestionItems);
        setQuestionItems(currentQuestion.items || []);
        setAnswerItems([]);
        setAnswerDragItems([]);
      } else if (currentQuestion.answerItems) {
        const shuffledAnswerItems = shuffleArray(currentQuestion.answerItems);
        setAnswerDragItems(shuffledAnswerItems);
        setQuestionItems([]);
        setAnswerItems([]);
        setQuestionDragItems([]);
      } else {
        const shuffledItems = shuffleArray(currentQuestion.items);
        setQuestionItems(shuffledItems);
        setAnswerItems([]);
        setQuestionDragItems([]);
        setAnswerDragItems([]);
      }
    }
  }, [currentIndex, questions]);

  useEffect(() => {
    setwinReady(true);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    setIsCorrect(false);
    setShowFeedback(false);
    setShowQuestionHint(false);
    setShowAnswerHint(false);
    setShowTranslationHint(false);
    setIsFinished(false);
    setScore(0);
  }, [questions]);

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

    const draggedItem =
      questionItems.find(item => item.id === active.id) ||
      answerItems.find(item => item.id === active.id) ||
      questionDragItems.find(item => item.id === active.id) ||
      answerDragItems.find(item => item.id === active.id);

    if (!draggedItem) return;

    const isFromQuestion = questionItems.some(item => item.id === active.id);
    const isFromAnswer = answerItems.some(item => item.id === active.id);
    const isFromQuestionDrag = questionDragItems.some(item => item.id === active.id);
    const isFromAnswerDrag = answerDragItems.some(item => item.id === active.id);

    const isToAnswer = over.id === 'answer-area';
    const isToQuestion = over.id === 'question-area';

    if (isFromQuestionDrag && isToAnswer) {
      setQuestionDragItems(questionDragItems.filter(item => item.id !== active.id));
      setAnswerItems([...answerItems, draggedItem]);
    } else if (isFromAnswerDrag && isToAnswer) {
      setAnswerDragItems(answerDragItems.filter(item => item.id !== active.id));
      setAnswerItems([...answerItems, draggedItem]);
    } else if (isFromAnswer && isToQuestion && questionDragItems.length > 0) {
      setAnswerItems(answerItems.filter(item => item.id !== active.id));
      setQuestionDragItems([...questionDragItems, draggedItem]);
    } else if (isFromAnswer && isToQuestion && answerDragItems.length > 0) {
      setAnswerItems(answerItems.filter(item => item.id !== active.id));
      setAnswerDragItems([...answerDragItems, draggedItem]);
    } else if (isFromQuestion && isToAnswer) {
      setQuestionItems(questionItems.filter(item => item.id !== active.id));
      setAnswerItems([...answerItems, draggedItem]);
    } else if (isFromAnswer && isToQuestion) {
      setAnswerItems(answerItems.filter(item => item.id !== active.id));
      setQuestionItems([...questionItems, draggedItem]);
    } else if (active.id !== over.id) {
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

    const currentQuestion = questions[currentIndex];
    const isInQuestionItems = questionItems.some(i => i.id === item.id);
    const isInAnswerItems = answerItems.some(i => i.id === item.id);
    const isInQuestionDragItems = questionDragItems.some(i => i.id === item.id);
    const isInAnswerDragItems = answerDragItems.some(i => i.id === item.id);

    if (isInQuestionDragItems) {
      setQuestionDragItems(questionDragItems.filter(i => i.id !== item.id));
      setAnswerItems([...answerItems, item]);
    } else if (isInAnswerDragItems) {
      setAnswerDragItems(answerDragItems.filter(i => i.id !== item.id));
      setAnswerItems([...answerItems, item]);
    } else if (isInAnswerItems && currentQuestion.questionItems) {
      setAnswerItems(answerItems.filter(i => i.id !== item.id));
      setQuestionDragItems([...questionDragItems, item]);
    } else if (isInAnswerItems && currentQuestion.answerItems) {
      setAnswerItems(answerItems.filter(i => i.id !== item.id));
      setAnswerDragItems([...answerDragItems, item]);
    } else if (isInQuestionItems) {
      setQuestionItems(questionItems.filter(i => i.id !== item.id));
      setAnswerItems([...answerItems, item]);
    } else if (isInAnswerItems) {
      setAnswerItems(answerItems.filter(i => i.id !== item.id));
      setQuestionItems([...questionItems, item]);
    }
  };

  const handleSubmit = () => {
    if (!questions.length) return;

    const currentQuestion = questions[currentIndex];

    if (isCorrect || showFeedback) {
      // Next 버튼이 눌렸을 때
      const nextIndex = currentIndex + 1;

      if (nextIndex >= totalQuestions) {
        setIsFinished(true);
        setShowFeedback(false);
        return;
      }

      setCurrentIndex(nextIndex);
      setAnswerItems([]);
      setAnswerDragItems([]);
      setIsCorrect(false);
      setShowFeedback(false);
      setIsRetrying(false);
      setShowQuestionHint(false);
      setShowAnswerHint(false);
      setShowTranslationHint(false);
      setQuestionStartTime(Date.now());
    } else {
      // Check 버튼이 눌렸을 때
      let userAnswer = '';
      let correctAnswer = '';
      let isCorrect = false;
      let isAlternativeCorrect = false;

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
      } else if (currentQuestion.answerItems) {
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
        userAnswer = answerItems.reduce((result, item, index) => {
          const shouldAddSpace = !item.combineWithNext && index !== answerItems.length - 1;
          return result + item.content + (shouldAddSpace ? ' ' : '');
        }, '');

        correctAnswer =
          currentQuestion.mode === 'answer-to-question'
            ? currentQuestion.question
            : currentQuestion.answer;

        isCorrect = userAnswer === correctAnswer;

        isAlternativeCorrect = Boolean(
          currentQuestion.alternativeAnswers &&
            currentQuestion.alternativeAnswers.includes(userAnswer)
        );
      }

      const correctNow = isCorrect || isAlternativeCorrect;

      // 복습 모드이므로 is_review: true로 저장
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      quizMutation.mutate({
        grammar_name: grammarName,
        quiz_type: 'dialogue_drag_drop',
        question_id: currentQuestion.id?.toString() || `q-${currentIndex}`,
        question_text: currentQuestion.question || '',
        user_answer: userAnswer,
        correct_answer: correctAnswer,
        is_correct: correctNow,
        is_retry: isRetrying,
        is_review: true, // 복습 모드 플래그
        time_spent: timeSpent,
        hints_used:
          (showQuestionHint ? 1 : 0) + (showAnswerHint ? 1 : 0) + (showTranslationHint ? 1 : 0),
      });

      if (correctNow) {
        setIsCorrect(true);
        setScore(prev => prev + 1);
        setIsRetrying(false);
      } else {
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

  if (!questions.length) {
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

  const currentQuestion = questions[currentIndex];
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

  const progressText = `${currentIndex + 1}/${totalQuestions}`;
  const feedbackSystemHeight = 80;
  const dragDropHeight = 160;
  const safeBottom = 'env(safe-area-inset-bottom)';

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
                onClick={() => router.push(`/quiz/DialogueDragAndDrop`)}
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
          {/* 질문 부분 */}
          <div className="flex w-full items-center gap-2 mt-6 md:mt-8 lg:mt-3 xl:mt-3 2xl:mt-8 relative">
            <div className="text-xl md:text-2xl font-extrabold text-primaryColor w-6 md:w-8">
              Q:
            </div>
            <div className="text-xl md:text-2xl font-medium relative">
              {isAnswerToQuestionLike ? (
                currentQuestion.questionPrefix || currentQuestion.questionItems ? (
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
              ) : currentQuestion.answerPrefix || currentQuestion.answerItems ? (
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

      {/* 하단 고정 래퍼 */}
      {!isFinished && (
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
              {isCorrect ? '다음' : showFeedback ? '다음' : '확인'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default DialogueDragAndDropReview;
