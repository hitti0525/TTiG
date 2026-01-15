'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ApplyPage() {
  return (
    <main className="min-h-screen w-full relative overflow-hidden">
      {/* 어두운 텍스처 배경 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2d2d2d] via-[#1f1f1f] to-[#151515]">
        {/* 거친 텍스처 효과를 위한 노이즈 패턴 */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
        {/* 추가 텍스처 레이어 */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grain' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='25' cy='25' r='1' fill='%23fff' opacity='0.3'/%3E%3Ccircle cx='75' cy='75' r='1' fill='%23fff' opacity='0.3'/%3E%3Ccircle cx='50' cy='10' r='0.5' fill='%23fff' opacity='0.2'/%3E%3Ccircle cx='10' cy='60' r='0.5' fill='%23fff' opacity='0.2'/%3E%3Ccircle cx='90' cy='30' r='0.5' fill='%23fff' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grain)'/%3E%3C/svg%3E")`,
            backgroundSize: '150px 150px',
          }}
        />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 데스크톱 레이아웃 */}
        <div className="hidden md:flex flex-col justify-center items-center min-h-screen px-6 md:px-16 lg:px-48 pb-32">
          <div className="w-full" style={{ maxWidth: '140rem' }}>
            {/* 레이블과 세로선 */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-px h-8 bg-white/40"></div>
              <span className="text-xs font-bold tracking-[0.2em] text-white uppercase">
                FOR SPACE OWNERS
              </span>
            </div>

            {/* 메인 타이틀 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-tight mb-8"
            >
              Your space needs a proper{' '}
              <span className="font-bold text-white">Title.</span>
            </motion.h1>

            {/* 본문 텍스트와 버튼을 나란히 배치 */}
            <div className="flex items-end gap-12 mt-8 w-full">
              {/* 한국어 본문 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-sm md:text-base text-white/90 leading-relaxed"
                style={{ width: '80rem', flexShrink: 0 }}
              >
                <p style={{ wordBreak: 'keep-all', lineHeight: '1.8' }}>
                  당신의 공간이 가진 언어를 정제하고, 가장 매력적인 한 줄의 문장으로 세상에 소개합니다.<br />
                  단순한 바이럴 마케팅이 아닙니다. 우리는 당신의 공간을 '아카이빙' 합니다.
                </p>
              </motion.div>

              {/* 버튼 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex-shrink-0 whitespace-nowrap"
              >
                <Link
                  href="/about#contact-form"
                  className="inline-block px-8 py-4 bg-black border border-white/80 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300"
                >
                  APPLY FOR ARCHIVING
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 모바일 레이아웃 */}
        <div className="md:hidden flex flex-col px-6 pt-24 pb-32">
          {/* 레이블과 세로선 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-px h-8 bg-white/40"></div>
            <span className="text-xs font-bold tracking-[0.2em] text-white uppercase">
              FOR SPACE OWNERS
            </span>
          </div>

          {/* 메인 타이틀 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-serif text-white leading-tight mb-6"
          >
            Your space needs a proper{' '}
            <span className="font-bold text-white">Title.</span>
          </motion.h1>

          {/* 한국어 본문 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm text-white/90 leading-relaxed mb-8"
          >
            <p>당신의 공간이 가진 언어를 정제하고, 가장 매력적인 한 줄의 문장으로 세상에 소개합니다.<br />
            단순한 바이럴 마케팅이 아닙니다. 우리는 당신의 공간을 '아카이빙' 합니다.</p>
          </motion.div>

          {/* 버튼 (모바일에서는 전체 너비) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <Link
              href="/about#contact-form"
              className="block w-full text-center px-8 py-4 bg-black border border-white/80 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300"
            >
              APPLY FOR ARCHIVING
            </Link>
          </motion.div>
        </div>

        {/* 푸터 */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 lg:px-48 py-6 flex justify-between items-center text-[10px] text-white/50 uppercase tracking-widest font-bold">
          <p>© 2026 THE ARCHIVE</p>
          <p>SEOUL, KOREA</p>
        </div>
      </div>
    </main>
  );
}
