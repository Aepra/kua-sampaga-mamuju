import type { Metadata } from 'next';
import { Scale, ExternalLink, FileText, Download } from 'lucide-react';
import { getPublishedRegulations } from '@/lib/data/regulations';
import EmptyState from '@/components/ui/StateDisplay';

export const metadata: Metadata = {
  title: 'Peraturan & Regulasi',
  description: 'Daftar peraturan dan regulasi resmi KUA Kecamatan Sampaga Kabupaten Mamuju.',
};

export const dynamic = 'force-dynamic';

export default async function PeraturanPublicPage() {
  const regulations = await getPublishedRegulations();

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      {/* Header Banner */}
      <div className="bg-[#022C22] text-white pt-[70px] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
          <div className="flex items-center gap-3 text-emerald-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
            <Scale className="w-4 h-4" />
            Regulasi Resmi
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-heading text-white">
            Peraturan & Regulasi KUA
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100/80 max-w-2xl">
            Dasar hukum, keputusan menteri, dan undang-undang yang menjadi acuan pelayanan di KUA Kecamatan Sampaga.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {regulations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {regulations.map((reg) => (
              <div
                key={reg.id}
                className="bg-white rounded-xl border border-border-light p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    {(reg.number || reg.year) && (
                      <span className="text-[11px] font-mono font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        {[reg.number, reg.year].filter(Boolean).join(' · ')}
                      </span>
                    )}
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-text-primary font-heading group-hover:text-emerald-700 transition-colors">
                    {reg.title}
                  </h2>

                  {reg.description && (
                    <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {reg.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-border-light flex items-center justify-between">
                  <span className="text-[11px] text-text-tertiary">
                    Diperbarui {new Date(reg.updatedAt || reg.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>

                  {reg.documentLink ? (
                    <a
                      href={reg.documentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh PDF
                    </a>
                  ) : (
                    <span className="text-xs text-text-tertiary italic">Dokumen fisik di kantor</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Scale className="w-8 h-8 text-emerald-600" />}
            title="Belum ada Peraturan"
            description="Daftar peraturan dan regulasi resmi belum ditambahkan."
          />
        )}
      </div>
    </div>
  );
}
