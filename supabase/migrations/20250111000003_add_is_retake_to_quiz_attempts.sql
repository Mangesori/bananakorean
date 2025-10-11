-- quiz_attempts 테이블에 is_retake 컬럼 추가
-- is_retake: 전체 다시 풀기 모드 여부

ALTER TABLE quiz_attempts
ADD COLUMN IF NOT EXISTS is_retake BOOLEAN DEFAULT false;

-- 주석:
-- is_retry: 같은 문제를 바로 다시 시도 (통계 반영 X, last_attempted_at 업데이트 X)
-- is_review: 오답 복습 (통계 반영 X, last_attempted_at 업데이트 X)
-- is_retake: 전체 다시 풀기 (통계 반영 X, last_attempted_at 업데이트 O)
