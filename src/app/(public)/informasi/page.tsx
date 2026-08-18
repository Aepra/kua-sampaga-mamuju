import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, BookOpen } from 'lucide-react';
import { getPublishedInformation } from '@/lib/data/information';
import EmptyState from '@/components/ui/StateDisplay';

export const metadata: Metadata = {
  title: 'Informasi',
  description: 'Pengumuman, berita, dan informasi terbaru dari KUA Kecamatan Sampaga Kabupaten Mamuju.',
};

export const dynamic = 'force-dynamic';

export default async function InformasiPage() {
  const information = await getPublishedInformation();

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      <div className="bg-[#022C22] text-white pt-[70px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading">Informasi</h1>
          <p className="mt-2 text-[#A7F3D0]">Pengumuman dan berita terkini dari KUA Kecamatan Sampaga.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {information.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {information.map(info => (
              <Link
                key={info.id}
                href={`/informasi/${info.slug}`}
                className="group bg-white rounded-[24px] border border-[#E5EBE5] overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#10B981] transition-all duration-300 flex flex-col h-full"
              >
                <div className="h-48 sm:h-56 bg-[#F1F5F3] relative overflow-hidden flex items-center justify-center">
                  {info.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={info.thumbnail} alt={info.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                  ) : (
                    <BookOpen className="w-12 h-12 text-[#6B7E6B] opacity-40" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="absolute top-4 left-4 text-[10px] font-bold text-[#047857] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                    {info.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3 text-[12px] font-medium text-[#6B7E6B]">
                    <Clock className="w-4 h-4 text-[#059669]" />
                    <span>{new Date(info.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h3 className="font-extrabold text-[#1A2E1A] text-lg sm:text-xl group-hover:text-[#059669] transition-colors font-heading line-clamp-2 leading-snug">{info.title}</h3>
                  <p className="mt-3 text-sm text-[#4A5D4A] line-clamp-3 leading-relaxed flex-grow">{info.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[24px] border border-[#E5EBE5] p-12 text-center">
            <BookOpen className="w-16 h-16 text-[#C8D5C8] mx-auto mb-4" />
            <EmptyState title="Belum ada informasi" description="Informasi dan pengumuman akan ditampilkan di sini." />
          </div>
        )}
      </div>
    </div>
  );
}
