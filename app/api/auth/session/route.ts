import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_EMAILS } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;
    const adminEmail = cookieStore.get('admin_email')?.value;

    // 세션이 없으면 로그인 안 됨
    if (!sessionToken || !adminEmail) {
      return NextResponse.json({
        authenticated: false,
        email: null,
      });
    }

    // 관리자 이메일 확인
    const isAdminEmail = ADMIN_EMAILS.some(
      (email) => email.toLowerCase() === adminEmail.toLowerCase()
    );

    if (!isAdminEmail) {
      // 권한이 없는 경우 세션 삭제
      cookieStore.delete('admin_session');
      cookieStore.delete('admin_email');
      
      return NextResponse.json({
        authenticated: false,
        email: null,
        error: '관리자 권한이 없습니다.',
      });
    }

    return NextResponse.json({
      authenticated: true,
      email: adminEmail,
    });
  } catch (error: any) {
    console.error('Session check error:', error);
    return NextResponse.json({
      authenticated: false,
      email: null,
      error: '세션 확인 중 오류가 발생했습니다.',
    });
  }
}
