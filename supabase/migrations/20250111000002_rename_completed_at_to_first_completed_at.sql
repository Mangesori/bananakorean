-- user_progress 테이블의 completed_at을 first_completed_at으로 변경
-- completed_at: 마지막으로 퀴즈 완료한 시간 → first_completed_at: 처음으로 퀴즈 완료한 시간

ALTER TABLE user_progress
RENAME COLUMN completed_at TO first_completed_at;

-- 주석: first_completed_at은 처음으로 해당 문법+퀴즈타입을 완료한 시간을 의미
-- is_retry, is_review, is_retake가 아닐 때만 설정됨
