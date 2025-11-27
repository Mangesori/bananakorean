바나나 코리안 - 최종 완성 계획서
🌍 프로젝트 개요
타겟
지역: 전 세계
주요 사용자: 외국인을 가르치는 한국인 한국어 선생님
부차 사용자: 외국인 선생님, 개인 학습자
학습자: 전 세계 한국어 학습자
핵심 차별점
대화 기반 맥락 학습: 모든 문제가 대화 형식
AI 맞춤 문제 생성: 선생님이 단어/문법 선택 → AI가 즉시 생성
선생님-학생 플랫폼: 숙제 부여, 진도 관리, 자동 채점
💳 구독 플랜 (최종 확정)
무료 (Free) - $0
✅ 기존 문제 무제한 풀기
✅ Matching 퀴즈 (기존 단어만)
✅ 진도 추적, 약점 분석, 성취 배지
✅ AI 생성 (주 1회)
   - 간단/커스텀 모드 합쳐서 주 1회
   - 1회당 최대 100개 문제 (Speaking 제외)
❌ Speaking 퀴즈
❌ 숙제 부여 기능 (선생님)
❌ 학생 관리

역할: 선생님/학생 동일
학생 프로 (Student Pro) - $9.99/월
✅ 무료 모든 기능
✅ AI 생성 (월 20회)
   - 간단 + 커스텀 합쳐서 20회
   - 1회당 최대 100개 문제
✅ Speaking 퀴즈
   - 간단 모드: 무제한 (사전 생성 문제)
   - 커스텀 모드: 최대 400개/월 (20회×20개)
   - AI: GPT-4o mini
✅ 7일 무료 체험 (카드 등록 불필요)
❌ 숙제 부여 불가
❌ 학생 관리 불가

대상: 개인 학습자
선생님 프로 (Teacher Pro) - $14.99/월
✅ 학생 프로 모든 기능
✅ AI 생성 (월 20회)
✅ Speaking 퀴즈 (월 400개)
✅ 학생 관리 (최대 30명)
✅ 숙제 만들기 & 부여
   - 간단 모드
   - 커스텀 모드
✅ 학생 진도 모니터링
✅ 자동 채점
✅ 7일 무료 체험

대상: 개인 과외 선생님, 소규모 학원
학생 프리미엄 (Student Premium) - $19.99/월
✅ 학생 프로 모든 기능
✅ AI 생성 무제한
✅ Speaking 퀴즈 무제한 (GPT-4o 고품질)
✅ 우선 지원
❌ 학생 관리 불가

대상: 헤비 유저 학습자
선생님 프리미엄 (Teacher Premium) - $29.99/월
✅ 선생님 프로 모든 기능
✅ AI 생성 무제한
✅ Speaking 무제한 (GPT-4o 고품질)
✅ 학생 무제한 관리
✅ 우선 지원 (24시간 이내 응답)
✅ 고급 분석 리포트

대상: 대형 학원, 온라인 강사
🎮 퀴즈 타입 (6가지)
기존 퀴즈 (4개)
Multiple Choice (객관식)
Dialogue Drag & Drop (대화 드래그)
Fill in the Blank (빈칸 채우기)
Matching (단어 매칭)
신규 퀴즈 (2개)
5. Sentence Drag & Drop (문장 드래그)
유지 (나중을 위해)
6. Speaking (발음 퀴즈) - 3가지 타입
Type 1: 대화를 보고 따라 읽기
지문: "질문을 따라 읽으세요" 또는 "대답을 따라 읽으세요"
화면: Q: "어제 어디에 갔어요?" 
      A: "저는 어제 도서관에 갔어요."
사용자: 🎤 녹음
평가: Whisper API로 텍스트 변환 → 정답 비교 (O/X)
Type 2: 듣고 따라 말하기
지문: "오디오를 듣고 따라 하세요"
화면: 🔊 오디오 재생 (대화 숨김)
      "질문을 따라 하세요" 또는 "대답을 따라 하세요"
사용자: 🎤 녹음
평가: Whisper API로 텍스트 변환 → 정답 비교
Type 3: 단어를 보고 문장 만들기
지문: "제시된 단어로 문장을 만드세요"
화면: Q: "어제 어디에 갔어요?"
      단어: "도서관"
      
