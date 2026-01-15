'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { createClient } from '@supabase/supabase-js';
import ErrorBoundary from '../components/ErrorBoundary';
import DateFormatter from '../components/DateFormatter';

// 차트 섹션 전체를 동적으로 import (클라이언트 사이드에서만 로드)
const TrafficSourceChart = dynamic(
  () => import('./components/TrafficSourceChart'),
  { ssr: false, loading: () => <div className="h-48 flex items-center justify-center text-sm text-[#111111]/40">로딩 중...</div> }
);

const VisitorTrendChart = dynamic(
  () => import('./components/VisitorTrendChart'),
  { ssr: false, loading: () => <div className="h-80 flex items-center justify-center text-sm text-[#111111]/40">로딩 중...</div> }
);

export default function AdminDashboard() {
  const [places, setPlaces] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
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
      try {
        const placesRes = await fetch('/api/templates');
        if (placesRes.ok) {
          const placesData = await placesRes.json();
          setPlaces(Array.isArray(placesData) ? placesData : []);
        }
      } catch (error) {
        console.error('Error fetching places:', error);
        setPlaces([]);
      }

      // Inquiries 데이터 (Supabase)
      if (supabaseUrl && supabaseKey) {
        try {
          const supabase = createClient(supabaseUrl, supabaseKey);
          const { data: inquiriesData, error: inquiriesError } = await supabase
            .from('inquiries')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
          
          if (inquiriesError) {
            console.error('Error fetching inquiries:', inquiriesError);
            setInquiries([]);
          } else {
            setInquiries(Array.isArray(inquiriesData) ? inquiriesData : []);
          }
        } catch (error) {
          console.error('Exception fetching inquiries:', error);
          setInquiries([]);
        }
      } else {
        setInquiries([]);
      }

      // Analytics 데이터 (실제 방문자 추적)
      try {
        const analyticsRes = await fetch('/api/analytics', { cache: 'no-store' });
        const analyticsResult = await analyticsRes.json();
        
        // 데이터가 없어도 빈 배열로 설정 (에러 방지)
        const safeAnalyticsData = Array.isArray(analyticsResult?.data) ? analyticsResult.data : [];
        setAnalyticsData(safeAnalyticsData);
        
        // 오늘 날짜의 방문자 수 및 트래픽 소스
        const today = new Date().toISOString().split('T')[0];
        const todayData = safeAnalyticsData?.find((d: any) => d?.date === today);
        
        // 안전하게 방문자 수 설정
        setDailyVisitors(todayData?.visitors ?? 0);
        
        // 트래픽 소스별 통계 (데이터가 없어도 기본값으로 설정)
        try {
          let trafficSourcesData = todayData?.traffic_sources;
          
          // JSONB가 문자열로 올 수 있으므로 파싱 시도
          if (typeof trafficSourcesData === 'string') {
            try {
              trafficSourcesData = JSON.parse(trafficSourcesData);
            } catch (parseError) {
              console.warn('Failed to parse traffic_sources:', parseError);
              trafficSourcesData = null;
            }
          }
          
          if (trafficSourcesData && typeof trafficSourcesData === 'object' && !Array.isArray(trafficSourcesData)) {
            setTrafficSources({
              organic: Number(trafficSourcesData?.organic) || 0,
              direct: Number(trafficSourcesData?.direct) || 0,
              referral: Number(trafficSourcesData?.referral) || 0,
              social: Number(trafficSourcesData?.social) || 0,
            });
          } else {
            // 기본값 설정 (데이터가 없을 때)
            setTrafficSources({
              organic: 0,
              direct: 0,
              referral: 0,
              social: 0,
            });
          }
        } catch (error) {
          console.error('Error parsing traffic sources:', error);
          // 에러 발생 시 기본값
          setTrafficSources({
            organic: 0,
            direct: 0,
            referral: 0,
            social: 0,
          });
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // 에러 발생 시 빈 배열과 기본값 설정
        setAnalyticsData([]);
        setDailyVisitors(0);
        setTrafficSources({
          organic: 0,
          direct: 0,
          referral: 0,
          social: 0,
        });
      }

      // 모든 데이터 로드 완료
    } catch (error) {
      console.error('Error fetching data:', error);
      // 에러 발생 시에도 기본값 설정
      setPlaces([]);
      setInquiries([]);
      setAnalyticsData([]);
      setDailyVisitors(0);
      setTrafficSources({
        organic: 0,
        direct: 0,
        referral: 0,
        social: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // 클라이언트 마운트 확인 (hydration mismatch 방지)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // 클라이언트에서만 데이터 로드
    if (!isMounted) return;
    
    // 초기 데이터 로드
    let isMounted = true;
    
    const loadData = async () => {
      try {
        await fetchData();
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in initial data load:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadData();
    
    // 30초마다 자동 새로고침 (실시간 통계 반영)
    const interval = setInterval(() => {
      if (isMounted) {
        fetchData().catch((error) => {
          console.error('Error in interval fetch:', error);
        });
      }
    }, 30000); // 30초

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isMounted, supabaseUrl, supabaseKey]);

  // 최근 7일간 방문 추이 데이터 생성 (클라이언트에서만 실행)
  const [last7DaysData, setLast7DaysData] = useState<Array<{ day: string; visitors: number }>>([]);

  useEffect(() => {
    // 클라이언트에서만 날짜 포맷팅 실행 (hydration mismatch 방지)
    if (!isMounted || typeof window === 'undefined') return;
    
    const days = [];
    const today = new Date();
    
    // analytics 데이터가 없어도 7일간의 빈 데이터 생성 (에러 방지)
    const safeAnalyticsData = Array.isArray(analyticsData) ? analyticsData : [];
    
    // 고정된 날짜 포맷터 (타임존 차이 방지)
    const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
      weekday: 'short',
      timeZone: 'Asia/Seoul'
    });
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0); // 시간을 0으로 고정
      
      // 고정된 형식으로 날짜 포맷팅
      const dayName = dateFormatter.format(date);
      const dayNumber = date.getDate();
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // analytics 데이터에서 해당 날짜 찾기 (안전하게)
      const dayData = safeAnalyticsData?.find((d: any) => d?.date === dateString);
      const visitors = dayData?.visitors ?? 0;
      
      days.push({
        day: `${dayNumber} ${dayName}`,
        visitors: Number(visitors) || 0,
      });
    }
    
    setLast7DaysData(days);
  }, [isMounted, analyticsData]);

  // 클라이언트에서만 렌더링 (hydration mismatch 방지)
  // isMounted가 true일 때만 전체 대시보드 UI를 렌더링
  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] p-8 pt-32 max-w-7xl mx-auto flex items-center justify-center">
        <p className="text-[#111111] font-sans text-sm">로딩 중...</p>
      </div>
    );
  }

  // 통계 계산 (안전하게)
  const totalKeeps = Array.isArray(places) 
    ? places.reduce((sum: number, place: any) => sum + (Number(place?.keeps_count) || 0), 0)
    : 0;

  return (
    <ErrorBoundary>
      <div className="p-12" suppressHydrationWarning>
      {/* 헤더 */}
      <div className="mb-12 border-b border-[#111111]/10 pb-6">
        <h1 className="text-4xl font-serif font-bold text-[#111111] mb-3 tracking-tight">대시보드</h1>
        <p className="text-sm font-sans text-[#111111]/60">분석 및 관리</p>
      </div>

      {/* 상단: 주요 지표 */}
      <div className="grid grid-cols-2 gap-12 mb-16">
        <div>
          <div className="text-xs font-sans text-[#111111]/40 mb-2">총 Keep 수</div>
          <div className="text-5xl font-sans font-bold text-[#111111] leading-none" suppressHydrationWarning>
            {typeof window !== 'undefined' ? totalKeeps.toLocaleString() : totalKeeps.toString()}
          </div>
        </div>
        <div>
          <div className="text-xs font-sans text-[#111111]/40 mb-2">일일 방문자</div>
          <div className="text-5xl font-sans font-bold text-[#111111] leading-none" suppressHydrationWarning>
            {typeof window !== 'undefined' ? dailyVisitors.toLocaleString() : dailyVisitors.toString()}
          </div>
        </div>
      </div>

      {/* 트래픽 소스별 통계 */}
      <div className="mb-16">
        <h2 className="text-xl font-serif font-bold text-[#111111] mb-6">트래픽 소스 (오늘)</h2>
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="border-t border-[#111111]/10 pt-4">
            <div className="text-xs font-sans text-[#111111]/40 mb-2">검색 엔진</div>
            <div className="text-3xl font-sans font-bold text-[#111111] leading-none">
              {trafficSources?.organic ?? 0}
            </div>
            <div className="text-[10px] font-sans text-[#111111]/40 mt-1">
              {dailyVisitors > 0 && trafficSources?.organic 
                ? Math.round((Number(trafficSources.organic) / dailyVisitors) * 100) 
                : 0}%
            </div>
          </div>
          <div className="border-t border-[#111111]/10 pt-4">
            <div className="text-xs font-sans text-[#111111]/40 mb-2">직접 접속</div>
            <div className="text-3xl font-sans font-bold text-[#111111] leading-none">
              {trafficSources?.direct ?? 0}
            </div>
            <div className="text-[10px] font-sans text-[#111111]/40 mt-1">
              {dailyVisitors > 0 && trafficSources?.direct 
                ? Math.round((Number(trafficSources.direct) / dailyVisitors) * 100) 
                : 0}%
            </div>
          </div>
          <div className="border-t border-[#111111]/10 pt-4">
            <div className="text-xs font-sans text-[#111111]/40 mb-2">외부 링크</div>
            <div className="text-3xl font-sans font-bold text-[#111111] leading-none">
              {trafficSources?.referral ?? 0}
            </div>
            <div className="text-[10px] font-sans text-[#111111]/40 mt-1">
              {dailyVisitors > 0 && trafficSources?.referral 
                ? Math.round((Number(trafficSources.referral) / dailyVisitors) * 100) 
                : 0}%
            </div>
          </div>
          <div className="border-t border-[#111111]/10 pt-4">
            <div className="text-xs font-sans text-[#111111]/40 mb-2">소셜 미디어</div>
            <div className="text-3xl font-sans font-bold text-[#111111] leading-none">
              {trafficSources?.social ?? 0}
            </div>
            <div className="text-[10px] font-sans text-[#111111]/40 mt-1">
              {dailyVisitors > 0 && trafficSources?.social 
                ? Math.round((Number(trafficSources.social) / dailyVisitors) * 100) 
                : 0}%
            </div>
          </div>
        </div>
        
        {/* 트래픽 소스 막대 그래프 */}
        <div className="h-48 border-t border-b border-[#111111]/10 pt-6 pb-4">
          <TrafficSourceChart trafficSources={trafficSources} dailyVisitors={dailyVisitors} />
        </div>
      </div>

      {/* 중앙: 최근 7일간 방문 추이 선 그래프 */}
      <div className="mb-16">
        <h2 className="text-xl font-serif font-bold text-[#111111] mb-6">최근 7일간 방문 추이</h2>
        <div className="h-80 border-t border-b border-[#111111]/10 pt-6 pb-4">
          <VisitorTrendChart data={last7DaysData} />
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
            {Array.isArray(inquiries) && inquiries.length > 0 ? (
              inquiries.map((inquiry: any, index: number) => {
                if (!inquiry || !inquiry.id) return null;
                
                return (
                  <div 
                    key={inquiry.id || index} 
                    className="py-6 border-b border-[#111111]/10 hover:bg-[#111111]/5 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-xs font-sans font-bold text-[#111111]">
                            {inquiry?.name || '익명'}
                          </span>
                      <span className="text-xs font-sans text-[#111111]/40">
                        {inquiry?.created_at 
                          ? <DateFormatter dateString={inquiry.created_at} format="full" />
                          : '-'}
                      </span>
                        </div>
                        <p className="text-sm font-sans text-[#111111]/80 leading-relaxed">
                          {inquiry?.message || '-'}
                        </p>
                        <p className="text-xs font-sans text-[#111111]/40 mt-2">
                          {inquiry?.email || '-'}
                        </p>
                      </div>
                      {inquiry?.status === 'new' && (
                        <span className="text-[10px] font-sans font-bold text-[#111111] border border-[#111111] px-2 py-1">
                          신규
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center border-t border-b border-[#111111]/10">
                <p className="text-sm font-sans text-[#111111]/40">문의 내역이 없습니다.</p>
              </div>
            )}
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
    </ErrorBoundary>
  );
}
