'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Eye, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import type { Service } from '@/lib/types';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';

export default function AdminLayananListPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const loadServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success && isMounted) {
          setServices(data.data);
        }
      } catch {
        if (isMounted) showToast('Gagal memuat data layanan', 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadServices();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/services/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Layanan berhasil dihapus', 'success');
        setServices(prev => prev.filter(s => s.id !== deleteTarget.id));
      } else {
        showToast(data.error || 'Gagal menghapus layanan', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menghapus', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 text-text-secondary dark:text-gray-400 hover:text-text-primary dark:text-gray-100 hover:bg-surface-tertiary dark:bg-gray-700 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-gray-100 font-heading">Kelola Layanan</h1>
            <p className="text-xs sm:text-sm text-text-secondary dark:text-gray-400 mt-1">Daftar semua layanan KUA yang tersedia.</p>
          </div>
        </div>
        <Link
          href="/admin/layanan/tambah"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors w-full sm:w-auto"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Tambah Layanan
        </Link>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary dark:text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari layanan berdasarkan judul atau kategori..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 focus:ring-0 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-text-secondary dark:text-gray-400">Memuat data...</div>
        ) : filtered.length > 0 ? (
          <div className="relative">
            {/* Scroll Indicator Mobile */}
            <div className="flex sm:hidden items-center justify-center gap-1.5 py-2 bg-primary-50 dark:bg-primary-900/30/50 text-[11px] font-medium text-primary-700 dark:text-primary-400 border-b border-border-light dark:border-gray-700">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              Geser tabel ke kiri/kanan untuk melihat lebih detail
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border-b border-border-light dark:border-gray-700 text-xs font-semibold text-text-tertiary dark:text-gray-500 uppercase whitespace-nowrap">
                <tr>
                  <th className="px-4 py-3">Judul Layanan</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Persyaratan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-gray-700">
                {filtered.map(service => (
                  <tr key={service.id} className="hover:bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500/50 transition-colors">
                    <td className="px-4 py-3 min-w-[200px]">
                      <p className="font-semibold text-text-primary dark:text-gray-100">{service.title}</p>
                      <p className="text-xs text-text-tertiary dark:text-gray-500 font-mono">/{service.slug}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary dark:text-gray-400 whitespace-nowrap">
                      {service.requirements.length} Syarat
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {service.published ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Dipublikasikan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/layanan/${service.slug}`}
                          target="_blank"
                          className="p-1.5 text-text-tertiary dark:text-gray-500 hover:text-primary-600 dark:text-primary-400 rounded-md hover:bg-surface-tertiary dark:bg-gray-700"
                          title="Lihat Halaman Publik"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/layanan/${service.id}/edit`}
                          className="p-1.5 text-text-tertiary dark:text-gray-500 hover:text-blue-600 rounded-md hover:bg-surface-tertiary dark:bg-gray-700"
                          title="Edit Layanan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(service)}
                          className="p-1.5 text-text-tertiary dark:text-gray-500 hover:text-red-600 dark:text-red-400 rounded-md hover:bg-surface-tertiary dark:bg-gray-700"
                          title="Hapus Layanan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-text-tertiary dark:text-gray-500">
            Tidak ada layanan yang ditemukan.
          </div>
        )}
      </div>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Layanan"
        message={`Apakah Anda yakin ingin menghapus layanan "${deleteTarget?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}




