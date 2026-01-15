'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 이미 로그인되어 있으면 리다이렉트
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.authenticated) {
          router.push('/admin');
        }
      } catch (error) {
        // 세션 확인 실패 시 무시 (로그인 페이지 유지)
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // 로그인 성공 시 어드민 페이지로 이동
        router.push('/admin');
        router.refresh(); // 세션 쿠키 반영을 위해 새로고침
      } else {
        setError(data.error || '로그인에 실패했습니다.');
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('로그인 처리 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center bg-[#F5F5F3]">
      <div className="text-center w-full max-w-sm px-6">
        
        {/* Title */}
        <h1 className="text-4xl font-serif font-normal mb-2 text-black">
          Manager Access
        </h1>
        
        {/* Error Message */}
        <div className="h-6 mb-8 text-xs text-red-500 font-bold tracking-widest uppercase">
          {error}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="relative border-b border-gray-300 focus-within:border-black transition-colors duration-300">
            <input 
              type="email" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="Email"
              className="w-full py-2 text-center bg-transparent outline-none text-xl font-serif tracking-widest placeholder:text-gray-300"
              required
              autoComplete="email"
            />
          </div>
          
          <div className="relative border-b border-gray-300 focus-within:border-black transition-colors duration-300">
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Password"
              className="w-full py-2 text-center bg-transparent outline-none text-xl font-serif tracking-widest placeholder:text-gray-300"
              required
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-full text-xs font-bold tracking-widest hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : 'ENTER'}
          </button>
        </form>

        <p className="mt-12 text-[10px] text-gray-400 font-bold tracking-widest uppercase">
          Authorized Personnel Only
        </p>
      </div>
    </main>
  );
}
