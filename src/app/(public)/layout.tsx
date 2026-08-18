import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import { getSettings } from '@/lib/data/settings';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      {/* Diubah atas permintaan pengguna: Menghilangkan tombol WhatsApp melayang di pojok kanan bawah */}
    </>
  );
}
