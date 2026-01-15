'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import TagInput from '@/app/components/TagInput';
import ImageUpload from '@/app/components/ImageUpload';

// 인증 체크 컴포넌트
function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] flex items-center justify-center">
        <p className="text-[#111111] font-sans text-sm">인증 확인 중...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

// 1. 카테고리별 태그 데이터 정의 (객체 형태)
const TAGS_BY_CATEGORY: Record<string, string[]> = {
  CAFE: [
    "Hand Drip", "Signature Coffee", "Dessert", "Bakery", 
    "Work Friendly", "Terrace", "Pet Friendly", "Photo Spot", 
    "Vintage Mood", "Modern", "Large Space"
  ],
  DINING: [
    "Wine Pairing", "Sommelier", "Course Meal", "Fine Casual",
    "Private Room", "Date Spot", "Anniversary", "Business Meeting",
    "Valet Parking", "Corkage Free", "City View", "Open Kitchen"
  ],
  "CASUAL DINING": [
    "Wine Pairing", "Date Spot", "Terrace", "Pet Friendly",
    "Open Kitchen", "Casual", "Corkage Free", "City View",
    "Photo Spot", "Modern", "Vintage Mood"
  ],
  STAY: [
    "City View", "Han River View", "Forest View", "Ocean View",
    "Jacuzzi", "Swimming Pool", "Garden", "Cooking",
    "Welcome Tea", "Hand Drip", "Beam Projector", "Bathtub"
  ],
  COMPLEX: [
    "Exhibition", "Pop-up", "Spa", "Book Store", 
    "Gift Shop", "Parking", "Lounge", "Cultural Space"
  ]
};

// 지역 목록
const DISTRICTS = ["SEONGSU", "HANNAM", "GANGNAM", "JAMSIL", "NEARBY"];

