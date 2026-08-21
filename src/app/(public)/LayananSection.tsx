'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, FileText, Search } from 'lucide-react';
import type { Service } from '@/lib/types';
import ServiceCardPublic from '@/components/public/ServiceCard';

interface LayananSectionProps {
  services: Service[];
  categories: string[];
  iconMap: Record<string, React.ReactNode>;
}

export default function LayananSection({ services, categories, iconMap }: LayananSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return services.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.keywords.some(k => k.toLowerCase().includes(q)) ||
      s.requirements.some(r => r.title.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [searchQuery, services]);

  // Filter services based on active category
  const filteredServices = activeCategory
    ? services.filter(s => s.category === activeCategory)
    : services.slice(0, 6);

  // Show search results or category-filtered services
  const isSearching = searchQuery.trim().length > 0;

  return (
    <section id="layanan-section" className="py-8 sm:py-10 lg:py-24 bg-white dark:bg-gray-800 border-t border-b border-[#E5EBE5] dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title - compact on mobile */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-8 lg:mb-12 space-y-1.5 sm:space-y-4">
          <span className="text-[10px] sm:text-xs font-bold text-[#059669] dark:text-emerald-400 uppercase tracking-[0.15em] bg-[#ECFDF5] dark:bg-gray-800 px-3 py-1 sm:py-1.5 rounded-full border border-[#D1FAE5] inline-block shadow-sm">
            Layanan KUA
          </span>
          <h2 className="text-xl sm:text-4xl font-extrabold text-[#1A2E1A] dark:text-gray-100 font-heading tracking-tight">
            Layanan & Persyaratan
          </h2>
          <p className="text-xs sm:text-base text-[#4A5D4A] dark:text-gray-300 leading-relaxed hidden sm:block">
            Temukan informasi lengkap terkait persyaratan dokumen, alur pengurusan, dan persiapan sebelum Anda berkunjung ke KUA.
          </p>
        </div>

        {/* Category Filter Pills + Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
          {/* Filter Pills */}
          <div className="flex overflow-x-auto gap-1.5 sm:gap-3 pt-1 pb-2 sm:pb-0 hide-scrollbar snap-x flex-shrink-0">
            <button
              onClick={() => { setActiveCategory(null); setSearchQuery(''); }}
              className={`shrink-0 snap-start whitespace-nowrap px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-sm font-bold rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-95 ${
                activeCategory === null && !isSearching
                  ? 'bg-[#064E3B] text-white border border-[#064E3B]'
                  : 'bg-white dark:bg-gray-800 text-[#4A5D4A] dark:text-gray-300 hover:bg-[#ECFDF5] dark:hover:bg-gray-700 dark:bg-gray-800 hover:text-[#047857] dark:text-emerald-400 border border-[#E5EBE5] dark:border-gray-700 hover:border-[#10B981]'
              }`}
            >
              Semua ({services.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSearchQuery(''); }}
                className={`shrink-0 snap-start whitespace-nowrap px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-sm font-semibold rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-95 ${
                  activeCategory === cat && !isSearching
                    ? 'bg-[#064E3B] text-white border border-[#064E3B]'
                    : 'bg-white dark:bg-gray-800 text-[#4A5D4A] dark:text-gray-300 hover:bg-[#ECFDF5] dark:hover:bg-gray-700 dark:bg-gray-800 hover:text-[#047857] dark:text-emerald-400 border border-[#E5EBE5] dark:border-gray-700 hover:border-[#10B981]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar - inline on desktop, full width on mobile */}
          <div className="relative sm:ml-auto sm:w-72 lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#059669] dark:text-emerald-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari layanan..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-[#E5EBE5] dark:border-gray-700 rounded-full focus:border-[#10B981] dark:focus:border-emerald-500 focus:ring-2 focus:ring-[#ECFDF5] outline-none transition-all placeholder:text-[#6B7E6B] dark:text-gray-400 text-[#1A2E1A] dark:text-gray-100 shadow-sm"
              aria-label="Cari layanan"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7E6B] dark:text-gray-400 hover:text-[#1A2E1A] dark:text-gray-100 text-xs font-bold transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {isSearching ? (
          <div className="space-y-2 sm:space-y-3">
            {searchResults.length > 0 ? (
              <>
                <p className="text-[11px] sm:text-xs font-bold text-[#059669] dark:text-emerald-400 uppercase tracking-wider mb-3">
                  Hasil pencarian ({searchResults.length})
                </p>
                {searchResults.map((service, i) => (
                  <Link
                    key={service.id}
                    href={`/layanan/${service.slug}`}
                    className="group flex items-center gap-3 sm:gap-4 p-3.5 sm:p-5 bg-white dark:bg-gray-800 rounded-2xl border border-[#E5EBE5] dark:border-gray-700 hover:border-[#10B981] shadow-sm hover:shadow-md transition-all animate-fade-in"
                    style={{ animationDelay: `${i * 0.03}s` }}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] text-[#059669] dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      {iconMap[service.icon] || <FileText className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] sm:text-[10px] font-bold text-[#059669] dark:text-emerald-400 uppercase tracking-wider">{service.category}</span>
                      <h3 className="text-sm sm:text-base font-bold text-[#1A2E1A] dark:text-gray-100 group-hover:text-[#059669] dark:group-hover:text-emerald-400 dark:text-emerald-400 transition-colors truncate leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-[#6B7E6B] dark:text-gray-400 mt-0.5 line-clamp-1">{service.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#059669] dark:text-emerald-400 flex-shrink-0">
                      <span className="hidden sm:inline">Detail</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </>
            ) : (
              <div className="py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border border-[#E5EBE5] dark:border-gray-700 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5 text-[#6B7E6B] dark:text-gray-400" />
                </div>
                <p className="text-sm font-bold text-[#1A2E1A] dark:text-gray-100">Layanan tidak ditemukan</p>
                <p className="text-xs text-[#6B7E6B] dark:text-gray-400 mt-1">Coba kata kunci lain seperti &quot;nikah&quot;, &quot;nama&quot;, atau &quot;wakaf&quot;.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Mobile: Compact list cards */}
            <div className="sm:hidden space-y-2">
              {filteredServices.map((service, i) => (
                <Link
                  key={service.id}
                  href={`/layanan/${service.slug}`}
                  className="group flex items-center gap-3 p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-[#E5EBE5] dark:border-gray-700 hover:border-[#10B981] shadow-sm hover:shadow-md transition-all animate-fade-in"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] text-[#059669] dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    {iconMap[service.icon] || <FileText className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-[#059669] dark:text-emerald-400 uppercase tracking-wider">{service.category}</span>
                    <h3 className="text-sm font-bold text-[#1A2E1A] dark:text-gray-100 group-hover:text-[#059669] dark:group-hover:text-emerald-400 dark:text-emerald-400 transition-colors truncate leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-[11px] text-[#6B7E6B] dark:text-gray-400 mt-0.5 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {service.requirements.length} Persyaratan
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6B7E6B] dark:text-gray-400 group-hover:text-[#059669] dark:group-hover:text-emerald-400 dark:text-emerald-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </Link>
              ))}
            </div>

            {/* Desktop/Tablet: Original grid cards */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {filteredServices.map((service, i) => (
                <div key={service.id} className="h-full">
                  <ServiceCardPublic
                    service={service}
                    icon={iconMap[service.icon]}
                    index={i}
                  />
                </div>
              ))}
            </div>

            {/* View All Button */}
            {services.length > 6 && activeCategory === null && (
              <div className="mt-8 sm:mt-12 text-center">
                <Link
                  href="/layanan"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white dark:bg-gray-800 hover:bg-[#ECFDF5] dark:hover:bg-gray-700 dark:bg-gray-800 border-2 border-[#E5EBE5] dark:border-gray-700 hover:border-[#34D399] text-[#047857] dark:text-emerald-400 font-bold text-sm rounded-full transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  Lihat Seluruh Layanan KUA ({services.length})
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}


