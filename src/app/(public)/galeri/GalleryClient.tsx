'use client';

import { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { GALLERY_CATEGORIES } from '@/lib/types';
import type { GalleryItem } from '@/lib/types';
import EmptyState from '@/components/ui/StateDisplay';

interface GalleryClientProps { gallery: GalleryItem[] }

export default function GalleryClient({ gallery }: GalleryClientProps) {
  const [category, setCategory] = useState('Semua');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filtered = category === 'Semua' ? gallery : gallery.filter(g => g.category === category);

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      <div className="bg-[#022C22] text-white pt-[70px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative z-10">
          <h1 className="text-2xl sm:text-4xl font-bold font-heading">Galeri</h1>
          <p className="mt-2 text-[#A7F3D0]">Dokumentasi kegiatan KUA Kecamatan Sampaga.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {GALLERY_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2.5 text-xs font-semibold rounded-full transition-all ${
                category === cat
                  ? 'bg-[#064E3B] text-white shadow-md'
                  : 'bg-white text-[#4A5D4A] hover:bg-[#ECFDF5] hover:text-[#047857] border border-[#E5EBE5] hover:border-[#10B981]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group relative aspect-square rounded-[24px] overflow-hidden bg-[#064E3B] border border-[#E5EBE5] shadow-sm cursor-pointer"
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-12 h-12 text-[#10B981] opacity-30" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/90 via-[#022C22]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 text-left">
                    <p className="text-[10px] font-bold text-[#FCD34D] uppercase tracking-wider mb-1">{item.category}</p>
                    <p className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2">{item.title}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[24px] border border-[#E5EBE5] p-12 text-center">
            <BookOpen className="w-16 h-16 text-[#C8D5C8] mx-auto mb-4" />
            <EmptyState title="Belum ada foto" description="Galeri foto akan ditampilkan di sini." />
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors" onClick={() => setSelectedImage(null)} aria-label="Tutup">
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl w-full max-h-[85vh] relative flex flex-col items-center" onClick={e => e.stopPropagation()}>
            {selectedImage.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selectedImage.image} alt={selectedImage.title} className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl" />
            ) : (
              <div className="w-full max-w-lg aspect-square bg-[#022C22] rounded-xl flex items-center justify-center"><BookOpen className="w-20 h-20 text-[#10B981] opacity-50" /></div>
            )}
            <div className="mt-6 text-center max-w-2xl bg-black/50 p-6 rounded-2xl backdrop-blur-md border border-white/10">
              <span className="inline-block px-3 py-1 bg-white/10 text-[#A7F3D0] text-xs font-bold rounded-full mb-3 uppercase tracking-wider">{selectedImage.category}</span>
              <p className="text-white font-bold text-xl sm:text-2xl font-heading mb-2">{selectedImage.title}</p>
              {selectedImage.description && <p className="text-white/70 text-sm leading-relaxed">{selectedImage.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
