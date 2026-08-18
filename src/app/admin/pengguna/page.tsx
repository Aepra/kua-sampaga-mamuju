'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Shield, User, ShieldAlert, Check } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import FullScreenLoader from '@/components/ui/FullScreenLoader';

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  createdAt: string;
};

export default function AdminPenggunaPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch {
      showToast('Gagal memuat data pengguna', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId === (session?.user as any)?.id) {
      showToast('Anda tidak bisa mengubah role Anda sendiri', 'error');
      return;
    }

    if (!confirm(`Yakin ingin mengubah role menjadi ${newRole.toUpperCase()}?`)) {
      return;
    }

    setActionLoading(userId);
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Role berhasil diperbarui', 'success');
        fetchUsers();
      } else {
        showToast(data.error || 'Gagal mengubah role', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  if ((session?.user as any)?.role !== 'super_admin') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-text-primary">Akses Ditolak</h1>
        <p className="text-text-secondary mt-2">Halaman ini hanya dapat diakses oleh Super Admin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-heading">Kelola Admin</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">Angkat pengguna menjadi Admin atau cabut aksesnya.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-text-secondary bg-surface-secondary border-b border-border-light">
              <tr>
                <th className="px-6 py-4 font-semibold">Pengguna</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Bergabung</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-text-secondary">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Memuat data...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-text-secondary">
                    Belum ada pengguna terdaftar.
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-text-primary">{user.name}</p>
                          <p className="text-[11px] text-text-tertiary">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'super_admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                        user.role === 'admin' ? 'bg-primary-100 text-primary-700 border border-primary-200' :
                        'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {user.role === 'super_admin' && <Shield className="w-3 h-3" />}
                        {user.role === 'admin' && <Check className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role === 'super_admin' ? (
                        <span className="text-xs text-text-tertiary italic">Akses Permanen</span>
                      ) : (
                        <div className="flex justify-end gap-2">
                          {user.role === 'user' ? (
                            <button
                              onClick={() => handleRoleChange(user.id, 'admin')}
                              disabled={actionLoading === user.id}
                              className="px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 rounded-lg text-xs font-bold transition-colors"
                            >
                              {actionLoading === user.id ? 'Loading...' : 'Jadikan Admin'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRoleChange(user.id, 'user')}
                              disabled={actionLoading === user.id}
                              className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-bold transition-colors"
                            >
                              {actionLoading === user.id ? 'Loading...' : 'Cabut Admin'}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
