'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Undo2, Redo2 } from 'lucide-react';
import type { GalleryItem } from '@/lib/types';
import { GALLERY_CATEGORIES } from '@/lib/types';
import UploadImage from '@/components/admin/UploadImage';
import { useToast } from '@/components/ui/Toast';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { useFormHistory } from '@/hooks/useFormHistory';

interface GalleryFormProps {
  initialData?: GalleryItem;
}

export default function GalleryForm({ initialData }: GalleryFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || 'Pelayanan');
  const [image, setImage] = useState(initialData?.image || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [published, setPublished] = useState(initialData?.published ?? true);

  // Form history for Undo/Redo
  const { undo, redo, canUndo, canRedo, isDirty, markSaved } = useFormHistory(
    {
      title, description, category, image, date, published
    },
    (state) => {
      setTitle(state.title);
      setDescription(state.description);
      setCategory(state.category);
      setImage(state.image);
      setDate(state.date);
      setPublished(state.published);
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Judul foto wajib diisi.', 'error');
      return;
    }

    if (!image) {
      showToast('Gambar foto wajib diunggah.', 'error');
      return;
    }

    setLoading(true);

    const payload = {
      title,
      description,
      category,
      image,
      date,
      published,
    };

    try {
      const url = initialData ? `/api/gallery/${initialData.id}` : '/api/gallery';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        showToast(`Foto berhasil ${initialData ? 'diperbarui' : 'ditambahkan'}.`, 'success');
        if (!initialData && data.data?.id) {
          router.replace(`/admin/galeri/${data.data.id}/edit`);
        } else {
          markSaved({ title, description, category, image, date, published });
          router.refresh();
        }
      } else {
        showToast(data.error || 'Gagal menyimpan foto.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FullScreenLoader isLoading={loading} message={initialData ? 'Memperbarui foto...' : 'Menambahkan foto...'} />
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-light dark:border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/galeri')}
            className="p-2 text-text-secondary dark:text-gray-400 hover:text-text-primary dark:text-gray-100 hover:bg-surface-tertiary dark:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary dark:text-gray-100 font-heading">
              {initialData ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}
            </h1>
            <p className="text-xs text-text-tertiary dark:text-gray-500">
              Unggah dan kelola foto kegiatan KUA.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
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
            type="button"
            onClick={() => router.push('/admin/galeri')}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-text-secondary dark:text-gray-400 bg-surface-tertiary dark:bg-gray-700 rounded-lg hover:bg-border-light dark:hover:bg-gray-600"
          >
            Kembali
          </button>
          <button
            type="submit"
            disabled={loading || !isDirty}
            className={`flex-1 sm:flex-none justify-center inline-flex items-center gap-2 px-5 py-2 text-white rounded-lg text-sm font-medium transition-colors ${
              !isDirty
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400'
            }`}
          >
            <Save className="w-4 h-4" />
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
            Judul Foto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Contoh: Kegiatan Pelayanan Nikah KUA"
            required
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
            Deskripsi Foto
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Dokumentasi singkat kegiatan..."
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
            >
              {GALLERY_CATEGORIES.filter(c => c !== 'Semua').map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
              Tanggal Kegiatan
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
            />
          </div>
        </div>

        <UploadImage
          value={image}
          onChange={setImage}
          folder="gallery"
          prefix="kegiatan-kua"
          label="Pilih Foto (Maks 5 MB, Format: JPG/PNG/WebP)"
        />

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={e => setPublished(e.target.checked)}
              className="rounded border-border-medium text-primary-600 dark:text-primary-400 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-text-primary dark:text-gray-100">
              Tampilkan di halaman galeri publik
            </span>
          </label>
        </div>
        </div>
      </form>
    </>
  );
}


