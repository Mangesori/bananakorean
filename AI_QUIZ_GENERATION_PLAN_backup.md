# AI 퀴즈 생성 시스템 - 최종 구현 플랜

## 목표
세 번째 단계(퀴즈 설정)에서 "AI 생성하기" 클릭 시, 네 번째 단계(미리보기)에서 **두 가지 방식으로 동시에** 문제 생성:
- **하이브리드 방식**: 템플릿 패턴 우선 사용 → 실패 시 처음부터 생성
- **처음부터 생성 방식**: 템플릿 없이 완전히 새로 생성

UI에서 **왼쪽/오른쪽으로 나란히 비교**하여, 사용자가 더 나은 방식을 선택해 퀴즈 시작

---

## 핵심 설계 결정

### ✅ 포함
- 항상 양쪽 방식 모두 생성 (비교 강제)
- AI가 어휘 적합성을 문맥적으로 판단 (별도 분석 단계 제외)
- 패턴 선택은 예제 매칭 기반
- OpenAI 직접 사용 (추상화 레이어 제외)
- **문법 가중치**: 가장 어려운 문법 50%, 지수 감소 방식 (0.5, 0.25, 0.125, ...)
- **문법 격리**: 선택하지 않은 문법이 문제에 포함되지 않도록 검증

### ❌ 제외
- `vocabulary-analyzer.ts`: 어휘 품사 별도 분석 (생성 시점에 통합)
- `mapper.ts`: 어휘-문법 호환성 체크 (AI 판단에 맡김)
- `AIProvider` 추상화: 현재는 OpenAI만 사용 (필요시 나중에 추가)

---

## 파일 구조

```
src/
├── app/api/ai/
│   └── generate-quiz/
│       └── route.ts              # API 엔드포인트 (POST)
├── lib/ai/
│   ├── client.ts                 # OpenAI 클라이언트 (기존)
│   ├── patterns.ts               # 문법 패턴 정의 (기존, 2400줄)
│   └── quiz-generator.ts         # 퀴즈 생성 로직 (NEW)
├── types/
│   └── custom-quiz.ts            # 타입 정의 확장
├── app/quiz/custom/
│   └── page.tsx                  # 메인 페이지 수정
└── components/quiz/custom/
    └── PreviewPanel.tsx          # 미리보기 패널 수정
```

---

## 1. 타입 정의 확장

**파일**: `src/types/custom-quiz.ts`

```typescript
// 생성 모드 타입
export type QuizGenerationMode = 'hybrid' | 'from-scratch';

// 개별 문제 생성 결과
export interface QuestionGenerationResult {
  question: DialogueQuestion | null;
  success: boolean;
  error?: string;
  method?: 'template' | 'from-scratch'; // 추적용
}

// API 요청
export interface QuizGenerationRequest {
  vocabulary: string[];
  grammarTopics: TopicId[];
  count: number;
  mode?: 'hybrid' | 'from-scratch' | 'both'; // 'both'는 두 방식 모두
}

// 단일 방식 응답
export interface QuizGenerationResponse {
  success: boolean;
  questions: DialogueQuestion[];
  metadata: {
    totalRequested: number;
    totalGenerated: number;
    failedCount: number;
    templateUsed: number;      // 템플릿으로 생성된 수
    fromScratchUsed: number;   // 처음부터 생성된 수
  };
  error?: string;
}

// 비교 결과 (양쪽 모두)
export interface ComparisonResult {
  hybrid: QuizGenerationResponse;
  fromScratch: QuizGenerationResponse;
}
```

---

## 2. 퀴즈 생성기 (Core Logic)

**파일**: `src/lib/ai/quiz-generator.ts` (NEW)

### 클래스 구조

