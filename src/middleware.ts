import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// 인증이 필요한 경로
const PROTECTED_ROUTES = ['/dashboards'];

// 인증된 사용자가 접근할 수 없는 경로 (이미 로그인한 경우)
const AUTH_ROUTES = ['/auth/login', '/auth/signup', '/auth/reset-password'];

// 존재하지 않는 auth 경로 처리 (null, undefined 등의 잘못된 파라미터가 들어온 경우)
const INVALID_AUTH_PATHS = ['/auth/null', '/auth/undefined'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Supabase 클라이언트 생성 (SSR 패키지 사용)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // 현재 요청 경로
  const { pathname } = request.nextUrl;

  // GET 요청시 세션 자동 갱신 (Sliding Window 방식)
  if (request.method === 'GET') {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      // 세션 토큰 갱신 (Supabase가 자동으로 만료 임박 시 갱신)
      await supabase.auth.refreshSession();
    }
  }

  // 세션 및 사용자 정보 가져오기 (보안을 위해 getUser 사용)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 사용자 역할 가져오기 (JWT user_metadata에서)
  const userRole = user?.user_metadata?.role || 'student';

  // 존재하지 않는 auth 경로에 접근하는 경우 - 홈으로 리디렉션
  if (INVALID_AUTH_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 보호된 경로에 인증되지 않은 사용자가 접근하는 경우
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) && !user) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 인증 경로에 이미 인증된 사용자가 접근하는 경우
  if (AUTH_ROUTES.some(route => pathname.startsWith(route)) && user) {
    const redirectPath =
      userRole === 'admin'
        ? '/dashboards/admin-dashboard'
        : '/dashboards/student-dashboard';

    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // 역할 검사: 관리자 전용 경로에 학생이 접근하는 경우 차단
  if (pathname.includes('/dashboards/admin-') && user && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboards/student-dashboard', request.url));
  }

  // 역할 검사: 학생 전용 경로에 관리자가 접근하는 경우 관리자 대시보드로 리디렉션
  if (pathname.includes('/dashboards/student-') && user && userRole === 'admin' && !pathname.includes('/dashboards/student-message')) {
    return NextResponse.redirect(new URL('/dashboards/admin-dashboard', request.url));
  }

  return response;
}

// 미들웨어가 실행될 경로 패턴 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for those starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api folder (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
