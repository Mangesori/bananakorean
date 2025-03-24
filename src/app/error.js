'use client';
import React from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  return (
    <main>
      <section>
        <div className="container py-100px">
          <div className="w-full lg:max-w-770px lg:mx-auto text-center">
            <div className="text-red-500 text-9xl font-bold mb-8">Error</div>
            <h3 className="text-size-35 md:text-size-40 lg:text-size-50 leading-10 md:leading-14.5 lg:leading-20 text-blackColor dark:text-blackColor-dark font-bold">
              A problem has occurred
            </h3>
            <p className="text-lg text-contentColor dark:text-contentColor-dark leading-22px mb-8">
              An error occurred while loading the page.
            </p>
            <div className="mt-50px text-center">
              <Link href="/" className="btn btn-primary">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
