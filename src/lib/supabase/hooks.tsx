'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { createClient } from './client';

/**
 * 인증 컨텍스트 타입 정의
 */
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  retryAuth: () => Promise<void>;
};

// 기본값 설정
const initialContext: AuthContextType = {
  user: null,
  session: null,
  isLoading: true,
  error: null,
  signOut: async () => {},
  refreshSession: async () => {},
  retryAuth: async () => {},
};

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType>(initialContext);

/**
 * 유틸리티 함수
 */
// 인증 디버그 로깅 함수
const logAuth = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AUTH-PROVIDER] ${message}`, data || '');
  }
};

// 브라우저 환경 확인
const isBrowser = () => typeof window !== 'undefined';

/**
 * 인증 제공자 컴포넌트
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();

  /**
   * DOM 인증 상태 업데이트 헬퍼 함수
   */
  const updateAuthReadyIndicator = useCallback((isReady: boolean) => {
    if (!isBrowser()) return;

    const authReadyIndicator = document.getElementById('auth-ready-indicator');
    if (authReadyIndicator) {
      authReadyIndicator.setAttribute('data-auth-ready', isReady ? 'true' : 'false');
      authReadyIndicator.setAttribute('data-auth-initialized', 'true');
    }
  }, []);

  /**
   * 쿠키 기반 인증 상태 확인 헬퍼 함수
   */
  const checkAuthStateCookie = useCallback(() => {
    try {
      if (!isBrowser()) return false;

      const authStateCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('app_auth_state='));

      if (authStateCookie && authStateCookie.includes('authenticated')) {
        logAuth('쿠키로 인증 상태 확인', '인증됨');
        return true;
      }

      logAuth('쿠키 확인 결과: 인증 안됨');
      return false;
    } catch (e) {
      logAuth('쿠키 확인 중 오류', e);
      return false;
    }
  }, []);

  /**
   * 세션 없음 처리 헬퍼 함수
   */
  const handleMissingSession = useCallback(() => {
    setSession(null);
    setUser(null);
    updateAuthReadyIndicator(false);

    // 로그인이 필요한 페이지 리디렉션 처리
    if (isBrowser()) {
      const currentPath = window.location.pathname;
      const isProtectedRoute =
        currentPath.includes('/dashboards/') &&
        !currentPath.includes('/auth/login') &&
        !currentPath.includes('/auth/signup') &&
        !currentPath.includes('/auth/callback');

      if (isProtectedRoute) {
        localStorage.setItem('loginRedirect', currentPath);
        logAuth('인증 필요: 로그인 페이지로 이동', { from: currentPath });
        router.push('/auth/login');
      }
    }
  }, [router, updateAuthReadyIndicator]);

  /**
   * 세션 갱신 함수
   */
  const refreshSession = useCallback(async () => {
    try {
      logAuth('세션 갱신 시도 중');
      setIsLoading(true);

      const supabase = createClient();
      if (!supabase) {
        throw new Error('Supabase 클라이언트를 초기화할 수 없습니다.');
      }

      // 현재 세션 확인
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (data?.session) {
        // 유효한 세션이 있는 경우
        logAuth('유효한 세션 발견', { id: data.session.id, user: data.session.user.email });

        // 세션이 만료 10분 전이면 갱신 시도
        await tryRefreshExpiringSession(supabase, data.session);

        setSession(data.session);
        setUser(data.session.user);
        setRetryCount(0); // 성공 시 재시도 카운트 초기화
        updateAuthReadyIndicator(true);
      } else {
        // 세션이 없는 경우
        logAuth('세션 없음, 직접 세션 확인 시도');
        await handleNoSession(supabase);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '세션 갱신 중 오류가 발생했습니다.';
      logAuth('세션 갱신 중 오류', errorMessage);
      setError(errorMessage);

      // Supabase 서버 오류인 경우, 쿠키를 사용하여 최소한의 인증 상태 확인
      if (isBrowser()) {
        checkAuthStateCookie();
      }
    } finally {
      setIsLoading(false);
    }
  }, [router, updateAuthReadyIndicator, handleMissingSession, checkAuthStateCookie]);

  /**
   * 만료 임박한 세션 갱신 시도
   */
  const tryRefreshExpiringSession = async (supabase: any, session: Session) => {
    // 세션이 만료 10분 전이면 갱신 시도
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);

    if (expiresAt && expiresAt - now < 600) {
      logAuth('세션 만료 임박, 갱신 시도');
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) {
        logAuth('세션 갱신 실패', refreshError);
        // 갱신 실패해도 기존 세션 사용
      } else if (refreshData.session) {
        logAuth('세션 갱신 성공');
        setSession(refreshData.session);
        setUser(refreshData.session.user);
        updateAuthReadyIndicator(true);
        setRetryCount(0);
        return true;
      }
    }

    return false;
  };

  /**
   * 세션이 없는 경우 처리
   */
  const handleNoSession = async (supabase: any) => {
    // 세션 갱신 시도
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError) {
      logAuth('세션 갱신 실패', refreshError);
      handleMissingSession();
    } else if (refreshData.session) {
      logAuth('세션 갱신 성공');
      setSession(refreshData.session);
      setUser(refreshData.session.user);
      updateAuthReadyIndicator(true);
      setRetryCount(0);
    } else {
      logAuth('세션 없음 (갱신 후)');
      handleMissingSession();
    }
  };

  /**
   * 인증 재시도 함수
   */
  const retryAuth = useCallback(async () => {
    if (retryCount >= 3) {
      setError('인증 시도 횟수가 너무 많습니다. 나중에 다시 시도해주세요.');
      return;
    }

    logAuth('인증 재시도', { attempt: retryCount + 1 });
    setRetryCount(prev => prev + 1);
    await refreshSession();
  }, [refreshSession, retryCount]);

  /**
   * 로그아웃 함수
   */
  const signOut = useCallback(async () => {
    try {
      logAuth('로그아웃 시도');
      const supabase = createClient();

      if (!supabase) {
        throw new Error('Supabase 클라이언트를 초기화할 수 없습니다');
      }

      await supabase.auth.signOut({ scope: 'local' });
      logAuth('로그아웃 성공');

      // 모든 사용자 관련 상태 초기화
      setUser(null);
      setSession(null);

      // DOM 상태 및 로컬 스토리지 정리
      cleanupAfterSignOut();

      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그아웃 중 오류가 발생했습니다.';
      logAuth('로그아웃 중 오류', errorMessage);
      setError(errorMessage);

      // 심각한 오류일 경우 강제 로그아웃
      if (errorMessage.includes('Supabase 클라이언트') || errorMessage.includes('서버')) {
        setUser(null);
        setSession(null);
        if (isBrowser()) {
          window.location.href = '/';
        }
      }
    }
  }, [router, updateAuthReadyIndicator]);

  /**
   * 로그아웃 후 정리 작업
   */
  const cleanupAfterSignOut = () => {
    if (!isBrowser()) return;

    // DOM 상태 업데이트
    updateAuthReadyIndicator(false);

    // 로컬 스토리지 클리어
    try {
      localStorage.removeItem('supabase-auth-token');
      localStorage.removeItem('supabase.auth.token');

      // 쿠키 제거
      document.cookie = 'app_auth_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } catch (e) {
      logAuth('로컬 스토리지 클리어 중 오류', e);
    }
  };

  /**
   * 인증 상태 변경 구독 설정
   */
  const setupAuthSubscription = (supabase: any, setMounted: (value: boolean) => void) => {
    try {
      if (!supabase) return null;

      const { data } = supabase.auth.onAuthStateChange(
        async (event: AuthChangeEvent, currentSession: Session | null) => {
          logAuth('인증 상태 변경', { event, hasSession: !!currentSession });
          handleAuthStateChange(event, currentSession);
        }
      );

      logAuth('인증 상태 변경 구독 설정됨');
      return data.subscription;
    } catch (error) {
      logAuth('인증 상태 변경 구독 실패', error);
      return null;
    }
  };

  /**
   * 인증 상태 변경 처리
   */
  const handleAuthStateChange = (event: AuthChangeEvent, currentSession: Session | null) => {
    // 이벤트 유형별 추가 로깅
    logAuthEventDetails(event, currentSession);

    if (currentSession) {
      setSession(currentSession);
      setUser(currentSession.user);
      logAuth('세션 및 사용자 정보 업데이트됨', { id: currentSession.user.id });

      // 디버깅을 위해 세션 정보 저장
      storeDebugInfo(currentSession);
    } else {
      setSession(null);
      setUser(null);
      logAuth('세션 및 사용자 정보 초기화됨');
    }

    setIsLoading(false);
  };

  /**
   * 인증 이벤트 상세 로깅
   */
  const logAuthEventDetails = (event: AuthChangeEvent, currentSession: Session | null) => {
    switch (event) {
      case 'SIGNED_IN':
        logAuth('사용자 로그인 완료', {
          userId: currentSession?.user?.id,
          email: currentSession?.user?.email,
          provider: currentSession?.user?.app_metadata?.provider,
          expires: currentSession?.expires_at,
        });
        break;
      case 'SIGNED_OUT':
        logAuth('사용자 로그아웃 완료');
        break;
      case 'TOKEN_REFRESHED':
        logAuth('토큰 갱신됨', { expires: currentSession?.expires_at });
        break;
      case 'USER_UPDATED':
        logAuth('사용자 정보 업데이트됨');
        break;
      default:
        logAuth(`기타 인증 이벤트: ${event}`);
    }
  };

  /**
   * 디버깅 정보 저장
   */
  const storeDebugInfo = (currentSession: Session) => {
    if (!isBrowser()) return;

    try {
      // 디버깅 목적으로 세션 정보 저장 (보안에 주의)
      localStorage.setItem('debug_session_info', 'active');
      localStorage.setItem('debug_user_email', currentSession.user.email || 'unknown');
    } catch (e) {
      console.error('디버깅 정보 저장 중 오류:', e);
    }
  };

  // 초기 세션 로드 및 세션 변경 구독
  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    // 초기 세션 로드
    const initializeAuth = async () => {
      try {
        if (!mounted) return;

        if (!supabase) {
          throw new Error('Supabase 클라이언트를 초기화할 수 없습니다');
        }

        logAuth('인증 초기화 시작');
        await refreshSession();
        logAuth('인증 초기화 완료');
      } catch (error) {
        if (mounted) {
          logAuth('인증 초기화 오류', error);
        }
      }
    };

    initializeAuth();

    // 인증 상태 변경 구독
    authSubscription = setupAuthSubscription(supabase, value => (mounted = value));

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
        logAuth('인증 상태 변경 구독 해제됨');
      }
    };
  }, [refreshSession]);

  return (
    <AuthContext.Provider
      value={{ user, session, isLoading, error, signOut, refreshSession, retryAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 인증 정보 사용 훅
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
