# Supabase 설정 가이드

## 🚀 1단계: Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) 접속 및 로그인 (GitHub 계정으로 간편 가입 가능)
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: 원하는 프로젝트 이름 (예: `hitti-g`)
   - **Database Password**: 강력한 비밀번호 설정 (나중에 필요하니 기록해두세요)
   - **Region**: 가장 가까운 지역 선택 (예: Northeast Asia (Seoul))
4. "Create new project" 클릭
5. 프로젝트 생성 완료까지 2-3분 대기

## 🔑 2단계: API 키 확인

프로젝트 생성 완료 후:

1. Supabase 대시보드 왼쪽 메뉴에서 **Settings** → **API** 클릭
2. 다음 정보 확인:
   - **Project URL**: `https://xxxxx.supabase.co` 형식
   - **anon public** key: 긴 문자열 (이것이 `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## 📝 3단계: 환경 변수 설정

프로젝트 루트의 `.env.local` 파일에 다음을 추가하세요:

```env
# 기존 NOTION 변수는 그대로 유지
NOTION_API_KEY=ntn_F86034285446Oo0xPsDONkBP8MvvJL8VwRBKZX01N1F5G7
NOTION_DATABASE_ID=2e3200cde6c081c093d3fa6f294d5568

# Supabase 환경 변수 추가
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**주의**: `your-project-id`와 `your-anon-key-here`를 실제 값으로 교체하세요!

## 🗄️ 4단계: 데이터베이스 테이블 생성

1. Supabase 대시보드 왼쪽 메뉴에서 **SQL Editor** 클릭
2. "New query" 클릭
3. 아래 SQL을 복사하여 붙여넣기:

```sql
create table inquiries (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text,
  message text,
  status text default 'new',
  created_at timestamp with time zone default now()
);
```

4. "Run" 버튼 클릭 (또는 `Ctrl+Enter`)
5. "Success. No rows returned" 메시지 확인

## 🔄 5단계: 개발 서버 재시작

환경 변수를 추가한 후에는 반드시 개발 서버를 재시작해야 합니다:

```bash
# 터미널에서 Ctrl+C로 서버 중지 후
npm run dev
```

## ✅ 확인 방법

1. 문의 양식 제출 테스트
2. `/admin/inquiries` 페이지에서 문의 내역 확인

## 🆘 문제 해결

### "서버 설정 오류"가 계속 나타나는 경우:
- `.env.local` 파일에 Supabase 환경 변수가 올바르게 입력되었는지 확인
- 개발 서버를 재시작했는지 확인
- 환경 변수 이름이 정확한지 확인 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### "DB 저장 실패" 오류가 나타나는 경우:
- Supabase SQL Editor에서 `inquiries` 테이블이 생성되었는지 확인
- 테이블 이름이 정확한지 확인 (`inquiries`)
