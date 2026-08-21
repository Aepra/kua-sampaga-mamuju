import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import { getSettings } from '@/lib/data/settings';
import NextTopLoader from 'nextjs-toploader';
import AuthProvider from '@/components/AuthProvider';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <AuthProvider>
      <NextTopLoader color="#059669" height={3} showSpinner={false} />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      {/* Diubah atas permintaan pengguna: Menghilangkan tombol WhatsApp melayang di pojok kanan bawah */}
    </AuthProvider>
  );
}

