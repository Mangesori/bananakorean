# 🍌 Banana Korean - 개발 로드맵 (v2.0)

> **AI 기반 대화형 한국어 학습 플랫폼**
> 선생님이 학생들에게 맞춤 숙제를 내고, AI가 문제를 자동 생성하는 혁신적인 학습 플랫폼

---

## 📊 프로젝트 개요

### 핵심 차별점
- **대화 기반 맥락 학습**: 모든 문제가 대화 형식으로 단어와 표현을 맥락 속에서 이해
- **AI 맞춤 문제 생성**: 선생님이 단어/문법 선택 → AI가 즉시 새로운 문제 생성
- **선생님-학생 플랫폼**: 숙제 부여, 진도 관리, 자동 채점

### 타겟
- **주요 타겟**: 외국인을 가르치는 한국인 한국어 선생님
- **부차 타겟**: 외국인 선생님, 개인 학습자
- **지역**: 전 세계

### 기술 스택
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, DB, Realtime)
- **AI**: GPT-4o mini, GPT-4o, Claude Haiku 4.5
- **Payment**: Stripe, Toss Payments
- **Speech**: OpenAI Whisper (STT), OpenAI TTS
- **PWA**: next-pwa

---

## ✅ 이미 완성된 기능 (프로덕션 수준)

### 1. 인증 시스템
- ✅ 로그인/회원가입 (이메일/비밀번호)
- ✅ 비밀번호 재설정
- ✅ 역할 기반 접근 제어 (admin/student)
- ✅ RLS 정책으로 데이터 보호
- ✅ 프로필 자동 생성

### 2. 퀴즈 시스템 (4가지 타입)
- ✅ **Dialogue Drag & Drop**: 대화형 드래그 앤 드롭
- ✅ **Multiple Choice**: 객관식
- ✅ **Fill in the Blank**: 빈칸 채우기
- ✅ **Sentence Drag & Drop**: 문장 드래그 (유지)
- ✅ **31개 A1 문법 완성**: introduction → sequence
- ✅ 각 문법당 10-15개 문제
- ✅ Review 모드 (틀린 문제 복습)
- ✅ Retake 모드 (전체 다시 풀기)

### 3. 진도 추적 시스템
- ✅ `quiz_attempts` 테이블 - 모든 시도 기록
- ✅ `user_progress` 테이블 - 문법별 진도
- ✅ `user_weak_areas` 테이블 - 약점 분석
- ✅ `user_achievements` 테이블 - 배지 시스템
- ✅ `user_learning_goals` 테이블 - 학습 목표
- ✅ 정답률, 연속 학습, 마스터리 레벨 추적

### 4. 학생 대시보드 (프로덕션 품질)
- ✅ 학습 통계 카드 (세션, 정답률, 연속 학습, 완료 문법)
- ✅ 문법별 진도 표시
- ✅ 차트 시각화 (Chart.js)
  - StreakCalendar (활동 히트맵)
  - LearningActivityChart (학습 활동)
  - GrammarAccuracyChart (문법별 정답률)
- ✅ 약점 분석 카드 (TOP 3)
- ✅ 성취 배지 표시

### 5. 메시징 시스템
- ✅ 실시간 1:1 채팅 (Supabase Realtime)
- ✅ `conversations`, `messages` 테이블
- ✅ 읽음 상태, 안 읽은 메시지 카운트
- ✅ 메시지 드롭다운 UI
- ✅ ConversationList, ConversationView 컴포넌트

### 6. 다국어 지원
- ✅ next-intl 통합
- ✅ 한국어(ko), 영어(en) 완전 번역
- ✅ LanguageSwitcher 컴포넌트
- ✅ 모든 UI 문자열 다국어 지원

### 7. 기타
- ✅ React Query로 효율적 데이터 페칭
- ✅ Tailwind CSS 반응형 디자인
- ✅ Dark mode 지원
- ✅ 드래그 앤 드롭 (@dnd-kit)
- ✅ 토스트 알림 (react-toastify)
- ✅ 미들웨어 권한 체크

---

## 🎯 개발 일정 (8-9주로 단축)

