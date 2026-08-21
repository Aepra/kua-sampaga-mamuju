'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import type { Information } from '@/lib/types';
import { INFORMATION_CATEGORIES } from '@/lib/types';
import UploadImage from '@/components/admin/UploadImage';
import UploadMultipleImages from '@/components/admin/UploadMultipleImages';
import { useToast } from '@/components/ui/Toast';
import FullScreenLoader from '@/components/ui/FullScreenLoader';

interface InformationFormProps {
  initialData?: Information;
}

export default function InformationForm({ initialData }: InformationFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || '');
  const [category, setCategory] = useState(initialData?.category || 'Pengumuman');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [published, setPublished] = useState(initialData?.published ?? true);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      showToast('Judul dan slug wajib diisi.', 'error');
      return;
    }

    setLoading(true);

    const payload = {
      title,
      slug,
      content,
      excerpt: excerpt.trim() || content.substring(0, 150),
      images,
      thumbnail,
      category,
      date,
      published,
    };

    try {
      const url = initialData ? `/api/information/${initialData.id}` : '/api/information';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        showToast(`Informasi berhasil ${initialData ? 'diperbarui' : 'ditambahkan'}.`, 'success');
        router.push('/admin/informasi-dan-berita');
        router.refresh();
      } else {
        showToast(data.error || 'Gagal menyimpan informasi.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FullScreenLoader isLoading={loading} message={initialData ? 'Memperbarui informasi...' : 'Menambahkan informasi...'} />
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-light dark:border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 text-text-secondary dark:text-gray-400 hover:text-text-primary dark:text-gray-100 hover:bg-surface-tertiary dark:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary dark:text-gray-100 font-heading">
              {initialData ? 'Edit Informasi' : 'Tambah Informasi'}
            </h1>
            <p className="text-xs text-text-tertiary dark:text-gray-500">
              Kelola pengumuman, berita, atau kegiatan KUA.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-text-secondary dark:text-gray-400 bg-surface-tertiary dark:bg-gray-700 rounded-lg hover:bg-border-light dark:hover:bg-gray-600"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-none justify-center inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
              Judul Informasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Contoh: Pengumuman Jam Pelayanan Bulan Ramadhan"
              required
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="pengumuman-jam-pelayanan"
              required
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none font-mono"
            />
          </div>
        </div>

        <UploadImage
          value={thumbnail}
          onChange={setThumbnail}
          folder="information"
          prefix={slug || 'info-cover'}
          label="Thumbnail / Gambar Sampul (Opsional)"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
            >
              {INFORMATION_CATEGORIES.filter(c => c !== 'Semua').map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
              Tanggal Publikasi
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
            Ringkasan / Excerpt
          </label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            placeholder="Ringkasan singkat yang tampil di daftar berita..."
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
            Isi Informasi Lengkap <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={8}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Tuliskan isi pengumuman atau berita secara lengkap..."
            required
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <UploadMultipleImages
          value={images}
          onChange={setImages}
          folder="information"
          prefix={slug || 'info'}
          label="Tambahkan gambar / dokumentasi"
          maxImages={2}
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
              Dipublikasikan di website publik
            </span>
          </label>
        </div>
        </div>
      </form>
    </>
  );
}


