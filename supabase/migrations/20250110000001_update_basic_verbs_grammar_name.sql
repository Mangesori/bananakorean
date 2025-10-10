-- '기본 동사'를 '을/를, 아요/어요'로 업데이트하는 마이그레이션

-- quiz_attempts 테이블 업데이트
UPDATE quiz_attempts
SET grammar_name = '을/를, 아요/어요'
WHERE grammar_name = '기본 동사';

-- user_progress 테이블 업데이트
UPDATE user_progress
SET grammar_name = '을/를, 아요/어요'
WHERE grammar_name = '기본 동사';

-- user_weak_areas 테이블이 있고 해당 데이터가 있다면 업데이트
UPDATE user_weak_areas
SET grammar_name = '을/를, 아요/어요'
WHERE grammar_name = '기본 동사'
AND EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_name = 'user_weak_areas'
  AND column_name = 'grammar_name'
);

