'use client';

const UserAvatar = ({ name, size = 40, className = '' }) => {
  // 이름의 첫 글자 추출 (대문자로 변환)
  const getInitial = () => {
    if (!name) return 'U';

    // 한글인 경우 첫 글자, 영문인 경우 첫 글자
    const firstChar = name.trim()[0];
    return firstChar.toUpperCase();
  };

  // 이름 기반으로 배경색 생성 (구글 스타일)
  const getBackgroundColor = () => {
    if (!name) return '#1a73e8'; // 기본 파란색

    const colors = [
      '#1a73e8', // 파란색
      '#188038', // 초록색
      '#e37400', // 주황색
      '#d93025', // 빨간색
      '#9334e6', // 보라색
      '#b31412', // 진한 빨간색
      '#0b8043', // 진한 초록색
    ];

    // 이름의 문자 코드 합으로 색상 선택
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  const initial = getInitial();
  const bgColor = getBackgroundColor();

  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-medium ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: bgColor,
        fontSize: `${size * 0.4}px`,
      }}
    >
      {initial}
    </div>
  );
};

export default UserAvatar;
