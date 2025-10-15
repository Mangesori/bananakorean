'use client';

import mobileMenu from '@/libs/mobileMenu';
import { useEffect } from 'react';
import { Menu } from 'lucide-react';

const MobileMenuOpen = () => {
  useEffect(() => {
    mobileMenu();
  }, []);
  return (
    <button className="open-mobile-menu text-darkdeep1 hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor">
      <Menu size={24} />
    </button>
  );
};

export default MobileMenuOpen;
