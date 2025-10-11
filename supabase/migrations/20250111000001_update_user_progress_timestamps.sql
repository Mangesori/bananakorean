-- user_progress 테이블 수정
-- updated_at을 completed_at의 의미로 변경
-- mastery_level 컬럼 제거

-- 1. updated_at 트리거 제거
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;

-- 2. mastery_level 컬럼 제거
ALTER TABLE user_progress DROP COLUMN IF EXISTS mastery_level;

-- 3. mastery_level 인덱스 제거
DROP INDEX IF EXISTS idx_user_progress_mastery_level;

-- 4. 기존 updated_at 데이터를 completed_at에 복사 (데이터 보존)
-- completed_at이 NULL인 경우에만 updated_at 값을 복사
UPDATE user_progress
SET completed_at = updated_at
WHERE completed_at IS NULL AND updated_at IS NOT NULL;

-- 5. updated_at 컬럼 제거
ALTER TABLE user_progress DROP COLUMN IF EXISTS updated_at;

-- 참고: completed_at은 이제 "마지막으로 퀴즈 세션을 완료한 시간"을 의미
-- 세션을 완료할 때마다 애플리케이션 코드에서 명시적으로 업데이트
