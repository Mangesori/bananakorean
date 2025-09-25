import React from 'react';
import { WordProps } from '@/types/quiz';

function Word({ text, hints }: WordProps) {
  // 텍스트를 공백으로 분리
  const words = text.split(' ');

  // 단어 그룹과 해당 힌트를 매핑
  const wordGroups: { text: string; hint: string; isGrammar: boolean; isCompound: boolean }[] = [];
  let wordIndex = 0;

  // 각 힌트에 대해 처리
  for (let i = 0; i < hints.length; i++) {
    const currentHint = hints[i];

    // 힌트가 없거나 wordIndex가 범위를 벗어나면 중단
    if (!currentHint || wordIndex >= words.length) break;

    // 힌트의 content가 여러 단어를 포함하는지 확인
    const contentWords = currentHint.content.split(' ');

    // 복합 단어 힌트인 경우 (2단어 이상)
    if (contentWords.length > 1) {
      // 남은 단어가 충분한지 확인
      if (wordIndex + contentWords.length <= words.length) {
        // 해당 단어들을 하나의 그룹으로 묶음
        const groupText = words.slice(wordIndex, wordIndex + contentWords.length).join(' ');
        wordGroups.push({
          text: groupText,
          hint: currentHint.hint,
          isGrammar: currentHint.isGrammar || false,
          isCompound: true, // 복합어 여부 표시
        });
        wordIndex += contentWords.length;
      } else {
        // 남은 단어가 부족한 경우, 가능한 만큼만 그룹화
        const groupText = words.slice(wordIndex).join(' ');
        wordGroups.push({
          text: groupText,
          hint: currentHint.hint,
          isGrammar: currentHint.isGrammar || false,
          isCompound: true,
        });
        wordIndex = words.length;
      }
    } else {
      // 단일 단어 힌트
      wordGroups.push({
        text: words[wordIndex],
        hint: currentHint.hint,
        isGrammar: currentHint.isGrammar || false,
        isCompound: false,
      });
      wordIndex++;
    }
  }

  // 남은 단어들 처리 (힌트가 없는 경우)
  while (wordIndex < words.length) {
    wordGroups.push({
      text: words[wordIndex],
      hint: '',
      isGrammar: false,
      isCompound: false,
    });
    wordIndex++;
  }

  return (
    <div className="flex flex-wrap gap-2 text-2xl font-medium mt-10">
      {wordGroups.map((group, index) => (
        <div
          key={index}
          className={`group relative cursor-pointer ${group.isCompound ? 'compound-word' : ''}`}
        >
          <span
            className={`tooltip-text text-sm p-2 transition-all rounded opacity-0
                              group-hover:opacity-100 absolute text-center z-50 whitespace-nowrap
                              ${
                                group.isGrammar
                                  ? 'bg-yellow-100 border-yellow-400'
                                  : 'bg-white border-yellow1'
                              } 
                              border-2 border-solid bottom-full mb-2
                              left-[45%] -translate-x-1/2`}
          >
            {group.hint}
          </span>
          <span className="hover:text-gray-400 block">{group.text}</span>
        </div>
      ))}
    </div>
  );
}

export default Word;
