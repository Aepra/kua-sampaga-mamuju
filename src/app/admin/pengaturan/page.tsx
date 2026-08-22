'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Save, User, Shield, Undo2, Redo2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { useFormHistory } from '@/hooks/useFormHistory';

export default function AdminPengaturanPage() {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Form history for Undo/Redo
  const { undo, redo, canUndo, canRedo, isDirty, markSaved } = useFormHistory(
    { currentPassword, newPassword, confirmPassword },
    (state) => {
      setCurrentPassword(state.currentPassword);
      setNewPassword(state.newPassword);
      setConfirmPassword(state.confirmPassword);
    }
  );

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
      markSaved({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaving(false);
    }, 1000);
  };

  return (
    <>
      <FullScreenLoader isLoading={saving} message="Memperbarui kata sandi..." />
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 text-text-secondary dark:text-gray-400 hover:text-text-primary dark:text-gray-100 hover:bg-surface-tertiary dark:bg-gray-700 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100 font-heading">Pengaturan Akun</h1>
            <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">Kelola keamanan dan kata sandi akun admin.</p>
          </div>
        </div>

      {/* Account Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-text-primary dark:text-gray-100">Administrator</p>
            <p className="text-xs text-text-tertiary dark:text-gray-500">admin@kuasampaga.test</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full">
              ROLE: ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <form onSubmit={handleSubmitPassword} className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h2 className="text-base font-bold text-text-primary dark:text-gray-100 font-heading">Ubah Password</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">Password Saat Ini</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">Password Baru</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            required
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">Konfirmasi Password Baru</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Ulangi password baru"
            required
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div className="pt-2 flex items-center gap-3">
          <div className="flex items-center gap-1 mr-2 border-r border-border-medium dark:border-gray-600 pr-3">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="p-2 text-text-secondary dark:text-gray-400 hover:text-text-primary dark:text-gray-100 hover:bg-surface-tertiary dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              title="Undo"
            >
              <Undo2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="p-2 text-text-secondary dark:text-gray-400 hover:text-text-primary dark:text-gray-100 hover:bg-surface-tertiary dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              title="Redo"
            >
              <Redo2 className="w-5 h-5" />
            </button>
          </div>
          <button
            type="submit"
            disabled={saving || !isDirty}
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-lg text-sm font-medium transition-colors ${
              !isDirty
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400'
            }`}
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




