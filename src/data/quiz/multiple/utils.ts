import { DialogueQuestion, MultipleChoiceQuestion, Item } from '@/types/quiz';

export const makeMcqFromDialogue = (questions: DialogueQuestion[]): MultipleChoiceQuestion[] => {
  const joinKorean = (items: Item[] = []): string => {
    return items.reduce((result, item, index) => {
      const shouldAddSpace = !item.combineWithNext && index !== items.length - 1;
      return result + item.content + (shouldAddSpace ? ' ' : '');
    }, '');
  };

  const getAnswerOptionText = (q: DialogueQuestion): string => {
    if (q.answerItems && q.answerItems.length) {
      // 정답지/보기에는 answerItems만 사용 (prefix/suffix 제거)
      return joinKorean(q.answerItems).trim();
    }
    return q.answer;
  };

  const answerPool = questions.map(getAnswerOptionText);
  const getQuestionOptionText = (q: DialogueQuestion): string => {
    if (q.questionItems && q.questionItems.length) {
      return joinKorean(q.questionItems).trim();
    }
    return q.question;
  };

  const questionPool = questions.map(getQuestionOptionText);

  // 우선 같은 토픽의 동일 풀에서 오답을 채우고,
  // 부족하면 반대 풀에서 보충하여 항상 3개의 오답을 반환
  const getDistractors = (
    primaryPool: string[],
    fallbackPool: string[],
    correct: string,
    index: number
  ): string[] => {
    const uniquePrimary = Array.from(new Set(primaryPool));
    const uniqueFallback = Array.from(new Set(fallbackPool));

    const isUsable = (txt: string, picked: string[]) =>
      txt && txt !== correct && !picked.includes(txt);

    const picked: string[] = [];
    const tryPick = (pool: string[]) => {
      if (pool.length === 0) return;
      for (let i = 0; i < pool.length && picked.length < 3; i += 1) {
        const candidate = pool[(index + i) % pool.length];
        if (isUsable(candidate, picked)) picked.push(candidate);
      }
    };

    tryPick(uniquePrimary);
    if (picked.length < 3) tryPick(uniqueFallback);

    return picked.slice(0, 3);
  };

  return questions.map((q, idx) => {
    const hasQuestionParts = Boolean(
      q.questionPrefix || (q.questionItems && q.questionItems.length) || q.questionSuffix
    );
    const isAnswerToQuestion = q.mode === 'answer-to-question' || hasQuestionParts;

    // 질문 영역: 'answer-to-question'이거나 question 조각이 있는 경우 영어 질문을 보여줌
    const displayQuestion = isAnswerToQuestion
      ? q.questionItemsTranslation || q.questionTranslation || q.question
      : q.question;

    // 답변 힌트(오버레이): 위 경우 한국어 답변을 보여주고, 기본은 영어 번역을 보여줌
    const displayAnswerOverlay = isAnswerToQuestion ? q.answer : q.answerTranslation;

    // 보기/정답 구성: answer-to-question 류이면 '질문' 보기, 아니면 '답변' 보기
    const correct = isAnswerToQuestion ? getQuestionOptionText(q) : getAnswerOptionText(q);
    const primary = isAnswerToQuestion ? questionPool : answerPool;
    const fallback = isAnswerToQuestion ? answerPool : questionPool;
    const options = [correct, ...getDistractors(primary, fallback, correct, idx)];

    return {
      id: q.id,
      question: displayQuestion,
      questionTranslation: q.questionTranslation,
      answerTranslation:
        q.answerPrefix || q.answerItems || q.answerSuffix
          ? q.answerPrefix || ''
          : displayAnswerOverlay,
      options,
      correctAnswer: correct,
      explanation: isAnswerToQuestion ? q.answerTranslation : q.answerTranslation,
      // 대화형의 question 조각 정보 전달 (MCQ에서 레이아웃 그대로 재현)
      questionPrefix: q.questionPrefix,
      questionItemsTranslation: q.questionItemsTranslation,
      questionSuffix: q.questionSuffix,
      // answer 조각 정보 전달 (MCQ에서 부분 영어 표시)
      answerPrefix: q.answerPrefix,
      answerItemsTranslation: q.answerItemsTranslation,
      answerSuffix: q.answerSuffix,
      mode: q.mode,
    } as MultipleChoiceQuestion;
  });
};
