import MaintenanceMain from '@/components/layout/main/MaintenanceMain';
import ThemeController from '@/components/shared/others/ThemeController';

export const metadata = {
  title: 'Maintenance - Dark',
  description: 'Maintenance - Dark',
};
const Maintenance_Dark = () => {
  return (
    <main className="is-dark">
      <MaintenanceMain />
    </main>
  );
};

export default Maintenance_Dark;
