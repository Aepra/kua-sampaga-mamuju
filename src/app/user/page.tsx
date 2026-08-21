'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  LogOut, User as UserIcon, CheckSquare, Square,
  Loader2, Trash2, Bookmark, ChevronDown, ExternalLink,
  CircleCheck, MessageCircle, Search, CircleDot, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import type { Service, Requirement } from '@/lib/types';

interface SavedServiceData {
  id: string;
  serviceId: string;
  checkedRequirementIds: string[];
  createdAt: string;
  service: Service & { requirements: Requirement[] };
}

export default function UserDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [savedServices, setSavedServices] = useState<SavedServiceData[]>([]);
  const [feedback, setFeedback] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingReq, setUpdatingReq] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/user/saved-services')
        .then(res => res.json())
        .then(data => {
          if (data.data) {
            setSavedServices(data.data);
            if (data.data.length > 0) {
              setExpandedCards(new Set([data.data[0].id]));
            }
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));

      fetch('/api/feedback?type=mine')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setFeedback(data.data);
          }
        })
        .catch(console.error);
    }
  }, [session]);

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleRequirement = async (savedServiceId: string, requirementId: string, isCurrentlyChecked: boolean) => {
    setUpdatingReq(requirementId);
    try {
      const res = await fetch('/api/user/saved-services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savedServiceId, requirementId, isChecked: !isCurrentlyChecked })
      });
      if (res.ok) {
        setSavedServices(prev => prev.map(ss => {
          if (ss.id === savedServiceId) {
            let newChecked = [...ss.checkedRequirementIds];
            if (!isCurrentlyChecked) newChecked.push(requirementId);
            else newChecked = newChecked.filter(id => id !== requirementId);
            return { ...ss, checkedRequirementIds: newChecked };
          }
          return ss;
        }));
      }
    } catch (error) { console.error(error); }
    finally { setUpdatingReq(null); }
  };

  const handleUnsave = async (e: React.MouseEvent, serviceId: string) => {
    e.stopPropagation();
    if (!confirm('Hapus layanan ini dari dasbor?')) return;
    try {
      const res = await fetch('/api/user/saved-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId })
      });
      if (res.ok) setSavedServices(prev => prev.filter(ss => ss.serviceId !== serviceId));
    } catch (error) { console.error(error); }
  };

  const handleDeleteFeedback = async () => {
    if (!confirm('Hapus masukan Anda secara permanen?')) return;
    try {
      const res = await fetch('/api/feedback', { method: 'DELETE' });
      if (res.ok) setFeedback(null);
    } catch (error) { console.error(error); }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9] dark:bg-gray-950">
        <Loader2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const handleLogout = async () => { await signOut({ callbackUrl: '/login' }); };

  const totalSaved = savedServices.length;
  const totalComplete = savedServices.filter(ss => {
    const total = ss.service.requirements.length;
    return total > 0 && ss.checkedRequirementIds.length === total;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0FDF4] via-[#F8FAF9] to-[#F8FAF9] dark:from-gray-950 dark:via-gray-950 dark:to-gray-950">
      {/* ============ PROFILE CARD (floating on top) ============ */}
      <div className="pt-[76px] sm:pt-[84px]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-[#064E3B] to-[#047857] rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white dark:bg-gray-800/[0.07] rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-300/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-gray-800/20 border-2 border-white/25 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-7 h-7 text-white/60" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-extrabold font-heading truncate leading-tight">
                  Halo, {session.user?.name?.split(' ')[0] || 'Pengguna'}! 👋
                </h1>
                <p className="text-emerald-200/70 text-xs sm:text-sm font-medium truncate mt-0.5">
                  {session.user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 sm:px-3.5 sm:py-1.5 bg-white dark:bg-gray-800/10 hover:bg-white dark:bg-gray-800/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all flex-shrink-0 border border-white/10"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>

            {/* Stats inside the card */}
            <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3 mt-5">
              {[
                { value: totalSaved, label: 'Layanan', color: 'text-white' },
                { value: totalComplete, label: 'Siap Diurus', color: 'text-emerald-300' },
                { value: totalSaved - totalComplete, label: 'Perlu Dilengkapi', color: 'text-amber-300' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-gray-800/[0.08] rounded-xl px-3 py-2.5 text-center backdrop-blur-sm border border-white/[0.06]">
                  <p className={`text-xl sm:text-2xl font-extrabold leading-none ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-emerald-100/50 font-medium mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============ SAVED SERVICES LIST ============ */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-24">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-[#1A2E1A] dark:text-gray-100 font-heading flex items-center gap-2">
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
            Layanan Tersimpan
          </h2>
          <Link
            href="/layanan"
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Cari Layanan
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
            <p className="text-sm text-[#4A5D4A] dark:text-gray-400">Memuat...</p>
          </div>
        ) : savedServices.length > 0 ? (
          <div className="space-y-3">
            {savedServices.map(saved => {
              const s = saved.service;
              const totalReq = s.requirements.length;
              const checkedCount = saved.checkedRequirementIds.length;
              const progress = totalReq === 0 ? 100 : Math.round((checkedCount / totalReq) * 100);
              const isExpanded = expandedCards.has(saved.id);
              const isComplete = progress === 100 && totalReq > 0;

              return (
                <div
                  key={saved.id}
                  className={`bg-white dark:bg-gray-800 rounded-2xl border overflow-hidden transition-all duration-300 shadow-sm ${
                    isComplete ? 'border-emerald-200 shadow-emerald-100/50' : 'border-gray-100 dark:border-gray-700'
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleCard(saved.id)}
                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-left active:bg-gray-50 dark:active:bg-gray-700 transition-colors"
                  >
                    {/* Mini Progress Ring */}
                    <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                        <circle cx="22" cy="22" r="18" fill="none" strokeWidth="3" className="stroke-gray-100 dark:stroke-gray-700" />
                        <circle
                          cx="22" cy="22" r="18" fill="none" strokeWidth="3"
                          strokeDasharray={`${2 * Math.PI * 18}`}
                          strokeDashoffset={`${2 * Math.PI * 18 * (1 - progress / 100)}`}
                          strokeLinecap="round"
                          className={`transition-all duration-700 ${isComplete ? 'stroke-emerald-500' : 'stroke-amber-500'}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        {isComplete ? (
                          <CircleCheck className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <span className="text-[10px] font-extrabold text-gray-700 dark:text-gray-300">{progress}%</span>
                        )}
                      </div>
                    </div>

                    {/* Title & Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded">
                          {s.category}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-[15px] font-bold text-gray-800 dark:text-gray-100 font-heading truncate leading-snug">
                        {s.title}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {isComplete ? (
                          <span className="text-emerald-500 font-semibold">✓ Dokumen lengkap</span>
                        ) : (
                          <>{checkedCount}/{totalReq} persyaratan</>
                        )}
                      </p>
                    </div>

                    {/* Chevron */}
                    <ChevronDown className={`w-4 h-4 text-gray-300 flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Accordion Body */}
                  <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                        {/* Thin progress bar */}
                        {totalReq > 0 && (
                          <div className="mb-4">
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                              <div
                                className={`h-1 rounded-full transition-all duration-700 ${isComplete ? 'bg-emerald-400' : 'bg-amber-400'}`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Checklist */}
                        {totalReq > 0 ? (
                          <div className="space-y-1">
                            {s.requirements.map(req => {
                              const isChecked = saved.checkedRequirementIds.includes(req.id);
                              return (
                                <label
                                  key={req.id}
                                  className={`flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${
                                    isChecked
                                      ? 'bg-emerald-50 dark:bg-emerald-900/30'
                                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={isChecked}
                                    onChange={() => handleToggleRequirement(saved.id, req.id, isChecked)}
                                    disabled={updatingReq === req.id}
                                  />
                                  <div className="flex-shrink-0">
                                    {updatingReq === req.id ? (
                                      <Loader2 className="w-[18px] h-[18px] text-emerald-500 animate-spin" />
                                    ) : isChecked ? (
                                      <CheckSquare className="w-[18px] h-[18px] text-emerald-500" />
                                    ) : (
                                      <Square className="w-[18px] h-[18px] text-gray-300" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <span className={`text-[13px] font-medium block leading-snug ${isChecked ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                                      {req.title}
                                      {req.required && <span className="text-red-400 ml-0.5 text-xs">*</span>}
                                    </span>
                                    {req.description && (
                                      <span className={`text-[11px] block leading-snug mt-0.5 ${isChecked ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400 dark:text-gray-500'}`}>
                                        {req.description}
                                      </span>
                                    )}
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 py-2">Tidak ada persyaratan khusus.</p>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50 dark:border-gray-700">
                          <Link
                            href={`/layanan/${s.slug}`}
                            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Detail
                          </Link>
                          <a
                            href={`https://wa.me/628114169614?text=${encodeURIComponent(`Assalamu'alaikum, saya ingin bertanya mengenai persyaratan "${s.title}" di KUA Kecamatan Sampaga.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-300 bg-gray-50 dark:bg-gray-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <MessageCircle className="w-3 h-3" />
                            Tanya
                          </a>
                          <button
                            onClick={(e) => handleUnsave(e, s.id)}
                            className="inline-flex items-center text-[11px] font-semibold text-gray-300 hover:text-red-500 dark:text-red-400 p-1.5 rounded-lg transition-colors ml-auto"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-gray-800 p-10 sm:p-14 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Sparkles className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 font-heading">Mulai Pantau Dokumen Anda</h3>
            <p className="text-sm text-gray-400 mb-7 max-w-xs mx-auto leading-relaxed">
              Simpan layanan yang ingin Anda urus, lalu centang persyaratan yang sudah disiapkan.
            </p>
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-emerald-600/20"
            >
              <Search className="w-4 h-4" />
              Jelajahi Layanan
            </Link>
          </div>
        )}

        {/* Feedback Section */}
        {feedback && (
          <div className="mt-8 mb-4">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Masukan & Penilaian Saya
            </h2>
            <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${feedback.published ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100'}`}>
                      {feedback.published ? 'Publik' : 'Menunggu Tinjauan'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(feedback.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 italic border-l-2 border-emerald-100 pl-3">
                    "{feedback.message}"
                  </p>
                  
                  {feedback.adminReply && (
                    <div className="mt-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 p-3.5 rounded-xl relative">
                      <div className="absolute -top-[5px] left-5 w-2.5 h-2.5 bg-emerald-50 dark:bg-emerald-900/30 border-t border-l border-emerald-100 transform rotate-45"></div>
                      <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-emerald-800">
                        <CheckSquare className="w-3.5 h-3.5" />
                        Balasan Admin KUA
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                        {feedback.adminReply}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                  <Link
                    href="/#berikan-masukan"
                    onClick={(e) => {
                      // Simulasikan klik pada tombol di beranda jika memungkinkan, atau arahkan ke beranda
                      if (window.location.pathname !== '/') {
                        window.location.href = '/';
                      }
                    }}
                    className="flex-1 sm:w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDeleteFeedback}
                    className="flex-1 sm:w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Card */}
        {savedServices.length > 0 && !feedback && (
          <div className="mt-6 bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Butuh bantuan?</p>
                <p className="text-[11px] text-gray-400">Tanya admin via WhatsApp</p>
              </div>
              <a
                href="https://wa.me/628114169614"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors flex-shrink-0"
              >
                Hubungi
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


