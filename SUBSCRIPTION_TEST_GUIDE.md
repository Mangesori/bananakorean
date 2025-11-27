# 구독 시스템 테스트 가이드

## 🎯 Week 1 Day 4: 사용량 제한 미들웨어 테스트

이 문서는 구독 시스템이 정상 작동하는지 검증하기 위한 테스트 가이드입니다.

---

## 📋 사전 준비

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. 로그인
브라우저에서 로그인하여 인증된 상태로 테스트를 진행합니다.

---

## 🧪 테스트 방법

### Phase 1: DB 마이그레이션 확인

#### Supabase SQL Editor에서 실행:
```sql
-- 1. 테이블 존재 확인
SELECT table_name
FROM information_schema.tables
WHERE table_name IN ('subscriptions', 'user_ai_usage', 'feature_access');

-- 2. 구독 데이터 확인
SELECT user_id, plan_type, status, limits
FROM subscriptions;

-- 3. 현재 로그인한 사용자 확인
SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 5;
```

**기대 결과:**
- 3개 테이블 모두 존재
- 기존 사용자들에게 `free` 플랜이 자동 생성됨

---

### Phase 2: 기본 기능 테스트

#### Test 1: 구독 정보 조회
```bash
# 브라우저 또는 curl로 테스트
curl http://localhost:3000/api/test/subscription
```

**기대 응답:**
```json
{
  "success": true,
  "message": "구독 시스템이 정상 작동합니다.",
  "data": {
    "subscription": {
      "plan_type": "free",
      "status": "active",
      "limits": {
        "ai_generations_per_week": 1,
        "ai_generations_per_month": null,
        "max_students": null,
        "speaking_quizzes_per_month": 4,
        "ai_model": "gpt-4o-mini"
      }
    },
    "limits": {
      "aiGeneration": {
        "canGenerate": true,
        "remaining": 1,
        "limit": 1,
        "resetDate": "2025-01-19T23:59:59.999Z"
      },
      "studentManagement": {
        "canAddStudent": false,
        "remaining": 0,
        "limit": 0,
        "error": "학생 관리 기능은 유료 플랜에서만 사용할 수 있습니다."
      },
      "speakingQuiz": {
        "canUseSpeaking": true,
        "remaining": 4,
        "limit": 4
      }
    }
  }
}
```

---

### Phase 3: 무료 플랜 제한 테스트

#### Test 2: 첫 번째 AI 생성 (성공)
```bash
curl -X POST http://localhost:3000/api/test/subscription \
  -H "Content-Type: application/json" \
  -d '{"problemsGenerated": 10}'
```

**기대 결과:**
- ✅ 성공 응답
- `remaining: 0` (1회 사용함)

#### Test 3: 두 번째 AI 생성 (실패 - 제한 초과)
```bash
curl -X POST http://localhost:3000/api/test/subscription \
  -H "Content-Type: application/json" \
  -d '{"problemsGenerated": 10}'
```

**기대 결과:**
- ❌ 403 에러
- `"error": "생성 제한 초과"`

---

### Phase 4: 프로 플랜 업그레이드 테스트

#### Step 1: 현재 사용자 ID 확인
Supabase SQL Editor:
```sql
SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL';
```

#### Step 2: student_pro로 업그레이드
```sql
UPDATE subscriptions
SET
  plan_type = 'student_pro',
  limits = '{
    "ai_generations_per_week": null,
    "ai_generations_per_month": 20,
    "max_students": null,
    "speaking_quizzes_per_month": 400,
    "ai_model": "gpt-4o-mini"
  }'::jsonb
WHERE user_id = 'YOUR_USER_ID';
```

#### Step 3: 제한 확인
```bash
curl http://localhost:3000/api/test/subscription
```

**기대 결과:**
```json
{
  "aiGeneration": {
    "canGenerate": true,
    "remaining": 20,
    "limit": 20
  }
}
```

#### Step 4: 여러 번 생성 테스트
```bash
# 20번 반복 실행 (Bash)
for i in {1..20}; do
  curl -X POST http://localhost:3000/api/test/subscription \
    -H "Content-Type: application/json" \
    -d '{"problemsGenerated": 1}'
  echo "\n--- $i/20 완료 ---"
done

# 21번째 시도 (실패 예상)
curl -X POST http://localhost:3000/api/test/subscription \
  -H "Content-Type: application/json" \
  -d '{"problemsGenerated": 1}'
```

**기대 결과:**
- 1-20번: ✅ 성공
- 21번: ❌ 403 에러 "생성 제한 초과"

---

### Phase 5: 프리미엄 플랜 테스트

