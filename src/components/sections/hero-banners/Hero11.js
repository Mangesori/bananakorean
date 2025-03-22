import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Symbol from '@/assets/images/symbol/svgsymbol.svg'; // You'll need to add this image

const Hero11 = () => {
  return (
    <section className="bg-white dark:bg-darkdeep1">
      {' '}
      {/* min-h-screen 제거하고 py 값 추가 */}
      <div className="container mx-auto px-8 sm:px-8 md:px-4">
        {' '}
        {/* 패딩 값 수정 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Symbol */}
          <div className="flex justify-center">
            <div className="w-80 h-80 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] relative">
              {' '}
              {/* 사이즈 증가 */}
              <Image
                src={Symbol}
                alt="Korean Symbol"
                fill
                priority
                className="dark:filter dark:brightness-90 object-contain"
              />
            </div>
          </div>

          {/* Right Column - Text Content */}
          <div className="text-left flex flex-col">
            <div className="space-y-8 mb-8">
              {' '}
              {/* 첫 번째 그룹: 제목과 설명문 사이 */}
              <div className="space-y-4">
                <h1 className="font-bold tracking-tight">
                  <span className="block text-4xl md:text-4xl lg:text-6xl text-primaryColor">
                    Step Up
                  </span>
                  <span className="block text-4xl md:text-4xl lg:text-6xl text-gray-600 dark:text-gray-300">
                    with
                  </span>
                  <span className="block text-5xl md:text-5xl lg:text-7xl text-blackColor dark:text-white">
                    Korean Quiz
                  </span>
                </h1>
              </div>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg">
                Challenge yourself with a variety of quizzes and enhance your Korean proficiency.
              </p>
            </div>

            <div className="mt-10 pb-10 md:pb-0">
              {' '}
              {/* 두 번째 그룹: 설명문과 버튼 사이 */}
              <Link
                href="/quiz"
                className="inline-block bg-primaryColor text-white text-lg md:text-xl font-semibold px-8 py-4 rounded-lg hover:bg-opacity-90 transition-all duration-300"
              >
                Try It Now for Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero11;