또는
      Q: "어디"
      A: "저는 어제 도서관에 갔어요."
      
사용자: 🎤 녹음
평가: Whisper API로 텍스트 변환 → 의미 비교 (유사도 80%)
TTS (Text-to-Speech):
Type 2에서 오디오 재생용
OpenAI TTS API 사용 (tts-1 모델)
비용: $15 per 1M characters (~$0.000015/문장)
🤖 AI 시스템 설계
AI 모델 전략
GPT-4o mini (주력)
용도: 모든 기본 문제 생성 (95%)
비용: $0.15/$0.60 per 1M tokens
Speaking: 학생/선생님 프로
품질: 우수 (학습용 충분)
GPT-4o (프리미엄)
용도: Speaking 고품질 대화 (5%)
비용: $3/$10 per 1M tokens
Speaking: 프리미엄 전용
품질: 최고 (원어민 수준)
Claude Haiku 4.5 (백업)
용도: GPT 실패 시 Fallback
비용: $1/$5 per 1M tokens
Speaking 문제 사전 생성
개수:
현재: 31개 문법 × 30개 = 930개
각 문법당 3가지 타입 × 10개씩
타입별 분배 (문법당):
Type 1 (따라 읽기): 10개
Type 2 (듣고 따라 하기): 10개
Type 3 (단어로 문장 만들기): 10개
TTS 오디오 생성:
Type 2용 오디오 미리 생성
31 문법 × 10개 × 2개(Q+A) = 620개 오디오
비용: 620 × $0.000015 = ~$0.01 (무시 가능)
초기 생성 비용:
930개 × $0.00026 = $0.24 (1회성)
데이터베이스:
CREATE TABLE pre_generated_speaking_problems (
  id UUID PRIMARY KEY,
  grammar_name VARCHAR(100),
  speaking_type VARCHAR(20), -- 'read_aloud', 'listen_repeat', 'word_prompt'
  question TEXT,
  answer TEXT,
  prompt_word TEXT, -- Type 3용 단어
  question_translation TEXT,
  answer_translation TEXT,
  audio_url TEXT, -- Type 2용 TTS 오디오
  difficulty_level INTEGER,
  created_at TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_speaking_grammar ON pre_generated_speaking_problems(grammar_name);
CREATE INDEX idx_speaking_type ON pre_generated_speaking_problems(speaking_type);
📚 간단 모드 (Simple Mode)
UI Flow
1. 레벨/문법 선택
┌─────────────────────────────────────┐
│ 간단 모드 - 연습하기                  │
│                                     │
│ 어디까지 공부하셨나요?                │
│                                     │
│ ○ A1: Beginner ▼                    │
│   ├─ □ 은/는, 이에요/예요            │
│   ├─ □ 이거, 그거, 저거              │
│   ...                               │
│   └─ ● 았어요/었어요 ✓               │
│                                     │
│ ○ A2: Elementary ▼ (추후 추가)      │
│ ○ B1~C2 (추후 추가)                 │
│                                     │
│ [기본 설정으로 생성하기]              │
│ [⚙️ 고급 설정]                       │
└─────────────────────────────────────┘
2. 기본 설정 (자동)
선택한 문법까지 각 타입 10개씩 자동 생성
Speaking 10개 (3가지 타입 골고루)
총 50개 문제
3. 고급 설정 (사용자 선택)
┌─────────────────────────────────────┐
│ 퀴즈 개수를 선택하세요 (각 최대 20개) │
│                                     │
│ Matching:           [10] 개         │
│ Multiple Choice:    [10] 개         │
│ Dialogue Drag&Drop: [10] 개         │
│ Fill-in-blank:      [10] 개         │
│ Speaking:           [10] 개         │
│                                     │
│ [생성하기]                           │
└─────────────────────────────────────┘
스마트 문제 선택 알고리즘
// 간단 모드 문제 선택
async function selectProblemsForSimpleMode(
  grammarEnd: string,
  quizCounts: QuizCounts
) {
  // 1. 선택한 문법까지의 리스트
  const grammarList = getGrammarsUpTo(grammarEnd);
  // ['introduction', 'demonstratives', ..., 'past-tense']
  
  // 2. AI로 가중치 계산 (캐싱)
  const cacheKey = `weights_${grammarList.join('_')}`;
  let weights = cache.get(cacheKey);
  
  if (!weights) {
    weights = await calculateGrammarWeights(grammarList);
    // { introduction: 5, demonstratives: 8, ..., past-tense: 30 }
    cache.set(cacheKey, weights, { ttl: 86400 }); // 24시간
  }
  
  // 3. 각 퀴즈 타입별 문제 선택
  const selectedProblems = {};
  
  for (const [quizType, count] of Object.entries(quizCounts)) {
    const problems = [];
    
    for (const grammar of grammarList) {
      const problemCount = Math.ceil(count * weights[grammar] / 100);
      
      // 기존 문제에서 랜덤 선택
      if (quizType === 'speaking') {
        const available = await getPreGeneratedSpeaking(grammar);
        problems.push(...shuffle(available).slice(0, problemCount));
      } else {
        const available = await getExistingProblems(grammar, quizType);
        problems.push(...shuffle(available).slice(0, problemCount));
      }
    }
    
    selectedProblems[quizType] = shuffle(problems).slice(0, count);
  }
  
  return selectedProblems;
}

// AI 가중치 계산 (GPT-4o mini)
async function calculateGrammarWeights(grammarList: string[]) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: `한국어 문법 순서: ${grammarList.join(' → ')}
      
복습 문제 분배 비율을 계산해주세요.
- 최근 문법일수록 높은 비율 (어려움, 더 많은 연습 필요)
- 초반 문법은 낮은 비율 (쉬움, 복습용)
- 총합 100%

JSON 형식: {"introduction": 5, "demonstratives": 8, ...}`
    }],
    response_format: { type: 'json_object' }
  });
  
  return JSON.parse(response.choices[0].message.content);
}
🎨 커스텀 모드 (Custom Mode)
UI Flow (4단계)
Step 1: 어휘 추가
┌─────────────────────────────────────┐
│ 커스텀 모드 - 1/4                    │
│                                     │
│ 어휘를 추가하세요 (한국어만 입력)      │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 길을 잃어버리다, 잠이 오다,       │ │
│ │ 잠을 못 자다, 앉다, 늦다          │ │
│ │                                 │ │
│ │ * 단어, 표현, 관용구 모두 입력    │ │
│ │ * AI가 자동으로 영어 번역 생성    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [다음]                              │
└─────────────────────────────────────┘
Step 2: 문법 선택 (체크박스)
┌─────────────────────────────────────┐
│ 커스텀 모드 - 2/4                    │
│                                     │
│ 사용할 문법을 선택하세요              │
│                                     │
│ A1: Beginner ▼                      │
│   ☑ 은/는, 이에요/예요               │
│   ☐ 이거, 그거, 저거                │
│   ☑ 이/가 아니에요                  │
│   ...                               │
│   ☑ 았어요/었어요                   │
│                                     │
│ A2: Elementary ▼ (추후 추가)        │
│                                     │
│ * 순서는 유지되지만 선택은 자유롭게   │
│                                     │
│ [이전] [다음]                        │
└─────────────────────────────────────┘
Step 3: 퀴즈 타입 및 개수
┌─────────────────────────────────────┐
│ 커스텀 모드 - 3/4                    │
│                                     │
│ 퀴즈 개수를 선택하세요 (각 최대 20개) │
│                                     │
│ Matching:           [5] 개          │
│ Multiple Choice:    [10] 개         │
│ Dialogue Drag&Drop: [10] 개         │
│ Fill-in-blank:      [5] 개          │
│ Speaking:           [10] 개 🔒      │
│                                     │
│ 총 AI 생성 문제: 40개                │
│ (남은 생성 횟수: 무료 주0회/프로 월17회)│
│                                     │
│ [이전] [AI 생성하기]                 │
└─────────────────────────────────────┘
Step 4: 미리보기 및 수정
┌─────────────────────────────────────┐
│ 커스텀 모드 - 4/4                    │
│                                     │
│ 생성된 문제 미리보기                  │
│                                     │
│ ┌─ Multiple Choice #1 ────────────┐ │
│ │ Q: 어제 왜 회사에 늦었어요?       │ │
│ │ A: 미안해요. 잠을 못 잤어요.      │ │
│ │ ...                             │ │
│ │ [🔄 다시 생성] [✏️ 수정]         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ... (40개 문제)                     │
│                                     │
│ [전체 다시 생성] [이전] [완료]        │
└─────────────────────────────────────┘
AI 생성 로직
async function generateCustomProblems(
  vocabulary: string[],
  grammars: string[],
  quizCounts: QuizCounts,
  userTier: 'free' | 'pro' | 'premium'
) {
  // 1. 사용량 체크
  const usage = await checkAIGenerationLimit(userId);
  if (!usage.allowed) {
    throw new Error('AI 생성 횟수 초과');
  }
  
  // 2. 어휘 번역 생성 (Matching용)
  const translatedVocab = await translateVocabulary(vocabulary);
  // { "길을 잃어버리다": "to get lost", ... }
  
  // 3. 각 퀴즈 타입별 문제 생성
  const problems = {};
  
  for (const [quizType, count] of Object.entries(quizCounts)) {
    if (count === 0) continue;
    
    const model = (userTier === 'premium' && quizType === 'speaking') 
      ? 'gpt-4o' 
      : 'gpt-4o-mini';
    
    problems[quizType] = await generateQuizProblems({
      type: quizType,
      vocabulary,
      grammars,
      count,
      model
    });
  }
  
  // 4. 사용량 기록
  await trackAIUsage(userId, 1); // 1회 생성
  
  return problems;
}

