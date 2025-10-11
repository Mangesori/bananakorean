import { introductionQuestions } from '@/data/quiz/DialogueDragAndDrop/introduction';
import { demonstrativeQuestions } from '@/data/quiz/DialogueDragAndDrop/demonstratives';
import { negationQuestions } from '@/data/quiz/DialogueDragAndDrop/negation';
import { locationQuestions } from '@/data/quiz/DialogueDragAndDrop/locations';
import { existenceQuestions } from '@/data/quiz/DialogueDragAndDrop/existence';
import { basicVerbQuestions } from '@/data/quiz/DialogueDragAndDrop/basic-verbs';
import { negativeSentenceQuestions } from '@/data/quiz/DialogueDragAndDrop/negative-sentences';
import { movementQuestions } from '@/data/quiz/DialogueDragAndDrop/movement';
import { locationActionQuestions } from '@/data/quiz/DialogueDragAndDrop/location-actions';
import { pastTenseQuestions } from '@/data/quiz/DialogueDragAndDrop/past-tense';
import { timeExpressionQuestions } from '@/data/quiz/DialogueDragAndDrop/time-expressions';
import { durationQuestions } from '@/data/quiz/DialogueDragAndDrop/duration';
import { positionQuestions } from '@/data/quiz/DialogueDragAndDrop/positions';
import { purposeQuestions } from '@/data/quiz/DialogueDragAndDrop/purpose';
import { commandQuestions } from '@/data/quiz/DialogueDragAndDrop/commands';
import { startEndQuestions } from '@/data/quiz/DialogueDragAndDrop/start-end';
import { directionMethodQuestions } from '@/data/quiz/DialogueDragAndDrop/direction-method';
import { desireQuestions } from '@/data/quiz/DialogueDragAndDrop/desires';
import { futureQuestions } from '@/data/quiz/DialogueDragAndDrop/future';
import { abilityQuestions } from '@/data/quiz/DialogueDragAndDrop/ability';
import { obligationQuestions } from '@/data/quiz/DialogueDragAndDrop/obligation';
import { skillQuestions } from '@/data/quiz/DialogueDragAndDrop/skills';
import { adjectiveQuestions } from '@/data/quiz/DialogueDragAndDrop/adjectives';
import { progressiveQuestions } from '@/data/quiz/DialogueDragAndDrop/progressive';
import { reasonQuestions } from '@/data/quiz/DialogueDragAndDrop/reasons';
import { contrastQuestions } from '@/data/quiz/DialogueDragAndDrop/contrast';
import { causeQuestions } from '@/data/quiz/DialogueDragAndDrop/cause';
import { conditionQuestions } from '@/data/quiz/DialogueDragAndDrop/conditions';
import { timeRelationQuestions } from '@/data/quiz/DialogueDragAndDrop/time-relations';
import { sequenceQuestions } from '@/data/quiz/DialogueDragAndDrop/sequence';
import DialogueDragAndDrop from '@/components/quiz/DialogueDragAndDrop/DialogueDragAndDrop';
import DialogueDragAndDropReview from '@/components/quiz/DialogueDragAndDrop/DialogueDragAndDropReview';
import { DialogueQuestion } from '@/types/quiz';
import { topicMeta, TopicId, topicIds } from '@/data/quiz/topics/meta';
import { getLastSessionWrongAttempts, getRetakeQuestions } from '@/lib/supabase/quiz-tracking';

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

export default async function DialogueQuizPage({
  params,
  searchParams,
}: {
  params: { dialogueId: string };
  searchParams: { reviewMode?: string; mode?: string };
}) {
  const key = params.dialogueId;

  if (!isTopicId(key)) {
    return <div>Dialogue set not found</div>;
  }

  const dialogueSet = dialogueSets[key];

  let questionsToShow = dialogueSet.questions;
  let reviewMode = false;

  // reviewMode가 'last-session'이면 최근 세션의 오답만 가져오기
  if (searchParams.reviewMode === 'last-session') {
    reviewMode = true;
    // topic ID를 한글 제목으로 변환 (DB에는 한글 제목으로 저장되어 있음)
    const grammarName = dialogueSet.title;
    const { data: wrongAttempts } = await getLastSessionWrongAttempts(
      grammarName,
      'dialogue_drag_drop'
    );

    if (wrongAttempts && wrongAttempts.length > 0) {
      // 오답 question_id로 원본 문제 필터링
      const wrongQuestionIds = wrongAttempts.map(attempt => attempt.question_id);
      questionsToShow = dialogueSet.questions.filter(q =>
        wrongQuestionIds.includes(q.id.toString())
      );
    } else {
      // 오답이 없으면 빈 배열
      questionsToShow = [];
    }
  }
  // 다시 풀기 모드 (mode=retake)
  else if (searchParams.mode === 'retake') {
    const grammarName = dialogueSet.title;
    const { data: questionIds } = await getRetakeQuestions(grammarName, 'dialogue_drag_drop');

    if (questionIds && questionIds.length > 0) {
      // 최근 세션의 question_id로 원본 문제 필터링
      questionsToShow = dialogueSet.questions.filter(q =>
        questionIds.includes(q.id.toString())
      );
    } else {
      // 이전 세션이 없으면 모든 문제 표시
      questionsToShow = dialogueSet.questions;
    }
  }

  // 복습 모드일 때는 DialogueDragAndDropReview 컴포넌트 사용
  if (reviewMode) {
    return (
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 2xl:py-8 relative">
        <DialogueDragAndDropReview
          questions={questionsToShow}
          title={dialogueSet.title}
          grammarName={dialogueSet.title}
          topic={key}
        />
      </div>
    );
  }

  // 일반 모드
  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 2xl:py-8 relative">
      <DialogueDragAndDrop
        questions={questionsToShow}
        title={dialogueSet.title}
      />
    </div>
  );
}
