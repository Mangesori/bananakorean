"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const QuizSettings = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");

  const [questionType, setQuestionType] = useState("Multiple Choice");
  const [questionCount, setQuestionCount] = useState(5);

  const handleStartQuiz = () => {
    // topic 문자열 변환 (예: "은/는, 이에요/예요" -> "은/는-이에요/예요")
    const formattedTopic = topic?.replace(", ", "-");
    console.log("Formatted topic:", formattedTopic); // 디버깅용

    router.push(
      `/quiz/solve?topic=${encodeURIComponent(
        formattedTopic
      )}&questionType=${questionType}&questionCount=${questionCount}`
    );
  };

  return (
    <section className="relative z-1 py-20 bg-white dark:bg-darkdeep1">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white dark:bg-[#0c0e2b] p-8 rounded-lg shadow-lg border border-borderColor dark:border-[#312a57]">
          <div className="flex items-center mb-8 gap-4">
            <button
              onClick={() => router.push("/quiz/grammar")}
              className="p-2 rounded-lg hover:bg-[#d1e6de] text-mainText dark:text-whiteColor"
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
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-mainText dark:text-whiteColor text-center flex-1">
              Quiz Settings
            </h1>
          </div>

          <div className="space-y-8">
            <div className="quiz-setting-group">
              <h2 className="text-xl font-semibold mb-4 text-mainText dark:text-whiteColor">
                Question Type
              </h2>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-borderColor dark:border-[#312a57] bg-white dark:bg-darkdeep1 text-bodyText dark:text-whiteColor focus:outline-none focus:ring-2 focus:ring-primaryColor"
              >
                <option value="Multiple Choice">Multiple Choice</option>
                <option value="Fill in the Blank">Fill in the Blank</option>
                <option value="Drag and Drop">Drag and Drop</option>
              </select>
            </div>

            <div className="quiz-setting-group">
              <h2 className="text-xl font-semibold mb-4 text-mainText dark:text-whiteColor">
                Number of Questions
              </h2>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-md border border-borderColor dark:border-[#312a57] bg-white dark:bg-darkdeep1 text-bodyText dark:text-whiteColor focus:outline-none focus:ring-2 focus:ring-primaryColor"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <button
              onClick={handleStartQuiz}
              className="w-full py-4 px-6 bg-primaryColor hover:bg-opacity-90 text-white rounded-md font-semibold transition-all duration-300 mt-8 flex items-center justify-center space-x-2"
            >
              <span>Start Quiz</span>
              <i className="icofont-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizSettings;
