'use client';
import { useState, useEffect } from 'react';
import AdminMessageMain from '@/components/layout/main/dashboards/AdminMessageMain';
import DashboardContainer from '@/components/shared/containers/DashboardContainer';
import DsahboardWrapper from '@/components/shared/wrappers/DsahboardWrapper';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import ChatAppFinal from '@/components/shared/dashboards/ChatAppFinal';

const Admin_Message = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 모바일: 메시지창만 전체 화면으로 표시
  if (isMobile) {
    return (
      <div className="fixed inset-0 overflow-hidden">
        <ChatAppFinal isMobile={true} />
      </div>
    );
  }

  // 데스크톱: 기존 레이아웃 유지
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <AdminMessageMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Admin_Message;
