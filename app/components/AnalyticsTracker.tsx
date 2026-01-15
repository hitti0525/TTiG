'use client';

import { useEffect } from 'react';

// 봇 User-Agent 패턴
const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /crawling/i,
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /sogou/i,
  /exabot/i,
  /facebot/i,
  /ia_archiver/i,
  /naver/i, // 네이버 봇
  /Yeti/i, // 네이버 Yeti 봇
  /HeadlessChrome/i, // 헤드리스 브라우저
  /PhantomJS/i,
  /curl/i,
  /wget/i,
  /python/i,
  /java/i,
  /node/i,
  /postman/i,
  /insomnia/i,
];

// 봇인지 확인
function isBot(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || '';
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

export default function AnalyticsTracker() {
  useEffect(() => {
    // 봇은 추적하지 않음
    if (isBot()) {
      return;
    }

    // 페이지 로드 시 방문자 추적
    fetch('/api/analytics/track', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          console.warn('[Analytics] Tracking failed:', res.status, res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          // 성공적으로 추적됨 (디버깅용)
          if (process.env.NODE_ENV === 'development') {
            console.log('[Analytics] Tracked:', data);
          }
        } else {
          console.warn('[Analytics] Tracking error:', data.error);
        }
      })
      .catch((error) => {
        console.error('[Analytics] Network error:', error);
      });
  }, []);

  return null; // UI 렌더링 없음
}
