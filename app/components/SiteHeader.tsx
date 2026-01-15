'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, User } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Gangnam', slug: 'gangnam' },
  { label: 'Hannam', slug: 'hannam' },
  { label: 'Jamsil', slug: 'jamsil' },
  { label: 'Seongsu', slug: 'seongsu' },
  { label: 'Nearby', slug: 'nearby' },
];

interface SiteHeaderProps {
  isDarkSlide?: boolean; // 현재 슬라이드가 어두운지 여부
}

export default function SiteHeader({ isDarkSlide = false }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const pathname = usePathname();

  // Admin 페이지에서는 헤더 숨기기
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
    };
    
    // IntersectionObserver로 about 페이지의 3번 슬라이드 직접 감지
    let observer: IntersectionObserver | null = null;
    
    if (pathname === '/about') {
      const darkSlide = document.getElementById('dark-slide');
      if (darkSlide) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              // 3번 슬라이드가 뷰포트에 30% 이상 보이면 어두운 배경으로 감지
              setIsDarkBackground(entry.isIntersecting && entry.intersectionRatio >= 0.3);
            });
          },
          {
            threshold: [0, 0.3, 0.5, 0.7, 1],
            rootMargin: '-20% 0px -20% 0px', // 상하 20% 여유를 두고 감지
          }
        );
        observer.observe(darkSlide);
      }
    } else {
      setIsDarkBackground(false);
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  // 텍스트 색상 결정 로직:
  // 1. 메뉴가 열렸을 땐 화이트
  // 2. about 페이지에서 어두운 배경 영역에 있을 때 화이트
  // 3. 스크롤 전이면서 어두운 슬라이드일 땐 화이트
  // 4. 그 외(오트밀 배경, 스크롤 후)에는 블랙
  const textColorClass = isMenuOpen || isDarkBackground || (!isScrolled && isDarkSlide)
    ? "text-white" 
    : "text-black";

  return (
    <header className={`fixed top-0 left-0 w-full z-[10000] transition-all duration-500 p-6 ${
      isMenuOpen 
        ? "bg-black/60 backdrop-blur-[35px] border-b border-white/10" 
        : isScrolled
          ? "bg-[#F4F4F2]/80 backdrop-blur-md border-b border-black/5"
          : "bg-transparent"
    }`}>
      <div className="flex justify-between items-start">
        {/* LOGO */}
        <Link href="/" className={`text-4xl font-serif font-bold tracking-tighter hover:opacity-80 transition-colors duration-500 ${textColorClass}`}>
          TTiG
        </Link>

        {/* DESKTOP NAV */}
        {/* 수정됨: md:ml-[20%]로 우측 이동, ABOUT 먼저 배치 */}
        <nav className={`hidden md:flex gap-12 mt-2 text-sm font-bold tracking-widest md:ml-[20%] transition-colors duration-500 ${
          isMenuOpen ? "text-white/90" : textColorClass === "text-white" ? "text-white/90" : "text-black/80"
        }`}>
          
          {/* 1. ABOUT (순서 변경: 맨 앞으로) */}
          <Link href="/about" className="hover:opacity-50 transition-opacity text-base">ABOUT</Link>

          {/* 2. ARCHIVE */}
          <div className="relative group cursor-pointer">
            <span className="hover:opacity-50 transition-opacity text-base">ARCHIVE</span>
            
            {/* 드롭다운 메뉴 */}
            <div className="absolute top-full left-0 pt-6 hidden group-hover:block w-max">
              <div className="flex flex-col gap-2"> {/* 간격도 gap-3 -> gap-2로 좁힘 */}
                {NAV_ITEMS.map((item) => (
                  <Link 
                    key={item.slug} 
                    href={`/category/${item.slug}`}
                    className="block w-fit group/item"
                  >
                    {/* [핵심 변경] 폰트 크기 축소 + 기본 50% 투명도 적용 */}
                    <span className={`text-xl md:text-2xl font-serif font-bold group-hover/item:italic transition-all duration-300 block ${
                      (isMenuOpen || isDarkBackground) ? "text-white/40 group-hover/item:text-white" : "text-black/40 group-hover/item:text-black"
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* ICONS */}
        <div className="flex gap-4 mt-1">
          <Search size={20} className={`cursor-pointer hover:opacity-50 transition-colors duration-500 ${textColorClass}`} />
          <Link href="/login">
            <User size={20} className={`cursor-pointer hover:opacity-50 transition-colors duration-500 ${textColorClass}`} />
          </Link>
          <Menu 
            size={24} 
            className={`md:hidden cursor-pointer hover:opacity-50 transition-colors duration-500 ${textColorClass}`}
            onClick={() => setIsMenuOpen(true)}
          />
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-[35px] h-screen w-screen flex flex-col items-center justify-center p-6 transition-all duration-700 opacity-100">
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start mb-10">
            <span className="text-4xl font-serif font-bold tracking-tighter text-white drop-shadow-md">TTiG</span>
            <X size={24} className="cursor-pointer text-white hover:opacity-50 transition-opacity drop-shadow-md" onClick={() => setIsMenuOpen(false)} />
          </div>

          <nav className="flex flex-col items-center justify-center space-y-12">
             {/* 모바일에서도 ABOUT 먼저 */}
             <Link href="/about" className="group relative w-fit" onClick={() => setIsMenuOpen(false)}>
               <span className="block text-[14px] font-light tracking-[0.5em] text-white uppercase drop-shadow-md transition-all duration-500 ease-in-out group-hover:italic group-hover:translate-x-2 group-hover:opacity-70">
                 ABOUT
               </span>
               <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-white opacity-50 transition-all duration-500 group-hover:w-full group-hover:left-0"></span>
             </Link>
             <div className="w-full h-px bg-white/20 my-2"></div>
            {NAV_ITEMS.map((item) => (
              <Link 
                key={item.slug} 
                href={`/category/${item.slug}`}
                onClick={() => setIsMenuOpen(false)}
                className="group relative w-fit"
              >
                <span className="block text-[14px] font-light tracking-[0.5em] text-white uppercase drop-shadow-md transition-all duration-500 ease-in-out group-hover:italic group-hover:translate-x-2 group-hover:opacity-70">
                  {item.label}
                </span>
                <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-white opacity-50 transition-all duration-500 group-hover:w-full group-hover:left-0"></span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
