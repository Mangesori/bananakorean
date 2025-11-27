/**
 * 템플릿 매처
 * 어휘와 템플릿을 스마트하게 매칭
 */

import { DialogueQuestion } from '@/types/quiz';
import { AnalyzedWord } from '@/types/vocabulary';
import { extractReplaceableWords, extractVerbs } from './template-loader';

export interface MatchedTemplate {
  template: DialogueQuestion;
  replacedWord: string;
  matchScore: number;
}

/**
 * 어휘에 맞는 최적의 템플릿 찾기
 */
export function findBestTemplate(
  analyzedWord: AnalyzedWord,
  templates: DialogueQuestion[]
): MatchedTemplate | null {
  const topTemplates = findTopNTemplates(analyzedWord, templates, 1);
  return topTemplates[0] || null;
}

/**
 * 어휘에 맞는 상위 N개의 템플릿 찾기
 */
export function findTopNTemplates(
  analyzedWord: AnalyzedWord,
  templates: DialogueQuestion[],
  n: number
): MatchedTemplate[] {
  const matchedTemplates: MatchedTemplate[] = [];

  for (const template of templates) {
    if (analyzedWord.type === '명사') {
      // 명사는 명사를 포함한 템플릿과 매칭
      const replaceableWords = extractReplaceableWords(template);

      if (replaceableWords.length > 0) {
        const score = calculateNounMatchScore(analyzedWord, template, replaceableWords);
        matchedTemplates.push({
          template,
          replacedWord: replaceableWords[0], // 첫 번째 교체 가능 단어
          matchScore: score,
        });
      }
    } else if (analyzedWord.type === '동사') {
      // 동사는 동사를 포함한 템플릿과 매칭
      const verbs = extractVerbs(template);

      if (verbs.length > 0) {
        const score = calculateVerbMatchScore(analyzedWord, template, verbs);
        matchedTemplates.push({
          template,
          replacedWord: verbs[0], // 첫 번째 동사
          matchScore: score,
        });
      }
      // Fallback: 동사 추출 실패 시, 템플릿에 동사 패턴이 있으면 매칭 시도
      else if (hasVerbLikePattern(template.answer)) {
        const score = calculateVerbMatchScore(analyzedWord, template, []) - 10; // 페널티 적용
        matchedTemplates.push({
          template,
          replacedWord: extractVerbStemFromWord(analyzedWord.word),
          matchScore: score,
        });
      }
    }
  }

  // 점수가 높은 순으로 정렬하고 상위 N개 반환
  matchedTemplates.sort((a, b) => b.matchScore - a.matchScore);
  return matchedTemplates.slice(0, n);
}

/**
 * 템플릿에 동사 패턴이 있는지 확인 (fallback용)
 */
function hasVerbLikePattern(text: string): boolean {
  const verbEndings = [
    '어요',
    '해요',
    '아요',
    '었어요',
    '했어요',
    '았어요',
    '할 거예요',
    'ㄹ 거예요',
    '고 있어요',
    '세요',
    '(으)세요',
  ];
  return verbEndings.some((ending) => text.includes(ending));
}

/**
 * 사전형 동사에서 어간 추출 (fallback용)
 */
function extractVerbStemFromWord(word: string): string {
  // 시작하다 → 시작
  // 끝나다 → 끝나
  if (word.endsWith('하다')) {
    return word.slice(0, -2);
  }
  if (word.endsWith('다')) {
    return word.slice(0, -1);
  }
  return word;
}

/**
 * 명사 매칭 점수 계산
 */
function calculateNounMatchScore(
  word: AnalyzedWord,
  template: DialogueQuestion,
  replaceableWords: string[]
): number {
  let score = 0;

  // 기본 점수
  score += 50;

  // 장소 명사는 장소 패턴이 있는 템플릿과 잘 맞음
  if (word.subtype === '장소') {
    if (template.answer.includes('에 ') || template.answer.includes('에서 ')) {
      score += 30;
    }
  }

  // 목적어는 을/를 패턴이 있는 템플릿과 잘 맞음
  if (template.answer.includes('을 ') || template.answer.includes('를 ')) {
    score += 20;
  }

  // 문장 길이가 적당하면 가산점
  const sentenceLength = template.answer.length;
  if (sentenceLength >= 10 && sentenceLength <= 30) {
    score += 10;
  }

  return score;
}

/**
 * 동사 매칭 점수 계산
 */
function calculateVerbMatchScore(
  word: AnalyzedWord,
  template: DialogueQuestion,
  verbs: string[]
): number {
  let score = 0;

  // 기본 점수
  score += 50;

  // 과거형 동사가 있으면 가산점
  if (word.conjugations?.past && template.answer.includes('했어요')) {
    score += 30;
  }

  // 현재형 동사가 있으면 가산점
  if (word.conjugations?.present && template.answer.includes('해요')) {
    score += 20;
  }

  // 문장에 목적어가 있으면 가산점 (동사와 잘 어울림)
  if (template.answer.includes('을 ') || template.answer.includes('를 ')) {
    score += 15;
  }

  return score;
}

