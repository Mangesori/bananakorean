import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import blogs from "@/../public/fakedata/blogs.json";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Blog Details",
  description: "Blog Details",
};

const Blog_details = async ({ params }) => {
  const { id } = params;
  const isExistBlog = blogs?.find(({ id: id1 }) => id1 === parseInt(id));
  if (!isExistBlog) {
    notFound();
  }
  return (
    <PageWrapper>
      <main>
      </main>
    </PageWrapper>
  );
};

export async function generateStaticParams() {
  return blogs?.map(({ id }) => ({ id: id.toString() }));
}

export default Blog_details;
