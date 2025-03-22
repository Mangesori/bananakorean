import React from 'react';
import Navitem from './Navitem';
import DropdownWrapper from '@/components/shared/wrappers/DropdownWrapper';
import DropdownVideos from './DropdownVideos';
import { useAuth } from '@/hooks/useAuth';

const NavItems = () => {
  const { user } = useAuth();

  const navItems = [
    {
      id: 1,
      name: 'Quiz',
      path: '/quiz',
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
