import React from 'react';
import Link from 'next/link';

const ComingSoonMain = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primaryColor/10 to-white">
      <div className="text-center p-8 max-w-2xl mx-auto">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-primaryColor/20 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-primaryColor"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold mb-3 text-darkBlue">Coming Soon</h1>
        <div className="w-24 h-1 bg-primaryColor mx-auto mb-6 rounded-full"></div>

        <p className="text-xl text-contentColor mb-4">
          We're preparing to enhance your learning experience
        </p>

        <p className="text-contentColor mb-10 max-w-md mx-auto">
          This feature is currently under development. We'll be back with new quizzes soon.
        </p>

        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
          <p className="text-contentColor mb-6">
            In the meantime, check out our other available quizzes and continue your Korean learning
            journey!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-block bg-white border-2 border-primaryColor text-primaryColor hover:bg-primaryColor hover:text-white px-6 py-3 rounded-lg transition-colors duration-300 font-medium"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonMain;