### 📅 Phase 1: MVP (4주) - 학생들에게 숙제 바로 내기

#### **Week 1: 역할 & 구독 시스템**

**목표**: Teacher 역할 추가, 기본 구독 설정

**Day 1: Teacher 역할 추가 (기존 시스템 확장)** ✅ **완료**
- [x] 역할 3가지로 확장: `admin`, `teacher`, `student`
  - Admin: 플랫폼 관리자 (기존 유지)
  - Teacher: 한국어 선생님 (신규 추가)
  - Student: 학습자 (기존 유지)
- [x] 회원가입 시 역할 선택 UI 수정
  - 학생/선생님만 선택 가능 (Admin은 수동 설정)
- [x] 미들웨어 역할 체크 수정

**Day 2: 프로필 시스템 정비** ✅ **완료**
- [x] `profiles` 테이블 마이그레이션 생성
  - 기존에 수동으로 생성된 테이블 공식화
  - `user_role` 컬럼 추가 (admin/teacher/student)
- [x] 프로필 생성 함수 수정 (역할 저장)
- [x] RLS 정책 업데이트

**Day 3: 구독 시스템 DB (수동 버전)** ✅ **완료**
- [x] `subscriptions` 테이블 생성
  - 6가지 플랜: `free`, `student_pro`, `teacher_pro`, `student_premium`, `teacher_premium`
  - 학생/선생님 제한 설정
- [x] `user_ai_usage` 테이블 생성
  - 주/월 AI 생성 횟수 추적
- [x] `feature_access` 테이블 (선택사항)

**Day 4: 사용량 제한 미들웨어** ✅ **완료**
- [x] AI 생성 제한 체크 함수
  - 무료: 주 1회
  - 프로: 월 20회
  - 프리미엄: 무제한
- [x] 학생 관리 제한 체크
  - 프로: 30명
  - 프리미엄: 무제한
- [x] 테스트 API 생성 (`/api/test/subscription`)
- [x] 테스트 UI 생성 (`/test/subscription`)
- [x] 모든 플랜별 제한 검증 완료
- [x] 기간 리셋 기능 검증 완료

**Day 5: PWA 기본 설정 + 대시보드 분기** ✅ **완료**
- [x] `manifest.json` 생성 (30분)
- [x] 아이콘 준비 (192x192, 512x512)
- [x] Teacher 대시보드 라우팅 추가
  - `/dashboards/teacher-*` 페이지들

**주말: 통합 테스트** ✅ **완료**
- [x] 3가지 역할 전환 테스트
- [x] 권한 체크 테스트
- [x] Week 2 준비 완료

---

#### **Week 2: AI 커스텀 모드 (Speaking 제외)**

**목표**: AI 문제 생성 시스템 구축

**Day 1: AI 통합 기초**
- [ ] OpenAI API 설정 (GPT-4o mini)
- [ ] Claude Haiku 4.5 설정 (Fallback)
- [ ] `.env.local`에 API 키 추가
- [ ] `src/lib/ai/client.ts` 생성
- [ ] API 비용 추적 시스템

**Day 2: 커스텀 모드 UI - Step 1-2**
- [ ] Step 1: 어휘 입력 UI
  - 텍스트 영역 (한국어만)
  - 쉼표로 구분
  - "단어, 표현, 관용구 모두 입력" 안내
- [ ] Step 2: 문법 선택 체크박스
  - 31개 A1 문법 (기존 데이터 활용)
  - 6레벨 드롭다운 (A1만 활성, A2-C2 비활성)
  - 순서대로 표시, 자유 선택 가능

**Day 3: 커스텀 모드 UI - Step 3-4**
- [ ] Step 3: 퀴즈 타입 및 개수
  - 5가지 타입 (Speaking 제외)
  - 각 0-20개 선택 가능
  - 총 개수 표시
  - 남은 생성 횟수 표시
- [ ] Step 4: 생성 버튼 및 로딩 UI
  - "AI 생성하기" 버튼
  - 로딩 애니메이션
  - 진행 상태 표시

**Day 4-5: AI 문제 생성 로직**
- [ ] 어휘 자동 번역 (한국어 → 영어)
- [ ] AI 프롬프트 엔지니어링
  - 문법 규칙 포함
  - 대화 형식 강제
  - 어휘 사용 요구
