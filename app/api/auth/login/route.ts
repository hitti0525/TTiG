import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { ADMIN_EMAILS } from '@/lib/auth';

// 🔒 관리자 비밀번호 (환경 변수로 관리 권장)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'oppaya0525';

// 세션 토큰 생성 (간단한 랜덤 문자열, 실제로는 JWT 등을 사용 권장)
function generateSessionToken(): string {
  return Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 입력 검증
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 관리자 이메일 확인
    const isAdminEmail = ADMIN_EMAILS.some(
      (adminEmail) => adminEmail.toLowerCase() === email.toLowerCase()
    );

    if (!isAdminEmail) {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 비밀번호 확인
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 세션 토큰 생성
    const sessionToken = generateSessionToken();
    const sessionData = {
      email: email.toLowerCase(),
      loggedInAt: new Date().toISOString(),
    };

    // httpOnly 쿠키 설정 (보안 강화)
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === 'production';
    
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true, // JavaScript로 접근 불가 (XSS 방지)
      secure: isProduction, // HTTPS에서만 전송 (프로덕션)
      sameSite: 'lax', // CSRF 방지
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    });

    // 세션 데이터도 쿠키에 저장 (간단한 구현, 실제로는 Redis/DB 사용 권장)
    cookieStore.set('admin_email', email.toLowerCase(), {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: '로그인 성공',
      email: email.toLowerCase(),
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
