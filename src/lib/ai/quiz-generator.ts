import { TopicId } from '@/data/quiz/topics/meta';
import { DialogueQuestion, Item } from '@/types/quiz';
import {
  QuizGenerationRequest,
  QuizGenerationResponse,
  QuestionGenerationResult,
} from '@/types/custom-quiz';
import { grammarPatterns, DialoguePattern } from './patterns';
import { chatCompletionJSON } from './client';
import { analyzeVocabulary, AnalyzedVocabulary } from './vocabulary-analyzer';
import { PARTICLES } from '@/lib/korean/particles';

/**
 * AI 퀴즈 생성기 (버전 2.0: 성능 최적화)
 * 
 * [개선 사항]
 * 1. 병렬 실행 (Parallel Execution): 순차적 생성 대신 배치 단위 병렬 생성으로 속도 3~5배 향상
 * 2. 사전 할당 (Pre-assignment): 단어 중복 방지를 위해 생성 전 문법과 단어를 미리 배정
 * 3. 자연스러움 보장: 단어 사용 강제와 자연스러움 사이의 균형 유지
 */
export class QuizGenerator {
  /**
   * 메인 진입점: 요청에 따라 문제 생성
   * 
   * [처리 흐름]
   * 1. 어휘 분석 및 문법 호환성 체크
   * 2. 계획 수립 (Planning): 각 문제에 어떤 문법과 단어를 쓸지 미리 결정
   * 3. 병렬 실행 (Execution): 계획에 따라 AI 호출 (Batch 처리)
   * 4. 결과 집계 및 보정
   */
  async generateQuestions(
    request: QuizGenerationRequest
  ): Promise<QuizGenerationResponse> {
    const startTime = Date.now();
    const results: DialogueQuestion[] = [];
    const errors: string[] = [];
    let templateUsed = 0;
    let fromScratchUsed = 0;

    // -------------------------------------------------------------------------
    // Step 1: 어휘 분석 및 문법 준비 (Analysis)
    // -------------------------------------------------------------------------
    console.log('Step 1: 어휘 분석 시작:', request.vocabulary);
    const analysisResult = await analyzeVocabulary(request.vocabulary);
    const analyzedVocab = analysisResult.analyzed;

    // 문법 가중치 및 최소 보장 수량 계산
    const sortedTopics = [...request.grammarTopics].reverse(); // 난이도 역순
    const weights = this.calculateGrammarWeights(sortedTopics);

    // 각 문법별 호환 어휘 미리 파악 (Planning을 위해)
    const grammarCompatibility = new Map<TopicId, AnalyzedVocabulary[]>();
    for (const topic of request.grammarTopics) {
      const definition = grammarPatterns.find((g) => g.topicId === topic);
      if (!definition) continue;

      const compatible = analyzedVocab.filter((v) =>
        definition.acceptedTypes.includes(v.type) ||
        (v.subType && definition.acceptedTypes.includes(v.subType as any))
      );
      grammarCompatibility.set(topic, compatible);
    }

    // -------------------------------------------------------------------------
    // Step 2: 생성 계획 수립 (Planning)
    // -------------------------------------------------------------------------
    console.log('Step 2: 생성 계획 수립 (Pre-assignment)');
    const generationPlan: {
      index: number;
      grammarTopic: TopicId;
      targetVocabs: AnalyzedVocabulary[];
      mode: 'hybrid' | 'from-scratch';
    }[] = [];

    // 2-1. 문법 할당 (최소 1회 보장 + 가중치 랜덤)
    for (let i = 0; i < request.count; i++) {
        let selectedTopic: TopicId;
        
        // 최소 1회 보장
        if (i < sortedTopics.length) {
            selectedTopic = sortedTopics[i];
        } else {
            selectedTopic = this.selectGrammarByWeight(sortedTopics, weights);
        }
        
        generationPlan.push({
            index: i,
            grammarTopic: selectedTopic,
            targetVocabs: [], // 단어는 다음 단계에서 할당
            mode: (request.mode === 'both' ? 'hybrid' : request.mode) || 'hybrid'
        });
    }

    // 2-2. 어휘 할당 (미사용 어휘 우선 배정)
    // 전체 미사용 어휘 풀 생성
    let unusedPool = [...analyzedVocab];
    
    // 각 슬롯(문제)을 순회하며 호환되는 미사용 어휘 배정
    generationPlan.forEach((plan) => {
        const compatibleVocabs = grammarCompatibility.get(plan.grammarTopic) || [];
        
        // 이 문법에 쓸 수 있는 미사용 어휘 찾기
        const assignableUnused = compatibleVocabs.filter(v => 
            unusedPool.some(u => u.word === v.word)
        );

        if (assignableUnused.length > 0) {
            // 미사용 어휘가 있으면 할당
            // (자연스러운 문장을 위해 1개만 필수 할당하고 나머지는 나중에 Padding)
            const selected = assignableUnused[0];
            plan.targetVocabs.push(selected);
            
            // 풀에서 제거 (중복 사용 방지)
            unusedPool = unusedPool.filter(u => u.word !== selected.word);
        }
    });

    // 2-3. 어휘 부족분 채우기 (Padding)
    // AI가 문장을 만들려면 단어가 1개로는 부족할 수 있으므로, 이미 쓴 단어라도 섞어서 3개 정도 맞춰줌
    generationPlan.forEach((plan) => {
        if (plan.targetVocabs.length < 3) {
            const compatibleVocabs = grammarCompatibility.get(plan.grammarTopic) || [];
            // 이미 할당된 것 제외
            const pool = compatibleVocabs.filter(v => !plan.targetVocabs.some(t => t.word === v.word));
            
            // 랜덤 셔플 후 부족한 만큼 추가
            const additional = pool.sort(() => 0.5 - Math.random()).slice(0, 3 - plan.targetVocabs.length);
            plan.targetVocabs.push(...additional);
        }
    });

    // -------------------------------------------------------------------------
    // Step 3: 병렬 실행 (Parallel Execution)
    // -------------------------------------------------------------------------
    console.log(`Step 3: 병렬 실행 시작 (총 ${request.count}문제)`);
    
    // 배치 크기 설정 (동시 실행 수)
    const BATCH_SIZE = 5; 
    
    for (let i = 0; i < generationPlan.length; i += BATCH_SIZE) {
        const batch = generationPlan.slice(i, i + BATCH_SIZE);
        console.log(`배치 실행: ${i + 1} ~ ${i + batch.length}`);

        const promises = batch.map(async (plan) => {
            try {
                let result: QuestionGenerationResult;

                // 🌟 [변경] 커스텀 모드 생성 방식: '하이브리드' 제거 -> '처음부터 생성' 전용
                // 사용자의 요청에 따라 모든 문제를 From-Scratch로 생성합니다.
                result = await this.generateFromScratchQuestion(
                    analyzedVocab, // 전체 어휘 정보 (참고용)
                    plan.grammarTopic,
                    plan.targetVocabs, // 🌟 사전 할당된 단어만 전달
                    request.grammarTopics
                );

                return { success: true, result, plan };
            } catch (error) {
                return { success: false, error, plan };
            }
        });

        // 배치 완료 대기
        const batchResults = await Promise.all(promises);

        // 결과 처리
        for (const batchResult of batchResults) {
            if (batchResult.success && batchResult.result?.question) {
                results.push(batchResult.result.question);
                if (batchResult.result.method === 'template') templateUsed++;
                else fromScratchUsed++;
            } else {
                // 실패 시 에러 기록 (재시도는 복잡도상 생략하거나 추후 추가)
                const errorMsg = batchResult.error instanceof Error ? batchResult.error.message : JSON.stringify(batchResult.error);
                console.error(`❌ 문제 ${batchResult.plan.index + 1} 생성 실패 상세:`, batchResult.error); // 🔍 Full Error Log
                errors.push(`문제 ${batchResult.plan.index + 1} 실패: ${errorMsg}`);
                
                // ⚠️ 실패 시 템플릿으로 대체 (Fallback)
                console.warn(`생성 실패 -> 템플릿 대체 (Index: ${batchResult.plan.index})`);
                const fallback = this.reuseTemplateExample(batchResult.plan.grammarTopic);
                if (fallback.success && fallback.question) {
                    results.push(fallback.question);
                    templateUsed++;
                    errors.push(`문제 ${batchResult.plan.index + 1}: 템플릿으로 대체됨`);
                }
            }
        }
    }

    // -------------------------------------------------------------------------
    // Step 4: 최종 검증 및 반환 (Finalization)
    // -------------------------------------------------------------------------
    const totalTime = (Date.now() - startTime) / 1000;
    console.log(`생성 완료: ${totalTime.toFixed(1)}초, 성공: ${results.length}/${request.count}`);

    return {
      success: results.length === request.count,
      questions: results,
      metadata: {
        totalRequested: request.count,
        totalGenerated: results.length,
        failedCount: errors.length,
        templateUsed,
        fromScratchUsed,
      },
      error: errors.length > 0 ? `${errors.length}개 문제 생성 중 오류/대체 발생` : undefined,
    };
  }

