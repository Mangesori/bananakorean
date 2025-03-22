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
} from '@dnd-kit/core';
import Word from './component/Word';
import Option from './component/Option';
import { Item, KoreanQuestion } from '@/types/quiz';
import Link from 'next/link';

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
}

const DroppableArea: React.FC<DroppableAreaProps> = ({ id, children, className }) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
};

interface DragAndDropProps {
  questions: KoreanQuestion[];
  title: string;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ questions, title }) => {
  // 문제를 랜덤하게 섞는 함수
  const shuffleQuestions = (questionsToShuffle: KoreanQuestion[]) => {
    const shuffled = [...questionsToShuffle];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 문제를 섞어서 상태로 관리
  const [shuffledQuestions, setShuffledQuestions] = useState<KoreanQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(5);
  const [showHint, setShowHint] = useState(false);

  // 모바일 및 태블릿에서 스크롤 방지
  useEffect(() => {
    // 현재 body의 overflow 스타일 저장
    const originalStyle = window.getComputedStyle(document.body).overflow;

    // body에 overflow: hidden 적용
    document.body.style.overflow = 'hidden';

    // 컴포넌트가 언마운트될 때 원래 스타일로 복원
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // 컴포넌트가 마운트될 때와 questions prop이 변경될 때 문제를 섞음
  useEffect(() => {
    setShuffledQuestions(shuffleQuestions(questions));
    setCurrentQuestionIndex(0);
    setIsCorrect(false);
    setShowFeedback(false);
    setShowHint(false);
    setStreak(0);
    setLives(5);
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [winReady, setwinReady] = useState(false);

  // 문제가 바뀔 때마다 아이템을 랜덤으로 섞기
  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      const currentQuestion = shuffledQuestions[currentQuestionIndex];
      const shuffledItems = shuffleArray(currentQuestion.items);
      setQuestionItems(shuffledItems);
      setAnswerItems([]);
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

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    setIsDragging(true);
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    setIsDragging(false);

    const { active, over } = event;

    if (!over) return;

    // 드래그한 아이템 찾기
    const draggedItem =
      questionItems.find(item => item.id === active.id) ||
      answerItems.find(item => item.id === active.id);

    if (!draggedItem) return;

    // 드래그한 아이템이 questionItems에 있는 경우
    const isFromQuestion = questionItems.some(item => item.id === active.id);
    // 드롭 대상이 answerItems 영역인 경우
    const isToAnswer = over.id === 'answer-area';
    // 드롭 대상이 questionItems 영역인 경우
    const isToQuestion = over.id === 'question-area';

    if (isFromQuestion && isToAnswer) {
      // questionItems에서 answerItems로 이동
      setQuestionItems(questionItems.filter(item => item.id !== active.id));
      setAnswerItems([...answerItems, draggedItem]);
    } else if (!isFromQuestion && isToQuestion) {
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
      } else {
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

    if (isInQuestionItems) {
      setQuestionItems(questionItems.filter(i => i.id !== item.id));
      setAnswerItems([...answerItems, item]);
    } else {
      setAnswerItems(answerItems.filter(i => i.id !== item.id));
      setQuestionItems([...questionItems, item]);
    }
  };

  const handleSubmit = () => {
    if (!shuffledQuestions.length) return;

    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    if (isCorrect) {
      // Next 버튼이 눌렸을 때
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setAnswerItems([]);
        setIsCorrect(false);
        setShowFeedback(false);
      }
    } else {
      // Check 버튼이 눌렸을 때
      const userAnswer = answerItems.reduce((result, item, index) => {
        const shouldAddSpace = !item.combineWithNext && index !== answerItems.length - 1;
        return result + item.content + (shouldAddSpace ? ' ' : '');
      }, '');

      if (
        userAnswer === currentQuestion.baseText ||
        (currentQuestion.alternativeTexts && currentQuestion.alternativeTexts.includes(userAnswer))
      ) {
        setFeedbackMessage('잘 했어요!');
        setIsCorrect(true);
        setStreak(prev => prev + 1);
      } else {
        setFeedbackMessage('틀렸어요. 다시 시도해보세요!');
        setAnswerItems([]);
        const shuffledItems = shuffleArray(currentQuestion.items);
        setQuestionItems(shuffledItems);
        setStreak(0);
        setLives(prev => Math.max(0, prev - 1));
        setShowHint(false);
      }
      setShowFeedback(true);
    }
  };

  // 현재 문제가 없으면 로딩 표시
  if (shuffledQuestions.length === 0) {
    return <div className="text-center py-10">문제를 불러오는 중...</div>;
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const activeItem = [...questionItems, ...answerItems].find(item => item.id === activeId);

  return (
    <main className="bg-bodyBg max-w-4xl mx-auto md:max-w-3xl lg:max-w-4xl px-4 md:px-8 py-6 md:py-10 rounded-xl h-[85vh] overflow-y-auto relative">
      <div className="wrapper bg-gray-150 -mt-6 absolute left-0 right-0 mx-0 rounded-xl p-4 md:p-8 pb-32">
        <div className="flex items-center h-10">
          <h2 className="flex-1 text-2xl font-bold text-center">{title}</h2>
          <div className="flex justify-end">
            <Link
              href="/quiz"
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
        <div className="mt-7 mb-4">
          <div className="w-full bg-gray-300 rounded-full h-2.5">
            <div
              className="bg-primaryColor h-2.5 rounded-full"
              style={{ width: `${(currentQuestionIndex / shuffledQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="question-wrapper -mt-4 flex flex-wrap w-full gap-3 text-lg">
          <Word text={currentQuestion.translation} hints={currentQuestion.hints} />
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="answer-wrapper mt-10 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <hr className="border-gray-300 mt-[48px]" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <hr className="border-gray-300 mt-[100px]" />
            </div>
            {winReady && (
              <DroppableArea
                id="answer-area"
                className="answers flex flex-wrap gap-2 w-full min-h-[80px] relative z-10"
              >
                {answerItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`inline-block ${!item.combineWithNext ? 'mr-1' : '-mr-1'}`}
                  >
                    <DraggableOption item={item} onItemClick={handleItemClick} />
                  </div>
                ))}
              </DroppableArea>
            )}
          </div>
          {winReady && (
            <DroppableArea
              id="question-area"
              className="Question option-wrapper mt-12 flex flex-wrap items-start gap-2 h-[120px] overflow-y-auto"
            >
              {questionItems.map(item => (
                <DraggableOption key={item.id} item={item} onItemClick={handleItemClick} />
              ))}
            </DroppableArea>
          )}
          <DragOverlay>{activeId ? <Option item={activeItem!} /> : null}</DragOverlay>
        </DndContext>
      </div>

      {/* 피드백 메시지 오버레이 */}
      {showFeedback && (
        <div className="absolute inset-x-0 bottom-24 z-10 flex justify-center">
          <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
            <div
              className={`w-full flex flex-col p-3 rounded-2xl ${
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
                <div className="flex flex-col gap-2">
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
                  <div className="mt-2">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 transition-colors px-3 py-1.5 rounded-lg text-sm"
                    >
                      {showHint ? (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                          힌트 숨기기
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                          힌트 보기
                        </>
                      )}
                    </button>
                    {showHint && (
                      <div className="mt-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                        <div className="text-sm font-medium mb-1">정답</div>
                        <div className="text-lg">{currentQuestion.baseText}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* 하단 고정 버튼 */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gray-150">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pb-6">
          <button
            onClick={handleSubmit}
            className={`w-full py-4 text-xl font-bold rounded-2xl shadow-lg ${
              isCorrect
                ? 'bg-primaryColor hover:bg-primaryColor'
                : 'bg-primaryColor hover:primaryColor'
            } text-white uppercase transition-all`}
          >
            {isCorrect ? '다음' : '확인'}
          </button>
        </div>
      </div>
    </main>
  );
};

export default DragAndDrop;
