import ZoomMeetingsMain from '@/components/layout/main/ZoomMeetingsMain';
import ThemeController from '@/components/shared/others/ThemeController';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';

export const metadata = {
  title: 'Zoom Meetings',
  description: 'Zoom Meetings',
};
const Zoom_Meetings = () => {
  return (
    <PageWrapper>
      <main>
        <ZoomMeetingsMain />
      </main>
    </PageWrapper>
  );
};

export default Zoom_Meetings;
