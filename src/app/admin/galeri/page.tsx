'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, ImageIcon, ArrowLeft } from 'lucide-react';
import type { GalleryItem } from '@/lib/types';
import { GALLERY_CATEGORIES } from '@/lib/types';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';

export default function AdminGaleriListPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const loadGallery = async () => {
      try {
        const res = await fetch('/api/gallery');
        const data = await res.json();
        if (data.success && isMounted) {
          setGallery(data.data);
        }
      } catch {
        if (isMounted) showToast('Gagal memuat data galeri', 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadGallery();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/gallery/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Foto berhasil dihapus beserta filenya', 'success');
        setGallery(prev => prev.filter(g => g.id !== deleteTarget.id));
      } else {
        showToast(data.error || 'Gagal menghapus foto', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menghapus', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = gallery.filter(item => {
    const matchQuery = item.title.toLowerCase().includes(query.toLowerCase());
    const matchCategory = category === 'Semua' || item.category === category;
    return matchQuery && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 text-text-secondary dark:text-gray-400 hover:text-text-primary dark:text-gray-100 hover:bg-surface-tertiary dark:bg-gray-700 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-gray-100 font-heading">Kelola Galeri</h1>
            <p className="text-xs sm:text-sm text-text-secondary dark:text-gray-400 mt-1">Daftar foto kegiatan dan pelayanan KUA.</p>
          </div>
        </div>
        <Link
          href="/admin/galeri/tambah"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors w-full sm:w-auto"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Tambah Foto
        </Link>
      </div>

      {/* Filter bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary dark:text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cari foto berdasarkan judul..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
            />
          </div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-3 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
          >
            {GALLERY_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 p-8 text-center text-sm text-text-secondary dark:text-gray-400">
          Memuat galeri...
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-video bg-surface-tertiary dark:bg-gray-700 overflow-hidden">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-tertiary dark:text-gray-500">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {item.published ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded-full">
                      PUBLISHED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-50 dark:bg-gray-800/50 dark:bg-gray-700/500 text-white rounded-full">
                      DRAFT
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-medium text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <h3 className="mt-1 text-sm font-semibold text-text-primary dark:text-gray-100 line-clamp-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1 text-xs text-text-secondary dark:text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-border-light dark:border-gray-700 flex items-center justify-between">
                  <span className="text-[10px] text-text-tertiary dark:text-gray-500">{item.date}</span>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/galeri/${item.id}/edit`}
                      className="p-1.5 text-text-tertiary dark:text-gray-500 hover:text-blue-600 rounded-md hover:bg-surface-tertiary dark:bg-gray-700"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 text-text-tertiary dark:text-gray-500 hover:text-red-600 dark:text-red-400 rounded-md hover:bg-surface-tertiary dark:bg-gray-700"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 p-8 text-center text-sm text-text-tertiary dark:text-gray-500">
          Tidak ada foto dalam galeri.
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Foto Galeri"
        message={`Apakah Anda yakin ingin menghapus foto "${deleteTarget?.title}"? File fisik gambar juga akan dihapus dari server.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}




