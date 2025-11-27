# AI 통합 테스트 가이드

**Week 2 Day 1: OpenAI API 통합 및 테스트**

## 📋 목차

1. [설정 방법](#설정-방법)
2. [테스트 실행](#테스트-실행)
3. [예상 결과](#예상-결과)
4. [문제 해결](#문제-해결)
5. [API 키 관리](#api-키-관리)
6. [비용 모니터링](#비용-모니터링)

---

## 설정 방법

### 1. OpenAI API 키 발급

1. https://platform.openai.com/api-keys 접속
2. 로그인 후 "Create new secret key" 클릭
3. API 키 복사 (한 번만 표시됨)

### 2. 환경 변수 설정

`.env.local` 파일에 API 키 추가:

```env
OPENAI_API_KEY=sk-proj-...your-api-key-here...
```

### 3. 개발 서버 재시작

```bash
npm run dev
```

---

## 테스트 실행

### 방법 1: 브라우저 UI 테스트

1. 브라우저에서 접속:
   ```
   http://localhost:3000/test/ai
   ```

2. 로그인 필요 (인증된 사용자만 테스트 가능)

3. **기본 테스트** 버튼 클릭:
   - 텍스트 생성 테스트 (한영 번역)
   - JSON 생성 테스트 (퀴즈 문제)
   - 비용 추정 확인

4. **커스텀 테스트** 섹션:
   - 원하는 프롬프트 입력
   - 모델 선택 (gpt-4o-mini / gpt-4o)
   - JSON 모드 선택 (옵션)
   - 실행

### 방법 2: API 직접 호출

#### 기본 테스트 (GET)

```bash
curl http://localhost:3000/api/ai/test
```

#### 커스텀 테스트 (POST)

```bash
curl -X POST http://localhost:3000/api/ai/test \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "안녕하세요를 영어로 번역해주세요.",
    "model": "gpt-4o-mini",
    "expectJson": false
  }'
```

---

## 예상 결과

### ✅ 성공 케이스

#### 1. 기본 테스트 (GET)

**응답 구조:**
```json
{
  "success": true,
  "data": {
    "simpleTest": {
      "prompt": "안녕하세요를 영어로 번역해주세요. 짧게 답변해주세요.",
      "response": "Hello"
    },
    "jsonTest": {
      "prompt": "한국어 문제 생성 테스트",
      "response": {
        "question": "'안녕하세요'의 의미는?",
        "options": ["Hello", "Goodbye", "Thank you", "Sorry"],
        "correctAnswer": "Hello",
        "explanation": "'안녕하세요'는 한국어로 인사할 때 사용하는 표현입니다."
      }
    },
    "costEstimate": {
      "tokens": 500,
      "model": "gpt-4o-mini",
      "estimatedCost": "$0.000075"
    },
    "message": "OpenAI API 연결 및 기본 기능 테스트 성공!"
  }
}
```

**확인 사항:**
- ✅ `success: true`
- ✅ 텍스트 응답이 자연스러운 영어/한국어
- ✅ JSON이 올바른 퀴즈 구조
- ✅ 비용이 합리적 범위 (< $0.01)

#### 2. 커스텀 테스트 (POST)

**텍스트 모드:**
```json
{
  "success": true,
  "data": {
    "prompt": "감사합니다를 영어로",
    "model": "gpt-4o-mini",
    "response": "Thank you",
    "timestamp": "2025-01-17T12:34:56.789Z"
  }
}
```

**JSON 모드:**
```json
{
  "success": true,
  "data": {
    "prompt": "안녕하세요로 문제 만들기",
    "model": "gpt-4o-mini",
    "response": {
      "question": "빈칸에 들어갈 말은? _____! 만나서 반갑습니다.",
      "options": ["안녕하세요", "안녕히 가세요", "감사합니다", "죄송합니다"],
      "correctAnswer": "안녕하세요",
      "explanation": "처음 만났을 때 하는 인사는 '안녕하세요'입니다."
    },
    "timestamp": "2025-01-17T12:35:00.123Z"
  }
}
```

### ❌ 실패 케이스

#### 1. API 키 없음

```json
{
  "error": "OpenAI API 키가 설정되지 않았습니다.",
  "message": ".env.local 파일에 OPENAI_API_KEY를 추가해주세요.",
  "guide": "https://platform.openai.com/api-keys 에서 API 키를 발급받을 수 있습니다."
}
```

**해결:** [API 키 관리](#api-키-관리) 참고

#### 2. 인증 필요

```json
{
  "error": "인증이 필요합니다."
}
```

**해결:** 로그인 후 다시 시도

#### 3. 프롬프트 없음 (POST)

```json
{
  "error": "prompt가 필요합니다."
}
```

**해결:** 요청 body에 `prompt` 필드 추가

---

## 문제 해결

### 문제 1: "OPENAI_API_KEY가 설정되지 않았습니다"

**원인:**
- `.env.local` 파일이 없음
- API 키가 비어있음
- 환경 변수가 로드되지 않음

**해결:**
1. `.env.local` 파일 확인
2. API 키가 올바르게 입력되었는지 확인
3. 개발 서버 재시작:
   ```bash
   # Ctrl+C로 서버 종료 후
   npm run dev
   ```

### 문제 2: "인증이 필요합니다"

**원인:**
- 로그인하지 않음
- 세션 만료

**해결:**
1. http://localhost:3000 에서 로그인
2. 다시 테스트 페이지 접속

### 문제 3: Rate Limit 오류

**원인:**
- OpenAI API 요청 제한 초과
- 무료 계정의 경우 분당 3회 제한

**해결:**
1. 잠시 대기 (1분)
2. 유료 플랜 고려
3. 요청 간 간격 두기

### 문제 4: JSON 파싱 오류

**원인:**
- AI가 잘못된 JSON 생성
- 프롬프트가 불명확

**해결:**
1. 더 명확한 프롬프트 작성:
   ```
   다음 형식의 JSON을 생성해주세요:
   {
     "question": "질문",
     "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
     "correctAnswer": "정답",
     "explanation": "해설"
   }
   ```
2. JSON 모드 체크박스 활성화
3. 시스템 프롬프트 개선

### 문제 5: 응답이 너무 느림

**원인:**
- gpt-4o 모델 사용 (느리지만 정확)
- 긴 프롬프트
- OpenAI 서버 부하

**해결:**
1. gpt-4o-mini 사용 (10배 빠름)
2. 프롬프트 간결화
3. `max_tokens` 제한 추가

---

## API 키 관리

### 보안 주의사항

⚠️ **절대 금지:**
- API 키를 Git에 커밋하지 말 것
- 브라우저 클라이언트에서 직접 사용하지 말 것
- 공개 저장소에 올리지 말 것

✅ **권장 사항:**
- `.env.local` 파일 사용 (Git 무시됨)
- 서버 사이드에서만 사용
- API 키 정기적으로 재발급
- 사용량 모니터링 설정

### API 키 재발급

1. https://platform.openai.com/api-keys 접속
2. 기존 키 "Revoke" (취소)
3. 새 키 발급
4. `.env.local` 업데이트
5. 서버 재시작

---

## 비용 모니터링

### 모델별 비용 (2025년 1월 기준)

| 모델 | Input (1M tokens) | Output (1M tokens) | 권장 용도 |
|------|-------------------|-------------------|-----------|
| gpt-4o-mini | $0.150 | $0.600 | 대부분의 퀴즈 생성 |
| gpt-4o | $2.50 | $10.00 | 고급/복잡한 생성 |

### 예상 비용 계산

**퀴즈 1개 생성 (평균):**
- 프롬프트: ~200 tokens
- 응답: ~300 tokens
- **gpt-4o-mini:** ~$0.0003 (0.03원)
- **gpt-4o:** ~$0.0035 (3.5원)

**월간 예상 비용:**
- 무료 플랜 (주간 1회): ~$0.001/월
- 학생 Pro (월간 20회): ~$0.006/월
- 선생님 Pro (월간 50회): ~$0.015/월
- 프리미엄 (무제한): 사용량에 따라 다름

### 비용 확인 방법

1. OpenAI Dashboard 접속:
   https://platform.openai.com/usage

2. 사용량 확인:
   - 일별/월별 통계
   - 모델별 사용량
   - 총 비용

3. 알림 설정:
   - Settings > Limits
   - 월간 한도 설정
   - 이메일 알림 활성화

---

## 테스트 체크리스트

### 필수 테스트

- [ ] 기본 연결 테스트 성공
- [ ] 텍스트 생성 응답이 자연스러움
- [ ] JSON 생성이 올바른 구조
- [ ] 비용 추정이 합리적 범위
- [ ] 인증이 제대로 작동
- [ ] 오류 메시지가 명확함

### 선택 테스트

- [ ] gpt-4o-mini와 gpt-4o 비교
- [ ] 한국어 특수문자 처리
- [ ] 긴 프롬프트 (1000자+)
- [ ] 동시 요청 처리
- [ ] 다양한 퀴즈 유형 생성

---

## 다음 단계

테스트가 성공적으로 완료되면:

1. ✅ Week 2 Day 1 완료 표시
2. Week 2 Day 2 진행: 커스텀 모드 UI 개발
3. 실제 퀴즈 생성 로직 구현
4. 사용량 추적 연동

---

## 참고 자료

- [OpenAI API 문서](https://platform.openai.com/docs)
- [GPT-4o 가격](https://openai.com/api/pricing/)
- [Rate Limits](https://platform.openai.com/docs/guides/rate-limits)
- [Best Practices](https://platform.openai.com/docs/guides/production-best-practices)

---

**작성일:** 2025-01-17
**버전:** Week 2 Day 1
**문의:** 테스트 중 문제가 발생하면 이 가이드를 먼저 확인하세요.
