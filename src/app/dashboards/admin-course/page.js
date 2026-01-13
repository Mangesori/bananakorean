import AdminCoursesMain from '@/components/layout/main/dashboards/AdminCoursesMain';
import DashboardContainer from '@/components/shared/containers/DashboardContainer';
import DsahboardWrapper from '@/components/shared/wrappers/DsahboardWrapper';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';

export const metadata = {
    title: 'Course Management - Banana Korean',
    description: 'Manage courses',
};

const AdminCoursesPage = () => {
    return (
        <PageWrapper>
            <main>
                <DsahboardWrapper>
                    <DashboardContainer>
                        <AdminCoursesMain />
                    </DashboardContainer>
                </DsahboardWrapper>
            </main>
        </PageWrapper>
    );
};

export default AdminCoursesPage;
