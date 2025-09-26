-- 진도 추적을 위한 테이블 생성
-- 6주차 Day 1: 데이터베이스 설계

-- 1. quiz_attempts 테이블: 개별 퀴즈 시도 기록
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_type VARCHAR(50) NOT NULL, -- 'dialogue', 'sentence', 'multiple', 'fill_blank'
    grammar_id VARCHAR(100) NOT NULL, -- 문법 ID (예: 'eseo-kkaji', 'euro')
    question_id VARCHAR(100) NOT NULL, -- 문제 ID
    question_text TEXT NOT NULL, -- 문제 텍스트
    user_answer TEXT, -- 사용자 답변
    correct_answer TEXT NOT NULL, -- 정답
    is_correct BOOLEAN NOT NULL DEFAULT false, -- 정답 여부
    time_spent INTEGER, -- 소요 시간 (초)
    hints_used INTEGER DEFAULT 0, -- 사용한 힌트 수
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. user_progress 테이블: 사용자별 진도 및 통계
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    grammar_id VARCHAR(100) NOT NULL, -- 문법 ID
    quiz_type VARCHAR(50) NOT NULL, -- 퀴즈 타입
    total_attempts INTEGER DEFAULT 0, -- 총 시도 횟수
    correct_attempts INTEGER DEFAULT 0, -- 정답 횟수
    total_time_spent INTEGER DEFAULT 0, -- 총 소요 시간 (초)
    current_streak INTEGER DEFAULT 0, -- 현재 연속 정답
    best_streak INTEGER DEFAULT 0, -- 최고 연속 정답
    mastery_level INTEGER DEFAULT 0, -- 숙련도 레벨 (0-5)
    last_attempted_at TIMESTAMP WITH TIME ZONE, -- 마지막 시도 시간
    completed_at TIMESTAMP WITH TIME ZONE, -- 완료 시간
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 복합 유니크 제약조건
    UNIQUE(user_id, grammar_id, quiz_type)
);

-- 3. user_achievements 테이블: 사용자 성취 및 배지
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL, -- 'streak', 'accuracy', 'speed', 'completion'
    achievement_name VARCHAR(100) NOT NULL, -- 배지 이름
    achievement_description TEXT, -- 배지 설명
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB, -- 추가 메타데이터 (예: 달성 조건)
    
    -- 복합 유니크 제약조건 (같은 배지를 중복으로 받지 않음)
    UNIQUE(user_id, achievement_type, achievement_name)
);

-- 4. user_learning_goals 테이블: 사용자 학습 목표
CREATE TABLE IF NOT EXISTS user_learning_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly'
    target_value INTEGER NOT NULL, -- 목표 값 (예: 일일 10문제)
    current_value INTEGER DEFAULT 0, -- 현재 값
    goal_period_start DATE NOT NULL, -- 목표 기간 시작
    goal_period_end DATE NOT NULL, -- 목표 기간 종료
    is_completed BOOLEAN DEFAULT false, -- 완료 여부
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. user_weak_areas 테이블: 사용자 약점 분석
CREATE TABLE IF NOT EXISTS user_weak_areas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    grammar_id VARCHAR(100) NOT NULL, -- 약한 문법
    quiz_type VARCHAR(50) NOT NULL, -- 약한 퀴즈 타입
    error_count INTEGER DEFAULT 0, -- 오답 횟수
    total_attempts INTEGER DEFAULT 0, -- 총 시도 횟수
    last_error_at TIMESTAMP WITH TIME ZONE, -- 마지막 오답 시간
    improvement_suggestions TEXT[], -- 개선 제안
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 복합 유니크 제약조건
    UNIQUE(user_id, grammar_id, quiz_type)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_grammar_id ON quiz_attempts(grammar_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created_at ON quiz_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_type ON quiz_attempts(quiz_type);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_grammar_id ON user_progress(grammar_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_quiz_type ON user_progress(quiz_type);
CREATE INDEX IF NOT EXISTS idx_user_progress_mastery_level ON user_progress(mastery_level);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_type ON user_achievements(achievement_type);

CREATE INDEX IF NOT EXISTS idx_user_learning_goals_user_id ON user_learning_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_goals_period ON user_learning_goals(goal_period_start, goal_period_end);

CREATE INDEX IF NOT EXISTS idx_user_weak_areas_user_id ON user_weak_areas(user_id);
CREATE INDEX IF NOT EXISTS idx_user_weak_areas_grammar_id ON user_weak_areas(grammar_id);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_weak_areas ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 접근 가능
CREATE POLICY "Users can view own quiz attempts" ON quiz_attempts
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON user_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own learning goals" ON user_learning_goals
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own weak areas" ON user_weak_areas
    FOR ALL USING (auth.uid() = user_id);

-- 업데이트 시간 자동 갱신을 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_quiz_attempts_updated_at 
    BEFORE UPDATE ON quiz_attempts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON user_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_learning_goals_updated_at 
    BEFORE UPDATE ON user_learning_goals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_weak_areas_updated_at 
    BEFORE UPDATE ON user_weak_areas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
