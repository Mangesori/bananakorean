import Image from 'next/image';
import React from 'react';
import svglogo from '@/assets/images/logo/svglogo.svg';
import Link from 'next/link';
const NavbarLogo = () => {
  return (
    <div className="lg:col-start-1 lg:col-span-2">
      {/* 대형 화면에서 1번째 열에서 시작하여 2열 차지 */}
      <Link href="/" className="w-logo-sm lg:w-logo-lg ">
        {/* 기본: 작은 로고, 대형화면: 큰 로고 */}
        {/* pt-4: 상단 패딩 16px, pb-2: 하단 패딩 8px */}
        <Image
          priority={true} // priority를 true로 설정
          src={svglogo}
          alt="logo"
          className="w-full pt-4 pb-2"
        />
      </Link>
    </div>
  );
};

export default NavbarLogo;
