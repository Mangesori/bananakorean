import React from 'react';
import { OptionProps } from '@/types/quiz';

const Option: React.FC<OptionProps> = ({ item }) => {
  return (
    <div className="bg-white shadow-lg py-2 px-4 rounded-lg w-fit whitespace-nowrap select-none">
      {item.content}
    </div>
  );
};

export default Option;
