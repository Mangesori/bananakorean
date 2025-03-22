import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">개인정보 처리방침</h1>
      <div className="prose max-w-none">
        <p className="mb-4">
          바나나코리안은 사용자의 개인정보를 보호하기 위해 최선을 다하고 있습니다.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-4">1. 수집하는 개인정보 항목</h2>
        <p className="mb-4">
          - 필수항목: 이메일 주소, 비밀번호
          <br />- 선택항목: 프로필 정보, 학습 기록
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-4">2. 개인정보의 수집 및 이용목적</h2>
        <p className="mb-4">
          - 서비스 제공 및 운영
          <br />
          - 학습 진행 상황 추적
          <br />- 서비스 개선 및 신규 서비스 개발
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-4">3. 개인정보의 보유 및 이용기간</h2>
        <p className="mb-4">
          회원 탈퇴 시까지 (단, 관련 법령에 따라 일정 기간 보관이 필요한 정보는 해당 기간 동안 보관)
        </p>
      </div>
    </div>
  );
}
