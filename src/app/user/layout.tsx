import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import NextTopLoader from 'nextjs-toploader';
import { getSettings } from '@/lib/data/settings';
import UserSessionProvider from './UserSessionProvider';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <UserSessionProvider>
      <NextTopLoader color="#059669" height={3} showSpinner={false} />
      <Navbar />
      <main className="flex-1 bg-surface-secondary min-h-[calc(100vh-64px)] pb-12">
        {children}
      </main>
      <Footer settings={settings} />
    </UserSessionProvider>
  );
}
