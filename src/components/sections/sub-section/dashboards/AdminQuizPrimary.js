'use client';

import QuizContainers from '@/components/shared/containers/QuizContainers';
import React, { useState } from 'react';
import QuizReviewModal from '@/components/shared/dashboards/QuizReviewModal';

const AdminQuizPrimaryt = () => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const allResults = [
    {
      id: 1,
      date: 'December 26, 2024',
      title: 'Korean Alphabet (Hangul) Basics',
      studentName: 'Mice Jerry',
      qus: 5,
      tm: 100,
      ca: 60,
      status: 'running',
      isReview: true,
    },
    {
      id: 2,
      date: 'December 26, 2024',
      title: 'Basic Greetings & Introductions',
      studentName: 'Tom Cat',
      qus: 10,
      tm: 100,
      ca: 80,
      status: 'time over',
      isReview: true,
    },
    {
      id: 3,
      date: 'December 26, 2024',
      title: 'Numbers and Counting',
      studentName: 'Spike Dog',
      qus: 8,
      tm: 80,
      ca: 40,
      status: 'coming',
      isReview: true,
    },
    {
      id: 4,
      date: 'December 26, 2024',
      title: 'Sentence Structure Basics',
      studentName: 'Tyke Dog',
      qus: 5,
      tm: 50,
      ca: 0,
      status: 'cancel',
      isReview: true,
    },
  ];

  // Mock questions for the selected quiz
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
    {
      questionText: 'What is 10 in Sino-Korean?',
      studentAnswer: 'Yeol',
      correctAnswer: 'Ship',
      isCorrect: false,
    },
  ];

  const handleReview = (id) => {
    const quiz = allResults.find((r) => r.id === id);
    setSelectedQuiz(quiz);
    setIsReviewOpen(true);
  };

  const handleFeedbackSubmit = (feedback) => {
    console.log(`Feedback for quiz ${selectedQuiz?.id}:`, feedback);
    // Here you would save the feedback to the backend
    alert('Feedback sent successfully!');
    setIsReviewOpen(false);
  };

  return (
    <>
      <QuizContainers allResults={allResults} onReview={handleReview} />
      {selectedQuiz && (
        <QuizReviewModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          studentName={selectedQuiz.studentName}
          quizTitle={selectedQuiz.title}
          questions={mockQuestions}
          onSubmitFeedback={handleFeedbackSubmit}
        />
      )}
    </>
  );
};

export default AdminQuizPrimaryt;
