'use client';

import { useState, useRef } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import type { UploadFolder } from '@/lib/storage';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface UploadImageProps {
  value: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  prefix?: string;
  label?: string;
}

export default function UploadImage({
  value,
  onChange,
  folder,
  prefix,
  label = 'Unggah Gambar',
}: UploadImageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Client side validation
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5 MB.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format file tidak diizinkan. Gunakan JPG, PNG, atau WebP.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (prefix) formData.append('prefix', prefix);

    try {
      const res = await fetch(`/api/upload/${folder}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Gagal mengunggah file.');
      } else {
        onChange(data.data.path);
      }
    } catch {
      setError('Terjadi kesalahan saat unggah.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveClick = () => {
    setShowConfirm(true);
  };

  const confirmRemove = () => {
    onChange('');
    setError('');
    setShowConfirm(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {value ? (
        <div className="relative group w-full max-w-md aspect-video rounded-xl overflow-hidden border border-border-light bg-surface-tertiary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white/90 hover:bg-white text-text-primary rounded-lg text-xs font-medium transition-colors"
            >
              Ganti Foto
            </button>
            <button
              type="button"
              onClick={handleRemoveClick}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-md border-2 border-dashed border-border-medium hover:border-primary-500 rounded-xl p-6 text-center cursor-pointer bg-surface-secondary hover:bg-primary-50/30 transition-all group"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs text-text-secondary font-medium">Mengunggah file...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-10 h-10 rounded-full bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center text-primary-600 mb-2 transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-text-primary">
                Klik untuk memilih file
              </p>
              <p className="text-xs text-text-tertiary mt-1">
                JPG, PNG, atau WebP (Maks. 5 MB)
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <ConfirmDialog
        isOpen={showConfirm}
        title="Hapus Gambar"
        message="Apakah Anda yakin ingin menghapus gambar ini? Gambar yang dihapus tidak dapat dikembalikan."
        onConfirm={confirmRemove}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
