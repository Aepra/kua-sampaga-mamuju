'use client';

import { useState, useEffect } from 'react';
import { X, Send, AlertCircle, CheckCircle2, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (isOpen && session) {
      const fetchMyFeedback = async () => {
        try {
          const res = await fetch('/api/feedback?type=mine');
          const data = await res.json();
          if (data.success && data.data) {
            setMessage(data.data.message);
            setRating(data.data.rating);
            setIsEdit(true);
          }
        } catch (err) {
          console.error('Failed to fetch existing feedback');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchMyFeedback();
    } else {
      setInitialLoading(false);
    }
  }, [isOpen, session]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Pesan wajib diisi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, rating }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Terjadi kesalahan saat mengirim masukan');
      } else {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setMessage('');
          setRating(5);
          onClose();
        }, 2500);
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold font-heading text-[#1A2E1A] mb-1">
            {isEdit ? 'Perbarui Masukan' : 'Berikan Masukan'}
          </h2>
          <p className="text-sm text-[#4A5D4A] mb-6">
            Masukan Anda sangat berarti bagi peningkatan layanan kami.
          </p>

          {initialLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-8 h-8 border-4 border-[#10B981]/20 border-t-[#10B981] rounded-full animate-spin"></div>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <div className="w-16 h-16 bg-[#D1FAE5] text-[#059669] rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-[#1A2E1A] text-lg">Terima Kasih!</h3>
              <p className="text-sm text-[#4A5D4A]">Masukan Anda telah kami {isEdit ? 'perbarui' : 'terima'}.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Show the user's name implicitly */}
              <div className="bg-[#F8FAF9] p-3 rounded-xl border border-[#E5EBE5] flex items-center gap-3">
                <div className="w-10 h-10 bg-[#eefcef] text-[#186f64] flex items-center justify-center rounded-lg font-bold text-lg">
                  {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A2E1A]">{session?.user?.name || 'Pengguna'}</h4>
                  <p className="text-xs text-[#9fabad]">Mengirim sebagai akun ini</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A2E1A] mb-1.5">Penilaian</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-7 h-7 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-100 text-gray-200'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A2E1A] mb-1.5">Pesan atau Masukan</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan pengalaman atau saran Anda..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5EBE5] bg-[#F8FAF9] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:bg-white transition-all text-sm resize-none"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#059669] hover:bg-[#047857] text-white font-bold py-3 rounded-xl shadow-sm transition-all hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {isEdit ? 'Perbarui Masukan' : 'Kirim Masukan'}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
