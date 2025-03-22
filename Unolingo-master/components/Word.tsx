import React from 'react';

interface WordHint {
  content: string;
  hint: string;
  isGrammar?: boolean;
}

interface WordProps {
  text: string;
  hints: WordHint[];
}

function Word({ text, hints }: WordProps) {
  const words = text.split(' ');

  return (
    <div className="flex gap-2 text-2xl font-medium mt-10">
      {words.map((word, index) => (
        <div key={index} className="group relative cursor-pointer">
          <span
            className={`tooltip-text text-sm p-2 transition-all rounded opacity-0
                            group-hover:opacity-100 absolute text-center z-50 whitespace-nowrap
                            ${
                              hints[index].isGrammar
                                ? 'bg-yellow-100 border-yellow-400'
                                : 'bg-white border-[#58cc02]'
                            } 
                            border-2 border-solid bottom-full mb-2`}
          >
            {hints[index].hint}
          </span>
          <span className="hover:text-gray-600 block">{word}</span>
        </div>
      ))}
    </div>
  );
}

export default Word;
