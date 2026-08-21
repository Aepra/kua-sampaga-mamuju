import Image from 'next/image';
import Link from 'next/link';
import {
  Heart, FileText, ClipboardList, MapPin, MessageCircle,
  ArrowRight, ChevronRight, Clock, Landmark,
  BookOpen, Users, BadgeCheck, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { getPublishedServices, getCategories } from '@/lib/data/services';
import { getRecentInformation } from '@/lib/data/information';
import { getRecentGallery } from '@/lib/data/gallery';
import { getSettings } from '@/lib/data/settings';

import LayananSection from './LayananSection';
import ServiceCardPublic from '@/components/public/ServiceCard';
import FeedbackButton from '@/components/public/FeedbackButton';
import VisitorCounter from '@/components/public/VisitorCounter';
import FeedbackList from '@/components/public/FeedbackList';

export const revalidate = 60;

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-5 h-5 text-emerald-700" />,
  Globe: <BookOpen className="w-5 h-5 text-emerald-700" />,
  FileEdit: <FileText className="w-5 h-5 text-emerald-700" />,
  UserCog: <Users className="w-5 h-5 text-emerald-700" />,
  FileText: <FileText className="w-5 h-5 text-emerald-700" />,
  ScrollText: <ClipboardList className="w-5 h-5 text-emerald-700" />,
  Landmark: <Landmark className="w-5 h-5 text-emerald-700" />,
  Users: <Users className="w-5 h-5 text-emerald-700" />,
  BookHeart: <Heart className="w-5 h-5 text-emerald-700" />,
  HeartHandshake: <Heart className="w-5 h-5 text-emerald-700" />,
  BadgeCheck: <BadgeCheck className="w-5 h-5 text-emerald-700" />,
  BookOpen: <BookOpen className="w-5 h-5 text-emerald-700" />,
};

const quickAccessItems = [
  {
    icon: <Heart className="w-5 h-5 text-pink-600" />,
    label: 'Pernikahan',
    href: '/layanan?kategori=Pernikahan',
    bg: 'bg-pink-50 hover:bg-pink-100 border-pink-100',
    external: false
  },
  {
    icon: <FileText className="w-5 h-5 text-blue-600" />,
    label: 'Surat Keterangan',
    href: '/layanan?kategori=Administrasi',
    bg: 'bg-blue-50 hover:bg-blue-100 border-blue-100',
    external: false
  },
  {
    icon: <ClipboardList className="w-5 h-5 text-amber-600" />,
    label: 'Cek Persyaratan',
    href: '/layanan',
    bg: 'bg-amber-50 hover:bg-amber-100 border-amber-100',
    external: false
  },
  {
    icon: <MapPin className="w-5 h-5 text-emerald-600" />,
    label: 'Lokasi KUA',
    href: '/kontak',
    bg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-100',
    external: false
  },
  {
    icon: <MessageCircle className="w-5 h-5 text-green-600" />,
    label: 'WhatsApp KUA',
    href: 'https://wa.me/628114169614?text=Assalamu%27alaikum%2C%20saya%20ingin%20bertanya%20mengenai%20layanan%20KUA%20Kecamatan%20Sampaga.',
    bg: 'bg-green-50 hover:bg-green-100 border-green-100',
    external: true
  },
];

