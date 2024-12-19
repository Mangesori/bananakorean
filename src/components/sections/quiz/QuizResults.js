import React from "react";

const QuizResults = ({ score, total, onRetry, onClose }) => {
  return (
    <div className="flex min-h-screen bg-[#f8fbfa]">
      <div className="px-4 sm:px-6 md:px-8 lg:px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col w-full max-w-[512px] py-5">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0e1b16] mb-4">
              Quiz Results
            </h2>
            <div className="text-6xl font-bold text-primaryColor mb-6">
              {score}/{total}
            </div>
            <p className="text-[#0e1b16] text-lg mb-8">
              {score === total
                ? "Perfect! You got all questions correct!"
                : score >= total / 2
                ? "Good job! Keep practicing!"
                : "Keep trying, you can do better!"}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={onRetry}
                className="px-6 py-3 bg-primaryColor text-[#0e1b16] rounded-xl font-bold hover:bg-[#1bc787]"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#d1e6de] text-[#0e1b16] rounded-xl font-bold hover:bg-[#c1d6ce]"
              >
                Return to Topics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
