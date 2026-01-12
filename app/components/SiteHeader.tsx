'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X, User } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Gangnam', slug: 'gangnam' },
  { label: 'Hannam', slug: 'hannam' },
  { label: 'Jamsil', slug: 'jamsil' },
  { label: 'Seongsu', slug: 'seongsu' },
  { label: 'Nearby', slug: 'nearby' },
];

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-white p-6">
      <div className="flex justify-between items-start">
        {/* LOGO */}
        <Link href="/" className="text-4xl font-serif font-bold tracking-tighter hover:opacity-80 transition-opacity">
          TTiG
        </Link>

        {/* DESKTOP NAV */}
        {/* 수정됨: md:ml-[20%]로 우측 이동, ABOUT 먼저 배치 */}
        <nav className="hidden md:flex gap-12 mt-2 text-sm font-bold tracking-widest md:ml-[20%]">
          
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
                    <span className="text-xl md:text-2xl font-serif font-bold text-white/40 group-hover/item:text-white group-hover/item:italic transition-all duration-300 block">
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
          <Search size={20} className="cursor-pointer hover:opacity-50" />
          <Link href="/login">
            <User size={20} className="cursor-pointer hover:opacity-50" />
          </Link>
          <Menu 
            size={24} 
            className="md:hidden cursor-pointer hover:opacity-50" 
            onClick={() => setIsMenuOpen(true)}
          />
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black text-white z-[9999] flex flex-col p-6">
          <div className="flex justify-between items-start mb-10">
            <span className="text-4xl font-serif font-bold tracking-tighter">TTiG</span>
            <X size={24} className="cursor-pointer" onClick={() => setIsMenuOpen(false)} />
          </div>

          <nav className="flex flex-col gap-6">
             {/* 모바일에서도 ABOUT 먼저 */}
             <Link href="/about" className="text-lg font-bold" onClick={() => setIsMenuOpen(false)}>ABOUT</Link>
             <div className="w-full h-px bg-gray-200 my-2"></div>
            {NAV_ITEMS.map((item) => (
              <Link 
                key={item.slug} 
                href={`/category/${item.slug}`}
                onClick={() => setIsMenuOpen(false)}
                className="w-fit"
              >
                <span className="text-3xl font-serif font-bold hover:text-gray-400 hover:italic transition-all duration-200">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
