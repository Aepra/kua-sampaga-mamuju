import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, BookOpen, ChevronRight, TrendingUp } from 'lucide-react';
import { getPublishedInformation } from '@/lib/data/information';
import EmptyState from '@/components/ui/StateDisplay';

export const metadata: Metadata = {
  title: 'Informasi & Berita - KUA Sampaga',
  description: 'Dapatkan pengumuman, berita, dan informasi terbaru dari KUA Kecamatan Sampaga Kabupaten Mamuju.',
};

export const revalidate = 60;

export default async function InformasiPage() {
  const information = await getPublishedInformation();
  const featured = information.length > 0 ? information[0] : null;
  const regularNews = information.length > 1 ? information.slice(1) : [];
  
  // Ambil hanya pengumuman untuk sidebar
  const announcements = information.filter(i => i.category.toLowerCase().includes('pengumuman')).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F4F7F5] dark:bg-gray-950 pb-12 sm:pb-20 relative">
      
      {/* Aesthetic Top Banner (Behind the header) */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#E0EBE4] via-[#F4F7F5] to-transparent dark:from-gray-900 dark:via-gray-950 dark:to-transparent z-0 pointer-events-none"></div>

      <div className="pt-[90px] sm:pt-[100px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-[12px] sm:text-sm text-[#4A5D4A] dark:text-gray-300 mb-4 font-medium pt-2">
          <Link href="/" className="hover:text-primary-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 sm:mx-2 text-[#9CAEA3]" />
          <span className="text-primary-800 dark:text-primary-200 font-bold">Informasi & Berita</span>
        </nav>
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-primary-100 pb-5 mb-8 sm:mb-12">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#1A2E1A] dark:text-gray-100 font-heading tracking-tight mb-3">
              Informasi & Berita
            </h1>
            <p className="text-sm sm:text-base text-[#4A5D4A] dark:text-gray-300 font-medium">
              Kabar terbaru dan pengumuman dari KUA Kecamatan Sampaga.
            </p>
          </div>
        </div>

        {information.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Kiri: Daftar Berita Utama */}
            <div className="lg:col-span-8 space-y-10 sm:space-y-14">
              
              {/* Featured News (Hero Card) */}
              {featured && (
                <Link 
                  href={`/informasi-dan-berita/${featured.slug}`}
                  className="group block bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-white dark:border-gray-700 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_-10px_rgba(5,150,105,0.15)] hover:border-primary-200 dark:hover:border-primary-500 transition-all duration-500"
                >
                  <div className="relative h-[200px] sm:h-[450px] w-full bg-[#E5EBE5] dark:bg-gray-700 overflow-hidden">
                    {featured.thumbnail || (featured.images && featured.images.length > 0) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={featured.thumbnail || featured.images[0]} 
                        alt={featured.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-20 h-20 text-[#A7F3D0] opacity-50" />
                      </div>
                    )}
                    <span className="absolute top-4 left-4 sm:top-6 sm:left-6 text-[10px] sm:text-xs font-black text-white bg-primary-600 px-4 py-2 rounded-lg uppercase tracking-widest shadow-lg">
                      {featured.category}
                    </span>
                  </div>
                  
                  <div className="p-4 sm:p-10">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-primary-600 mb-4 uppercase tracking-wider">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(featured.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-[#6B7E6B] dark:text-gray-400">Oleh Admin KUA</span>
                    </div>
                    <h2 className="text-xl sm:text-4xl font-extrabold text-[#1A2E1A] dark:text-gray-100 font-heading leading-tight mb-3 sm:mb-5 group-hover:text-primary-700 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-[#4A5D4A] dark:text-gray-300 text-xs sm:text-lg line-clamp-3 leading-relaxed">
                      {featured.excerpt}
                    </p>
                  </div>
                </Link>
              )}

              {/* Grid Berita Lainnya */}
              {regularNews.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                    <h3 className="text-2xl font-black text-[#1A2E1A] dark:text-gray-100 font-heading">Berita Lainnya</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    {regularNews.map(info => (
                      <Link
                        key={info.id}
                        href={`/informasi-dan-berita/${info.slug}`}
                        className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:border-primary-200 transition-all duration-300 flex flex-row sm:flex-col h-full"
                      >
                        <div className="w-[100px] sm:w-full min-h-[100px] sm:h-56 bg-gray-100 dark:bg-gray-700 relative overflow-hidden flex-shrink-0">
                          {info.thumbnail || (info.images && info.images.length > 0) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={info.thumbnail || info.images[0]} alt={info.title} className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-700 ease-out" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center absolute inset-0">
                              <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-500" />
                            </div>
                          )}
                          <span className="absolute top-4 left-4 text-[9px] font-black text-white bg-black/50 backdrop-blur-md px-3 py-1.5 rounded uppercase tracking-widest shadow-sm hidden sm:block">
                            {info.category}
                          </span>
                        </div>
                        <div className="p-3 sm:p-6 flex flex-col flex-grow justify-center sm:justify-start">
                          <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3 text-[9px] sm:text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">
                            <span className="bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded sm:hidden">{info.category}</span>
                            <span className="hidden sm:inline"><Clock className="w-3.5 h-3.5" /></span>
                            <span>{new Date(info.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <h3 className="font-extrabold text-[#1A2E1A] dark:text-gray-100 text-sm sm:text-xl group-hover:text-primary-700 transition-colors font-heading line-clamp-3 leading-snug mb-0 sm:mb-4">
                            {info.title}
                          </h3>
                          <p className="mt-auto text-sm text-[#6B7E6B] dark:text-gray-400 line-clamp-2 leading-relaxed hidden sm:block">
                            {info.excerpt}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Kanan: Sidebar */}
            <aside className="lg:col-span-4 mt-10 lg:mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] lg:sticky lg:top-[110px]">
                <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-black text-[#1A2E1A] dark:text-gray-100 font-heading uppercase tracking-widest">
                    Pengumuman
                  </h3>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
                
                <div className="space-y-6">
                  {announcements.length > 0 ? (
                    announcements.map((ann, idx) => (
                      <Link key={ann.id} href={`/informasi-dan-berita/${ann.slug}`} className="group block">
                        <div className="flex gap-5 items-start">
                          <div className="text-4xl font-black text-gray-200 group-hover:text-primary-200 transition-colors leading-none font-heading w-10 shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-[#1A2E1A] dark:text-gray-100 text-[15px] leading-snug group-hover:text-primary-600 transition-colors line-clamp-3 mb-2">
                              {ann.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[10px] text-[#6B7E6B] dark:text-gray-400 uppercase tracking-wider font-bold">
                              <Clock className="w-3 h-3 text-red-500" />
                              {new Date(ann.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic font-medium">Tidak ada pengumuman saat ini.</p>
                    </div>
                  )}
                </div>

                <div className="mt-10 pt-8 border-t-2 border-gray-100 dark:border-gray-700">
                  <div className="bg-gradient-to-br from-[#022C22] to-[#064E3B] rounded-2xl p-5 sm:p-6 text-center shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white dark:bg-gray-800 opacity-5 rounded-full blur-2xl"></div>
                    <h4 className="font-black text-white text-lg mb-2 relative z-10">Butuh Bantuan?</h4>
                    <p className="text-xs text-[#A7F3D0] mb-6 font-medium leading-relaxed relative z-10">Hubungi admin KUA untuk informasi lebih lanjut mengenai layanan kami.</p>
                    <Link href="/kontak" className="inline-block w-full py-3 bg-white dark:bg-gray-800 text-primary-700 text-sm font-black rounded-xl hover:bg-[#F1F5F3] hover:shadow-md transition-all relative z-10">
                      Hubungi Admin
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-16 text-center max-w-2xl mx-auto mt-12 shadow-sm">
            <BookOpen className="w-20 h-20 text-[#E5EBE5] mx-auto mb-5" />
            <EmptyState title="Belum ada berita" description="Konten informasi dan berita akan segera diperbarui. Silakan periksa kembali nanti." />
          </div>
        )}
      </div>
    </div>
  );
}

