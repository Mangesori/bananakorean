'use client';

import React from 'react';

const ErrorMain = () => {
  return (
    <section>
      <div className="container py-100px">
        <div className="w-full lg:max-w-770px lg:mx-auto text-center">
          <div className="text-red-500 text-9xl font-bold mb-8">404</div>
          <h3 className="text-size-35 md:text-size-40 lg:text-size-50 leading-10 md:leading-14.5 lg:leading-20 text-blackColor dark:text-blackColor-dark font-bold">
            앗... 길을 잃으신 것 같아요!
          </h3>
          <p className="text-lg text-contentColor dark:text-contentColor-dark leading-22px">
            찾으시는 페이지가 존재하지 않습니다. 이동되었거나 삭제되었을 수 있습니다.
          </p>
          <div className="mt-50px text-center">
            <a href="/" className="btn btn-primary">
              홈으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorMain;
