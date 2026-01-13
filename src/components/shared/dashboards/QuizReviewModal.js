'use client';

import React, { useState } from 'react';

const QuizReviewModal = ({ isOpen, onClose, studentName, quizTitle, questions = [], onSubmitFeedback, readOnly = false, initialFeedback = '' }) => {
    const [feedback, setFeedback] = useState(initialFeedback);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white dark:bg-whiteColor-dark rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-whiteColor-dark">
                    <div>
                        <h2 className="text-xl font-bold text-blackColor dark:text-blackColor-dark">
                            {readOnly ? 'Quiz Result' : 'Quiz Review'}: {quizTitle}
                        </h2>
                        <p className="text-sm text-contentColor dark:text-contentColor-dark mt-1">
                            Student: <span className="font-medium text-primaryColor">{studentName}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-lightGrey5 dark:bg-gray-800">
                    {/* Questions List */}
                    <div className="space-y-6 mb-8">
                        {questions.map((q, idx) => (
                            <div key={idx} className="bg-white dark:bg-whiteColor-dark p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-blackColor dark:text-blackColor-dark">
                                        Q{idx + 1}. {q.questionText}
                                    </h3>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${q.isCorrect
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}
                                    >
                                        {q.isCorrect ? 'Correct' : 'Incorrect'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Student Answer:</p>
                                        <p className={`text-sm ${q.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {q.studentAnswer}
                                        </p>
                                    </div>
                                    {!q.isCorrect && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                            <p className="text-xs text-blue-500 dark:text-blue-400 mb-1">Correct Answer:</p>
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                {q.correctAnswer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Feedback Section */}
                    {(readOnly && feedback) || !readOnly ? (
                        <div className="bg-white dark:bg-whiteColor-dark p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-blackColor dark:text-blackColor-dark mb-4">
                                Teacher's Feedback
                            </h3>
                            {readOnly ? (
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-blackColor dark:text-whiteColor-dark rounded-lg whitespace-pre-wrap border border-yellow-200 dark:border-yellow-800">
                                    {feedback}
                                </div>
                            ) : (
                                <textarea
                                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primaryColor focus:border-transparent dark:bg-gray-800 dark:text-white"
                                    rows="4"
                                    placeholder="Write your constructive feedback here..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                ></textarea>
                            )}
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-whiteColor-dark flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        {readOnly ? 'Close' : 'Cancel'}
                    </button>
                    {!readOnly && (
                        <button
                            onClick={() => onSubmitFeedback(feedback)}
                            className="px-6 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition-colors font-medium flex items-center gap-2"
                        >
                            <i className="icofont-paper-plane"></i>
                            Send Feedback
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizReviewModal;