- [ ] 4가지 퀴즈 타입 생성
  - Multiple Choice
  - Dialogue Drag & Drop
  - Fill in the Blank
  - Matching
- [ ] 생성 결과 검증
- [ ] 생성 횟수 추적 및 저장

**주말: 미리보기 & 수정**
- [ ] Step 4 미리보기 UI
- [ ] 개별 문제 재생성
- [ ] 수동 편집 기능
- [ ] 전체 다시 생성

---

#### **Week 3: Speaking 퀴즈 통합**

**목표**: Speaking 3가지 타입 완성

**Day 1: Speaking 사전 생성 스크립트**
- [ ] `pre_generated_speaking_problems` 테이블 생성
- [ ] 생성 스크립트 작성
  - 31개 문법 × 30개 = 930개
  - Type 1: 대화 보고 따라 읽기 (310개)
  - Type 2: 듣고 따라 말하기 (310개)
  - Type 3: 단어로 문장 만들기 (310개)
- [ ] GPT-4o mini로 생성 실행

**Day 2: TTS 오디오 생성**
- [ ] OpenAI TTS API 설정
- [ ] Type 2용 오디오 620개 생성
  - 질문 + 답변 각각
- [ ] Supabase Storage에 업로드
- [ ] `audio_url` DB 저장

**Day 3: Speaking UI - Type 1 (Read Aloud)**
- [ ] `src/components/quiz/Speaking/` 폴더 생성
- [ ] Type1.tsx 컴포넌트
  - 대화 표시 (Q + A)
  - "질문을 따라 읽으세요" 지문
  - 음성 녹음 버튼 (MediaRecorder API)

**Day 4: Speaking UI - Type 2 (Listen and Repeat)**
- [ ] Type2.tsx 컴포넌트
  - 오디오 재생 버튼 (질문 + 답변 모두)
  - "오디오를 듣고 따라 하세요" 지문
  - 음성 녹음 버튼

**Day 5: Speaking UI - Type 3 (Word Prompt)**
- [ ] Type3.tsx 컴포넌트
  - 제시 단어 표시
  - "제시된 단어로 문장을 만드세요" 지문
  - 음성 녹음 버튼

**주말: Whisper API 연동**
- [ ] `/api/speech-to-text` 엔드포인트
- [ ] Whisper API로 음성 → 텍스트
- [ ] 정답 텍스트 비교 (80% 유사도)
- [ ] O/X 평가 표시
- [ ] 커스텀 모드에 Speaking 추가 (Step 3)

---

#### **Week 4: 간단 모드 (단축)**

**목표**: 기존 문제 자동 구성 (기존 데이터 활용)

**Day 1: 간단 모드 UI**
- [ ] 레벨 선택 드롭다운 (A1-C2)
  - 현재 A1만 활성화
- [ ] 문법 범위 선택
  - "어디까지 공부하셨나요?"
  - 라디오 버튼 (세로 슬라이드)
- [ ] 기본/고급 설정 토글

**Day 2: AI 가중치 계산**
- [ ] GPT-4o mini로 가중치 계산
  - 최근 문법 → 높은 비율
  - 초반 문법 → 낮은 비율
- [ ] 가중치 캐싱 (24시간)
  - Redis 또는 메모리 캐시

**Day 3: 문제 자동 선택 로직**
- [ ] 가중치 기반 문제 분배
- [ ] 기존 문제 데이터에서 랜덤 선택
  - 이미 완성된 31개 문법 활용!
- [ ] Speaking 사전 생성 문제 선택
- [ ] 5가지 타입 통합

**Day 4: 통합 및 테스트**
- [ ] 기본 설정: 각 10개씩 자동
- [ ] 고급 설정: 사용자 개수 선택
- [ ] 전체 플로우 테스트

---

#### **Week 5: 숙제 시스템 (선생님→학생)**

**목표**: 숙제 부여, 자동 채점

**Day 1: DB 스키마**
- [ ] `assignments` 테이블
  - 간단/커스텀 모드 구분
  - 어휘, 문법, 퀴즈 개수
  - 마감일
