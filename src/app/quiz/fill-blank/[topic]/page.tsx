import FillInTheBlank from '@/components/quiz/FillInTheBlank/FillInTheBlank';
import { topicMeta, TopicId, topicIds } from '@/data/quiz/topics/meta';
import { getLastSessionWrongAttempts } from '@/lib/supabase/quiz-tracking';

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

export default async function FillBlankTopicPage({
  params,
  searchParams,
}: {
  params: { topic: string };
  searchParams: { reviewMode?: string };
}) {
  const key = params.topic;
  if (!isTopicId(key) || !(key in fillBlankSets)) {
    return <div className="container mx-auto px-4 py-8">Topic not found</div>;
  }
  const fillBlankSet = fillBlankSets[key as keyof typeof fillBlankSets]!;

  let questionsToShow = fillBlankSet.questions;
  let reviewMode = false;

  // reviewMode가 'last-session'이면 최근 세션의 오답만 가져오기
  if (searchParams.reviewMode === 'last-session') {
    reviewMode = true;
    // topic ID를 한글 제목으로 변환 (DB에는 한글 제목으로 저장되어 있음)
    const grammarName = fillBlankSet.title;
    const { data: wrongAttempts } = await getLastSessionWrongAttempts(grammarName, 'fill_in_blank');

    if (wrongAttempts && wrongAttempts.length > 0) {
      // 오답 question_id로 원본 문제 필터링
      const wrongQuestionIds = wrongAttempts.map(attempt => attempt.question_id);
      questionsToShow = fillBlankSet.questions.filter(q =>
        wrongQuestionIds.includes(q.id.toString())
      );
    } else {
      // 오답이 없으면 빈 배열
      questionsToShow = [];
    }
  }

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 2xl:py-8 relative">
      <FillInTheBlank
        questions={questionsToShow}
        title={fillBlankSet.title}
        reviewMode={reviewMode}
      />
    </div>
  );
}
