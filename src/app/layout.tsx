import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Layanan KUA Kecamatan Sampaga Kabupaten Mamuju',
    template: '%s | KUA Kecamatan Sampaga',
  },
  description: 'Informasi layanan, persyaratan, dokumen, dan panduan pengurusan KUA Kecamatan Sampaga Kabupaten Mamuju.',
  openGraph: {
    title: 'Layanan KUA Kecamatan Sampaga Kabupaten Mamuju',
    description: 'Informasi layanan, persyaratan, dokumen, dan panduan pengurusan KUA Kecamatan Sampaga Kabupaten Mamuju.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'KUA Kecamatan Sampaga',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`} data-scroll-behavior="smooth">
      <body suppressHydrationWarning className={`${inter.className} min-h-screen flex flex-col antialiased bg-white dark:bg-gray-950 text-[#1A2E1A] dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>
          {children}
        </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}



