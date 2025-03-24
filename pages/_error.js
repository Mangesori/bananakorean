export default function CustomError({ statusCode }) {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="text-red-500 text-9xl font-bold mb-8">{statusCode || '오류'}</div>
      <h1 className="text-4xl font-bold mb-4">
        {statusCode ? `${statusCode} 오류가 발생했습니다` : '오류가 발생했습니다'}
      </h1>
      <p className="mb-8">페이지를 불러오는 중에 문제가 발생했습니다.</p>
      <a
        href="/"
        className="inline-block bg-primaryColor text-white px-6 py-2 rounded-lg hover:bg-primaryColor/80 transition-colors"
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}

CustomError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
