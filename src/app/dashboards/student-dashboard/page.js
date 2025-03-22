import StudentDashboardMain from '@/components/layout/main/dashboards/StudentDashboardMain';
import DashboardContainer from '@/components/shared/containers/DashboardContainer';
import DsahboardWrapper from '@/components/shared/wrappers/DsahboardWrapper';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
export const metadata = {
  title: 'Student Dashboard',
  description: 'Student Dashboard',
};
const Student_Dashboard = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <StudentDashboardMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Student_Dashboard;
