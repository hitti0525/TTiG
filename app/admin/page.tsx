'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdminDashboard() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 데이터 불러오기
  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => {
        setPlaces(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching templates:', error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    const res = await fetch('/api/delete-place', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      alert("삭제되었습니다.");
      setPlaces(places.filter((p: any) => p.id !== id));
    } else {
      alert("삭제 실패");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ttig-bg p-8 pt-32 max-w-5xl mx-auto flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'PROPOSAL':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'PRIVATE':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'PUBLISHED';
      case 'PROPOSAL':
        return 'PROPOSAL';
      case 'PRIVATE':
        return 'PRIVATE';
      default:
        return 'DRAFT';
    }
  };

  // 통계 계산
  const totalViews = places.reduce((sum, place) => sum + (place.views_count || 0), 0);
  const totalKeeps = places.reduce((sum, place) => sum + (place.keeps_count || 0), 0);
  const totalShares = places.reduce((sum, place) => sum + (place.shares_count || 0), 0);
  const shareRate = totalViews > 0 ? ((totalShares / totalViews) * 100).toFixed(1) : '0.0';

  // 차트 데이터 준비 (상위 10개 공간)
  const chartData = places
    .map((place) => ({
      name: place.title.length > 15 ? place.title.substring(0, 15) + '...' : place.title,
      views: place.views_count || 0,
      keeps: place.keeps_count || 0,
    }))
    .sort((a, b) => (b.views + b.keeps) - (a.views + a.keeps))
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-[#F5F5F3] p-8 pt-32 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12 border-b border-black/10 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-black">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-2">Manage your archived spaces and inquiries.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/inquiries" 
            className="px-6 py-3 border border-black/20 text-black text-xs font-bold tracking-widest rounded-full hover:bg-black hover:text-white transition-all"
          >
            VIEW INQUIRIES
          </Link>
          <Link 
            href="/admin/write" 
            className="bg-black text-white px-6 py-3 text-xs font-bold tracking-widest rounded-full hover:bg-gray-800 transition-all"
          >
            + NEW SPACE
          </Link>
        </div>
      </div>

      {/* 통계 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 border border-black/10 rounded-lg">
          <div className="text-xs font-sans text-gray-500 uppercase tracking-widest mb-2">Total Views</div>
          <div className="text-4xl font-serif font-bold text-black">{totalViews.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 border border-black/10 rounded-lg">
          <div className="text-xs font-sans text-gray-500 uppercase tracking-widest mb-2">Total Keeps</div>
          <div className="text-4xl font-serif font-bold text-black">{totalKeeps.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 border border-black/10 rounded-lg">
          <div className="text-xs font-sans text-gray-500 uppercase tracking-widest mb-2">Share Rate</div>
          <div className="text-4xl font-serif font-bold text-black">{shareRate}%</div>
        </div>
      </div>

      {/* 차트 섹션 */}
      {chartData.length > 0 && (
        <div className="bg-white p-8 border border-black/10 rounded-lg mb-12">
          <h2 className="text-xl font-serif font-bold text-black mb-6">Most Engaged Spaces</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 11, fill: '#666' }}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#666' }}
                  stroke="#999"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e5e5',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="views" name="Views" fill="#111" radius={[0, 0, 0, 0]} />
                <Bar dataKey="keeps" name="Keeps" fill="#666" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-black"></div>
              <span className="text-xs font-sans text-gray-600">Views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500"></div>
              <span className="text-xs font-sans text-gray-600">Keeps</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {places.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p>등록된 공간이 없습니다.</p>
          </div>
        ) : (
          places.map((place: any) => (
            <div key={place.id} className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
              {/* 썸네일 */}
              <div className="w-full md:w-32 h-32 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                {place.image ? (
                  <Image src={place.image} alt={place.title} fill className="object-cover" sizes="128px" />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
                )}
              </div>

              {/* 정보 */}
              <div className="flex-grow text-center md:text-left">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {place.properties?.district || place.district || "SEOUL"} / {place.category}
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${getStatusBadgeColor(place.status)}`}>
                    {getStatusLabel(place.status)}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-black">{place.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{place.description || '-'}</p>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-3">
                <Link 
                  href={`/admin/write?id=${place.id}`}
                  className="px-4 py-2 border border-gray-300 text-xs font-bold rounded-lg hover:bg-black hover:text-white transition-colors"
                >
                  EDIT
                </Link>
                <button 
                  onClick={() => handleDelete(place.id)}
                  className="px-4 py-2 border border-red-200 text-red-500 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors"
                >
                  DELETE
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 하단 안내 */}
      <div className="mt-12 text-center text-xs text-gray-400">
        <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
          ← 메인 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
}
