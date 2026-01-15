import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import DateFormatter from '../components/DateFormatter';
import { requireAdminAuth } from '@/lib/auth';

export default async function AdminInquiries() {
  // 🔒 인증 체크: 세션이 없거나 관리자 권한이 없으면 로그인 페이지로 리다이렉트
  await requireAdminAuth();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  let inquiries: any[] = [];
  let hasError = false;

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 최신 문의순으로 가져오기
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('문의 조회 실패:', error);
      hasError = true;
    } else {
      inquiries = data || [];
    }
  }

  return (
    <div className="p-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#111111] mb-3">문의 내역</h1>
        <p className="text-sm font-sans text-[#111111]/60">문의 내역을 확인하세요</p>
      </div>

      <div className="bg-white rounded-lg overflow-hidden border border-[#111111]/10">
        {inquiries && inquiries.length > 0 ? (
          <table className="w-full">
            <thead className="bg-[#111111]/5 border-b border-[#111111]/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-sans font-bold text-[#111111] uppercase tracking-widest">일자</th>
                <th className="px-6 py-4 text-left text-xs font-sans font-bold text-[#111111] uppercase tracking-widest">이름</th>
                <th className="px-6 py-4 text-left text-xs font-sans font-bold text-[#111111] uppercase tracking-widest">이메일</th>
                <th className="px-6 py-4 text-left text-xs font-sans font-bold text-[#111111] uppercase tracking-widest">메시지</th>
                <th className="px-6 py-4 text-center text-xs font-sans font-bold text-[#111111] uppercase tracking-widest">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111111]/10">
              {inquiries.map((item: any) => (
                <tr key={item.id} className="hover:bg-[#111111]/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-sans text-[#111111]/60">
                    <DateFormatter dateString={item.created_at} format="short" />
                  </td>
                  <td className="px-6 py-4 text-sm font-sans font-medium text-[#111111]">{item.name}</td>
                  <td className="px-6 py-4 text-sm font-sans text-[#111111]/80">{item.email}</td>
                  <td className="px-6 py-4 text-sm font-sans text-[#111111]/80 max-w-md">
                    <div className="truncate" title={item.message}>
                      {item.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-sans font-bold px-2 py-1 ${
                      item.status === 'new' 
                        ? 'bg-[#111111] text-white' 
                        : 'bg-[#111111]/10 text-[#111111]/60'
                    }`}>
                      {item.status === 'new' ? '신규' : '처리됨'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm font-sans text-[#111111]/40 mb-2">등록된 문의가 없습니다.</p>
            <p className="text-xs font-sans text-[#111111]/40">
              Supabase 설정 후 문의가 표시됩니다.
            </p>
          </div>
        )}
      </div>

      {/* Supabase 설정 안내 */}
      {(!supabaseUrl || !supabaseKey) && (
        <div className="mt-8 p-6 bg-[#111111]/5 border border-[#111111]/10 rounded-lg">
          <h3 className="text-sm font-sans font-bold text-[#111111] mb-2">📝 Supabase 환경 변수 설정 필요</h3>
          <p className="text-xs font-sans text-[#111111]/60 mb-4">
            문의 기능을 사용하려면 .env.local 파일에 Supabase 환경 변수를 설정해주세요.
          </p>
          <pre className="text-xs font-sans bg-[#111111]/5 p-3 rounded mt-2 text-[#111111]/80">
            NEXT_PUBLIC_SUPABASE_URL=your_project_url{'\n'}
            NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
          </pre>
        </div>
      )}
      {hasError && (
        <div className="mt-8 p-6 bg-[#111111]/5 border border-[#111111]/10 rounded-lg">
          <h3 className="text-sm font-sans font-bold text-[#111111] mb-2">⚠️ 데이터 조회 오류</h3>
          <p className="text-xs font-sans text-[#111111]/60">
            문의 데이터를 불러오는 중 오류가 발생했습니다. 콘솔을 확인해주세요.
          </p>
        </div>
      )}
    </div>
  );
}