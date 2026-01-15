import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 🔒 관리자 경로 보호 미들웨어
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin 경로 접근 시 세션 확인
  if (pathname.startsWith('/admin')) {
    const sessionToken = request.cookies.get('admin_session')?.value;
    const adminEmail = request.cookies.get('admin_email')?.value;

    // 세션이 없으면 로그인 페이지로 리다이렉트
    if (!sessionToken || !adminEmail) {
      const loginUrl = new URL('/login', request.url);
      // 원래 접근하려던 URL을 쿼리 파라미터로 저장 (로그인 후 리다이렉트용)
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 관리자 이메일 확인 (간단한 체크, 상세 검증은 서버 컴포넌트에서)
    // 실제 검증은 lib/auth.ts의 ADMIN_EMAILS를 사용하지만, 미들웨어에서는 간단히 체크
    const ADMIN_EMAILS = ['hitti0525@gmail.com'];
    const isAdminEmail = ADMIN_EMAILS.some(
      (email) => email.toLowerCase() === adminEmail.toLowerCase()
    );

    if (!isAdminEmail) {
      // 권한이 없는 경우 로그인 페이지로 리다이렉트
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 지정
export const config = {
  matcher: [
    '/admin/:path*', // /admin으로 시작하는 모든 경로
  ],
};
