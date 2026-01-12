# HiTTi'G (HiTTi Guide)

라이프스타일 가이드 웹사이트 - Next.js 14+ (App Router), Tailwind CSS, Notion API

## 프로젝트 구조

```
HiTTi.G/
├── app/              # Next.js App Router
│   ├── globals.css   # Tailwind CSS
│   ├── layout.tsx    # 루트 레이아웃
│   └── page.tsx      # 메인 페이지
├── lib/              # 유틸리티 함수
│   └── notion.ts     # Notion API 클라이언트
├── .env.local        # 환경 변수 (Git에 커밋하지 않음)
├── next.config.js    # Next.js 설정
├── package.json      # 프로젝트 의존성
├── tsconfig.json     # TypeScript 설정
└── tailwind.config.js # Tailwind CSS 설정
```

## 환경 변수 설정

`.env.local` 파일에 다음 변수를 설정하세요:

```
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
```

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

## 주요 기능

- 인스타그램 스타일 그리드 레이아웃
- Notion 데이터베이스 연동
- 반응형 디자인 (모바일 2열, 태블릿 3열, 데스크톱 4열)
- 이미지 호버 효과
