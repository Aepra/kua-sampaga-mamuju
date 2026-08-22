'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Trash2, CheckCircle2, XCircle, MessageCircle, Star, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function AdminMasukanPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const { showToast } = useToast();

  const [replyTarget, setReplyTarget] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    loadFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFeedbacks = async () => {
    try {
      const res = await fetch('/api/admin/feedback');
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.data);
      }
    } catch {
      showToast('Gagal memuat data masukan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      });
      if (res.ok) {
        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, published: !currentStatus } : f));
        showToast(
          !currentStatus ? 'Masukan berhasil dipublikasikan' : 'Masukan disembunyikan',
          'success'
        );
      }
    } catch {
      showToast('Gagal mengubah status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus masukan ini permanen?')) return;
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedbacks(prev => prev.filter(f => f.id !== id));
        showToast('Masukan dihapus', 'success');
      }
    } catch {
      showToast('Gagal menghapus masukan', 'error');
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTarget) return;
    setIsReplying(true);
    try {
      const res = await fetch(`/api/admin/feedback/${replyTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminReply: replyText }),
      });
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(prev => prev.map(f => f.id === replyTarget.id ? data.data : f));
        showToast('Balasan terkirim', 'success');
        setReplyTarget(null);
        setReplyText('');
      }
    } catch {
      showToast('Gagal mengirim balasan', 'error');
    } finally {
      setIsReplying(false);
    }
  };

  const filtered = feedbacks.filter(f =>
    f.message.toLowerCase().includes(query.toLowerCase()) ||
    f.name.toLowerCase().includes(query.toLowerCase()) ||
    (f.user?.email || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-heading">Kelola Masukan</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Lihat, balas, dan kelola masukan dari pengunjung website.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50 dark:bg-gray-800/50 dark:bg-gray-700/50/50">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari masukan atau nama pengirim..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            {query ? 'Tidak ada masukan yang cocok dengan pencarian Anda.' : 'Belum ada masukan sama sekali.'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.map(f => (
              <div key={f.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 dark:bg-gray-700/50/50 transition-colors">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Feedback Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                        {f.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100">{f.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {f.user?.email || 'Tanpa Email'} • {new Date(f.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= f.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                      ))}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm text-sm">
                      "{f.message}"
                    </p>

                    {/* Admin Reply Section */}
                    {f.adminReply && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100 ml-4 relative">
                        <div className="absolute -left-[9px] top-4 w-4 h-4 bg-green-50 border-l border-b border-green-100 transform rotate-45"></div>
                        <div className="text-xs font-bold text-green-800 mb-1">Balasan Anda:</div>
                        <p className="text-sm text-green-900">{f.adminReply}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-center gap-2 min-w-[140px] pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => handleTogglePublish(f.id, f.published)}
                      className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                        f.published 
                          ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 dark:bg-gray-700/50'
                      }`}
                    >
                      {f.published ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {f.published ? 'Publik' : 'Sembunyi'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setReplyTarget(f);
                        setReplyText(f.adminReply || '');
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Balas
                    </button>

                    <button
                      onClick={() => handleDelete(f.id)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-red-200 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
            <form onSubmit={handleReplySubmit}>
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 dark:bg-gray-700/50">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Balas Masukan</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Membalas pesan dari {replyTarget.name}</p>
              </div>
              <div className="p-4 space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 italic">
                  "{replyTarget.message}"
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Balasan Anda</label>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ketik balasan Anda di sini..."
                    required
                  ></textarea>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 dark:bg-gray-700/50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReplyTarget(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isReplying}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {isReplying ? 'Menyimpan...' : 'Kirim Balasan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}




