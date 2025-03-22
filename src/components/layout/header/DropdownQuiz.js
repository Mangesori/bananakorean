import React from 'react';
import Link from 'next/link';

const DropdownQuiz = () => {
  const quizLevels = [
    {
      level: 'Beginner',
      path: '/quizzes/beginner',
      stages: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5'],
    },
    {
      level: 'Intermediate',
      path: '/quizzes/intermediate',
      stages: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5'],
    },
    {
      level: 'Advanced',
      path: '/quizzes/advanced',
      stages: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5'],
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow-lg min-w-[600px]">
      {quizLevels.map((level, idx) => (
        <div key={idx} className="p-4">
          <Link href={level.path} className="text-mainText font-bold hover:text-primary">
            {level.level}
          </Link>
          <ul className="mt-2 space-y-2">
            {level.stages.map((stage, stageIdx) => (
              <li key={stageIdx}>
                <Link
                  href={`${level.path}/stage-${stageIdx + 1}`}
                  className="text-bodyColor hover:text-primary"
                >
                  {stage}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="p-4">
        <Link
          href="/quiz/grammar" // Add link to Grammar Quiz
          className="text-mainText font-bold hover:text-primary"
        >
          Grammar Quiz
        </Link>
      </div>
    </div>
  );
};

export default DropdownQuiz;
