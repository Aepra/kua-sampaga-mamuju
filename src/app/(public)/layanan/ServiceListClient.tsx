'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ServiceCardPublic from '@/components/public/ServiceCard';
import EmptyState from '@/components/ui/StateDisplay';
import type { Service } from '@/lib/types';
import { SERVICE_CATEGORIES } from '@/lib/types';

// Icon mapping
import { Heart, FileText, ClipboardList, Users, Landmark, BookOpen, BadgeCheck } from 'lucide-react';
const iconMap: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-6 h-6" />,
  Globe: <BookOpen className="w-6 h-6" />,
  FileEdit: <FileText className="w-6 h-6" />,
  UserCog: <Users className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
  ScrollText: <ClipboardList className="w-6 h-6" />,
  Landmark: <Landmark className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  BookHeart: <Heart className="w-6 h-6" />,
  HeartHandshake: <Heart className="w-6 h-6" />,
  BadgeCheck: <BadgeCheck className="w-6 h-6" />,
  BookOpen: <BookOpen className="w-6 h-6" />,
};

interface ServiceListClientProps {
  services: Service[];
  categories: string[];
}

export default function ServiceListClient({ services, categories }: ServiceListClientProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState<'name' | 'category'>('name');

  const filtered = useMemo(() => {
    let result = services;

    // Filter by category
    if (selectedCategory !== 'Semua') {
      result = result.filter(s => s.category === selectedCategory);
    }

    // Filter by search
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.keywords.some(k => k.toLowerCase().includes(q)) ||
        s.requirements.some(r => r.title.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return a.category.localeCompare(b.category);
    });

    return result;
  }, [services, query, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      {/* Header */}
      <div className="bg-[#022C22] text-white pt-[70px] relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative z-10">
          <h1 className="text-2xl sm:text-4xl font-bold font-heading">Layanan KUA</h1>
          <p className="mt-2 text-[#A7F3D0] max-w-2xl">
            Temukan informasi persyaratan dan dokumen yang perlu dipersiapkan sebelum datang ke kantor KUA.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and filters */}
        <div className="bg-white rounded-2xl border border-[#E5EBE5] shadow-sm p-5 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7E6B]" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Cari layanan..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F8FAF9] border border-[#E5EBE5] rounded-xl focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/20 outline-none transition-all placeholder-[#6B7E6B]"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7E6B] pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as 'name' | 'category')}
                  className="pl-10 pr-8 text-sm bg-[#F8FAF9] border border-[#E5EBE5] rounded-xl py-2.5 outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/20 text-[#4A5D4A] appearance-none"
                >
                  <option value="name">Nama A-Z</option>
                  <option value="category">Kategori</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7E6B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            {SERVICE_CATEGORIES.filter(c => c === 'Semua' || categories.includes(c)).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#064E3B] text-white shadow-md'
                    : 'bg-white text-[#4A5D4A] hover:bg-[#ECFDF5] hover:text-[#047857] border border-[#E5EBE5] hover:border-[#10B981]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <p className="text-sm text-[#6B7E6B] font-medium mb-4">
          Ditemukan <span className="text-[#059669] font-bold">{filtered.length}</span> layanan
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 items-stretch">
            {filtered.map((service, i) => (
              <div key={service.id} className="h-full">
                <ServiceCardPublic
                  service={service}
                  icon={iconMap[service.icon]}
                  index={i}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Layanan tidak ditemukan"
            description="Coba gunakan kata kunci lain atau ubah filter kategori."
          />
        )}
      </div>
    </div>
  );
}
