import React from 'react';
import AccordionContainer from '@/components/shared/containers/AccordionContainer';
import MobileMenuItem from './MobileItem';

const MobileMenuItems = () => {
  const items = [
    {
      id: 1,
      name: 'Quiz',
      path: '/quiz',
    },
    {
      id: 2,
      name: 'Videos',
      path: '/videos',
    },
    {
      id: 3,
      name: 'Blog',
      path: '/blog',
    },
    {
      id: 5,
      name: 'Demos',
      path: '/',
    },
  ];

  return (
    <div className="pt-8 pb-6 border-b border-borderColor dark:border-borderColor-dark">
      <AccordionContainer>
        {items.map((item, idx) => (
          <MobileMenuItem key={idx} item={item} />
        ))}
      </AccordionContainer>
    </div>
  );
};

export default MobileMenuItems;
