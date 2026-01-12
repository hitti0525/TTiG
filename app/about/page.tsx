'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function AboutPage() {
  // 배경 이미지는 public 폴더에 저장된 파일 사용
  const BG_IMAGE_URL = "/about-bg.jpg"; 

  return (
    // [핵심 변경] h-screen(화면꽉채움) + snap-y(Y축스냅) + snap-mandatory(무조건걸림)
    <main className="h-screen w-full bg-[#F5F5F3] text-[#111] overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      
      {/* [SLIDE 1] Manifesto */}
      {/* snap-start: 이 섹션의 시작부분에 스크롤이 딱 걸림 */}
      <section className="w-full h-screen snap-start flex flex-col justify-center px-6 relative pt-20 md:pt-0">
        <div className="container mx-auto h-full flex flex-col justify-center">
            
            {/* 상단 라인 */}
            <div className="w-full h-px bg-black mb-12 opacity-80"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full">
                {/* 좌측: 타이틀 및 한글 */}
                <div className="flex flex-col justify-center">
                    <span className="text-xs font-bold tracking-widest text-gray-400 mb-6 block">
                    ABOUT TTiG
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] mb-10">
                    We act as <br/>
                    <span className="italic">"The Band"</span> for Seoul.
                    </h1>
                    
                    <div className="text-sm font-medium leading-loose text-gray-800 max-w-md">
                        <p className="mb-6">
                        서점에 놓인 수많은 책들 사이에서<br/>
                        우리의 시선을 사로잡는 건, 책의 허리를 감싼<br/>
                        얇은 종이 띠지(Book Band)의 한 문장입니다.
                        </p>
                        <p>
                        TTiG는 서울이라는 방대한 도시 위를 두르는<br/>
                        가장 감각적인 띠지가 되고자 합니다.
                        </p>
                    </div>
                </div>

                {/* 우측: 영문 (우측 하단 배치) */}
                <div className="flex flex-col justify-end pb-24">
                     <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-sm ml-auto text-right md:text-left">
                        TTiG curates the vast city of Seoul just as a book band highlights the essence of a book. 
                        We filter out the noise and present only the spaces with clear context and taste.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* [SLIDE 2] Core Value */}
      <section className="w-full h-screen snap-start flex items-center justify-center bg-white px-6 border-t border-gray-100">
        <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-10">
              "Don't Search. Just Read."
            </h2>
            {/* 구분선 */}
            <div className="w-10 h-1 bg-black mx-auto mb-10"></div>
            
            <p className="text-gray-600 leading-9 mb-12 text-base md:text-lg keep-all">
              더 이상 '맛집', '카페'를 검색하며 시간을 낭비하지 마세요.
              TTiG는 단순히 장소를 나열하지 않습니다. 
              공간이 가진 고유한 맥락(Context)과 운영자의 철학, 
              그리고 그곳에서 경험할 수 있는 공감각적 무드를 편집하여 전달합니다.
            </p>
            
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold border-b-2 border-black pb-1 hover:opacity-50 transition-opacity uppercase tracking-widest">
              Explore Archives <ArrowUpRight size={14}/>
            </Link>
        </div>
      </section>

      {/* [SLIDE 3] Partnership */}
      <section className="w-full h-screen snap-start relative group bg-black overflow-hidden flex items-end">
          
          {/* 배경 이미지 */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000 transform group-hover:scale-105"
            style={{ backgroundImage: `url('${BG_IMAGE_URL}')` }} 
          ></div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10"></div>

          <div className="container mx-auto relative z-30 p-10 md:p-20 flex flex-col md:flex-row justify-between items-end gap-12 w-full text-white pb-32">
            <div className="max-w-2xl">
              <span className="text-xs font-bold tracking-widest text-gray-300 mb-6 block border-l-2 border-white pl-4">
                FOR SPACE OWNERS
              </span>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-none">
                Your space needs<br/>
                a proper <span className="italic text-gray-300">Title.</span>
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed max-w-lg">
                당신의 공간이 가진 언어를 정제하고, 가장 매력적인 한 줄의 문장으로 세상에 소개합니다.
                단순한 바이럴 마케팅이 아닙니다. 우리는 당신의 공간을 '아카이빙' 합니다.
              </p>
            </div>
            
            <a 
              href="mailto:contact@ttig.kr" 
              className="px-10 py-5 bg-white text-black text-sm font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors"
            >
              Apply for Archiving
            </a>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full p-6 border-t border-white/10 flex justify-between text-[10px] text-gray-500 uppercase font-bold tracking-widest z-30">
            <p>© 2026 TTiG Archive.</p>
            <p>Seoul, Korea</p>
          </div>
      </section>
    </main>
  );
}
