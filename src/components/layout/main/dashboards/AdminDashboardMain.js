import AdminFeedbacks from '@/components/sections/sub-section/dashboards/AdminFeedbacks';
import CounterAdmin from '@/components/sections/sub-section/dashboards/CounterAdmin';
import NoticeBoard from '@/components/sections/sub-section/dashboards/NoticeBoard';
import Notifications from '@/components/sections/sub-section/dashboards/Notifications';
import ChartDashboard from '@/components/shared/dashboards/ChartDashboard';
import AdminQuizPrimary from '@/components/sections/sub-section/dashboards/AdminQuizPrimary';

const AdminDashboardMain = () => {
  return (
    <>
      <CounterAdmin />
      {/* <ChartDashboard /> */}
      {/* <div className="grid grid-cols-1 xl:grid-cols-2 gap-30px"></div> */}

      {/* <div className="grid grid-cols-1 xl:grid-cols-2 gap-30px">
        <NoticeBoard />
        <Notifications />
      </div> */}

      {/* Recent Quiz Attempts for Review */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-blackColor dark:text-blackColor-dark mb-4">Recent Quiz Attempts</h3>
        <AdminQuizPrimary />
      </div>

      {/* <AdminFeedbacks /> */}
    </>
  );
};

export default AdminDashboardMain;