```typescript
export class QuizGenerator {

  /**
   * 메인 진입점: 요청에 따라 문제 생성
   */
  async generateQuestions(
    request: QuizGenerationRequest
  ): Promise<QuizGenerationResponse>

  /**
   * 하이브리드 방식: 단일 문제 생성
   * 템플릿 시도 → 실패 시 처음부터 생성
   */
  private async generateHybridQuestion(
    vocabulary: string[],
    grammarTopic: TopicId,
    questionIndex: number
  ): Promise<QuestionGenerationResult>

  /**
   * 처음부터 생성: 단일 문제 생성
   * 템플릿 없이 AI가 완전히 새로 생성
   */
  private async generateFromScratchQuestion(
    vocabulary: string[],
    grammarTopic: TopicId,
    questionIndex: number
  ): Promise<QuestionGenerationResult>

  /**
   * 패턴 선택: 어휘와 가장 잘 맞는 패턴 찾기
   * 예제에 어휘가 포함된 패턴 우선, 없으면 랜덤
   */
  private selectBestPattern(
    vocabulary: string[],
    grammarTopic: TopicId
  ): DialoguePattern | null

  /**
   * 템플릿 기반 생성: 패턴 + 어휘로 문제 생성
   */
  private async generateFromTemplate(
    vocabulary: string[],
    pattern: DialoguePattern,
    grammarTopic: TopicId,
    grammarName: string
  ): Promise<DialogueQuestion>

  /**
   * 처음부터 생성: 패턴 없이 문제 생성
   */
  private async generateCompletely(
    vocabulary: string[],
    grammarTopic: TopicId,
    grammarName: string,
    existingExamples: DialogueQuestion[]
  ): Promise<DialogueQuestion>

  /**
   * 검증: 생성된 문제 구조 확인
   */
  private validateQuestion(
    question: Partial<DialogueQuestion>
  ): boolean

  /**
   * 자동 수정: items[]의 spacing 규칙 수정
   */
  private correctItemSpacing(items: Item[]): Item[]

  /**
   * 검증: items를 합쳤을 때 answer와 일치하는지 확인
   */
  private verifyItemsReconstruction(
    items: Item[],
    answer: string
  ): boolean
}
```

### 생성 흐름

#### 하이브리드 방식
```
generateHybridQuestion()
  ↓
1. 선택된 문법 주제로 패턴 찾기
  ↓
2. selectBestPattern() 호출
   - 어휘가 예제에 포함된 패턴 우선
   - 없으면 랜덤 선택
  ↓
3-A. 패턴 있음?
   ↓ YES
   generateFromTemplate() 시도
     - 패턴 템플릿 + 예제 + 어휘를 프롬프트에 포함
     - OpenAI 호출 (chatCompletionJSON)
     - 응답 검증
     ↓
   성공? → return (method: 'template')
   실패? → 3-B로 fallback
  ↓
3-B. 패턴 없음 또는 템플릿 실패
   ↓
   generateCompletely() 호출
     - 문법 설명 + 기존 예제 + 어휘를 프롬프트에 포함
     - OpenAI 호출
     - 응답 검증
     ↓
   성공? → return (method: 'from-scratch')
   실패? → return error
```

#### 처음부터 생성 방식
```
generateFromScratchQuestion()
  ↓
1. 선택된 문법 주제의 예제 3-5개 가져오기
  ↓
2. generateCompletely() 호출
   - 문법 설명 + 예제 + 어휘를 프롬프트에 포함
   - 템플릿 패턴은 참고하지 않음
   - OpenAI 호출
   ↓
3. 응답 검증 및 items[] 자동 수정
  ↓
성공? → return (method: 'from-scratch')
실패? → return error
```

### 패턴 선택 로직

```typescript
private selectBestPattern(
  vocabulary: string[],
  grammarTopic: TopicId
): DialoguePattern | null {
  const definition = grammarPatterns.find(g => g.topicId === grammarTopic);
  if (!definition || !definition.patterns.length) {
    return null; // 패턴 없음 → from-scratch로 fallback
  }

  // 각 패턴에 점수 매기기
  const scored = definition.patterns.map(pattern => {
    let score = 0;

    // 어휘가 패턴 예제에 포함되어 있으면 높은 점수
    for (const vocab of vocabulary) {
      for (const example of pattern.examples) {
        if (example.vocabulary === vocab ||
            example.answer.includes(vocab)) {
          score += 10;
        }
      }
    }

    // 매칭 없으면 기본 점수
    if (score === 0) score = 1;

    return { pattern, score };
  });

  // 점수 높은 순으로 정렬
  scored.sort((a, b) => b.score - a.score);

  // 상위 3개 중 랜덤 선택 (다양성 확보)
  const topPatterns = scored.slice(0, 3);
  const randomIndex = Math.floor(Math.random() * topPatterns.length);

  return topPatterns[randomIndex].pattern;
}
```

