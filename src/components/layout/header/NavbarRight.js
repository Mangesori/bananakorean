'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import MobileMenuOpen from '@/components/shared/buttons/MobileMenuOpen';
import { useAuth } from '@/lib/supabase/hooks';
import MessageDropdownStudent from './MessageDropdownStudent';
import MessageDropdownAdmin from './MessageDropdownAdmin';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import UserAvatar from '@/components/shared/UserAvatar';
import { Mail, Bell, ChevronDown, ChevronUp } from 'lucide-react';

const NavbarRight = () => {
  const [showMessages, setShowMessages] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { user, isLoading, signOut, refreshSession } = useAuth();
  const { userName } = useUserProfile();
  const { openLoginModal, openSignUpModal } = useAuthModal();
  const router = useRouter();
  const dropdownRef = useRef(null);
  const refreshedRef = useRef(false);
  const scrollPositionRef = useRef(0);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 페이지 로드 시 세션 갱신 (Server Action redirect 후)
  useEffect(() => {
    if (!refreshedRef.current && !user && !isLoading) {
      refreshedRef.current = true;
      console.log('[NavbarRight] Refreshing session on mount');
      refreshSession();
    }
  }, [user, isLoading, refreshSession]);

  // 클릭 외부 처리
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 메시지 드롭다운 열릴 때 스크롤 위치 보존
  useEffect(() => {
    if (showMessages) {
      // 현재 스크롤 위치 저장
      scrollPositionRef.current = window.scrollY;

      // 다음 프레임에서 스크롤 복원
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
      });

      // 추가 보험: 100ms 후에도 복원
      const timer = setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [showMessages]);

  // 로그아웃 처리
  const handleSignOut = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await signOut();
      router.push('/');
    } catch (error) {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 설정 URL 가져오기
  const getSettingsUrl = () => {
    if (!user) return '/auth/login';
    return user.role === 'admin' ? '/dashboards/admin-settings' : '/dashboards/student-settings';
  };

  return (
    <div className="lg:col-start-10 lg:col-span-3">
      <ul className="relative nav-list flex justify-end items-center gap-3">
        {isLoading ? (
          // 로딩 UI
          <li className="hidden lg:flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div>
          </li>
        ) : user ? (
          <>
            {/* 메시지 버튼 - 모바일과 데스크톱 모두 표시 */}
            <li>
              <button
                className="text-lg text-mainText hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  // 모바일에서는 바로 메시지 페이지로 이동
                  if (isMobile) {
                    const messagePage = user?.role === 'admin'
                      ? '/dashboards/admin-message'
                      : '/dashboards/student-message';
                    router.push(messagePage);
                  } else {
                    // 데스크톱에서는 드롭다운 표시
                    setShowMessages(!showMessages);
                  }
                }}
              >
                <Mail size={20} className="mt-1" />
              </button>
              {/* 데스크톱에서만 드롭다운 표시 */}
              {showMessages && !isMobile && (
                <div className="absolute right-0 top-full mt-5 z-50">
                  {user?.role === 'admin' ? (
                    <MessageDropdownAdmin
                      onClose={() => setShowMessages(false)}
                      isMobile={false}
                    />
                  ) : (
                    <MessageDropdownStudent
                      onClose={() => setShowMessages(false)}
                      isMobile={false}
                    />
                  )}
                </div>
              )}
            </li>

            {/* 알림 버튼 */}
            <li className="hidden lg:block ml-2 mr-2">
              <button className="text-lg text-mainText hover:text-primary transition-colors">
                <Bell size={20} className="mt-1" />
              </button>
            </li>

            {/* 프로필 드롭다운 */}
            <li className="hidden lg:block relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-mainText hover:text-primary transition-colors"
              >
                <UserAvatar name={userName || user?.email} size={40} />
                <span className="text-size-12 2xl:text-size-15">
                  {userName || user?.email}
                </span>
                {isDropdownOpen ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-200px bg-white dark:bg-dark border border-borderColor dark:border-borderColor-dark rounded-md shadow-lg z-50">
                  <div className="p-3 border-b border-borderColor dark:border-borderColor-dark">
                    <p className="text-blackColor dark:text-blackColor-dark font-medium">
                      {userName || 'User'}
                    </p>
                    <p className="text-sm text-contentColor dark:text-contentColor-dark">
                      {user?.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href={
                        user?.role === 'admin'
                          ? '/dashboards/admin-dashboard'
                          : '/dashboards/student-dashboard'
                      }
                      className="block px-4 py-2 text-sm text-contentColor dark:text-contentColor-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href={
                        user?.role === 'admin'
                          ? '/dashboards/admin-profile'
                          : '/dashboards/student-profile'
                      }
                      className="block px-4 py-2 text-sm text-contentColor dark:text-contentColor-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href={getSettingsUrl()}
                      className="block px-4 py-2 text-sm text-contentColor dark:text-contentColor-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      disabled={isLoggingOut}
                      className="block w-full text-left px-4 py-2 text-sm text-contentColor dark:text-contentColor-dark hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                    >
                      {isLoggingOut ? 'Signing out...' : 'Sign out'}
                    </button>
                  </div>
                </div>
              )}
            </li>
          </>
        ) : (
          <>
            {/* 로그인/회원가입 버튼 */}
            <li className="hidden lg:block">
              <button
                onClick={openLoginModal}
                className="whitespace-nowrap text-size-12 2xl:text-size-15 text-primaryColor bg-transparent border-2 border-primaryColor block px-15px py-2 rounded-xl hover:bg-primaryColor hover:text-whiteColor transition-colors -mt-2"
              >
                Log In
              </button>
            </li>
            <li className="hidden lg:block relative">
              <button
                onClick={openSignUpModal}
                className="whitespace-nowrap text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor border-2 border-primaryColor block px-15px py-2 rounded-xl hover:bg-transparent hover:text-primaryColor transition-colors -mt-2"
              >
                Sign Up
              </button>
            </li>
          </>
        )}
        <li className="block lg:hidden ml-3">
          <MobileMenuOpen />
        </li>
      </ul>
    </div>
  );
};

export default NavbarRight;
