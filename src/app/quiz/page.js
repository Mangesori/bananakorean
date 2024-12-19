import QuizTypeSelection from "@/components/sections/quiz/QuizTypeSelection";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";

export const metadata = {
  title: "Quiz",
  description: "Choose your quiz type",
};

const QuizPage = () => {
  return (
    <PageWrapper>
      <main>
        <QuizTypeSelection />
      </main>
    </PageWrapper>
  );
};

export default QuizPage;
