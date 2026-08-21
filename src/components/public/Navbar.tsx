'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, Search, LogIn, Landmark, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import ThemeToggle from '@/components/ThemeToggle';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/layanan', label: 'Layanan' },
  { href: '/informasi-dan-berita', label: 'Informasi & Berita' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/peraturan', label: 'Peraturan' },
  { href: '/tentang', label: 'Tentang' },
  { href: '/kontak', label: 'Kontak' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 no-print ${
        isScrolled
          ? 'bg-white dark:bg-gray-800/85 backdrop-blur-md shadow-sm border-b border-[#E5EBE5] dark:border-gray-700/50'
          : 'bg-white dark:bg-gray-800/70 backdrop-blur-sm border-b border-[#E5EBE5] dark:border-gray-700/30'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between h-[70px] px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-0.5"><Image src="/logo/logo-kua.png" alt="Logo KUA" fill className="object-contain" /></div>
          <div className="flex flex-col justify-center">
            <span className="text-base font-extrabold text-[#1A2E1A] dark:text-gray-100 leading-tight font-heading group-hover:text-[#059669] transition-colors tracking-tight">
              KUA Sampaga
            </span>
            <span className="text-[11px] text-[#6B7E6B] dark:text-gray-400 font-medium leading-tight">
              Kabupaten Mamuju
            </span>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map(link => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-2 text-[15px] font-bold font-heading transition-colors duration-300 group"
              >
                {/* Teks Animasi Warna */}
                <span className={`relative z-10 transition-colors duration-300 ${
                  active ? 'text-[#059669]' : 'text-[#4A5D4A] dark:text-gray-300 group-hover:text-[#059669]'
                }`}>
                  {link.label}
                </span>
                
                {/* Garis Bawah Saat Aktif (Solid & Terang) */}
                <span 
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-[#059669] rounded-full transition-all duration-300"
                  style={{ width: active ? '100%' : '0%', opacity: active ? 1 : 0, boxShadow: '0 2px 8px rgba(5, 150, 105, 0.4)' }}
                ></span>

                {/* Garis Bawah Saat Hover (Kabur / Samar) */}
                <span 
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300 ${active ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}
                  style={{ width: '100%', backgroundColor: 'rgba(5, 150, 105, 0.5)', filter: 'blur(1.5px)' }}
                ></span>
              </Link>
            );
          })}
        </nav>

        {/* ACTIONS */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4">
          <ThemeToggle />
          <Link
            href="/layanan"
            className="p-2.5 text-[#6B7E6B] dark:text-gray-400 hover:text-[#064E3B] dark:text-emerald-300 dark:hover:text-emerald-200 rounded-xl hover:bg-[#ECFDF5] dark:hover:bg-gray-700 dark:bg-gray-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xs"
            aria-label="Cari layanan"
            title="Cari Layanan"
          >
            <Search className="w-5 h-5" />
          </Link>
          {status === 'loading' ? (
            <div className="w-24 h-10 bg-gray-100 animate-pulse rounded-xl"></div>
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#064E3B] dark:text-emerald-300 bg-[#ECFDF5] dark:bg-gray-800 hover:bg-[#D1FAE5] dark:hover:bg-gray-700 rounded-xl transition-all duration-300 border border-[#D1FAE5] dark:border-gray-700 shadow-xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#059669] flex items-center justify-center text-white">
                  <User className="w-3.5 h-3.5" />
                </div>
                {session.user?.name?.split(' ')[0] || 'Profil'}
              </button>
              
              {/* Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-[#E5EBE5] dark:border-gray-700 py-2 animate-fade-in">
                  <Link
                    href={(session.user as any)?.role === 'user' || (session.user as any)?.role === 'guest' ? '/user' : '/admin'}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-[#4A5D4A] dark:text-gray-300 hover:bg-[#ECFDF5] dark:hover:bg-gray-700 dark:bg-gray-800 hover:text-[#064E3B] dark:text-emerald-300 dark:hover:text-emerald-200 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#064E3B] dark:text-emerald-300 bg-[#ECFDF5] dark:bg-gray-800 hover:bg-[#D1FAE5] dark:hover:bg-gray-700 rounded-xl transition-all duration-300 border border-[#D1FAE5] dark:border-gray-700 shadow-xs hover:-translate-y-0.5 hover:shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              Masuk
            </Link>
          )}
        </div>

        {/* MOBILE TOGGLE & THEME */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2 text-[#4A5D4A] dark:text-gray-300 hover:text-[#064E3B] dark:text-emerald-300 dark:hover:text-emerald-200 rounded-lg hover:bg-[#ECFDF5] dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`absolute top-full left-0 right-0 lg:hidden overflow-hidden transition-all duration-300 bg-white dark:bg-gray-800 border-t border-[#E5EBE5] dark:border-gray-700 ${
          isOpen ? 'max-h-[500px] shadow-lg' : 'max-h-0'
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                isActive(link.href)
                  ? 'text-[#064E3B] dark:text-emerald-300 bg-[#ECFDF5] dark:bg-gray-800'
                  : 'text-[#4A5D4A] dark:text-gray-300 hover:text-[#064E3B] dark:text-emerald-300 dark:hover:text-emerald-200 hover:bg-[#ECFDF5] dark:hover:bg-gray-700 dark:bg-gray-800/60'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 pt-2 border-t border-[#E5EBE5] dark:border-gray-700 flex flex-col gap-1.5">
            <Link
              href="/layanan"
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#4A5D4A] dark:text-gray-300 hover:text-[#064E3B] dark:text-emerald-300 dark:hover:text-emerald-200 rounded-lg hover:bg-[#ECFDF5] dark:hover:bg-gray-700 dark:bg-gray-800/60 transition-colors"
            >
              <Search className="w-4 h-4" /> Cari Layanan
            </Link>
            {status === 'loading' ? (
              <div className="h-10 bg-gray-100 animate-pulse rounded-lg"></div>
            ) : session ? (
              <>
                <Link
                  href={(session.user as any)?.role === 'user' || (session.user as any)?.role === 'guest' ? '/user' : '/admin'}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#064E3B] dark:text-emerald-300 bg-[#ECFDF5] dark:bg-gray-800 hover:bg-[#D1FAE5] dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#064E3B] dark:text-emerald-300 bg-[#ECFDF5] dark:bg-gray-800 hover:bg-[#D1FAE5] dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" /> Masuk Portal
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}