// 개별 문제 재생성
async function regenerateSingleProblem(
  problemId: string,
  context: GenerationContext
) {
  const problem = await generateQuizProblems({
    ...context,
    count: 1
  });
  
  return problem[0];
}

// 수동 편집
async function editProblem(problemId: string, updates: Partial<Problem>) {
  return await updateProblem(problemId, updates);
}
👥 선생님-학생 플랫폼
학생 초대 시스템
방법 1: 이메일 초대
async function inviteStudentByEmail(
  teacherId: string,
  studentEmail: string
) {
  // 1. 학생 수 제한 확인
  const limit = await checkStudentManagementLimit(teacherId);
  if (!limit.allowed) {
    throw new Error(`학생 제한 초과 (${limit.current}/${limit.max}명)`);
  }
  
  // 2. 초대 생성
  const invitation = await createInvitation({
    teacher_id: teacherId,
    student_email: studentEmail,
    expires_at: addDays(new Date(), 7) // 7일 유효
  });
  
  // 3. 이메일 발송
  await sendEmail({
    to: studentEmail,
    subject: '바나나 코리안 초대장',
    template: 'teacher_invitation',
    data: {
      teacherName: await getTeacherName(teacherId),
      invitationLink: `${BASE_URL}/accept-invitation/${invitation.id}`
    }
  });
  
  return invitation;
}