  // ===========================================================================
  // Internal Methods (수정됨)
  // ===========================================================================

  /**
   * 하이브리드 방식: 템플릿 우선 -> 실패 시 From-Scratch
   */
  private async generateHybridQuestion(
    fullVocab: AnalyzedVocabulary[],
    grammarTopic: TopicId,
    targetVocabs: AnalyzedVocabulary[], // 🌟 할당된 단어
    allGrammarTopics: TopicId[]
  ): Promise<QuestionGenerationResult> {
    const definition = grammarPatterns.find((g) => g.topicId === grammarTopic);
    if (!definition) return { success: false, question: null, error: '문법 정의 없음' };

    // 1. 호환 단어가 없다면 바로 템플릿 예제 사용
    if (targetVocabs.length === 0) {
        return this.reuseTemplateExample(grammarTopic);
    }

    // 2. 패턴 선택 (할당된 단어 기반)
    const pattern = this.selectBestPattern(targetVocabs, grammarTopic);

    // 3. 템플릿 생성 시도
    if (pattern) {
        try {
            const question = await this.generateFromTemplate(
                targetVocabs,
                pattern,
                grammarTopic,
                definition.grammarName
            );
            if (this.validateGrammarOnly(question, allGrammarTopics)) {
                return { success: true, question, method: 'template' };
            }
        } catch (e) {
            console.warn('템플릿 생성 실패, Scratch로 전환');
        }
    }

    // 4. From-Scratch로 전환
    return this.generateFromScratchQuestion(fullVocab, grammarTopic, targetVocabs, allGrammarTopics);
  }

