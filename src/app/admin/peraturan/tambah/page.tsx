'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function TambahPeraturanPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [documentLink, setDocumentLink] = useState('');
  const [published, setPublished] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Judul peraturan wajib diisi.', 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/regulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          number,
          year,
          description,
          documentLink,
          published,
        }),
      });

      const data = await res.json();

      if (data.success) {
        showToast('Peraturan berhasil ditambahkan.', 'success');
        router.push('/admin/peraturan');
        router.refresh();
      } else {
        showToast(data.error || 'Gagal menyimpan peraturan.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
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
              Tambah Peraturan
            </h1>
            <p className="text-xs text-text-tertiary">
              Tambahkan peraturan atau regulasi resmi KUA.
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
            {loading ? 'Menyimpan...' : 'Simpan Peraturan'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-light p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Judul Peraturan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Contoh: Peraturan Menteri Agama tentang Pencatatan Nikah"
            required
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Nomor Peraturan
            </label>
            <input
              type="text"
              value={number}
              onChange={e => setNumber(e.target.value)}
              placeholder="Contoh: No. 20 Tahun 2019"
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Tahun
            </label>
            <input
              type="text"
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="Contoh: 2019"
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Deskripsi Ringkas
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Penjelasan singkat mengenai isi peraturan..."
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Link Dokumen (PDF / Google Drive / External)
          </label>
          <input
            type="url"
            value={documentLink}
            onChange={e => setDocumentLink(e.target.value)}
            placeholder="https://..."
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none font-mono"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={e => setPublished(e.target.checked)}
              className="rounded border-border-medium text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-text-primary">
              Dipublikasikan di website publik
            </span>
          </label>
        </div>
      </div>
    </form>
  );
}
