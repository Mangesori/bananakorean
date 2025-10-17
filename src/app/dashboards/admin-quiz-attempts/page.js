import AdminQuizAttemptsMain from '@/components/layout/main/dashboards/AdminQuizAttemptsMain';
import DashboardContainer from '@/components/shared/containers/DashboardContainer';

import ThemeController from '@/components/shared/others/ThemeController';
import DsahboardWrapper from '@/components/shared/wrappers/DsahboardWrapper';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
export const metadata = {
  title: 'Admin Quiz Attempts',
  description: 'Admin Quiz Attempts',
};
const Admin_Quiz_Attempts = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <AdminQuizAttemptsMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Admin_Quiz_Attempts;
