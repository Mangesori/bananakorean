-- 프로필 테이블 생성 (공식 마이그레이션)
-- Week 1 Day 2: 프로필 시스템 정비

-- 1. profiles 테이블 생성
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 3. RLS (Row Level Security) 정책 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 사용자는 모든 프로필을 조회할 수 있음 (메시징, 학생 관리 등을 위해)
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

-- 사용자는 자신의 프로필만 업데이트 가능
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 사용자는 자신의 프로필만 삭제 가능
CREATE POLICY "Users can delete own profile" ON profiles
    FOR DELETE USING (auth.uid() = id);

-- 프로필 생성은 회원가입 시 자동으로 생성되도록 (서버 액션에서 처리)
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. 업데이트 시간 자동 갱신 트리거
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. 기존 auth.users에 프로필이 없는 경우 자동 생성하는 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 새 사용자 생성 시 자동으로 프로필 생성하는 트리거
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. 기존 사용자들을 위한 마이그레이션 (이미 프로필이 있으면 role 컬럼 추가)
-- role 컬럼이 없는 기존 프로필에 role 추가
DO $$
BEGIN
    -- role 컬럼이 이미 존재하는지 확인
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        -- role 컬럼 추가
        ALTER TABLE profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student'));
    END IF;
END $$;

-- 8. 기존 사용자 중 프로필이 없는 사용자들을 위한 프로필 생성
INSERT INTO public.profiles (id, email, role)
SELECT
    id,
    email,
    COALESCE(raw_user_meta_data->>'role', 'student') as role
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
