-- ============================================
-- Analytics 테이블에 트래픽 소스 추적 추가
-- ============================================
-- Supabase SQL Editor에서 실행하세요.

-- 1. traffic_source 컬럼 추가 (소스별 방문자 수를 JSONB로 저장)
-- 형식: {"organic": 10, "direct": 5, "referral": 2, "social": 1}
ALTER TABLE analytics 
ADD COLUMN IF NOT EXISTS traffic_sources JSONB DEFAULT '{"organic": 0, "direct": 0, "referral": 0, "social": 0}'::jsonb;

-- 2. 인덱스 추가 (JSONB 쿼리 성능 향상)
CREATE INDEX IF NOT EXISTS idx_analytics_traffic_sources 
ON analytics USING GIN (traffic_sources);

-- 3. 기존 데이터 마이그레이션 (기존 visitors를 direct로 분류)
UPDATE analytics 
SET traffic_sources = jsonb_build_object(
  'organic', 0,
  'direct', COALESCE(visitors, 0),
  'referral', 0,
  'social', 0
)
WHERE traffic_sources IS NULL OR traffic_sources = '{}'::jsonb;

-- 4. 트래픽 소스별 일일 통계를 위한 뷰 생성 (선택사항)
CREATE OR REPLACE VIEW analytics_by_source AS
SELECT 
  date,
  visitors,
  page_views,
  COALESCE((traffic_sources->>'organic')::int, 0) as organic_visitors,
  COALESCE((traffic_sources->>'direct')::int, 0) as direct_visitors,
  COALESCE((traffic_sources->>'referral')::int, 0) as referral_visitors,
  COALESCE((traffic_sources->>'social')::int, 0) as social_visitors
FROM analytics
ORDER BY date DESC;

-- 확인 쿼리
-- SELECT * FROM analytics_by_source ORDER BY date DESC LIMIT 7;
