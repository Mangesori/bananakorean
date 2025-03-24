'use client';
import React from 'react';

export default function Error({ error, reset }) {
  return (
    <main>
      <section>
        <div className="container py-100px">
          <div className="w-full lg:max-w-770px lg:mx-auto text-center">
            <div className="text-red-500 text-9xl font-bold mb-8">오류</div>
            <h3 className="text-size-35 md:text-size-40 lg:text-size-50 leading-10 md:leading-14.5 lg:leading-20 text-blackColor dark:text-blackColor-dark font-bold">
              문제가 발생했습니다
            </h3>
            <p className="text-lg text-contentColor dark:text-contentColor-dark leading-22px mb-8">
              페이지를 불러오는 중에 오류가 발생했습니다.
            </p>
            <div className="mt-50px text-center">
              <button className="btn btn-primary" onClick={() => reset()}>
                다시 시도하기
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
