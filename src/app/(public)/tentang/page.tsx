import type { Metadata } from 'next';
import { Landmark, Users, MapPin, Phone, Clock } from 'lucide-react';
import { getSettings } from '@/lib/data/settings';

export const metadata: Metadata = {
  title: 'Tentang',
  description: 'Profil KUA Kecamatan Sampaga Kabupaten Mamuju.',
};

export const revalidate = 60;

export default async function TentangPage() {
  const s = await getSettings();

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-gray-900">
      <div className="bg-[#022C22] dark:bg-gray-950 text-white pt-[70px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative z-10">
          <h1 className="text-2xl sm:text-4xl font-bold font-heading">Tentang KUA</h1>
          <p className="mt-2 text-[#A7F3D0]">Profil KUA Kecamatan Sampaga Kabupaten Mamuju.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile card */}
        <div className="bg-white dark:bg-gray-800 rounded-[32px] border border-[#E5EBE5] dark:border-gray-700 overflow-hidden mb-10 shadow-sm">
          <div className="bg-gradient-to-r from-[#ECFDF5] to-[#D1FAE5] dark:from-gray-800 dark:to-gray-700 p-8 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #059669 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            {s.officeImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.officeImage} alt="Kantor KUA" className="max-h-[300px] object-contain rounded-2xl relative z-10 shadow-lg border border-white/50" />
            ) : (
              <div className="text-center relative z-10 py-10">
                <div className="relative w-28 h-28 mx-auto mb-6 drop-shadow-md"><Image src="/logo/logo-kua.png" alt="Logo KUA" fill className="object-contain" /></div>
                <p className="text-sm font-bold text-[#047857] dark:text-emerald-400 uppercase tracking-widest">KUA Kecamatan Sampaga</p>
              </div>
            )}
          </div>
          <div className="p-8 lg:p-12">
            <span className="text-[11px] sm:text-xs font-bold text-[#059669] dark:text-emerald-400 uppercase tracking-[0.15em] bg-[#ECFDF5] dark:bg-gray-800 px-4 py-1.5 rounded-full border border-[#D1FAE5] inline-block mb-4 shadow-sm">
              Profil Institusi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A2E1A] dark:text-gray-100 font-heading">{s.name}</h2>
            <p className="mt-4 text-[#4A5D4A] dark:text-gray-300 leading-relaxed text-base sm:text-lg">{s.description}</p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-center gap-4 p-5 bg-[#F8FAF9] dark:bg-gray-900 rounded-2xl border border-[#E5EBE5] dark:border-gray-700 hover:border-[#10B981] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-[#059669] dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#6B7E6B] dark:text-gray-400 mb-1">Kepala KUA</p>
                  <p className="text-sm font-bold text-[#1A2E1A] dark:text-gray-100">{s.head}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-[#F8FAF9] dark:bg-gray-900 rounded-2xl border border-[#E5EBE5] dark:border-gray-700 hover:border-[#10B981] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-[#059669] dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#6B7E6B] dark:text-gray-400 mb-1">NIP</p>
                  <p className="text-sm font-bold text-[#1A2E1A] dark:text-gray-100 font-mono">{s.nip}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-[#F8FAF9] dark:bg-gray-900 rounded-2xl border border-[#E5EBE5] dark:border-gray-700 hover:border-[#10B981] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#059669] dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#6B7E6B] dark:text-gray-400 mb-1">Alamat</p>
                  <p className="text-sm font-bold text-[#1A2E1A] dark:text-gray-100">{s.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-[#F8FAF9] dark:bg-gray-900 rounded-2xl border border-[#E5EBE5] dark:border-gray-700 hover:border-[#10B981] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#059669] dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#6B7E6B] dark:text-gray-400 mb-1">WhatsApp</p>
                  <p className="text-sm font-bold text-[#1A2E1A] dark:text-gray-100">{s.whatsapp}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-[24px] border border-[#E5EBE5] dark:border-gray-700 p-8 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ECFDF5] dark:bg-gray-800 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A2E1A] dark:text-gray-100 font-heading mb-4 relative z-10 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#10B981] rounded-full block"></span>
              Visi
            </h3>
            <p className="text-base text-[#4A5D4A] dark:text-gray-300 leading-relaxed relative z-10">
              {s.vision || 'Informasi belum tersedia.'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-[24px] border border-[#E5EBE5] dark:border-gray-700 p-8 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F0FDF4] dark:bg-gray-800 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A2E1A] dark:text-gray-100 font-heading mb-4 relative z-10 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#059669] rounded-full block"></span>
              Misi
            </h3>
            {s.mission && s.mission.length > 0 ? (
              <ol className="space-y-3 relative z-10">
                {s.mission.map((m, i) => (
                  <li key={i} className="text-base text-[#4A5D4A] dark:text-gray-300 flex items-start gap-3">
                    <span className="font-bold text-[#059669] dark:text-emerald-400 bg-[#ECFDF5] dark:bg-gray-800 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs">{i + 1}</span>
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-base text-[#4A5D4A] dark:text-gray-300 relative z-10">Informasi belum tersedia.</p>
            )}
          </div>
        </div>

        {s.officeHours && (
          <div className="mt-10 bg-gradient-to-br from-[#064E3B] to-[#022C22] text-white rounded-[24px] shadow-xl p-8 sm:p-12 relative overflow-hidden border border-[#047857]/50">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
              <div className="w-20 h-20 bg-white dark:bg-gray-800/10 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/20">
                <Clock className="w-10 h-10 text-[#A7F3D0]" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-extrabold font-heading mb-2">Jam Pelayanan</h3>
                <p className="text-[#D1FAE5] whitespace-pre-line leading-relaxed text-sm sm:text-base">{s.officeHours}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



