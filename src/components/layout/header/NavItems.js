'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/supabase/hooks';
import Link from 'next/link';
import React from 'react';
import Navitem from './Navitem';
import DropdownWrapper from '@/components/shared/wrappers/DropdownWrapper';

const NavItems = () => {
  const { user } = useAuth();

  const navItems = [
    {
      id: 1,
      name: 'Grammar Quiz',
      path: '/quiz',
      isRelative: false,
    },
    {
      id: 2,
      name: 'Conversation type Quiz',
      path: '/quiz/dialogue',
      isRelative: false,
    },
  ];

  return (
    <div className="hidden lg:block lg:col-start-3 lg:col-span-7">
      <ul className="nav-list flex justify-center items-center">
        {navItems.map((navItem, idx) => (
          <Navitem key={idx} idx={idx} navItem={{ ...navItem, idx: idx }}>
            <DropdownWrapper>{navItem.dropdown}</DropdownWrapper>
          </Navitem>
        ))}
      </ul>
    </div>
  );
};

export default NavItems;
