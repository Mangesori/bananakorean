import React from "react";
import Link from "next/link";

const StageSelection = ({ levelId }) => {
  const stages = [
    {
      stage: "Stage 1",
      description: "Basic concepts and vocabulary",
      path: `/quiz/solve?type=level&level=${levelId}&stage=1`,
    },
    {
      stage: "Stage 2",
      description: "Intermediate concepts",
      path: `/quiz/solve?type=level&level=${levelId}&stage=2`,
    },
    {
      stage: "Stage 3",
      description: "Advanced concepts",
      path: `/quiz/solve?type=level&level=${levelId}&stage=3`,
    },
  ];

  return (
    <section className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">
        Select Stage - {levelId.charAt(0).toUpperCase() + levelId.slice(1)}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stages.map((stage, idx) => (
          <Link
            key={idx}
            href={stage.path}
            className="p-6 border rounded-lg hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{stage.stage}</h2>
            <p className="text-gray-600">{stage.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default StageSelection;
