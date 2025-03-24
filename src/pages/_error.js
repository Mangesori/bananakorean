import React from 'react';
import Link from 'next/link';

function Error({ statusCode }) {
  return (
    <div className="error-container">
      <h1>{statusCode ? `${statusCode} 오류` : '클라이언트 오류'}</h1>
      <p>Sorry, an error occurred while loading the page.</p>
      <Link href="/" className="back-link">
        Back to Home
      </Link>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
