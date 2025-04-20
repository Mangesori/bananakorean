'use client';
import React, { useEffect, useState } from 'react';
import ProfileDetails from '@/components/shared/dashboards/ProfileDetails';
import { useAuth } from '@/lib/supabase/hooks';
import DashboardWrapper from '@/components/shared/wrappers/DsahboardWrapper';
import DashboardContainer from '@/components/shared/containers/DashboardContainer';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import StudentProfileMain from '@/components/layout/main/dashboards/StudentProfileMain';
import { useRouter } from 'next/navigation';

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