// 학생이 초대 수락
async function acceptInvitation(invitationId: string, studentId: string) {
  const invitation = await getInvitation(invitationId);
  
  // 검증
  if (invitation.expires_at < new Date()) {
    throw new Error('초대가 만료되었습니다');
  }
  
  // 관계 생성
  await createTeacherStudentRelation({
    teacher_id: invitation.teacher_id,
    student_id: studentId,
    status: 'active'
  });
  
  // 초대 삭제
  await deleteInvitation(invitationId);
}
방법 2: 초대 코드
async function generateInvitationCode(teacherId: string) {
  const code = generateRandomCode(8); // "ABC12345"
  
  await createInvitationCode({
    teacher_id: teacherId,
    code,
    expires_at: addDays(new Date(), 30), // 30일 유효
    max_uses: 30 // 최대 30명
  });
  
  return code;
}

// 학생이 가입 시 코드 입력
async function joinByInvitationCode(code: string, studentId: string) {
  const invitation = await getInvitationByCode(code);
  
  if (!invitation || invitation.expires_at < new Date()) {
    throw new Error('유효하지 않은 초대 코드입니다');
  }
  
  if (invitation.used_count >= invitation.max_uses) {
    throw new Error('초대 코드 사용 횟수가 초과되었습니다');
  }
  
  await createTeacherStudentRelation({
    teacher_id: invitation.teacher_id,
    student_id: studentId,
    status: 'active'
  });
  
  await incrementCodeUsage(invitation.id);
}
학생 제한
규칙:
학생은 1명의 선생님만 가질 수 있음
선생님을 바꾸려면 기존 관계 종료 필요
async function checkStudentTeacher(studentId: string) {
  const relation = await getActiveTeacherRelation(studentId);
  
  if (relation) {
    return {
      hasTeacher: true,
      teacherId: relation.teacher_id,
      teacherName: await getTeacherName(relation.teacher_id)
    };
  }
  
  return { hasTeacher: false };
}