### Items[] 생성 및 검증

#### Spacing 규칙

```typescript
/**
 * combineWithNext 규칙:
 * - true: 다음 item과 붙여쓰기 (공백 없음)
 * - false: 다음 item과 띄어쓰기 (공백 추가)
 *
 * 예시: "저는 학생이에요."
 * [
 *   { id: "1", content: "저", combineWithNext: true },    // 저 + 는
 *   { id: "2", content: "는", combineWithNext: false },   // 는 + " "
 *   { id: "3", content: "학생", combineWithNext: true },  // 학생 + 이에요.
 *   { id: "4", content: "이에요.", combineWithNext: false }
 * ]
 *
 * 재구성: "저" + "는" + " " + "학생" + "이에요." = "저는 학생이에요."
 */
```

#### 자동 수정 함수

```typescript
private correctItemSpacing(items: Item[]): Item[] {
  const corrected = [...items];

  for (let i = 0; i < corrected.length - 1; i++) {
    const current = corrected[i];
    const next = corrected[i + 1];

    // 규칙 1: 조사는 앞 단어에 붙음
    const particles = [
      '는', '은', '가', '이', '를', '을', '에', '에서',
      '로', '으로', '까지', '부터', '도', '만', '와', '과'
    ];
    if (particles.includes(next.content)) {
      current.combineWithNext = true;
    }

    // 규칙 2: 어미는 동사/형용사에 붙음
    const endingPattern = /^(어요|아요|여요|었어요|았어요|이에요|예요|지만|는데|으면|면|ㄴ다|습니다)\.?$/;
    if (endingPattern.test(next.content)) {
      current.combineWithNext = true;
    }

    // 규칙 3: 구두점은 앞 단어에 붙음
    if (/^[.,!?]$/.test(next.content)) {
      current.combineWithNext = true;
    }
  }

  // 마지막 item은 항상 false
  if (corrected.length > 0) {
    corrected[corrected.length - 1].combineWithNext = false;
  }

  return corrected;
}
```

#### 재구성 검증

```typescript
private verifyItemsReconstruction(
  items: Item[],
  answer: string
): boolean {
  let reconstructed = '';

  for (let i = 0; i < items.length; i++) {
    reconstructed += items[i].content;

    // combineWithNext가 false이고 마지막 아이템이 아니면 공백 추가
    if (i < items.length - 1 && !items[i].combineWithNext) {
      reconstructed += ' ';
    }
  }

  // 공백 정규화 후 비교
  const normalize = (str: string) => str.replace(/\s+/g, ' ').trim();

  return normalize(reconstructed) === normalize(answer);
}
```

---

## 3. 프롬프트 설계

### 템플릿 기반 프롬프트

```typescript
const templatePrompt = `당신은 한국어 퀴즈 생성기입니다. 주어진 패턴을 따라 대화형 드래그앤드롭 문제를 생성하세요.

문법 주제: ${grammarName}
패턴 유형: ${pattern.type}

패턴 템플릿:
질문: ${pattern.questionTemplate}
답변: ${pattern.answerTemplate}

패턴 예제:
${pattern.examples.map((ex, i) => `
예제 ${i + 1} (어휘: ${ex.vocabulary}):
Q: ${ex.question}
Q (영문): ${ex.questionTranslation}
A: ${ex.answer}
A (영문): ${ex.answerTranslation}
`).join('\n')}

사용자 어휘: ${vocabulary.join(', ')}

작업: 위 예제와 유사한 새로운 문제를 생성하되, 사용자 어휘 중 최소 1개를 자연스럽게 포함하세요.

요구사항:
1. 질문과 답변은 자연스럽고 대화적인 한국어여야 함
2. 사용자 어휘를 최소 1개 이상 사용
3. 정확한 영문 번역 제공
4. 답변을 드래그 가능한 items[]로 분해 (spacing 규칙 준수)

