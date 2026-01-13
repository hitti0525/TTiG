import { MetadataRoute } from 'next';
import { getTemplates } from '@/lib/data-source';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ttig.kr'; // 실제 도메인으로 변경하세요
  
  // 정적 페이지
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 카테고리 페이지
  const categories = ['gangnam', 'hannam', 'jamsil', 'seongsu', 'nearby'];
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 동적 페이지 (각 장소)
  let placeRoutes: MetadataRoute.Sitemap = [];
  try {
    const places = await getTemplates() || [];
    const publishedPlaces = places.filter((place: any) => !place.status || place.status === 'PUBLISHED');
    
    placeRoutes = publishedPlaces.map((place: any) => ({
      url: `${baseUrl}/${place.slug || place.id}`,
      lastModified: place.updatedAt ? new Date(place.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  return [...staticRoutes, ...categoryRoutes, ...placeRoutes];
}