// 관계 종료
async function leaveTeacher(studentId: string, teacherId: string) {
  await updateTeacherStudentRelation({
    teacher_id: teacherId,
    student_id: studentId,
    status: 'inactive'
  });
}
📝 숙제 시스템
숙제 생성 Flow
선생님 → 학생 숙제 부여:
async function createAndAssignHomework(
  teacherId: string,
  students: string[],
  homework: HomeworkData
) {
  // 1. 숙제 생성 (간단/커스텀 모드)
  const assignment = await createAssignment({
    teacher_id: teacherId,
    title: homework.title,
    description: homework.description,
    assignment_type: homework.type, // 'simple' or 'custom'
    
    // Simple mode
    selected_level: homework.level,
    selected_grammar_end: homework.grammarEnd,
    
    // Custom mode
    custom_vocabulary: homework.vocabulary,
    selected_grammars: homework.grammars,
    
    quiz_type_counts: homework.quizCounts,
    due_date: homework.dueDate
  });
  
  // 2. 문제 생성 (간단 모드는 기존 문제, 커스텀은 AI)
  let problems;
  if (homework.type === 'simple') {
    problems = await selectProblemsForSimpleMode(
      homework.grammarEnd,
      homework.quizCounts
    );
  } else {
    problems = await generateCustomProblems(
      homework.vocabulary,
      homework.grammars,
      homework.quizCounts,
      await getUserTier(teacherId)
    );
  }
  
  // 3. 문제 저장
  await saveAssignmentProblems(assignment.id, problems);
  
  // 4. 학생들에게 부여
  for (const studentId of students) {
    await createStudentAssignment({
      assignment_id: assignment.id,
      student_id: studentId,
      assigned_at: new Date()
    });
    
    // 알림 전송
    await sendNotification(studentId, {
      type: 'new_homework',
      title: '새 숙제가 도착했어요!',
      message: `${homework.title} - 마감: ${format(homework.dueDate)}`
    });
  }
  
  return assignment;
}
숙제 제출 및 채점
// 학생이 숙제 시작
async function startHomework(studentAssignmentId: string) {
  await updateStudentAssignment(studentAssignmentId, {
    started_at: new Date(),
    status: 'in_progress'
  });
}

// 학생이 문제 풀이
async function submitAnswer(
  studentAssignmentId: string,
  problemId: string,
  userAnswer: string
) {
  const problem = await getAssignmentProblem(problemId);
  const isCorrect = checkAnswer(problem, userAnswer);
  
  // 시도 기록
  await createAttempt({
    student_assignment_id: studentAssignmentId,
    problem_id: problemId,
    user_answer: userAnswer,
    is_correct: isCorrect,
    time_spent: getTimeSpent()
  });
  
  return { isCorrect };
}

// 숙제 제출 (자동 채점)
async function submitHomework(studentAssignmentId: string) {
  const attempts = await getAttempts(studentAssignmentId);
  
  const score = attempts.filter(a => a.is_correct).length;
  const total = attempts.length;
  
  await updateStudentAssignment(studentAssignmentId, {
    completed_at: new Date(),
    status: 'completed',
    score,
    total_questions: total
  });
  
  // 선생님에게 알림
  const assignment = await getStudentAssignment(studentAssignmentId);
  await sendNotification(assignment.teacher_id, {
    type: 'homework_completed',
    message: `${await getStudentName(assignment.student_id)}님이 숙제를 제출했습니다. (점수: ${score}/${total})`
  });
  
  return { score, total };
}
숙제 재시도
// 재시도 (점수 갱신 안 됨)
async function retryHomework(studentAssignmentId: string) {
  const assignment = await getStudentAssignment(studentAssignmentId);
  
  if (assignment.status !== 'completed') {
    throw new Error('아직 제출하지 않은 숙제입니다');
  }
  
  // 새 시도 세션 생성
  const retrySession = await createRetrySession({
    student_assignment_id: studentAssignmentId,
    attempted_at: new Date()
  });
  
  return retrySession;
}

