'use client';

import { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { createClient } from './client';

/**
 * 인증 컨텍스트 타입 정의
 */
type AuthContextType = {
  user: (User & { role?: string; name?: string }) | null;
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
// 인증 디버그 로깅 함수 (주요 이벤트만)
const logAuth = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    const importantEvents = ['사용자 로그인', '사용자 로그아웃', '인증 초기화 오류', '세션 갱신 실패'];
    if (importantEvents.some(event => message.includes(event))) {
      console.log(`[AUTH] ${message}`, data || '');
    }
  }
};

// 브라우저 환경 확인
const isBrowser = () => typeof window !== 'undefined';

/**
 * 프로필 정보 가져오기 헬퍼 함수
 */
const fetchProfileData = async (userId: string) => {
  try {
    const supabase = createClient();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role, name')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('프로필 정보 가져오기 실패:', error);
      return null;
    }

    return profile;
  } catch (err) {
    console.error('프로필 조회 중 오류:', err);
    return null;
  }
};

/**
 * 인증 제공자 컴포넌트
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<(User & { role?: string; name?: string }) | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();
  const initializingRef = useRef(false);
  const initializedRef = useRef(false);

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
      setIsLoading(true);

      const supabase = createClient();
      if (!supabase) {
        throw new Error('Supabase 클라이언트를 초기화할 수 없습니다.');
      }

      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (data?.session) {
        await tryRefreshExpiringSession(supabase, data.session);
        setSession(data.session);

        // 프로필 정보 가져와서 병합
        const profile = await fetchProfileData(data.session.user.id);
        console.log('✅ Profile loaded:', profile);
        const enrichedUser = {
          ...data.session.user,
          role: profile?.role,
          name: profile?.name,
        };
        console.log('✅ Enriched user:', { id: enrichedUser.id, email: enrichedUser.email, role: enrichedUser.role, name: enrichedUser.name });
        setUser(enrichedUser);

        setRetryCount(0);
        updateAuthReadyIndicator(true);
      } else {
        await handleNoSession(supabase);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '세션 갱신 중 오류가 발생했습니다.';
      logAuth('세션 갱신 실패', errorMessage);
      setError(errorMessage);

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
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);

    if (expiresAt && expiresAt - now < 600) {
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

      if (!refreshError && refreshData.session) {
        setSession(refreshData.session);

        // 프로필 정보 가져와서 병합
        const profile = await fetchProfileData(refreshData.session.user.id);
        setUser({
          ...refreshData.session.user,
          role: profile?.role,
          name: profile?.name,
        });

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
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError || !refreshData.session) {
      handleMissingSession();
    } else {
      setSession(refreshData.session);

      // 프로필 정보 가져와서 병합
      const profile = await fetchProfileData(refreshData.session.user.id);
      setUser({
        ...refreshData.session.user,
        role: profile?.role,
        name: profile?.name,
      });

      updateAuthReadyIndicator(true);
      setRetryCount(0);
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

    setRetryCount(prev => prev + 1);
    await refreshSession();
  }, [refreshSession, retryCount]);

  /**
   * 로그아웃 함수
   */
  const signOut = useCallback(async () => {
    try {
      const supabase = createClient();

      if (!supabase) {
        throw new Error('Supabase 클라이언트를 초기화할 수 없습니다');
      }

      await supabase.auth.signOut({ scope: 'local' });
      logAuth('사용자 로그아웃');

      setUser(null);
      setSession(null);
      cleanupAfterSignOut();

      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그아웃 중 오류가 발생했습니다.';
      setError(errorMessage);

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

    updateAuthReadyIndicator(false);

    try {
      localStorage.removeItem('supabase-auth-token');
      localStorage.removeItem('supabase.auth.token');
      document.cookie = 'app_auth_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } catch (e) {
      // 무시
    }
  };

  /**
   * 인증 상태 변경 구독 설정
   */
  const setupAuthSubscription = (supabase: any) => {
    try {
      if (!supabase) return null;

      const { data } = supabase.auth.onAuthStateChange(
        async (event: AuthChangeEvent, currentSession: Session | null) => {
          handleAuthStateChange(event, currentSession);
        }
      );

      return data.subscription;
    } catch (error) {
      return null;
    }
  };

  /**
   * 인증 상태 변경 처리
   */
  const handleAuthStateChange = (event: AuthChangeEvent, currentSession: Session | null) => {
    // 주요 이벤트만 로깅
    if (event === 'SIGNED_IN') {
      logAuth('사용자 로그인', currentSession?.user?.email);
    } else if (event === 'SIGNED_OUT') {
      logAuth('사용자 로그아웃');
    }

    if (currentSession) {
      setSession(currentSession);

      // 프로필 정보 가져와서 병합
      fetchProfileData(currentSession.user.id).then(profile => {
        setUser({
          ...currentSession.user,
          role: profile?.role,
          name: profile?.name,
        });
      });

      storeDebugInfo(currentSession);
    } else {
      setSession(null);
      setUser(null);
    }

    setIsLoading(false);
  };

  /**
   * 디버깅 정보 저장
   */
  const storeDebugInfo = (currentSession: Session) => {
    if (!isBrowser()) return;

    try {
      localStorage.setItem('debug_session_info', 'active');
      localStorage.setItem('debug_user_email', currentSession.user.email || 'unknown');
    } catch (e) {
      // 무시
    }
  };

  // 초기 세션 로드 및 세션 변경 구독
  useEffect(() => {
    // 이미 초기화 중이거나 완료되었으면 중복 실행 방지
    if (initializingRef.current || initializedRef.current) return;

    initializingRef.current = true;
    const supabase = createClient();
    let authSubscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase 클라이언트를 초기화할 수 없습니다');
        }

        await refreshSession();
        initializedRef.current = true;
      } catch (error) {
        logAuth('인증 초기화 오류', error);
      } finally {
        initializingRef.current = false;
      }
    };

    initializeAuth();
    authSubscription = setupAuthSubscription(supabase);

    return () => {
      authSubscription?.unsubscribe();
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
