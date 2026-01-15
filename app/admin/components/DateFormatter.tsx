'use client';

import { useState, useEffect } from 'react';

interface DateFormatterProps {
  dateString: string;
  format?: 'full' | 'short';
}

export default function DateFormatter({ dateString, format = 'full' }: DateFormatterProps) {
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    try {
      if (format === 'full') {
        // 고정된 형식으로 날짜 포맷팅 (타임존 차이 방지)
        const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Seoul'
        });
        setFormattedDate(dateFormatter.format(new Date(dateString)));
      } else {
        // 짧은 형식
        const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Seoul'
        });
        setFormattedDate(dateFormatter.format(new Date(dateString)));
      }
    } catch (error) {
      setFormattedDate(new Date(dateString).toISOString().split('T')[0]);
    }
  }, [isMounted, dateString, format]);

  // 서버에서는 간단한 포맷만 표시 (hydration mismatch 방지)
  if (!isMounted) {
    return <span suppressHydrationWarning>{new Date(dateString).toISOString().split('T')[0]}</span>;
  }

  return <span suppressHydrationWarning>{formattedDate || new Date(dateString).toISOString().split('T')[0]}</span>;
}
