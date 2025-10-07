'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header/Header';
import FixedShadow from '@/components/shared/others/FixedShadow';
import PreloaderPrimary from '@/components/shared/others/PreloaderPrimary';
import { AuthProvider } from '@/lib/supabase/hooks';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProfileProvider } from '@/contexts/UserProfileContext';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 로그인, 회원가입, 콜백 페이지가 아닐 때만 현재 경로를 저장
      if (
        !pathname.includes('/login') &&
        !pathname.includes('/signup') &&
        !pathname.includes('/auth/callback')
      ) {
        const currentPath = pathname || '/';
        console.log('Current path:', currentPath);

        // 현재 경로가 대시보드가 아닌 경우에만 저장
        if (!currentPath.includes('/dashboards/')) {
          console.log('Saving path for redirect:', currentPath);
          localStorage.setItem('previousPath', currentPath);
          localStorage.setItem('loginRedirect', currentPath);
        }
      }
    }
  }, [pathname, searchParams]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProfileProvider>
          <PreloaderPrimary />
          <FixedShadow />
          {children}
        </UserProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
