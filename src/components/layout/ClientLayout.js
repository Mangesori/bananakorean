'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/layout/header/Header';
import FixedShadow from '@/components/shared/others/FixedShadow';
import PreloaderPrimary from '@/components/shared/others/PreloaderPrimary';
import { AuthProvider } from '@/lib/supabase/hooks';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProfileProvider } from '@/contexts/UserProfileContext';
import { usePathname, useSearchParams } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

// QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분간 데이터를 신선하다고 간주
      cacheTime: 10 * 60 * 1000, // 10분간 캐시 유지
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 갱신 비활성화
      retry: 1, // 실패 시 1번만 재시도
    },
  },
});

export default function ClientLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
