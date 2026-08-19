'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/lib/types';
import ServiceCardPublic from '@/components/public/ServiceCard';

interface LayananSectionProps {
  services: Service[];
  categories: string[];
  iconMap: Record<string, React.ReactNode>;
}

export default function LayananSection({ services, categories, iconMap }: LayananSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter services based on active category, and slice to 6 items if it's "Semua Layanan"
  const filteredServices = activeCategory
    ? services.filter(s => s.category === activeCategory)
    : services.slice(0, 6);

  return (
    <section id="layanan-section" className="py-10 lg:py-24 bg-[#F8FAF9] border-t border-b border-[#E5EBE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 lg:mb-12 space-y-3 sm:space-y-4">
          <span className="text-[10px] sm:text-xs font-bold text-[#059669] uppercase tracking-[0.15em] bg-[#ECFDF5] px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[#D1FAE5] inline-block shadow-sm">
            Layanan KUA
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A2E1A] font-heading tracking-tight">
            Layanan & Persyaratan
          </h2>
          <p className="text-sm sm:text-base text-[#4A5D4A] leading-relaxed">
            Temukan informasi lengkap terkait persyaratan dokumen, alur pengurusan, dan persiapan sebelum Anda berkunjung ke KUA.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex overflow-x-auto gap-2 sm:gap-3 mb-10 pt-2 pb-4 hide-scrollbar snap-x">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 snap-start whitespace-nowrap px-5 py-2.5 text-xs sm:text-sm font-bold rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-95 ${
              activeCategory === null
                ? 'bg-[#064E3B] text-white border border-[#064E3B]'
                : 'bg-white text-[#4A5D4A] hover:bg-[#ECFDF5] hover:text-[#047857] border border-[#E5EBE5] hover:border-[#10B981]'
            }`}
          >
            Semua Layanan ({services.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 snap-start whitespace-nowrap px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-95 ${
                activeCategory === cat
                  ? 'bg-[#064E3B] text-white border border-[#064E3B]'
                  : 'bg-white text-[#4A5D4A] hover:bg-[#ECFDF5] hover:text-[#047857] border border-[#E5EBE5] hover:border-[#10B981]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Service Cards Grid - Uniform Heights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
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
          <div className="mt-12 text-center">
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-[#ECFDF5] border-2 border-[#E5EBE5] hover:border-[#34D399] text-[#047857] font-bold text-sm rounded-full transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Lihat Seluruh Layanan KUA ({services.length})
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
