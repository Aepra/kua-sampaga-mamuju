import Image from 'next/image';
import Link from 'next/link';
import { Landmark, Phone, MapPin } from 'lucide-react';
import { FacebookIcon, InstagramIcon, TikTokIcon, YoutubeIcon } from '@/components/ui/SocialIcons';

const footerNav = [
  { href: '/', label: 'Beranda' },
  { href: '/layanan', label: 'Layanan' },
  { href: '/informasi-dan-berita', label: 'Informasi & Berita' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/peraturan', label: 'Peraturan' },
  { href: '/tentang', label: 'Tentang' },
  { href: '/kontak', label: 'Kontak' },
];

const serviceLinks = [
  { href: '/layanan?kategori=Pernikahan', label: 'Pernikahan' },
  { href: '/layanan?kategori=Administrasi', label: 'Administrasi' },
  { href: '/layanan?kategori=Keluarga', label: 'Keluarga' },
  { href: '/layanan?kategori=Wakaf', label: 'Wakaf' },
  { href: '/layanan?kategori=Keagamaan', label: 'Keagamaan' },
  { href: '/layanan?kategori=Konsultasi', label: 'Konsultasi' },
];

interface FooterProps {
  settings?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    whatsapp?: string;
    address?: string;
  };
}

export default function Footer({ settings }: FooterProps) {
  const socialLinks = [
    ...(settings?.facebook ? [{ href: settings.facebook, label: 'Facebook', icon: <FacebookIcon className="w-5 h-5" /> }] : []),
    ...(settings?.instagram ? [{ href: settings.instagram, label: 'Instagram', icon: <InstagramIcon className="w-5 h-5" /> }] : []),
    ...(settings?.tiktok ? [{ href: settings.tiktok, label: 'TikTok', icon: <TikTokIcon className="w-5 h-5" /> }] : []),
    ...(settings?.youtube ? [{ href: settings.youtube, label: 'YouTube', icon: <YoutubeIcon className="w-5 h-5" /> }] : []),
  ];

  return (
    <footer className="bg-primary-950 text-white no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight font-heading">KUA Sampaga</p>
                <p className="text-[10px] text-primary-300 leading-tight">Kab. Mamuju</p>
              </div>
            </div>
            <p className="text-sm text-primary-200 leading-relaxed pr-4">
              Informasi layanan dan persyaratan KUA Kecamatan Sampaga Kabupaten Mamuju.
            </p>
          </div>

          {/* Navigation & Services Wrapper (Side-by-side on mobile) */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:col-span-4">
            {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold font-heading uppercase tracking-wider text-primary-300 mb-4">
              Navigasi
            </h3>
            <ul className="space-y-2">
              {footerNav.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-200 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold font-heading uppercase tracking-wider text-primary-300 mb-4">
              Layanan
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-200 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          </div>

          {/* Contact & Social */}
          <div className="lg:col-span-4">
            <h3 className="text-sm font-semibold font-heading uppercase tracking-wider text-primary-300 mb-4">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-primary-200">{settings?.address || 'Jl. Sakinah No. 1 Bunde'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a
                  href={`https://wa.me/62${(settings?.whatsapp || '08114169614').replace(/^0/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-200 hover:text-white transition-colors"
                >
                  {settings?.whatsapp || '08114169614'}
                </a>
              </li>
            </ul>

            {socialLinks.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-400 mb-3">Media Sosial</h4>
                <div className="flex gap-3">
                  {socialLinks.map(link => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-primary-800/50 hover:bg-primary-700 flex items-center justify-center text-primary-300 hover:text-white transition-all"
                      aria-label={link.label}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-primary-400">
            © {new Date().getFullYear()} KUA Kecamatan Sampaga Kabupaten Mamuju
          </p>
        </div>
      </div>
    </footer>
  );
}



