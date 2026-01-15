-- Supabase SQL Editor에서 실행할 SQL 스크립트
-- spaces 테이블에 통계 컬럼 추가 (views_count, keeps_count, shares_count)

-- spaces 테이블이 존재하지 않는 경우를 대비해 먼저 확인
-- 테이블이 이미 존재한다면 이 부분은 건너뛰고 ALTER TABLE만 실행하세요

-- spaces 테이블에 통계 컬럼 추가
-- 이미 존재하는 컬럼이면 오류가 발생할 수 있으므로, 존재하지 않을 때만 추가하도록 처리

DO $$ 
BEGIN
    -- views_count 컬럼 추가 (존재하지 않는 경우에만)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'spaces' AND column_name = 'views_count'
    ) THEN
        ALTER TABLE spaces ADD COLUMN views_count int4 DEFAULT 0;
    END IF;

    -- keeps_count 컬럼 추가 (존재하지 않는 경우에만)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'spaces' AND column_name = 'keeps_count'
    ) THEN
        ALTER TABLE spaces ADD COLUMN keeps_count int4 DEFAULT 0;
    END IF;

    -- shares_count 컬럼 추가 (존재하지 않는 경우에만)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'spaces' AND column_name = 'shares_count'
    ) THEN
        ALTER TABLE spaces ADD COLUMN shares_count int4 DEFAULT 0;
    END IF;
END $$;

-- 컬럼 추가 확인
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'spaces' 
-- AND column_name IN ('views_count', 'keeps_count', 'shares_count');