/**
 * 여러 어휘에 대해 최적의 템플릿 찾기
 * numberOfProblems 파라미터를 받아서 요청한 개수만큼 템플릿 매칭
 * grammarTopics 파라미터로 문법 가중치 및 새/기존 문제 비율 조정
 */
export function matchVocabularyToTemplates(
  analyzedWords: AnalyzedWord[],
  templates: DialogueQuestion[],
  numberOfProblems?: number,
  grammarTopics?: string[]
): MatchedTemplate[] {
  const matched: MatchedTemplate[] = [];

  // numberOfProblems가 지정되지 않으면 기존 로직 사용 (어휘 1개당 템플릿 1개)
  if (!numberOfProblems) {
    for (const word of analyzedWords) {
      console.log(`[Matching] 어휘 "${word.word}" (${word.type}) 매칭 시작`);

      const bestMatch = findBestTemplate(word, templates);
      if (bestMatch) {
        console.log(`[Matching] ✓ 매칭 성공 - 점수: ${bestMatch.matchScore}`);
        matched.push(bestMatch);

        // 각 어휘에 매칭된 템플릿 개수 저장
        word.matchedTemplates = templates.filter((t) => {
          if (word.type === '명사') {
            return extractReplaceableWords(t).length > 0;
          } else if (word.type === '동사') {
            return extractVerbs(t).length > 0;
          }
          return false;
        }).length;
      } else {
        console.log(`[Matching] ✗ 매칭 실패 - 매칭 템플릿 없음`);
      }
    }

    console.log(`[Matching] 총 ${matched.length}/${analyzedWords.length} 어휘 매칭 완료`);
    return matched;
  }

  // numberOfProblems가 지정된 경우: 문법 가중치 + 새/기존 문제 비율 시스템
  console.log(`[Matching] ${analyzedWords.length}개 어휘 → ${numberOfProblems}개 문제 생성`);

  // grammarTopics가 없으면 기존 라운드 로빈 로직 사용
  if (!grammarTopics || grammarTopics.length === 0) {
    console.log(`[Matching] grammarTopics 없음 - 기존 라운드 로빈 사용`);
    let wordIndex = 0;
    for (let i = 0; i < numberOfProblems; i++) {
      const word = analyzedWords[wordIndex];
      const usedTemplates = matched.map((m) => m.template.id);
      const availableTemplates = templates.filter((t) => !usedTemplates.includes(t.id));

      if (availableTemplates.length > 0) {
        const topTemplates = findTopNTemplates(word, availableTemplates, 1);
        if (topTemplates.length > 0) {
          matched.push(topTemplates[0]);
        }
      } else {
        const topTemplates = findTopNTemplates(word, templates, 1);
        if (topTemplates.length > 0) {
          matched.push(topTemplates[0]);
        }
      }
      wordIndex = (wordIndex + 1) % analyzedWords.length;
    }
    return matched;
  }

  // === 새로운 시스템: 문법 가중치 + 새/기존 비율 ===

  // 1. 새 어휘 vs 기존 문제 비율 계산
  const newVocabCount = Math.min(numberOfProblems, analyzedWords.length * 2);
  const existingProblemCount = numberOfProblems - newVocabCount;

  console.log(
    `[Matching] 새 어휘 문제: ${newVocabCount}개 (${Math.round((newVocabCount / numberOfProblems) * 100)}%)`
  );
  console.log(
    `[Matching] 기존 문제: ${existingProblemCount}개 (${Math.round((existingProblemCount / numberOfProblems) * 100)}%)`
  );

  // 2. 새 어휘 문제 선택 (AI가 생성할 문제들)
  if (newVocabCount > 0) {
    // 2-1. 각 문법에서 최소 1개씩 보장
    const guaranteedCount = Math.min(newVocabCount, grammarTopics.length);
    console.log(`[Matching] 각 문법 최소 보장: ${guaranteedCount}개`);

    for (let i = 0; i < guaranteedCount; i++) {
      const grammarId = grammarTopics[i];
      const grammarTemplates = templates.filter((t) => (t as any).grammarTopicId === grammarId);

      if (grammarTemplates.length > 0) {
        // 랜덤하게 1개 선택
        const randomIndex = Math.floor(Math.random() * grammarTemplates.length);
        const template = grammarTemplates[randomIndex];
        const wordIndex = i % analyzedWords.length;
        const word = analyzedWords[wordIndex];

        matched.push({
          template,
          replacedWord: word.type === '동사' ? extractVerbs(template)[0] || word.word : extractReplaceableWords(template)[0] || word.word,
          matchScore: 50,
        });

        console.log(`[Matching] ✓ 문법 "${grammarId}" 보장 - 어휘: ${word.word}`);
      }
    }

    // 2-2. 남은 새 어휘 문제는 가중치로 분배
    const remainingNewVocab = newVocabCount - matched.length;
    if (remainingNewVocab > 0) {
      console.log(`[Matching] 남은 새 어휘 문제: ${remainingNewVocab}개 - 가중치 분배`);

      const usedTemplateIds = matched.map((m) => m.template.id);
      const weightedTemplates = templates
        .filter((t) => !usedTemplateIds.includes(t.id))
        .map((template) => ({
          template,
          score: calculateGrammarWeight(template, grammarTopics),
        }))
        .sort((a, b) => b.score - a.score);

      for (let i = 0; i < remainingNewVocab && i < weightedTemplates.length; i++) {
        const { template, score } = weightedTemplates[i];
        const wordIndex = (matched.length + i) % analyzedWords.length;
        const word = analyzedWords[wordIndex];

        matched.push({
          template,
          replacedWord: word.type === '동사' ? extractVerbs(template)[0] || word.word : extractReplaceableWords(template)[0] || word.word,
          matchScore: score,
        });

        console.log(`[Matching] ✓ 가중치 선택 (점수: ${Math.round(score)}) - 어휘: ${word.word}`);
      }
    }
  }

  // 3. 기존 문제 선택 (AI 생성 없이 그대로 사용)
  if (existingProblemCount > 0) {
    console.log(`[Matching] 기존 문제 ${existingProblemCount}개 선택 - AI 생성 안 함`);

    const usedTemplateIds = matched.map((m) => m.template.id);
    const weightedTemplates = templates
      .filter((t) => !usedTemplateIds.includes(t.id))
      .map((template) => ({
        template,
        score: calculateGrammarWeight(template, grammarTopics),
      }))
      .sort((a, b) => b.score - a.score);

    for (let i = 0; i < existingProblemCount && i < weightedTemplates.length; i++) {
      const { template, score } = weightedTemplates[i];

      matched.push({
        template,
        replacedWord: '',
        matchScore: score,
        isExisting: true as any, // 기존 문제 표시
      });

      console.log(`[Matching] ✓ 기존 문제 선택 (점수: ${Math.round(score)})`);
    }
  }

  console.log(`[Matching] 총 ${matched.length}/${numberOfProblems} 문제 매칭 완료`);
  console.log(`[Matching] - 새 어휘: ${matched.filter((m) => !(m as any).isExisting).length}개`);
  console.log(`[Matching] - 기존 문제: ${matched.filter((m) => (m as any).isExisting).length}개`);

  return matched;
}

