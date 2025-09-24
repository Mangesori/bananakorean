import FillInTheBlank from '@/components/quiz/FillInTheBlank/FillInTheBlank';
import { topicMeta, TopicId, topicIds } from '@/data/quiz/topics/meta';

const isTopicId = (value: string): value is TopicId => {
  return (topicIds as string[]).includes(value);
};

// 빈칸 채우기 퀴즈 데이터 import
import { introductionFillBlankQuestions } from '@/data/quiz/fill-blank/introduction';
import { demonstrativesFillBlankQuestions } from '@/data/quiz/fill-blank/demonstratives';
import { negationFillBlankQuestions } from '@/data/quiz/fill-blank/negation';
import { locationsFillBlankQuestions } from '@/data/quiz/fill-blank/locations';
import { existenceFillBlankQuestions } from '@/data/quiz/fill-blank/existence';
import { basicVerbsFillBlankQuestions } from '@/data/quiz/fill-blank/basic-verbs';
import { negativeSentencesFillBlankQuestions } from '@/data/quiz/fill-blank/negative-sentences';
import { movementFillBlankQuestions } from '@/data/quiz/fill-blank/movement';
import { locationActionsFillBlankQuestions } from '@/data/quiz/fill-blank/location-actions';
import { pastTenseFillBlankQuestions } from '@/data/quiz/fill-blank/past-tense';
import { timeExpressionsFillBlankQuestions } from '@/data/quiz/fill-blank/time-expressions';
import { durationFillBlankQuestions } from '@/data/quiz/fill-blank/duration';
import { positionsFillBlankQuestions } from '@/data/quiz/fill-blank/positions';
import { purposeFillBlankQuestions } from '@/data/quiz/fill-blank/purpose';
import { commandsFillBlankQuestions } from '@/data/quiz/fill-blank/commands';
import { startEndFillBlankQuestions } from '@/data/quiz/fill-blank/start-end';
import { directionMethodFillBlankQuestions } from '@/data/quiz/fill-blank/direction-method';
import { desiresFillBlankQuestions } from '@/data/quiz/fill-blank/desires';
import { futureFillBlankQuestions } from '@/data/quiz/fill-blank/future';
import { abilityFillBlankQuestions } from '@/data/quiz/fill-blank/ability';

const fillBlankSets: Partial<
  Record<TopicId, { title: string; questions: typeof introductionFillBlankQuestions }>
> = {
  introduction: {
    title: topicMeta.introduction.title,
    questions: introductionFillBlankQuestions,
  },
  demonstratives: {
    title: topicMeta.demonstratives.title,
    questions: demonstrativesFillBlankQuestions,
  },
  negation: {
    title: topicMeta.negation.title,
    questions: negationFillBlankQuestions,
  },
  locations: {
    title: topicMeta.locations.title,
    questions: locationsFillBlankQuestions,
  },
  existence: {
    title: topicMeta.existence.title,
    questions: existenceFillBlankQuestions,
  },
  'basic-verbs': {
    title: topicMeta['basic-verbs'].title,
    questions: basicVerbsFillBlankQuestions,
  },
  'negative-sentences': {
    title: topicMeta['negative-sentences'].title,
    questions: negativeSentencesFillBlankQuestions,
  },
  movement: {
    title: topicMeta.movement.title,
    questions: movementFillBlankQuestions,
  },
  'location-actions': {
    title: topicMeta['location-actions'].title,
    questions: locationActionsFillBlankQuestions,
  },
  'past-tense': {
    title: topicMeta['past-tense'].title,
    questions: pastTenseFillBlankQuestions,
  },
  'time-expressions': {
    title: topicMeta['time-expressions'].title,
    questions: timeExpressionsFillBlankQuestions,
  },
  duration: {
    title: topicMeta.duration.title,
    questions: durationFillBlankQuestions,
  },
  positions: {
    title: topicMeta.positions.title,
    questions: positionsFillBlankQuestions,
  },
  purpose: {
    title: topicMeta.purpose.title,
    questions: purposeFillBlankQuestions,
  },
  commands: {
    title: topicMeta.commands.title,
    questions: commandsFillBlankQuestions,
  },
  'start-end': {
    title: topicMeta['start-end'].title,
    questions: startEndFillBlankQuestions,
  },
  'direction-method': {
    title: topicMeta['direction-method'].title,
    questions: directionMethodFillBlankQuestions,
  },
  desires: {
    title: topicMeta.desires.title,
    questions: desiresFillBlankQuestions,
  },
  future: {
    title: topicMeta.future.title,
    questions: futureFillBlankQuestions,
  },
  ability: {
    title: topicMeta.ability.title,
    questions: abilityFillBlankQuestions,
  },
};

export default function FillBlankTopicPage({ params }: { params: { topic: string } }) {
  const key = params.topic;
  if (!isTopicId(key) || !(key in fillBlankSets)) {
    return <div className="container mx-auto px-4 py-8">Topic not found</div>;
  }
  const fillBlankSet = fillBlankSets[key as keyof typeof fillBlankSets]!;

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 2xl:py-8 relative">
      <FillInTheBlank questions={fillBlankSet.questions} title={fillBlankSet.title} />
    </div>
  );
}
