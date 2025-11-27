/**
 * 한국어 문법 패턴 분석
 * 문장의 시제, 양태, 상을 분석하여 문법 구조를 파악합니다.
 */

/**
 * 문법 분석 결과
 */
export interface GrammarAnalysis {
  /** 시제: 현재, 과거, 미래 */
  tense: 'PRESENT' | 'PAST' | 'FUTURE';
  /** 양태: 평서, 능력/가능성, 희망, 의무, 명령 */
  modality: 'PLAIN' | 'ABILITY' | 'DESIRE' | 'OBLIGATION' | 'IMPERATIVE';
  /** 상: 단순, 진행 */
  aspect: 'SIMPLE' | 'PROGRESSIVE';
}

/**
 * 문장에서 문법 구조를 분석합니다.
 *
 * @param sentence - 분석할 한국어 문장
 * @returns 문법 분석 결과 (시제, 양태, 상)
 *
 * @example
 * analyzeGrammar("저는 한국어를 공부했어요.")
 * // → { tense: 'PAST', modality: 'PLAIN', aspect: 'SIMPLE' }
 *
 * analyzeGrammar("저는 한국어를 배울 수 있었어요.")
 * // → { tense: 'PAST', modality: 'ABILITY', aspect: 'SIMPLE' }
 *
 * analyzeGrammar("저는 책을 읽고 있어요.")
 * // → { tense: 'PRESENT', modality: 'PLAIN', aspect: 'PROGRESSIVE' }
 */
export function analyzeGrammar(sentence: string): GrammarAnalysis {
  const text = sentence.trim();

  let tense: GrammarAnalysis['tense'] = 'PRESENT';
  let modality: GrammarAnalysis['modality'] = 'PLAIN';
  let aspect: GrammarAnalysis['aspect'] = 'SIMPLE';

  // 1. 시제 확인
  // 과거형: ~았어요, ~었어요, ~했어요 등
  // 한국어 과거형은 항상 "어요"로 끝나며, 그 앞에 과거형 어미가 있습니다.
  // 
  // 과거형 어미 패턴 (체계적으로 분류):
  // 1. 기본 패턴: 았어요,었어요,했어요 (예: 놀았어요, 먹었어요, 했어요)
  // 2. 받침 ㅆ 패턴: 갔, 났, 랐, 샀, 잤, 찼, 탔, 팠 등
  // 3. 쳤/렸/웠/셨 패턴 확장: 겼, 녔, 뎠, 렸, 볐, 셨, 웠, 졌, 쳤, 켰, 텼, 폈, 혔 등
  // 4. 봤/왔 패턴: 놨, 봤, 왔
  // 5. 웠 패턴: 궜, 눴, 뒀, 웠, 줬, 췄 등
  // 6. 앴 패턴: 갰, 냈, 댔, 랬, 뱄, 샜, 쟀, 챘, 캤, 탰, 팼 등
  if (
    // 기본 패턴: 았어요,었어요,했어요
    /[가-힣]*[았었했]어요/.test(text) ||
    // 았 패턴: 갔, 났, 랐, 샀, 잤, 찼, 탔, 팠
    /[가-힣]*[갔났랐샀잤찼탔팠]어요/.test(text) ||
    // 였 패턴: 겼, 녔, 뎠, 렸, 볐, 셨, 웠, 졌, 쳤, 켰, 텼, 폈, 혔
    /[가-힣]*[겼녔뎠렸볐셨였졌쳤켰텼폈혔]어요/.test(text) ||
    // 왔 패턴: 놨, 봤, 왔
    /[가-힣]*[놨봤왔]어요/.test(text) ||
    // 웠 패턴: 궜, 눴, 뒀, 웠, 줬, 췄
    /[가-힣]*[궜눴뒀웠줬췄]어요/.test(text) ||
    // 앴 패턴: 갰, 냈, 댔, 랬, 뱄, 샜, 쟀, 챘, 캤, 탰, 팼
    /[가-힣]*[갰냈댔랬뱄샜쟀챘캤탰팼]어요/.test(text)
  ) {
    tense = 'PAST';
  }
  // 미래형: ~ㄹ 거예요, ~을 거예요 (띄어쓰기 필수)
  else if (/[가-힣]+[ㄹ을]\s거예요/.test(text)) {
    tense = 'FUTURE';
  }
  // 기본값: 현재형
  else {
    tense = 'PRESENT';
  }

  // 2. 양태 확인
  // 능력/가능성: ~ㄹ 수 있어요/없어요 (과거형 포함: ~ㄹ 수 있었어요)
  if (/[ㄹ을]\s수\s[있없]/.test(text)) {
    modality = 'ABILITY';
  }
  // 희망: ~고 싶어요 (과거형 포함: ~고 싶었어요)
  else if (/고\s싶/.test(text)) {
    modality = 'DESIRE';
  }
  // 의무: ~야 해요/돼요 (가야, 먹어야, 배워야 등 모두 포함)
  else if (/야\s[해돼]요[.?!]?$/.test(text)) {
    modality = 'OBLIGATION';
  }
  // 명령형: ~세요, ~으세요
  else if (/[으]?세요[.?!]?$/.test(text)) {
    modality = 'IMPERATIVE';
  }
  // 기본값: 평서형
  else {
    modality = 'PLAIN';
  }

  // 3. 상 확인
  // 진행형: ~고 있어요 (띄어쓰기 필수)
  if (/고\s있어요[.?!]?$/.test(text)) {
    aspect = 'PROGRESSIVE';
  }
  // 기본값: 단순상
  else {
    aspect = 'SIMPLE';
  }

  return { tense, modality, aspect };
}

