# 데이터 소스 추상화 레이어 (Data Source Abstraction Layer)

## 🎯 개요

이 추상화 레이어는 데이터 소스를 쉽게 전환할 수 있도록 설계되었습니다. **점진적 전환(Progressive Migration)** 전략을 채택하여 개발 속도를 높이고, 향후 확장성을 보장합니다.

## 📊 현재 상태: **로컬 JSON + API Routes** (1-2단계 완료)

### ✅ 완료된 단계

1. **1단계: 로컬 JSON 파일** (`data/places.json`)
   - ✅ API 대기 시간 0초
   - ✅ UI 수정 시 즉각 반영
   - ✅ 개발 속도 향상

2. **2단계: Next.js API Routes**
   - ✅ `/api/places` - 모든 장소 목록
   - ✅ `/api/places/[slug]` - 특정 장소 상세
   - ✅ 프론트엔드 코드 수정 없이 데이터 소스 전환 가능

3. **3단계: 실제 DB 연결** (향후)
   - ⏳ PostgreSQL, MongoDB 등으로 마이그레이션 예정
   - ⏳ API Routes 내부 로직만 수정하면 프론트엔드 코드 변경 불필요

## 🏗️ 구조

```
lib/
├── data-source.ts    # 추상화 레이어 (인터페이스 + 구현체)
└── notion.ts         # 하위 호환성을 위한 re-export

data/
└── places.json       # 로컬 JSON 데이터 (1단계)

app/
└── api/
    └── places/
        ├── route.ts        # GET /api/places (2단계)
        └── [slug]/route.ts # GET /api/places/[slug] (2단계)
```

## 🚀 사용 방법

### 현재 (로컬 JSON 사용, 기본값)

기존 코드는 그대로 동작합니다:

```typescript
import { getPlaces, getPlaceBySlug } from '@/lib/notion';
// 또는
import { getPlaces, getPlaceBySlug } from '@/lib/data-source';

const places = await getPlaces();
const place = await getPlaceBySlug('starbucks-gangnam');
```

**환경 변수 설정 (`.env.local`):**
```env
# 기본값: json (로컬 JSON 파일 사용)
DATA_SOURCE_TYPE=json

# 또는 노션 사용하려면:
# DATA_SOURCE_TYPE=notion
# NOTION_API_KEY=your_key
# NOTION_DATABASE_ID=your_db_id
```

### API Routes 직접 호출 (선택사항)

프론트엔드에서 직접 API를 호출할 수도 있습니다:

```typescript
// 클라이언트 컴포넌트에서
const response = await fetch('/api/places');
const { places } = await response.json();

const placeResponse = await fetch('/api/places/starbucks-gangnam');
const place = await placeResponse.json();
```

## 📝 데이터 모델

### Place (목록)
```typescript
interface Place {
  id: string;
  title: string;
  category: string;
  image: string | null;
  address: string | null;
  slug: string;
  tags: string[];
}
```

### PlaceDetail (상세)
```typescript
interface PlaceDetail extends Place {
  content: string;                    // 마크다운 콘텐츠
  images: string[];                   // 이미지 URL 배열
  properties: Record<string, any>;    // 속성 객체 (PropertyView에서 사용)
  seoDescription?: string | null;     // SEO 설명
}
```

## 📄 JSON 파일 구조 (`data/places.json`)

```json
[
  {
    "id": "place_001",
    "title": "카페 이름",
    "category": "카페",
    "image": "https://...",
    "address": "서울 강남구 ...",
    "slug": "cafe-name",
    "tags": ["hero", "story"],
    "content": "# 마크다운 콘텐츠",
    "images": ["https://...", "https://..."],
    "properties": {
      "전화번호": {
        "type": "rich_text",
        "rich_text": [{ "plain_text": "02-1234-5678" }]
      },
      "영업시간": {
        "type": "rich_text",
        "rich_text": [{ "plain_text": "월-일 07:00 - 23:00" }]
      }
    },
    "seoDescription": "SEO 설명 텍스트"
  }
]
```

## 🔄 데이터 소스 전환

### 옵션 1: 환경 변수로 전환

`.env.local` 파일 수정:
```env
DATA_SOURCE_TYPE=notion  # 또는 json, backend
```

### 옵션 2: 코드에서 직접 전환

```typescript
// lib/data-source.ts의 createDataSource() 함수 수정
function createDataSource(): DataSource {
  const dataSourceType = process.env.DATA_SOURCE_TYPE || 'json';
  
  switch (dataSourceType) {
    case 'json':
      return new JsonDataSource();
    case 'notion':
      return new NotionDataSource();
    case 'backend':
      return new BackendDataSource(); // 향후 구현
    default:
      return new JsonDataSource();
  }
}
```

## 🔮 향후 3단계: 실제 DB 연결

### 예시: PostgreSQL (Supabase, Vercel Postgres 등)

```typescript
// lib/data-source.ts에 추가
class BackendDataSource implements DataSource {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.BACKEND_API_URL || 'http://localhost:3000';
  }

  async getPlaces(): Promise<Place[]> {
    const response = await fetch(`${this.apiUrl}/api/places`);
    if (!response.ok) throw new Error('Failed to fetch places');
    const { places } = await response.json();
    return places;
  }

  async getPlaceBySlug(slug: string): Promise<PlaceDetail | null> {
    const response = await fetch(`${this.apiUrl}/api/places/${slug}`);
    if (!response.ok) return null;
    return await response.json();
  }
}
```

### API Routes 수정 (DB 연결)

`app/api/places/route.ts`를 수정하여 실제 DB에서 데이터를 가져오도록:

```typescript
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // DB 연결 (Prisma, MongoDB 등)

export async function GET() {
  try {
    // 실제 DB 쿼리
    const places = await db.place.findMany();
    return NextResponse.json({ places }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    );
  }
}
```

**중요:** 프론트엔드 코드(`app/page.tsx`, `app/[slug]/page.tsx`)는 전혀 수정할 필요가 없습니다! 🎉

## ✨ 장점

1. **하위 호환성**: 기존 코드 수정 불필요
2. **유연성**: 환경 변수 하나로 데이터 소스 전환
3. **개발 속도**: JSON 파일로 즉각 반영, API 대기 시간 0초
4. **확장성**: 나중에 DB로 전환 시 API Routes만 수정
5. **타입 안전성**: TypeScript 인터페이스로 타입 보장
6. **테스트 용이성**: Mock 데이터 소스 쉽게 구현 가능

## 📚 참고 자료

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [TypeScript JSON Modules](https://www.typescriptlang.org/tsconfig#resolveJsonModule)
