import React from 'react';
import AccordionContainer from '@/components/shared/containers/AccordionContainer';
import MobileMenuItem from './MobileItem';

const MobileMenuItems = () => {
  const items = [
    {
      id: 1,
      name: 'Dialogue Quiz',
      path: '/quiz/dialogue',
    },

    {
      id: 2,
      name: 'Multiple Choice Quiz',
      path: '/quiz/multiple',
    },
    {
      id: 3,
      name: 'Fill in the Blank Quiz',
      path: '/quiz/fill-blank',
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
