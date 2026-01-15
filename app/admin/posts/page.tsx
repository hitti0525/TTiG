import { requireAdminAuth } from '@/lib/auth';
import AdminPostsClient from './AdminPostsClient';

export default async function AdminPosts() {
  // 🔒 인증 체크: 세션이 없거나 관리자 권한이 없으면 로그인 페이지로 리다이렉트
  await requireAdminAuth();

  return <AdminPostsClient />;
}
