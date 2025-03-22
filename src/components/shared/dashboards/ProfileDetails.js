'use client';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const ProfileDetails = () => {
  const { user } = useAuth();

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">My Profile</h2>
      </div>

      <div>
        <ul>
          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Name</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block">{user?.name || '-'}</span>
            </div>
          </li>

          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Nickname</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block">
                {user?.nickname || user?.user_metadata?.username || '-'}
              </span>
            </div>
          </li>

          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Email</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block">{user?.email || '-'}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDetails;