Spacing 규칙:
- 조사 (는/을/에/에서 등): 앞 단어의 combineWithNext=true, 조사는 false
- 어미 (어요/았어요/이에요 등): 어간의 combineWithNext=true, 어미는 false
- 구두점: 앞 단어의 combineWithNext=true, 구두점은 false
- 일반 단어: combineWithNext=false

예시:
답변: "저는 학생이에요."
Items: [
  {"id": "1", "content": "저", "combineWithNext": true},
  {"id": "2", "content": "는", "combineWithNext": false},
  {"id": "3", "content": "학생", "combineWithNext": true},
  {"id": "4", "content": "이에요.", "combineWithNext": false}
]

중요: 패턴 스타일을 밀접하게 따르세요. 너무 창의적이지 말고 예제와 유사하게 유지하세요.

응답 형식 (JSON):
{
  "question": "질문 텍스트",
  "questionTranslation": "질문 영문 번역",
  "answer": "답변 텍스트",
  "answerTranslation": "답변 영문 번역",
  "items": [
    {"id": "1", "content": "...", "combineWithNext": true/false},
    ...
  ],
  "vocabularyUsed": ["사용된어휘1", "사용된어휘2"]
}`;
```

### 처음부터 생성 프롬프트

```typescript
const fromScratchPrompt = `당신은 한국어 퀴즈 생성기입니다. 문법 연습을 위한 독창적인 대화형 드래그앤드롭 문제를 생성하세요.

문법 주제: ${grammarName}
문법 설명: ${grammarDescription}

참고 예제 (스타일과 형식 참고용, 복사하지 말 것):
${existingExamples.slice(0, 5).map((ex, i) => `
예제 ${i + 1}:
Q: ${ex.question}
Q (영문): ${ex.questionTranslation}
A: ${ex.answer}
A (영문): ${ex.answerTranslation}
Items: ${ex.items.length}개 조각
`).join('\n')}

사용자 어휘: ${vocabulary.join(', ')}

작업: 이 문법 주제를 연습하는 완전히 새로운 문제를 생성하세요.

요구사항:
1. 자연스럽고 현실적인 한국어 대화 (교과서적이지 않게)
2. 사용자 어휘 중 최소 1개를 자연스럽게 포함
3. 이 문법 수준에 적합한 난이도
4. 정확하고 자연스러운 영문 번역 제공
5. 답변을 드래그 가능한 items[]로 분해 (spacing 규칙 준수)

Spacing 규칙:
- 조사 (는/은/가/이/를/을/에/에서/로/으로/까지/부터/도/만):
  * 앞 단어의 combineWithNext=true
  * 조사 자체는 combineWithNext=false

- 동사/형용사 어미 (어요/아요/였어요/았어요/이에요/예요/지만/는데/으면/면):
  * 어간/앞 단어의 combineWithNext=true
  * 어미 자체는 combineWithNext=false

- 구두점 (. ! ?):
  * 앞 단어의 combineWithNext=true
  * 구두점은 combineWithNext=false

- 일반 독립 단어:
  * combineWithNext=false (조사/어미가 따라오지 않는 한)

6. Items를 합쳤을 때 정확히 답변과 일치해야 함 (combineWithNext=false인 곳에 공백)
7. 각 item은 고유한 순차적 id를 문자열로 가져야 함 ("1", "2", "3"...)
8. Items는 적절한 크기로 유지 (너무 많은 작은 조각 금지)

올바른 Items 예시:
답변: "저는 학생이에요."
Items: [
  {"id": "1", "content": "저", "combineWithNext": true},    // 저 + 는
  {"id": "2", "content": "는", "combineWithNext": false},   // 띄어쓰기
  {"id": "3", "content": "학생", "combineWithNext": true},  // 학생 + 이에요
  {"id": "4", "content": "이에요.", "combineWithNext": false}  // 끝
]
재구성: "저" + "는" + " " + "학생" + "이에요." = "저는 학생이에요." ✓

응답 형식 (JSON):
{
  "question": "질문 텍스트",
  "questionTranslation": "영문 번역",
  "answer": "답변 텍스트",
  "answerTranslation": "영문 번역",
  "items": [
    {"id": "1", "content": "...", "combineWithNext": true/false},
    ...
  ],
  "vocabularyUsed": ["단어1", "단어2"]
}`;
```

