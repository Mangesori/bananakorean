-- quiz_attempts 테이블에 is_review 컬럼 추가
-- 복습 모드로 푼 문제는 진도 통계에서 제외하기 위함

ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS is_review BOOLEAN NOT NULL DEFAULT false;

-- 인덱스 추가 (통계 쿼리 최적화)
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_is_review ON quiz_attempts(is_review);

-- 기존 데이터는 모두 is_review = false로 설정 (이미 DEFAULT false이므로 불필요하지만 명시적으로)
UPDATE quiz_attempts SET is_review = false WHERE is_review IS NULL;

COMMENT ON COLUMN quiz_attempts.is_review IS '복습 모드 여부: true인 경우 오답 복습으로 푼 문제이므로 학습 진도 통계에서 제외';