// 재시도 시 기록은 남지만 점수는 변경 안 됨
async function submitRetryAnswer(
  retrySessionId: string,
  problemId: string,
  userAnswer: string
) {
  const problem = await getAssignmentProblem(problemId);
  const isCorrect = checkAnswer(problem, userAnswer);
  
  await createRetryAttempt({
    retry_session_id: retrySessionId,
    problem_id: problemId,
    user_answer: userAnswer,
    is_correct: isCorrect
  });
  
  return { isCorrect };
}
마감일 및 연장
// 마감일 체크
async function canSubmitHomework(studentAssignmentId: string) {
  const assignment = await getStudentAssignment(studentAssignmentId);
  const homework = await getAssignment(assignment.assignment_id);
  
  if (new Date() > homework.due_date) {
    return {
      allowed: false,
      message: '마감일이 지났습니다'
    };
  }
  
  return { allowed: true };
}

// 선생님이 마감일 연장
async function extendDueDate(
  assignmentId: string,
  newDueDate: Date
) {
  await updateAssignment(assignmentId, {
    due_date: newDueDate
  });
  
  // 학생들에게 알림
  const students = await getAssignedStudents(assignmentId);
  for (const student of students) {
    await sendNotification(student.id, {
      type: 'due_date_extended',
      message: `마감일이 ${format(newDueDate)}로 연장되었습니다`
    });
  }
}
📱 PWA (Progressive Web App)
설정
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({
  // ... 기존 설정
});
// public/manifest.json
{
  "name": "Banana Korean",
  "short_name": "BananaKR",
  "description": "AI-powered Korean learning platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#FFC107",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
오프라인 지원
// Service Worker로 문제 캐싱
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/problems/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open('problems-cache').then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});

// 오프라인 시 로컬 DB에 답안 저장
async function submitAnswerOffline(problemId: string, answer: string) {
  await localDB.pendingAnswers.add({
    problemId,
    answer,
    timestamp: new Date(),
    synced: false
  });
}

// 온라인 복귀 시 동기화
window.addEventListener('online', async () => {
  const pending = await localDB.pendingAnswers.where('synced').equals(false).toArray();
  
  for (const answer of pending) {
    await submitAnswer(answer.problemId, answer.answer);
    await localDB.pendingAnswers.update(answer.id, { synced: true });
  }
});
💰 결제 시스템
Stripe (국제 결제)
// 체크아웃 세션 생성
async function createStripeCheckout(
  userId: string,
  plan: 'student_pro' | 'teacher_pro' | 'student_premium' | 'teacher_premium',
  trial: boolean = true
) {
  const priceId = STRIPE_PRICES[plan];
  
  const session = await stripe.checkout.sessions.create({
    customer_email: await getUserEmail(userId),
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    
    // 7일 무료 체험
    ...(trial && {
      subscription_data: {
        trial_period_days: 7
      }
    }),
    
    success_url: `${BASE_URL}/subscription/success`,
    cancel_url: `${BASE_URL}/subscription/cancel`,
    metadata: { user_id: userId, plan }
  });
  
  return session.url;
}

// Webhook 처리
async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const { user_id, plan } = session.metadata;
      
      await createSubscription(user_id, plan, {
        stripe_subscription_id: session.subscription,
        stripe_customer_id: session.customer,
        trial_end: addDays(new Date(), 7)
      });
      break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await cancelSubscription(subscription.metadata.user_id);
      break;
    }
  }
}
Toss Payments (한국 결제)
// Toss 결제 요청
async function createTossPayment(
  userId: string,
  plan: string,
  trial: boolean = true
) {
  const amount = PLAN_PRICES[plan];
  
  const payment = await tossPayments.requestPayment('카드', {
    amount: trial ? 0 : amount, // 체험은 0원
    orderId: generateOrderId(),
    orderName: `바나나 코리안 ${plan}`,
    customerEmail: await getUserEmail(userId),
    successUrl: `${BASE_URL}/payment/success`,
    failUrl: `${BASE_URL}/payment/fail`,
    metadata: { user_id: userId, plan, trial }
  });
  
  return payment;
}

