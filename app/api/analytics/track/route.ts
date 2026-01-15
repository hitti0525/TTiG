import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
    }

    // 봇 필터링 (User-Agent 확인)
    const userAgent = request.headers.get('user-agent') || '';
    const botPatterns = [
      /bot/i, /crawler/i, /spider/i, /crawling/i,
      /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i,
      /baiduspider/i, /yandexbot/i, /sogou/i, /exabot/i,
      /facebot/i, /ia_archiver/i, /naver/i, /Yeti/i,
      /HeadlessChrome/i, /PhantomJS/i, /curl/i, /wget/i,
      /python/i, /java/i, /node/i, /postman/i, /insomnia/i,
    ];
    
    const isBot = botPatterns.some(pattern => pattern.test(userAgent));
    if (isBot) {
      return NextResponse.json({ success: false, error: 'Bot detected' }, { status: 200 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식

    // 트래픽 소스 분류 (마케터 표준 분류)
    const referrer = request.headers.get('referer') || request.headers.get('referrer') || '';
    let url: URL;
    try {
      url = new URL(request.url);
    } catch (e) {
      // URL 파싱 실패 시 기본값 사용
      url = new URL('http://localhost');
    }
    const utmSource = url.searchParams.get('utm_source');
    const utmMedium = url.searchParams.get('utm_medium');
    
    // 소스 분류 함수
    function classifyTrafficSource(): 'organic' | 'direct' | 'referral' | 'social' {
      // UTM 파라미터 우선
      if (utmMedium) {
        if (utmMedium.toLowerCase().includes('social') || 
            ['facebook', 'instagram', 'twitter', 'linkedin', 'kakao', 'naver'].includes(utmSource?.toLowerCase() || '')) {
          return 'social';
        }
        if (utmMedium.toLowerCase() === 'organic' || utmMedium.toLowerCase() === 'search') {
          return 'organic';
        }
        if (utmMedium.toLowerCase() === 'referral') {
          return 'referral';
        }
      }
      
      // Referrer 분석
      if (referrer) {
        try {
          const referrerUrl = new URL(referrer);
          const hostname = referrerUrl.hostname.toLowerCase();
          
          // 검색 엔진 (Organic)
          const searchEngines = [
            'google.com', 'google.co.kr', 'google.co.jp',
            'naver.com', 'search.naver.com',
            'daum.net', 'search.daum.net',
            'bing.com', 'yahoo.com', 'duckduckgo.com'
          ];
          if (searchEngines.some(se => hostname.includes(se))) {
            return 'organic';
          }
          
          // 소셜 미디어
          const socialPlatforms = [
            'facebook.com', 'instagram.com', 'twitter.com', 'x.com',
            'linkedin.com', 'pinterest.com', 'youtube.com',
            'kakao.com', 'kakaocorp.com', 'brunch.co.kr'
          ];
          if (socialPlatforms.some(sp => hostname.includes(sp))) {
            return 'social';
          }
          
          // 외부 사이트 (Referral)
          try {
            const currentHost = url.hostname.toLowerCase();
            if (hostname !== currentHost && !hostname.includes(currentHost)) {
              return 'referral';
            }
          } catch (e) {
            // URL 파싱 실패 시 Referral로 분류
            return 'referral';
          }
        } catch (e) {
          // URL 파싱 실패 시 Direct로 분류
        }
      }
      
      // 기본값: Direct (referrer 없음, 북마크, 직접 입력 등)
      return 'direct';
    }
    
    const trafficSource = classifyTrafficSource();

    // 쿠키에서 방문자 ID 확인 (24시간 유지)
    const visitorId = request.cookies.get('visitor_id')?.value;
    const isNewVisitor = !visitorId;

    // 오늘 날짜의 analytics 레코드 조회 또는 생성
    let { data: analytics, error: fetchError } = await supabase
      .from('analytics')
      .select('*')
      .eq('date', today)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching analytics:', fetchError);
    }

    // 기존 traffic_sources JSONB 가져오기 (문자열일 경우 파싱)
    let existingTrafficSources: any = {
      organic: 0,
      direct: 0,
      referral: 0,
      social: 0
    };
    
    if (analytics?.traffic_sources) {
      try {
        if (typeof analytics.traffic_sources === 'string') {
          existingTrafficSources = JSON.parse(analytics.traffic_sources);
        } else if (typeof analytics.traffic_sources === 'object') {
          existingTrafficSources = analytics.traffic_sources;
        }
      } catch (e) {
        console.error('Error parsing traffic_sources:', e);
      }
    }

    if (!analytics) {
      // 오늘 날짜 레코드가 없으면 생성
      const newTrafficSources = { ...existingTrafficSources };
      if (isNewVisitor) {
        newTrafficSources[trafficSource] = (newTrafficSources[trafficSource] || 0) + 1;
      }
      
      const { data: newAnalytics, error: insertError } = await supabase
        .from('analytics')
        .insert({
          date: today,
          visitors: isNewVisitor ? 1 : 0,
          page_views: 1,
          traffic_sources: newTrafficSources,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating analytics:', insertError);
        return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
      }

      analytics = newAnalytics;
    } else {
      // 기존 레코드 업데이트
      const updateData: any = {
        page_views: (analytics.page_views || 0) + 1,
      };

      if (isNewVisitor) {
        updateData.visitors = (analytics.visitors || 0) + 1;
        
        // 트래픽 소스별 방문자 수 업데이트
        const updatedTrafficSources = { ...existingTrafficSources };
        updatedTrafficSources[trafficSource] = (updatedTrafficSources[trafficSource] || 0) + 1;
        updateData.traffic_sources = updatedTrafficSources;
      }

      const { error: updateError } = await supabase
        .from('analytics')
        .update(updateData)
        .eq('id', analytics.id);

      if (updateError) {
        console.error('Error updating analytics:', updateError);
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
      }
    }

    // 최종 traffic_sources 가져오기
    const finalTrafficSources = analytics.traffic_sources || existingTrafficSources;
    
    // 응답 헤더에 쿠키 설정 (24시간 유지)
    const response = NextResponse.json({ 
      success: true, 
      isNewVisitor,
      visitors: analytics.visitors + (isNewVisitor ? 1 : 0),
      pageViews: analytics.page_views + 1,
      trafficSource,
      trafficSources: finalTrafficSources
    });

    if (isNewVisitor) {
      // 새로운 방문자 ID 생성 (UUID)
      const newVisitorId = crypto.randomUUID();
      const isProduction = process.env.NODE_ENV === 'production';
      response.cookies.set('visitor_id', newVisitorId, {
        maxAge: 60 * 60 * 24, // 24시간
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction, // 프로덕션에서만 HTTPS
        path: '/',
        // domain은 명시하지 않음 (기본 도메인 사용)
      });
    }

    return response;
  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
