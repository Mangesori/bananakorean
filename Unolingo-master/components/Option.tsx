import React from 'react';

interface Item {
  id: string;
  content: string;
  combineWithNext?: boolean;
}

interface OptionProps {
  item: Item;
}

function Option({ item }: OptionProps) {
  return (
    <div className="bg-white shadow-lg py-2 px-4 rounded-lg w-fit whitespace-nowrap select-none">
      {item.content}
    </div>
  );
}

export default Option;
