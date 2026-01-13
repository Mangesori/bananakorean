'use client';

import QuizContainers from '@/components/shared/containers/QuizContainers';
import React, { useState } from 'react';
import QuizReviewModal from '@/components/shared/dashboards/QuizReviewModal';

const StudentMyQuizPrimary = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const allResults = [
    {
      id: 1,
      date: 'December 26, 2024',
      title: 'Korean Alphabet (Hangul) Basics',
      studentName: 'Me',
      qus: 5,
      tm: 100,
      ca: 60,
      isView: true,
      status: 'pass',
      feedback: 'Great job getting started! Focus on the vowel sounds more.',
    },
    {
      id: 2,
      date: 'December 26, 2024',
      title: 'Basic Greetings',
      studentName: 'Me',
      qus: 10,
      tm: 100,
      ca: 80,
      isView: true,
      status: 'pass',
      feedback: 'Excellent work! Your pronunciation marks are slightly off on question 3.',
    },
    {
      id: 3,
      date: 'December 26, 2024',
      title: 'Numbers',
      studentName: 'Me',
      qus: 8,
      tm: 80,
      ca: 40,
      isView: true,
      status: 'time over',
      feedback: null,
    },
  ];

  // Mock questions (same for all currently)
  const mockQuestions = [
    {
      questionText: 'What is the Korean character for "A"?',
      studentAnswer: 'ㅏ',
      correctAnswer: 'ㅏ',
      isCorrect: true,
    },
    {
      questionText: 'How do you say "Hello" politely?',
      studentAnswer: 'Annyeong',
      correctAnswer: 'Annyeonghaseyo',
      isCorrect: false,
    },
  ];

  const handleReview = (id) => {
    // Determine if we should show view or review. Since this is student side, we treat View as readonly review
    const quiz = allResults.find((r) => r.id === id);
    if (quiz) {
      setSelectedQuiz(quiz);
      setIsModalOpen(true);
    }
  };

  // We need to pass handleReview to QuizContainers, but QuizContainers expects 'onReview' for the Review button.
  // The 'View' button in LessonQuizResults currently has href="#".
  // To make 'View' button functional without modifying LessonQuizResults logic too much:
  // We can treat View functionality similar to Review but pass it differently?
  // Actually, LessonQuizResults uses <a> tag for View.
  // <a href="#">...View</a>.
  // We need to change LessonQuizResults to allow onClick for View as well.

  // Let's assume for now we use the same 'onReview' prop but logic inside LessonQuizResults needs to trigger it for View too?
  // No, LessonQuizResults has hardcoded <a> for View. 
  // I will update LessonQuizResults to use a button for View if onClickView is provided.

  return (
    <>
      <QuizContainers
        allResults={allResults}
        title={'My Quiz Results'}
        onView={handleReview}
      />
      {selectedQuiz && (
        <QuizReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          studentName={selectedQuiz.studentName}
          quizTitle={selectedQuiz.title}
          questions={mockQuestions}
          readOnly={true}
          initialFeedback={selectedQuiz.feedback}
        />
      )}
    </>
  );
};

export default StudentMyQuizPrimary;
