import React from "react";
import BlogAuthor from "./BlogAuthor";
import BlogCategories from "./BlogCategories";
import RecentPosts from "./RecentPosts";
import BlogContactForm from "./BlogContactForm";
import BlogTags from "./BlogTags";
import BlogSocials from "./BlogSocials";
import BlogSearch from "./BlogSearch";

const BlogsSidebar = () => {
  return (
    <div className="flex flex-col">
      {/* author details */}
      <BlogAuthor />
      {/* search input */}
      <BlogSearch />
      {/* categories */}
      <BlogCategories />
      {/* recent posts */}
      <RecentPosts />
      {/* contact form */}
      <BlogContactForm />
      {/* tags */}
      <BlogTags />
      {/* social area */}
      <BlogSocials />
    </div>
  );
};

export default BlogsSidebar;
