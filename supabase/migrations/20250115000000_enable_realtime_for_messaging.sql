-- Realtime 활성화를 위한 REPLICA IDENTITY 설정
-- messages와 conversations 테이블의 변경사항을 실시간으로 브로드캐스트하기 위해 필요

-- 1. messages 테이블에 REPLICA IDENTITY FULL 설정
-- 이 설정이 있어야 Supabase Realtime이 INSERT/UPDATE/DELETE 이벤트를 감지할 수 있음
ALTER TABLE messages REPLICA IDENTITY FULL;

-- 2. conversations 테이블에 REPLICA IDENTITY FULL 설정
-- 대화 목록 업데이트도 실시간으로 전송하기 위해 필요
ALTER TABLE conversations REPLICA IDENTITY FULL;

-- 3. Realtime publication에 테이블 추가 (이미 존재할 수 있으므로 IF NOT EXISTS 사용)
-- 기본 publication에 messages와 conversations 테이블을 추가
INSERT INTO supabase_realtime.publication_tables (publication_id, schema_id, table_id)
SELECT 
    p.id as publication_id,
    s.id as schema_id,
    t.id as table_id
FROM 
    supabase_realtime.publications p,
    pg_namespace s,
    pg_class t
WHERE 
    p.name = 'supabase_realtime'
    AND s.nspname = 'public'
    AND t.relname IN ('messages', 'conversations')
    AND NOT EXISTS (
        SELECT 1 FROM supabase_realtime.publication_tables pt
        WHERE pt.publication_id = p.id 
        AND pt.schema_id = s.id 
        AND pt.table_id = t.id
    );

-- 4. Realtime 관련 권한 확인 (필요시)
-- RLS 정책이 이미 설정되어 있으므로 추가 권한 설정은 불필요





