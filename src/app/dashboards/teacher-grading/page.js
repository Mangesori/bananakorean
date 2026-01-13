import React from 'react';
import TeacherGradingMain from '@/components/layout/main/dashboards/TeacherGradingMain';
import DashboardContainer from '@/components/shared/containers/DashboardContainer';
import DsahboardWrapper from '@/components/shared/wrappers/DsahboardWrapper';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';

export const metadata = {
    title: 'Grading | Banana Korean',
    description: 'Grade student quizzes',
};

const TeacherGradingPage = () => {
    return (
        <PageWrapper>
            <main>
                <DsahboardWrapper>
                    <DashboardContainer>
                        <TeacherGradingMain />
                    </DashboardContainer>
                </DsahboardWrapper>
            </main>
        </PageWrapper>
    );
};

export default TeacherGradingPage;
