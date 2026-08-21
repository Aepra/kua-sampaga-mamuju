import { Landmark } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
      <div className="relative w-24 h-24">
        {/* Lingkaran Berputar (Outer) */}
        <div className="absolute inset-0 rounded-full border-t-4 border-[#059669] border-r-4 border-transparent animate-spin"></div>
        {/* Lingkaran Berputar (Inner) */}
        <div className="absolute inset-2 rounded-full border-b-4 border-[#FCD34D] border-l-4 border-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        {/* Icon Tengah */}
        <div className="absolute inset-0 flex items-center justify-center text-[#064E3B] animate-pulse">
          <Landmark className="w-8 h-8" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-[#1A2E1A] font-heading">Memuat Halaman...</h3>
        <p className="text-sm text-[#6B7E6B] mt-1">Harap tunggu sebentar, menyiapkan data KUA.</p>
      </div>
    </div>
  );
}