export default async function HomePage() {
  // Run all queries in parallel for much faster load
  const [services, recentInfo, recentGallery, settings, categories] = await Promise.all([
    getPublishedServices(),
    getRecentInformation(5),
    getRecentGallery(4),
    getSettings(),
    getCategories(),
  ]);
  const popularServices = services.slice(0, 6);

  const waHeroLink = `https://wa.me/62${settings.whatsapp.replace(/^0/, '')}?text=${encodeURIComponent("Assalamu'alaikum, saya ingin bertanya mengenai layanan KUA Kecamatan Sampaga.")}`;

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      {/* ============================================================ */}
      {/* 1. HERO SECTION (MODERN, PROFESSIONAL, CLEAN) */}
      {/* ============================================================ */}
      <section 
        className="relative min-h-[100svh] flex items-center pt-[90px] lg:pt-[100px] pb-12 lg:pb-20 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-[#064E3B] via-[#059669] to-[#047857] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
        style={{ paddingLeft: 'clamp(1rem, 5vw, 8rem)', paddingRight: 'clamp(1rem, 5vw, 8rem)' }}
      > 
        <style>{`
          @keyframes panGrid {
            0% { background-position: 0px 0px; }
            100% { background-position: 40px 40px; }
          }
          @keyframes float1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-100px, 80px) scale(1.1); }
            66% { transform: translate(50px, -50px) scale(0.9); }
          }
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(80px, -100px) scale(0.9); }
            66% { transform: translate(-50px, 50px) scale(1.1); }
          }
        `}</style>
        
        {/* Animated Aurora Glows for Depth */}
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-[#34D399]/30 blur-[120px] z-0 pointer-events-none" style={{ animation: 'float1 18s ease-in-out infinite' }}></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full bg-[#022C22] dark:bg-gray-950/40 blur-[140px] z-0 pointer-events-none" style={{ animation: 'float2 22s ease-in-out infinite' }}></div>
        
        {/* Animated Grid Overlay (White transparent) */}
        <div className="absolute inset-0 z-0 mix-blend-overlay" style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)', 
          backgroundSize: '40px 40px', 
          animation: 'panGrid 4s linear infinite'
        }}></div>

        <div className="w-full max-w-[1440px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            
            {/* LEFT COLUMN: TEXT CONTENT */}
            <div className="flex flex-col items-start text-left z-10 w-full max-w-2xl">
              
              {/* Minimalist Top Label */}
              <div className="text-[#A7F3D0] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#A7F3D0]"></span>
                KUA Kecamatan Sampaga
              </div>

              {/* Title */}
              <h1 
                className="text-3xl sm:text-5xl lg:text-[4rem] font-black font-heading text-white leading-[1.1] tracking-tight drop-shadow-sm mb-6 lg:mb-8"
              >
                Layanan KUA yang <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCD34D] to-[#F59E0B]">
                  Cepat & Transparan
                </span>
              </h1>

              {/* Subtitle */}
              <p 
                className="text-sm sm:text-lg text-[#D1FAE5] leading-relaxed font-medium mb-6 lg:mb-8"
              >
                Dapatkan kemudahan akses informasi terkait syarat dokumen, alur pengurusan, dan persiapan pelayanan publik sebelum Anda berkunjung ke kantor kami.
              </p>

              {/* CTAs */}
              <div 
                className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8 lg:mb-10"
              >
                <a
                  href="#layanan-section"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1A2E1A] dark:text-gray-100 font-bold transition-all shadow-[0_4px_15px_rgba(251,191,36,0.2)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.4)] hover:-translate-y-0.5"
                  style={{ padding: '12px 28px', borderRadius: '100px', fontSize: '14px' }}
                >
                  Jelajahi Layanan
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={waHeroLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-transparent hover:bg-white dark:bg-gray-800/10 text-white border-2 border-white/50 font-bold transition-all hover:-translate-y-0.5"
                  style={{ padding: '10px 28px', borderRadius: '100px', fontSize: '14px' }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Hubungi Admin
                </a>
                <FeedbackButton />
              </div>

              {/* Minimalist Feature Indicators */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-sm font-bold text-white">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#FCD34D]" />
                  Informasi Akurat
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#FCD34D]" />
                  Bebas Biaya Liar
                </div>
              </div>

              {/* Visitor Counter */}
              <div className="mt-8 pt-6 border-t border-white/20 w-full text-left">
                <VisitorCounter className="text-[#A7F3D0]" />
              </div>
            </div>

            {/* RIGHT COLUMN: VISUAL / FLOATING CARDS */}
            <div className="relative hidden lg:flex justify-center items-center h-[600px] w-full">
              
              {/* Main Decorative Image/Shape */}
              <div className="absolute w-[450px] h-[550px] bg-gradient-to-br from-[#064E3B] to-[#022C22] rounded-[40px] shadow-2xl overflow-hidden flex flex-col items-center justify-center text-white">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="relative w-48 h-48 mb-8 drop-shadow-2xl"><Image src="/logo/logo-kua.png" alt="Logo KUA" fill className="object-contain" /></div>
                <h3 className="text-3xl font-heading font-bold text-white/90">KUA Sampaga</h3>
                <p className="text-white/60 mt-2 font-medium">Melayani dengan Sepenuh Hati</p>
              </div>

              {/* Floating Card 1: Layanan Nikah */}
              <div className="absolute top-[15%] -left-[10%] bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-[#E5EBE5] dark:border-gray-700 w-[280px] flex items-center gap-4 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="w-12 h-12 rounded-full bg-[#FFFBEB] flex items-center justify-center">
                  <span className="text-2xl">💍</span>
                </div>
                <div>
                  <h4 className="text-[#1A2E1A] dark:text-gray-100 font-bold text-sm">Pendaftaran Nikah</h4>
                  <p className="text-[#6B7E6B] dark:text-gray-400 text-xs mt-0.5">Syarat & Prosedur Lengkap</p>
                </div>
              </div>

              {/* Floating Card 2: Konsultasi */}
              <div className="absolute bottom-[20%] -right-[5%] bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-[#E5EBE5] dark:border-gray-700 w-[260px] flex items-center gap-4 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
                <div className="w-12 h-12 rounded-full bg-[#ECFDF5] dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-2xl">🤝</span>
                </div>
                <div>
                  <h4 className="text-[#1A2E1A] dark:text-gray-100 font-bold text-sm">Konsultasi Keluarga</h4>
                  <p className="text-[#6B7E6B] dark:text-gray-400 text-xs mt-0.5">Layanan Gratis KUA</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. QUICK ACCESS SECTION (PROFESSIONAL & PRECISE) */}
      {/* ============================================================ */}
      <section className="relative bg-[#F8FAF9] dark:bg-gray-900 py-8 sm:py-16 z-20 border-b border-[#E5EBE5] dark:border-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1000px] mx-auto px-2 sm:px-6">
          <div className="flex flex-wrap md:flex-nowrap items-start justify-center gap-4 sm:gap-12 lg:gap-16">
            {quickAccessItems.map((item, i) => {
              const content = (
                <div className="flex flex-col items-center justify-start gap-3 sm:gap-4 w-[90px] sm:w-[110px]">
                  {/* Icon Container */}
                  <div className="w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] rounded-2xl bg-[#F8FAF9] dark:bg-gray-900 border border-[#E5EBE5] dark:border-gray-700 flex items-center justify-center group-hover:-translate-y-2 group-hover:bg-[#ECFDF5] dark:hover:bg-gray-700 dark:bg-gray-800 group-hover:border-[#10B981] group-hover:shadow-[0_12px_24px_rgba(16,185,129,0.15)] group-active:scale-90 group-active:bg-[#D1FAE5] dark:bg-gray-700 transition-all duration-300">
                    <div className="scale-[1.2] sm:scale-[1.3] text-[#059669] dark:text-emerald-400 transition-transform duration-300 group-hover:scale-[1.4] group-active:scale-[1.1]">
                      {item.icon}
                    </div>
                  </div>
                  {/* Label Container - Fixed height for alignment */}
                  <div className="h-[40px] flex items-start justify-center">
                    <span className="text-[12px] sm:text-[14px] font-bold text-[#4A5D4A] dark:text-gray-300 text-center leading-[1.3] group-hover:text-[#059669] dark:group-hover:text-emerald-400 dark:text-emerald-400 transition-colors">
                      {item.label}
                    </span>
                  </div>
                </div>
              );

              const boxClass = "group cursor-pointer outline-none animate-fade-in flex-shrink-0 active:opacity-80 transition-opacity duration-200";

              if (item.external) {
                return (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={boxClass}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {content}
                  </a>
                );
              }
              return (
                <Link
                  key={i}
                  href={item.href}
                  className={boxClass}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>



      {/* ============================================================ */}
      {/* 4. LAYANAN POPULER SECTION (INTERACTIVE) */}
      {/* ============================================================ */}
      <LayananSection 
        services={services} 
        categories={categories} 
        iconMap={iconMap} 
      />

      {/* ============================================================ */}
      {/* 5. INFORMASI TERBARU SECTION */}
      {/* ============================================================ */}
      {recentInfo.length > 0 && (
        <section className="py-10 lg:py-24 bg-[#ECFDF5] dark:bg-gray-800/60 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-gray-800 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 opacity-60"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-8 lg:mb-12">
              <div className="space-y-2 sm:space-y-3">
                <span className="text-[10px] sm:text-xs font-bold text-[#059669] dark:text-emerald-400 uppercase tracking-[0.15em] bg-[#ECFDF5] dark:bg-gray-800 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[#D1FAE5] inline-block shadow-sm">
                  Pengumuman & Berita
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A2E1A] dark:text-gray-100 font-heading tracking-tight">
                  Informasi dan Berita Terbaru
                </h2>
              </div>
              <Link
                href="/informasi-dan-berita"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#059669] dark:text-emerald-400 hover:text-[#047857] dark:text-emerald-400 bg-[#F8FAF9] dark:bg-gray-900 hover:bg-[#ECFDF5] dark:hover:bg-gray-700 dark:bg-gray-800 px-5 py-2.5 rounded-full transition-all border border-[#E5EBE5] dark:border-gray-700 hover:border-[#A7F3D0]"
              >
                Lihat Semua
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentInfo.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                {/* Featured (Large) */}
                <div className="lg:col-span-7 xl:col-span-8">
                  {(() => {
                    const featured = recentInfo[0];
                    return (
                      <Link
                        href={`/informasi-dan-berita/${featured.slug}`}
                        className="group bg-white dark:bg-gray-800 rounded-[24px] border border-[#E5EBE5] dark:border-gray-700 overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#10B981] transition-all duration-300 flex flex-col h-full relative"
                      >
                        <div className="h-[300px] sm:h-[400px] lg:h-full min-h-[350px] bg-[#F1F5F3] overflow-hidden relative">
                          {featured.thumbnail || (featured.images && featured.images.length > 0) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={featured.thumbnail || featured.images[0]}
                              alt={featured.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#6B7E6B] dark:text-gray-400 bg-gradient-to-br from-[#F8FAF9] to-[#E5EBE5]">
                              <BookOpen className="w-16 h-16 opacity-40" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 transition-opacity duration-300"></div>
                          
                          <span className="absolute top-5 left-5 text-[10px] sm:text-xs font-bold text-white bg-[#059669] px-3 sm:px-4 py-1.5 rounded-full shadow-sm tracking-wider uppercase">
                            {featured.category}
                          </span>
                          
                          {/* Text embedded in image for portal style */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                            <div className="flex items-center gap-2 text-[11px] sm:text-[12px] font-medium text-[#A7F3D0] mb-3">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(featured.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <h3 className="font-extrabold text-white text-xl sm:text-3xl font-heading line-clamp-3 sm:line-clamp-2 leading-snug group-hover:text-[#A7F3D0] transition-colors">
                              {featured.title}
                            </h3>
                            <p className="text-sm text-white/80 line-clamp-2 leading-relaxed mt-3 hidden sm:block">
                              {featured.excerpt}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })()}
                </div>

                {/* Other News List */}
                {recentInfo.length > 1 && (
                  <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
                    {recentInfo.slice(1).map(info => (
                      <Link
                        key={info.id}
                        href={`/informasi-dan-berita/${info.slug}`}
                        className="group flex gap-4 bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-[20px] border border-[#E5EBE5] dark:border-gray-700 hover:border-[#10B981] hover:shadow-[0_10px_20px_rgba(0,0,0,0.04)] transition-all duration-300 items-center"
                      >
                        <div className="w-24 h-24 sm:w-[100px] sm:h-[100px] rounded-xl overflow-hidden bg-[#F1F5F3] relative flex-shrink-0">
                          {info.thumbnail || (info.images && info.images.length > 0) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={info.thumbnail || info.images[0]}
                              alt={info.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#6B7E6B] dark:text-gray-400 bg-gradient-to-br from-[#F8FAF9] to-[#E5EBE5]">
                              <BookOpen className="w-8 h-8 opacity-40" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 py-1 pr-2">
                          <span className="text-[10px] font-bold text-[#059669] dark:text-emerald-400 mb-1.5 uppercase tracking-wider">{info.category}</span>
                          <h4 className="font-bold text-[#1A2E1A] dark:text-gray-100 text-sm sm:text-base group-hover:text-[#059669] dark:group-hover:text-emerald-400 dark:text-emerald-400 transition-colors font-heading line-clamp-2 leading-snug mb-2">
                            {info.title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#6B7E6B] dark:text-gray-400 mt-auto">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(info.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 6. GALERI KEGIATAN SECTION */}
      {/* ============================================================ */}
      {recentGallery.length > 0 && (
        <section className="py-10 lg:py-24 bg-[#022C22] dark:bg-gray-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-8 lg:mb-12">
              <div className="space-y-2 sm:space-y-3">
                <span className="text-[10px] sm:text-xs font-bold text-[#A7F3D0] uppercase tracking-[0.15em] bg-white dark:bg-gray-800/10 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/20 inline-block">
                  Dokumentasi
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                  Galeri Kegiatan
                </h2>
              </div>
              <Link
                href="/galeri"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#A7F3D0] bg-white dark:bg-gray-800/10 hover:bg-white dark:bg-gray-800/20 border border-white/20 px-5 py-2.5 rounded-full transition-all"
              >
                Lihat Galeri Lengkap
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="columns-2 md:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
              {recentGallery.map(item => (
                <div
                  key={item.id}
                  className="group relative w-full inline-block rounded-[20px] overflow-hidden bg-[#064E3B] border border-white/10 shadow-lg"
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto block group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full aspect-square flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/90 via-[#022C22]/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-[10px] font-bold text-[#FCD34D] uppercase tracking-wider mb-1">{item.category}</span>
                    <p className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 7. PROFIL KUA SECTION */}
      {/* ============================================================ */}
      <section className="py-10 lg:py-24 bg-[#FFFBEB]/50 border-t border-[#FDE68A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-gray-800 p-6 sm:p-12 rounded-[24px] sm:rounded-[32px] border border-[#E5EBE5] dark:border-gray-700 shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative overflow-hidden">
            
            {/* Subtle background pattern in the card */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #064E3B 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 relative z-10">
              <span className="text-[10px] sm:text-xs font-bold text-[#059669] dark:text-emerald-400 uppercase tracking-[0.15em] bg-[#ECFDF5] dark:bg-gray-800 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[#D1FAE5] inline-block">
                Profil Institusi
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A2E1A] dark:text-gray-100 font-heading leading-tight tracking-tight">
                KUA Kecamatan Sampaga Kabupaten Mamuju
              </h2>
              <p className="text-sm sm:text-base text-[#4A5D4A] dark:text-gray-300 leading-relaxed max-w-2xl">
                {settings.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                <div className="p-5 bg-[#F8FAF9] dark:bg-gray-900 rounded-2xl border border-[#E5EBE5] dark:border-gray-700 flex items-start gap-4 hover:border-[#10B981] hover:bg-white dark:bg-gray-800 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] dark:bg-gray-800 text-[#059669] dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#6B7E6B] dark:text-gray-400 mb-1">Kepala KUA</p>
                    <p className="text-sm font-bold text-[#1A2E1A] dark:text-gray-100">{settings.head}</p>
                    <p className="text-[11px] text-[#6B7E6B] dark:text-gray-400 font-mono mt-1">NIP. {settings.nip}</p>
                  </div>
                </div>

                <a href="https://maps.app.goo.gl/4WBnMUuMDaheJUQw7" target="_blank" rel="noopener noreferrer" className="p-5 bg-[#F8FAF9] dark:bg-gray-900 rounded-2xl border border-[#E5EBE5] dark:border-gray-700 flex items-start gap-4 hover:border-[#10B981] hover:bg-[#ECFDF5] dark:hover:bg-gray-700 dark:bg-gray-800 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] dark:bg-gray-800 text-[#059669] dark:text-emerald-400 group-hover:bg-[#059669] group-hover:text-white transition-colors flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#6B7E6B] dark:text-gray-400 mb-1">Alamat Kantor</p>
                    <p className="text-sm font-bold text-[#1A2E1A] dark:text-gray-100 leading-snug group-hover:text-[#059669] dark:group-hover:text-emerald-400 dark:text-emerald-400 transition-colors">{settings.address}</p>
                    <p className="text-[11px] text-[#6B7E6B] dark:text-gray-400 mt-1">Kecamatan Sampaga, Mamuju</p>
                  </div>
                </a>
              </div>

              <div className="pt-6">
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#064E3B] hover:bg-[#022C22] dark:bg-gray-950 text-white font-bold text-sm rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Lihat Visi Misi & Profil Lengkap
                  <ArrowRight className="w-4 h-4 text-[#A7F3D0]" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative z-10 flex justify-center lg:justify-end">
              <div className="bg-gradient-to-br from-[#064E3B] to-[#022C22] p-6 sm:p-8 rounded-[32px] shadow-2xl text-center space-y-6 w-full max-w-md border border-[#047857]/50">
                {settings.officeImage ? (
                  <div className="w-full rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
                    <img src={settings.officeImage} alt="Kantor KUA Sampaga" className="w-full h-auto group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="relative w-24 h-24 rounded-2xl mx-auto shadow-inner bg-white dark:bg-gray-800 p-2 border border-white/20"><Image src="/logo/logo-kua.png" alt="Logo KUA" fill className="object-contain p-2" /></div>
                )}
                <div>
                  <h3 className="font-extrabold text-white text-xl font-heading tracking-tight">KUA Kecamatan Sampaga</h3>
                  <p className="text-sm text-[#A7F3D0] mt-1 font-medium">Kementerian Agama Kab. Mamuju</p>
                </div>
                <div className="p-5 bg-white dark:bg-gray-800/5 backdrop-blur-sm rounded-2xl border border-white/10 text-left text-sm space-y-2.5">
                  <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                    <Clock className="w-4 h-4 text-[#FCD34D]" />
                    <strong className="text-white font-semibold">Jam Pelayanan</strong>
                  </div>
                  <div className="flex justify-between items-center text-[#D1FAE5]">
                    <span>Senin - Kamis</span>
                    <span className="font-bold text-white">08.00 - 16.00</span>
                  </div>
                  <div className="flex justify-between items-center text-[#D1FAE5]">
                    <span>Jumat</span>
                    <span className="font-bold text-white">08.00 - 16.30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. TESTIMONIAL / SUARA PENGUNJUNG */}
      {/* ============================================================ */}
      <FeedbackList />

      {/* ============================================================ */}
      {/* 9. DISCLAIMER BANNER */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#FFFBEB] border-y border-[#FDE68A] shadow-inner py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start sm:items-center justify-center gap-4 max-w-4xl mx-auto">
            <div className="w-10 h-10 rounded-full bg-[#F59E0B]/20 text-[#D97706] flex items-center justify-center flex-shrink-0 mt-1 sm:mt-0">
              <span className="text-xl">📌</span>
            </div>
            <p className="text-xs sm:text-sm text-[#92400E] leading-relaxed">
              <strong className="font-bold text-[#B45309] block sm:inline mr-1">Himbauan Publik:</strong> 
              Seluruh persyaratan dan alur dapat disesuaikan dengan peraturan perundang-undangan terbaru. Masyarakat disarankan untuk mengonfirmasi ke petugas KUA Kecamatan Sampaga sebelum menyerahkan berkas fisik.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}




