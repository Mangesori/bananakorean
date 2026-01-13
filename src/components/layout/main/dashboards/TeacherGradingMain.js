'use client';

import QuizContainers from '@/components/shared/containers/QuizContainers';
import React, { useState } from 'react';
import QuizReviewModal from '@/components/shared/dashboards/QuizReviewModal';

const TeacherGradingMain = () => {
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    // Mock data representing students assigned to this teacher
    const allResults = [
        {
            id: 101,
            date: 'December 27, 2024',
            title: 'Korean Alphabet (Hangul) Basics',
            studentName: 'Alice (My Student)',
            qus: 5,
            tm: 100,
            ca: 80,
            status: 'running',
            isReview: true,
        },
        {
            id: 102,
            date: 'December 27, 2024',
            title: 'Basic Greetings',
            studentName: 'Bob (My Student)',
            qus: 10,
            tm: 100,
            ca: 90,
            status: 'pass',
            isReview: true,
        },
    ];

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
        const quiz = allResults.find((r) => r.id === id);
        setSelectedQuiz(quiz);
        setIsReviewOpen(true);
    };

    const handleFeedbackSubmit = (feedback) => {
        console.log(`Teacher Feedback for quiz ${selectedQuiz?.id}:`, feedback);
        alert('Feedback sent to student!');
        setIsReviewOpen(false);
    };

    return (
        <>
            <QuizContainers
                allResults={allResults}
                title={'Grading & Feedback'}
                onReview={handleReview}
            />
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

export default TeacherGradingMain;
