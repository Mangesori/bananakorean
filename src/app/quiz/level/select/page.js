import LevelSelection from "@/components/sections/quiz/LevelSelection";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";

export const metadata = {
  title: "Level Selection",
  description: "Select your quiz difficulty level",
};

const LevelPage = () => {
  return (
    <PageWrapper>
      <main>
        <LevelSelection />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default LevelPage;
