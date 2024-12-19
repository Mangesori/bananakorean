"use client";
import HeadingDashboard from "../headings/HeadingDashboard";
import getAllCourses from "@/libs/getAllCourses";

const Wishlist = () => {
  const courses = getAllCourses()?.slice(0, 5);
  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <HeadingDashboard>Wishlist</HeadingDashboard>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 -mx-15px">
        {courses?.map((course, idx) => (
          <div key={idx} className="p-4 border rounded">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
