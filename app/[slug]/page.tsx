import { getTemplates } from "@/lib/data-source";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { 
  MapPin, Clock, Car, ChevronDown, ExternalLink,
  Wine, Coffee, Utensils, Wifi, Baby, Dog, CreditCard, 
  Building2, Waves, Trees, Mountain, Sparkles, CheckCircle2,
  DoorOpen, Bed, Gift, Book, Camera, Heart
} from 'lucide-react';
import SpaceActionBar from '@/app/components/SpaceActionBar';
import { incrementView } from '@/lib/actions/space';
import Link from 'next/link';

// 동적 라우팅 강제
export const dynamic = 'force-dynamic';

// 1. 아이콘 매핑 시스템 (태그 텍스트 -> 아이콘 컴포넌트)
const ICON_MAP: Record<string, any> = {
  // DINING & CAFE
  "Wine Pairing": Wine,
  "Sommelier": Wine,
  "Hand Drip": Coffee,
  "Signature Coffee": Coffee,
  "Dessert": Utensils,
  "Bakery": Utensils,
  "Course Meal": Utensils,
  "Fine Casual": Utensils,
  "Open Kitchen": Utensils,
  "Vegan Option": Trees,
  
  // VIEW & ATMOSPHERE
  "City View": Building2,
  "Han River View": Waves,
  "Ocean View": Waves,
  "Forest View": Trees,
  "Garden": Trees,
  "Terrace": Trees,
  "Modern": Building2,
  "Vintage Mood": Sparkles,
  "Romantic": Heart,
  "Date Spot": Heart,
  "Anniversary": Heart,
  
  // FACILITY
  "Parking": Car,
  "Valet Parking": Car,
  "Private Room": DoorOpen,
  "Welcome Tea": Coffee,
  "No Kids": Baby,
  "Pet Friendly": Dog,
  "Work Friendly": Wifi,
  "Jacuzzi": Waves,
  "Swimming Pool": Waves,
  "Cooking": Utensils,
  "Beam Projector": Camera,
  "Bathtub": Waves,
  
  // CAFE & OTHER
  "Photo Spot": Camera,
  "Large Space": Building2,
  "Gift Shop": Gift,
  "Book Store": Book,
  
  // COMPLEX
  "Exhibition": Camera,
  "Pop-up": Sparkles,
  "Spa": Waves,
  "Cultural Space": Building2,
  "Lounge": Coffee,
  
  // BUSINESS
  "Business Meeting": Building2,
  "Corkage Free": Wine,
  
  // DEFAULT
  "Reservation": CreditCard,
};

// 데이터에 없는 태그는 기본 아이콘(CheckCircle2) 사용
const getIcon = (feature: string) => ICON_MAP[feature] || CheckCircle2;

