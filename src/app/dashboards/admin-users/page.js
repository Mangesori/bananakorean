import AdminUsersMain from '@/components/layout/main/dashboards/AdminUsersMain';
import DashboardContainer from '@/components/shared/containers/DashboardContainer';
import DsahboardWrapper from '@/components/shared/wrappers/DsahboardWrapper';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';

export const metadata = {
    title: 'User Management - Banana Korean',
    description: 'Manage users',
};

const AdminUsersPage = () => {
    return (
        <PageWrapper>
            <main>
                <DsahboardWrapper>
                    <DashboardContainer>
                        <AdminUsersMain />
                    </DashboardContainer>
                </DsahboardWrapper>
            </main>
        </PageWrapper>
    );
};

export default AdminUsersPage;
