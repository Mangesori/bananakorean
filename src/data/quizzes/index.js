import { iyeyoYeyoQuestions } from "./iyeyoYeyoQuestions";
import { iGaAnieyoQuestions } from "./iGaAnieyoQuestions";
import { existenceQuestions } from "./existenceQuestions";
import { presentTenseQuestions } from "./presentTenseQuestions";
import { placeMarkersQuestions } from "./placeMarkersQuestions";
import { pastTenseQuestions } from "./pastTenseQuestions";
import { timeMarkersQuestions } from "./timeMarkersQuestions";
import { fromToTimeQuestions } from "./fromToTimeQuestions";
import { negativeQuestions } from "./negativeQuestions";
import { positionQuestions } from "./positionQuestions";
import { purposeGoComeQuestions } from "./purposeGoComeQuestions";
import { imperativeQuestions } from "./imperativeQuestions";
import { meansQuestions } from "./meansQuestions";
import { wantQuestions } from "./wantQuestions";
import { futureTenseQuestions } from "./futureTenseQuestions";
import { abilityQuestions } from "./abilityQuestions";
import { obligationQuestions } from "./obligationQuestions";
import { inabilityQuestions } from "./inabilityQuestions";
import { skillLevelQuestions } from "./skillLevelQuestions";
import { fromToLocationQuestions } from "./fromToLocationQuestions";

export const quizDataByTopic = {
  "은/는-이에요/예요": {
    questions: iyeyoYeyoQuestions,
  },
  "이/가-아니에요": {
    questions: iGaAnieyoQuestions,
  },
  "에-있어요/없어요": {
    questions: existenceQuestions,
  },
  "을/를-아요/어요": {
    questions: presentTenseQuestions,
  },
  "(Place)에서": {
    questions: placeMarkersQuestions,
  },
  "았어요/었어요": {
    questions: pastTenseQuestions,
  },
  "(Time)에": {
    questions: timeMarkersQuestions,
  },
  "부터/까지": {
    questions: fromToTimeQuestions,
  },
  "(안)": {
    questions: negativeQuestions,
  },
  "위/아래/앞/뒤": {
    questions: positionQuestions,
  },
  "으러-가요/와요": {
    questions: purposeGoComeQuestions,
  },
  "으세요/지-마세요": {
    questions: imperativeQuestions,
  },
  으로: {
    questions: meansQuestions,
  },
  "고-싶어요/싶어해요": {
    questions: wantQuestions,
  },
  "을-거예요": {
    questions: futureTenseQuestions,
  },
  "을-수-있어요/없어요": {
    questions: abilityQuestions,
  },
  "아야/어야-해요": {
    questions: obligationQuestions,
  },
  못: {
    questions: inabilityQuestions,
  },
  "못하다-잘하다-잘-못하다": {
    questions: skillLevelQuestions,
  },
  "에서/까지": {
    questions: fromToLocationQuestions,
  },
};

// 필요에 따라 각 질문 객체에 'questionType' 속성을 추가하여 필터링할 수 있습니다.
