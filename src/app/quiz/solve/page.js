"use client";
import QuizSolver from "@/components/sections/quiz/QuizSolver";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";

const QuizSolverPage = () => {
  return (
    <PageWrapper>
      <main>
        <QuizSolver />
      </main>
    </PageWrapper>
  );
};

export default QuizSolverPage;
