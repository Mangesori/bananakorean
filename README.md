# 🍌 Banana Korean

> AI 기반 한국어 학습 플랫폼

Banana Korean은 AI 기술을 활용하여 맞춤형 한국어 학습 경험을 제공하는 플랫폼입니다. 선생님은 원하는 어휘와 문법을 선택하면 AI가 자동으로 퀴즈를 생성하고, 학생들은 다양한 형태의 인터랙티브 퀴즈를 통해 한국어를 학습할 수 있습니다.

## ✨ 주요 기능

### 🤖 AI 자동 퀴즈 생성
- **98% 성공률**의 GPT-5.2 기반 문제 자동 생성
- 문제당 3-5초의 빠른 생성 속도
- 한국어 조사/어미 자동 교정 기능

### 📝 4가지 퀴즈 유형
1. **대화형 드래그앤드롭** - 상황별 대화 문장 순서 맞추기
2. **객관식** - 4지선다 문제
3. **빈칸 채우기** - 문장 내 빈칸 완성
4. **문장 드래그앤드롭** - 문법에 맞는 문장 배열

### 📚 31개 문법 주제
- A1 레벨 입문부터 순차까지 체계적 학습
- 각 문법당 10-15개 이상의 문제
- 점진적 난이도 시스템

### 📊 진도 추적 시스템
- 실시간 학습 통계 및 대시보드
- 약점 영역 자동 분석
- 성취 배지 시스템
- 학습 목표 관리
- 연속 학습 일수(Streak) 추적

### 💬 실시간 메시징
- 선생님-학생 1:1 채팅 기능
- 읽음 상태 추적
- 실시간 알림

### 🌐 다국어 지원
- 한국어/영어 인터페이스
- 모든 UI 요소 번역 제공

## 🚀 시작하기

### 학습자용

1. **회원가입 및 로그인**
   - 이메일로 간편하게 가입

2. **대시보드 확인**
   - 학습 통계, 진도, 약점 영역 한눈에 파악

3. **퀴즈 시작**
   - 원하는 문법 주제 선택
   - 4가지 유형 중 선택하여 학습

4. **실시간 피드백**
   - 즉각적인 정답/오답 확인
   - 자동으로 진도 기록

### 선생님용

1. **선생님 계정으로 가입**
   - 선생님 권한으로 회원가입

2. **커스텀 퀴즈 생성**
   - `/quiz/custom` 페이지 접속
   - 가르치고 싶은 어휘 입력
   - 문법 주제 선택

3. **AI 자동 생성**
   - AI가 자동으로 맥락에 맞는 퀴즈 생성
   - 미리보기로 확인

4. **학생 관리**
   - 학생들의 진도 확인
   - 1:1 채팅으로 소통

## 🛠 기술 스택

### 프론트엔드
- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** - 스타일링
- **Chart.js** - 학습 통계 시각화
- **@dnd-kit** - 드래그앤드롭 기능

### 백엔드 & 인프라
- **Supabase**
  - PostgreSQL 데이터베이스
  - 인증 시스템 (Auth)
  - 실시간 구독 (Realtime)
- **OpenAI GPT-5.2** - AI 퀴즈 생성
- **Vercel** - 배포 및 호스팅

### 주요 라이브러리
- **next-intl** - 다국어 지원
- **Zod** - 유효성 검증
- **React Query (TanStack)** - 상태 관리
- **SweetAlert2** - 모달 및 알림
- **React Toastify** - 토스트 알림

## 📁 프로젝트 구조

