'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EditPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [placeId, setPlaceId] = useState<string>('');

  const [formData, setFormData] = useState({
    id: '',
    title: '',         
    category: 'CAFE',    
    district: 'SEONGSU', 
    description: '',   
    imageUrl: '', 
    address: '',       
    hours: '',         
    parking: '',   
  });

  // params 해결 (Promise일 수 있음)
  useEffect(() => {
    Promise.resolve(params).then((resolvedParams) => {
      setPlaceId(resolvedParams.id);
    });
  }, [params]);

  // 기존 데이터 불러오기
  useEffect(() => {
    if (!placeId) return;

    fetch('/api/templates')
      .then(res => res.json())
      .then(data => {
        const target = data.find((p: any) => p.id === placeId);
        if (target) {
          setFormData({
            id: target.id,
            title: target.title,
            category: target.category,
            district: target.properties?.district || 'SEONGSU',
            description: target.description || '',
            imageUrl: target.image || '',
            address: target.properties?.address || '',
            hours: target.properties?.hours || '',
            parking: target.properties?.parking || '',
          });
          setPreview(target.image || null);
        } else {
          alert("존재하지 않는 글입니다.");
          router.push('/admin');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching place:', error);
        alert("데이터를 불러오는데 실패했습니다.");
        router.push('/admin');
        setLoading(false);
      });
  }, [placeId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, imageUrl: value });
    setPreview(value || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 수정 데이터 포맷
    const updatedPlace = {
      id: formData.id, // ID는 유지
      slug: `${formData.district.toLowerCase()}-${formData.category.toLowerCase()}-${formData.title.toLowerCase().replace(/ /g, '-')}`,
      title: formData.title,
      category: formData.category, 
      image: formData.imageUrl || null,
      description: formData.description,
      properties: { 
        district: formData.district, 
        address: formData.address,   
        hours: formData.hours,       
        parking: formData.parking    
      },
      tags: [], // 기본 태그
    };

    const res = await fetch('/api/update-place', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPlace),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      alert('수정되었습니다!');
      router.push('/admin'); // 목록으로 이동
      router.refresh();
    } else {
      alert(`수정 실패: ${result.message || '알 수 없는 오류'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ttig-bg p-8 pt-32 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ttig-bg p-8 pt-32 flex justify-center">
      <div className="w-full max-w-3xl bg-white border border-ttig-line shadow-sm p-8 md:p-12">
        <h1 className="text-3xl font-serif font-bold mb-3 text-black">Edit Space</h1>
        <div className="w-10 h-1 bg-black mb-8"></div>
        
        <form onSubmit={handleSubmit} className="space-y-8 text-black">
          {/* 장소 이름 */}
          <div>
            <label className="block text-xs font-bold mb-2 uppercase text-gray-400">Place Name</label>
            <input 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              className="w-full p-4 bg-gray-50 border-b border-gray-200 focus:border-black outline-none text-lg font-serif transition-colors" 
              required 
            />
          </div>

          {/* 지역 & 카테고리 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold mb-2 uppercase text-gray-400">District</label>
              <select 
                name="district" 
                value={formData.district} 
                onChange={handleChange} 
                className="w-full p-4 bg-white border border-gray-200 focus:border-black outline-none font-bold transition-colors"
              >
                <option value="SEONGSU">SEONGSU</option>
                <option value="GANGNAM">GANGNAM</option>
                <option value="HANNAM">HANNAM</option>
                <option value="JAMSIL">JAMSIL</option>
                <option value="ETC">ETC</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 uppercase text-gray-400">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className="w-full p-4 bg-white border border-gray-200 focus:border-black outline-none font-bold transition-colors"
              >
                <option value="CAFE">CAFE</option>
                <option value="DINING">DINING</option>
                <option value="STAY">STAY</option>
                <option value="SPA">SPA</option>
                <option value="ABSTRACT">ABSTRACT</option>
                <option value="ATMOSPHERE">ATMOSPHERE</option>
                <option value="TEXTURE">TEXTURE</option>
                <option value="OBJECT">OBJECT</option>
              </select>
            </div>
          </div>

          {/* 이미지 URL */}
          <div>
            <label className="block text-xs font-bold mb-2 uppercase text-gray-400">Image URL</label>
            <input 
              type="text"
              name="imageUrl"
              value={formData.imageUrl} 
              onChange={handleImageUrlChange} 
              className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-black outline-none font-mono text-sm transition-colors" 
              placeholder="https://..."
            />
            {preview && (
              <div className="relative w-full aspect-video bg-gray-100 mt-4 rounded-lg overflow-hidden">
                <Image 
                  src={preview} 
                  alt="preview" 
                  fill 
                  className="object-cover" 
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}
          </div>

          {/* 설명 */}
          <div>
             <label className="block text-xs font-bold mb-2 uppercase text-gray-400">Curation Note</label>
             <textarea 
               name="description" 
               value={formData.description} 
               onChange={handleChange} 
               className="w-full p-4 bg-white border border-gray-200 focus:border-black outline-none h-32 resize-none transition-colors" 
               required 
             />
          </div>

          {/* 상세 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
             <div>
               <label className="block text-[10px] font-bold mb-1 uppercase text-gray-400">Address</label>
               <input 
                 name="address" 
                 value={formData.address} 
                 onChange={handleChange} 
                 className="w-full py-2 border-b border-gray-200 focus:border-black outline-none text-sm transition-colors" 
                 placeholder="상세 주소" 
               />
             </div>
             <div>
               <label className="block text-[10px] font-bold mb-1 uppercase text-gray-400">Hours</label>
               <input 
                 name="hours" 
                 value={formData.hours} 
                 onChange={handleChange} 
                 className="w-full py-2 border-b border-gray-200 focus:border-black outline-none text-sm transition-colors" 
                 placeholder="영업 시간" 
               />
             </div>
             <div>
               <label className="block text-[10px] font-bold mb-1 uppercase text-gray-400">Parking</label>
               <input 
                 name="parking" 
                 value={formData.parking} 
                 onChange={handleChange} 
                 className="w-full py-2 border-b border-gray-200 focus:border-black outline-none text-sm transition-colors" 
                 placeholder="주차 정보" 
               />
             </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={() => router.push('/admin')} 
              className="w-1/3 py-4 border border-black font-bold text-xs uppercase hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="w-2/3 py-4 bg-black text-white font-bold text-xs uppercase hover:bg-gray-800 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
