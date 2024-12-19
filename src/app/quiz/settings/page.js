import QuizSettings from "@/components/sections/quiz/QuizSettings";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";

const QuizSettingsPage = () => {
  return (
    <PageWrapper>
      <main>
        <QuizSettings />
      </main>
    </PageWrapper>
  );
};

export default QuizSettingsPage;
