'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard, FileText, Image as ImageIcon, BookOpen,
  Landmark, Settings, LogOut, Users,
  ChevronRight, X
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuGroups = [
  {
    title: 'Menu Utama',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Kelola Konten',
    items: [
      { href: '/admin/layanan', label: 'Layanan', icon: FileText },
      { href: '/admin/informasi', label: 'Informasi', icon: BookOpen },
      { href: '/admin/galeri', label: 'Galeri', icon: ImageIcon },
    ],
  },
  {
    title: 'Informasi KUA',
    items: [
      { href: '/admin/profil', label: 'Profil & Kontak KUA', icon: Landmark },
    ],
  },
  {
    title: 'Pengaturan',
    items: [
      { href: '/admin/pengaturan', label: 'Pengaturan Akun', icon: Settings },
    ],
  },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const dynamicMenuGroups = [...menuGroups];
  
  if ((session?.user as any)?.role === 'super_admin') {
    dynamicMenuGroups.push({
      title: 'Super Admin',
      items: [
        { href: '/admin/pengguna', label: 'Kelola Admin', icon: Users },
      ],
    });
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-primary-950 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="p-4 flex items-center justify-between border-b border-primary-900">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight font-heading">Admin Panel</p>
              <p className="text-[10px] text-primary-300 leading-tight">KUA Sampaga</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1 text-primary-300 hover:text-white lg:hidden"
            aria-label="Tutup sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
          {dynamicMenuGroups.map((group, i) => (
            <div key={i}>
              <p className="px-3 text-xs font-bold text-primary-300 uppercase tracking-wider mb-2">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'bg-primary-700 text-white shadow-sm'
                          : 'text-primary-200 hover:bg-primary-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {active && <ChevronRight className="w-4 h-4 text-primary-300" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-primary-900">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-primary-300 hover:text-white hover:bg-primary-900 rounded-lg transition-colors mb-2"
          >
            <Landmark className="w-4 h-4" />
            <span>Lihat Website Publik</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-300 hover:text-red-100 hover:bg-red-950/50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
}
