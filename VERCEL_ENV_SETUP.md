# 🛠️ Vercel 환경 변수 설정 가이드

## 필수 환경 변수 목록

다음 환경 변수들을 Vercel 대시보드에 설정해야 합니다:

### 1. NEXT_PUBLIC_SITE_URL (신규 추가 필수)
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://ttig.kr
Environment: Production, Preview, Development (모두 선택)
```

### 2. Supabase 설정 (이미 있다면 확인만)
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: [당신의 Supabase URL]

Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [당신의 Supabase Anon Key]
Environment: Production, Preview, Development (모두 선택)
```

## 설정 방법

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택

2. **Settings → Environment Variables 이동**

3. **각 변수 추가**
   - Key 입력
   - Value 입력
   - Environment 선택 (Production, Preview, Development 모두 체크 권장)
   - [Add] 클릭

4. **설정 확인**
   - 모든 변수가 목록에 표시되는지 확인

5. **배포 실행**
   - 하단의 [Deploy] 버튼 클릭
   - 또는 자동 배포가 트리거되면 기다리기

## 중요 사항

- `NEXT_PUBLIC_SITE_URL`은 RSS 피드, OG 태그, Canonical URL에 사용됩니다.
- 환경 변수 변경 후에는 **새 배포가 필요**합니다.
- Production, Preview, Development 환경 모두에 설정하는 것을 권장합니다.