// 정기 결제 (빌링키)
async function setupRecurringPayment(userId: string, billingKey: string) {
  await saveBillingKey(userId, billingKey);
  
  // 매월 1일 자동 결제
  scheduleMonthlyPayment(userId);
}
환불 처리
// 7일 이내 전액 환불
async function requestRefund(userId: string) {
  const subscription = await getSubscription(userId);
  
  const daysSinceStart = differenceInDays(
    new Date(),
    subscription.created_at
  );
  
  if (daysSinceStart > 7) {
    throw new Error('환불 가능 기간(7일)이 지났습니다');
  }
  
  // Stripe 환불
  if (subscription.stripe_subscription_id) {
    await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
    await stripe.refunds.create({
      payment_intent: subscription.stripe_payment_intent_id
    });
  }
  
  // Toss 환불
  if (subscription.toss_payment_key) {
    await tossPayments.cancelPayment(subscription.toss_payment_key, {
      cancelReason: '고객 요청'
    });
  }
  
  await updateSubscription(userId, {
    status: 'refunded',
    tier: 'free'
  });
}
📊 데이터베이스 스키마 (완전판)
-- 1. 프로필 (역할 추가)
ALTER TABLE profiles ADD COLUMN user_role VARCHAR(20) NOT NULL;
-- 'student' or 'teacher'

-- 2. 구독 (역할별 분리)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  tier VARCHAR(30), -- 'free', 'student_pro', 'teacher_pro', 'student_premium', 'teacher_premium'
  
  -- Stripe
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  
  -- Toss Payments
  toss_billing_key VARCHAR(255),
  toss_customer_key VARCHAR(255),
  
  -- Limits
  max_students INTEGER, -- NULL=관리 불가, 0=프리, 30=프로, NULL=프리미엄 무제한
  monthly_ai_generations INTEGER, -- NULL=무료, 20=프로, NULL=프리미엄
  weekly_ai_generations INTEGER, -- 1=무료, NULL=기타
  speaking_model VARCHAR(20), -- NULL=불가, 'gpt-4o-mini'=프로, 'gpt-4o'=프리미엄
  
  -- Trial
  trial_end TIMESTAMP,
  
  -- Status
  status VARCHAR(20), -- 'active', 'canceled', 'refunded'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. AI 사용량 추적
CREATE TABLE user_ai_usage (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  period_type VARCHAR(10), -- 'week' or 'month'
  period_start DATE,
  
  ai_generations_used INTEGER DEFAULT 0,
  speaking_problems_generated INTEGER DEFAULT 0,
  
  last_generation_at TIMESTAMP,
  
  UNIQUE(user_id, period_type, period_start)
);

-- 4. Speaking 사전 생성 문제
CREATE TABLE pre_generated_speaking_problems (
  id UUID PRIMARY KEY,
  grammar_name VARCHAR(100),
  speaking_type VARCHAR(20), -- 'read_aloud', 'listen_repeat', 'word_prompt'
  question TEXT,
  answer TEXT,
  prompt_word TEXT, -- Type 3용
  question_translation TEXT,
  answer_translation TEXT,
  audio_url TEXT, -- Type 2용 TTS
  difficulty_level INTEGER,
  created_at TIMESTAMP,
  
  INDEX idx_grammar (grammar_name),
  INDEX idx_type (speaking_type)
);

