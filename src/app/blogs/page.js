import BlogsMain from '@/components/layout/main/BlogsMain';

import ThemeController from '@/components/shared/others/ThemeController';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';

export const metadata = {
  title: 'Blog',
  description: 'Blog',
};

const Blogs = async () => {
  return (
    <PageWrapper>
      <main>
        <BlogsMain />
      </main>
    </PageWrapper>
  );
};

export default Blogs;
