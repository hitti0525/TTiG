'use client';

import { useEffect } from 'react';

export default function AnalyticsTracker() {
  useEffect(() => {
    // 페이지 로드 시 방문자 추적
    fetch('/api/analytics/track', {
      method: 'GET',
      credentials: 'include',
    }).catch((error) => {
      console.error('Analytics tracking error:', error);
    });
  }, []);

  return null; // UI 렌더링 없음
}
