'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { createClient } from '@supabase/supabase-js';

export default function AdminDashboard() {
  const [places, setPlaces] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyVisitors, setDailyVisitors] = useState(0);
  const [trafficSources, setTrafficSources] = useState({
    organic: 0,
    direct: 0,
    referral: 0,
    social: 0
  });

  // Supabase 클라이언트
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 삭제 핸들러
  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    
    try {
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
    } catch (error) {
      console.error('Delete error:', error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 데이터 불러오기
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

      // Analytics 데이터 (실제 방문자 추적)
      try {
        const analyticsRes = await fetch('/api/analytics', { cache: 'no-store' });
        const analyticsResult = await analyticsRes.json();
        if (analyticsResult.data) {
          setAnalyticsData(analyticsResult.data);
          
          // 오늘 날짜의 방문자 수 및 트래픽 소스
          const today = new Date().toISOString().split('T')[0];
          const todayData = analyticsResult.data.find((d: any) => d.date === today);
          setDailyVisitors(todayData?.visitors || 0);
          
          // 트래픽 소스별 통계
          if (todayData?.traffic_sources) {
            setTrafficSources({
              organic: todayData.traffic_sources.organic || 0,
              direct: todayData.traffic_sources.direct || 0,
              referral: todayData.traffic_sources.referral || 0,
              social: todayData.traffic_sources.social || 0,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // 폴백: views_count 기반 추정
        const totalViews = (placesData || []).reduce((sum: number, place: any) => sum + (place.views_count || 0), 0);
        const estimatedUniqueVisitors = Math.floor(totalViews / 4);
        setDailyVisitors(Math.max(1, Math.floor(estimatedUniqueVisitors / 30)));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // 30초마다 자동 새로고침 (실시간 통계 반영)
    const interval = setInterval(() => {
      fetchData();
    }, 30000); // 30초

    return () => clearInterval(interval);
  }, [supabaseUrl, supabaseKey]);

  // 최근 7일간 방문 추이 데이터 생성 (실제 analytics 데이터 사용)
  const generateLast7DaysData = () => {
    const days = [];
    const today = new Date();
    
    // analytics 데이터가 있으면 실제 데이터 사용, 없으면 빈 데이터
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('ko-KR', { weekday: 'short' });
      const dayNumber = date.getDate();
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // analytics 데이터에서 해당 날짜 찾기
      const dayData = analyticsData.find((d: any) => d.date === dateString);
      const visitors = dayData?.visitors || 0;
      
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
      <div className="min-h-screen bg-[#F5F5F3] p-8 pt-32 max-w-7xl mx-auto flex items-center justify-center">
        <p className="text-[#111111] font-sans text-sm">로딩 중...</p>
      </div>
    );
  }

  // 통계 계산
  const totalKeeps = places.reduce((sum, place) => sum + (place.keeps_count || 0), 0);

  return (
    <div className="p-12">
      {/* 헤더 */}
      <div className="mb-12 border-b border-[#111111]/10 pb-6">
        <h1 className="text-4xl font-serif font-bold text-[#111111] mb-3 tracking-tight">대시보드</h1>
        <p className="text-sm font-sans text-[#111111]/60">분석 및 관리</p>
      </div>

      {/* 상단: 주요 지표 */}
      <div className="grid grid-cols-2 gap-12 mb-16">
        <div>
          <div className="text-xs font-sans text-[#111111]/40 mb-2">총 Keep 수</div>
          <div className="text-5xl font-sans font-bold text-[#111111] leading-none">{totalKeeps.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs font-sans text-[#111111]/40 mb-2">일일 방문자</div>
          <div className="text-5xl font-sans font-bold text-[#111111] leading-none">{dailyVisitors.toLocaleString()}</div>
        </div>
      </div>

      {/* 트래픽 소스별 통계 */}
      <div className="mb-16">
        <h2 className="text-xl font-serif font-bold text-[#111111] mb-6">트래픽 소스 (오늘)</h2>
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="border-t border-[#111111]/10 pt-4">
            <div className="text-xs font-sans text-[#111111]/40 mb-2">검색 엔진</div>
            <div className="text-3xl font-sans font-bold text-[#111111] leading-none">{trafficSources.organic}</div>
            <div className="text-[10px] font-sans text-[#111111]/40 mt-1">
              {dailyVisitors > 0 ? Math.round((trafficSources.organic / dailyVisitors) * 100) : 0}%
            </div>
          </div>
          <div className="border-t border-[#111111]/10 pt-4">
            <div className="text-xs font-sans text-[#111111]/40 mb-2">직접 접속</div>
            <div className="text-3xl font-sans font-bold text-[#111111] leading-none">{trafficSources.direct}</div>
            <div className="text-[10px] font-sans text-[#111111]/40 mt-1">
              {dailyVisitors > 0 ? Math.round((trafficSources.direct / dailyVisitors) * 100) : 0}%
            </div>
          </div>
          <div className="border-t border-[#111111]/10 pt-4">
            <div className="text-xs font-sans text-[#111111]/40 mb-2">외부 링크</div>
            <div className="text-3xl font-sans font-bold text-[#111111] leading-none">{trafficSources.referral}</div>
            <div className="text-[10px] font-sans text-[#111111]/40 mt-1">
              {dailyVisitors > 0 ? Math.round((trafficSources.referral / dailyVisitors) * 100) : 0}%
            </div>
          </div>
          <div className="border-t border-[#111111]/10 pt-4">
            <div className="text-xs font-sans text-[#111111]/40 mb-2">소셜 미디어</div>
            <div className="text-3xl font-sans font-bold text-[#111111] leading-none">{trafficSources.social}</div>
            <div className="text-[10px] font-sans text-[#111111]/40 mt-1">
              {dailyVisitors > 0 ? Math.round((trafficSources.social / dailyVisitors) * 100) : 0}%
            </div>
          </div>
        </div>
        
        {/* 트래픽 소스 막대 그래프 */}
        <div className="h-48 border-t border-b border-[#111111]/10 pt-6 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={[
                { name: '검색', value: trafficSources.organic, label: '검색 엔진' },
                { name: '직접', value: trafficSources.direct, label: '직접 접속' },
                { name: '외부', value: trafficSources.referral, label: '외부 링크' },
                { name: '소셜', value: trafficSources.social, label: '소셜 미디어' },
              ]}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="0" 
                stroke="#e5e5e5" 
                vertical={false}
                strokeWidth={0.5}
              />
              <XAxis 
                dataKey="name" 
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
                  backgroundColor: '#F5F5F3', 
                  border: '1px solid #111111',
                  borderRadius: '0',
                  fontSize: '11px',
                  fontFamily: 'sans-serif',
                  padding: '8px 12px'
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value}명 (${dailyVisitors > 0 ? Math.round((value / dailyVisitors) * 100) : 0}%)`,
                  props.payload.label
                ]}
              />
              <Bar 
                dataKey="value" 
                fill="#111111"
                radius={[0, 0, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 중앙: 최근 7일간 방문 추이 선 그래프 */}
      <div className="mb-16">
        <h2 className="text-xl font-serif font-bold text-[#111111] mb-6">최근 7일간 방문 추이</h2>
        <div className="h-80 border-t border-b border-[#111111]/10 pt-6 pb-4">
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
                  backgroundColor: '#F5F5F3', 
                  border: '1px solid #111111',
                  borderRadius: '0',
                  fontSize: '11px',
                  fontFamily: 'sans-serif',
                  padding: '8px 12px'
                }}
                cursor={{ stroke: '#111111', strokeWidth: 0.5, strokeDasharray: '2 2' }}
              />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="#111111" 
                strokeWidth={2}
                dot={{ fill: '#111111', r: 3 }}
                activeDot={{ r: 5, stroke: '#111111', strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 하단: 최신 문의 리스트 */}
      <div className="mb-16">
        <h2 className="text-xl font-serif font-bold text-[#111111] mb-6">최근 문의</h2>
        {inquiries.length === 0 ? (
          <div className="py-12 text-center border-t border-b border-[#111111]/10">
            <p className="text-sm font-sans text-[#111111]/40">문의 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-0 border-t border-[#111111]/10">
            {inquiries.map((inquiry: any, index: number) => (
              <div 
                key={inquiry.id} 
                className="py-6 border-b border-[#111111]/10 hover:bg-[#111111]/5 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-xs font-sans font-bold text-[#111111]">
                        {inquiry.name || '익명'}
                      </span>
                      <span className="text-xs font-sans text-[#111111]/40">
                        {new Date(inquiry.created_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm font-sans text-[#111111]/80 leading-relaxed">
                      {inquiry.message || '-'}
                    </p>
                    <p className="text-xs font-sans text-[#111111]/40 mt-2">{inquiry.email}</p>
                  </div>
                  {inquiry.status === 'new' && (
                    <span className="text-[10px] font-sans font-bold text-[#111111] border border-[#111111] px-2 py-1">
                      신규
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 빠른 링크 */}
      <div className="mb-12">
        <h2 className="text-xl font-serif font-bold text-[#111111] mb-6">빠른 링크</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/admin/posts"
            className="bg-white border border-[#111111]/10 p-6 rounded-lg hover:bg-[#111111]/5 transition-colors"
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="text-sm font-serif font-bold text-[#111111] mb-1">게시글 목록</div>
            <div className="text-xs font-sans text-[#111111]/40">모든 공간 통계 보기</div>
          </Link>
          <Link
            href="/admin/inquiries"
            className="bg-white border border-[#111111]/10 p-6 rounded-lg hover:bg-[#111111]/5 transition-colors"
          >
            <div className="text-2xl mb-2">📧</div>
            <div className="text-sm font-serif font-bold text-[#111111] mb-1">문의 내역</div>
            <div className="text-xs font-sans text-[#111111]/40">최신 문의 확인</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
