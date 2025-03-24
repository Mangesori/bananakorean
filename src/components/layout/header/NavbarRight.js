'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import MobileMenuOpen from '@/components/shared/buttons/MobileMenuOpen';
import { useAuth } from '@/hooks/useAuth';
import MessageDropdown from './MessageDropdown';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

const NavbarRight = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setShowProfileDropdown(false);
    }
  }, [user]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await signOut();
    } catch (error) {
      console.error('Error during logout:', error);
      alert('로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getSettingsUrl = () => {
    if (!user) return '/login';
    return user.role === 'admin' ? '/dashboards/admin-settings' : '/dashboards/student-settings';
  };

  const profileMenuItems = [
    {
      icon: 'icofont-ui-user',
      text: 'Profile',
      link: user?.role === 'admin' ? '/dashboards/admin-profile' : '/dashboards/student-profile',
    },
    {
      icon: 'icofont-gear',
      text: 'Settings',
      link: getSettingsUrl(),
    },
    {
      icon: 'icofont-power',
      text: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <div className="lg:col-start-10 lg:col-span-3">
      <ul className="relative nav-list flex justify-end items-center gap-3">
        {user ? (
          <>
            {/* Message Button */}
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
            {/* Notification Button */}
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
            {/* Profile Button */}
            <li className="hidden lg:block relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 text-mainText hover:text-primary transition-colors"
              >
                <i className="icofont icofont-user-alt-5 text-lg"></i>
                <span className="text-size-12 2xl:text-size-15">{user.name}</span>
                <i className="icofont icofont-rounded-down text-xs"></i>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-lg shadow-lg bg-white dark:bg-whiteColor-dark border border-borderColor dark:border-borderColor-dark z-[100] max-h-[400px] overflow-y-auto">
                  <div className="py-2">
                    <h5 className="text-sm leading-1 font-semibold uppercase text-contentColor dark:text-contentColor-dark bg-lightGrey5 dark:bg-whiteColor-dark p-10px pb-7px tracking-half">
                      MY ACCOUNT
                    </h5>
                    <ul>
                      <li className="py-10px border-b border-borderColor dark:border-borderColor-dark">
                        <Link
                          href={
                            user?.role === 'admin'
                              ? '/dashboards/admin-dashboard'
                              : '/dashboards/student-dashboard'
                          }
                          className="flex items-center gap-3 px-4 text-contentColor hover:text-primaryColor dark:text-contentColor-dark dark:hover:text-primaryColor"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-home"
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                          <span>Dashboard</span>
                        </Link>
                      </li>
                      <li className="py-10px border-b border-borderColor dark:border-borderColor-dark">
                        <Link
                          href={getSettingsUrl()}
                          className="flex items-center gap-3 px-4 text-contentColor hover:text-primaryColor dark:text-contentColor-dark dark:hover:text-primaryColor"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-settings"
                          >
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                          </svg>
                          <span>Settings</span>
                        </Link>
                      </li>
                      <li className="py-10px">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 w-full text-contentColor hover:text-primaryColor dark:text-contentColor-dark dark:hover:text-primaryColor"
                        >
                          <i className="icofont icofont-logout"></i>
                          <span>Logout</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </li>
          </>
        ) : (
          <>
            <li className="hidden lg:block">
              <Link
                href="/login"
                className="whitespace-nowrap text-size-12 2xl:text-size-15 text-primaryColor bg-transparent border-2 border-primaryColor block px-15px py-2 rounded-xl hover:bg-primaryColor hover:text-whiteColor transition-colors -mt-2"
              >
                Log In
              </Link>
            </li>
            <li className="hidden lg:block relative">
              <Link
                href="/signup"
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
