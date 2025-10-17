import ZoomMeetingsMain from '@/components/layout/main/ZoomMeetingsMain';
import ThemeController from '@/components/shared/others/ThemeController';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
export const metadata = {
  title: 'Zoom Meetings - Dark',
  description: 'Zoom Meetings - Dark',
};
const Zoom_Meetings_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <ZoomMeetingsMain />
      </main>
    </PageWrapper>
  );
};

export default Zoom_Meetings_Dark;
