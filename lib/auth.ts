import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// 🔒 관리자 이메일 허용 목록 (모든 파일에서 동일하게 유지)
export const ADMIN_EMAILS = [
  'hitti0525@gmail.com',
  // 추가 관리자 이메일을 여기에 추가할 수 있습니다
];

/**
 * 세션 확인 및 인증 체크
 * @returns {Promise<{authenticated: boolean, email: string | null}>}
 */
export async function checkAdminSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;
  const adminEmail = cookieStore.get('admin_email')?.value;

  // 세션이 없으면 로그인 안 됨
  if (!sessionToken || !adminEmail) {
    return { authenticated: false, email: null };
  }

  // 관리자 이메일 확인
  const isAdminEmail = ADMIN_EMAILS.some(
    (email) => email.toLowerCase() === adminEmail.toLowerCase()
  );

  if (!isAdminEmail) {
    return { authenticated: false, email: null };
  }

  return { authenticated: true, email: adminEmail };
}

/**
 * 관리자 페이지 접근 시 인증 체크 및 리다이렉트
 * 인증되지 않은 경우 /login으로 리다이렉트
 */
export async function requireAdminAuth() {
  const session = await checkAdminSession();
  
  if (!session.authenticated) {
    redirect('/login');
  }

  return session;
}
