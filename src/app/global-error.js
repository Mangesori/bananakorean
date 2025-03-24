'use client';

import ErrorMain from '@/components/layout/main/ErrorMain';
import React from 'react';

export default function GlobalError({ error, reset }) {
  let errorContent;

  try {
    errorContent = <ErrorMain />;
  } catch (e) {
    errorContent = (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">오류가 발생했습니다</h1>
        <p className="mb-8">페이지를 불러오는 중에 문제가 발생했습니다.</p>
      </div>
    );
  }

  return (
    <html>
      <body>
        <main>
          {errorContent}
          <div className="container text-center mt-5">
            <button className="btn btn-primary" onClick={() => reset()}>
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
