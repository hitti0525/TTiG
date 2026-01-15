# 환경 변수 설정 가이드

## 필수 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# 사이트 URL (SEO 최적화용)
NEXT_PUBLIC_SITE_URL=https://ttig.kr

# Supabase 설정 (이미 설정되어 있다면 그대로 유지)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Notion 설정 (이미 설정되어 있다면 그대로 유지)
NOTION_API_KEY=your-notion-api-key
NOTION_DATABASE_ID=your-notion-database-id
```

## Vercel 배포 시

Vercel 대시보드에서 환경 변수를 설정하세요:

1. Vercel 프로젝트 → Settings → Environment Variables
2. 다음 변수 추가:
   - `NEXT_PUBLIC_SITE_URL` = `https://ttig.kr` (Production, Preview, Development 모두)
   - 기타 Supabase, Notion 변수들도 확인

## 중요 사항

- `NEXT_PUBLIC_SITE_URL`은 SEO 최적화(OG Tags, Canonical URLs)에 사용됩니다.
- 실제 도메인으로 변경하세요 (예: `https://ttig.kr`)
- 환경 변수 변경 후에는 **반드시 서버를 재시작**해야 합니다.
