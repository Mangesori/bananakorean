'use client';
import BlogAuthor from './BlogAuthor';
import BlogCategories from './BlogCategories';
import RecentPosts from './RecentPosts';
import BlogContactForm from './BlogContactForm';
import BlogTags from './BlogTags';
import BlogSocials from './BlogSocials';
import BlogSearch from './BlogSearch';

const BlogsSidebar = () => {
  return (
    <div className="space-y-30px">
      <BlogSearch />
      <BlogAuthor />
      <BlogCategories />
      <RecentPosts />
      <BlogTags />
      <BlogSocials />
      <BlogContactForm />
    </div>
  );
};

export default BlogsSidebar;
