import Image from 'next/image';
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession, SessionProvider } from 'next-auth/react';
import { Landmark, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

function InnerRegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Automatically redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated' && session) {
      const role = (session.user as any)?.role;
      if (role === 'admin' || role === 'super_admin') {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    }
  }, [status, session, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Terjadi kesalahan saat mendaftar.');
        setLoading(false);
        return;
      }

      showToast('Pendaftaran berhasil! Silakan masuk dengan akun Anda.', 'success');
      router.push('/login');
    } catch {
      setError('Terjadi kesalahan pada jaringan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    await signIn('google', { callbackUrl: '/user' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md my-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-lg mx-auto mb-4 border-2 border-white"><Image src="/logo/logo-kua.png" alt="Logo KUA" fill className="object-contain" /></div>
          <h1 className="text-2xl font-bold text-[#1A2E1A] dark:text-gray-100 font-heading">Daftar Akun</h1>
          <p className="text-sm text-[#4A5D4A] dark:text-gray-400 mt-1">KUA Kecamatan Sampaga</p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border-light dark:border-gray-700 shadow-sm p-6 lg:p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-lg text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:bg-gray-700 border border-border-light dark:border-gray-700 rounded-lg text-sm font-medium text-[#1A2E1A] dark:text-gray-100 transition-all shadow-sm hover:shadow disabled:opacity-60"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-primary-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {googleLoading ? 'Menghubungkan...' : 'Masuk / Daftar dengan Google'}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-light dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-gray-800 px-4 text-gray-400 dark:text-gray-500 font-medium">atau daftar dengan email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleRegister}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#1A2E1A] dark:text-gray-100 mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nama Anda"
                  required
                  className="w-full px-4 py-2.5 text-sm bg-[#F8FAF9] dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 focus:ring-0 outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1A2E1A] dark:text-gray-100 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  required
                  className="w-full px-4 py-2.5 text-sm bg-[#F8FAF9] dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 focus:ring-0 outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#1A2E1A] dark:text-gray-100 mb-1.5">
                  Password (minimal 6 karakter)
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full px-4 py-2.5 text-sm bg-[#F8FAF9] dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 focus:ring-0 outline-none transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-[#4A5D4A] dark:text-gray-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Daftar
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-400 dark:text-gray-500">
            Sudah punya akun?{' '}
            <button 
              onClick={() => router.push('/login')}
              className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:text-primary-400 transition-colors"
            >
              Masuk di sini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <SessionProvider>
      <InnerRegisterPage />
    </SessionProvider>
  );
}





