import React from "react";
import Link from "next/link";
import Image from "next/image";
import grammarIcon from "@/assets/images/icon/grammar.svg"; // Add these icons
import levelIcon from "@/assets/images/icon/level.svg";
import compareIcon from "@/assets/images/icon/compare.svg";

const QuizIntroduction = () => {
  const quizTypes = [
    {
      title: "Grammar Quiz",
      icon: grammarIcon,
      description:
        "Master essential Korean grammar points with targeted practice and immediate feedback.",
      path: "/quiz/grammar",
      color: "bg-secondaryColor",
    },
    {
      title: "Grammar Comparison",
      icon: compareIcon,
      description:
        "Learn to distinguish between similar Korean grammar patterns with detailed explanations.",
      path: "/quiz/comparison",
      color: "bg-secondaryColor2",
    },
    {
      title: "Comprehensive Level Test",
      icon: levelIcon,
      description:
        "Find out your Korean proficiency level through our comprehensive assessment.",
      path: "/quiz/level/select",
      color: "bg-secondaryColor3", // from-secondaryColor2-500 to-secondaryColor2-600 에서 변경
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-primaryColor">
      {" "}
      {/* bg-gray-50 dark:bg-gray-900 에서 변경 */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#005c2b] mb-4">
            {" "}
            {/* text-gray-900 dark:text-white 에서 변경 */}
            What kind of Quiz would you like to solove?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quizTypes.map((quiz, idx) => (
            <Link key={idx} href={quiz.path}>
              <div
                className={`h-full p-8 rounded-2xl ${quiz.color} transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg`}
                // bg-gradient-to-br 제거
              >
                <div className="flex flex-col items-center text-center text-white">
                  <Image
                    src={quiz.icon}
                    alt={quiz.title}
                    width={256} // 사이즈 증가
                    height={256} // 사��즈 증가
                    className="mb-6" // w-12 h-12 대신 더 큰 고정 사이즈 사용, mb-6만 유지
                  />
                  <h3 className="text-2xl font-bold mb-4">{quiz.title}</h3>
                  <p className="text-white/90">{quiz.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuizIntroduction;
