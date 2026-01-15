'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPostsClient() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => {
        setPlaces(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching places:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center">
        <p className="text-[#111111] font-sans text-sm">로딩 중...</p>
      </div>
    );
  }

  // 날짜 포맷팅 (고정된 형식으로 타임존 차이 방지)
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    if (typeof window === 'undefined') {
      // 서버에서는 간단한 포맷
      return new Date(dateString).toISOString().split('T')[0];
    }
    // 클라이언트에서는 고정된 형식 사용
    const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Seoul'
    });
    return dateFormatter.format(new Date(dateString));
  };

  return (
    <div className="p-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#111111] mb-3">게시글 목록</h1>
        <p className="text-sm font-sans text-[#111111]/60">모든 공간의 통계를 확인하세요</p>
      </div>

      {/* 테이블 */}
      <div className="bg-white border border-[#111111]/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111111]/5 border-b border-[#111111]/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-sans font-bold text-[#111111] uppercase tracking-widest">
                  제목
                </th>
                <th className="px-6 py-4 text-left text-xs font-sans font-bold text-[#111111] uppercase tracking-widest">
                  일자
                </th>
                <th className="px-6 py-4 text-right text-xs font-sans font-bold text-[#111111] uppercase tracking-widest">
                  방문자
                </th>
                <th className="px-6 py-4 text-right text-xs font-sans font-bold text-[#111111] uppercase tracking-widest">
                  Keep
                </th>
                <th className="px-6 py-4 text-right text-xs font-sans font-bold text-[#111111] uppercase tracking-widest">
                  Share
                </th>
                <th className="px-6 py-4 text-center text-xs font-sans font-bold text-[#111111] uppercase tracking-widest">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111111]/10">
              {places.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm font-sans text-[#111111]/40">
                    등록된 게시글이 없습니다.
                  </td>
                </tr>
              ) : (
                places.map((place: any) => (
                  <tr key={place.id} className="hover:bg-[#111111]/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-serif font-bold text-[#111111] mb-1">
                          {place.title}
                        </div>
                        <div className="text-xs font-sans text-[#111111]/40">
                          {place.category} / {place.district || '서울'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-sans text-[#111111]/60">
                      {formatDate(place.updatedAt || place.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-sans font-bold text-[#111111]">
                        {typeof window !== 'undefined' 
                          ? (place.views_count || 0).toLocaleString() 
                          : (place.views_count || 0).toString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-sans font-bold text-[#111111]">
                        {typeof window !== 'undefined' 
                          ? (place.keeps_count || 0).toLocaleString() 
                          : (place.keeps_count || 0).toString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-sans font-bold text-[#111111]">
                        {typeof window !== 'undefined' 
                          ? (place.shares_count || 0).toLocaleString() 
                          : (place.shares_count || 0).toString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/admin/write?id=${place.id}`}
                        className="text-xs font-sans font-bold text-[#111111] border border-[#111111] px-3 py-1.5 hover:bg-[#111111] hover:text-white transition-all inline-block"
                      >
                        수정
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
