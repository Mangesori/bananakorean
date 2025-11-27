import React from 'react';
import StudentWeakAreasPrimary from '@/components/sections/sub-section/dashboards/StudentWeakAreasPrimary';
import DashboardContainer from '@/components/shared/containers/DashboardContainer';
import DsahboardWrapper from '@/components/shared/wrappers/DsahboardWrapper';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';

export const metadata = {
  title: '약점 분석 | Banana Korean',
  description: '약점 문법 상세 분석',
};

const StudentWeakAreasPage = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <StudentWeakAreasPrimary />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default StudentWeakAreasPage;
