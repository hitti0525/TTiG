'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// 1. 고급스러운 움직임 설정 (Toss, Apple 스타일의 이징 커브)
const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 1
};

const easeTransition = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1] // Custom Cubic Bezier for "Luxury" feel
};

// 2. 애니메이션 변수 (Variants)
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // 카드들이 0.15초 간격으로 하나씩 등장
      delayChildren: 0.3,
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 }, // 아래에서
  show: { 
    opacity: 1, 
    y: 0, // 위로 부드럽게 떠오름
    transition: easeTransition
  }
};

export default function MainClient({ places }: { places: any[] }) {
  return (
    <main className="w-full">
      {/* HERO SECTION: 텍스트가 부드럽게 떠오름 */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...easeTransition, delay: 0.2 }}
        className="min-h-screen flex flex-col justify-center bg-[#F5F5F3] pt-32 md:pt-40"
      >
        <div className="pl-8 md:pl-16 lg:pl-24 xl:pl-32 pr-6 md:pr-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...easeTransition, delay: 0.2 }}
            className="font-serif text-[12vw] md:text-[10vw] lg:text-[9vw] leading-[0.85] tracking-tighter text-[#111] text-left"
          >
            THE BAND<br />
            <span className="text-[4vw] md:text-[3.5vw] lg:text-[3vw] font-serif italic text-[#888] opacity-80">FOR</span><br />
            SEOUL.
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-10 max-w-lg"
          >
            <p className="text-xs md:text-sm font-sans text-gray-600 leading-relaxed break-keep">
              책의 가장 매력적인 문장을 <span className="text-black font-bold border-b border-black/20 pb-0.5">띠지</span>가 감싸듯,<br />
              서울의 가장 감각적인 공간들에 띠지를 두릅니다.
            </p>
          </motion.div>
          
          {/* Scroll Indicator - 우측 정렬 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 flex items-center justify-end gap-3"
          >
            <div className="h-px w-12 bg-black/20"></div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-black">
              ARCHIVED BY TTiG
            </span>
          </motion.div>
        </div>
      </motion.section>

      {/* GRID SECTION: 스크롤하면 카드들이 시간차로 등장 */}
      <motion.section 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="px-6 md:px-10 py-24 bg-white min-h-screen"
      >
        {/* 섹션 헤더 */}
        <div className="mb-12 border-b border-[#eee] pb-4 flex justify-between items-end">
          <h2 className="text-xl font-serif">LATEST ARCHIVE</h2>
          <span className="text-xs text-[#888]">{places.length} SPACES</span>
        </div>

        {/* 그리드 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-20">
          {places.map((place: any) => (
            <motion.div key={place.id} variants={item}>
              <Link href={`/${place.slug}`} className="group cursor-pointer block">
                
                {/* 이미지 영역 (3:4 비율 유지) */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                  {place.image && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="relative w-full h-full"
                    >
                      <Image 
                        src={place.image} 
                        alt={place.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </motion.div>
                  )}
                  {/* 띠지 느낌의 오버레이 (Hover 시) */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* 텍스트 정보 */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-2xl font-serif text-[#111] group-hover:underline decoration-1 underline-offset-4">
                      {place.title}
                    </h3>
                    <span className="text-xs font-bold text-[#111] border border-[#111] px-2 py-0.5 rounded-full uppercase">
                      {place.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#888] uppercase tracking-wide mt-1">
                    SEOUL · {place.properties?.district || place.district}
                  </p>
                  <p className="text-sm text-[#555] mt-2 line-clamp-2">
                    {place.description}
                  </p>
                </div>

              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* 데이터가 없을 경우 안내 메시지 */}
        {places.length === 0 && (
          <div className="py-20 text-center text-[#888]">
            <p>아직 등록된 공간이 없습니다.</p>
            <p className="text-xs mt-2">data/places.json 파일을 확인해주세요.</p>
          </div>
        )}

      </motion.section>
    </main>
  );
}
