import Image from 'next/image';

const {
  default: MaintenacePrimary,
} = require('@/components/sections/maintenace/MaintenacePrimary');

const MaintenanceMain = () => {
  return (
    <>
      <MaintenacePrimary />;
    </>
  );
};

export default MaintenanceMain;
