'use client';
import DashboardWrapper from '@/components/shared/wrappers/DsahboardWrapper';
import DashboardContainer from '@/components/shared/containers/DashboardContainer';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import StudentProfileMain from '@/components/layout/main/dashboards/StudentProfileMain';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Student_Profile = () => {
  return (
    <PageWrapper>
      <main>
        <DashboardWrapper>
          <DashboardContainer>
            <StudentProfileMain />
          </DashboardContainer>
        </DashboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Student_Profile;