- [ ] `assignment_problems` 테이블
- [ ] `student_assignments` 테이블
- [ ] `student_assignment_attempts` 테이블
- [ ] `teacher_students` 관계 테이블
  - 1명 선생님만 (1:1 제약)

**Day 2: 학생 초대**
- [ ] 이메일 초대 기능
- [ ] `invitations` 테이블
- [ ] 초대 수락 로직
- [ ] 초대 코드 시스템 (선택사항)

**Day 3: 숙제 생성 및 부여**
- [ ] 숙제 생성 API
  - 간단 모드
  - 커스텀 모드
- [ ] 문제 생성 및 저장
- [ ] 학생 선택 UI (최대 30명/무제한)
- [ ] 숙제 부여 로직
- [ ] 마감일 설정

**Day 4: 학생 숙제 풀기**
- [ ] 학생 대시보드에 숙제 목록
  - 대기 중
  - 진행 중
  - 완료됨
- [ ] 숙제 시작 (started_at)
- [ ] 문제 풀이 UI (6가지 타입 통합)
- [ ] 답안 제출 API

**Day 5: 자동 채점 및 진도**
- [ ] 정답 체크 (O/X)
- [ ] 점수 계산
- [ ] 숙제 제출 완료
- [ ] 선생님 진도 모니터링 대시보드
  - 학생별 진도
  - 완료율
  - 점수 분포

**주말: 고급 기능**
- [ ] 재시도 (점수 갱신 안 됨)
- [ ] 마감일 연장
- [ ] 앱 내 알림
  - 새 숙제
  - 마감 임박 (D-1)
  - 숙제 제출 (선생님에게)

---

### 🎉 **Phase 1 완료 시 (4주 후 → 5주에서 단축!)**
✅ 당신이 학생들에게 바로 숙제 낼 수 있음!
✅ AI로 맞춤 문제 생성 (커스텀/간단 모드)
✅ Speaking 퀴즈 포함 (3가지 타입)
✅ 자동 채점 및 진도 관리

---

### 📅 Phase 2: 완전한 플랫폼 (3주로 단축)

#### **Week 6-7: Stripe & Toss Payments**

**Week 6: Stripe**
- [ ] Stripe 계정 및 API 키 설정
- [ ] Checkout 세션 구현
- [ ] Webhook 처리
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- [ ] 7일 무료 체험
- [ ] 구독 상태 동기화

**Week 7: Toss Payments + 통합 UI**
- [ ] Toss Payments 계정
- [ ] 빌링키 발급
- [ ] 정기 결제 스케줄링
- [ ] `/pricing` 가격표 페이지
- [ ] `/subscription` 구독 관리 페이지
- [ ] 결제 성공/실패 페이지
- [ ] 7일 환불 처리

---

#### **Week 8: 플랫폼 개선**

**Day 1: 학생 관리 UI**
- [ ] `/teacher/students` 페이지
- [ ] 학생 목록 (제한 표시)
- [ ] 학생 초대 (이메일 + 코드)
- [ ] 학생 제거

**Day 2: 알림 시스템**
- [ ] `notifications` 테이블
- [ ] 앱 내 알림 UI
- [ ] 새 숙제 알림
- [ ] 마감 D-1 리마인더
- [ ] 숙제 제출 알림

**Day 3: 이메일 알림 (선택)**
- [ ] SendGrid/Resend 설정
- [ ] 초대 이메일
- [ ] 숙제 알림 이메일

**Day 4: 진도 차트 (이미 대부분 완성)**
- [ ] 기존 차트 컴포넌트 재사용
- [ ] 선생님용 진도 차트 추가
- [ ] 학생별 비교 차트

**Day 5: UI/UX 개선**
- [ ] 로딩 스켈레톤 (일부 완성)
- [ ] 에러 핸들링 개선
- [ ] 반응형 디자인 점검

**주말: 사용자 테스트**
- [ ] 실제 학생들 테스트
- [ ] 피드백 수집 및 반영

---

### 🎉 **Phase 2 완료 시 (7-8주 후)**
✅ 완전 자동화된 플랫폼
✅ 결제 받고 서비스 제공 가능
✅ 다른 선생님들도 사용 가능

