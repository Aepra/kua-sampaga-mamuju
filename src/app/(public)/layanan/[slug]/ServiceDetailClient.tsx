'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle, Circle, ExternalLink, Printer,
  MessageCircle, Copy, AlertTriangle,
  Bookmark, FileText, Check, ShieldAlert, Sparkles
} from 'lucide-react';
import type { Service, SiteSettings } from '@/lib/types';

interface ServiceDetailClientProps {
  service: Service;
  settings: SiteSettings;
}

export default function ServiceDetailClient({ service, settings }: ServiceDetailClientProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Save to recently viewed & check bookmark
  useEffect(() => {
    let isMounted = true;
    const initData = async () => {
      await Promise.resolve();
      if (!isMounted) return;
      try {
        const keyRecent = 'kua-recently-viewed';
        const recent = JSON.parse(localStorage.getItem(keyRecent) || '[]') as string[];
        const updated = [service.slug, ...recent.filter(s => s !== service.slug)].slice(0, 10);
        localStorage.setItem(keyRecent, JSON.stringify(updated));

        const keyBook = 'kua-bookmarks';
        const bookmarks = JSON.parse(localStorage.getItem(keyBook) || '[]') as string[];
        setIsBookmarked(bookmarks.includes(service.id));
      } catch { /* ignore */ }
    };
    initData();
    return () => {
      isMounted = false;
    };
  }, [service.id, service.slug]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('Link berhasil disalin!');
    }
  };

  const handleWhatsAppShare = () => {
    const url = window.location.href;
    const text = `*Informasi Layanan KUA Kecamatan Sampaga*\n\n*${service.title}*\n${service.description}\n\nLihat persyaratan lengkap di: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleToggleBookmark = () => {
    try {
      const key = 'kua-bookmarks';
      const bookmarks = JSON.parse(localStorage.getItem(key) || '[]') as string[];
      let updated: string[];
      if (bookmarks.includes(service.id)) {
        updated = bookmarks.filter(b => b !== service.id);
        setIsBookmarked(false);
      } else {
        updated = [...bookmarks, service.id];
        setIsBookmarked(true);
      }
      localStorage.setItem(key, JSON.stringify(updated));
    } catch { /* ignore */ }
  };

  const waDirectLink = `https://wa.me/62${settings.whatsapp.replace(/^0/, '')}?text=${encodeURIComponent(
    `Assalamu'alaikum, saya ingin bertanya mengenai persyaratan "${service.title}" di KUA Kecamatan Sampaga.`
  )}`;

  return (
    <div className="min-h-screen bg-[#F8FAF9] pb-16">
      {/* ===== HEADER BAR (HIDDEN ON PRINT) ===== */}
      <div className="bg-[#022C22] text-white pt-[70px] relative overflow-hidden print:hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#A7F3D0] mb-4 no-print">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <span>/</span>
            <Link href="/layanan" className="hover:text-white transition-colors">Layanan</Link>
            <span>/</span>
            <span className="text-white font-bold truncate max-w-[200px] sm:max-w-none">{service.title}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-4 py-1.5 text-xs font-bold bg-[#059669] text-white shadow-sm rounded-full mb-4">
                {service.category}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
                {service.title}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#D1FAE5] leading-relaxed max-w-3xl">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PRINT ONLY HEADER ===== */}
      <style type="text/css" className="print-only">
        {`@media print { @page { margin: 1.5cm; } }`}
      </style>
      <div className="hidden print:block print:pb-4 border-b border-black mb-4">
        <h1 className="text-xl font-bold font-heading uppercase text-black">KUA Kecamatan Sampaga Kabupaten Mamuju</h1>
        <p className="text-xs text-black mt-1">Jl. Sakinah No. 1 Bunde | WhatsApp: {settings.whatsapp}</p>
      </div>
        <h2 className="text-lg font-bold text-black mt-2 print:block hidden">{service.title}</h2>
        <p className="text-xs text-black mt-1 mb-4 print:block hidden">{service.description}</p>

      {/* ===== MAIN CONTAINER ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ============================================================ */}
          {/* LEFT COLUMN: MAIN CONTENT (70% - 8 Columns) */}
          {/* ============================================================ */}
          <div className="lg:col-span-8 space-y-8 print:space-y-4">

            {/* ACTION BAR */}
            <div className="flex flex-wrap items-center gap-2.5 bg-white p-3.5 rounded-xl border border-border-light shadow-sm no-print">
              <button
                onClick={handleWhatsAppShare}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Bagikan WA
              </button>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-surface-tertiary hover:bg-border-light text-text-primary rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Tersalin!' : 'Salin Link'}
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-surface-tertiary hover:bg-border-light text-text-primary rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4" />
                Cetak Persyaratan
              </button>
              <button
                onClick={handleToggleBookmark}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ml-auto ${
                  isBookmarked
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-surface-tertiary hover:bg-border-light text-text-primary'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
                {isBookmarked ? 'Tersimpan' : 'Simpan'}
              </button>
            </div>

            {/* DUMMY DATA NOTICE */}
            {service.isDummy && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 print:hidden">
                <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">Data Contoh / Simulasi</p>
                  <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                    Informasi ini merupakan simulasi data awal. Silakan konfirmasi ke KUA Kecamatan Sampaga untuk ketentuan terbaru.
                  </p>
                </div>
              </div>
            )}

            {/* ADDITIONAL DESCRIPTION */}
            {service.additionalDescription && (
              <div className="bg-white p-5 rounded-xl border border-border-light print:p-0 print:border-none">
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                  {service.additionalDescription}
                </p>
              </div>
            )}

            {/* SECTION 1: PERSYARATAN (REQUIREMENT CHECKLIST CARDS) */}
            {service.requirements.length > 0 && (
              <section className="space-y-4 print:space-y-1.5">
                <div className="flex items-center justify-between print:mb-1">
                  <h2 className="text-xl font-bold text-text-primary font-heading flex items-center gap-2 print:text-base print:text-black">
                    <FileText className="w-5 h-5 text-primary-medium print:hidden" />
                    Daftar Persyaratan
                  </h2>
                  <span className="text-xs font-medium text-text-tertiary print:text-[10px] print:text-black">
                    {service.requirements.filter(r => r.required).length} Wajib · {service.requirements.filter(r => !r.required).length} Opsional
                  </span>
                </div>

                <div className="space-y-3 print:space-y-1">
                  {service.requirements.map(req => (
                    <div
                      key={req.id}
                      className="bg-white p-4 rounded-xl border border-border-light shadow-sm hover:border-primary-medium/40 transition-all flex items-start gap-3.5 print:p-2 print:border-b print:border-x-0 print:border-t-0 print:rounded-none print:shadow-none print:gap-2"
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {req.required ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-text-tertiary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-text-primary font-heading print:text-xs print:text-black print:font-bold">
                            {req.title}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider print:border-none print:p-0 print:bg-transparent print:text-black print:before:content-['('] print:after:content-[')'] ${
                              req.required
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-surface-tertiary text-text-muted border border-border-light'
                            }`}
                          >
                            {req.required ? 'WAJIB' : 'OPSIONAL'}
                          </span>
                        </div>
                        {req.description && (
                          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                            {req.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 2: DOKUMEN YANG HARUS DIBAWA (VISUAL CHECKLIST GRID) */}
            {service.documentsToBring.length > 0 && (
              <section className="bg-gradient-to-br from-primary-soft to-white p-6 rounded-2xl border border-primary-light/60 space-y-4 print:p-0 print:border-none print:space-y-1.5 print:bg-none print:mt-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-medium print:hidden" />
                  <h2 className="text-lg font-bold text-text-primary font-heading print:text-base print:text-black">
                    Dokumen Fisik (Dibawa ke KUA)
                  </h2>
                </div>
                <p className="text-xs text-text-secondary print:hidden">
                  Pastikan dokumen asli dan fotokopi berikut sudah dimasukkan ke dalam map sebelum datang ke kantor KUA Sampaga:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {service.documentsToBring.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-white p-3 rounded-xl border border-border-light shadow-xs print:p-0 print:border-none print:shadow-none"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-xs font-bold print:hidden">
                        ✓
                      </div>
                      <span className="hidden print:inline-block text-black font-bold text-xs">-</span>
                      <span className="text-xs font-medium text-text-primary print:text-[11px] print:text-black">{doc}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 3: LANGKAH PENGURUSAN (VERTICAL TIMELINE STEPPER) */}
            {service.steps.length > 0 && (
              <section className="space-y-4 print:space-y-1.5 print:mt-4">
                <h2 className="text-xl font-bold text-text-primary font-heading print:text-base print:text-black">
                  Alur Prosedur
                </h2>
                <div className="bg-white p-6 rounded-2xl border border-border-light space-y-6 print:p-0 print:border-none print:space-y-1.5">
                  {service.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start relative print:gap-2">
                      {/* Step Number Circle */}
                      <div className="w-8 h-8 rounded-full bg-primary-medium text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm z-10 print:w-auto print:h-auto print:bg-transparent print:text-black print:shadow-none">
                        {String(idx + 1).padStart(2, '0')}.
                      </div>
                      {/* Vertical connector line */}
                      {idx < service.steps.length - 1 && (
                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-primary-light -ml-[1px] -mb-6 print:hidden" />
                      )}
                      <div className="pt-1 flex-1 print:pt-0">
                        <p className="text-sm font-medium text-text-primary leading-relaxed print:text-[11px] print:text-black">
                          {step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 4: CATATAN PENTING (SOFT ALERT CARDS) */}
            {service.notes.length > 0 && (
              <section className="space-y-3 print:space-y-0.5 print:mt-4">
                <h2 className="text-lg font-bold text-text-primary font-heading print:text-base print:text-black">
                  Catatan Penting
                </h2>
                {service.notes.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3 print:p-0 print:bg-transparent print:border-none"
                  >
                    <span className="hidden print:inline-block text-black font-bold text-xs">*</span>
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 print:hidden" />
                    <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium print:text-[11px] print:text-black">
                      {note}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {/* EXTERNAL REGISTRATION LINK (IF AVAILABLE) */}
            {service.externalLink && (
              <div className="p-6 bg-emerald-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                <div>
                  <h3 className="font-bold font-heading text-white text-base">Pendaftaran Online Tersedia</h3>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    Lakukan pendaftaran awal melalui portal resmi pemerintah.
                  </p>
                </div>
                <a
                  href={service.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-primary-dark font-bold text-xs rounded-xl transition-all shadow-md flex-shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                  Buka Portal Pendaftaran
                </a>
              </div>
            )}

          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: SIDEBAR SUMMARY (30% - 4 Columns) */}
          {/* ============================================================ */}
          <div className="lg:col-span-4 space-y-6">

            {/* SUMMARY CARD */}
            <div className="bg-white p-5 rounded-2xl border border-border-light shadow-sm sticky top-24 space-y-5 no-print">
              <h3 className="text-base font-bold text-text-primary font-heading border-b border-border-light pb-3">
                Ringkasan Layanan
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between text-text-secondary">
                  <span className="text-text-muted">Kategori</span>
                  <span className="font-semibold text-primary-700 bg-primary-soft px-2.5 py-0.5 rounded-full">
                    {service.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-text-secondary">
                  <span className="text-text-muted">Total Persyaratan</span>
                  <span className="font-bold text-text-primary">
                    {service.requirements.length} Dokumen
                  </span>
                </div>

                <div className="flex items-center justify-between text-text-secondary">
                  <span className="text-text-muted">Biaya Resmi</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {service.fee || 'Gratis / Sesuai Aturan'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-text-secondary">
                  <span className="text-text-muted">Waktu Pelayanan</span>
                  <span className="font-semibold text-text-primary">
                    {service.processingTime || 'Jam Kerja KUA'}
                  </span>
                </div>
              </div>

              <hr className="border-border-light" />

              {/* WHATSAPP DIRECT CTA */}
              <div className="space-y-2">
                <p className="text-[11px] text-text-muted text-center">
                  Ada pertanyaan seputar layanan ini?
                </p>
                <a
                  href={waDirectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Konsultasi via WhatsApp
                </a>
              </div>

              {/* DISCLAIMER BOX */}
              <div className="p-3.5 bg-surface-secondary rounded-xl border border-border-light text-[11px] text-text-muted leading-relaxed">
                <span className="font-semibold text-text-secondary block mb-1">📢 Himbauan KUA:</span>
                Pastikan dokumen fisik dibawa langsung ke kantor KUA Kecamatan Sampaga di <strong>Jl. Sakinah No. 1 Bunde</strong>.
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
