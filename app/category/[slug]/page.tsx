import { getTemplates } from "@/lib/data-source";
import Image from "next/image";
import Link from "next/link";

// 동적 라우팅 강제
export const dynamic = 'force-dynamic';

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string } 
}) {
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;
  
  const allPlaces = await getTemplates() || [];
  
  // PUBLISHED 상태만 필터링하고, district와 slug 매칭 (대소문자 구분 없이)
  const filteredPlaces = allPlaces.filter((place: any) => {
    const placeDistrict = (place.district || place.properties?.district || '').toLowerCase();
    const slugLower = slug.toLowerCase();
    const isPublished = !place.status || place.status === 'PUBLISHED';
    return placeDistrict === slugLower && isPublished;
  });

  return (
    <main className="w-full min-h-screen bg-[#F5F5F3] px-4 pt-32 pb-20">
      
      {/* HEADER: 타이틀 크기 축소 및 레이아웃 정리 */}
      <div className="container mx-auto mb-16 border-b border-black pb-6">
        <Link href="/" className="text-xs font-bold text-gray-400 hover:text-black mb-4 inline-block">
           ← BACK TO HOME
        </Link>
        <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-6">
          {/* 기존 text-5xl -> text-3xl~4xl로 축소 */}
          <h1 className="text-3xl md:text-4xl font-serif font-bold uppercase tracking-tight text-black">
            Archive : {slug}
          </h1>
          <span className="text-xs font-bold text-gray-500 mb-2 pb-1">
            — {filteredPlaces.length} SPACES FOUND
          </span>
        </div>
      </div>

      {/* LIST GRID */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place: any) => (
            <Link key={place.id} href={`/${place.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 mb-4">
                {place.image && (
                  <Image 
                    src={place.image} 
                    alt={place.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                  {place.category}
                </div>
              </div>
              <div className="flex justify-between items-baseline border-b border-black pb-2">
                <h2 className="text-xl font-serif font-bold group-hover:italic transition-all">
                  {place.title}
                </h2>
                <span className="text-xs font-bold text-gray-500">{place.district}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-2 py-20 text-center">
            <h3 className="text-xl font-serif text-gray-400 mb-2">아직 기록된 공간이 없습니다.</h3>
            <p className="text-xs text-gray-400">곧 멋진 문장들로 채워질 예정이에요.</p>
            <Link href="/" className="inline-block mt-6 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800">
              View All Archives
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
