// app/components/ImageUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.url) {
        onChange(data.url); // 부모에게 업로드된 주소 전달
      } else {
        alert("이미지 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
        Main Image (Upload)
      </label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all group overflow-hidden bg-white"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleUpload}
        />

        {value ? (
          // 이미지가 있을 때: 미리보기 표시
          <>
            <Image 
              src={value} 
              alt="Preview" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold uppercase tracking-widest">
              Change Image
            </div>
          </>
        ) : (
          // 이미지가 없을 때: 업로드 안내
          <div className="text-center text-gray-400 group-hover:text-black transition-colors">
            {isUploading ? (
              <span className="animate-pulse">Uploading...</span>
            ) : (
              <>
                <Upload className="mx-auto mb-2" size={24} />
                <span className="text-xs font-bold tracking-widest uppercase">Click to Upload</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
