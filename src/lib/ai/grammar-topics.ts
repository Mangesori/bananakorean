/**
 * 문법 주제 설정 및 매핑
 * DialogueDragAndDrop 폴더의 30개 문법 주제
 */

export interface GrammarTopic {
  id: string;
  label: string;
  fileName: string;
  description?: string;
}

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  { id: 'introduction', label: '은/는, 이에요/예요', fileName: 'introduction' },
  { id: 'demonstratives', label: '이거, 그거, 저거', fileName: 'demonstratives' },
  { id: 'negation', label: '이/가 아니에요', fileName: 'negation' },
  { id: 'locations', label: '여기, 거기, 저기', fileName: 'locations' },
  { id: 'existence', label: '에 있어요/없어요', fileName: 'existence' },
  { id: 'basic-verbs', label: '을/를, 아요/어요', fileName: 'basic-verbs' },
  { id: 'negative-sentences', label: '안', fileName: 'negative-sentences' },
  { id: 'movement', label: '(장소)에 가요/와요', fileName: 'movement' },
  { id: 'location-actions', label: '(장소)에서', fileName: 'location-actions' },
  { id: 'past-tense', label: '았어요/었어요', fileName: 'past-tense' },
  { id: 'time-expressions', label: '(시간)에', fileName: 'time-expressions' },
  { id: 'duration', label: '부터&까지', fileName: 'duration' },
  { id: 'positions', label: '위&아래&앞&뒤', fileName: 'positions' },
  { id: 'purpose', label: '(으)러 가요/와요', fileName: 'purpose' },
  { id: 'commands', label: '(으)세요, 지 마세요', fileName: 'commands' },
  { id: 'start-end', label: '에서&까지', fileName: 'start-end' },
  { id: 'direction-method', label: '(으)로', fileName: 'direction-method' },
  { id: 'desires', label: '고 싶다, 고 싶어하다', fileName: 'desires' },
  { id: 'future', label: '(으)ㄹ 거예요', fileName: 'future' },
  { id: 'ability', label: '(으)ㄹ 수 있다/없다', fileName: 'ability' },
  { id: 'obligation', label: '아야/어야 해요', fileName: 'obligation' },
  { id: 'skills', label: '못하다&잘하다&잘 못하다', fileName: 'skills' },
  { id: 'adjectives', label: '형용사 + (으)ㄴ', fileName: 'adjectives' },
  { id: 'progressive', label: '고 있다', fileName: 'progressive' },
  { id: 'reasons', label: '아서/어서', fileName: 'reasons' },
  { id: 'contrast', label: '지만, 는데', fileName: 'contrast' },
  { id: 'cause', label: '(으)니까', fileName: 'cause' },
  { id: 'conditions', label: '(으)면', fileName: 'conditions' },
  { id: 'time-relations', label: '(으)ㄹ 때', fileName: 'time-relations' },
  { id: 'sequence', label: '기 전, (으)ㄴ 후', fileName: 'sequence' },
];

/**
 * 문법 주제 ID로 파일 이름 가져오기
 */
export function getGrammarTopicFileName(topicId: string): string | null {
  const topic = GRAMMAR_TOPICS.find((t) => t.id === topicId);
  return topic ? topic.fileName : null;
}

/**
 * 문법 주제 ID로 정보 가져오기
 */
export function getGrammarTopic(topicId: string): GrammarTopic | null {
  return GRAMMAR_TOPICS.find((t) => t.id === topicId) || null;
}

/**
 * 파일 이름으로 문법 주제 찾기
 */
export function findGrammarTopicByFileName(fileName: string): GrammarTopic | null {
  return GRAMMAR_TOPICS.find((t) => t.fileName === fileName) || null;
}
