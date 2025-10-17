'use client';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '@/lib/supabase/hooks';
import AccordionContainer from '@/components/shared/containers/AccordionContainer';
import AccordionController from '@/components/shared/accordion/AccordionController';
import Accordion from '@/components/shared/accordion/Accordion';
import AccordionContent from '@/components/shared/accordion/AccordionContent';

const MobileMyAccount = () => {
  const { user, signOut, isLoading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="mt-9 mb-30px pb-9 border-b border-borderColor dark:border-borderColor-dark">
        <span className="text-darkdeep1 dark:text-whiteColor text-sm">Loading...</span>
      </div>
    );
  }

  if (!user) {
    // 로그인 안 된 상태 - Login/Sign Up 버튼만 표시
    return (
      <div className="mt-9 mb-30px pb-9 border-b border-borderColor dark:border-borderColor-dark">
        <div className="flex items-center gap-1">
          <Link
            href="/auth/login"
            className="leading-1 text-darkdeep1 text-sm font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="leading-1 text-darkdeep1 text-sm font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
          >
            <span>/</span> Sign Up
          </Link>
        </div>
      </div>
    );
  }

  // 로그인된 상태 - My Account accordion 표시
  const rolePrefix = user.role === 'admin' ? 'admin' : 'student';

  const handleMyAccountClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    // Find the accordion controller button and click it
    const accordionController = e.currentTarget.parentElement?.querySelector('.accordion-controller');
    if (accordionController) {
      accordionController.click();
    }
  };

  return (
    <div className="mt-9 mb-30px pb-9 border-b border-borderColor dark:border-borderColor-dark">
      <AccordionContainer>
        <Accordion>
          <AccordionController type={'primary'}>
            <span
              onClick={handleMyAccountClick}
              className="leading-1 text-darkdeep1 font-medium group-hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor cursor-pointer"
            >
              My Account
            </span>
          </AccordionController>
          <AccordionContent>
            <ul>
              <li>
                <Link
                  href={`/dashboards/${rolePrefix}-dashboard`}
                  className="block leading-1 text-darkdeep1 text-sm pl-30px pt-7 pb-3 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href={`/dashboards/${rolePrefix}-profile`}
                  className="block leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-3 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  href={`/dashboards/${rolePrefix}-settings`}
                  className="block leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-3 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                >
                  Settings
                </Link>
              </li>
              <li>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </AccordionContent>
        </Accordion>
      </AccordionContainer>
    </div>
  );
};

export default MobileMyAccount;
