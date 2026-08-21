'use client';

import { useState } from 'react';
import { X, BookOpen, Landmark } from 'lucide-react';
import { GALLERY_CATEGORIES } from '@/lib/types';
import type { GalleryItem } from '@/lib/types';
import EmptyState from '@/components/ui/StateDisplay';

interface GalleryClientProps { gallery: GalleryItem[] }

export default function GalleryClient({ gallery }: GalleryClientProps) {
  const [category, setCategory] = useState('Semua');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filtered = category === 'Semua' ? gallery : gallery.filter(g => g.category === category);

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-gray-900">
      <div className="bg-[#022C22] dark:bg-gray-950 text-white pt-[70px] relative overflow-hidden">
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
                  : 'bg-white dark:bg-gray-800 text-[#4A5D4A] dark:text-gray-300 hover:bg-[#ECFDF5] dark:hover:bg-gray-700 dark:bg-gray-800 hover:text-[#047857] dark:text-emerald-400 border border-[#E5EBE5] dark:border-gray-700 hover:border-[#10B981]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
            {filtered.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group w-full flex flex-col bg-white dark:bg-gray-800 rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_-10px_rgba(5,150,105,0.15)] transition-all duration-300 text-left mb-4 sm:mb-6 cursor-pointer"
              >
                <div className="relative w-full overflow-hidden bg-gray-100">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.title} className="w-full h-auto block group-hover:scale-105 transition-transform duration-500 ease-out" />
                  ) : (
                    <div className="w-full aspect-square flex items-center justify-center"><BookOpen className="w-12 h-12 text-[#10B981] opacity-30" /></div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white dark:bg-gray-800/90 backdrop-blur-sm text-[#059669] dark:text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-wider shadow-sm">{item.category}</span>
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-extrabold text-[#1A2E1A] dark:text-gray-100 text-base sm:text-lg font-heading leading-snug group-hover:text-[#059669] dark:group-hover:text-emerald-400 dark:text-emerald-400 transition-colors">{item.title}</h3>
                  {item.date && <p className="text-[10px] sm:text-[11px] font-bold text-[#6B7E6B] dark:text-gray-400 mt-2 uppercase tracking-wider">{item.date}</p>}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-[24px] border border-[#E5EBE5] dark:border-gray-700 p-12 text-center">
            <BookOpen className="w-16 h-16 text-[#C8D5C8] mx-auto mb-4" />
            <EmptyState title="Belum ada foto" description="Galeri foto akan ditampilkan di sini." />
          </div>
        )}
      </div>

      {/* Lightbox / Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 sm:p-6 lg:p-10 backdrop-blur-md" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 p-2.5 rounded-full transition-all z-[110]" onClick={() => setSelectedImage(null)} aria-label="Tutup">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="bg-white dark:bg-gray-800 w-full max-w-5xl max-h-[90vh] sm:max-h-[85vh] rounded-2xl sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row relative" onClick={e => e.stopPropagation()}>
            
            {/* Image Section with blurred background */}
            <div className="w-full md:w-3/5 lg:w-2/3 bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden h-[40vh] md:h-[85vh]">
              {selectedImage.image && (
                <div className="absolute inset-0 opacity-40 blur-2xl transform scale-110" style={{ backgroundImage: `url(${selectedImage.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              )}
              {selectedImage.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedImage.image} alt={selectedImage.title} className="max-w-full max-h-full object-contain relative z-10" />
              ) : (
                <BookOpen className="w-20 h-20 text-white/20 relative z-10" />
              )}
            </div>

            {/* Info Section (Instagram Style) */}
            <div className="w-full md:w-2/5 lg:w-1/3 bg-white dark:bg-gray-800 flex flex-col h-[50vh] md:h-[85vh]">
              <div className="p-6 sm:p-8 flex-grow overflow-y-auto">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#064E3B] to-[#022C22] flex items-center justify-center text-white flex-shrink-0 shadow-md">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#1A2E1A] dark:text-gray-100 text-sm font-heading leading-none mb-1">Admin KUA</h4>
                    <p className="text-[10px] text-[#059669] dark:text-emerald-400 font-black uppercase tracking-wider">{selectedImage.category}</p>
                  </div>
                </div>
                
                <div className="w-full h-[1px] bg-gray-100 my-5"></div>
                
                <h2 className="text-xl sm:text-2xl font-black text-[#1A2E1A] dark:text-gray-100 font-heading leading-tight mb-3">
                  {selectedImage.title}
                </h2>
                
                {selectedImage.date && (
                  <p className="text-[11px] font-bold text-[#6B7E6B] dark:text-gray-400 mb-5 uppercase tracking-widest">{selectedImage.date}</p>
                )}
                
                {selectedImage.description && (
                  <div className="prose prose-sm max-w-none text-[#4A5D4A] dark:text-gray-300 leading-relaxed">
                    <p>{selectedImage.description}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