/**
 * 두 문장의 문법이 일치하는지 확인합니다.
 *
 * @param templateSentence - 템플릿 문장
 * @param generatedSentence - 생성된 문장
 * @returns 문법이 일치하면 true, 아니면 false
 *
 * @example
 * matchGrammar("저는 독일어를 공부했어요.", "저는 한국어를 끝냈어요.")
 * // → true (둘 다 과거형)
 *
 * matchGrammar("친구가 있었어요.", "영화가 끝나요.")
 * // → false (과거형 vs 현재형)
 *
 * matchGrammar("한국어를 배울 수 있었어요.", "영어를 읽을 수 있었어요.")
 * // → true (둘 다 과거+능력)
 */
export function matchGrammar(templateSentence: string, generatedSentence: string): boolean {
  const templateGrammar = analyzeGrammar(templateSentence);
  const generatedGrammar = analyzeGrammar(generatedSentence);

  // 시제, 양태, 상이 모두 일치해야 함
  return (
    templateGrammar.tense === generatedGrammar.tense &&
    templateGrammar.modality === generatedGrammar.modality &&
    templateGrammar.aspect === generatedGrammar.aspect
  );
}

/**
 * 문법 분석 결과를 사람이 읽을 수 있는 문자열로 변환합니다.
 * (디버깅 및 로깅용)
 *
 * @param analysis - 문법 분석 결과
 * @returns 한국어 설명 문자열
 *
 * @example
 * const analysis = analyzeGrammar("먹었어요.");
 * grammarToString(analysis);
 * // → "과거형-평서-단순"
 */
export function grammarToString(analysis: GrammarAnalysis): string {
  const tenseMap = {
    PRESENT: '현재형',
    PAST: '과거형',
    FUTURE: '미래형',
  };

  const modalityMap = {
    PLAIN: '평서',
    ABILITY: '능력/가능성',
    DESIRE: '희망',
    OBLIGATION: '의무',
    IMPERATIVE: '명령',
  };

  const aspectMap = {
    SIMPLE: '단순',
    PROGRESSIVE: '진행',
  };

  return `${tenseMap[analysis.tense]}-${modalityMap[analysis.modality]}-${aspectMap[analysis.aspect]}`;
}
