import MultipleChoice from '@/components/quiz/MultipleChoice/MultipleChoice';
import { topicMeta, TopicId, topicIds } from '@/data/quiz/topics/meta';
import { getLastSessionWrongAttempts } from '@/lib/supabase/quiz-tracking';

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

export default async function MultipleTopicPage({
  params,
  searchParams,
}: {
  params: { topic: string };
  searchParams: { reviewMode?: string };
}) {
  const key = params.topic;
  if (!isTopicId(key) || !(key in mcqSets)) {
    return <div className="container mx-auto px-4 py-8">Topic not found</div>;
  }
  const mcqSet = mcqSets[key as keyof typeof mcqSets]!;

  let questionsToShow = mcqSet.questions;
  let reviewMode = false;

  // reviewMode가 'last-session'이면 최근 세션의 오답만 가져오기
  if (searchParams.reviewMode === 'last-session') {
    reviewMode = true;
    // topic ID를 한글 제목으로 변환 (DB에는 한글 제목으로 저장되어 있음)
    const grammarName = mcqSet.title;
    const { data: wrongAttempts, error } = await getLastSessionWrongAttempts(
      grammarName,
      'multiple_choice'
    );

    console.log('[Multiple Choice Review] Grammar:', grammarName, '(topic ID:', key, ')');
    console.log('[Multiple Choice Review] Wrong attempts:', wrongAttempts);
    console.log('[Multiple Choice Review] Error:', error);

    if (wrongAttempts && wrongAttempts.length > 0) {
      // 오답 question_id로 원본 문제 필터링
      const wrongQuestionIds = wrongAttempts.map(attempt => attempt.question_id);
      console.log('[Multiple Choice Review] Wrong question IDs:', wrongQuestionIds);
      questionsToShow = mcqSet.questions.filter(q => wrongQuestionIds.includes(q.id.toString()));
      console.log('[Multiple Choice Review] Filtered questions:', questionsToShow.length);
    } else {
      // 오답이 없으면 빈 배열
      questionsToShow = [];
      console.log('[Multiple Choice Review] No wrong attempts found');
    }
  }

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 2xl:py-8 relative">
      <MultipleChoice questions={questionsToShow} title={mcqSet.title} reviewMode={reviewMode} />
    </div>
  );
}
