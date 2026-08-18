'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Landmark, LogIn, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Login gagal.');
        setLoading(false);
        return;
      }

      // Redirect based on role
      if (data.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center mx-auto shadow-lg mb-4">
            <Landmark className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">Masuk</h1>
          <p className="text-sm text-text-secondary mt-1">KUA Kecamatan Sampaga</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border-light shadow-sm p-6 lg:p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@kuasampaga.test"
                required
                className="w-full px-4 py-2.5 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 focus:ring-0 outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 pr-10 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 focus:ring-0 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-lg transition-colors text-sm"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Masuk
              </>
            )}
          </button>
        </form>

        {/* Demo accounts */}
        <div className="mt-6 bg-white/60 rounded-xl border border-border-light p-4">
          <p className="text-xs font-medium text-text-tertiary mb-2">Akun Demo:</p>
          <div className="space-y-1 text-xs text-text-tertiary">
            <p>Admin: admin@kuasampaga.test / Admin123!</p>
            <p>User: user@kuasampaga.test / User123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
