import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DragEndEvent } from '@dnd-kit/core';
import { Item, SetItems, QuizService } from '@/types/quiz';

const handleDragEnd = (
  event: DragEndEvent,
  questionItems: Item[],
  setQuestionItems: SetItems,
  answerItems: Item[],
  setAnswerItems: SetItems
) => {
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

const handleSubmit = (
  answerItems: Item[],
  setAnswerItems: SetItems,
  originalItems: Item[],
  correctAnswer: string,
  setQuestionItems: SetItems
): boolean => {
  const userAnswer = answerItems.reduce((result, item, index) => {
    const shouldCombine = originalItems.find(
      original => original.content === item.content
    )?.combineWithNext;
    const isLast = index === answerItems.length - 1;

    if (isLast) {
      return result + item.content;
    }
    return result + item.content + (shouldCombine ? '' : ' ');
  }, '');

  if (userAnswer === correctAnswer) {
    toast.success('정답입니다! 잘하셨어요!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: false,
      progress: undefined,
    });
    return true;
  } else {
    toast.error('틀렸습니다. 다시 시도해보세요!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: false,
      progress: undefined,
    });
    setAnswerItems([]);
    setQuestionItems(originalItems);
    return false;
  }
};

const quizService: QuizService = {
  handleDragEnd,
  handleSubmit,
};

export default quizService;