---

## 4. API Route

**파일**: `src/app/api/ai/generate-quiz/route.ts` (NEW)

```typescript
import { NextResponse } from 'next/server';
import { QuizGenerator } from '@/lib/ai/quiz-generator';
import { QuizGenerationRequest, ComparisonResult } from '@/types/custom-quiz';

export async function POST(request: Request) {
  try {
    const body: QuizGenerationRequest = await request.json();
    const { vocabulary, grammarTopics, count, mode = 'both' } = body;

    // 입력 검증
    if (!vocabulary?.length || !grammarTopics?.length || !count) {
      return NextResponse.json(
        {
          success: false,
          error: 'vocabulary, grammarTopics, count는 필수입니다'
        },
        { status: 400 }
      );
    }

    if (count < 1 || count > 20) {
      return NextResponse.json(
        { success: false, error: 'count는 1~20 사이여야 합니다' },
        { status: 400 }
      );
    }

    const generator = new QuizGenerator();

    // 기본: 두 방식 모두 생성
    if (mode === 'both') {
      // 병렬 처리
      const [hybrid, fromScratch] = await Promise.all([
        generator.generateQuestions({
          vocabulary,
          grammarTopics,
          count,
          mode: 'hybrid'
        }),
        generator.generateQuestions({
          vocabulary,
          grammarTopics,
          count,
          mode: 'from-scratch'
        })
      ]);

      const comparison: ComparisonResult = { hybrid, fromScratch };

      return NextResponse.json({
        success: true,
        comparison
      });
    } else {
      // 단일 모드 (개발/테스트용)
      const result = await generator.generateQuestions({
        vocabulary,
        grammarTopics,
        count,
        mode
      });

      return NextResponse.json(result);
    }
  } catch (error) {
    console.error('퀴즈 생성 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '생성 실패: ' + (error instanceof Error ? error.message : '알 수 없는 오류'),
        questions: [],
        metadata: {
          totalRequested: 0,
          totalGenerated: 0,
          failedCount: 0,
          templateUsed: 0,
          fromScratchUsed: 0
        }
      },
      { status: 500 }
    );
  }
}
```

---

## 5. 프론트엔드 수정

### 5.1 메인 페이지

**파일**: `src/app/quiz/custom/page.tsx`

#### 변경사항

```typescript
// 기존
const [generatedQuestions, setGeneratedQuestions] = useState<DialogueQuestion[]>([]);

// 변경
const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
```

#### handleGenerate 수정

```typescript
const handleGenerate = async () => {
  setIsGenerating(true);
  setError(null);

  try {
    const response = await fetch('/api/ai/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vocabulary: state.vocabulary,
        grammarTopics: state.selectedGrammar,
        count: state.quizCount,
        mode: 'both' // 항상 두 방식 모두
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '생성 실패');
    }

    if (data.success && data.comparison) {
      setComparisonResult(data.comparison);
      setCurrentStep(4); // 미리보기로 이동
    } else {
      throw new Error('생성 결과가 없습니다');
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : '알 수 없는 오류');
  } finally {
    setIsGenerating(false);
  }
};
```

#### handleComplete 수정

```typescript
const handleComplete = (selectedMode: QuizGenerationMode) => {
  if (!comparisonResult) return;

  // 선택된 방식의 문제만 저장
  const selectedQuestions = selectedMode === 'hybrid'
    ? comparisonResult.hybrid.questions
    : comparisonResult.fromScratch.questions;

  // sessionStorage에 저장
  sessionStorage.setItem('customQuizQuestions', JSON.stringify(selectedQuestions));

  // 퀴즈 플레이 페이지로 이동
  window.location.href = '/quiz/custom/play';
};
```

### 5.2 미리보기 패널

**파일**: `src/components/quiz/custom/PreviewPanel.tsx`

#### Props 변경

