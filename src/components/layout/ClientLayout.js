'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/layout/header/Header';
import FixedShadow from '@/components/shared/others/FixedShadow';
import PreloaderPrimary from '@/components/shared/others/PreloaderPrimary';
import { AuthProvider } from '@/lib/supabase/hooks';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProfileProvider } from '@/contexts/UserProfileContext';
import { usePathname, useSearchParams } from 'next/navigation';

function PathTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (
        !pathname.includes('/login') &&
        !pathname.includes('/signup') &&
        !pathname.includes('/auth/callback')
      ) {
        const currentPath = pathname || '/';

        if (!currentPath.includes('/dashboards/')) {
          localStorage.setItem('previousPath', currentPath);
          localStorage.setItem('loginRedirect', currentPath);
        }
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProfileProvider>
          <PreloaderPrimary />
          <FixedShadow />
          <Suspense fallback={null}>
            <PathTracker />
          </Suspense>
          {children}
        </UserProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
