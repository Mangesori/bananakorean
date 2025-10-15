-- Supabase profiles 테이블에 테스트 사용자 추가
-- Supabase Dashboard > SQL Editor에서 실행하세요

-- 1. Admin 사용자 추가 (만약 없다면)
INSERT INTO profiles (id, email, name, role, created_at, updated_at)
VALUES (
  gen_random_uuid(), -- 랜덤 UUID 생성
  'admin@bananakorean.com',
  'Admin User',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING; -- 이메일이 이미 있으면 무시

-- 2. Student 사용자 추가
INSERT INTO profiles (id, email, name, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'student1@bananakorean.com',
  'Student Kim',
  'student',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- 3. 추가 Student 사용자
INSERT INTO profiles (id, email, name, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'student2@bananakorean.com',
  'Student Lee',
  'student',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- 4. 현재 profiles 테이블 확인
SELECT
  id,
  email,
  name,
  role,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- 5. Role별 사용자 수 확인
SELECT
  role,
  COUNT(*) as count
FROM profiles
GROUP BY role;
