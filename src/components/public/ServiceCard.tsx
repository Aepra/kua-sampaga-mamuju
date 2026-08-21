import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';
import type { Service } from '@/lib/types';

interface ServiceCardPublicProps {
  service: Service;
  icon?: React.ReactNode;
  index?: number;
}

export default function ServiceCardPublic({ service, icon, index = 0 }: ServiceCardPublicProps) {
  return (
    <Link
      href={`/layanan/${service.slug}`}
      className="group h-full bg-white dark:bg-gray-800 rounded-[24px] border border-[#E5EBE5] dark:border-gray-700 hover:border-[#10B981] hover:shadow-[0_12px_32px_rgba(16,185,129,0.1)] transition-all duration-300 flex flex-col relative overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="p-6 sm:p-8 flex-grow flex flex-col gap-4">
        {/* Header: Icon & Category */}
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] text-[#059669] dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
            {icon || <FileText className="w-7 h-7 text-[#059669] dark:text-emerald-400" />}
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#059669] dark:text-emerald-400 uppercase tracking-[0.1em] block mb-1">
              {service.category}
            </span>
            <h3 className="font-extrabold text-[#1A2E1A] dark:text-gray-100 text-lg group-hover:text-[#059669] dark:group-hover:text-emerald-400 dark:text-emerald-400 transition-colors font-heading line-clamp-2 leading-tight">
              {service.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#4A5D4A] dark:text-gray-300 line-clamp-3 leading-relaxed mt-2">
          {service.description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="px-6 sm:px-8 py-5 bg-[#F8FAF9] dark:bg-gray-900 border-t border-[#E5EBE5] dark:border-gray-700 flex items-center justify-between mt-auto group-hover:bg-[#064E3B] transition-colors duration-300">
        <span className="text-[13px] font-semibold text-[#6B7E6B] dark:text-gray-400 group-hover:text-[#A7F3D0] flex items-center gap-2 transition-colors">
          <FileText className="w-4 h-4" />
          {service.requirements.length} Persyaratan
        </span>
        <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#059669] dark:text-emerald-400 group-hover:text-white transition-colors">
          Lihat Detail
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
        </span>
      </div>

      {service.isDummy && (
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800/90 backdrop-blur-sm border border-[#FDE68A] px-3 py-1.5 rounded-lg shadow-sm">
           <p className="text-[10px] text-[#D97706] font-extrabold uppercase tracking-widest">Contoh</p>
        </div>
      )}
    </Link>
  );
}

