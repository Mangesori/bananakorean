import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import aboutImage from '@/assets/images/homepage/About.png';

const QuizIntroduction = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-whitegrey4 relative">
        <div className="container mx-auto px-4 sm:px-4 md:px-4 relative z-10">
          {/* Master Korean Section */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-primaryColor rounded-full border border-primaryColor mb-4">
              <span className="text-white font-semibold">New Way to Learn</span>
            </div>
            <h1 className="font-bold tracking-tight relative">
              <span className="block text-5xl md:text-6xl lg:text-7xl text-darkBlue dark:text-white mb-2">
                Master Korean
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl text-gray-600 dark:text-gray-300">
                Through Fun and Interactive Quizzes
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-6">
              Learn Korean effectively with our specialized quiz platform that combines detailed
              grammar explanations with interactive practice.
            </p>
            <div className="flex flex-wrap gap-4 items-center justify-center mt-8">
              <Link
                href="/auth/signup"
                className="inline-block bg-primaryColor text-white px-8 py-3 rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-md font-medium"
              >
                Join Now
              </Link>
            </div>
          </div>

          {/* Key Features Section */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-whitegrey4 px-4 rounded-xl relative">
              <div className="text-center mb-10">
                <h3 className="text-4xl font-semibold text-primaryColor inline-flex items-center mb-4">
                  KEY FEATURES
                </h3>
                <div className="w-24 h-1 bg-secondaryColor3 mx-auto mb-6 rounded-full"></div>
                <p className="text-contentColor">
                  Our platform offers a range of features designed to make learning Korean grammar
                  fun and effective.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-xl border border-primaryColor/20 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-primaryColor/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primaryColor"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-darkBlue dark:text-white">
                      Clear Grammar Explanations
                    </h4>
                  </div>
                  <p className="text-contentColor dark:text-gray-300 ml-13">
                    Detailed Korean grammar explanations for every quiz
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-primaryColor/20 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-primaryColor/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primaryColor"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-darkBlue dark:text-white">Instant Feedback</h4>
                  </div>
                  <p className="text-contentColor dark:text-gray-300 ml-13">
                    Get immediate results and corrections while you practice
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-primaryColor/20 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-primaryColor/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primaryColor"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-darkBlue dark:text-white">
                      Interactive Learning
                    </h4>
                  </div>
                  <p className="text-contentColor dark:text-gray-300 ml-13">
                    Engaging drag-and-drop exercises that make practice enjoyable
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-primaryColor/20 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-primaryColor/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primaryColor"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-darkBlue dark:text-white">
                      Extensive Practice Materials
                    </h4>
                  </div>
                  <p className="text-contentColor dark:text-gray-300 ml-13">
                    Over 500+ carefully crafted practice sentences
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-primaryColor/20 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-primaryColor/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primaryColor"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-darkBlue dark:text-white">Progress Tracking</h4>
                  </div>
                  <p className="text-contentColor dark:text-gray-300 ml-13">
                    Track your progress and see your improvement over time
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-primaryColor/20 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-primaryColor/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primaryColor"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-darkBlue dark:text-white">Learn Anywhere</h4>
                  </div>
                  <p className="text-contentColor dark:text-gray-300 ml-13">
                    Study anywhere, anytime - on any device
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-whitegrey4">
        <div className="container mx-auto px-4">
          <div className="bg-whitegrey4 -mt-10 p-6 rounded-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="w-full md:w-1/2">
                <div className="flex justify-center">
                  <Image
                    src={aboutImage}
                    alt="Created by Expert"
                    width={440}
                    height={440}
                    className="max-w-full h-auto w-auto"
                    priority
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h4 className="text-3xl font-semibold text-primaryColor mb-4">
                  Created By An Expert
                </h4>
                <p className="text-contentColor mb-4">
                  Effective Korean learning designed by an 6+ years experienced teacher
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>
                      We built exercises that develop your confidence in using Korean naturally
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>
                      Designed each practice to overcome typical obstacles in Korean learning
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>
                      We created quizzes focusing on grammar points students struggle with most
                    </span>
                  </li>
                </ul>
                <button className="bg-primaryColor text-white px-6 py-2 rounded-full hover:bg-primaryColor/70 transition-colors duration-300">
                  About Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Categories Section */}
      <section className="py-20 bg-whitegrey4">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-3 text-primaryColor">OUR QUIZZES</h2>
            <div className="w-24 h-1 bg-secondaryColor3 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-contentColor mb-10 max-w-2xl mx-auto">
              Choose the learning approach that works best for you
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-16 px-4">
              <div className="bg-blue/5 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue group hover:-translate-y-2 duration-300 flex flex-col h-full">
                <div className="w-16 h-16 bg-blue/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue/20 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m-6-8h6m-6 12h6M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-darkBlue">
                  Individual Grammar Quiz
                </h3>
                <p className="text-contentColor mb-6">
                  Ideal for learners who&apos;ve studied Korean before but need targeted practice.
                </p>
                <ul className="text-left space-y-3 mb-8 flex-grow">
                  <li className="flex items-start">
                    <span className="text-blue mr-2 mt-1">✓</span>
                    <span>
                      Perfect if you took classes but didn&apos;t fully grasp certain points
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue mr-2 mt-1">✓</span>
                    <span>Learn with authentic, practical sentences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue mr-2 mt-1">✓</span>
                    <span>Build confidence in forming complete sentences</span>
                  </li>
                </ul>
                <div className="mt-auto">
                  <Link
                    href="/quiz/DialogueDragAndDrop"
                    className="inline-block bg-white border-2 border-blue text-blue hover:bg-blue hover:text-white px-6 py-2 rounded-lg transition-colors duration-300 font-medium"
                  >
                    Start Learning
                  </Link>
                </div>
              </div>

              <div className="bg-primaryColor/5 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-primaryColor group hover:-translate-y-2 duration-300 flex flex-col h-full">
                <div className="w-16 h-16 bg-primaryColor/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primaryColor/30 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primaryColor"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-darkBlue">Step-by-Step Quiz</h3>
                <p className="text-contentColor mb-6">
                  Perfect for absolute beginners or those who want to build a solid foundation.
                </p>
                <ul className="text-left space-y-3 mb-8 flex-grow">
                  <li className="flex items-start">
                    <span className="text-primaryColor mr-2 mt-1">✓</span>
                    <span>Start from the basics and progress systematically</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primaryColor mr-2 mt-1">✓</span>
                    <span>From basic grammar to practical conversation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primaryColor mr-2 mt-1">✓</span>
                    <span>Structured learning path for complete beginners</span>
                  </li>
                </ul>
                <div className="mt-auto">
                  <Link
                    href="/quiz/coming-soon"
                    className="inline-block bg-white border-2 border-primaryColor text-primaryColor bg-primaryColor hover:bg-primaryColor hover:text-white px-6 py-2 rounded-lg transition-colors duration-300 font-medium"
                  >
                    COMING SOON
                  </Link>
                </div>
              </div>

              <div className="bg-secondaryColor3/5 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-secondaryColor3 group hover:-translate-y-2 duration-300 flex flex-col h-full">
                <div className="w-16 h-16 bg-secondaryColor3/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondaryColor3/30 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-secondaryColor3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-darkBlue">
                  Grammar Comparison Quiz
                </h3>
                <p className="text-contentColor mb-6">
                  Designed for learners who confuse similar grammar patterns.
                </p>
                <ul className="text-left space-y-3 mb-8 flex-grow">
                  <li className="flex items-start">
                    <span className="text-secondaryColor3 mr-2 mt-1">✓</span>
                    <span>Clear up those nuanced differences that make Korean challenging</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondaryColor3 mr-2 mt-1">✓</span>
                    <span>Direct comparisons with contextual examples</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondaryColor3 mr-2 mt-1">✓</span>
                    <span>Focus on commonly confused grammar points</span>
                  </li>
                </ul>
                <div className="mt-auto">
                  <Link
                    href="/quiz/coming-soon"
                    className="inline-block bg-white border-2 border-secondaryColor3 text-secondaryColor3 hover:bg-secondaryColor3 hover:text-white px-6 py-2 rounded-lg transition-colors duration-300 font-medium"
                  >
                    COMING SOON
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default QuizIntroduction;
