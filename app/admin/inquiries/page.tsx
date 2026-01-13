import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export default async function AdminInquiries() {
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
    <div className="min-h-screen bg-[#F5F5F3] p-8 pt-32 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12 border-b border-black/10 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-black">CONTACT INQUIRIES</h1>
          <p className="text-sm text-gray-500 mt-2">문의 내역을 확인하세요.</p>
        </div>
        <Link 
          href="/admin" 
          className="text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest"
        >
          ← BACK TO DASHBOARD
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        {inquiries && inquiries.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-black text-white uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inquiries.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(item.created_at).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-gray-600">{item.email}</td>
                  <td className="px-6 py-4 text-gray-700 max-w-md">
                    <div className="truncate" title={item.message}>
                      {item.message}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      item.status === 'new' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {item.status === 'new' ? 'NEW' : item.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-400 mb-2">등록된 문의가 없습니다.</p>
            <p className="text-xs text-gray-400">
              Supabase 설정 후 문의가 표시됩니다.
            </p>
          </div>
        )}
      </div>

      {/* Supabase 설정 안내 */}
      {(!supabaseUrl || !supabaseKey) && (
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-bold text-yellow-800 mb-2">📝 Supabase 환경 변수 설정 필요</h3>
          <p className="text-xs text-yellow-700 mb-4">
            문의 기능을 사용하려면 .env.local 파일에 Supabase 환경 변수를 설정해주세요.
          </p>
          <pre className="text-xs bg-yellow-100 p-3 rounded mt-2">
            NEXT_PUBLIC_SUPABASE_URL=your_project_url{'\n'}
            NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
          </pre>
        </div>
      )}
      {hasError && (
        <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-bold text-red-800 mb-2">⚠️ 데이터 조회 오류</h3>
          <p className="text-xs text-red-700">
            문의 데이터를 불러오는 중 오류가 발생했습니다. 콘솔을 확인해주세요.
          </p>
        </div>
      )}
    </div>
  );
}