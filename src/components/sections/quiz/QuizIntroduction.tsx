import React from 'react';
import Link from 'next/link';

const QuizIntroduction = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">한국어 학습을 더 재미있게</h2>
          <p className="text-xl text-gray-600 mb-8">
            대화형 퀴즈로 한국어를 쉽고 재미있게 배워보세요
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">문장 만들기</h3>
              <p className="text-gray-600 mb-4">
                단어를 드래그하여 올바른 한국어 문장을 만들어보세요
              </p>
              <Link
                href="/quiz/sentence"
                className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                시작하기
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">이에요/예요 연습</h3>
              <p className="text-gray-600 mb-4">이에요와 예요의 올바른 사용법을 배워보세요</p>
              <Link
                href="/quiz/copula"
                className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                시작하기
              </Link>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">학습 특징</h3>
            <ul className="text-left space-y-2">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                실시간 피드백으로 즉각적인 학습
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                영어 번역과 문법 설명 제공
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                단계별로 구성된 학습 과정
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                인터랙티브한 드래그 앤 드롭 인터페이스
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizIntroduction;
