import React from "react";
import Link from "next/link";

const LevelSelection = () => {
  const levels = [
    {
      level: "Beginner",
      description: "For those just starting out",
      path: "/quiz/level/beginner/stage",
    },
    {
      level: "Intermediate",
      description: "For those with some experience",
      path: "/quiz/level/intermediate/stage",
    },
    {
      level: "Advanced",
      description: "For experienced learners",
      path: "/quiz/level/advanced/stage",
    },
  ];

  return (
    <section className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Select Your Level</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((level, idx) => (
          <Link
            key={idx}
            href={level.path}
            className="p-6 border rounded-lg hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{level.level}</h2>
            <p className="text-gray-600">{level.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LevelSelection;
