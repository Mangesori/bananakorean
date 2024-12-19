import React from "react";
import useQuizStore from "@/store/useQuizStore";

// ...existing code...

const LevelQuiz = () => {
  const { level, setLevel } = useQuizStore();

  // ...existing code...

  return (
    <div>
      {/* Full-Level Quiz 구현 */}
      {/* ...existing code... */}
    </div>
  );
};

// ...existing code...

export default LevelQuiz;