// 내부 컴포넌트: useSearchParams를 사용하는 실제 폼
function WriteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  
  const [formData, setFormData] = useState({
    title: '',
    district: 'SEONGSU',
    category: 'DINING', // 기본값
    status: 'PROPOSAL',
    bookingUrl: '',
    tagline: '',      // 한 줄 요약
    description: '',  // 상세 설명
    address: '',
    hours: '',
    parking: '',
    image: '',
    features: [] as string[], // 선택된 태그들
  });

  const [loading, setLoading] = useState(!!editId);

  // [수정 모드] 데이터 불러오기
  useEffect(() => {
    if (!editId) {
      setLoading(false);
      return;
    }

    fetch('/api/templates')
      .then(res => res.json())
      .then(data => {
        const target = data.find((p: any) => p.id === editId);
        if (target) {
          setFormData({
            title: target.title || '',
            district: target.district || target.properties?.district || 'SEONGSU',
            category: target.category || 'DINING',
            status: target.status || 'PROPOSAL',
            bookingUrl: target.bookingUrl || '',
            tagline: target.tagline || '',
            description: target.description || '',
            address: target.properties?.address || '',
            hours: target.properties?.hours || '',
            parking: target.properties?.parking || '',
            image: target.image || '',
            features: target.amenities?.map((a: any) => a.label) || target.features || [],
          });
        } else {
          alert('존재하지 않는 공간입니다.');
          router.push('/admin');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading place:', error);
        alert('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      });
  }, [editId, router]);

  // 2. 입력 핸들러 (카테고리 변경 시 태그 초기화 로직 포함)
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      // 카테고리가 바뀌면, 기존 선택된 태그(features)는 초기화 (버그 방지)
      if (name === 'category' && prev.category !== value) {
        return { ...prev, [name]: value, features: [] }; 
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async () => {
    if (!formData.image) {
      alert('이미지 URL은 필수입니다!');
      return;
    }

    const placeData = {
      id: editId || Date.now().toString(),
      slug: `${formData.district}-${formData.category}-${formData.title}`.toLowerCase().replace(/ /g, '-'),
      title: formData.title,
      category: formData.category,
      district: formData.district,
      status: formData.status,
      bookingUrl: formData.bookingUrl,
      tagline: formData.tagline,
      description: formData.description,
      image: formData.image,
      amenities: formData.features.map(label => ({ label })), // features를 amenities로 변환
      properties: {
        district: formData.district,
        address: formData.address,
        hours: formData.hours,
        parking: formData.parking,
      },
    };

    const apiUrl = editId ? '/api/update-place' : '/api/save-template';
    
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(placeData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert(editId ? '✨ 수정 완료!' : '✨ 띠지 등록 완료!');
        router.push('/admin');
        router.refresh();
      } else {
        alert(`${editId ? '수정' : '등록'} 실패: ${data.message || '알 수 없는 오류가 발생했습니다.'}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert(`${editId ? '수정' : '등록'} 중 오류가 발생했습니다.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] p-8 pt-32 flex justify-center text-[#111]">
        <div className="w-full max-w-4xl bg-white border border-[#E5E5E5] shadow-sm p-8 md:p-12">
          <p className="text-gray-400">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F3] p-8 pt-32 flex justify-center text-[#111]">
      <div className="w-full max-w-4xl bg-white border border-[#E5E5E5] shadow-sm p-8 md:p-12">
        <div className="mb-10">
          <Link href="/admin" className="text-xs text-gray-400 hover:text-black">← Back to Dashboard</Link>
          <h1 className="text-4xl font-serif mt-2">{editId ? 'Edit Space' : 'New Space'}</h1>
        </div>

        <div className="space-y-8">
          
          {/* 기본 정보 입력 */}
          <div className="grid grid-cols-2 gap-4">
            <input 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="Space Name" 
              className="col-span-2 text-3xl font-serif border-b border-gray-200 py-2 focus:outline-none focus:border-black bg-transparent"
              required
            />
            
            {/* 지역 선택 */}
            <select name="district" value={formData.district} onChange={handleChange} className="p-3 border rounded bg-white">
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* 카테고리 선택 (변경 시 태그 목록 바뀜) */}
            <select name="category" value={formData.category} onChange={handleChange} className="p-3 border rounded bg-white">
              <option value="CAFE">CAFE</option>
              <option value="DINING">DINING</option>
              <option value="CASUAL DINING">CASUAL DINING</option>
              <option value="STAY">STAY</option>
              <option value="COMPLEX">COMPLEX</option>
            </select>
          </div>

          {/* 상태 & 예약 링크 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">STATUS</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="PROPOSAL">PROPOSAL (제안용)</option>
                <option value="PUBLISHED">PUBLISHED (공개)</option>
                <option value="PRIVATE">PRIVATE (비공개)</option>
              </select>
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-500 mb-1">BOOKING URL</label>
               <input 
                 name="bookingUrl" 
                 value={formData.bookingUrl} 
                 onChange={handleChange} 
                 className="w-full p-2 border rounded focus:outline-none focus:border-black"
                 placeholder="https://app.catchtable.co.kr/..."
               />
            </div>
          </div>

          {/* Tagline (한 줄 요약) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">TAGLINE (한 줄 요약)</label>
            <input 
              name="tagline" 
              value={formData.tagline} 
              onChange={handleChange} 
              placeholder="성수의 리듬을 내려다보는, 모던 유러피안-아시안 다이닝" 
              className="w-full p-4 border border-gray-200 rounded focus:outline-none focus:border-black"
            />
          </div>

          {/* 상세 설명 */}
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="공간에 대한 상세한 묘사..." 
            className="w-full h-32 p-4 border border-gray-200 rounded focus:outline-none focus:border-black resize-none"
            required
          />

          {/* 4. 자유 태그 입력 영역 (인스타그램 해시태그 방식) */}
          <TagInput tags={formData.features} setTags={(tags) => setFormData({ ...formData, features: tags })} />

          {/* 이미지 업로드 */}
          <ImageUpload 
            value={formData.image} 
            onChange={(url) => setFormData({ ...formData, image: url })} 
          />

          {/* 주소/시간/주차 등 추가 정보 */}
          <div className="grid grid-cols-3 gap-4">
             <input 
               name="address" 
               value={formData.address} 
               onChange={handleChange} 
               placeholder="Address" 
               className="p-3 border rounded w-full focus:outline-none focus:border-black" 
             />
             <input 
               name="hours" 
               value={formData.hours} 
               onChange={handleChange} 
               placeholder="Hours" 
               className="p-3 border rounded w-full focus:outline-none focus:border-black" 
             />
             <input 
               name="parking" 
               value={formData.parking} 
               onChange={handleChange} 
               placeholder="Parking" 
               className="p-3 border rounded w-full focus:outline-none focus:border-black" 
             />
          </div>

          {/* 저장 버튼 */}
          <button 
            onClick={handleSubmit} 
            className="w-full bg-black text-white py-4 rounded font-bold hover:bg-gray-800 transition"
          >
            {editId ? 'UPDATE SPACE' : 'PUBLISH SPACE'}
          </button>
        </div>
      </div>
    </div>
  );
}

// 외부 컴포넌트: Suspense로 감싸기
function WritePageContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F5F3] p-8 pt-32 flex justify-center text-[#111]">
        <div className="w-full max-w-4xl bg-white border border-[#E5E5E5] shadow-sm p-8 md:p-12">
          <p className="text-gray-400">로딩 중...</p>
        </div>
      </div>
    }>
      <WriteForm />
    </Suspense>
  );
}
