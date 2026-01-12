'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

export default function TagInput({ tags, setTags }: TagInputProps) {
  const [input, setInput] = useState('');

  // 엔터 키를 누르면 태그 추가
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedInput = input.trim();
      
      // 빈 값이 아니고, 이미 있는 태그가 아닐 때만 추가
      if (trimmedInput && !tags.includes(trimmedInput)) {
        setTags([...tags, trimmedInput]);
        setInput(''); // 입력창 비우기
      }
    }
  };

  // X 버튼 누르면 태그 삭제
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
        Features / Tags (Type & Enter)
      </label>
      
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg bg-white focus-within:border-black transition-colors min-h-[50px]">
        {/* 생성된 태그들 보여주기 */}
        {tags.map((tag, index) => (
          <span 
            key={index} 
            className="flex items-center gap-1 px-3 py-1 bg-black text-white rounded-full text-xs font-bold tracking-wide animate-fadeIn"
          >
            {tag}
            <button 
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-gray-300 transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}

        {/* 입력 창 */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Type keywords like 'Seongsu Vibe' and press Enter..." : ""}
          className="flex-1 bg-transparent outline-none text-sm min-w-[150px] placeholder:text-gray-300"
        />
      </div>
      <p className="text-[10px] text-gray-400 mt-2 text-right">
        * 키워드를 입력하고 엔터(Enter)를 누르세요.
      </p>
    </div>
  );
}
