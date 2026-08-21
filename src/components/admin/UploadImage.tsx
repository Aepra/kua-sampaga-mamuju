'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, AlertCircle, Check, Crop } from 'lucide-react';
import type { UploadFolder } from '@/lib/storage';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';

interface UploadImageProps {
  value: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  prefix?: string;
  label?: string;
}

const ASPECT_RATIOS = [
  { label: 'Bebas', value: undefined },
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '1:1', value: 1 },
  { label: '3:4', value: 3 / 4 },
  { label: '9:16', value: 9 / 16 },
];

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

  // Crop states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format file tidak diizinkan. Gunakan JPG, PNG, atau WebP.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageSrc(reader.result?.toString() || null);
      setSelectedFile(file);
    });
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const uploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels || !selectedFile) return;

    try {
      setLoading(true);
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );

      if (!croppedImageBlob) {
        throw new Error('Gagal memotong gambar');
      }

      const formData = new FormData();
      formData.append('file', croppedImageBlob, selectedFile.name);
      if (prefix) formData.append('prefix', prefix);

      const res = await fetch(`/api/upload/${folder}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Gagal mengunggah file.');
      } else {
        onChange(data.data.path);
        setImageSrc(null); // Close crop modal
      }
    } catch (e) {
      console.error(e);
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

  const cancelCrop = () => {
    setImageSrc(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-primary dark:text-gray-100">
          {label}
        </label>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-2 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CROP MODAL */}
      {imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden">
            
            <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-gray-700">
              <h3 className="text-lg font-bold text-text-primary dark:text-gray-100 flex items-center gap-2">
                <Crop className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Potong Gambar
              </h3>
              <button
                type="button"
                onClick={cancelCrop}
                className="p-1 text-text-secondary dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:bg-red-900/30 rounded-lg transition-colors"
                disabled={loading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative w-full h-[50vh] sm:h-[60vh] bg-gray-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                rotation={rotation}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
              />
            </div>

            <div className="p-4 sm:p-6 bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                
                {/* Aspect Ratio Selector */}
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl border border-border-light dark:border-gray-700 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      type="button"
                      key={ratio.label}
                      onClick={() => setAspect(ratio.value)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
                        aspect === ratio.value
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'text-text-secondary dark:text-gray-400 hover:bg-surface-tertiary dark:bg-gray-700 hover:text-text-primary dark:text-gray-100'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>

                {/* Zoom Control */}
                <div className="flex items-center gap-3 w-full sm:w-64">
                  <span className="text-xs font-medium text-text-secondary dark:text-gray-400">Zoom</span>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 h-2 bg-border-light rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={cancelCrop}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-bold text-text-secondary dark:text-gray-400 bg-white dark:bg-gray-800 border border-border-medium hover:bg-surface-tertiary dark:bg-gray-700 hover:text-text-primary dark:text-gray-100 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={uploadCroppedImage}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memotong & Mengunggah...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Simpan & Unggah
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NORMAL UPLOAD VIEW */}
      {!imageSrc && (
        value ? (
          <div className="relative group inline-block rounded-xl overflow-hidden border border-border-light dark:border-gray-700 bg-surface-tertiary dark:bg-gray-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-auto h-auto max-w-[250px] max-h-[250px] object-contain"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white dark:bg-gray-800/90 hover:bg-white dark:bg-gray-800 text-text-primary dark:text-gray-100 rounded-lg text-xs font-medium transition-colors"
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
            className="w-full max-w-md border-2 border-dashed border-border-medium hover:border-primary-500 rounded-xl p-6 text-center cursor-pointer bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 hover:bg-primary-50 dark:bg-primary-900/30/30 transition-all group"
          >
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 group-hover:bg-primary-100 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-2 transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-text-primary dark:text-gray-100">
                Klik untuk memilih file
              </p>
              <p className="text-xs text-text-tertiary dark:text-gray-500 mt-1">
                JPG, PNG, atau WebP (Maks. 5 MB)
              </p>
            </div>
          </div>
        )
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


