-- quiz_attempts 테이블에 is_retry 컬럼 추가
-- 다시 시도한 문제는 통계에서 제외하기 위함

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS is_retry BOOLEAN NOT NULL DEFAULT false;

-- 인덱스 추가 (통계 쿼리 최적화)
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_is_retry ON quiz_attempts(is_retry);

-- 기존 데이터는 모두 is_retry = false로 설정 (이미 DEFAULT false이므로 불필요하지만 명시적으로)
UPDATE quiz_attempts SET is_retry = false WHERE is_retry IS NULL;

COMMENT ON COLUMN quiz_attempts.is_retry IS '다시 시도 여부: true인 경우 같은 문제를 재시도한 것이므로 학습 진도 통계에서 제외';

