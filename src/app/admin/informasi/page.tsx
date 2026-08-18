'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import type { Information } from '@/lib/types';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';

export default function AdminInformasiListPage() {
  const [information, setInformation] = useState<Information[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Information | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const loadInformation = async () => {
      try {
        const res = await fetch('/api/information');
        const data = await res.json();
        if (data.success && isMounted) {
          setInformation(data.data);
        }
      } catch {
        if (isMounted) showToast('Gagal memuat data informasi', 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadInformation();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/information/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Informasi berhasil dihapus', 'success');
        setInformation(prev => prev.filter(i => i.id !== deleteTarget.id));
      } else {
        showToast(data.error || 'Gagal menghapus informasi', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menghapus', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = information.filter(i =>
    i.title.toLowerCase().includes(query.toLowerCase()) ||
    i.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">Kelola Informasi</h1>
          <p className="text-sm text-text-secondary mt-1">Pengumuman, berita, dan kegiatan KUA.</p>
        </div>
        <Link
          href="/admin/informasi/tambah"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Informasi
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border-light p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari berdasarkan judul atau kategori..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-light overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-text-secondary">Memuat data...</div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-secondary border-b border-border-light text-xs font-semibold text-text-tertiary uppercase">
                <tr>
                  <th className="px-4 py-3">Judul Informasi</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-text-primary">{item.title}</p>
                      <p className="text-xs text-text-tertiary font-mono">/{item.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary">
                      {item.date}
                    </td>
                    <td className="px-4 py-3">
                      {item.published ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Dipublikasikan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/informasi/${item.id}/edit`}
                          className="p-1.5 text-text-tertiary hover:text-blue-600 rounded-md hover:bg-surface-tertiary"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 text-text-tertiary hover:text-red-600 rounded-md hover:bg-surface-tertiary"
                          title="Hapus"
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
        ) : (
          <div className="p-8 text-center text-sm text-text-tertiary">
            Tidak ada informasi yang ditemukan.
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Informasi"
        message={`Apakah Anda yakin ingin menghapus informasi "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
