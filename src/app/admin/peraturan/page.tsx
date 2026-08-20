'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Trash2, Edit2, CheckCircle2, XCircle, FileText, ExternalLink } from 'lucide-react';
import type { Regulation } from '@/lib/types';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';

export default function AdminPeraturanListPage() {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Regulation | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const loadRegulations = async () => {
      try {
        const res = await fetch('/api/regulations');
        const data = await res.json();
        if (data.success && isMounted) {
          setRegulations(data.data);
        }
      } catch {
        if (isMounted) showToast('Gagal memuat data peraturan', 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadRegulations();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/regulations/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Peraturan berhasil dihapus', 'success');
        setRegulations(prev => prev.filter(r => r.id !== deleteTarget.id));
      } else {
        showToast(data.error || 'Gagal menghapus peraturan', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menghapus', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = regulations.filter(r =>
    r.title.toLowerCase().includes(query.toLowerCase()) ||
    r.number.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-heading">Kelola Peraturan & Regulasi</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">Daftar peraturan dan regulasi resmi KUA.</p>
        </div>
        <Link
          href="/admin/peraturan/tambah"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Peraturan
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border-light p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari berdasarkan judul atau nomor..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-light overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-text-secondary">Memuat data peraturan...</div>
        ) : filtered.length > 0 ? (
          <div className="divide-y divide-border-light">
            {filtered.map(item => (
              <div key={item.id} className="p-4 hover:bg-surface-secondary/50 transition-colors flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-text-primary text-sm sm:text-base">{item.title}</h3>
                    {(item.number || item.year) && (
                      <p className="text-xs font-mono text-text-tertiary mt-0.5">
                        {[item.number, item.year].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-xs text-text-secondary mt-1 line-clamp-2">{item.description}</p>
                    )}
                    {item.documentLink && (
                      <a
                        href={item.documentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline mt-2 font-medium"
                      >
                        <ExternalLink className="w-3 h-3" /> Link Dokumen PDF
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.published ? (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Dipublikasikan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                      <XCircle className="w-3 h-3" /> Draft
                    </span>
                  )}
                  <Link
                    href={`/admin/peraturan/${item.id}/edit`}
                    className="p-1.5 text-text-tertiary hover:text-primary-600 rounded-md hover:bg-surface-tertiary transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 text-text-tertiary hover:text-red-600 rounded-md hover:bg-surface-tertiary transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-text-tertiary">
            Belum ada peraturan yang ditambahkan.
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Peraturan"
        message={`Apakah Anda yakin ingin menghapus peraturan "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
