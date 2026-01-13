import { Item } from '@/types/quiz';

import { PARTICLES } from '@/lib/korean/particles';

/**
 * 정답 텍스트를 아이템 배열로 파싱합니다.
 * 조사를 감지하여 단어와 분리하고, originalWordIndex를 할당합니다.
 * 이를 통해 드래그 앤 드롭 퀴즈에서 올바른 분리가 이루어지도록 합니다.
 */
export const parseAnswerToItems = (text: string): Item[] => {
  // 공백을 기준으로 단어 나누기
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const items: Item[] = [];
  let idCounter = 1;

  words.forEach((word, wordIndex) => {
    let matchFound = false;
    
    // 조사가 포함되어 있는지 확인
    for (const particle of PARTICLES) {
      // 단어가 조사로 끝나고, 조사를 제외한 어간이 존재하는 경우
      if (word.endsWith(particle) && word.length > particle.length) {
        const stem = word.slice(0, -particle.length);
        
        // 어간 추가 (다음 아이템(조사)과 결합됨)
        items.push({
          id: String(idCounter++),
          content: stem,
          combineWithNext: true,
          originalWordIndex: wordIndex,
          isParticle: false,
        });
        
        // 조사 추가 (결합되지 않음)
        items.push({
          id: String(idCounter++),
          content: particle,
          combineWithNext: false,
          originalWordIndex: wordIndex,
          isParticle: true,
        });
        
        matchFound = true;
        break;
      }
    }

    // 조사와 매칭되지 않은 경우 (단어 전체를 하나의 아이템으로 처리)
    if (!matchFound) {
      items.push({
        id: String(idCounter++),
        content: word,
        combineWithNext: false,
        originalWordIndex: wordIndex,
        isParticle: false,
      });
    }
  });

  return items;
};
