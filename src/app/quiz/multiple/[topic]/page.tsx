import MultipleChoice from '@/components/quiz/MultipleChoice/MultipleChoice';
import { topicMeta, TopicId, topicIds } from '@/data/quiz/topics/meta';

const isTopicId = (value: string): value is TopicId => {
  return (topicIds as string[]).includes(value);
};
import { introductionMcqQuestions } from '@/data/quiz/multiple/introduction';
import { demonstrativesMcqQuestions } from '@/data/quiz/multiple/demonstratives';
import { abilityMcqQuestions } from '@/data/quiz/multiple/ability';
import { negationMcqQuestions } from '@/data/quiz/multiple/negation';
import { locationsMcqQuestions } from '@/data/quiz/multiple/locations';
import { existenceMcqQuestions } from '@/data/quiz/multiple/existence';
import { basicVerbsMcqQuestions } from '@/data/quiz/multiple/basic-verbs';
import { negativeSentencesMcqQuestions } from '@/data/quiz/multiple/negative-sentences';
import { movementMcqQuestions } from '@/data/quiz/multiple/movement';
import { locationActionsMcqQuestions } from '@/data/quiz/multiple/location-actions';
import { pastTenseMcqQuestions } from '@/data/quiz/multiple/past-tense';
import { timeExpressionsMcqQuestions } from '@/data/quiz/multiple/time-expressions';
import { durationMcqQuestions } from '@/data/quiz/multiple/duration';
import { positionsMcqQuestions } from '@/data/quiz/multiple/positions';
import { purposeMcqQuestions } from '@/data/quiz/multiple/purpose';
import { commandsMcqQuestions } from '@/data/quiz/multiple/commands';
import { startEndMcqQuestions } from '@/data/quiz/multiple/start-end';
import { directionMethodMcqQuestions } from '@/data/quiz/multiple/direction-method';
import { desiresMcqQuestions } from '@/data/quiz/multiple/desires';
import { futureMcqQuestions } from '@/data/quiz/multiple/future';

const mcqSets: Partial<
  Record<TopicId, { title: string; questions: typeof introductionMcqQuestions }>
> = {
  introduction: {
    title: topicMeta.introduction.title,
    questions: introductionMcqQuestions,
  },
  demonstratives: {
    title: topicMeta.demonstratives.title,
    questions: demonstrativesMcqQuestions,
  },
  negation: {
    title: topicMeta.negation.title,
    questions: negationMcqQuestions,
  },
  locations: {
    title: topicMeta.locations.title,
    questions: locationsMcqQuestions,
  },
  existence: {
    title: topicMeta.existence.title,
    questions: existenceMcqQuestions,
  },
  'basic-verbs': {
    title: topicMeta['basic-verbs'].title,
    questions: basicVerbsMcqQuestions,
  },
  'negative-sentences': {
    title: topicMeta['negative-sentences'].title,
    questions: negativeSentencesMcqQuestions,
  },
  movement: {
    title: topicMeta.movement.title,
    questions: movementMcqQuestions,
  },
  'location-actions': {
    title: topicMeta['location-actions'].title,
    questions: locationActionsMcqQuestions,
  },
  'past-tense': {
    title: topicMeta['past-tense'].title,
    questions: pastTenseMcqQuestions,
  },
  'time-expressions': {
    title: topicMeta['time-expressions'].title,
    questions: timeExpressionsMcqQuestions,
  },
  duration: {
    title: topicMeta.duration.title,
    questions: durationMcqQuestions,
  },
  positions: {
    title: topicMeta.positions.title,
    questions: positionsMcqQuestions,
  },
  purpose: {
    title: topicMeta.purpose.title,
    questions: purposeMcqQuestions,
  },
  commands: {
    title: topicMeta.commands.title,
    questions: commandsMcqQuestions,
  },
  'start-end': {
    title: topicMeta['start-end'].title,
    questions: startEndMcqQuestions,
  },
  'direction-method': {
    title: topicMeta['direction-method'].title,
    questions: directionMethodMcqQuestions,
  },
  desires: {
    title: topicMeta.desires.title,
    questions: desiresMcqQuestions,
  },
  future: {
    title: topicMeta.future.title,
    questions: futureMcqQuestions,
  },
  ability: {
    title: topicMeta.ability.title,
    questions: abilityMcqQuestions,
  },
};

export default function MultipleTopicPage({ params }: { params: { topic: string } }) {
  const key = params.topic;
  if (!isTopicId(key) || !(key in mcqSets)) {
    return <div className="container mx-auto px-4 py-8">Topic not found</div>;
  }
  const mcqSet = mcqSets[key as keyof typeof mcqSets]!;

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 2xl:py-8 relative">
      <MultipleChoice questions={mcqSet.questions} title={mcqSet.title} />
    </div>
  );
}
