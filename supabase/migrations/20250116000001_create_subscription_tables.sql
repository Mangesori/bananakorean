-- 구독 시스템 테이블 생성
-- Week 1 Day 3: 구독 시스템 DB (수동 버전)

-- 1. subscriptions 테이블 생성
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- 구독 플랜 타입
    plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'student_pro', 'teacher_pro', 'student_premium', 'teacher_premium')),

    -- 구독 상태
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),

    -- 결제 정보
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    toss_customer_id TEXT,
    toss_billing_key TEXT,

    -- 날짜 정보
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,

    -- 플랜 제한 정보 (JSON으로 저장)
    limits JSONB DEFAULT '{
        "ai_generations_per_week": 1,
        "ai_generations_per_month": null,
        "max_students": null,
        "speaking_quizzes_per_month": null,
        "ai_model": "gpt-4o-mini"
    }'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- 사용자당 하나의 구독만 가능
    UNIQUE(user_id)
);

-- 2. user_ai_usage 테이블 생성 (AI 생성 횟수 추적)
CREATE TABLE IF NOT EXISTS user_ai_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- 사용량 타입
    usage_type TEXT NOT NULL CHECK (usage_type IN ('quiz_generation', 'speaking_generation')),

    -- 생성된 문제 정보
    problems_generated INTEGER NOT NULL DEFAULT 0,

    -- 기간 정보
    period_type TEXT NOT NULL CHECK (period_type IN ('weekly', 'monthly')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    -- 메타데이터 (생성된 퀴즈 타입 등)
    metadata JSONB,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- 복합 유니크 제약조건 (사용자, 타입, 기간별로 하나씩)
    UNIQUE(user_id, usage_type, period_type, period_start)
);

-- 3. feature_access 테이블 (기능 접근 제어, 선택사항)
CREATE TABLE IF NOT EXISTS feature_access (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- 기능 이름
    feature_name TEXT NOT NULL CHECK (feature_name IN (
        'ai_custom_mode',
        'ai_simple_mode',
        'speaking_quizzes',
        'student_management',
        'assignment_creation',
        'progress_monitoring',
        'priority_support'
    )),

    -- 접근 가능 여부
    has_access BOOLEAN NOT NULL DEFAULT false,

    -- 사용 제한 (null이면 무제한)
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,

    -- 기간 정보 (null이면 영구)
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- 복합 유니크 제약조건
    UNIQUE(user_id, feature_name)
);

-- 4. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_type ON subscriptions(plan_type);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_user_ai_usage_user_id ON user_ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ai_usage_period ON user_ai_usage(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_user_ai_usage_type ON user_ai_usage(usage_type);

CREATE INDEX IF NOT EXISTS idx_feature_access_user_id ON feature_access(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_access_feature_name ON feature_access(feature_name);

-- 5. RLS (Row Level Security) 정책 설정
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_access ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 구독 정보만 조회 가능
CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- 관리자는 모든 구독 조회 가능
CREATE POLICY "Admins can view all subscriptions" ON subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 사용자는 자신의 AI 사용량만 조회 및 수정 가능
CREATE POLICY "Users can view own AI usage" ON user_ai_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI usage" ON user_ai_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI usage" ON user_ai_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- 사용자는 자신의 기능 접근 정보만 조회 가능
CREATE POLICY "Users can view own feature access" ON feature_access
    FOR SELECT USING (auth.uid() = user_id);

-- 6. 업데이트 시간 자동 갱신 트리거
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_access_updated_at
    BEFORE UPDATE ON feature_access
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. 새 사용자 생성 시 무료 구독 자동 생성 함수
CREATE OR REPLACE FUNCTION public.create_free_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.subscriptions (user_id, plan_type, status, limits)
    VALUES (
        NEW.id,
        'free',
        'active',
        '{
            "ai_generations_per_week": 1,
            "ai_generations_per_month": null,
            "max_students": null,
            "speaking_quizzes_per_month": 4,
            "ai_model": "gpt-4o-mini"
        }'::jsonb
    )
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. 새 사용자 생성 시 무료 구독 자동 생성 트리거
DROP TRIGGER IF EXISTS on_user_created_subscription ON auth.users;
CREATE TRIGGER on_user_created_subscription
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.create_free_subscription();

-- 9. 기존 사용자들을 위한 무료 구독 생성
INSERT INTO public.subscriptions (user_id, plan_type, status, limits)
SELECT
    id,
    'free',
    'active',
    '{
        "ai_generations_per_week": 1,
        "ai_generations_per_month": null,
        "max_students": null,
        "speaking_quizzes_per_month": 4,
        "ai_model": "gpt-4o-mini"
    }'::jsonb
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.subscriptions)
ON CONFLICT (user_id) DO NOTHING;

-- 10. 플랜별 제한 정보를 업데이트하는 헬퍼 함수
CREATE OR REPLACE FUNCTION public.get_plan_limits(p_plan_type TEXT)
RETURNS JSONB AS $$
BEGIN
    RETURN CASE p_plan_type
        WHEN 'free' THEN '{
            "ai_generations_per_week": 1,
            "ai_generations_per_month": null,
            "max_students": null,
            "speaking_quizzes_per_month": 4,
            "ai_model": "gpt-4o-mini"
        }'::jsonb
        WHEN 'student_pro' THEN '{
            "ai_generations_per_week": null,
            "ai_generations_per_month": 20,
            "max_students": null,
            "speaking_quizzes_per_month": 400,
            "ai_model": "gpt-4o-mini"
        }'::jsonb
        WHEN 'teacher_pro' THEN '{
            "ai_generations_per_week": null,
            "ai_generations_per_month": 20,
            "max_students": 30,
            "speaking_quizzes_per_month": 400,
            "ai_model": "gpt-4o-mini"
        }'::jsonb
        WHEN 'student_premium' THEN '{
            "ai_generations_per_week": null,
            "ai_generations_per_month": null,
            "max_students": null,
            "speaking_quizzes_per_month": null,
            "ai_model": "gpt-4o"
        }'::jsonb
        WHEN 'teacher_premium' THEN '{
            "ai_generations_per_week": null,
            "ai_generations_per_month": null,
            "max_students": null,
            "speaking_quizzes_per_month": null,
            "ai_model": "gpt-4o"
        }'::jsonb
        ELSE '{}'::jsonb
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
