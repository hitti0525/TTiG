import dynamic from 'next/dynamic';
import { requireAdminAuth } from '@/lib/auth';

// No-SSR 래퍼: 전체 대시보드를 클라이언트에서만 렌더링
// 서버에서는 완전히 빈 HTML만 반환하여 hydration mismatch 원천 차단
const DashboardContent = dynamic(
  () => import('./components/DashboardContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#F5F5F3] p-8 pt-32 max-w-7xl mx-auto flex items-center justify-center">
        <p className="text-[#111111] font-sans text-sm">로딩 중...</p>
      </div>
    )
  }
);

export default async function AdminDashboard() {
  // 🔒 인증 체크: 세션이 없거나 관리자 권한이 없으면 로그인 페이지로 리다이렉트
  // 미들웨어에서 이미 체크하지만, 이중 보안을 위해 서버 컴포넌트에서도 체크
  const session = await requireAdminAuth();
  
  // 디버깅: 프로덕션에서는 제거 가능
  if (process.env.NODE_ENV === 'development') {
    console.log('[Admin Page] Session verified:', {
      authenticated: session.authenticated,
      email: session.email,
    });
  }

  // 서버에서는 완전히 빈 HTML만 반환 (정적 HTML 일치)
  // 클라이언트에서만 DashboardContent가 렌더링됨
  return <DashboardContent />;
}
