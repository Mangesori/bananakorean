"use client";
import TabButtonSecondary from "../buttons/TabButtonSecondary";
import TabContentWrapper from "../wrappers/TabContentWrapper";
import useTab from "@/hooks/useTab";
import getAllCourses from "@/libs/getAllCourses";

const DashboardCoursesTab = () => {
  const { currentIdx, handleTabClick } = useTab();
  const courses = getAllCourses();

  const tabbuttons = [
    {
      name: "PUBLISH",
      content: <div>Published Courses</div>,
    },
    {
      name: "PENDING",
      content: <div>Pending Courses</div>,
    },
    {
      name: "DRAFT",
      content: <div>Draft Courses</div>,
    },
  ];

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          Course Status
        </h2>
      </div>
      <div>
        <div className="flex flex-wrap mb-10px lg:mb-50px rounded gap-10px">
          {tabbuttons?.map(({ name }, idx) => (
            <TabButtonSecondary
              key={idx}
              name={name}
              idx={idx}
              currentIdx={currentIdx}
              handleTabClick={handleTabClick}
              button={"small"}
            />
          ))}
        </div>
        <div>
          {tabbuttons?.map(({ content }, idx) => (
            <TabContentWrapper key={idx} isShow={idx === currentIdx ? true : false}>
              {content}
            </TabContentWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCoursesTab;
