# Figma MCP 빠른 설정 가이드

## ⚠️ 중요: 올바른 URL 복사하기

### ❌ 잘못된 URL (현재 입력하신 것)
```
https://www.figma.com/design/DXUKcMDalCnd0ntIXgwun0/...
```
이것은 **디자인 파일의 웹 링크**입니다. MCP 서버 URL이 아닙니다!

### ✅ 올바른 MCP 서버 URL 형식
```
http://127.0.0.1:3845/mcp
```
또는
```
http://localhost:3845/mcp
```

## 🔧 올바른 MCP 서버 URL 얻는 방법

### Step 1: Figma 데스크톱 앱에서
1. **Figma 데스크톱 앱** 실행 (웹 브라우저가 아닌 앱)
2. 디자인 파일 열기
3. **상단 툴바에서 "Dev" 모드 클릭** (Design 모드에서 Dev 모드로 전환)
4. **오른쪽 사이드바 하단**을 확인
5. **"MCP Server"** 또는 **"Enable MCP Server"** 섹션 찾기
6. **"Enable"** 또는 **"Start"** 버튼 클릭
7. 활성화되면 **"Copy URL"** 버튼이 나타남
8. **"Copy URL" 버튼을 클릭**하여 올바른 MCP 서버 URL 복사

### Step 2: 복사한 URL 확인
올바른 URL은 다음과 같은 형식입니다:
- `http://127.0.0.1:3845/mcp`
- `http://127.0.0.1:3846/mcp` (포트 번호는 다를 수 있음)
- `http://localhost:3845/mcp`

**절대 다음과 같은 형식이 아닙니다:**
- ❌ `https://www.figma.com/...` (웹 링크)
- ❌ `figma://...` (Figma 프로토콜 링크)

## 📝 Cursor 설정

### 올바른 설정 예시:

**Name**: `figma-mcp` (원하는 이름 사용 가능)

**URL**: `http://127.0.0.1:3845/mcp` 
(⚠️ Figma에서 "Copy URL" 버튼으로 복사한 실제 URL 사용)

### JSON 형식으로 설정하는 경우:
```json
{
  "mcpServers": {
    "figma-mcp": {
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

## 🔍 MCP 서버 URL을 찾을 수 없는 경우

### 문제 1: Dev Mode가 보이지 않음
- **해결**: 캔버스에서 아무것도 선택하지 않은 상태에서 확인
- **해결**: Figma를 최신 버전으로 업데이트

### 문제 2: MCP Server 옵션이 보이지 않음
- **해결**: Figma 데스크톱 앱이 최신 버전인지 확인
- **해결**: Help → Check for Updates
- **해결**: Figma를 재시작

### 문제 3: "Copy URL" 버튼이 없음
- **해결**: MCP 서버가 먼저 활성화되어야 합니다
- **해결**: "Enable MCP Server" 또는 "Start MCP Server" 버튼을 먼저 클릭

## ✅ 체크리스트

설정 전 확인:
- [ ] Figma **데스크톱 앱** 실행 중 (웹 브라우저 아님)
- [ ] 디자인 파일이 열려 있음
- [ ] **Dev Mode** 활성화됨
- [ ] **MCP Server** 활성화됨
- [ ] **"Copy URL"** 버튼으로 URL 복사함
- [ ] 복사한 URL이 `http://127.0.0.1:XXXX/mcp` 형식임

Cursor 설정:
- [ ] Name: `figma-mcp` (또는 원하는 이름)
- [ ] URL: Figma에서 복사한 **MCP 서버 URL** (웹 링크 아님)
- [ ] 설정 저장
- [ ] Cursor 재시작

## 💡 팁

1. **URL은 항상 localhost 형식**: MCP 서버는 로컬에서만 실행되므로 `http://127.0.0.1` 또는 `http://localhost`로 시작합니다.

2. **포트 번호 확인**: Figma를 재시작하면 포트 번호가 변경될 수 있으므로 항상 최신 URL을 복사하세요.

3. **웹 링크와 혼동하지 마세요**: 브라우저 주소창의 URL이나 "Share" 버튼의 링크가 아닙니다. 반드시 Dev Mode의 "Copy URL" 버튼을 사용하세요.
