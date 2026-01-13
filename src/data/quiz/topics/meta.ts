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
  | 'contrast-but'
  | 'choice'
  | 'shall-we'
  | 'comparison-advanced'
  | 'honorific-sida'
  | 'cause'
  | 'conditions'
  | 'time-relations'
  | 'sequence'
  | 'know-how'
  | 'benefactive'
  | 'experience'
  | 'offer-help'
  | 'promise-help'
  | 'request-help'
  | 'confirmation'
  | 'exclamation'
  | 'intent-short'
  | 'intent-long'
  | 'sequential-action'
  | 'suggestion'
  | 'future-prediction'
  | 'interruption'
  | 'gerund'
  | 'let-us'
  | 'decision'
  | 'permission'
  | 'prohibition'
  | 'promise'
  | 'conjecture'
  | 'change-of-state'
  | 'simultaneous'
  | 'intent-will'
  | 'because-of'
  | 'while-during'
  | 'background-info'
  | 'background-action'
  | 'indirect-quote-statement'
  | 'indirect-quote-action'
  | 'indirect-quote-past'
  | 'indirect-quote-future'
  | 'indirect-quote-suggestion'
  | 'indirect-quote-question'
  | 'indirect-quote-command'
  | 'noun-modifier-present'
  | 'noun-modifier-past'
  | 'noun-modifier-future'
  | 'guess-adj'
  | 'guess-verb-present'
  | 'guess-verb-past'
  | 'guess-future'
  | 'background-adj'
  | 'background-verb'
  | 'become'
  | 'even-if'
  | 'experience-exist'
  | 'know-adj'
  | 'know-verb'
  | 'time-since-action';

