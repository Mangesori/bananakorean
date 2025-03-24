'use client';
import React from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <main>
          <section>
            <div className="container py-100px">
              <div className="w-full lg:max-w-770px lg:mx-auto text-center">
                <div className="text-red-500 text-9xl font-bold mb-8">오류</div>
                <h3 className="text-size-35 md:text-size-40 lg:text-size-50 leading-10 md:leading-14.5 lg:leading-20 font-bold">
                  A problem has occurred
                </h3>
                <p className="text-lg leading-22px mb-8">
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
      </body>
    </html>
  );
}
