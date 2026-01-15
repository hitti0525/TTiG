'use client';

import { useState } from 'react';
import { Bookmark, Share2 } from 'lucide-react';
import { toggleKeep, incrementShare } from '@/lib/actions/space';
import { motion, AnimatePresence } from 'framer-motion';

interface SpaceActionBarProps {
  spaceId: string;
  spaceSlug: string;
}

export default function SpaceActionBar({ spaceId, spaceSlug }: SpaceActionBarProps) {
  const [isKept, setIsKept] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleKeep = async () => {
    const result = await toggleKeep(spaceId || spaceSlug);
    if (result.success) {
      setIsKept(result.isKept || true);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      // URL 복사
      const url = `${window.location.origin}/${spaceSlug}`;
      await navigator.clipboard.writeText(url);
      
      // shares_count 증가
      await incrementShare(spaceId || spaceSlug);
      
      // Toast 메시지 표시
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to share:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      {/* Action Bar - 에디토리얼 스타일 */}
      <div className="mt-16 mb-12">
        {/* 1px Hairline */}
        <div className="w-full h-px bg-black/10 mb-6"></div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-8">
          {/* Keep Button */}
          <button
            onClick={handleKeep}
            className="flex items-center gap-2 group transition-all duration-300"
            aria-label="Keep this space"
          >
            <Bookmark
              size={14}
              className={`transition-all duration-300 ${
                isKept
                  ? 'fill-black text-black'
                  : 'text-black/40 group-hover:text-black'
              }`}
              strokeWidth={1}
            />
            <span className="text-[10px] font-sans tracking-tighter text-black/60 group-hover:text-black transition-colors duration-300">
              KEEP
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center gap-2 group transition-all duration-300 disabled:opacity-50"
            aria-label="Share this space"
          >
            {isSharing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
              >
                <Share2 size={14} className="text-black/40" strokeWidth={1} />
              </motion.div>
            ) : (
              <Share2
                size={14}
                className="text-black/40 group-hover:text-black transition-colors duration-300"
                strokeWidth={1}
              />
            )}
            <span className="text-[10px] font-sans tracking-tighter text-black/60 group-hover:text-black transition-colors duration-300">
              SHARE
            </span>
          </button>
        </div>
      </div>

      {/* Toast Message */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-black/90 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-sm">
              <p className="text-sm font-serif">
                서울의 한 장면을 담았습니다
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
