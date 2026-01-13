# AI 퀴즈 생성 시스템 테스트 가이드

## 개요
이 문서는 AI 퀴즈 생성 시스템(Phase 1-7)의 테스트 절차를 설명합니다.

## 사전 준비

### 1. 환경 변수 설정
`.env.local` 파일에 OpenAI API 키가 설정되어 있는지 확인:
```bash
OPENAI_API_KEY=sk-...
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

## 테스트 체크리스트

### Phase 1-2: 핵심 로직 테스트

#### ✅ 가중치 계산
- [ ] 단일 문법: 100% 가중치
- [ ] 2개 문법: 66.7%, 33.3%
- [ ] 3개 문법: 50%, 25%, 12.5% (정규화)

#### ✅ 문법 선택
- [ ] Roulette wheel selection 정상 작동
- [ ] 어려운 문법이 더 자주 선택됨

#### ✅ 패턴 선택
- [ ] 어휘와 매칭되는 패턴 우선 선택
- [ ] 패턴 없을 시 null 반환

### Phase 3: Items[] 처리 테스트

#### ✅ Spacing 자동 수정
테스트 케이스:
```typescript
// 입력: "저는 학생이에요."
// 예상 출력:
[
  { content: "저", combineWithNext: true },    // 조사 앞
  { content: "는", combineWithNext: false },   // 조사
  { content: "학생", combineWithNext: true },  // 어미 앞
  { content: "이에요.", combineWithNext: false } // 마지막
]
```

**테스트 항목:**
- [ ] 조사 처리: 는/을/에/에서/로 등
- [ ] 어미 처리: 어요/았어요/이에요 등
- [ ] 구두점 처리: . ! ? , ~
- [ ] 마지막 item은 항상 false

#### ✅ Reconstruction 검증
- [ ] Items 재조립 시 원본 답변과 일치
- [ ] 공백 정규화 정상 작동

### Phase 4: From-Scratch 생성 테스트

#### ✅ 템플릿 기반 생성
- [ ] 패턴 템플릿 사용
- [ ] 예제 스타일 유지
- [ ] 어휘 최소 1개 포함
- [ ] Temperature 0.8

#### ✅ From-Scratch 생성
- [ ] 템플릿 없이 생성
- [ ] 문법 명확하게 사용
- [ ] 자연스러운 대화
- [ ] Temperature 0.9 (더 창의적)

#### ✅ Hybrid Fallback
- [ ] 템플릿 우선 시도
- [ ] 실패 시 from-scratch로 전환
- [ ] 문법 격리 검증

### Phase 5: API 테스트

#### ✅ 인증
```bash
# 비인증 요청
curl -X POST http://localhost:3000/api/ai/generate-quiz
# 예상: 401 Unauthorized
```

#### ✅ 입력 검증
```bash
# 어휘 누락
curl -X POST http://localhost:3000/api/ai/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"grammarTopics": ["existence"], "count": 5}'
# 예상: 400 Bad Request

# 문법 누락
curl -X POST http://localhost:3000/api/ai/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"vocabulary": ["학생"], "count": 5}'
# 예상: 400 Bad Request

# 개수 범위 초과
curl -X POST http://localhost:3000/api/ai/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"vocabulary": ["학생"], "grammarTopics": ["existence"], "count": 100}'
# 예상: 400 Bad Request
```

#### ✅ 정상 요청
```bash
curl -X POST http://localhost:3000/api/ai/generate-quiz \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SESSION_COOKIE" \
  -d '{
    "vocabulary": ["학생", "선생님", "학교"],
    "grammarTopics": ["existence", "locations"],
    "count": 3,
    "mode": "hybrid"
  }'
```

**예상 응답:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "questions": [...],
    "metadata": {
      "totalRequested": 3,
      "totalGenerated": 3,
      "failedCount": 0,
      "templateUsed": 2,
      "fromScratchUsed": 1
    }
  },
  "limit": {
    "remaining": 47,
    "resetDate": "2025-01-01T00:00:00Z"
  }
}
```

#### ✅ 구독 제한
- [ ] 제한 확인 정상 작동
- [ ] 초과 시 403 반환
- [ ] resetDate 포함

#### ✅ 모드별 테스트
- [ ] `mode: "hybrid"` - 하이브리드
- [ ] `mode: "from-scratch"` - 처음부터
- [ ] `mode: "both"` - 비교 (두 방식 모두)

### Phase 6: 프론트엔드 테스트

#### ✅ Step 1: 어휘 입력
- [ ] 최소 1개 입력 필요
- [ ] Enter로 추가
- [ ] X 버튼으로 삭제
- [ ] 다음 단계 이동

#### ✅ Step 2: 문법 선택
- [ ] 레벨별 그룹 표시 (A1/A2/B1)
- [ ] 최소 1개 선택 필요
- [ ] 체크박스 토글
- [ ] 이전/다음 버튼

#### ✅ Step 3: 설정
- [ ] 문제 개수 선택 (1-50)
- [ ] 생성 버튼 클릭
- [ ] 로딩 상태 표시

