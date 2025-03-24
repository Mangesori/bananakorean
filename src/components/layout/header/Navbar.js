'use client';
import { usePathname } from 'next/navigation';
import NavItems from './NavItems';
import NavbarLogo from './NavbarLogo';
import NavbarRight from './NavbarRight';
import useIsTrue from '@/hooks/useIsTrue';

const Navbar = () => {
  const isHome1 = useIsTrue('/');
  const isHome1Dark = useIsTrue('/home-1-dark');

  return (
    <div className="transition-all duration-500 sticky-header z-[1000] bg-whitegrey2 dark:bg-whiteColor-dark">
      <nav>
        <div className="py-15px lg:py-0 px-15px lg:container 3xl:container2-lg 4xl:container mx-auto relative">
          <div className="grid grid-cols-2 lg:grid-cols-12 items-center gap-15px">
            {/* navbar left */}
            <NavbarLogo />
            {/* Main menu */}
            <NavItems />

            {/* navbar right */}
            <NavbarRight />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
