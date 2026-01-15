'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin', label: '대시보드', icon: '📊' },
    { href: '/admin/inquiries', label: '문의 내역', icon: '📧' },
    { href: '/admin/posts', label: '게시글 목록', icon: '📝' },
    { href: '/admin/write', label: '새 공간 작성', icon: '➕' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3] flex">
      {/* 좌측 사이드바 */}
      <aside className="w-64 bg-white border-r border-[#111111]/10 flex-shrink-0">
        <div className="p-6 border-b border-[#111111]/10">
          <h1 className="text-2xl font-serif font-bold text-[#111111]">TTiG Admin</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans transition-colors ${
                      isActive
                        ? 'bg-[#111111] text-white'
                        : 'text-[#111111]/60 hover:bg-[#111111]/5 hover:text-[#111111]'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
