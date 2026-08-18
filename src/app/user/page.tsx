'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogOut, FileText, User as UserIcon, BookOpen, Clock, Heart } from 'lucide-react';
import Link from 'next/link';

export default function UserDashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-20">
      {/* Header / Welcome Area */}
      <div className="bg-gradient-to-br from-[#064E3B] to-[#047857] rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
            {session.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-12 h-12 text-white/80" />
            )}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading mb-2">
              Halo, {session.user?.name?.split(' ')[0] || 'Pengguna'}! 👋
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base font-medium mb-4">
              {session.user?.email}
            </p>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border border-white/20">
                Akun Warga
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Quick Actions */}
        <div className="md:col-span-8 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-4 font-heading flex items-center gap-2">
              <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
              Jalan Pintas Layanan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/layanan?kategori=Pernikahan" className="group bg-white p-5 rounded-2xl border border-border-light shadow-sm hover:shadow-md hover:border-emerald-500 transition-all">
                <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-text-primary group-hover:text-emerald-700 transition-colors">Pendaftaran Nikah</h3>
                <p className="text-xs text-text-secondary mt-1">Cek syarat dan alur pendaftaran nikah secara lengkap.</p>
              </Link>
              <Link href="/layanan?kategori=Administrasi" className="group bg-white p-5 rounded-2xl border border-border-light shadow-sm hover:shadow-md hover:border-emerald-500 transition-all">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-text-primary group-hover:text-emerald-700 transition-colors">Surat Keterangan</h3>
                <p className="text-xs text-text-secondary mt-1">Panduan mengurus surat keterangan dan rekomendasi.</p>
              </Link>
              <Link href="/informasi" className="group bg-white p-5 rounded-2xl border border-border-light shadow-sm hover:shadow-md hover:border-emerald-500 transition-all sm:col-span-2">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-text-primary group-hover:text-emerald-700 transition-colors">Pusat Informasi & Pengumuman</h3>
                <p className="text-xs text-text-secondary mt-1">Baca berita terbaru, pengumuman, dan artikel kajian keislaman dari KUA Sampaga.</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Info & Status */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-border-light shadow-sm">
            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-emerald-600" />
              Aktivitas Anda
            </h3>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-text-secondary">Belum ada pengajuan</p>
              <p className="text-xs text-text-tertiary mt-1">Riwayat layanan online akan tampil di sini di masa mendatang.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-100">
            <h3 className="font-bold text-emerald-800 mb-2 text-sm">Butuh Bantuan?</h3>
            <p className="text-xs text-emerald-700 mb-4 leading-relaxed">
              Jika Anda memiliki pertanyaan seputar persyaratan atau menemui kendala, silakan hubungi admin kami melalui WhatsApp.
            </p>
            <a
              href="https://wa.me/628114169614"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Hubungi Admin KUA
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
