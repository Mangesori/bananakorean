import AboutMain from '@/components/layout/main/AboutMain';
import ThemeController from '@/components/shared/others/ThemeController';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import React from 'react';
export const metadata = {
  title: 'About - Dark',
  description: 'About - Dark',
};
const About_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <AboutMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default About_Dark;
