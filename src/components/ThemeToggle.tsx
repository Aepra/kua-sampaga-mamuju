'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-xl" />; // Placeholder to avoid layout shift
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 shadow-sm hover:shadow-md"
      aria-label="Toggle Theme"
      title={isDark ? 'Ganti ke Tema Terang' : 'Ganti ke Tema Gelap'}
    >
      <Sun 
        className={`absolute w-5 h-5 transition-all duration-500 ease-in-out ${
          isDark ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'
        }`} 
      />
      <Moon 
        className={`absolute w-5 h-5 transition-all duration-500 ease-in-out ${
          isDark ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'
        }`} 
      />
    </button>
  );
}
