'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Shield, User, ShieldAlert, Check, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

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
  const [deleteTarget, setDeleteTarget] = useState<UserData | null>(null);
  
  // Add User Form State
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('admin');
  const [isAdding, setIsAdding] = useState(false);

  const currentUserRole = (session?.user as { role?: string })?.role;
  const currentUserId = (session?.user as { id?: string })?.id;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        showToast(data.error || 'Gagal memuat data pengguna', 'error');
      }
    } catch {
      showToast('Gagal memuat data pengguna', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId === currentUserId) {
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

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;

    setActionLoading(deleteTarget.id);
    try {
      const res = await fetch(`/api/users/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Pengguna berhasil dihapus', 'success');
        fetchUsers();
      } else {
        showToast(data.error || 'Gagal menghapus pengguna', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan', 'error');
    } finally {
      setActionLoading(null);
      setDeleteTarget(null);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) {
      showToast('Email wajib diisi', 'error');
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail.toLowerCase(), role: newRole }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Pengguna berhasil ditambahkan', 'success');
        setNewEmail('');
        fetchUsers();
      } else {
        showToast(data.error || 'Gagal menambahkan pengguna', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  if (currentUserRole !== 'admin' && currentUserRole !== 'super_admin') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-text-primary font-heading">Akses Ditolak</h1>
        <p className="text-text-secondary mt-2 text-sm">Halaman ini hanya dapat diakses oleh Admin dan Super Admin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-heading">Kelola Admin & Pengguna</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">Tambahkan pengguna baru atau atur hak akses akun terdaftar.</p>
        </div>
      </div>

      {/* Add User Form */}
      <div className="bg-white rounded-xl border border-border-light shadow-xs p-5">
        <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2 font-heading">
          <User className="w-4 h-4 text-primary-600" />
          Tambah Pengguna Baru
        </h2>
        <form onSubmit={handleAddUser} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Alamat Email (misal: pegawai@gmail.com)"
              required
              className="w-full px-4 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
              {currentUserRole === 'super_admin' && (
                <option value="super_admin">Super Admin</option>
              )}
            </select>
          </div>
          <button
            type="submit"
            disabled={isAdding}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            {isAdding ? 'Menyimpan...' : 'Tambah Pengguna'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-border-light shadow-xs overflow-hidden">
        <div className="relative">
          {/* Scroll Indicator Mobile */}
          <div className="flex sm:hidden items-center justify-center gap-1.5 py-2 bg-primary-50/50 text-[11px] font-medium text-primary-700 border-b border-border-light">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            Geser tabel ke kiri/kanan untuk melihat lebih detail
          </div>
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
                users.map(user => {
                  const isSelf = user.id === currentUserId;
                  const isSuperAdmin = user.role === 'super_admin';
                  const isAdmin = user.role === 'admin';
                  const canManageRole = currentUserRole === 'super_admin' || (!isSuperAdmin && !isAdmin && currentUserRole === 'admin');
                  const canDelete = !isSelf && !isSuperAdmin && (currentUserRole === 'super_admin' || (!isAdmin && currentUserRole === 'admin'));

                  return (
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
                      <td className="px-6 py-4 text-text-secondary text-xs">
                        {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {canManageRole && (
                            user.role === 'user' ? (
                              <button
                                onClick={() => handleRoleChange(user.id, 'admin')}
                                disabled={actionLoading === user.id}
                                className="px-3 py-1 bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 rounded-lg text-xs font-semibold transition-colors"
                              >
                                {actionLoading === user.id ? 'Loading...' : 'Jadikan Admin'}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRoleChange(user.id, 'user')}
                                disabled={actionLoading === user.id}
                                className="px-3 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-semibold transition-colors"
                              >
                                {actionLoading === user.id ? 'Loading...' : 'Cabut Admin'}
                              </button>
                            )
                          )}

                          {canDelete && (
                            <button
                              onClick={() => setDeleteTarget(user)}
                              disabled={actionLoading === user.id}
                              className="p-1.5 text-text-tertiary hover:text-red-600 rounded-md hover:bg-surface-tertiary transition-colors"
                              title="Hapus Pengguna"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                          {!canManageRole && !canDelete && (
                            <span className="text-xs text-text-tertiary italic">
                              {isSelf ? 'Akun Anda' : isSuperAdmin ? 'Super Admin' : 'Akses Terbatas'}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Pengguna"
        message={`Apakah Anda yakin ingin menghapus akun "${deleteTarget?.name}" (${deleteTarget?.email})? Aksi ini tidak dapat dibatalkan.`}
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
