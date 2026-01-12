'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔒 설정하신 비밀번호: oppaya0525
    if (password === 'oppaya0525') {
      // 로그인 성공 시: 쿠키 세팅 등 실제 인증 로직이 들어갈 자리
      // (지금은 간단히 어드민/메인으로 이동 처리)
      localStorage.setItem('isAdmin', 'true'); // 간단한 브라우저 저장소 활용 예시
      router.push('/admin'); // 어드민 페이지 경로로 이동 (없다면 '/'로 변경)
    } else {
      setError('Incorrect password. Access denied.');
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
            {/* type="password" : 글자가 ●●●● 로 가려짐 
               placeholder : 입력 전 힌트 텍스트
            */}
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter Password"
              className="w-full py-2 text-center bg-transparent outline-none text-xl font-serif tracking-widest placeholder:text-gray-300"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-black text-white py-4 rounded-full text-xs font-bold tracking-widest hover:bg-gray-800 transition-all active:scale-95"
          >
            ENTER
          </button>
        </form>

        <p className="mt-12 text-[10px] text-gray-400 font-bold tracking-widest uppercase">
          Authorized Personnel Only
        </p>
      </div>
    </main>
  );
}
