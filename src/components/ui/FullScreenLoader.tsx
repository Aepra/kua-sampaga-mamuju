'use client';

import { Loader2 } from 'lucide-react';

interface FullScreenLoaderProps {
  isLoading: boolean;
  message?: string;
}

export default function FullScreenLoader({ isLoading, message = 'Sedang memproses...' }: FullScreenLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 max-w-sm mx-4">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="text-sm font-medium text-text-primary text-center">
          {message}
        </p>
      </div>
    </div>
  );
}
