-- Supabase SQL Editor에서 실행할 SQL 스크립트
-- 문의(inquiries) 테이블 생성

create table inquiries (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text,
  message text,
  status text default 'new',
  created_at timestamp with time zone default now()
);

-- 테이블 생성 확인
-- SELECT * FROM inquiries;
