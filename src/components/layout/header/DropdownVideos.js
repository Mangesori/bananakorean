import React from "react";
import Link from "next/link";

const DropdownVideos = () => {
  const videoCategories = [
    {
      title: "Lesson Quiz",
      items: [
        {
          name: "Quiz",
          path: "/lesson-quiz-result", // 직접 /quiz 경로로 연결
        },
      ],
    },
    {
      title: "Learning Level",
      items: ["Beginner", "Intermediate", "Advanced"],
    },
    {
      title: "Categories",
      items: ["Daily Life", "Romance", "Comedy", "Thriller"],
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow-lg min-w-[600px]">
      {videoCategories.map((category, idx) => (
        <div key={idx} className="p-4">
          <h3 className="text-mainText font-bold mb-2">{category.title}</h3>
          <ul className="space-y-2">
            {category.items.map((item, itemIdx) => (
              <li key={itemIdx}>
                <Link
                  href={
                    typeof item === "string"
                      ? `/videos/${category.title.toLowerCase()}/${item
                          .toLowerCase()
                          .replace(" ", "-")}`
                      : item.path
                  }
                  className="text-bodyColor hover:text-primary"
                >
                  {typeof item === "string" ? item : item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DropdownVideos;
