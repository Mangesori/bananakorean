'use client';
import CopyRight from './CopyRight';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  return (
    <footer className={'bg-[#E0E0E0] 2xl:bg-cover'}>
      <div className={'pt-65px pb-5 lg:pb-10'}>
        {/* footer copyright  */}
        <CopyRight />
      </div>
    </footer>
  );
};

export default Footer;
