import GrammarTopicSelection from "@/components/sections/quiz/GrammarTopicSelection";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";

export const metadata = {
  title: "Grammar Quiz | Edurock - Education LMS Template",
  description: "Grammar Quiz | Edurock - Education LMS Template",
};

const GrammarQuizPage = () => {
  return (
    <PageWrapper>
      <main>
        <GrammarTopicSelection />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default GrammarQuizPage;