-- 5. Assignments (숙제)
CREATE TABLE assignments (
  id UUID PRIMARY KEY,
  teacher_id UUID REFERENCES auth.users(id),
  title VARCHAR(255),
  description TEXT,
  assignment_type VARCHAR(20), -- 'simple' or 'custom'
  
  -- Simple Mode
  selected_level VARCHAR(10),
  selected_grammar_end VARCHAR(100),
  
  -- Custom Mode
  custom_vocabulary TEXT[],
  selected_grammars TEXT[],
  
  -- Quiz counts
  quiz_type_counts JSONB,
  
  -- Deadline
  due_date TIMESTAMP,
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 6. Assignment Problems (생성된 문제)
CREATE TABLE assignment_problems (
  id UUID PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  problem_type VARCHAR(50),
  problem_data JSONB,
  order_index INTEGER,
  created_at TIMESTAMP,
  
  INDEX idx_assignment (assignment_id)
);

-- 7. Student Assignments (학생별 숙제)
CREATE TABLE student_assignments (
  id UUID PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  assigned_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  score INTEGER,
  total_questions INTEGER,
  time_spent INTEGER,
  status VARCHAR(20), -- 'pending', 'in_progress', 'completed'
  
  UNIQUE(assignment_id, student_id)
);

-- 8. Student Assignment Attempts (문제별 시도)
CREATE TABLE student_assignment_attempts (
  id UUID PRIMARY KEY,
  student_assignment_id UUID REFERENCES student_assignments(id) ON DELETE CASCADE,
  problem_id UUID REFERENCES assignment_problems(id),
  user_answer TEXT,
  is_correct BOOLEAN,
  time_spent INTEGER,
  created_at TIMESTAMP,
  
  INDEX idx_student_assignment (student_assignment_id)
);

-- 9. Retry Sessions (재시도)
CREATE TABLE retry_sessions (
  id UUID PRIMARY KEY,
  student_assignment_id UUID REFERENCES student_assignments(id),
  attempted_at TIMESTAMP
);

CREATE TABLE retry_attempts (
  id UUID PRIMARY KEY,
  retry_session_id UUID REFERENCES retry_sessions(id),
  problem_id UUID,
  user_answer TEXT,
  is_correct BOOLEAN,
  created_at TIMESTAMP
);

-- 10. Teacher-Student Relationship
CREATE TABLE teacher_students (
  id UUID PRIMARY KEY,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive'
  
  UNIQUE(teacher_id, student_id),
  
  CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = teacher_id AND user_role = 'teacher'
    )
  ),
  CHECK (
    NOT EXISTS (
      SELECT 1 FROM teacher_students ts2
      WHERE ts2.student_id = student_id 
        AND ts2.status = 'active'
        AND ts2.id != id
    )
  ) -- 학생은 1명의 선생님만
);

-- 11. Invitations (초대)
CREATE TABLE invitations (
  id UUID PRIMARY KEY,
  teacher_id UUID REFERENCES auth.users(id),
  student_email VARCHAR(255),
  expires_at TIMESTAMP,
  created_at TIMESTAMP
);

CREATE TABLE invitation_codes (
  id UUID PRIMARY KEY,
  teacher_id UUID REFERENCES auth.users(id),
  code VARCHAR(20) UNIQUE,
  expires_at TIMESTAMP,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMP
);

-- 12. Notifications (알림)
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type VARCHAR(50),
  title TEXT,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  
  INDEX idx_user_read (user_id, read)
);

✅ 최종 체크리스트
핵심 기능
✅ 회원가입 시 역할 선택 (학생/선생님)
✅ 구독 플랜 분리 (학생/선생님)
✅ 간단 모드 (기본/고급 설정)
✅ 커스텀 모드 (4단계)
✅ Speaking 3가지 타입
✅ 숙제 시스템 (생성/부여/채점/재시도)
✅ 학생 관리 (이메일/코드 초대, 1:1 관계)
✅ 마감일 관리 (연장 가능)
✅ PWA (오프라인 지원)
✅ 결제 (Stripe + Toss, 7일 체험, 7일 환불)
기술 스택
Frontend: Next.js 14, React, TypeScript, Tailwind
Backend: Supabase (Auth, DB, Realtime)
AI: GPT-4o mini, GPT-4o, Claude Haiku 4.5
Payment: Stripe, Toss Payments
TTS/STT: OpenAI Whisper, OpenAI TTS
PWA: next-pwa
예상 비용 (월)
AI: ~$150
Supabase: ~$25
Stripe/Toss: ~$30 (수수료)
총: ~$200
수익: ~$4,000 (200명 기준)
마진: 95%