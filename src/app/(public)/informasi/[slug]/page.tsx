import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { getInformationBySlug } from '@/lib/data/information';
import type { Metadata } from 'next';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const info = await getInformationBySlug(slug);
  if (!info) return { title: 'Informasi Tidak Ditemukan' };
  return { title: info.title, description: info.excerpt };
}

export const dynamic = 'force-dynamic';

export default async function InformasiDetailPage({ params }: Props) {
  const { slug } = await params;
  const info = await getInformationBySlug(slug);
  if (!info) notFound();

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      <div className="bg-[#022C22] text-white pt-[70px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
          <Link href="/informasi" className="inline-flex items-center gap-1 text-sm text-[#A7F3D0] hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Informasi
          </Link>
          <div className="mb-2">
            <span className="inline-block px-3 py-1 text-xs font-bold bg-[#059669] text-white shadow-sm rounded-full">{info.category}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight leading-tight">{info.title}</h1>
          <div className="flex items-center gap-2 mt-4 text-[#D1FAE5] text-sm font-medium">
            <Clock className="w-4 h-4" />
            {new Date(info.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {info.thumbnail && (
          <div className="mb-8 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={info.thumbnail} alt={info.title} className="w-full h-auto max-h-96 object-cover" />
          </div>
        )}
        <div className="bg-white rounded-xl border border-border-light p-6 lg:p-8">
          <div className="prose prose-emerald max-w-none text-text-secondary leading-relaxed whitespace-pre-line">
            {info.content}
          </div>
        </div>
      </div>
    </div>
  );
}
