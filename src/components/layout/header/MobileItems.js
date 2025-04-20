import React from 'react';
import AccordionContainer from '@/components/shared/containers/AccordionContainer';
import MobileMenuItem from './MobileItem';

const MobileMenuItems = () => {
  const items = [
    {
      id: 1,
      name: 'Grammar Quiz',
      path: '/quiz',
    },

    {
      id: 2,
      name: ' Conversation type Quiz',
      path: '/quiz/dialogue',
      isRelative: false,
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
