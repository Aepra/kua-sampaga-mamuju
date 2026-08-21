import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, Calendar, ChevronRight, Share2, MessageCircle, Link2, BookOpen } from 'lucide-react';
import { getInformationBySlug, getPublishedInformation } from '@/lib/data/information';
import type { Metadata } from 'next';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const info = await getInformationBySlug(slug);
  if (!info) return { title: 'Informasi Tidak Ditemukan' };
  return { title: info.title, description: info.excerpt };
}

export const revalidate = 60;

export default async function InformasiDetailPage({ params }: Props) {
  const { slug } = await params;
  const [info, allInfo] = await Promise.all([
    getInformationBySlug(slug),
    getPublishedInformation()
  ]);

  if (!info) notFound();

  // Ambil 4 berita terbaru untuk sidebar (kecuali berita yang sedang dibuka)
  const recentInfo = allInfo.filter(i => i.id !== info.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F4F7F5] dark:bg-gray-950 pt-[90px] pb-16">
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#E0EBE4] via-[#F4F7F5] to-transparent dark:from-gray-900 dark:via-gray-950 dark:to-transparent z-0 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-[13px] sm:text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
          <Link href="/" className="hover:text-primary-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 sm:mx-2" />
          <Link href="/informasi-dan-berita" className="hover:text-primary-600 transition-colors">Informasi & Berita</Link>
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 sm:mx-2" />
          <span className="text-primary-600">{info.category}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Bagian Kiri: Artikel Utama */}
          <article className="lg:col-span-8">
            <header className="mb-8">
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-primary-600 rounded-sm">
                  {info.category}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-gray-900 dark:text-gray-100 leading-[1.2] font-heading mb-6 tracking-tight">
                {info.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-gray-200 dark:border-gray-700 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-gray-800 border border-primary-100 dark:border-gray-700 flex items-center justify-center text-primary-600 font-bold shadow-sm">
                    KUA
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Admin KUA Sampaga</p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(info.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1 sm:mr-2">Bagikan:</span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all" title="Share">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all" title="Komentar">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" title="Copy Link">
                    <Link2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </header>

            {info.thumbnail && (
              <figure className="mb-10">
                <div className="rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex justify-center shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={info.thumbnail} 
                    alt={info.title} 
                    className="w-full h-auto max-h-[600px] object-contain" 
                  />
                </div>
                <figcaption className="text-[13px] text-gray-500 dark:text-gray-400 mt-3 text-center italic">
                  Gambar Ilustrasi / Sampul: {info.title}
                </figcaption>
              </figure>
            )}

            <div className="prose prose-lg prose-emerald max-w-none text-gray-800 dark:text-gray-100 leading-[1.8] prose-p:text-[1.125rem] prose-headings:font-heading prose-a:text-primary-600 hover:prose-a:text-primary-700 mb-12 font-serif sm:font-sans">
              {info.content.split('\n').map((paragraph, idx) => {
                if (!paragraph.trim()) return <br key={idx} className="my-2" />;
                return <p key={idx} className="mb-4 text-justify">{paragraph}</p>;
              })}
            </div>

            {/* Dokumentasi */}
            {info.images && info.images.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-heading flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                  Galeri Dokumentasi
                </h3>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {info.images.map((img, idx) => (
                    <div key={idx} className="group relative rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex justify-center shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Dokumentasi ${idx + 1}`} className="w-auto h-auto max-h-[400px] object-contain group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Bagian Kanan: Sidebar */}
          <aside className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 lg:sticky lg:top-[100px] shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-1.5 h-6 bg-primary-600 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 font-heading">Berita Terkini</h3>
              </div>
              
              <div className="space-y-6">
                {recentInfo.length > 0 ? recentInfo.map((recent) => (
                  <Link key={recent.id} href={`/informasi-dan-berita/${recent.slug}`} className="group block">
                    <div className="flex gap-4">
                      <div className="w-[100px] h-[80px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0 relative shadow-sm">
                        {recent.thumbnail || (recent.images && recent.images.length > 0) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={recent.thumbnail || recent.images[0]} 
                            alt={recent.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900">
                            <BookOpen className="w-6 h-6 opacity-40" />
                          </div>
                        )}
                        <div className="absolute top-0 left-0 bg-primary-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-br-lg uppercase tracking-wider">
                          {recent.category}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider font-bold">
                          <Clock className="w-3 h-3 text-primary-600" />
                          {new Date(recent.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 text-[13px] sm:text-sm leading-snug group-hover:text-primary-600 transition-colors line-clamp-3">
                          {recent.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">Belum ada berita lainnya.</p>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link href="/informasi-dan-berita" className="flex items-center justify-center w-full py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 hover:text-primary-600 transition-colors shadow-sm gap-2">
                  Lihat Semua
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
