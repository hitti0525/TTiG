import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 🔒 관리자 이메일 허용 목록 (lib/auth.ts와 동일하게 유지)
const ADMIN_EMAILS = ['hitti0525@gmail.com'];

// 🔒 관리자 경로 보호 미들웨어
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin 경로 접근 시 세션 확인
  if (pathname.startsWith('/admin')) {
    const sessionToken = request.cookies.get('admin_session')?.value;
    const adminEmail = request.cookies.get('admin_email')?.value;

    // 디버깅: 프로덕션에서는 제거 가능
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] Admin access attempt:', {
        pathname,
        hasSessionToken: !!sessionToken,
        hasAdminEmail: !!adminEmail,
        adminEmail: adminEmail || 'none',
      });
    }

    // 세션이 없으면 로그인 페이지로 리다이렉트
    if (!sessionToken || !adminEmail) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Middleware] No session found, redirecting to login');
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 관리자 이메일 확인
    const isAdminEmail = ADMIN_EMAILS.some(
      (email) => email.toLowerCase() === adminEmail.toLowerCase()
    );

    if (!isAdminEmail) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Middleware] Invalid admin email, redirecting to login');
      }
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] Admin access granted');
    }
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 지정
// Next.js 14+ App Router에서 정확한 패턴 사용
export const config = {
  matcher: [
    '/admin',
    '/admin/:path*', // /admin으로 시작하는 모든 하위 경로
    '/admin/inquiries',
    '/admin/posts',
    '/admin/write',
    '/admin/edit/:path*',
  ],
};
