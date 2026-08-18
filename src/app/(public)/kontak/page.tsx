import type { Metadata } from 'next';
import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { getSettings } from '@/lib/data/settings';
import { FacebookIcon, InstagramIcon, TikTokIcon, YoutubeIcon } from '@/components/ui/SocialIcons';

export const metadata: Metadata = {
  title: 'Kontak',
  description: 'Informasi kontak KUA Kecamatan Sampaga Kabupaten Mamuju.',
};

export const dynamic = 'force-dynamic';

export default async function KontakPage() {
  const s = await getSettings();
  const waLink = `https://wa.me/62${s.whatsapp.replace(/^0/, '')}?text=${encodeURIComponent("Assalamu'alaikum, saya ingin bertanya mengenai layanan KUA Kecamatan Sampaga.")}`;

  const socialLinks = [
    ...(s.facebook ? [{ href: s.facebook, label: 'Facebook', icon: <FacebookIcon className="w-5 h-5" /> }] : []),
    ...(s.instagram ? [{ href: s.instagram, label: 'Instagram', icon: <InstagramIcon className="w-5 h-5" /> }] : []),
    ...(s.tiktok ? [{ href: s.tiktok, label: 'TikTok', icon: <TikTokIcon className="w-5 h-5" /> }] : []),
    ...(s.youtube ? [{ href: s.youtube, label: 'YouTube', icon: <YoutubeIcon className="w-5 h-5" /> }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      <div className="bg-[#022C22] text-white pt-[70px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative z-10">
          <h1 className="text-2xl sm:text-4xl font-bold font-heading">Kontak</h1>
          <p className="mt-2 text-[#A7F3D0]">Hubungi KUA Kecamatan Sampaga.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-[24px] border border-[#E5EBE5] p-8 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ECFDF5] rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A2E1A] font-heading mb-6 relative z-10">Informasi Kontak</h2>
            <div className="space-y-6 relative z-10">
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[#F8FAF9] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] flex items-center justify-center flex-shrink-0 border border-[#D1FAE5]">
                  <MapPin className="w-6 h-6 text-[#059669]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1A2E1A] mb-1">Alamat</p>
                  <p className="text-sm text-[#4A5D4A] leading-relaxed">{s.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[#F8FAF9] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] flex items-center justify-center flex-shrink-0 border border-[#D1FAE5]">
                  <Phone className="w-6 h-6 text-[#059669]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1A2E1A] mb-1">WhatsApp</p>
                  <p className="text-sm text-[#4A5D4A] font-mono">{s.whatsapp}</p>
                </div>
              </div>
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl transition-all text-sm w-full justify-center shadow-md hover:shadow-lg hover:-translate-y-0.5 relative z-10"
            >
              <MessageCircle className="w-5 h-5" />
              Hubungi via WhatsApp
            </a>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-[24px] border border-[#E5EBE5] p-8 sm:p-10 shadow-sm relative overflow-hidden">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A2E1A] font-heading mb-6 relative z-10">Media Sosial</h2>
            <div className="space-y-4 relative z-10">
              {socialLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAF9] hover:bg-[#ECFDF5] border border-transparent hover:border-[#10B981] transition-all group shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E5EBE5] flex items-center justify-center text-[#059669] group-hover:text-[#047857] group-hover:scale-110 transition-transform shadow-xs">
                    {link.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A2E1A]">{link.label}</p>
                    <p className="text-xs text-[#6B7E6B] font-medium">@kua_sampaga</p>
                  </div>
                </a>
              ))}
              {socialLinks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-[#6B7E6B]">Belum ada media sosial yang ditambahkan.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-8 bg-white rounded-[24px] border border-[#E5EBE5] overflow-hidden shadow-sm">
          <div className="bg-[#F8FAF9] h-[300px] flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#E5EBE5 1px, transparent 1px), linear-gradient(90deg, #E5EBE5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="text-center relative z-10 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#E5EBE5] shadow-lg">
              <MapPin className="w-12 h-12 text-[#059669] mx-auto mb-3" />
              <p className="text-sm font-bold text-[#1A2E1A]">Lokasi KUA Kecamatan Sampaga</p>
              <p className="text-xs text-[#6B7E6B] mt-2 max-w-xs mx-auto leading-relaxed">{s.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
