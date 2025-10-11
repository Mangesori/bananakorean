# 🗄️ 데이터베이스 설정 가이드

## 📋 개요

Banana Korean 프로젝트의 진도 추적 시스템을 위한 데이터베이스 설정 가이드입니다.

## 🏗️ 데이터베이스 구조

### 주요 테이블

1. **quiz_attempts** - 개별 퀴즈 시도 기록
2. **user_progress** - 사용자별 진도 및 통계
3. **user_achievements** - 사용자 성취 및 배지
4. **user_learning_goals** - 사용자 학습 목표
5. **user_weak_areas** - 사용자 약점 분석

### 기존 테이블

- **profiles** - 사용자 프로필
- **conversations** - 대화방
- **messages** - 메시지

## 🚀 설정 방법

### 1. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase CLI 설치

```bash
npm install -g supabase
```

### 3. 데이터베이스 마이그레이션 실행

```bash
# 마이그레이션 실행
npm run migrate

# 또는 수동으로
node scripts/migrate-db.js
```

### 4. 타입 생성 (선택사항)

```bash
npm run db:types
```

## 📊 테이블 상세 정보

### quiz_attempts

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 기본키 |
| user_id | UUID | 사용자 ID (auth.users 참조) |
| quiz_type | VARCHAR(50) | 퀴즈 타입 ('dialogue_drag_drop', 'sentence', 'fill_in_blank', 'multiple_choice') |
| grammar_id | VARCHAR(100) | 문법 ID |
| question_id | VARCHAR(100) | 문제 ID |
| question_text | TEXT | 문제 텍스트 |
| user_answer | TEXT | 사용자 답변 |
| correct_answer | TEXT | 정답 |
| is_correct | BOOLEAN | 정답 여부 |
| time_spent | INTEGER | 소요 시간 (초) |
| hints_used | INTEGER | 사용한 힌트 수 |
| created_at | TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | 수정 시간 |

### user_progress

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 기본키 |
| user_id | UUID | 사용자 ID |
| grammar_id | VARCHAR(100) | 문법 ID |
| quiz_type | VARCHAR(50) | 퀴즈 타입 |
| total_attempts | INTEGER | 총 시도 횟수 |
| correct_attempts | INTEGER | 정답 횟수 |
| total_time_spent | INTEGER | 총 소요 시간 (초) |
| current_streak | INTEGER | 현재 연속 정답 |
| best_streak | INTEGER | 최고 연속 정답 |
| mastery_level | INTEGER | 숙련도 레벨 (0-5) |
| last_attempted_at | TIMESTAMP | 마지막 시도 시간 |
| completed_at | TIMESTAMP | 완료 시간 |
| created_at | TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | 수정 시간 |

### user_achievements

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 기본키 |
| user_id | UUID | 사용자 ID |
| achievement_type | VARCHAR(50) | 성취 타입 ('streak', 'accuracy', 'speed', 'completion') |
| achievement_name | VARCHAR(100) | 배지 이름 |
| achievement_description | TEXT | 배지 설명 |
| earned_at | TIMESTAMP | 획득 시간 |
| metadata | JSONB | 추가 메타데이터 |

### user_learning_goals

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 기본키 |
| user_id | UUID | 사용자 ID |
| goal_type | VARCHAR(50) | 목표 타입 ('daily', 'weekly', 'monthly') |
| target_value | INTEGER | 목표 값 |
| current_value | INTEGER | 현재 값 |
| is_completed | BOOLEAN | 완료 여부 |
| goal_period_start | DATE | 목표 기간 시작 |
| goal_period_end | DATE | 목표 기간 종료 |
| created_at | TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | 수정 시간 |

### user_weak_areas

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 기본키 |
| user_id | UUID | 사용자 ID |
| grammar_id | VARCHAR(100) | 약한 문법 |
| quiz_type | VARCHAR(50) | 약한 퀴즈 타입 |
| error_count | INTEGER | 오답 횟수 |
| total_attempts | INTEGER | 총 시도 횟수 |
| last_error_at | TIMESTAMP | 마지막 오답 시간 |
| improvement_suggestions | TEXT[] | 개선 제안 |
| created_at | TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | 수정 시간 |

## 🔒 보안 설정

### RLS (Row Level Security)

모든 테이블에 RLS가 활성화되어 있으며, 사용자는 자신의 데이터만 접근할 수 있습니다.

### 정책

- `Users can view own quiz attempts` - 퀴즈 시도 기록
- `Users can view own progress` - 진도 정보
- `Users can view own achievements` - 성취 배지
- `Users can view own learning goals` - 학습 목표
- `Users can view own weak areas` - 약점 분석

## 📈 인덱스

성능 최적화를 위한 인덱스가 설정되어 있습니다:

- `user_id` 기반 인덱스
- `grammar_id` 기반 인덱스
- `quiz_type` 기반 인덱스
- `created_at` 기반 인덱스
- `mastery_level` 기반 인덱스

## 🛠️ 사용법

### 퀴즈 시도 저장

```typescript
import { saveQuizAttempt } from '@/lib/supabase/quiz-tracking';

const result = await saveQuizAttempt({
  quiz_type: 'dialogue_drag_drop',
  grammar_id: 'eseo-kkaji',
  question_id: 'q1',
  question_text: '서울에서 부산까지 어떻게 가요?',
  user_answer: '기차로 가요',
  correct_answer: '저는 서울에서 부산까지 기차로 가요.',
  is_correct: true,
  time_spent: 30
});
```

### 사용자 진도 조회

```typescript
import { getUserProgress } from '@/lib/supabase/quiz-tracking';

const { data: progress } = await getUserProgress();
```

### 사용자 통계 조회

```typescript
import { getUserStats } from '@/lib/supabase/quiz-tracking';

const { data: stats } = await getUserStats();
```

## 🔧 문제 해결

### 마이그레이션 실패

1. Supabase CLI 버전 확인: `supabase --version`
2. 환경 변수 확인: `.env.local` 파일
3. Supabase 프로젝트 연결 상태 확인

### 권한 오류

1. RLS 정책 확인
2. 사용자 인증 상태 확인
3. Supabase 대시보드에서 테이블 권한 확인

### 타입 오류

1. 타입 재생성: `npm run db:types`
2. TypeScript 서버 재시작
3. `src/types/supabase.ts` 파일 확인

## 📚 추가 리소스

- [Supabase 문서](https://supabase.com/docs)
- [Next.js 문서](https://nextjs.org/docs)
- [TypeScript 문서](https://www.typescriptlang.org/docs)

## 🎯 다음 단계

1. **Day 2**: 백엔드 로직 구현
2. **Day 3**: 진도 추적 시스템 구현
3. **Day 4**: 진도 표시 UI 구현
4. **Day 5**: 학습 통계 구현