```
bananakorean/
├── src/
│   ├── app/                           # 페이지 및 API 라우트
│   │   ├── api/ai/generate-quiz/     # AI 퀴즈 생성 API
│   │   ├── quiz/                     # 4가지 퀴즈 타입
│   │   │   ├── custom/              # 커스텀 퀴즈 생성
│   │   │   ├── DialogueDragAndDrop/ # 대화형 퀴즈
│   │   │   ├── fill-blank/          # 빈칸 채우기
│   │   │   └── multiple/            # 객관식
│   │   ├── auth/                     # 로그인, 회원가입
│   │   └── dashboards/               # 학생/관리자 대시보드
│   │
│   ├── components/                    # React 컴포넌트
│   │   ├── quiz/                     # 퀴즈 관련 컴포넌트
│   │   │   ├── custom/              # 커스텀 퀴즈 생성 UI
│   │   │   └── DialogueDragAndDrop/ # 퀴즈 플레이어
│   │   ├── layout/                   # 헤더, 내비게이션
│   │   └── shared/                   # 공통 컴포넌트
│   │
│   ├── lib/                           # 유틸리티 및 서비스
│   │   ├── ai/                       # AI 생성 로직
│   │   │   ├── quiz-generator.ts    # 핵심 생성 엔진
│   │   │   ├── patterns.ts          # 문법 패턴 라이브러리
│   │   │   └── translation-service.ts # 번역 서비스
│   │   ├── supabase/                 # 데이터베이스 연동
│   │   │   ├── client.ts            # Supabase 클라이언트
│   │   │   ├── quiz-tracking.ts     # 진도 추적
│   │   │   └── messages.ts          # 메시징 시스템
│   │   └── korean/                   # 한국어 처리
│   │       └── particles.ts         # 조사 처리
│   │
│   ├── types/                         # TypeScript 타입 정의
│   ├── data/                          # 정적 데이터 (퀴즈 템플릿)
│   ├── styles/                        # 글로벌 스타일
│   └── i18n/                          # 다국어 설정
│
├── public/                            # 정적 파일
│   ├── images/                        # 이미지, 아이콘
│   └── fakedata/                      # 목 데이터
│
└── supabase/                          # 데이터베이스 마이그레이션
```

## 💡 주요 기능 상세

### AI 퀴즈 생성 시스템

Banana Korean의 핵심 기능인 AI 퀴즈 생성 시스템은 다음과 같은 특징을 가지고 있습니다:

#### 생성 모드
- **순수 AI 모드** (90% 성공률)
  - GPT-5.2가 처음부터 생성
  - 더 창의적이고 다양한 문제

#### 스마트 기능
- **가중치 문법 선택**: 선택한 문법을 지수 감소 방식으로 분배 (50%, 25%, 12.5%...)
- **문법 격리 검증**: 17개 문법 패턴으로 타겟 문법만 포함되었는지 검증
- **한국어 조사/어미 자동 교정**: 은/는, 이/가, 을/를 등 자동 처리
- **드래그 아이템 검증**: 문장을 올바르게 재구성할 수 있는지 검증

#### 응답 시간
- 문제당 평균 3-5초
- 10문제 생성 시 약 30-50초

### 학습 진도 추적

체계적인 데이터베이스 구조로 학습 진도를 관리합니다:

- **quiz_attempts** - 개별 문제 시도 기록
- **user_progress** - 문법별 진도 및 마스터리 레벨
- **user_weak_areas** - 약점 영역 자동 분석
- **user_achievements** - 성취 배지 시스템
- **user_learning_goals** - 학습 목표 설정 및 추적

### 대시보드 기능

학생 대시보드에서 제공하는 정보:
- 📈 학습 통계 카드 (총 문제 수, 정답률, 연속 학습 일수)
- 🔥 스트릭 캘린더 (학습 활동 히트맵)
- 📊 학습 활동 차트 (일별 학습량)
- 🎯 문법 정확도 차트 (문법별 정답률)
- ⚠️ Top 3 약점 영역 표시
- 🏆 획득한 배지 표시

## ⚙️ 개발 환경 설정

### 필수 요구사항
- Node.js 18 이상
- npm, yarn, 또는 pnpm
- Supabase 계정
- OpenAI API 키

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/Mangesori/bananakorean.git
cd bananakorean

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
# .env.local 파일 생성 후 아래 내용 추가
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🚀 배포

- **호스팅**: Vercel
- **데이터베이스**: Supabase (PostgreSQL)
- **환경**: 프로덕션 환경 변수 설정 완료

## 📚 문서

프로젝트 루트에 상세한 문서가 포함되어 있습니다:

- **AI_SYSTEM_COMPLETE.md** - AI 시스템 전체 구현 가이드
- **DEVELOPMENT_ROADMAP.md** - 8-9주 개발 로드맵
- **DATABASE_SETUP.md** - 데이터베이스 스키마 및 설정
- **TESTING_GUIDE.md** - 테스트 가이드

## 📄 라이선스

이 프로젝트는 개인 학습 프로젝트입니다. 기여는 환영합니다!

## 📧 연락처

- **GitHub**: [@Mangesori](https://github.com/Mangesori)
- **이슈 및 제안**: [GitHub Issues](https://github.com/Mangesori/bananakorean/issues)

---

Made with ❤️ for Korean language learners
