import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * OAuth 콜백 처리를 위한 Route Handler
 * - 서버 사이드에서 안전하게 인증 코드 교환
 * - 프로필 조회 및 역할 기반 리디렉션
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');
  const roleParam = requestUrl.searchParams.get('role'); // 소셜 가입 시 전달된 역할

  console.log('[AUTH-CALLBACK] Route handler called:', { code: !!code, next, role: roleParam });

  // 인증 코드가 없으면 로그인 페이지로
  if (!code) {
    console.error('[AUTH-CALLBACK] No code provided');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const cookieStore = await cookies();

    // Supabase 서버 클라이언트 생성
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set(name, value, options);
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set(name, '', options);
          },
        },
      }
    );

    // 인증 코드를 세션으로 교환
    console.log('[AUTH-CALLBACK] Exchanging code for session');
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('[AUTH-CALLBACK] Exchange error:', exchangeError);
      throw exchangeError;
    }

    if (!data.user) {
      console.error('[AUTH-CALLBACK] No user found after exchange');
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }

    console.log('[AUTH-CALLBACK] Session exchange successful, user:', data.user.id);

    // 사용자 프로필 조회
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    // 프로필이 없는 경우 (신규 소셜 가입자) 생성
    if (profileError && profileError.code === 'PGRST116') {
      console.log('[AUTH-CALLBACK] Creating new profile for social signup');
      const newRole = (roleParam && ['student', 'teacher'].includes(roleParam)) ? roleParam : 'student';

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          role: newRole,
        });

      if (insertError) {
        console.error('[AUTH-CALLBACK] Failed to create profile:', insertError);
      } else {
        console.log('[AUTH-CALLBACK] Profile created with role:', newRole);
      }
    } else if (profileError) {
      console.error('[AUTH-CALLBACK] Profile error:', profileError);
    }

    // next 파라미터 검증 - null, undefined, 또는 빈 문자열인 경우 무시
    const isValidNextParam = next && next !== 'null' && next.trim() !== '';

    // 역할에 따른 리디렉션 경로 결정
    const role = profileData?.role || data.user?.user_metadata?.role || roleParam || 'student';
    const redirectPath = isValidNextParam
      ? next
      : role === 'admin'
        ? '/dashboards/admin-dashboard'
        : role === 'teacher'
        ? '/dashboards/teacher-dashboard'
        : '/dashboards/student-dashboard';

    console.log('[AUTH-CALLBACK] Redirecting to:', redirectPath);

    // 리디렉션
    return NextResponse.redirect(new URL(redirectPath, request.url));
  } catch (error) {
    console.error('[AUTH-CALLBACK] Error:', error);

    // 오류 발생 시 로그인 페이지로 (에러 메시지 포함)
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('error', '인증 처리 중 오류가 발생했습니다.');
    return NextResponse.redirect(loginUrl);
  }
}
