-- 문법 ID를 문법 이름으로 변경하는 마이그레이션
-- grammar_id (고유 식별자) → grammar_name (사람이 읽을 수 있는 이름)

-- quiz_attempts 테이블 수정
ALTER TABLE quiz_attempts
  RENAME COLUMN grammar_id TO grammar_name;

-- user_progress 테이블 수정
ALTER TABLE user_progress
  RENAME COLUMN grammar_id TO grammar_name;

-- user_weak_areas 테이블이 있다면 수정
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_weak_areas'
    AND column_name = 'grammar_id'
  ) THEN
    ALTER TABLE user_weak_areas
      RENAME COLUMN grammar_id TO grammar_name;
  END IF;
END $$;

-- 인덱스가 있다면 재생성
DROP INDEX IF EXISTS idx_quiz_attempts_grammar_id;
DROP INDEX IF EXISTS idx_user_progress_grammar_id;
DROP INDEX IF EXISTS idx_user_weak_areas_grammar_id;

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_grammar_name
  ON quiz_attempts(grammar_name);

CREATE INDEX IF NOT EXISTS idx_user_progress_grammar_name
  ON user_progress(grammar_name);

CREATE INDEX IF NOT EXISTS idx_user_weak_areas_grammar_name
  ON user_weak_areas(grammar_name);
