import LevelQuiz from "@/components/sections/quiz/LevelQuiz";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";

export const metadata = {
  title: "Full-Level Quiz | Edurock - Education LMS Template",
  description: "Full-Level Quiz | Edurock - Education LMS Template",
};

const LevelQuizPage = () => {
  return (
    <PageWrapper>
      <main>
        <LevelQuiz />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default LevelQuizPage;
