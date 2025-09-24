export type TopicId =
  | 'introduction'
  | 'demonstratives'
  | 'negation'
  | 'locations'
  | 'existence'
  | 'basic-verbs'
  | 'negative-sentences'
  | 'movement'
  | 'location-actions'
  | 'past-tense'
  | 'time-expressions'
  | 'duration'
  | 'positions'
  | 'purpose'
  | 'commands'
  | 'start-end'
  | 'direction-method'
  | 'desires'
  | 'future'
  | 'ability'
  | 'obligation'
  | 'skills'
  | 'adjectives'
  | 'progressive'
  | 'reasons'
  | 'contrast'
  | 'cause'
  | 'conditions'
  | 'time-relations'
  | 'sequence';

export const topicMeta: Record<TopicId, { title: string }> = {
  introduction: { title: '은/는, 이에요/예요' },
  demonstratives: { title: '이거, 그거, 저거' },
  negation: { title: '이/가 아니에요' },
  locations: { title: '여기, 거기, 저기' },
  existence: { title: '이/가 (Place)에 있어요/없어요' },
  'basic-verbs': { title: '을/를, 아요/어요' },
  'negative-sentences': { title: '안' },
  movement: { title: '에 가요/와요' },
  'location-actions': { title: '에서' },
  'past-tense': { title: '았어요/었어요' },
  'time-expressions': { title: '에(시간)' },
  duration: { title: '부터&까지' },
  positions: { title: '위&아래&앞&뒤' },
  purpose: { title: '으러 가요/와요' },
  commands: { title: '으세요/지 마세요' },
  'start-end': { title: '에서&까지' },
  'direction-method': { title: '으로' },
  desires: { title: '고 싶다, 고 싶어하다' },
  future: { title: '을 거예요' },
  ability: { title: '수 있다/없다' },
  obligation: { title: '아야/어야 해요' },
  skills: { title: '못하다&잘하다&잘 못하다' },
  adjectives: { title: '형용사 + 은' },
  progressive: { title: '고 있다' },
  reasons: { title: '아서/어서' },
  contrast: { title: '지만, 는데' },
  cause: { title: '으니까' },
  conditions: { title: '면' },
  'time-relations': { title: '때' },
  sequence: { title: '기 전, 은 후' },
};

export const topicIds: TopicId[] = [
  'introduction',
  'demonstratives',
  'negation',
  'locations',
  'existence',
  'basic-verbs',
  'negative-sentences',
  'movement',
  'location-actions',
  'past-tense',
  'time-expressions',
  'duration',
  'positions',
  'purpose',
  'commands',
  'start-end',
  'direction-method',
  'desires',
  'future',
  'ability',
  'obligation',
  'skills',
  'adjectives',
  'progressive',
  'reasons',
  'contrast',
  'cause',
  'conditions',
  'time-relations',
  'sequence',
];
