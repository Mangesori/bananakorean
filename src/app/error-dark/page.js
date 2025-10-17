import ErrorMain from '@/components/layout/main/ErrorMain';
import ThemeController from '@/components/shared/others/ThemeController';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import React from 'react';
export const metadata = {
  title: 'Error - Dark',
  description: 'Error - Dark',
};
const Error_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <ErrorMain />
      </main>
    </PageWrapper>
  );
};

export default Error_Dark;