#### ✅ Step 4: 미리보기
- [ ] 생성된 문제 목록 표시
- [ ] Metadata 표시 (템플릿/from-scratch 개수)
- [ ] 펼치기/접기
- [ ] 단일 재생성
- [ ] 전체 재생성
- [ ] 퀴즈 시작

### Phase 7: Polish & UX

#### ✅ 진행 상황 표시
- [ ] 생성 시작 시 모달 표시
- [ ] 진행 바 애니메이션
- [ ] 예상 시간 표시
- [ ] 완료 시 자동 닫힘

#### ✅ 에러 핸들링
- [ ] 네트워크 오류 메시지
- [ ] API 오류 메시지
- [ ] 인증 오류 처리
- [ ] 재시도 옵션

#### ✅ 반응형 디자인
- [ ] 모바일 뷰 (< 768px)
- [ ] 태블릿 뷰 (768px - 1024px)
- [ ] 데스크톱 뷰 (> 1024px)

## 엣지 케이스 테스트

### 1. 문법 격리 검증
**시나리오:** `existence` 문법만 선택했는데 `past-tense` 패턴이 나타나는 경우

**테스트:**
```typescript
// 선택: existence
// 금지 패턴: /았어요|었어요/
// 예상: 금지 패턴 감지 시 재생성
```

### 2. Items Reconstruction 실패
**시나리오:** Items를 합쳤을 때 answer와 불일치

**테스트:**
```typescript
// answer: "저는 학생이에요."
// items: ["저", "는", "학생"] (누락)
// 예상: validateQuestion() false 반환
```

### 3. 어휘 미포함
**시나리오:** 사용자 어휘가 답변에 포함되지 않음

**검증:**
- AI 프롬프트에 "최소 1개 이상 사용" 명시
- vocabularyUsed 필드로 추적

### 4. Rate Limiting
**시나리오:** 연속 생성 시 500ms 대기

**테스트:**
```typescript
// 10개 문제 생성
// 예상 소요 시간: ~5초 (10 * 0.5초)
```

## 성능 테스트

### 응답 시간
- [ ] 1개 문제: < 5초
- [ ] 5개 문제: < 15초
- [ ] 10개 문제: < 30초

### 메모리 사용
- [ ] 브라우저 메모리 < 100MB
- [ ] 서버 메모리 안정적

### 동시성
- [ ] 여러 사용자 동시 생성 가능
- [ ] API rate limit 준수

## 수동 품질 테스트

### 문제 품질 평가
각 문법 주제별로 최소 5개 문제 생성 후 평가:

1. **자연스러움** (1-5점)
   - [ ] 실제 대화처럼 자연스러운가?
   - [ ] 어색한 표현은 없는가?

2. **문법 정확성** (1-5점)
   - [ ] 선택한 문법을 올바르게 사용하는가?
   - [ ] 다른 문법이 섞이지 않았는가?

3. **어휘 활용** (1-5점)
   - [ ] 사용자 어휘를 적절히 활용하는가?
   - [ ] 문맥에 맞게 사용하는가?

4. **난이도** (1-5점)
   - [ ] 초급 학습자에게 적절한가?
   - [ ] 너무 쉽거나 어렵지 않은가?

5. **번역 정확성** (1-5점)
   - [ ] 영문 번역이 정확한가?
   - [ ] 의미 전달이 명확한가?

## 회귀 테스트

### 기존 기능 확인
- [ ] 기존 퀴즈 모드 정상 작동
- [ ] 대화형 드래그앤드롭 퀴즈 플레이
- [ ] 점수 계산 정상
- [ ] 결과 저장

## 보고서 템플릿

```markdown
## 테스트 결과 보고서

**테스트 날짜:** YYYY-MM-DD
**테스터:** 이름

### Phase별 결과
- [ ] Phase 1-2: 핵심 로직 ✅/❌
- [ ] Phase 3: Items 처리 ✅/❌
- [ ] Phase 4: From-Scratch ✅/❌
- [ ] Phase 5: API ✅/❌
- [ ] Phase 6: 프론트엔드 ✅/❌
- [ ] Phase 7: Polish ✅/❌

### 발견된 이슈
1. [이슈 제목]
   - 우선순위: High/Medium/Low
   - 재현 단계: ...
   - 예상 결과: ...
   - 실제 결과: ...

### 품질 평가 (평균)
- 자연스러움: _/5
- 문법 정확성: _/5
- 어휘 활용: _/5
- 난이도: _/5
- 번역 정확성: _/5

### 총평
...
```

## 배포 전 최종 체크리스트

- [ ] 모든 TypeScript 오류 해결
- [ ] 모든 ESLint 경고 해결
- [ ] 환경 변수 프로덕션 설정 확인
- [ ] API 키 보안 확인
- [ ] 에러 로깅 설정
- [ ] 성능 모니터링 설정
- [ ] 백업 계획 수립
- [ ] 롤백 계획 수립
