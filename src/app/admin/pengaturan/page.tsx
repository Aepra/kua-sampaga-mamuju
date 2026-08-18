'use client';

import { useState } from 'react';
import { Save, User, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import FullScreenLoader from '@/components/ui/FullScreenLoader';

export default function AdminPengaturanPage() {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword !== confirmPassword) {
      showToast('Konfirmasi password baru tidak cocok.', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Password minimal 6 karakter.', 'error');
      return;
    }

    setSaving(true);
    // Demo implementation for password change
    setTimeout(() => {
      showToast('Password berhasil diperbarui.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSaving(false);
    }, 1000);
  };

  return (
    <>
      <FullScreenLoader isLoading={saving} message="Memperbarui kata sandi..." />
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">Pengaturan Akun</h1>
        <p className="text-sm text-text-secondary mt-1">Kelola keamanan dan kata sandi akun admin.</p>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl border border-border-light p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-text-primary">Administrator</p>
            <p className="text-xs text-text-tertiary">admin@kuasampaga.test</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-primary-50 text-primary-700 rounded-full">
              ROLE: ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <form onSubmit={handleSubmitPassword} className="bg-white rounded-xl border border-border-light p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-primary-600" />
          <h2 className="text-base font-bold text-text-primary font-heading">Ubah Password</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Password Saat Ini</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Password Baru</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            required
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Konfirmasi Password Baru</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Ulangi password baru"
            required
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Memproses...' : 'Ubah Password'}
          </button>
        </div>
          </form>
        </div>
      </>
    );
  }
