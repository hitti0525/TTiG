-- ============================================
-- Analytics 테이블 생성 (일별 방문자 추적)
-- ============================================
-- Supabase SQL Editor에서 실행하세요.

-- 1. analytics 테이블 생성
CREATE TABLE IF NOT EXISTS analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  visitors INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 인덱스 추가 (날짜로 빠른 조회)
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);

-- 3. RLS (Row Level Security) 설정
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- 4. 정책 생성: 모든 사용자가 INSERT 가능 (방문자 추적용)
CREATE POLICY "Allow public insert on analytics"
ON analytics
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 5. 정책 생성: 모든 사용자가 SELECT 가능 (대시보드 조회용)
CREATE POLICY "Allow public select on analytics"
ON analytics
FOR SELECT
TO anon, authenticated
USING (true);

-- 6. 정책 생성: 모든 사용자가 UPDATE 가능 (일별 카운트 업데이트용)
CREATE POLICY "Allow public update on analytics"
ON analytics
FOR UPDATE
TO anon, authenticated
USING (true);

-- 7. updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. 트리거 생성
DROP TRIGGER IF EXISTS update_analytics_updated_at ON analytics;
CREATE TRIGGER update_analytics_updated_at
  BEFORE UPDATE ON analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 테이블 확인
-- SELECT * FROM analytics ORDER BY date DESC LIMIT 7;
