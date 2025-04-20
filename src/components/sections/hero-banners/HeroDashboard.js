'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/supabase/hooks';

const HeroDashboard = () => {
  const pathname = usePathname();
  const partOfPathNaem = pathname.split('/')[2].split('-')[0];
  const isAdmin = partOfPathNaem === 'admin' ? true : false;
  const { user } = useAuth();

  return (
    <section>
      <div className="container-fluid-2">
        <div
          className={`${
            isAdmin ? 'bg-primaryColor' : 'bg-skycolor'
          } p-5 md:p-10 rounded-5 flex justify-center md:justify-between items-center flex-wrap gap-2`}
        >
          <div className="flex items-center flex-wrap justify-center sm:justify-start">
            {isAdmin ? (
              <div className="text-whiteColor font-bold text-center sm:text-start">
                <h5 className="text-xl leading-1.2 mb-5px">Hello</h5>
                <h2 className="text-2xl leading-1.24">{user?.name}</h2>
              </div>
            ) : (
              <div className="text-whiteColor font-bold text-center sm:text-start">
                <h5 className="text-2xl leading-1.24 mb-5px">{user?.name}</h5>
                <ul className="flex items-center gap-15px">
                  <li className="text-sm font-normal flex items-center gap-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-book-open mr-0.5"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    9 Courses Enroled
                  </li>
                  <li className="text-sm font-normal flex items-center gap-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-award"
                    >
                      <circle cx="12" cy="8" r="7"></circle>
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                    </svg>
                    8 Certificate
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroDashboard;