/**
 * 템플릿이 속한 문법의 인덱스 찾기
 */
function findGrammarIndex(template: DialogueQuestion, grammarTopics: string[]): number {
  const grammarTopicId = (template as any).grammarTopicId;
  if (!grammarTopicId) return -1;

  return grammarTopics.indexOf(grammarTopicId);
}

/**
 * 문법 순서 가중치 계산
 * 뒤에 선택된 문법일수록 높은 가중치 (0~100점)
 */
function calculateGrammarWeight(template: DialogueQuestion, grammarTopics: string[]): number {
  const grammarIndex = findGrammarIndex(template, grammarTopics);

  if (grammarIndex === -1) return 0;

  // 뒤에 있을수록 높은 가중치
  const weight = (grammarIndex / grammarTopics.length) * 100;

  return weight;
}

/**
 * 구조 유사도 계산
 * 원본 템플릿과 생성된 문제의 구조가 얼마나 유사한지 계산
 */
export function calculateStructureSimilarity(
  templateAnswer: string,
  generatedAnswer: string
): number {
  // 간단한 휴리스틱: 문장 길이와 조사 패턴의 유사도

  // 1. 문장 길이 비교 (최대 40점)
  const lengthDiff = Math.abs(templateAnswer.length - generatedAnswer.length);
  const lengthScore = Math.max(0, 40 - lengthDiff * 2);

  // 2. 조사 패턴 비교 (최대 40점)
  const templateParticles = extractParticles(templateAnswer);
  const generatedParticles = extractParticles(generatedAnswer);
  const particleMatch = templateParticles.filter((p) => generatedParticles.includes(p)).length;
  const particleScore = (particleMatch / Math.max(templateParticles.length, 1)) * 40;

  // 3. 어미 패턴 비교 (최대 20점)
  const templateEnding = templateAnswer.slice(-4);
  const generatedEnding = generatedAnswer.slice(-4);
  const endingScore = templateEnding === generatedEnding ? 20 : 0;

  const totalScore = lengthScore + particleScore + endingScore;
  return Math.min(100, totalScore) / 100; // 0-1 사이로 정규화
}

/**
 * 문장에서 조사 추출
 */
function extractParticles(sentence: string): string[] {
  const particles: string[] = [];
  const particlePatterns = ['은', '는', '이', '가', '을', '를', '에', '에서', '와', '과', '의'];

  for (const particle of particlePatterns) {
    if (sentence.includes(particle + ' ')) {
      particles.push(particle);
    }
  }

  return particles;
}
