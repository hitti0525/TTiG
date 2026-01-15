import { getTemplates } from '@/lib/data-source';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ttig.kr';
    const places = await getTemplates() || [];
    const publishedPlaces = places.filter((place: any) => !place.status || place.status === 'PUBLISHED');
    
    // 최신순으로 정렬 (최근 업데이트된 것부터)
    const sortedPlaces = publishedPlaces
      .sort((a: any, b: any) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date().getTime();
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date().getTime();
        return dateB - dateA;
      })
      .slice(0, 50); // 최신 50개만 포함

    const rssItems = sortedPlaces.map((place: any) => {
      const pubDate = place.updatedAt 
        ? new Date(place.updatedAt).toUTCString()
        : new Date().toUTCString();
      
      const description = place.description 
        ? place.description.replace(/<[^>]*>/g, '').substring(0, 500)
        : place.tagline || '';
      
      const imageUrl = place.image || '';
      
      return `    <item>
      <title><![CDATA[${place.title}]]></title>
      <link>${baseUrl}/${place.slug}</link>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${baseUrl}/${place.slug}</guid>
      ${imageUrl ? `<enclosure url="${imageUrl}" type="image/jpeg" />` : ''}
      <category><![CDATA[${place.category}]]></category>
    </item>`;
    }).join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TTiG Archive</title>
    <link>${baseUrl}</link>
    <description>서울의 감각적인 공간을 아카이빙합니다. Curating Seoul's Vibe.</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/og-default.jpg</url>
      <title>TTiG Archive</title>
      <link>${baseUrl}</link>
    </image>
${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('RSS generation error:', error);
    return new NextResponse('RSS feed generation failed', { status: 500 });
  }
}
