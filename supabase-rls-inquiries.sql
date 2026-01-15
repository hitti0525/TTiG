-- ============================================
-- inquiries 테이블 RLS (Row Level Security) 설정
-- ============================================
-- Supabase SQL Editor에서 실행하세요.

-- 1. RLS 활성화
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 2. 정책 생성: 모든 사용자가 문의사항을 INSERT할 수 있도록 허용
-- (문의 폼 제출용)
CREATE POLICY "Allow public insert on inquiries"
ON public.inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. 정책 생성: 모든 사용자가 SELECT 가능 (임시)
-- 주의: 현재 관리자 페이지가 인증 없이 작동하므로 임시로 허용합니다.
-- 향후 인증 시스템 추가 시 이 정책을 수정하거나 삭제하세요.
CREATE POLICY "Allow public select on inquiries"
ON public.inquiries
FOR SELECT
TO anon, authenticated
USING (true);

-- 3-1. (권장) 인증된 사용자만 SELECT 가능하도록 변경하려면:
-- 위 정책을 삭제하고 아래 정책을 사용하세요:
-- DROP POLICY IF EXISTS "Allow public select on inquiries" ON public.inquiries;
-- CREATE POLICY "Allow authenticated select on inquiries"
-- ON public.inquiries
-- FOR SELECT
-- TO authenticated
-- USING (true);

-- 4. (선택사항) 서비스 역할(service_role)은 모든 작업 허용
-- 서버 사이드에서만 사용되는 키로, 모든 권한이 필요할 수 있습니다.
-- 이 정책은 Supabase의 service_role 키를 사용하는 경우를 위한 것입니다.
-- 주의: service_role 키는 절대 클라이언트에 노출되면 안 됩니다!

-- 정책 확인
-- SELECT * FROM pg_policies WHERE tablename = 'inquiries';
