'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { createClient } from '@supabase/supabase-js';

export default function AdminDashboard() {
  const [places, setPlaces] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyVisitors, setDailyVisitors] = useState(0);

  // Supabase 클라이언트
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Places 데이터
        const placesRes = await fetch('/api/templates');
        const placesData = await placesRes.json();
        setPlaces(placesData || []);

        // Inquiries 데이터 (Supabase)
        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey);
          const { data: inquiriesData } = await supabase
            .from('inquiries')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
          
          if (inquiriesData) {
            setInquiries(inquiriesData);
          }
        }

        // Daily Visitors 계산 (오늘의 views_count 합계)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // 실제로는 Supabase analytics 테이블이 필요하지만, 현재는 places의 views_count 합계로 시뮬레이션
        const totalViews = (placesData || []).reduce((sum: number, place: any) => sum + (place.views_count || 0), 0);
        setDailyVisitors(Math.floor(totalViews / 30)); // 대략적인 일일 방문자 수

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [supabaseUrl, supabaseKey]);

  // 최근 7일간 방문 추이 데이터 생성 (시뮬레이션)
  const generateLast7DaysData = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('ko-KR', { weekday: 'short' });
      const dayNumber = date.getDate();
      
      // 랜덤한 방문자 수 생성 (실제로는 Supabase analytics에서 가져와야 함)
      const visitors = Math.floor(Math.random() * 50) + 20;
      
      days.push({
        day: `${dayNumber} ${dayName}`,
        visitors: visitors,
      });
    }
    
    return days;
  };

  const last7DaysData = generateLast7DaysData();

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8 pt-32 max-w-7xl mx-auto flex items-center justify-center">
        <p className="text-black font-sans text-sm">Loading...</p>
      </div>
    );
  }

  // 통계 계산
  const totalKeeps = places.reduce((sum, place) => sum + (place.keeps_count || 0), 0);

  return (
    <div className="min-h-screen bg-white p-12 pt-32 max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="mb-16 border-b border-black pb-8">
        <h1 className="text-6xl font-serif font-bold text-black mb-4 tracking-tight">Dashboard</h1>
        <div className="flex justify-between items-end">
          <p className="text-sm font-sans text-black/60 uppercase tracking-widest">Analytics & Management</p>
          <div className="flex gap-3">
            <Link 
              href="/admin/inquiries" 
              className="px-6 py-2 border border-black text-black text-xs font-sans font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all"
            >
              Inquiries
            </Link>
            <Link 
              href="/admin/write" 
              className="bg-black text-white px-6 py-2 text-xs font-sans font-bold tracking-widest uppercase hover:bg-black/80 transition-all"
            >
              + New Space
            </Link>
          </div>
        </div>
      </div>

      {/* 상단: 주요 지표 */}
      <div className="grid grid-cols-2 gap-12 mb-20">
        <div>
          <div className="text-xs font-sans text-black/40 uppercase tracking-widest mb-3">Total Keep</div>
          <div className="text-7xl font-sans font-bold text-black leading-none">{totalKeeps.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs font-sans text-black/40 uppercase tracking-widest mb-3">Daily Visitors</div>
          <div className="text-7xl font-sans font-bold text-black leading-none">{dailyVisitors.toLocaleString()}</div>
        </div>
      </div>

      {/* 중앙: 최근 7일간 방문 추이 선 그래프 */}
      <div className="mb-20">
        <h2 className="text-2xl font-serif font-bold text-black mb-8">Last 7 Days</h2>
        <div className="h-96 border-t border-b border-black/10 pt-8 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={last7DaysData} 
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="0" 
                stroke="#e5e5e5" 
                vertical={false}
                strokeWidth={0.5}
              />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 11, fill: '#666', fontFamily: 'sans-serif' }}
                stroke="#999"
                strokeWidth={0.5}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#666', fontFamily: 'sans-serif' }}
                stroke="#999"
                strokeWidth={0.5}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #000',
                  borderRadius: '0',
                  fontSize: '11px',
                  fontFamily: 'sans-serif',
                  padding: '8px 12px'
                }}
                cursor={{ stroke: '#000', strokeWidth: 0.5, strokeDasharray: '2 2' }}
              />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="#000" 
                strokeWidth={2}
                dot={{ fill: '#000', r: 3 }}
                activeDot={{ r: 5, stroke: '#000', strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 하단: 최신 문의 리스트 */}
      <div className="mb-20">
        <h2 className="text-2xl font-serif font-bold text-black mb-8">Recent Inquiries</h2>
        {inquiries.length === 0 ? (
          <div className="py-12 text-center border-t border-b border-black/10">
            <p className="text-sm font-sans text-black/40">No inquiries yet.</p>
          </div>
        ) : (
          <div className="space-y-0 border-t border-black/10">
            {inquiries.map((inquiry: any, index: number) => (
              <div 
                key={inquiry.id} 
                className="py-6 border-b border-black/10 hover:bg-black/5 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-xs font-sans font-bold text-black uppercase tracking-widest">
                        {inquiry.name || 'Anonymous'}
                      </span>
                      <span className="text-xs font-sans text-black/40">
                        {new Date(inquiry.created_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm font-sans text-black/80 leading-relaxed">
                      {inquiry.message || '-'}
                    </p>
                    <p className="text-xs font-sans text-black/40 mt-2">{inquiry.email}</p>
                  </div>
                  {inquiry.status === 'new' && (
                    <span className="text-[10px] font-sans font-bold text-black uppercase tracking-widest border border-black px-2 py-1">
                      New
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 공간 목록 (기존 기능 유지) */}
      <div className="mb-12">
        <h2 className="text-2xl font-serif font-bold text-black mb-8">Spaces</h2>
        <div className="space-y-2">
          {places.length === 0 ? (
            <div className="py-12 text-center border-t border-b border-black/10">
              <p className="text-sm font-sans text-black/40">No spaces yet.</p>
            </div>
          ) : (
            places.map((place: any) => (
              <div 
                key={place.id} 
                className="py-4 border-b border-black/10 hover:bg-black/5 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-black mb-1">{place.title}</h3>
                    <p className="text-xs font-sans text-black/40 uppercase tracking-widest">
                      {place.category} / {place.district || 'SEOUL'}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link 
                      href={`/admin/write?id=${place.id}`}
                      className="text-xs font-sans font-bold text-black uppercase tracking-widest border border-black px-4 py-2 hover:bg-black hover:text-white transition-all"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
