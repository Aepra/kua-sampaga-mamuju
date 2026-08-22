'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Undo2, Redo2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useFormHistory } from '@/hooks/useFormHistory';

export default function EditPeraturanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [documentLink, setDocumentLink] = useState('');
  const [published, setPublished] = useState(true);

  // Form history for Undo/Redo
  const { undo, redo, canUndo, canRedo, isDirty, resetHistory, markSaved } = useFormHistory(
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

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const res = await fetch(`/api/regulations/${id}`);
        const data = await res.json();
        if (data.success && isMounted) {
          setTitle(data.data.title || '');
          setNumber(data.data.number || '');
          setYear(data.data.year || '');
          setDescription(data.data.description || '');
          setDocumentLink(data.data.documentLink || '');
          setPublished(data.data.published ?? true);
          resetHistory({
            title: data.data.title || '',
            number: data.data.number || '',
            year: data.data.year || '',
            description: data.data.description || '',
            documentLink: data.data.documentLink || '',
            published: data.data.published ?? true,
          });
        } else if (isMounted) {
          showToast('Peraturan tidak ditemukan.', 'error');
          router.push('/admin/peraturan');
        }
      } catch {
        if (isMounted) showToast('Gagal memuat data peraturan.', 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [id, router, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Judul peraturan wajib diisi.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/regulations/${id}`, {
        method: 'PUT',
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
        showToast('Peraturan berhasil diperbarui.', 'success');
        markSaved({ title, number, year, description, documentLink, published });
        router.refresh();
      } else {
        showToast(data.error || 'Gagal menyimpan perubahan.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-text-secondary dark:text-gray-400">Memuat data peraturan...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between gap-4 border-b border-border-light dark:border-gray-700 pb-4">
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
              Edit Peraturan
            </h1>
            <p className="text-xs text-text-tertiary dark:text-gray-500">
              Ubah data peraturan atau regulasi KUA.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
            className="px-4 py-2 text-sm font-medium text-text-secondary dark:text-gray-400 bg-surface-tertiary dark:bg-gray-700 rounded-lg hover:bg-border-light dark:hover:bg-gray-600"
          >
            Kembali
          </button>
          <button
            type="submit"
            disabled={submitting || !isDirty}
            className={`inline-flex items-center gap-2 px-5 py-2 text-white rounded-lg text-sm font-medium transition-colors ${
              !isDirty
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400'
            }`}
          >
            <Save className="w-4 h-4 hidden sm:block" />
            {submitting ? 'Menyimpan...' : 'Simpan'}
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



