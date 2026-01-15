'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

export default function AboutPage() {
  // 띠지 확인 단계와 폼 노출 여부를 관리하는 상태
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // 배경 이미지는 public 폴더에 저장된 파일 사용
  const BG_IMAGE_URL = "/about-bg.jpg";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 3000);
      } else {
        console.error('Contact API error:', data);
        console.error('Error details:', JSON.stringify(data, null, 2));
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Contact submit error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }; 

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
        <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-10">
              "Don't Search. Just Read."
            </h2>
            {/* 구분선 */}
            <div className="w-10 h-1 bg-black mx-auto mb-10"></div>
            
            <p className="text-gray-600 leading-9 mb-12 text-base md:text-lg keep-all">
              더 이상 '맛집', '카페'를 검색하며 시간을 낭비하지 마세요. TTiG는 단순히 장소를 나열하지 않습니다.<br />
              공간이 가진 고유한 맥락(Context)과 운영자의 철학, 그리고 그곳에서 경험할 수 있는 공감각적 무드를 편집하여 전달합니다.
            </p>
            
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold border-b-2 border-black pb-1 hover:opacity-50 transition-opacity uppercase tracking-widest">
              Explore Archives <ArrowUpRight size={14}/>
            </Link>
        </div>
      </section>

      {/* [SLIDE 3] Partnership */}
      <section id="dark-slide" data-dark-slide="true" className="w-full h-screen snap-start relative group bg-black overflow-hidden flex items-end">
          
          {/* 배경 이미지 */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000 transform group-hover:scale-105"
            style={{ backgroundImage: `url('${BG_IMAGE_URL}')` }} 
          ></div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10"></div>

          <div className="container mx-auto relative z-30 pt-32 px-10 pb-32 md:p-20 md:pb-32 flex flex-col md:flex-row justify-between items-end gap-12 w-full text-white">
            <div className="max-w-2xl">
              <span className="text-xs font-bold tracking-widest text-gray-300 mb-6 block border-l-2 border-white pl-4">
                FOR SPACE OWNERS
              </span>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-none">
                Your space needs<br/>
                a proper <span className="italic text-gray-300">Title.</span>
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed" style={{ width: '568px', maxWidth: '100%' }}>
                당신의 공간이 가진 언어를 정제하고, 가장 매력적인 한 줄의 문장으로 세상에 소개합니다.<br />
                단순한 바이럴 마케팅이 아닙니다. 우리는 당신의 공간을 '아카이빙' 합니다.
              </p>
            </div>
            
            {!showConfirmation ? (
              <button 
                onClick={() => setShowConfirmation(true)}
                className="group relative px-10 py-5 bg-white text-black text-sm font-bold tracking-widest uppercase overflow-hidden transition-all hover:bg-gray-200"
              >
                <span className="relative z-10">Apply for Archiving</span>
              </button>
            ) : null}
          </div>
          
          <div className="absolute bottom-0 left-0 w-full p-6 border-t border-white/10 flex justify-between text-[10px] text-gray-500 uppercase font-bold tracking-widest z-30">
            <p>© 2026 TTiG Archive.</p>
            <p>Seoul, Korea</p>
          </div>
      </section>

      {/* Confirmation Overlay */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden">
          {/* 배경 이미지 위에 딥한 블랙 오버레이 (텍스트 가독성 핵심) */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 opacity-60 grayscale"
            style={{ backgroundImage: `url('${BG_IMAGE_URL}')` }}
          ></div>
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[3px] animate-fade-in z-0"></div>

          {/* 관통하는 단 하나의 선명한 띠지 */}
          <div className="w-full relative flex items-center justify-center z-10">
            {/* 화면 끝에서 끝까지 이어지는 0.5px 화이트 실선 */}
            <div className="absolute w-full h-[0.5px] bg-white/30"></div>
            
            {/* 선 위에 올라가는 배경색(투명)이 깔린 텍스트 박스 */}
            <div className="relative px-12 py-2">
              <span className="text-[11px] md:text-[13px] tracking-[0.9em] text-white font-light uppercase animate-fade-in">
                Shall we wrap your space with TTiG?
              </span>
            </div>
          </div>

          {/* 선택 버튼 */}
          <div className="mt-28 flex gap-24 items-center z-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <button 
              onClick={() => {
                setShowConfirmation(false);
                // 약간의 지연 후 폼 표시 및 스크롤
                setTimeout(() => {
                  setIsFormVisible(true);
                  // DOM이 업데이트된 후 스크롤
                  setTimeout(() => {
                    const formElement = document.getElementById('contact-form');
                    if (formElement) {
                      // 스크롤 스냅을 일시적으로 비활성화하고 스크롤
                      const main = document.querySelector('main');
                      if (main) {
                        main.style.scrollSnapType = 'none';
                        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        setTimeout(() => {
                          if (main) {
                            main.style.scrollSnapType = '';
                          }
                        }, 1000);
                      } else {
                        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }
                  }, 200);
                }, 300);
              }}
              className="group relative"
            >
              <span className="text-[11px] tracking-[0.5em] text-white font-medium group-hover:italic transition-all uppercase">
                Yes, Archive it
              </span>
              {/* 띠지가 감기는 듯한 언더라인 애니메이션 */}
              <div className="absolute -bottom-2 left-0 w-0 h-[0.5px] bg-white group-hover:w-full transition-all duration-700"></div>
            </button>
            
            <button 
              onClick={() => setShowConfirmation(false)}
              className="text-[11px] tracking-[0.5em] text-white/30 font-light hover:text-white transition-colors uppercase"
            >
              Not Yet
            </button>
          </div>
        </div>
      )}

      {/* Archive Form Section */}
      {isFormVisible && (
        <section 
          id="contact-form" 
          className="min-h-screen bg-[#F4F4F2] relative overflow-hidden animate-fade-in snap-start"
        >
          
          {/* 띠지가 지나간 흔적 (가느다란 상단 실선) */}
          <div className="w-full h-[0.5px] bg-black/10 absolute top-20 animate-slide-right"></div>

          <div className="max-w-xl mx-auto pt-40 pb-32 px-6 relative z-10">
            <header className="mb-24 text-center">
              <span className="text-[10px] tracking-[0.6em] text-gray-400 block mb-6 uppercase">Step inside the archive</span>
              <h3 className="text-3xl font-extralight tracking-tighter italic text-black/80">
                당신의 공간을 들려주세요.
              </h3>
            </header>

            {/* 정갈한 폼 스타일링 */}
            <form onSubmit={handleSubmit} className="space-y-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div className="group border-b border-black/10 pb-4 focus-within:border-black transition-all">
                <label htmlFor="name" className="text-[9px] tracking-[0.3em] text-gray-400 uppercase block mb-2">Name</label>
                <input 
                  type="text" 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent outline-none text-[15px] font-light" 
                  placeholder="공간 소유주 또는 성함"
                  required
                />
              </div>

              <div className="group border-b border-black/10 pb-4 focus-within:border-black transition-all">
                <label htmlFor="email" className="text-[9px] tracking-[0.3em] text-gray-400 uppercase block mb-2">Email</label>
                <input 
                  type="email" 
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent outline-none text-[15px] font-light" 
                  placeholder="연락 받으실 이메일"
                  required
                />
              </div>

              <div className="group border-b border-black/10 pb-4 focus-within:border-black transition-all">
                <label htmlFor="message" className="text-[9px] tracking-[0.3em] text-gray-400 uppercase block mb-2">Message</label>
                <textarea 
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent outline-none text-[15px] font-light h-32 resize-none" 
                  placeholder="공간에 담긴 이야기 혹은 아카이빙 신청 사유"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-black text-white text-[11px] tracking-[0.5em] font-bold hover:bg-gray-900 transition-all uppercase mt-12 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'SUBMITTING...' : 'Submit Archive'}
              </button>

              {/* Status Message */}
              {submitStatus === 'success' && (
                <div className="text-center text-sm text-green-600 font-medium mt-4">
                  문의가 전송되었습니다. 곧 연락드리겠습니다.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="text-center text-sm text-red-600 font-medium mt-4">
                  전송 중 오류가 발생했습니다. Supabase 설정을 확인해주세요.
                  <br />
                  <span className="text-xs text-red-500 mt-2 block">
                    (브라우저 콘솔에서 상세 오류 확인 가능)
                  </span>
                </div>
              )}
            </form>
          </div>
          
          {/* 하단 띠지 흔적 */}
          <div className="w-full h-[0.5px] bg-black/10 absolute bottom-20 animate-slide-left"></div>
        </section>
      )}

    </main>
  );
}
