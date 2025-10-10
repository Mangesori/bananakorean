'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import MobileMenuOpen from '@/components/shared/buttons/MobileMenuOpen';
import { useAuth } from '@/lib/supabase/hooks';
import MessageDropdown from './MessageDropdown';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/contexts/UserProfileContext';
import UserAvatar from '@/components/shared/UserAvatar';

const NavbarRight = () => {
  const [showMessages, setShowMessages] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { user, isLoading, signOut, refreshSession } = useAuth();
  const { userName } = useUserProfile();
  const router = useRouter();
  const dropdownRef = useRef(null);
  const refreshedRef = useRef(false);

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
            {/* 메시지 버튼 */}
            <li className="hidden lg:block">
              <button
                className="text-lg text-mainText hover:text-primary transition-colors"
                onClick={() => setShowMessages(!showMessages)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="28"
                  viewBox="0 -5 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-mail"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </button>
              {showMessages && (
                <div className="absolute right-0 top-full mt-5 z-50">
                  <MessageDropdown onClose={() => setShowMessages(false)} />
                </div>
              )}
            </li>

            {/* 알림 버튼 */}
            <li className="hidden lg:block ml-2 mr-2">
              <button className="text-lg text-mainText hover:text-primary transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="28"
                  viewBox="0 -5 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-bell"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
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
                <i
                  className={`icofont icofont-rounded-${isDropdownOpen ? 'up' : 'down'} text-xs`}
                ></i>
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
              <Link
                href="/auth/login"
                className="whitespace-nowrap text-size-12 2xl:text-size-15 text-primaryColor bg-transparent border-2 border-primaryColor block px-15px py-2 rounded-xl hover:bg-primaryColor hover:text-whiteColor transition-colors -mt-2"
              >
                Log In
              </Link>
            </li>
            <li className="hidden lg:block relative">
              <Link
                href="/auth/signup"
                className="whitespace-nowrap text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor border-2 border-primaryColor block px-15px py-2 rounded-xl hover:bg-transparent hover:text-primaryColor transition-colors -mt-2"
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
        <li className="block lg:hidden">
          <MobileMenuOpen />
        </li>
      </ul>
    </div>
  );
};

export default NavbarRight;
