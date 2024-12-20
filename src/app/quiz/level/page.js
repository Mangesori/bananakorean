import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";

export const metadata = {
  title: "Full-Level Quiz ",
  description: "Full-Level Quiz",
};

const LevelQuizPage = () => {
  return (
    <PageWrapper>
      <main>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default LevelQuizPage;