---

### 📅 Phase 3: 마무리 (1-2주로 단축)

#### **Week 9: PWA 오프라인 + 배포 준비**

**Day 1-2: PWA**
- [ ] `next-pwa` 설치 및 설정
- [ ] Service Worker 캐싱
- [ ] IndexedDB (Dexie.js)
- [ ] 오프라인 문제 저장
- [ ] 온라인 복귀 시 동기화

**Day 3: 테스트**
- [ ] E2E 테스트 (Playwright)
- [ ] 회원가입 → 숙제 생성 → 풀이 플로우
- [ ] 결제 플로우

**Day 4: 성능 최적화**
- [ ] 이미지 최적화
- [ ] 코드 스플리팅
- [ ] 번들 크기 최적화
- [ ] Lighthouse 90+ 달성

**Day 5: 배포**
- [ ] Vercel 프로덕션 배포
- [ ] 환경 변수 설정
- [ ] 도메인 연결
- [ ] HTTPS

**주말: 모니터링**
- [ ] Sentry 에러 모니터링
- [ ] Google Analytics
- [ ] Vercel Analytics

---

### 🎉 **최종 완성 (8-9주 후 → 12주에서 단축!)**
✅ Speaking 포함 완전체
✅ PWA 오프라인 지원
✅ 시장 출시 준비 완료

---

## 💳 구독 플랜

### 무료 (Free) - $0
```
✅ 기존 문제 무제한 풀기 (4가지 타입, 31개 문법)
✅ 진도 추적, 약점 분석, 성취 배지 (완성됨)
✅ AI 생성 (주 1회)
   - 간단/커스텀 모드 합쳐서 주 1회
   - 1회당 최대 100개 문제
   - Speaking 최대 20개 포함
❌ Speaking 퀴즈 (주 1회만)
❌ 숙제 부여 (선생님)
❌ 학생 관리
```

### 학생 프로 (Student Pro) - $9.99/월
```
✅ 무료 모든 기능
✅ AI 생성 (월 20회)
✅ Speaking 퀴즈
   - 간단 모드: 무제한 (사전 생성)
   - 커스텀 모드: 최대 400개/월
   - AI: GPT-4o mini
✅ 7일 무료 체험
❌ 숙제 부여 불가
```

### 선생님 프로 (Teacher Pro) - $14.99/월
```
✅ 학생 프로 모든 기능
✅ 학생 관리 (최대 30명)
✅ 숙제 만들기 & 부여
✅ 진도 모니터링
✅ 자동 채점
```

### 학생 프리미엄 (Student Premium) - $19.99/월
```
✅ 학생 프로 모든 기능
✅ AI 생성 무제한
✅ Speaking 무제한 (GPT-4o 고품질)
```

### 선생님 프리미엄 (Teacher Premium) - $29.99/월
```
✅ 선생님 프로 모든 기능
✅ AI 생성 무제한
✅ Speaking 무제한 (GPT-4o)
✅ 학생 무제한 관리
✅ 우선 지원
```

---

## 🎮 퀴즈 타입 (6가지)

### ✅ 이미 완성된 타입 (4개)
1. **Multiple Choice** (객관식)
2. **Dialogue Drag & Drop** (대화 드래그)
3. **Fill in the Blank** (빈칸)
4. **Sentence Drag & Drop** (문장 드래그) - 유지

### 🆕 추가할 타입 (2개)
5. **Matching** (단어 매칭) - Duolingo 스타일
6. **Speaking** (발음) - 3가지 타입
   - Type 1: 대화 보고 따라 읽기
   - Type 2: 듣고 따라 말하기
   - Type 3: 단어로 문장 만들기

---

## 🤖 AI 시스템

### 모델 전략
- **GPT-4o mini**: 주력 (95%), $0.15/$0.60 per 1M tokens
- **GPT-4o**: 프리미엄 (5%), $3/$10 per 1M tokens
- **Claude Haiku 4.5**: 백업, $1/$5 per 1M tokens

