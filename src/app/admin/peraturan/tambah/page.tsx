'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Undo2, Redo2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useFormHistory } from '@/hooks/useFormHistory';

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

  // Form history for Undo/Redo
  const { undo, redo, canUndo, canRedo, isDirty, markSaved } = useFormHistory(
    { title, number, year, description, documentLink, published },
    (state) => {
      setTitle(state.title);
      setNumber(state.number);
      setYear(state.year);
      setDescription(state.description);
      setDocumentLink(state.documentLink);
      setPublished(state.published);
    }
  );

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

      if (data.success && data.data?.id) {
        showToast('Peraturan berhasil ditambahkan.', 'success');
        router.replace(`/admin/peraturan/${data.data.id}/edit`);
      } else if (data.success) {
        showToast('Peraturan berhasil ditambahkan.', 'success');
        markSaved({ title, number, year, description, documentLink, published });
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-light dark:border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/peraturan')}
            className="p-2 text-text-secondary dark:text-gray-400 hover:text-text-primary dark:text-gray-100 hover:bg-surface-tertiary dark:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary dark:text-gray-100 font-heading">
              Tambah Peraturan
            </h1>
            <p className="text-xs text-text-tertiary dark:text-gray-500">
              Tambahkan peraturan atau regulasi resmi KUA.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
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
            onClick={() => router.push('/admin/peraturan')}
            className="flex-1 sm:flex-none justify-center px-4 py-2 text-sm font-medium text-text-secondary dark:text-gray-400 bg-surface-tertiary dark:bg-gray-700 rounded-lg hover:bg-border-light dark:hover:bg-gray-600"
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
            <Save className="w-4 h-4 hidden sm:block" />
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
            Judul Peraturan <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Contoh: Peraturan Menteri Agama tentang Pencatatan Nikah"
            required
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
              Nomor Peraturan
            </label>
            <input
              type="text"
              value={number}
              onChange={e => setNumber(e.target.value)}
              placeholder="Contoh: No. 20 Tahun 2019"
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
              Tahun
            </label>
            <input
              type="text"
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="Contoh: 2019"
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
            Deskripsi Ringkas
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Penjelasan singkat mengenai isi peraturan..."
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
            Link Dokumen (PDF / Google Drive / External)
          </label>
          <input
            type="url"
            value={documentLink}
            onChange={e => setDocumentLink(e.target.value)}
            placeholder="https://..."
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none font-mono"
          />
        </div>

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
  );
}




