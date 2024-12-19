import StageSelection from "@/components/section/quiz/StageSelection";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";

export const metadata = {
  title: "Stage Selection | Edurock",
  description: "Select quiz stage",
};

const StagePage = ({ params }) => {
  return (
    <PageWrapper>
      <main>
        <StageSelection levelId={params.levelId} />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default StagePage;
