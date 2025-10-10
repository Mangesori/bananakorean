'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = searchParams?.get('code');
      const nextParam = searchParams?.get('next');

      console.log('[AUTH-CALLBACK] Starting callback handling', { code: !!code, nextParam });

      try {
        if (code) {
          // 인증 코드 교환
          console.log('[AUTH-CALLBACK] Exchanging code for session');
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error('[AUTH-CALLBACK] Exchange error:', exchangeError);
            throw exchangeError;
          }

          console.log('[AUTH-CALLBACK] Exchange successful, user:', data.user?.id);

          // 사용자 정보 가져오기 (보안을 위해 getUser 사용)
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError) {
            console.error('[AUTH-CALLBACK] User error:', userError);
            throw userError;
          }

          if (user) {
            console.log('[AUTH-CALLBACK] User authenticated:', user.id);

            // 사용자 프로필 정보 조회
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .single();

            if (profileError) {
              console.error('[AUTH-CALLBACK] Profile error:', profileError);
            }

            // next 파라미터 검증 - null, undefined, 또는 빈 문자열인 경우 무시
            const isValidNextParam = nextParam && nextParam !== 'null' && nextParam.trim() !== '';

            // 유효한 next 파라미터가 있거나 역할에 따라 적절한 대시보드로 리디렉션
            const redirectUrl = isValidNextParam
              ? nextParam
              : profileData?.role === 'admin'
                ? '/dashboards/admin-dashboard'
                : '/dashboards/student-dashboard';

            console.log('[AUTH-CALLBACK] Redirecting to:', redirectUrl);
            router.push(redirectUrl);
            router.refresh(); // 페이지 새로고침하여 상태 업데이트
          } else {
            console.error('[AUTH-CALLBACK] No user found after exchange');
            router.push('/auth/login');
          }
        } else {
          console.error('[AUTH-CALLBACK] No code provided');
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('[AUTH-CALLBACK] Error:', error);
        // 오류 발생 시 기본 경로로 리디렉션
        router.push('/dashboards/student-dashboard');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [supabase, searchParams, router]);

  // 로딩 화면 표시
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f9fafb',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          ></div>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>로그인 처리 중...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return null;
}
