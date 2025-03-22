import { introductionQuestions } from '@/data/quiz/introduction';
import { demonstrativeQuestions } from '@/data/quiz/demonstratives';
import { negationQuestions } from '@/data/quiz/negation';
import { locationQuestions } from '@/data/quiz/locations';
import { existenceQuestions } from '@/data/quiz/existence';
import { basicVerbQuestions } from '@/data/quiz/basic-verbs';
import { negativeSentenceQuestions } from '@/data/quiz/negative-sentences';
import { movementQuestions } from '@/data/quiz/movement';
import { locationActionQuestions } from '@/data/quiz/location-actions';
import { pastTenseQuestions } from '@/data/quiz/past-tense';
import { timeExpressionQuestions } from '@/data/quiz/time-expressions';
import { durationQuestions } from '@/data/quiz/duration';
import { positionQuestions } from '@/data/quiz/positions';
import { purposeQuestions } from '@/data/quiz/purpose';
import { commandQuestions } from '@/data/quiz/commands';
import { startEndQuestions } from '@/data/quiz/start-end';
import { directionMethodQuestions } from '@/data/quiz/direction-method';
import { desireQuestions } from '@/data/quiz/desires';
import { futureQuestions } from '@/data/quiz/future';
import { abilityQuestions } from '@/data/quiz/ability';
import { obligationQuestions } from '@/data/quiz/obligation';
import { skillQuestions } from '@/data/quiz/skills';
import { adjectiveQuestions } from '@/data/quiz/adjectives';
import { progressiveQuestions } from '@/data/quiz/progressive';
import { reasonQuestions } from '@/data/quiz/reasons';
import { contrastQuestions } from '@/data/quiz/contrast';
import { causeQuestions } from '@/data/quiz/cause';
import { conditionQuestions } from '@/data/quiz/conditions';
import { timeRelationQuestions } from '@/data/quiz/time-relations';
import { sequenceQuestions } from '@/data/quiz/sequence';
import DragAndDrop from '@/components/quiz/DragAndDrop/DragAndDrop';
import { KoreanQuestion } from '@/types/quiz';

const grammarSets: { [key: string]: { title: string; questions: KoreanQuestion[] } } = {
  introduction: {
    title: '은/는, 이에요/예요',
    questions: introductionQuestions,
  },
  demonstratives: {
    title: '이거, 그거, 저거',
    questions: demonstrativeQuestions,
  },
  negation: {
    title: '이/가 아니에요',
    questions: negationQuestions,
  },
  locations: {
    title: '여기, 거기, 저기',
    questions: locationQuestions,
  },
  existence: {
    title: '이/가 (Place)에 있어요/없어요',
    questions: existenceQuestions,
  },
  'basic-verbs': {
    title: '을/를, 아요/어요',
    questions: basicVerbQuestions,
  },
  'negative-sentences': {
    title: '안',
    questions: negativeSentenceQuestions,
  },
  movement: {
    title: '에 가요/와요',
    questions: movementQuestions,
  },
  'location-actions': {
    title: '에서',
    questions: locationActionQuestions,
  },
  'past-tense': {
    title: '았어요/었어요',
    questions: pastTenseQuestions,
  },
  'time-expressions': {
    title: '에(시간)',
    questions: timeExpressionQuestions,
  },
  duration: {
    title: '부터&까지',
    questions: durationQuestions,
  },
  positions: {
    title: '위&아래&앞&뒤',
    questions: positionQuestions,
  },
  purpose: {
    title: '으러 가요/와요',
    questions: purposeQuestions,
  },
  commands: {
    title: '으세요/지 마세요',
    questions: commandQuestions,
  },
  'start-end': {
    title: '에서&까지',
    questions: startEndQuestions,
  },
  'direction-method': {
    title: '으로',
    questions: directionMethodQuestions,
  },
  desires: {
    title: '고 싶다, 고 싶어하다',
    questions: desireQuestions,
  },
  future: {
    title: '을 거예요',
    questions: futureQuestions,
  },
  ability: {
    title: '수 있다/없다',
    questions: abilityQuestions,
  },
  obligation: {
    title: '아야/어야 해요',
    questions: obligationQuestions,
  },
  skills: {
    title: '못하다&잘하다&잘 못하다',
    questions: skillQuestions,
  },
  adjectives: {
    title: '형용사 + 은',
    questions: adjectiveQuestions,
  },
  progressive: {
    title: '고 있다',
    questions: progressiveQuestions,
  },
  reasons: {
    title: '아서/어서',
    questions: reasonQuestions,
  },
  contrast: {
    title: '지만, 는데',
    questions: contrastQuestions,
  },
  cause: {
    title: '으니까',
    questions: causeQuestions,
  },
  conditions: {
    title: '면',
    questions: conditionQuestions,
  },
  'time-relations': {
    title: '때',
    questions: timeRelationQuestions,
  },
  sequence: {
    title: '기 전, 은 후',
    questions: sequenceQuestions,
  },
};

export default function GrammarQuizPage({ params }: { params: { grammarId: string } }) {
  const grammarSet = grammarSets[params.grammarId];

  if (!grammarSet) {
    return <div>Grammar set not found</div>;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8 relative">
      <DragAndDrop questions={grammarSet.questions} title={grammarSet.title} />
    </div>
  );
}
