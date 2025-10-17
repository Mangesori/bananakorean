import BlogsMain from '@/components/layout/main/BlogsMain';
import ThemeController from '@/components/shared/others/ThemeController';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import React from 'react';
export const metadata = {
  title: 'Blog - Dark',
  description: 'Blog - Dark',
};
const Blog_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <BlogsMain />
      </main>
    </PageWrapper>
  );
};

export default Blog_Dark;
