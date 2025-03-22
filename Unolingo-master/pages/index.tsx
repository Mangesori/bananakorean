import Head from 'next/head';
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
import { CSS } from '@dnd-kit/utilities';
import Word from '../components/Word';
import Option from '../components/Option';
import services from '../utils/services';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { koreanQuestions } from '../questions/koreanQuestions';

interface Item {
  id: string;
  content: string;
  combineWithNext?: boolean;
}

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

const Home: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = koreanQuestions[currentQuestionIndex];

  // 아이템을 랜덤으로 섞는 함수
  const shuffleArray = (array: Item[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 문제가 바뀔 때마다 아이템을 랜덤으로 섞기
  useEffect(() => {
    const shuffledItems = shuffleArray(currentQuestion.items);
    setQuestionItems(shuffledItems);
  }, [currentQuestionIndex, currentQuestion]);

  const [questionItems, setQuestionItems] = useState<Item[]>(shuffleArray(currentQuestion.items));
  const [answerItems, setAnswerItems] = useState<Item[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const [winReady, setwinReady] = useState(false);
  useEffect(() => {
    setwinReady(true);
  }, []);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    setIsDragging(true);
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    setIsDragging(false);
    services.handleDragEnd(event, questionItems, setQuestionItems, answerItems, setAnswerItems);
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
    const isCorrect = services.handleSubmit(
      answerItems,
      setAnswerItems,
      currentQuestion.items,
      currentQuestion.baseText,
      setQuestionItems
    );
    if (isCorrect && currentQuestionIndex < koreanQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setQuestionItems(koreanQuestions[currentQuestionIndex + 1].items);
        setAnswerItems([]);
      }, 1500);
    }
  };

  const activeItem = [...questionItems, ...answerItems].find(item => item.id === activeId);

  return (
    <div>
      <Head>
        <title>Korean Quiz</title>
        <meta name="description" content="Learn Korean with drag and drop quiz" />
        <link rel="icon" href="/happyduo.ico" />
      </Head>
      <main className="flex justify-center items-center h-screen w-screen bg-[#58cc02]">
        <div className="wrapper bg-gray-100 md:w-3/5 w-full h-4/5 rounded-xl p-10 shadow-xl">
          <h2 className="text-3xl font-medium">Translate to Korean</h2>
          <div className="question-wrapper mt-16 flex gap-3 text-lg">
            <Word text={currentQuestion.translation} hints={currentQuestion.hints} />
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="answer-wrapper mt-10">
              {winReady && (
                <DroppableArea id="answer-area" className="answers flex gap-2 w-full h-10">
                  {answerItems.map(item => (
                    <DraggableOption key={item.id} item={item} onItemClick={handleItemClick} />
                  ))}
                </DroppableArea>
              )}
              <hr className="border-gray-300" />
              <br />
              <hr className="mt-5 border-gray-300" />
            </div>
            {winReady && (
              <DroppableArea
                id="question-area"
                className="Question option-wrapper mt-16 flex items-start gap-2 h-28"
              >
                {questionItems.map(item => (
                  <DraggableOption key={item.id} item={item} onItemClick={handleItemClick} />
                ))}
              </DroppableArea>
            )}
            <DragOverlay>{activeId ? <Option item={activeItem!} /> : null}</DragOverlay>
          </DndContext>
          <div className="flex justify-center mt-10 md:mt-5">
            <button
              onClick={handleSubmit}
              className="bg-[#58cc02] hover:bg-[#448d0d] transition-all text-white font-medium text-lg px-10 py-2 rounded-lg shadow-lg"
            >
              Check Your Answer
            </button>
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </main>
    </div>
  );
};

export default Home;
