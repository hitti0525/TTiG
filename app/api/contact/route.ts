import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // 입력 검증
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: '이름, 이메일, 메시지는 필수 항목입니다.' },
        { status: 400 }
      );
    }

    // Supabase 클라이언트 생성
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase 환경 변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 1. DB에 문의 데이터 저장
    const { error: dbError } = await supabase
      .from('inquiries')
      .insert([{ 
        name, 
        email, 
        message, 
        status: 'new'
      }]);
    
    if (dbError) {
      console.error('DB 저장 실패:', dbError);
      return NextResponse.json(
        { error: 'DB 저장 실패', details: dbError.message || dbError },
        { status: 500 }
      );
    }

    // 2. 이메일 발송 로직 (추후 구현)
    // TODO: 이메일 발송 서비스 (SendGrid, Resend 등) 연동

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: '문의 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}