### Speaking 사전 생성
- 930개 (31 문법 × 30개)
- TTS 오디오 620개
- 초기 비용: ~$0.25 (1회성)

---

## 📊 예상 비용 & 수익

### 월 비용
- AI: ~$175
- Supabase: ~$25
- Stripe/Toss: ~$30
- **총: ~$230/월**

### 예상 수익 (200명)
- 프로: 100명 × $12 = $1,200
- 프리미엄: 50명 × $25 = $1,250
- **총: ~$2,450/월**

**마진: 90%+** 🎉

---

## 📝 문법 체계

### ✅ A1: Beginner (31개 - 완성!)
1. introduction (은/는, 이에요/예요)
2. demonstratives (이거, 그거, 저거)
3. negation (이/가 아니에요)
... (생략)
30. time-relations ((으)ㄹ 때)
31. sequence (기 전, (으)ㄴ 후)

### 🔨 A2~C2 (추후 추가)
- A2: Elementary
- B1: Intermediate
- B2: Upper Intermediate
- C1: Advanced
- C2: Proficient

---

## ✅ 주차별 체크리스트

### Week 1 (역할 & 구독) ✅ **100% 완료**
- [x] Teacher 역할 추가 (admin/teacher/student)
- [x] 프로필 테이블 마이그레이션
- [x] 구독 시스템 DB
- [x] 사용량 제한 미들웨어
- [x] PWA manifest.json
- [x] 테스트 완료 (SUBSCRIPTION_TEST_RESULTS.md)

### Week 2 (AI 커스텀 모드)
- [ ] OpenAI API 설정
- [ ] 커스텀 모드 UI (4단계)
- [ ] AI 문제 생성 (4타입)

### Week 3 (Speaking)
- [ ] Speaking 930개 사전 생성
- [ ] TTS 오디오 620개
- [ ] Speaking 3가지 UI
- [ ] Whisper API

### Week 4 (간단 모드)
- [ ] 간단 모드 UI
- [ ] AI 가중치 계산
- [ ] 문제 자동 선택

### Week 5 (숙제 시스템)
- [ ] DB 스키마
- [ ] 학생 초대
- [ ] 숙제 생성/부여
- [ ] 자동 채점

### Week 6-7 (결제)
- [ ] Stripe
- [ ] Toss Payments
- [ ] 통합 UI

### Week 8 (플랫폼 개선)
- [ ] 학생 관리 UI
- [ ] 알림 시스템
- [ ] 진도 차트

### Week 9 (PWA & 배포)
- [ ] PWA 오프라인
- [ ] E2E 테스트
- [ ] 프로덕션 배포

---

## 🎯 성공 지표

### Phase 1 완료 (4주)
- ✅ MVP 출시
- ✅ 본인 학생들 사용
- ✅ 피드백 수집

### Phase 2 완료 (7-8주)
- 🎯 베타 사용자 50명
- 🎯 유료 전환 10명
- 🎯 월 매출 $100+

### Phase 3 완료 (8-9주)
- 🎯 정식 출시
- 🎯 사용자 200명
- 🎯 월 매출 $2,000+

---

## 💡 개발 노트

### 이미 완성된 기능 활용 전략
1. **퀴즈 시스템** - 기존 4가지 타입, 31개 문법 데이터 재사용
2. **진도 추적** - 완벽한 DB 스키마, 차트 컴포넌트 재사용
3. **대시보드** - 학생 대시보드 그대로 활용, 선생님용만 추가
4. **메시징** - 실시간 채팅 완성, 추가 작업 불필요
5. **다국어** - next-intl 완성, 새 문자열만 번역 추가

### 기술적 장점
- ✅ Supabase RLS로 데이터 보안
- ✅ React Query로 효율적 캐싱
- ✅ TypeScript로 타입 안전성
- ✅ 반응형 디자인 완성
- ✅ 프로덕션 레벨 코드 품질

---

## 📞 연락처 & 지원

- **이슈 리포트**: GitHub Issues
- **피드백**: feedback@bananakorean.com
- **지원**: support@bananakorean.com

---

**🍌 8-9주만에 완전한 플랫폼 완성!**
*기존 코드베이스가 훌륭해서 개발 기간 30% 단축!*
