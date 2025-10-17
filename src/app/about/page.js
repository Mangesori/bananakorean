import AboutMain from '@/components/layout/main/AboutMain';

import ThemeController from '@/components/shared/others/ThemeController';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';

export const metadata = {
  title: 'About',
  description: 'About',
};

const About = async () => {
  return (
    <PageWrapper>
      <main>
        <AboutMain />
      </main>
    </PageWrapper>
  );
};

export default About;
