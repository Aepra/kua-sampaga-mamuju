'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, FileText } from 'lucide-react';
import type { Service } from '@/lib/types';

interface SearchSectionProps {
  services: Service[];
}

export default function SearchSection({ services }: SearchSectionProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return services.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.keywords.some(k => k.toLowerCase().includes(q)) ||
      s.requirements.some(r => r.title.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [query, services]);

  return (
    <div className="py-12 sm:py-16 bg-[#F8FAF9] dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5EBE5] dark:border-gray-700 p-6 sm:p-12 relative">
          {/* Decorative accents */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#ECFDF5] to-transparent rounded-bl-full opacity-60 overflow-hidden"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#FFFBEB] to-transparent rounded-tr-full opacity-60 overflow-hidden"></div>
          
          <div className="relative z-10 text-center mb-8 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A2E1A] dark:text-gray-100 font-heading tracking-tight">
              Cari Informasi Layanan
            </h2>
            <p className="text-sm sm:text-base text-[#4A5D4A] dark:text-gray-300">
              Ketik nama layanan, kata kunci, atau jenis surat yang Anda butuhkan
            </p>
          </div>

          <div className="relative z-20 max-w-2xl mx-auto">
            <div className="relative shadow-sm group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#059669] dark:text-emerald-400 group-focus-within:text-[#10B981] transition-colors pointer-events-none z-10" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Contoh: pendaftaran nikah, perubahan nama, wakaf..."
                style={{ paddingLeft: '56px' }}
                className="w-full pr-5 py-4 sm:py-5 text-sm sm:text-base bg-white dark:bg-gray-800 border-2 border-[#E5EBE5] dark:border-gray-700 rounded-[20px] focus:border-[#10B981] dark:focus:border-emerald-500 focus:ring-4 focus:ring-[#ECFDF5] outline-none transition-all placeholder:text-[#6B7E6B] dark:text-gray-400 font-medium text-[#1A2E1A] dark:text-gray-100"
                aria-label="Cari informasi layanan"
              />
            </div>
          </div>
        </div>

        {/* Search Results - rendered OUTSIDE the card so it's never clipped */}
        {query.trim() && (
          <div className="relative z-30 max-w-2xl mx-auto -mt-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-[#E5EBE5] dark:border-gray-700 shadow-2xl overflow-hidden animate-fade-in">
              {results.length > 0 ? (
                <div className="py-2 divide-y divide-[#E5EBE5]">
                  <div className="px-5 py-3 bg-[#F8FAF9] dark:bg-gray-900 text-[11px] font-bold text-[#059669] dark:text-emerald-400 uppercase tracking-wider">
                    Hasil Pencarian ({results.length})
                  </div>
                  {results.map(service => (
                    <Link
                      key={service.id}
                      href={`/layanan/${service.slug}`}
                      className="flex items-center justify-between px-5 py-4 hover:bg-[#ECFDF5] dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors group/item"
                      onClick={() => setQuery('')}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-[#E5EBE5] dark:border-gray-700 group-hover/item:border-[#A7F3D0] text-[#059669] dark:text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-sm transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1A2E1A] dark:text-gray-100 group-hover/item:text-[#059669] dark:text-emerald-400 transition-colors font-heading">
                            {service.title}
                          </p>
                          <p className="text-xs text-[#6B7E6B] dark:text-gray-400 mt-0.5">
                            {service.category} <span className="mx-1.5 opacity-50">•</span> 📋 {service.requirements.length} Persyaratan
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#6B7E6B] dark:text-gray-400 group-hover/item:text-[#059669] dark:text-emerald-400 group-hover/item:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-10 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#F8FAF9] dark:bg-gray-900 flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5 text-[#6B7E6B] dark:text-gray-400" />
                  </div>
                  <p className="text-sm font-bold text-[#1A2E1A] dark:text-gray-100">Layanan tidak ditemukan</p>
                  <p className="text-xs text-[#6B7E6B] dark:text-gray-400">Coba kata kunci lain seperti &quot;nikah&quot;, &quot;nama&quot;, atau &quot;wakaf&quot;.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

