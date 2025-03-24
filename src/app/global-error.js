'use client';

import ErrorMain from '@/components/layout/main/ErrorMain';
import React from 'react';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <main>
          <ErrorMain />
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