  /**
   * 처음부터 생성 방식
   */
  private async generateFromScratchQuestion(
    fullVocab: AnalyzedVocabulary[],
    grammarTopic: TopicId,
    targetVocabs: AnalyzedVocabulary[],
    allGrammarTopics: TopicId[]
  ): Promise<QuestionGenerationResult> {
    const definition = grammarPatterns.find((g) => g.topicId === grammarTopic);
    if (!definition) return { success: false, question: null, error: '문법 정의 없음' };

    try {
        const question = await this.generateFromScratch(
            targetVocabs,
            grammarTopic,
            definition.grammarName
        );

        if (this.validateGrammarOnly(question, allGrammarTopics)) {
            return { success: true, question, method: 'from-scratch' };
        } else {
            console.warn(`[검증 실패] 금지된 문법 포함됨. 질문: "${question.question}", 답변: "${question.answer}"`);
            return { success: false, question: null, error: '금지된 문법 감지' };
        }
    } catch (error) {
        console.error('From-Scratch 생성 중 예외 발생:', error);
        return { success: false, question: null, error: error instanceof Error ? error.message : 'Unknown' };
    }
  }

  /**
   * [Refined] 패턴 선택 로직
   * - 이미 할당된 'targetVocabs'가 예제에 포함된 패턴을 강력하게 선호
   */
  private selectBestPattern(
    targetVocabs: AnalyzedVocabulary[],
    grammarTopic: TopicId
  ): DialoguePattern | null {
    const definition = grammarPatterns.find((g) => g.topicId === grammarTopic);
    if (!definition || !definition.patterns.length) return null;

    const scored = definition.patterns.map((pattern) => {
        let score = Math.random() * 5; // 기본 랜덤 점수

        // 타겟 단어가 예제에 있는지 확인
        for (const vocab of targetVocabs) {
            for (const example of pattern.examples) {
                if (example.vocabulary === vocab.word || example.answer.includes(vocab.word)) {
                    score += 50; // ⭐ 강력한 가산점 (할당된 단어 활용 보장)
                }
            }
        }
        return { pattern, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0].pattern; // 가장 점수 높은 패턴 반환
  }

  // ===========================================================================
  // AI Prompt Generators (수정됨)
  // ===========================================================================

  private async generateFromTemplate(
    targetVocabs: AnalyzedVocabulary[],
    pattern: DialoguePattern,
    grammarTopic: TopicId,
    grammarName: string
  ): Promise<DialogueQuestion> {
    const vocabString = targetVocabs.map(v => `${v.word} (${v.type})`).join(', ');

    const prompt = `당신은 한국어 퀴즈 생성기입니다.
문법: ${grammarName}
패턴: Q: ${pattern.questionTemplate} / A: ${pattern.answerTemplate}
사용자 어휘: ${vocabString}

[패턴 예제]
${pattern.examples.slice(0, 2).map(ex => `Q: ${ex.question}\nA: ${ex.answer}`).join('\n')}

[작업]
위 패턴과 사용자 어휘를 사용하여 새로운 대화 문제를 만드세요.
사용자 어휘를 가능한 한 사용하되, 문장이 부자연스러워지면 사용하지 마세요. (자연스러움 우선)

[출력 형식 JSON]
{
  "question": "질문 텍스트",
  "questionTranslation": "질문 영문 번역",
  "answer": "답변 텍스트",
  "answerTranslation": "답변 영문 번역",
  "items": [{"id":"1","content":"...","combineWithNext":true}, ...]
}

⚠️ Spacing(띄어쓰기) 및 Items 규칙:
1. 답변을 단어 단위로 분리하여 items 배열에 넣으세요.
2. combineWithNext 규칙:
   - 조사/어미/구두점 등 '앞 단어와 붙여 써야 하는 경우': 앞 단어의 combineWithNext=true
   - 띄어쓰기 해야 하는 경우: combineWithNext=false
   - 예: "학교에 가요." -> 
     [{"content":"학교","combineWithNext":true}, {"content":"에","combineWithNext":false}, {"content":"가요","combineWithNext":true}, {"content":".","combineWithNext":false}]
3. 문장 끝에는 반드시 마침표(.)나 물음표(?)가 포함되어야 하며, 별도의 item으로 분리하세요.`;

    // 디버깅: AI 응답 확인
    // console.log('AI 응답 (Template):', JSON.stringify(prompt).slice(0, 100) + '...');
    
    return this.callAIAndParse(prompt, grammarName);
  }

  private async generateFromScratch(
    targetVocabs: AnalyzedVocabulary[],
    grammarTopic: TopicId,
    grammarName: string
  ): Promise<DialogueQuestion> {
     const vocabString = targetVocabs.map(v => `${v.word} (${v.type})`).join(', ');

     // 1. 문법별 특수 규칙 정의 (Modular Rules)
     const GRAMMAR_SPECIFIC_RULES: Partial<Record<TopicId, string>> = {
        // 연결어미 (지만, 근데)
        'contrast-but': `
⚠️ [문법별 핵심 가이드] '지만', '근데' (Contrast):
1. **한 문장으로 연결**: 두 문장을 마침표(.)나 접속사('그런데')로 끊지 말고, 자연스럽게 한 문장으로 이으세요.
   - 예: "공원에 가요. 그런데 추워요" (X) -> "공원에 가는데 추워요" (O)
2. **논리적 대조**: 내용이 서로 반대되거나 비교되어야 합니다.
   - 예: "저는 영화를 보는데 친구와 놀아요" (X - 부자연스러움) -> "**언니는** 영화를 보는데 **저는** 친구와 놀아요" (O - 주어 대조) 또는 "떡볶이는 **맵지만 맛있어요**" (O - 형용사 대조)
`,
        // 시간 순서 (기 전, 은 후)
        sequence: `
⚠️ [문법별 핵심 가이드] '기 전', '은 후' (Sequence):
1. **문법적 정확성**: '-(으)ㄴ 후에' 문법을 지키세요. 동사 뒤에 '후에'가 올 때는 반드시 관형사형 '-(으)ㄴ'을 써야 합니다.
   - 예: "일어나는 후에"(X) -> "**일어난 후에**"(O), "먹는 후에"(X) -> "**먹은 후에**"(O)
2. **조사 필수**: '기 전에', '은 후에'와 같이 조사를 명확히 쓰세요. (생략 금지)
3. **논리적 일치**: 질문의 시점(전/후)과 답변의 시점이 논리적으로 맞아야 합니다.
   - 예: Q "숙제를 끝내기 **전에** 뭐 해요?" -> A "숙제를 하기 **전에** 청소해요." (O) / "숙제를 한 **후에** 놀아요." (X - 동문서답)
`,
        // 능력/기술 (잘하다/못하다)
        skills: `
⚠️ [문법별 핵심 가이드] '잘하다/못하다' (Skills):
1. **능력(Skill) 중심**: '무엇을 잘해요?'라는 질문은 단순 감상이 아니라 '능력/기술'을 묻는 것입니다.
   - 요리, 운동, 악기 연주, 외국어 등 **배워서 할 수 있는 기술**로 답하세요.
   - 예: "음악을 잘 들어요" (X - 감상) -> "**노래를 잘 불러요**" (O), "**피아노를 잘 쳐요**" (O)
`,
        // 가능/능력 (수 있다/없다)
        ability: `
⚠️ [문법별 핵심 가이드] '-(으)ㄹ 수 있다/없다' (Ability/Possibility):
1. **단순 일상 금지**: "밥을 먹을 수 있어요" 같은 뻔한 말 대신, **능력(운전, 수영)**이나 **특별한 허가/상황**을 표현하세요.
   - 예: "운전할 수 있어요" (O), "매운 김치를 먹을 수 있어요" (O - 능력)
`,
        // 의무 (아야/어야 하다)
        obligation: `
⚠️ [문법별 핵심 가이드] '아야/어야 하다' (Obligation):
1. **주어-서술어 호응**: 자동사(Intransitive)를 쓸 때, 주어가 의무를 가질 수 있는지 확인하세요.
   - 예: "수업이 끝나야 해요" (X - 수업은 의지가 없음) -> "**숙제를 끝내야 해요**" (O - 타동사 사용 권장)
`,
        // 수단/방법 (어떻게)
        'direction-method': `
⚠️ [문법별 핵심 가이드] '어떻게' (Method):
1. **수단/방법**: '어떻게 가요?'(교통수단), '어떻게 해요?'(방법/태도) 등으로 답하세요.
   - 장소로 답하거나, 막연히 '잘 해요'라고 하지 마세요.
`
     };

     // 해당 문법에 맞는 규칙 가져오기 (없으면 빈 문자열)
     const specificRule = GRAMMAR_SPECIFIC_RULES[grammarTopic] || '';

     // 공통 프롬프트 구성
     const prompt = `당신은 한국어 퀴즈 생성기입니다. 주어진 문법을 사용하여 대화형 드래그앤드롭 문제를 처음부터 생성하세요.

문법 주제: ${grammarName}
사용자 어휘 (품사 태그 포함): ${vocabString}

작업: 위 문법을 사용하는 자연스러운 대화 문제를 생성하세요.
${specificRule}

⚠️ [공통] 다양성 및 중복 방지:
1. 가능한 한 다양한 어휘를 조합하세요.
2. 동일한 단어 조합이 반복해서 나오지 않도록 주의하세요.
3. 아직 사용되지 않은 명사(Noun)와 동사(Verb)가 있다면, 그 둘을 조합해보세요.
4. **[중요]** 단, 억지로 어휘를 쓰기 위해 말이 안 되는 상황을 만들지 마세요.

⚠️ [공통] 중요 규칙 & 자연스러움:
1. **상황 적합성 우선**: 제공된 어휘가 어색하면 과감히 버리고 문법적으로 올바른 다른 단어를 쓰세요.
2. **'ㄹ' 불규칙 활용 주의**: '놀다' -> '놀 거예요'(O), '놀을 거예요'(X).
3. **[필수] 답변(Answer)에는 문법 주제가 반드시 포함되어야 합니다.**
4. **제공된 '사용자 어휘' 최우선 사용**: 단, 문맥상 꼭 필요하면 **쉬운 기초 단어(숙제, 친구, 밥 등)**는 추가 허용합니다. (어려운 단어 금지)
5. **'함께(With)' 조사 다양화**: '와/과' 뿐만 아니라 '**-(이)랑**', '**-하고**'도 자연스럽게 섞어 쓰세요.
6. **동문서답 금지**: 질문에 맞는 정확한 대답을 하세요. (언제 -> 시간, 어디서 -> 장소)

⚠️ 말투 및 호칭 규칙 (존댓말 필수):
1. 모든 문장은 '존댓말(Polite/Formal style)'을 사용하세요. (아요/어요)
2. '반말', '당신', '너', '니?' 등은 절대 사용 금지입니다.

[출력 형식 JSON]
{
  "question": "질문 텍스트",
  "questionTranslation": "질문 영문 번역",
  "answer": "답변 텍스트",
  "answerTranslation": "답변 영문 번역",
  "items": [{"id":"1","content":"...","combineWithNext":true}, ...]
}

⚠️ Spacing(띄어쓰기) 및 Items 규칙:
1. 답변을 단어 단위로 분리하여 items 배열에 넣으세요.
2. combineWithNext 규칙:
   - 조사/어미/구두점 등 '앞 단어와 붙여 써야 하는 경우': 앞 단어의 combineWithNext=true
   - 띄어쓰기 해야 하는 경우: combineWithNext=false
   - 예: "학교에 가요." -> 
     [{"content":"학교","combineWithNext":true}, {"content":"에","combineWithNext":false}, {"content":"가요","combineWithNext":true}, {"content":".","combineWithNext":false}]
3. 문장 끝에는 반드시 마침표(.)나 물음표(?)가 포함되어야 하며, 별도의 item으로 분리하세요.`;

     return this.callAIAndParse(prompt, grammarName);
  }

  // ===========================================================================
  // Helpers
  // ===========================================================================
  
  private async callAIAndParse(prompt: string, grammarName: string): Promise<DialogueQuestion> {
     try {
         const response = await chatCompletionJSON<any>(
          [{ role: 'user', content: prompt }],
          { temperature: 0.7, maxTokens: 1000 }
        );
        
        // 🆕 [Fix] AI가 공백 아이템({"content": " "})을 생성하여 구조 불일치 오류가 발생하는 문제 해결
        if (response.items && Array.isArray(response.items)) {
            response.items = response.items.filter((item: any) => item.content && item.content.trim().length > 0);
        }

        // items 처리
        let finalItems = this.correctItemSpacing(response.items || []);
        let finalAnswer = response.answer;

        // 🆕 [Smart Alignment] 1차 시도: Answer 텍스트를 기준으로 Items 띄어쓰기 동기화
        // "운동할 거예요"(O) vs "운동 할 거예요"(X) 문제를 해결하기 위함
        const alignedItems = this.alignItemsWithAnswer(finalItems, finalAnswer);
        
        if (alignedItems) {
            // 성공! Answer와 Items Content가 일치함. 띄어쓰기를 Answer에 맞춤.
            finalItems = alignedItems;
        } else {
            // 2차 시도 [Fallback]: 내용이 불일치(Hallucination)하는 경우
            // Items를 진실(Source of Truth)로 간주하고 Answer를 강제 재조립
            console.warn(`[Smart Alignment Failed] Content mismatch. Fallback to auto-repair answer.`);
            const reconstructedAnswer = this.reconstructStringFromItems(finalItems);
            if (reconstructedAnswer.replace(/\s+/g, '').trim() !== finalAnswer.replace(/\s+/g, '').trim()) {
                 console.warn(`[Auto-Repair] Answer mismatch repaired.\nOrigin: ${finalAnswer}\nNew: ${reconstructedAnswer}`);
            }
            finalAnswer = reconstructedAnswer;
        }

        const question: DialogueQuestion = {
          id: Date.now() + Math.floor(Math.random() * 10000),
          question: response.question,
          questionTranslation: response.questionTranslation,
          answer: finalAnswer,
          answerTranslation: response.answerTranslation,
          items: finalItems,
          grammarName: grammarName,
        };

        if (!this.validateQuestion(question)) {
            console.error('유효하지 않은 문제 구조 (Auto-repair failed):', JSON.stringify(question, null, 2));
            throw new Error('Invalid question generated (Critical failure)');
        }
        return question;
     } catch (e) {
         console.error('AI 호출/파싱 실패:', e);
         throw e;
     }
  }
  
  private calculateGrammarWeights(topics: TopicId[]): number[] {
    if (topics.length === 0) return [];
    if (topics.length === 1) return [1.0];

    const weights: number[] = [];
    let currentWeight = 0.5;
    let totalWeight = 0;

    for (let i = 0; i < topics.length; i++) {
        weights[i] = currentWeight;
        totalWeight += currentWeight;
        currentWeight = currentWeight * 0.5;
    }

    return weights.map((w) => w / totalWeight);
  }
  
  private selectGrammarByWeight(topics: TopicId[], weights: number[]): TopicId {
    const random = Math.random();
    let cumulative = 0;

    for (let i = 0; i < topics.length; i++) {
        cumulative += weights[i];
        if (random <= cumulative) {
            return topics[i];
        }
    }
    return topics[topics.length - 1];
  }
  
  private validateQuestion(question: Partial<DialogueQuestion>): boolean {
    if (!question.question || !question.answer || !question.items) return false;
    if (question.items.length === 0) return false;
    for (const item of question.items) {
        if (!item.id || !item.content || typeof item.combineWithNext !== 'boolean') return false;
    }
    return this.verifyItemsReconstruction(question.items, question.answer);
  }
  
  private correctItemSpacing(items: Item[]): Item[] {
    if (items.length === 0) return items;
    const corrected = [...items];

    // 한국어 조사 및 어미 목록 (확장됨 - shared file 사용)
    // const particles = ... (removed)
    
    
    const endingPatterns = [
      /^(어요|아요|여요)$/, /^(었어요|았어요|였어요)$/, /^(이에요|예요)$/,
      /^(습니다|ㅂ니다)$/, /^(었습니다|았습니다)$/, /^(어|아|여)$/,
      /^(고|지만|는데|므로)$/, /^(으)?러$/, /^(으)?려고$/, /^(으)?면$/, /^(으)?면서$/,
      /^(아|어|여)서$/, /^(아|어|여)야$/, /^다가$/, /^도록$/, /^자마자$/, /^느라고$/, /^더니$/,
      /^거나$/, /^게$/, /^지$/, /^기$/, /^음$/, /^ㅁ$/,
      /^게요$/, /^지요$/, /^죠$/,
      /^네요$/, /^군요$/, /^구나$/, /^잖아요$/,
      /^(을|ㄹ)까요$/, /^(을|ㄹ)래요$/, /^거든요$/,
      /^대요$/, /^래요$/, /^재요$/, /^냬요$/,
      /^던데$/, /^나요$/, /^(으)?ㄴ가요$/
    ];
    
    const punctuation = ['.', '!', '?', ',', '~'];

    for (let i = 0; i < corrected.length - 1; i++) {
      const current = corrected[i];
      const next = corrected[i + 1];

      // 1. 다음 단어가 조사인 경우
      if (PARTICLES.includes(next.content)) {
         // [Smart Logic] '가/와'의 동사/조사 구분
         if (['가', '와'].includes(next.content)) {
            // (a) 앞 단어가 방향 조사면 동사 (에 가)
            const directionParticles = ['에', '에서', '로', '으로', '한테', '에게', '께', '부터', '까지'];
            if (directionParticles.includes(current.content)) {
                current.combineWithNext = false; continue;
            }
            // (b) 받침 있으면 동사 (집 가 - '집이 가'가 맞으므로)
            const lastChar = current.content.charAt(current.content.length - 1);
            if (lastChar >= '가' && (lastChar.charCodeAt(0) - 44032) % 28 !== 0) {
                 current.combineWithNext = false; continue;  
            }
            // (c) 다음이 어미면 동사
            const afterNext = corrected[i+2];
            if (!afterNext || endingPatterns.some(p => p.test(afterNext.content)) || punctuation.includes(afterNext.content)) {
                if(!afterNext || endingPatterns.some(p => p.test(afterNext.content))) {
                    current.combineWithNext = false; continue;
                }
            }
            current.combineWithNext = true; continue;
         }
         current.combineWithNext = true; continue;
      }
      
      // 2. 다음 단어가 어미인 경우
      const isEnding = endingPatterns.some(p => p.test(next.content));
      if (isEnding) {
          if (next.content === '고') {
              const afterNext = corrected[i+2];
              if (afterNext && /^(싶|있|없|계|말)/.test(afterNext.content)) {
                  current.combineWithNext = true; continue;
              }
          }
          current.combineWithNext = true; continue;
      }
      
      // 3. 현재 단어가 어미이고 다음이 보조용언인 경우 (띄어쓰기)
      const isCurrentEnding = endingPatterns.some(p => p.test(current.content));
      if (isCurrentEnding && /^(싶|있|없|계|말)/.test(next.content)) {
          current.combineWithNext = false; continue;
      }

      // 4. 다음이 구두점인 경우
      if (punctuation.includes(next.content)) {
          current.combineWithNext = true; continue;
      }

      current.combineWithNext = false;
    }
    
    if (corrected.length > 0) corrected[corrected.length - 1].combineWithNext = false;
    return corrected;
  }
  
  // 🆕 [Smart Alignment] Answer의 띄어쓰기를 기준으로 Items의 combineFlag를 동기화
  // 성공 시 정렬된 items 반환, 실패(내용 불일치) 시 null 반환
  private alignItemsWithAnswer(items: Item[], answer: string): Item[] | null {
    // 1. 내용 일치 여부 확인 (공백 제거 후 비교)
    const itemsContent = items.map(i => i.content).join('');
    const answerContent = answer.replace(/\s+/g, '');
    
    if (itemsContent !== answerContent) {
        return null; // 내용이 다르면 정렬 불가능 -> Fallback으로 이동
    }

    const alignedItems = JSON.parse(JSON.stringify(items));
    let currentPos = 0; // answer 문자열 내의 현재 커서 위치

    for (let i = 0; i < alignedItems.length; i++) {
        const item = alignedItems[i];
        const contentLen = item.content.length;
        
        // answer 문자열에서 현재 아이템 텍스트 매칭 확인 (건너뛰기: 이미 check 했으므로 스킵)
        // 현재 item 끝난 직후 answer의 문자가 공백인지 확인
        
        // 주의: answer에는 공백이 섞여 있음. item.content에는 공백이 없다고 가정.
        // 따라서 answer를 순회하며 item characters를 매칭해야 정확함.
        
        // 더 간단한 로직:
        // answer 문자열을 파싱하면서 item 경계를 찾음.
        
        // 복잡하므로 간단히 구현:
        // answer에서 공백을 제외한 글자 인덱스를 실제 인덱스로 매핑하는 맵을 만드는 것이 확실함.
        // 하지만 여기서는 간단히 answer를 scan 합니다.
    }
    
    // 다시 구현: Scan 방식
    let searchIdx = 0;
    const newItems = items.map(vocab => ({ ...vocab })); // deep copy
    
    for (let i = 0; i < newItems.length; i++) {
       const item = newItems[i];
       // answer에서 item.content가 등장하는 위치 찾기 (searchIdx부터)
       // 단, 중간에 공백이 있을 수... 아니, item.content 안에는 공백이 없어야 함.
       
       // item.content의 글자 하나하나가 answer의 어디에 매칭되는지 확인
       for (const char of item.content) {
           const found = answer.indexOf(char, searchIdx);
           if (found === -1) return null; // Should not happen due to pre-check
           searchIdx = found + 1;
       }
       
       // item의 마지막 글자 매칭 후, answer의 바로 다음 글자 확인
       if (i < newItems.length - 1) {
           // 다음 글자가 존재하고, 공백이 아니면 combine=true
           // 다음 글자가 공백이면 combine=false, 그리고 searchIdx를 공백 다음으로 넘김
           if (searchIdx < answer.length && answer[searchIdx] === ' ') {
               item.combineWithNext = false;
               // 공백 스킵 (다수 공백 가능성)
               while(searchIdx < answer.length && answer[searchIdx] === ' ') {
                   searchIdx++;
               }
           } else {
               item.combineWithNext = true;
           }
       } else {
           item.combineWithNext = false; // 마지막 아이템
       }
    }
    
    return newItems;
  }
  
  private verifyItemsReconstruction(items: Item[], answer: string): boolean {
    const reconstructed = this.reconstructStringFromItems(items);
    return reconstructed.replace(/\s+/g, ' ').trim() === answer.replace(/\s+/g, ' ').trim();
  }

  private reconstructStringFromItems(items: Item[]): string {
    if (items.length === 0) return '';
    let reconstructed = '';
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        reconstructed += item.content;
        if (i < items.length - 1 && !item.combineWithNext) reconstructed += ' ';
    }
    return reconstructed;
  }
  
  private validateGrammarOnly(question: DialogueQuestion, allowedGrammarTopics: TopicId[]): boolean {
    const grammarDependencies: Record<string, string[]> = {
      ability: ['existence', 'past-tense', 'future', 'negative-sentences'],
      progressive: ['existence', 'past-tense', 'future', 'negative-sentences'],
      future: ['negative-sentences'],
      experience: ['existence', 'past-tense', 'negative-sentences'],
      desires: ['past-tense', 'future', 'negative-sentences'],
      obligation: ['past-tense', 'future', 'negative-sentences'],
      trying: ['past-tense', 'future', 'negative-sentences'],
      reasons: ['past-tense', 'future', 'negative-sentences'],
      contrast: ['past-tense', 'future', 'negative-sentences'],
      cause: ['past-tense', 'future', 'negative-sentences'],
      purpose: ['past-tense', 'future', 'negative-sentences'],
      comparison: ['past-tense', 'future', 'negative-sentences'],
      conditions: ['past-tense', 'future', 'negative-sentences'],
      intention: ['negative-sentences'],
      possibility: ['past-tense', 'future', 'negative-sentences'],
      passive: ['past-tense', 'future', 'negative-sentences'],
    };

    const expandedAllowedTopics = new Set(allowedGrammarTopics);
    allowedGrammarTopics.forEach((topic) => {
      const deps = grammarDependencies[topic] || [];
      deps.forEach((dep) => expandedAllowedTopics.add(dep as TopicId));
    });

    const grammarPatternChecks: Record<string, RegExp> = {
      existence: /있어요|없어요/,
      'negative-sentences': /안 /,
      negation: /이\/가 아니에요/,
      'past-tense': /았어요|었어요/,
      future: /을 거예요|ㄹ 거예요|겠/,
      progressive: /고 있/,
      cause: /니까|아서|어서/,
      conjunction: /고\s+(?!(싶|있|없|계|말))/,
      desires: /고 싶/,
      ability: /을 수 있|ㄹ 수 있/,
      experience: /은 적|ㄴ 적/,
      obligation: /어야|아야|해야/,
      trying: /어 보|아 보/,
      comparison: /보다/,
      conditions: /(으)면(\s|[.,!?]|$)/,
      intention: /을게요|ㄹ게요/,
      possibility: /을지도|ㄹ지도/,
      passive: /어지|아지/,
    };

    for (const [topic, pattern] of Object.entries(grammarPatternChecks)) {
      if (!expandedAllowedTopics.has(topic as TopicId)) {
        if (pattern.test(question.answer) || pattern.test(question.question)) {
          console.warn(`금지된 문법 감지 (${topic}): ${pattern}`);
          return false;
        }
      }
    }
    return true;
  }

  private reuseTemplateExample(topic: TopicId): QuestionGenerationResult {
     const definition = grammarPatterns.find((g) => g.topicId === topic);
     if (!definition || !definition.patterns.length) {
         return { success: false, question: null, error: '템플릿 없음' };
     }
     // 랜덤 선택
     const pattern = definition.patterns[Math.floor(Math.random() * definition.patterns.length)];
     if(!pattern.examples.length) return { success: false, question: null, error: '템플릿 예시 없음' };
     
     const ex = pattern.examples[Math.floor(Math.random() * pattern.examples.length)];
     return {
        success: true,
        method: 'template',
        question: {
            id: Date.now() + Math.random(),
            grammarName: definition.grammarName,
            question: ex.question,
            questionTranslation: ex.questionTranslation,
            answer: ex.answer,
            answerTranslation: ex.answerTranslation,
            items: this.convertAnswerToItems(ex.answer)
        }
     };
  }

  private convertAnswerToItems(answer: string): Item[] {
      return this.correctItemSpacing(answer.split(' ').map((w, i, arr) => ({
          id: `${Date.now()}-${i}`,
          content: w,
          combineWithNext: i < arr.length - 1
      })));
  }
}
