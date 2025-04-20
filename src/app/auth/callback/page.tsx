'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = searchParams?.get('code');
      const nextParam = searchParams?.get('next');

      try {
        if (code) {
          // 인증 코드 교환
          await supabase.auth.exchangeCodeForSession(code);

          // 현재 사용자 세션 가져오기
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session) {
            // 사용자 프로필 정보 조회
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();

            // next 파라미터 검증 - null, undefined, 또는 빈 문자열인 경우 무시
            const isValidNextParam = nextParam && nextParam !== 'null' && nextParam.trim() !== '';

            // 유효한 next 파라미터가 있거나 역할에 따라 적절한 대시보드로 리디렉션
            const redirectUrl = isValidNextParam
              ? nextParam
              : profileData?.role === 'admin'
                ? '/dashboards/admin-dashboard'
                : '/dashboards/student-dashboard';

            router.push(redirectUrl);
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        // 오류 발생 시 기본 경로로 리디렉션
        router.push('/dashboards/student-dashboard');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [supabase, searchParams, router]);

  // 로딩 화면을 표시하지 않고 빈 div 반환
  return (
    <div style={{ display: 'none' }}>
      {loading && <p>Processing authentication, please wait...</p>}
    </div>
  );
}
