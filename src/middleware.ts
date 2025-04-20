import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// 인증이 필요한 경로
const PROTECTED_ROUTES = ['/dashboards', '/profile', '/settings'];

// 인증된 사용자가 접근할 수 없는 경로 (이미 로그인한 경우)
const AUTH_ROUTES = ['/auth/login', '/auth/signup', '/auth/reset-password'];

// 존재하지 않는 auth 경로 처리 (null, undefined 등의 잘못된 파라미터가 들어온 경우)
const INVALID_AUTH_PATHS = ['/auth/null', '/auth/undefined'];

export async function middleware(request: NextRequest) {
  // 응답 객체 생성
  const response = NextResponse.next();

  // Supabase 클라이언트 생성
  const supabase = createMiddlewareClient({ req: request, res: response });

  // 현재 세션 가져오기
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 현재 요청 경로
  const { pathname } = request.nextUrl;

  // 존재하지 않는 auth 경로에 접근하는 경우 - 홈으로 리디렉션
  if (INVALID_AUTH_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 보호된 경로에 인증되지 않은 사용자가 접근하는 경우
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) && !session) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 인증 경로에 이미 인증된 사용자가 접근하는 경우
  if (AUTH_ROUTES.some(route => pathname.startsWith(route)) && session) {
    try {
      // 사용자 프로필 정보 조회
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      // 사용자 역할에 따른 리디렉션
      const redirectPath =
        profileData?.role === 'admin'
          ? '/dashboards/admin-dashboard'
          : '/dashboards/student-dashboard';

      return NextResponse.redirect(new URL(redirectPath, request.url));
    } catch (error) {
      // 오류 발생 시 기본 경로로 리디렉션
      return NextResponse.redirect(new URL('/dashboards/student-dashboard', request.url));
    }
  }

  // 역할 검사: 관리자 전용 경로에 학생이 접근하는 경우 차단
  if (pathname.includes('/dashboards/admin-') && session) {
    try {
      // 사용자 프로필 정보 조회
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      // 관리자가 아닌데 관리자 페이지에 접근하면 학생 대시보드로 리디렉션
      if (profileData?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboards/student-dashboard', request.url));
      }
    } catch (error) {
      // 오류 발생 시 기본 경로로 리디렉션
      return NextResponse.redirect(new URL('/dashboards/student-dashboard', request.url));
    }
  }

  // 역할 검사: 학생 전용 경로에 관리자가 접근하는 경우 관리자 대시보드로 리디렉션
  if (pathname.includes('/dashboards/student-') && session) {
    try {
      // 사용자 프로필 정보 조회
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      // 학생이 아닌데 학생 페이지에 접근하면 관리자 대시보드로 리디렉션
      if (profileData?.role === 'admin' && !pathname.includes('/dashboards/student-message')) {
        return NextResponse.redirect(new URL('/dashboards/admin-dashboard', request.url));
      }
    } catch (error) {
      // 무시: 오류 발생 시 원래 페이지로 진행
    }
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
