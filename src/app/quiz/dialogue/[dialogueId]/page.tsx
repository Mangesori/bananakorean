import { introductionQuestions } from '@/data/quiz/dialogue/introduction';
import { demonstrativeQuestions } from '@/data/quiz/dialogue/demonstratives';
import { negationQuestions } from '@/data/quiz/dialogue/negation';
import { locationQuestions } from '@/data/quiz/dialogue/locations';
import { existenceQuestions } from '@/data/quiz/dialogue/existence';
import { basicVerbQuestions } from '@/data/quiz/dialogue/basic-verbs';
import { negativeSentenceQuestions } from '@/data/quiz/dialogue/negative-sentences';
import { movementQuestions } from '@/data/quiz/dialogue/movement';
import { locationActionQuestions } from '@/data/quiz/dialogue/location-actions';
import { pastTenseQuestions } from '@/data/quiz/dialogue/past-tense';
import { timeExpressionQuestions } from '@/data/quiz/dialogue/time-expressions';
import { durationQuestions } from '@/data/quiz/dialogue/duration';
import { positionQuestions } from '@/data/quiz/dialogue/positions';
import { purposeQuestions } from '@/data/quiz/dialogue/purpose';
import { commandQuestions } from '@/data/quiz/dialogue/commands';
import { startEndQuestions } from '@/data/quiz/dialogue/start-end';
import { directionMethodQuestions } from '@/data/quiz/dialogue/direction-method';
import { desireQuestions } from '@/data/quiz/dialogue/desires';
import { futureQuestions } from '@/data/quiz/dialogue/future';
import { abilityQuestions } from '@/data/quiz/dialogue/ability';
import { obligationQuestions } from '@/data/quiz/dialogue/obligation';
import { skillQuestions } from '@/data/quiz/dialogue/skills';
import { adjectiveQuestions } from '@/data/quiz/dialogue/adjectives';
import { progressiveQuestions } from '@/data/quiz/dialogue/progressive';
import { reasonQuestions } from '@/data/quiz/dialogue/reasons';
import { contrastQuestions } from '@/data/quiz/dialogue/contrast';
import { causeQuestions } from '@/data/quiz/dialogue/cause';
import { conditionQuestions } from '@/data/quiz/dialogue/conditions';
import { timeRelationQuestions } from '@/data/quiz/dialogue/time-relations';
import { sequenceQuestions } from '@/data/quiz/dialogue/sequence';
import DialogueDragAndDrop from '@/components/quiz/DialogueDragAndDrop/DialogueDragAndDrop';
import { DialogueQuestion } from '@/types/quiz';
import { topicMeta, TopicId, topicIds } from '@/data/quiz/topics/meta';

const isTopicId = (value: string): value is TopicId => {
  return (topicIds as string[]).includes(value);
};

const dialogueSets: Record<TopicId, { title: string; questions: DialogueQuestion[] }> = {
  introduction: {
    title: topicMeta.introduction.title,
    questions: introductionQuestions,
  },
  demonstratives: {
    title: topicMeta.demonstratives.title,
    questions: demonstrativeQuestions,
  },
  negation: {
    title: topicMeta.negation.title,
    questions: negationQuestions,
  },
  locations: {
    title: topicMeta.locations.title,
    questions: locationQuestions,
  },
  existence: {
    title: topicMeta.existence.title,
    questions: existenceQuestions,
  },
  'basic-verbs': {
    title: topicMeta['basic-verbs'].title,
    questions: basicVerbQuestions,
  },
  'negative-sentences': {
    title: topicMeta['negative-sentences'].title,
    questions: negativeSentenceQuestions,
  },
  movement: {
    title: topicMeta.movement.title,
    questions: movementQuestions,
  },
  'location-actions': {
    title: topicMeta['location-actions'].title,
    questions: locationActionQuestions,
  },
  'past-tense': {
    title: topicMeta['past-tense'].title,
    questions: pastTenseQuestions,
  },
  'time-expressions': {
    title: topicMeta['time-expressions'].title,
    questions: timeExpressionQuestions,
  },
  duration: {
    title: topicMeta.duration.title,
    questions: durationQuestions,
  },
  positions: {
    title: topicMeta.positions.title,
    questions: positionQuestions,
  },
  purpose: {
    title: topicMeta.purpose.title,
    questions: purposeQuestions,
  },
  commands: {
    title: topicMeta.commands.title,
    questions: commandQuestions,
  },
  'start-end': {
    title: topicMeta['start-end'].title,
    questions: startEndQuestions,
  },
  'direction-method': {
    title: topicMeta['direction-method'].title,
    questions: directionMethodQuestions,
  },
  desires: {
    title: topicMeta.desires.title,
    questions: desireQuestions,
  },
  future: {
    title: topicMeta.future.title,
    questions: futureQuestions,
  },
  ability: {
    title: topicMeta.ability.title,
    questions: abilityQuestions,
  },
  obligation: {
    title: topicMeta.obligation.title,
    questions: obligationQuestions,
  },
  skills: {
    title: topicMeta.skills.title,
    questions: skillQuestions,
  },
  adjectives: {
    title: topicMeta.adjectives.title,
    questions: adjectiveQuestions,
  },
  progressive: {
    title: topicMeta.progressive.title,
    questions: progressiveQuestions,
  },
  reasons: {
    title: topicMeta.reasons.title,
    questions: reasonQuestions,
  },
  contrast: {
    title: topicMeta.contrast.title,
    questions: contrastQuestions,
  },
  cause: {
    title: topicMeta.cause.title,
    questions: causeQuestions,
  },
  conditions: {
    title: topicMeta.conditions.title,
    questions: conditionQuestions,
  },
  'time-relations': {
    title: topicMeta['time-relations'].title,
    questions: timeRelationQuestions,
  },
  sequence: {
    title: topicMeta.sequence.title,
    questions: sequenceQuestions,
  },
};

export default function DialogueQuizPage({ params }: { params: { dialogueId: string } }) {
  const key = params.dialogueId;

  if (!isTopicId(key)) {
    return <div>Dialogue set not found</div>;
  }

  const dialogueSet = dialogueSets[key];

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 2xl:py-8 relative">
      <DialogueDragAndDrop questions={dialogueSet.questions} title={dialogueSet.title} />
    </div>
  );
}
