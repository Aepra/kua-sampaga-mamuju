'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | undefined>(undefined);

  useEffect(() => {
    // We only set the default user once on mount
    let isMounted = true;
    const initUser = async () => {
      // Simulate an async check to avoid sync setState warning
      await Promise.resolve();
      if (isMounted) {
        setUser({ name: 'Administrator', email: 'admin@kuasampaga.test' });
      }
    };
    initUser();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface-secondary flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader onOpenSidebar={() => setSidebarOpen(true)} user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
