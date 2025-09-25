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
      id: 2,
      name: 'Dialogue Quiz',
      path: '/quiz/DialogueDragAndDrop',
      isRelative: false,
    },
    {
      id: 3,
      name: 'Multiple Choice Quiz',
      path: '/quiz/multiple',
      isRelative: false,
    },
    {
      id: 4,
      name: 'Fill in the Blank Quiz',
      path: '/quiz/fill-blank',
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
