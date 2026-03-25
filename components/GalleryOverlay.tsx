'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const TOTAL_IMAGES = 43;

interface GalleryOverlayProps {
  open: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export default function GalleryOverlay({ open, initialIndex = 0, onClose }: GalleryOverlayProps) {
  const [galleryIndex, setGalleryIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) setGalleryIndex(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setGalleryIndex(i => (i - 1 + TOTAL_IMAGES) % TOTAL_IMAGES);
      if (e.key === 'ArrowRight') setGalleryIndex(i => (i + 1) % TOTAL_IMAGES);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all z-[110]"
        aria-label="Cerrar galería"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative w-full max-w-6xl flex-1 flex flex-col items-center justify-center min-h-0 pt-8">
        <div className="relative w-full flex-1 flex items-center justify-center min-h-0">
          <img
            src={`/galeria/${galleryIndex + 1}.jpeg`}
            alt={`Filmina ${galleryIndex + 1}`}
            className="max-h-[75vh] max-w-full object-contain"
            style={{ display: 'block' }}
          />

          <button
            onClick={() => setGalleryIndex(i => (i - 1 + TOTAL_IMAGES) % TOTAL_IMAGES)}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setGalleryIndex(i => (i + 1) % TOTAL_IMAGES)}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-xl"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Counter */}
        <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/80 border border-white/20 text-white text-sm font-medium tracking-wide z-10">
          {galleryIndex + 1} / {TOTAL_IMAGES}
        </div>

        {/* Thumbnails */}
        <div className="w-full h-28 mt-4 overflow-x-auto flex gap-3 items-center px-4 py-2 shrink-0 border-t border-white/10">
          <div className="flex gap-3" style={{ minWidth: 'max-content', paddingBottom: '8px' }}>
            {Array.from({ length: TOTAL_IMAGES }, (_, i) => (
              <button
                key={i}
                onClick={() => setGalleryIndex(i)}
                className={`flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  galleryIndex === i
                    ? 'border-gold scale-105 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                    : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={`/galeria/${i + 1}.jpeg`}
                  alt={`Miniatura ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
