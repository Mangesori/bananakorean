import React from "react";
import Link from "next/link";

const QuizTypeSelection = () => {
  const quizTypes = [
    {
      type: "Korean Grammar Quiz",
      description: "Focus on specific Korean grammar points",
      path: "/quiz/grammar",
    },
    {
      type: "Comprehensive Korean Level Test",
      description:
        "Complete assessment for each Korean proficiency level (Beginner to Advanced)",
      path: "/quiz/level/select",
    },
    {
      type: "Korean Grammar Comparison Quiz",
      description:
        "Practice distinguishing similar Korean grammar patterns (e.g. 아서/어서 vs 으니까)",
      path: "/quiz/comparison",
    },
  ];

  return (
    <section className="container mx-auto py-10 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        What kind of quiz would you like to solve?
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quizTypes.map((quiz, idx) => (
          <Link
            key={idx}
            href={quiz.path}
            className="group p-6 border rounded-xl transition duration-300 hover:bg-primaryColor hover:border-primaryColor relative z-1 bg-white"
          >
            <h2 className="text-xl font-semibold mb-2 group-hover:text-white transition duration-300">
              {quiz.type}
            </h2>
            <p className="text-gray-600 text-sm group-hover:text-white/80 transition duration-300">
              {quiz.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuizTypeSelection;
