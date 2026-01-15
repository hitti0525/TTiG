import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        data: [],
        error: 'Supabase not configured' 
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 최근 7일간 데이터 가져오기
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 7일 전부터 (오늘 포함)
    const startDate = sevenDaysAgo.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .gte('date', startDate)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching analytics:', error);
      return NextResponse.json({ 
        data: [],
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ 
      data: [],
      error: error.message 
    }, { status: 500 });
  }
}
