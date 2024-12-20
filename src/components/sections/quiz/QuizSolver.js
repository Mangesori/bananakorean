"use client"; // 최상단에 추가
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { quizDataByTopic } from "@/data/quizzes";
import { useRouter } from "next/navigation";
import QuizResults from "./QuizResults"; // 결과 페이지 컴포넌트 임포트

// Add shuffle function
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const QuizSolver = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizData, setQuizData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [quizType, setQuizType] = useState(null);
  const [level, setLevel] = useState(null);
  const [questionCount, setQuestionCount] = useState(10);

  useEffect(() => {
    const topic = searchParams.get("topic");
    const questionType = searchParams.get("questionType");
    const questionCount = searchParams.get("questionCount");

    if (topic && questionType && questionCount) {
      const decodedTopic = decodeURIComponent(topic);
      const quizSet = quizDataByTopic[decodedTopic];
      if (quizSet && quizSet.questions) {
        const shuffledQuestions = shuffleArray(quizSet.questions);
        const selectedQuestions = shuffledQuestions.slice(0, Number(questionCount));
        setQuizData({ questions: selectedQuestions });
        setQuizType(questionType);
        setLevel(decodedTopic);
        setQuestionCount(Number(questionCount));
      } else {
        console.error("Quiz data not found for topic:", decodedTopic);
        router.push("/quiz/grammar");
      }
    } else {
      console.error("Missing required parameters");
      router.push("/quiz/grammar");
    }
  }, [searchParams, router]);

  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate score
    let newScore = 0;
    quizData.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
    setShowResults(true);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const handleClose = () => {
    router.back(); // Add parentheses to call the method
  };

  if (!quizData || !quizData.questions) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (showResults) {
    return (
      <QuizResults
        score={score}
        total={quizData.questions.length}
        onRetry={handleRetry}
        onClose={handleClose}
      />
    );
  }

  const question = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <div className="flex min-h-screen bg-[#f8fbfa]">
      <div className="px-4 sm:px-6 md:px-8 lg:px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col w-full max-w-[512px] py-5">
          {/* Top Navigation */}
          <div className="flex items-center justify-between px-4 mb-6">
            <button
              onClick={handleBack}
              className={`flex items-center gap-2 p-2 rounded-lg text-sm font-medium text-[#0e1b16] hover:bg-[#d1e6de] ${
                currentQuestion === 0 ? "invisible" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <h1 className="text-2xl font-bold text-[#0e1b16]">
              {searchParams.get("topic") || "Quiz"}
            </h1>

            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-[#d1e6de]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Progress Bar */}
          <div className="flex items-center gap-4 px-4 mb-6">
            <div className="flex-1 rounded bg-[#d1e6de]">
              <div
                className="h-2 rounded bg-primaryColor"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-[#0e1b16]">
              {currentQuestion + 1}/{quizData.questions.length}
            </span>
          </div>
          {/* Question */}

          {/*<h2 className="text-[#0e1b16] text-xl sm:text-2xl md:text-[28px] font-bold px-4 pb-3 pt-5">
            Choose the correct answer
          </h2>*/}

          <p className="text-[#0e1b16] text-xl px-4 pb-3 pt-1 whitespace-pre-line">
            {question.question}
          </p>
          {/* Options */}
          <div className="flex flex-col gap-3 p-4">
            {question.options.map((option, idx) => (
              <label
                key={idx}
                className="flex items-center gap-4 rounded-xl border border-[#d1e6de] p-3 sm:p-[15px] cursor-pointer"
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  checked={answers[currentQuestion] === option}
                  onChange={() => handleAnswer(option)}
                  className="h-5 w-5 border-2 border-[#d1e6de] bg-transparent text-transparent checked:border-primaryColor checked:bg-[image:var(--radio-dot-svg)] focus:outline-none focus:ring-0"
                />
                <div className="flex grow flex-col">
                  <p className="text-[#0e1b16] text-sm font-medium">{option}</p>
                </div>
              </label>
            ))}
          </div>
          {/* Next/Submit Button */}
          <div className="px-4 py-3">
            <button
              onClick={
                currentQuestion < quizData.questions.length - 1
                  ? handleNext
                  : handleSubmit
              }
              className="w-full flex min-w-[84px] cursor-pointer items-center justify-center rounded-xl h-10 sm:h-12 px-4 sm:px-5 bg-primaryColor text-[#0e1b16] text-sm sm:text-base font-bold hover:bg-[#1bc787]"
            >
              <span className="truncate">
                {currentQuestion < quizData.questions.length - 1
                  ? "Next"
                  : "Submit"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSolver;
