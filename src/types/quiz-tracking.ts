// 퀴즈 진도 추적 관련 타입 정의

export type QuizType = 'dialogue' | 'sentence' | 'multiple' | 'fill_blank';

export type AchievementType = 'streak' | 'accuracy' | 'speed' | 'completion';

export type GoalType = 'daily' | 'weekly' | 'monthly';

// 퀴즈 시도 기록
export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_type: QuizType;
  grammar_name: string; // 문법 이름 (예: '은/는', '이에요/예요', '이거/그거/저거')
  question_id: string;
  question_text: string;
  user_answer?: string;
  correct_answer: string;
  is_correct: boolean;
  is_retry: boolean; // 다시 시도 여부 (같은 문제 재시도는 통계에서 제외)
  time_spent?: number;
  hints_used: number;
  created_at: string;
  updated_at: string;
}

// 사용자 진도
export interface UserProgress {
  id: string;
  user_id: string;
  grammar_name: string; // 문법 이름 (예: '은/는', '이에요/예요', '이거/그거/저거')
  quiz_type: QuizType;
  total_attempts: number;
  correct_attempts: number;
  total_time_spent: number;
  current_streak: number;
  best_streak: number;
  mastery_level: number; // 0-5 레벨
  last_attempted_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// 사용자 성취/배지
export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: AchievementType;
  achievement_name: string;
  achievement_description?: string;
  earned_at: string;
  metadata?: Record<string, any>;
}

// 학습 목표
export interface UserLearningGoal {
  id: string;
  user_id: string;
  goal_type: GoalType;
  target_value: number;
  current_value: number;
  is_completed: boolean;
  goal_period_start: string;
  goal_period_end: string;
  created_at: string;
  updated_at: string;
}

// 약점 분석
export interface UserWeakArea {
  id: string;
  user_id: string;
  grammar_name: string; // 문법 이름 (예: '은/는', '이에요/예요', '이거/그거/저거')
  quiz_type: QuizType;
  error_count: number;
  total_attempts: number;
  last_error_at?: string;
  improvement_suggestions: string[];
  created_at: string;
  updated_at: string;
}

// 퀴즈 시도 생성 데이터
export interface CreateQuizAttemptData {
  quiz_type: QuizType;
  grammar_name: string; // 문법 이름 (예: '은/는', '이에요/예요', '이거/그거/저거')
  question_id: string;
  question_text: string;
  user_answer?: string;
  correct_answer: string;
  is_correct: boolean;
  is_retry?: boolean; // 다시 시도 여부 (기본값: false)
  time_spent?: number;
  hints_used?: number;
}

// 진도 업데이트 데이터
export interface UpdateProgressData {
  grammar_name: string; // 문법 이름 (예: '은/는', '이에요/예요', '이거/그거/저거')
  quiz_type: QuizType;
  is_correct: boolean;
  is_retry?: boolean; // 다시 시도 여부 (기본값: false)
  time_spent?: number;
}

// 학습 목표 생성 데이터
export interface CreateLearningGoalData {
  goal_type: GoalType;
  target_value: number;
  goal_period_start: string;
  goal_period_end: string;
}

// 통계 데이터
export interface UserStats {
  total_attempts: number;
  total_correct: number;
  accuracy_rate: number;
  total_time_spent: number;
  current_streak: number;
  best_streak: number;
  completed_grammars: number;
  total_achievements: number;
}

// 문법별 진도
export interface GrammarProgress {
  grammar_name: string; // 문법 이름 (예: '은/는', '이에요/예요', '이거/그거/저거')
  quiz_type: QuizType;
  total_attempts: number;
  correct_attempts: number;
  accuracy_rate: number;
  mastery_level: number;
  is_completed: boolean;
  last_attempted_at?: string;
}

// 일일/주간/월간 통계
export interface PeriodStats {
  period: string; // '2024-01-15' 형식
  attempts: number;
  correct: number;
  accuracy_rate: number;
  time_spent: number;
  streak: number;
}
