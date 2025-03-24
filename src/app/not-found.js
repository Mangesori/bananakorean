'use client';

import React from 'react';

export default function NotFound() {
  return (
    <main>
      <section>
        <div className="container py-100px">
          <div className="w-full lg:max-w-770px lg:mx-auto text-center">
            <div className="text-red-500 text-9xl font-bold mb-8">404</div>
            <h3 className="text-size-35 md:text-size-40 lg:text-size-50 leading-10 md:leading-14.5 lg:leading-20 text-blackColor dark:text-blackColor-dark font-bold">
              Page Not Found
            </h3>
            <p className="text-lg text-contentColor dark:text-contentColor-dark leading-22px">
              The page you are looking for does not exist. It may have been moved or deleted.
            </p>
            <div className="mt-50px text-center">
              <a href="/" className="btn btn-primary">
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