```typescript
interface PreviewPanelProps {
  comparisonResult: ComparisonResult | null;
  onRegenerateSingle: (index: number, mode: QuizGenerationMode) => Promise<void>;
  onRegenerateAll: () => Promise<void>;
  onPrev: () => void;
  onComplete: (selectedMode: QuizGenerationMode) => void;
  isRegenerating?: boolean;
  regeneratingIndex?: number | null;
}
```

#### UI 구조

```typescript
export default function PreviewPanel({
  comparisonResult,
  onComplete,
  ...props
}: PreviewPanelProps) {
  const [selectedMode, setSelectedMode] = useState<QuizGenerationMode>('hybrid');
  const [expandedQuestions, setExpandedQuestions] = useState<{
    hybrid: Set<number>;
    fromScratch: Set<number>;
  }>({ hybrid: new Set(), fromScratch: new Set() });

  if (!comparisonResult) {
    return <div>데이터가 없습니다</div>;
  }

  const { hybrid, fromScratch } = comparisonResult;

  return (
    <div className="preview-panel">
      <h2>생성된 문제 비교</h2>

      <div className="comparison-grid">
        {/* 왼쪽: 하이브리드 방식 */}
        <div className="comparison-column">
          <div className="column-header">
            <input
              type="radio"
              name="mode"
              value="hybrid"
              checked={selectedMode === 'hybrid'}
              onChange={() => setSelectedMode('hybrid')}
            />
            <h3>하이브리드 방식</h3>
            <p className="subtitle">템플릿 우선 + 폴백</p>
          </div>

          <div className="metadata">
            <span>생성 성공: {hybrid.metadata.totalGenerated}/{hybrid.metadata.totalRequested}</span>
            <span>템플릿 사용: {hybrid.metadata.templateUsed}</span>
            <span>처음부터: {hybrid.metadata.fromScratchUsed}</span>
          </div>

          <div className="questions-list">
            {hybrid.questions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx}
                isExpanded={expandedQuestions.hybrid.has(idx)}
                onToggleExpand={() => toggleExpand('hybrid', idx)}
              />
            ))}
          </div>
        </div>

        {/* 오른쪽: 처음부터 생성 방식 */}
        <div className="comparison-column">
          <div className="column-header">
            <input
              type="radio"
              name="mode"
              value="from-scratch"
              checked={selectedMode === 'from-scratch'}
              onChange={() => setSelectedMode('from-scratch')}
            />
            <h3>처음부터 생성</h3>
            <p className="subtitle">템플릿 없이 완전히 새로 생성</p>
          </div>

          <div className="metadata">
            <span>생성 성공: {fromScratch.metadata.totalGenerated}/{fromScratch.metadata.totalRequested}</span>
            <span>모두 처음부터: {fromScratch.metadata.fromScratchUsed}</span>
          </div>

          <div className="questions-list">
            {fromScratch.questions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx}
                isExpanded={expandedQuestions.fromScratch.has(idx)}
                onToggleExpand={() => toggleExpand('fromScratch', idx)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="actions">
        <button onClick={props.onPrev}>이전</button>
        <button onClick={props.onRegenerateAll}>전체 재생성</button>
        <button
          onClick={() => onComplete(selectedMode)}
          disabled={!selectedMode}
          className="primary"
        >
          선택한 방식으로 퀴즈 시작
        </button>
      </div>
    </div>
  );
}
```

---

## 6. 에러 처리 전략

### 6.1 점진적 생성 + 재시도

