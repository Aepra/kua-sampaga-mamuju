'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import type { GalleryItem } from '@/lib/types';
import { GALLERY_CATEGORIES } from '@/lib/types';
import UploadImage from '@/components/admin/UploadImage';
import { useToast } from '@/components/ui/Toast';
import FullScreenLoader from '@/components/ui/FullScreenLoader';

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
        router.push('/admin/galeri');
        router.refresh();
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
      <div className="flex items-center justify-between gap-4 border-b border-border-light pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-tertiary rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary font-heading">
              {initialData ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}
            </h1>
            <p className="text-xs text-text-tertiary">
              Unggah dan kelola foto kegiatan KUA.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface-tertiary rounded-lg hover:bg-border-light"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Menyimpan...' : 'Simpan Foto'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-light p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Judul Foto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Contoh: Kegiatan Pelayanan Nikah KUA"
            required
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Deskripsi Foto
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Dokumentasi singkat kegiatan..."
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
            >
              {GALLERY_CATEGORIES.filter(c => c !== 'Semua').map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Tanggal Kegiatan
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
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
              className="rounded border-border-medium text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-text-primary">
              Tampilkan di halaman galeri publik
            </span>
          </label>
        </div>
        </div>
      </form>
    </>
  );
}
