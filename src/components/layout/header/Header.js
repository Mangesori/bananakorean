'use client';
import React, { useEffect } from 'react';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';
import AuthModal from '@/components/shared/modals/AuthModal';
import { useAuthModal } from '@/contexts/AuthModalContext';

import useIsTrue from '@/hooks/useIsTrue';
import Aos from 'aos';
import stickyHeader from '@/libs/stickyHeader';
import smoothScroll from '@/libs/smoothScroll';

const Header = () => {
  const isHome2 = useIsTrue('/home-2');
  const isHome2Dark = useIsTrue('/home-2-dark');
  const { isOpen, mode, closeModal } = useAuthModal();
  useEffect(() => {
    stickyHeader();
    smoothScroll();
    // AOS Scroll Animation
    Aos.init({
      offset: 1,
      duration: 1000,
      once: true,
      easing: 'ease',
    });
  }, []);
  return (
    <>
      <header>
        <div>
          {/* header top */}
          {/* navbar */}
          <Navbar />
          {/* mobile menu */}
          <MobileMenu />
        </div>
      </header>
      {/* Auth Modal */}
      <AuthModal isOpen={isOpen} mode={mode} onClose={closeModal} />
    </>
  );
};

export default Header;