export const topicMeta: Record<TopicId, { title: string; level: 'A1' | 'A2' | 'A3' }> = {
  // A1
  introduction: { title: '은/는, 이에요/예요', level: 'A1' },
  demonstratives: { title: '이거, 그거, 저거', level: 'A1' },
  negation: { title: '이/가 아니에요', level: 'A1' },
  locations: { title: '여기, 거기, 저기', level: 'A1' },
  existence: { title: '있어요/없어요', level: 'A1' },
  'basic-verbs': { title: '을/를, 아요/어요', level: 'A1' },
  'negative-sentences': { title: '안', level: 'A1' },
  movement: { title: '(장소)에 가요/와요', level: 'A1' },
  'location-actions': { title: '(장소)에서', level: 'A1' },
  'past-tense': { title: '았어요/었어요', level: 'A1' },
  'time-expressions': { title: '(시간)에', level: 'A1' },
  duration: { title: '부터&까지', level: 'A1' },
  positions: { title: '위&아래&앞&뒤', level: 'A1' },
  purpose: { title: '(으)러 가요/와요', level: 'A1' },
  commands: { title: '(으)세요, 지 마세요', level: 'A1' },
  'start-end': { title: '에서&까지', level: 'A1' },
  'direction-method': { title: '(으)로', level: 'A1' },
  desires: { title: '고 싶다, 고 싶어하다', level: 'A1' },
  future: { title: '을 거예요', level: 'A1' },
  ability: { title: '(으)ㄹ 수 있다/없다', level: 'A1' },
  obligation: { title: '아야/어야 해요', level: 'A1' },
  skills: { title: '못하다&잘하다&잘 못하다', level: 'A1' },
  adjectives: { title: '형용사 + (으)ㄴ', level: 'A1' },
  progressive: { title: '고 있다', level: 'A1' },

  // A2
  reasons: { title: '아서/어서', level: 'A2' },
  'contrast-but': { title: '지만, 근데', level: 'A2' },
  choice: { title: '거나, (이)나', level: 'A2' },
  'shall-we': { title: '(으)ㄹ까요?', level: 'A2' },
  'comparison-advanced': { title: '보다 더', level: 'A2' },
  'honorific-sida': { title: '(으)시다', level: 'A2' },
  cause: { title: '(으)니까', level: 'A2' },
  conditions: { title: '(으)면', level: 'A2' },
  'time-relations': { title: '(으)ㄹ 때', level: 'A2' },
  sequence: { title: '기 전, (으)ㄴ 후', level: 'A2' },
  'know-how': { title: '(으)ㄹ 줄 알아요/몰라요', level: 'A2' },
  benefactive: { title: '아/어 주다', level: 'A2' },
  experience: { title: '아/어 보다', level: 'A2' },
  'offer-help': { title: '아/어 드릴까요?', level: 'A2' },
  'promise-help': { title: '아/어 드릴게요', level: 'A2' },
  'request-help': { title: '아/어 주시겠어요?', level: 'A2' },
  confirmation: { title: '지요?', level: 'A2' },
  exclamation: { title: '네요', level: 'A2' },
  'intent-short': { title: '(으)려고', level: 'A2' },
  'intent-long': { title: '(으)려고 해요', level: 'A2' },
  'sequential-action': { title: '아서/어서 2', level: 'A2' },
  suggestion: { title: '(으)ㄹ까요? 2', level: 'A2' },
  'future-prediction': { title: '(으)ㄹ 거예요 2', level: 'A2' },
  interruption: { title: '다가', level: 'A2' },
  gerund: { title: '는 것', level: 'A2' },
  'let-us': { title: '(으)ㅂ시다', level: 'A2' },
  decision: { title: '기로 하다', level: 'A2' },
  permission: { title: '아도/어도 되다', level: 'A2' },
  prohibition: { title: '(으)면 안 되다', level: 'A2' },
  promise: { title: '(으)ㄹ게요', level: 'A2' },
  conjecture: { title: '겠어요', level: 'A2' },
  'change-of-state': { title: '게 되다', level: 'A2' },
  simultaneous: { title: '(으)면서', level: 'A2' },
  'intent-will': { title: '(으)ㄹ래요', level: 'A2' },
  'because-of': { title: '기 때문에', level: 'A2' },
  'while-during': { title: '는 동안에', level: 'A2' },

  // A3
  'background-info': { title: '(형용사) + (으)ㄴ데요', level: 'A3' },
  'background-action': { title: '(동사) + 는데요', level: 'A3' },
  'indirect-quote-statement': { title: '다고 하다', level: 'A3' },
  'indirect-quote-action': { title: 'ㄴ/는다고 하다', level: 'A3' },
  'indirect-quote-past': { title: '았/었다고 하다', level: 'A3' },
  'indirect-quote-future': { title: '(으)ㄹ 거라고 하다', level: 'A3' },
  'indirect-quote-suggestion': { title: '자고 하다', level: 'A3' },
  'indirect-quote-question': { title: '냐고 하다', level: 'A3' },
  'indirect-quote-command': { title: '(으)라고 하다', level: 'A3' },
  'noun-modifier-present': { title: '(동사) + 는', level: 'A3' },
  'noun-modifier-past': { title: '(동사) + (으)ㄴ', level: 'A3' },
  'noun-modifier-future': { title: '(동사) + (으)ㄹ', level: 'A3' },
  'guess-adj': { title: '형용사 + (으)ㄴ 것 같다', level: 'A3' },
  'guess-verb-present': { title: '(동사) + 는 것 같다', level: 'A3' },
  'guess-verb-past': { title: '(동사) + (으)ㄴ 것 같다', level: 'A3' },
  'guess-future': { title: '(동사/형용사) + (으)ㄹ 것 같다', level: 'A3' },
  'background-adj': { title: '(형용사) + (으)ㄴ데', level: 'A3' },
  'background-verb': { title: '(동사) + 는데', level: 'A3' },
  become: { title: '아/어지다', level: 'A3' },
  'even-if': { title: '아/어도', level: 'A3' },
  'experience-exist': { title: '(으)ㄴ 적이 있다/없다', level: 'A3' },
  'know-adj': { title: '(형용사) + (으)ㄴ지 알다', level: 'A3' },
  'know-verb': { title: '(동사) + 는지 알다', level: 'A3' },
  'time-since-action': { title: '(으)ㄴ 지', level: 'A3' },
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
  // A2
  'reasons',
  'contrast-but',
  'choice', 
  'shall-we',
  'comparison-advanced',
  'honorific-sida',
  'cause',
  'conditions',
  'time-relations',
  'sequence',
  'know-how',
  'benefactive',
  'experience',
  'offer-help',
  'promise-help',
  'request-help',
  'confirmation',
  'exclamation',
  'intent-short',
  'intent-long',
  'sequential-action',
  'suggestion',
  'future-prediction',
  'interruption',
  'gerund',
  'let-us',
  'decision',
  'permission',
  'prohibition',
  'promise',
  'conjecture',
  'change-of-state',
  'simultaneous',
  'intent-will',
  'because-of',
  'while-during',
  // A3
  'background-info',
  'background-action',
  'indirect-quote-statement',
  'indirect-quote-action',
  'indirect-quote-past',
  'indirect-quote-future',
  'indirect-quote-suggestion',
  'indirect-quote-question',
  'indirect-quote-command',
  'noun-modifier-present',
  'noun-modifier-past',
  'noun-modifier-future',
  'guess-adj',
  'guess-verb-present',
  'guess-verb-past',
  'guess-future',
  'background-adj',
  'background-verb',
  'become',
  'even-if',
  'experience-exist',
  'know-adj',
  'know-verb',
  'time-since-action',
];