#### Step 1: student_premium으로 업그레이드
```sql
UPDATE subscriptions
SET
  plan_type = 'student_premium',
  limits = '{
    "ai_generations_per_week": null,
    "ai_generations_per_month": null,
    "max_students": null,
    "speaking_quizzes_per_month": null,
    "ai_model": "gpt-4o"
  }'::jsonb
WHERE user_id = 'YOUR_USER_ID';

-- 기존 사용량 초기화 (테스트용)
DELETE FROM user_ai_usage WHERE user_id = 'YOUR_USER_ID';
```

#### Step 2: 무제한 확인
```bash
curl http://localhost:3000/api/test/subscription
```

**기대 결과:**
```json
{
  "aiGeneration": {
    "canGenerate": true,
    "remaining": null,
    "limit": null
  }
}
```

#### Step 3: 여러 번 생성 (모두 성공)
```bash
for i in {1..30}; do
  curl -X POST http://localhost:3000/api/test/subscription \
    -H "Content-Type: application/json" \
    -d '{"problemsGenerated": 10}'
  echo "\n--- $i번째 생성 완료 ---"
done
```

**기대 결과:**
- ✅ 모두 성공
- 제한 없음

---

### Phase 6: Teacher 플랜 - 학생 관리 제한 테스트

#### Step 1: teacher_pro로 업그레이드
```sql
UPDATE subscriptions
SET
  plan_type = 'teacher_pro',
  limits = '{
    "ai_generations_per_week": null,
    "ai_generations_per_month": 20,
    "max_students": 30,
    "speaking_quizzes_per_month": 400,
    "ai_model": "gpt-4o-mini"
  }'::jsonb
WHERE user_id = 'YOUR_USER_ID';
```

#### Step 2: 학생 관리 제한 확인
```bash
curl http://localhost:3000/api/test/subscription
```

**기대 결과:**
```json
{
  "studentManagement": {
    "canAddStudent": true,
    "remaining": 30,
    "limit": 30,
    "currentCount": 0
  }
}
```

---

### Phase 7: 기간 리셋 테스트

#### Step 1: 과거 사용량 생성
```sql
-- 지난주 사용량으로 변경
UPDATE user_ai_usage
SET
  period_start = (CURRENT_DATE - INTERVAL '8 days')::DATE,
  period_end = (CURRENT_DATE - INTERVAL '2 days')::DATE
WHERE user_id = 'YOUR_USER_ID'
  AND usage_type = 'quiz_generation';
```

#### Step 2: 리셋 확인
```bash
curl http://localhost:3000/api/test/subscription
```

**기대 결과:**
- 새로운 주간 기간으로 리셋됨
- `canGenerate: true` (무료 플랜이면 `remaining: 1`)

---

## ✅ 체크리스트

### 기본 기능
- [ ] GET /api/test/subscription - 구독 정보 조회 성공
- [ ] subscriptions, user_ai_usage 테이블 존재 확인

### 무료 플랜 (Free)
- [ ] 주 1회 AI 생성 제한 작동
- [ ] 제한 초과 시 403 에러
- [ ] Speaking 월 4회 제한
- [ ] 학생 관리 불가

### 프로 플랜 (Student Pro / Teacher Pro)
- [ ] 월 20회 AI 생성 제한 작동
- [ ] 20회 초과 시 403 에러
- [ ] Teacher Pro: 학생 30명 제한 확인

### 프리미엄 플랜 (Student Premium / Teacher Premium)
- [ ] AI 생성 무제한
- [ ] Speaking 무제한
- [ ] Teacher Premium: 학생 무제한

### 기간 리셋
- [ ] 주간 리셋 작동 (월요일 00:00)
- [ ] 월간 리셋 작동 (1일 00:00)

---

## 🚀 테스트 완료 후

모든 테스트가 통과하면:
1. `SUBSCRIPTION_TEST_RESULTS.md` 작성
2. `DEVELOPMENT_ROADMAP.md`의 Week 1 Day 4 체크박스 완료 표시
3. Week 2 AI 커스텀 모드로 진행 준비 완료!

---

## 💡 문제 해결

### 401 에러 (인증 필요)
- 브라우저에서 로그인했는지 확인
- 쿠키가 정상적으로 설정되었는지 확인

### 404 에러 (구독 정보 없음)
- Supabase SQL Editor에서 마이그레이션 수동 실행:
```sql
-- 20250116000001_create_subscription_tables.sql 내용 복사해서 실행
```

### 500 에러
- 서버 콘솔 로그 확인
- Supabase 연결 상태 확인
- DB 테이블 권한 (RLS 정책) 확인