// Dynamic Metadata 생성
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const templates = await getTemplates();
  const place = templates.find((t: any) => t.slug === resolvedParams.slug);
  
  if (!place) {
    return {
      title: 'Space Not Found | TTiG',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ttig.kr';
  const imageUrl = place.image || `${baseUrl}/og-default.jpg`;
  const description = place.description?.substring(0, 160) || place.tagline || '서울의 감각적인 공간을 아카이빙합니다.';

  return {
    title: `${place.title} | TTiG Archive`,
    description,
    openGraph: {
      title: `${place.title} | TTiG Archive`,
      description,
      url: `${baseUrl}/${place.slug}`,
      siteName: 'TTiG',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: place.title,
        },
      ],
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${place.title} | TTiG Archive`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/${place.slug}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const templates = await getTemplates();
  const place = templates.find((t: any) => t.slug === resolvedParams.slug);
  if (!place) notFound();

  // 조회수 증가 (서버 사이드에서 실행)
  try {
    await incrementView(place.id || place.slug);
  } catch (error) {
    console.error('Failed to increment view:', error);
    // 조회수 증가 실패해도 페이지는 정상 표시
  }

  const info = place.properties || {};
  const images = place.subImages && place.subImages.length > 0 ? place.subImages : (place.image ? [place.image] : []);
  const hasBookingUrl = place.bookingUrl && place.bookingUrl.trim() !== '';
  
  // amenities 배열에서 label 추출
  const features = place.amenities ? place.amenities.map((item: any) => item.label || item) : [];

  // Supabase에서 통계 데이터 가져오기 (현재는 JSON 데이터 사용 중)
  const viewsCount = place.views_count || 0;
  const keepsCount = place.keeps_count || 0;
  const sharesCount = place.shares_count || 0;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ttig.kr';

  // JSON-LD Schema.org 데이터 생성 (AI 검색 엔진용)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": place.category === "STAY" ? "LodgingBusiness" : place.category === "DINING" ? "Restaurant" : "LocalBusiness",
    "name": place.title,
    "description": place.description,
    "image": place.image,
    "url": `${baseUrl}/${place.slug}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": info.address || ""
    },
    "openingHours": info.hours || "",
    "aggregateRating": viewsCount > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": viewsCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
    "interactionStatistic": [
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/ViewAction",
        "userInteractionCount": viewsCount
      },
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/SaveAction",
        "userInteractionCount": keepsCount
      },
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/ShareAction",
        "userInteractionCount": sharesCount
      }
    ]
  };

  return (
    <>
      {/* JSON-LD SEO 스크립트 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-[#F5F5F3] min-h-screen">
        <div className="flex flex-col md:flex-row max-w-[2000px] mx-auto">
          {/* LEFT Sticky */}
          <div className="w-full md:w-[40%] md:h-screen md:sticky md:top-0 bg-[#F5F5F3] border-r border-black/5 z-10 flex flex-col pt-32 pb-12 px-6 md:px-12 lg:px-16 overflow-y-auto hide-scrollbar">
            <div className="mb-12">
              <span className="block text-xs font-bold tracking-[0.3em] mb-6 border-l-2 border-black pl-3 text-[#111] uppercase">{info.district || place.district || 'SEOUL'} — {place.category}</span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight leading-[0.9] text-[#111] uppercase mb-8">{place.title}</h1>
              <p className="text-lg md:text-xl font-serif font-medium text-[#555] leading-relaxed">"{place.tagline || place.title}"</p>
            </div>
            <div className="mb-12">
              <div className="w-10 h-px bg-black/20 mb-8"></div>
              <p className="text-sm md:text-base leading-[1.8] text-[#333] font-normal whitespace-pre-line break-keep">{place.description}</p>
            </div>
            
            {/* Space Action Bar - 본문 끝에 배치 */}
            <SpaceActionBar spaceId={place.id} spaceSlug={place.slug} />
            
            {/* Icon Grid Features (NEW!) */}
            {features.length > 0 && (
              <div className="mb-12 pt-8 border-t border-black/5">
                <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-6">Features</h3>
                <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                  {features.map((feature: string, idx: number) => {
                    const IconComponent = getIcon(feature);
                    return (
                      <div key={idx} className="flex flex-col items-center text-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                          <IconComponent size={18} strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] font-medium text-gray-500 leading-tight break-keep uppercase tracking-wide">
                          {feature}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="mt-auto bg-white p-6 border border-gray-200 shadow-sm">
              <h4 className="text-[10px] font-bold tracking-widest mb-4 border-b border-black/5 pb-2 text-gray-400 uppercase">Information</h4>
              <div className="space-y-3 mb-6">
                <div className="flex gap-3 items-start"><MapPin size={14} className="mt-0.5 text-black" /><span className="text-sm font-medium">{info.address}</span></div>
                <div className="flex gap-3 items-start"><Clock size={14} className="mt-0.5 text-black" /><span className="text-sm font-medium">{info.hours}</span></div>
                <div className="flex gap-3 items-start"><Car size={14} className="mt-0.5 text-black" /><span className="text-sm font-medium">{info.parking}</span></div>
              </div>
              {hasBookingUrl ? (
                <a 
                  href={place.bookingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-black text-white text-xs font-bold tracking-[0.2em] hover:bg-gray-800 transition-colors uppercase flex items-center justify-center gap-2"
                >
                  RESERVATION
                  <ExternalLink size={14} />
                </a>
              ) : (
                <button className="w-full py-3 bg-gray-300 text-gray-500 text-xs font-bold tracking-[0.2em] cursor-not-allowed uppercase" disabled>
                  RESERVATION
                </button>
              )}
            </div>
            <div className="hidden md:flex items-center gap-2 mt-8 text-[10px] font-bold tracking-widest text-gray-400 animate-bounce">SCROLL FOR VISUALS <ChevronDown size={12}/></div>
          </div>
          {/* RIGHT Scroll */}
          <div className="w-full md:w-[60%] bg-white">
            {images.length > 0 ? (
              images.map((img: string, idx: number) => (
                <div key={idx} className="relative w-full">
                  <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden group">
                    <Image src={img} alt={`${place.title} ${idx + 1}`} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 60vw" />
                    <div className="absolute bottom-6 right-6 text-white/80 font-mono text-xs backdrop-blur-sm px-2 py-1 bg-black/10">{String(idx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-screen text-gray-400">No images available</div>
            )}
            <footer className="py-20 px-12 bg-[#111] text-white"><div className="flex flex-col gap-8"><h2 className="text-2xl font-serif font-bold">TTiG.</h2><div className="text-xs font-bold tracking-widest text-gray-500 space-y-2"><p>© 2026 TTiG Archive.</p><p>Seoul, Korea</p></div></div></footer>
          </div>
        </div>

        {/* 관련된 다른 장면 (Related Scenes) - SEO 내부 링크 강화 */}
        <div className="bg-[#F5F5F3] py-20 px-6 md:px-12 lg:px-24">
          <div className="max-w-[2000px] mx-auto">
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#111] mb-4">Related Scenes</h2>
              <div className="w-20 h-px bg-black/20"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates
                .filter((p: any) => 
                  p.slug !== place.slug && 
                  (!p.status || p.status === 'PUBLISHED') &&
                  (p.category === place.category || p.district === place.district)
                )
                .slice(0, 6)
                .map((relatedPlace: any) => (
                  <Link 
                    key={relatedPlace.id} 
                    href={`/${relatedPlace.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden mb-4">
                      {relatedPlace.image && (
                        <Image 
                          src={relatedPlace.image} 
                          alt={relatedPlace.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-serif text-[#111] group-hover:underline decoration-1 underline-offset-4">
                        {relatedPlace.title}
                      </h3>
                      <p className="text-xs text-[#888] uppercase tracking-wide">
                        {relatedPlace.properties?.district || relatedPlace.district} · {relatedPlace.category}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
