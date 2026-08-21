'use client';

import { Menu, User } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface AdminHeaderProps {
  onOpenSidebar: () => void;
}

export default function AdminHeader({ onOpenSidebar }: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="bg-white dark:bg-gray-800 dark:bg-gray-900 border-b border-border-light dark:border-gray-700 dark:border-gray-800 sticky top-0 z-30 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 text-text-secondary dark:text-gray-400 dark:text-gray-400 hover:text-text-primary dark:text-gray-100 dark:text-gray-100 hover:bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg lg:hidden"
            aria-label="Buka menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-semibold text-text-primary dark:text-gray-100 dark:text-gray-100 font-heading hidden sm:block">
            Panel Admin Layanan KUA Kecamatan Sampaga
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-border-light dark:border-gray-700 dark:border-gray-800"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="font-semibold text-text-primary dark:text-gray-100 dark:text-gray-100 leading-tight">{session?.user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-text-tertiary dark:text-gray-500 dark:text-gray-500 leading-tight">{session?.user?.email || 'admin@kuasampaga.test'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}