```typescript
async generateQuestions(request: QuizGenerationRequest): Promise<QuizGenerationResponse> {
  const results: DialogueQuestion[] = [];
  const errors: string[] = [];
  let templateUsed = 0;
  let fromScratchUsed = 0;

  // Round-robin으로 문법 주제 순회
  let topicIndex = 0;

  for (let i = 0; i < request.count; i++) {
    const grammarTopic = request.grammarTopics[topicIndex % request.grammarTopics.length];
    topicIndex++;

    try {
      let result: QuestionGenerationResult;

      if (request.mode === 'from-scratch') {
        result = await this.generateFromScratchQuestion(
          request.vocabulary,
          grammarTopic,
          i
        );
      } else {
        result = await this.generateHybridQuestion(
          request.vocabulary,
          grammarTopic,
          i
        );
      }

      if (result.success && result.question) {
        results.push(result.question);
        if (result.method === 'template') templateUsed++;
        else fromScratchUsed++;
      } else {
        errors.push(`문제 ${i + 1}: ${result.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      errors.push(`문제 ${i + 1}: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }

    // Rate limiting: 요청 사이 대기
    if (i < request.count - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // 최소 50% 생성 성공해야 성공으로 간주
  const successThreshold = Math.ceil(request.count * 0.5);

  return {
    success: results.length >= successThreshold,
    questions: results,
    metadata: {
      totalRequested: request.count,
      totalGenerated: results.length,
      failedCount: errors.length,
      templateUsed,
      fromScratchUsed
    },
    error: errors.length > 0 ? `${errors.length}개 생성 실패` : undefined
  };
}
```

### 6.2 개별 재시도 로직

```typescript
private async generateWithRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 2
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('알 수 없는 오류');

      // 검증 오류는 재시도하지 않음 (API 오류만 재시도)
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }

      // Exponential backoff
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw lastError || new Error('최대 재시도 횟수 초과');
}
```

### 6.3 처리할 엣지 케이스

1. **입력 엣지 케이스**
   - 빈 어휘 → 일반적인 문제 생성
   - 단일 어휘 → 모든 패턴에 맞지 않을 수 있음 → from-scratch 사용
   - 매우 긴 구문 → 프롬프트에 그대로 포함
   - 한국어 아닌 입력 → 사용 시도 또는 검증 오류 반환
   - 중복 어휘 → 생성 전 중복 제거

2. **생성 엣지 케이스**
   - 모든 생성 실패 → 제안과 함께 오류 반환
   - 부분 성공 (<50%) → 사용자에게 경고, 재시도 제공
   - Rate limit 도달 → 나머지를 큐에 넣고 진행 상황 표시
   - 타임아웃 → 진행 상황 저장, 재개 허용
   - OpenAI에서 잘못된 JSON → 로그 후 재시도

3. **Items[] 엣지 케이스**
   - 특수 문자 → .,!?()「」 처리
   - 숫자 → 독립 item으로 처리
   - 한국어/영어 혼합 → 언어 경계에서 분할
   - 매우 긴 답변 → 20개 이상 items 경고
   - 재구성 실패 → 자동 수정 또는 거부

4. **UI 엣지 케이스**
   - 느린 생성 → 진행률 표시 (3/10...)
   - 모바일 뷰 → 비교를 세로로 스택
   - 네트워크 손실 → 상태 저장, 재개 허용
   - 여러 번 재생성 → 고유 ID 보장

---

## 7. 구현 순서

### Phase 1: 타입 및 패턴 선택 (1-2일)
**우선순위**: HIGH | **위험도**: HIGH

1. `src/types/custom-quiz.ts`에 새 타입 추가
2. `src/lib/ai/quiz-generator.ts` 스켈레톤 생성
3. `selectBestPattern` 로직 구현
4. 패턴 선택 단위 테스트 작성

**산출물**: 패턴 선택 로직 완성

### Phase 2: 템플릿 기반 생성 (3-4일)
**우선순위**: HIGH | **위험도**: MEDIUM

1. `generateFromTemplate` 메서드 구현
2. 템플릿 기반 프롬프트 작성
3. OpenAI 클라이언트 통합
4. items[] 검증 구현
5. 템플릿 생성 테스트 작성

**산출물**: 템플릿으로 문제 생성 가능

### Phase 3: Items[] 처리 (5일)
**우선순위**: HIGH | **위험도**: MEDIUM

1. `correctItemSpacing` 메서드 구현
2. `verifyItemsReconstruction` 메서드 구현
3. 다양한 한국어 문장 패턴 테스트
4. 포괄적 테스트 작성

**산출물**: Items[] spacing 일관되게 올바름

### Phase 4: 처음부터 생성 (6-7일)
**우선순위**: HIGH | **위험도**: MEDIUM

1. `generateFromScratchQuestion` 메서드 구현
2. 처음부터 생성 프롬프트 작성
3. 하이브리드 모드에 fallback 로직 추가
4. 통합 테스트 작성

**산출물**: 템플릿 없이 문제 생성 가능

### Phase 5: API Route (8일)
**우선순위**: HIGH | **위험도**: LOW

1. `/api/ai/generate-quiz/route.ts` 생성
2. 단일 모드 및 비교 모드 구현
3. 입력 검증 추가
4. 에러 처리 추가
5. API 테스트 작성

**산출물**: API가 유효한 응답 반환

### Phase 6: 프론트엔드 통합 (9-10일)
**우선순위**: MEDIUM | **위험도**: LOW

1. `page.tsx`를 새 API 호출하도록 업데이트
2. `PreviewPanel.tsx`를 비교 UI로 수정
3. 로딩 및 에러 상태 처리
4. 엔드투엔드 플로우 테스트

**산출물**: UI가 새 생성 시스템과 작동

### Phase 7: 마무리 및 테스트 (11-12일)
**우선순위**: LOW | **위험도**: LOW

1. 진행률 표시 추가
2. 에러 메시지 개선
3. 모든 문법 주제에 대한 수동 테스트
4. 엣지 케이스 테스트
5. 성능 최적화
6. 문서화

**산출물**: 프로덕션 준비 완료 시스템

---

## 8. 측정할 지표

### 품질 지표
- 성공률: 성공한 생성 %
- 템플릿 사용률: 템플릿 사용 %
- 검증 실패율: 수정 필요 %
- 사용자 만족도: 재생성 비율

### 성능 지표
- 문제당 평균 생성 시간
- 세션당 API 호출 수
- 퀴즈당 비용 (OpenAI 토큰)
- 유형별 오류율

### 사용 지표
- 모드 선호도 (hybrid vs from-scratch)
- 인기 있는 어휘 패턴
- 인기 있는 문법 주제
- 완료율 (시작 → 퀴즈 완료)

---

## 9. 핵심 파일 요약

| 파일 | 상태 | 설명 |
|------|------|------|
| `src/types/custom-quiz.ts` | 수정 | 새 타입 추가 |
| `src/lib/ai/quiz-generator.ts` | 신규 | 핵심 생성 로직 |
| `src/lib/ai/patterns.ts` | 기존 | 패턴 정의 참조 (2400줄) |
| `src/lib/ai/client.ts` | 기존 | OpenAI 클라이언트 |
| `src/app/api/ai/generate-quiz/route.ts` | 신규 | API 엔드포인트 |
| `src/app/quiz/custom/page.tsx` | 수정 | 메인 페이지 |
| `src/components/quiz/custom/PreviewPanel.tsx` | 수정 | 비교 UI |

---

## 10. 원래 플랜과의 차이점

### ❌ 제거된 부분
1. **vocabulary-analyzer.ts**: 별도 어휘 분석 단계 제거
   - 이유: 추가 비용, 품사 모호성, 대부분 문법이 범용적
   - 대안: AI가 생성 시점에 문맥으로 판단

2. **mapper.ts**: 어휘-문법 호환성 체크 제거
   - 이유: 대부분 문법이 타입 제한이 느슨함
   - 대안: AI 판단에 맡김

3. **AIProvider 추상화**: 제공자 인터페이스 제거
   - 이유: 현재 OpenAI만 사용, YAGNI 원칙
   - 대안: 필요시 나중에 추가

### ✅ 강화된 부분
1. **Items[] 생성 및 검증**
   - 자동 수정 함수 추가
   - 재구성 검증 추가
   - 상세한 spacing 규칙

2. **에러 처리**
   - 점진적 생성 + 재시도 로직
   - 최소 50% 성공 임계값
   - 상세한 metadata

3. **프롬프트 엔지니어링**
   - 명확한 spacing 규칙 설명
   - 풍부한 예제
   - 검증 가능한 출력 형식

4. **비교 UI**
   - 양쪽 metadata 표시
   - 독립적인 펼치기/접기
   - 명확한 선택 UI

---

## 다음 단계

1. 이 플랜 검토 및 승인
2. Phase 1부터 순차적으로 구현 시작
3. 각 Phase마다 테스트 및 검증
4. 완료 후 전체 시스템 통합 테스트

질문이나 수정사항이 있으면 알려주세요!
