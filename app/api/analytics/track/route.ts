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

    if (!analytics) {
      // 오늘 날짜 레코드가 없으면 생성
      const { data: newAnalytics, error: insertError } = await supabase
        .from('analytics')
        .insert({
          date: today,
          visitors: isNewVisitor ? 1 : 0,
          page_views: 1,
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

    // 응답 헤더에 쿠키 설정 (24시간 유지)
    const response = NextResponse.json({ 
      success: true, 
      isNewVisitor,
      visitors: analytics.visitors + (isNewVisitor ? 1 : 0),
      pageViews: analytics.page_views + 1
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
