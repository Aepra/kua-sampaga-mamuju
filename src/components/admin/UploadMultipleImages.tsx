'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, AlertCircle, Check, Crop, ImagePlus } from 'lucide-react';
import type { UploadFolder } from '@/lib/storage';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';

interface UploadMultipleImagesProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder: UploadFolder;
  prefix?: string;
  label?: string;
  maxImages?: number;
}

const ASPECT_RATIOS = [
  { label: 'Bebas', value: undefined },
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '1:1', value: 1 },
  { label: '3:4', value: 3 / 4 },
  { label: '9:16', value: 9 / 16 },
];

export default function UploadMultipleImages({
  value = [],
  onChange,
  folder,
  prefix,
  label = 'Tambahkan gambar / dokumentasi',
  maxImages = 2,
}: UploadMultipleImagesProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [imageToRemove, setImageToRemove] = useState<number | null>(null);
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

    if (value.length >= maxImages) {
      setError(`Maksimal ${maxImages} gambar yang diizinkan.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

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
      if (prefix) formData.append('prefix', `${prefix}-${value.length}`);

      const res = await fetch(`/api/upload/${folder}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Gagal mengunggah file.');
      } else {
        onChange([...value, data.data.path]);
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

  const handleRemoveClick = (index: number) => {
    setImageToRemove(index);
    setShowConfirm(true);
  };

  const confirmRemove = () => {
    if (imageToRemove !== null) {
      const newValues = [...value];
      newValues.splice(imageToRemove, 1);
      onChange(newValues);
    }
    setError('');
    setShowConfirm(false);
    setImageToRemove(null);
  };

  const cancelCrop = () => {
    setImageSrc(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-text-primary">
            {label} <span className="text-xs font-normal text-text-tertiary">({value.length}/{maxImages})</span>
          </label>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 shadow-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CROP MODAL */}
      {imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden">
            
            <div className="flex items-center justify-between p-4 border-b border-border-light bg-surface-secondary/50">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Crop className="w-5 h-5 text-primary-600" />
                Sesuaikan Gambar
              </h3>
              <button
                type="button"
                onClick={cancelCrop}
                className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-[50vh] sm:h-[60vh] bg-gray-950">
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

            <div className="p-4 sm:p-6 bg-surface-secondary flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                
                {/* Aspect Ratio Selector */}
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-border-light w-full sm:w-auto overflow-x-auto hide-scrollbar shadow-sm">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      type="button"
                      key={ratio.label}
                      onClick={() => setAspect(ratio.value)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                        aspect === ratio.value
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>

                {/* Zoom Control */}
                <div className="flex items-center gap-3 w-full sm:w-64 bg-white px-4 py-2 rounded-xl border border-border-light shadow-sm">
                  <span className="text-xs font-bold text-text-secondary">Zoom</span>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-border-light rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={cancelCrop}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-bold text-text-secondary bg-white border border-border-medium hover:bg-surface-tertiary hover:text-text-primary rounded-xl transition-all shadow-sm"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={uploadCroppedImage}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses...
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
        <div className="flex flex-wrap items-start gap-4">
          {value.map((url, idx) => (
            <div key={idx} className="relative group inline-block rounded-2xl overflow-hidden border-2 border-border-light bg-surface-tertiary shadow-sm hover:shadow-md transition-all">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Preview ${idx + 1}`}
                className="w-auto h-auto max-w-[200px] max-h-[200px] object-contain"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={() => handleRemoveClick(idx)}
                  className="w-10 h-10 flex items-center justify-center bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg transform scale-75 group-hover:scale-100 transition-all"
                  title="Hapus gambar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                Gambar {idx + 1}
              </div>
            </div>
          ))}

          {value.length < maxImages && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-[200px] h-[200px] border-2 border-dashed border-border-medium hover:border-primary-500 rounded-2xl p-4 text-center cursor-pointer bg-surface-secondary/50 hover:bg-primary-50/50 transition-all group flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-border-light group-hover:border-primary-200 group-hover:bg-primary-50 flex items-center justify-center text-primary-600 mb-3 transition-all group-hover:scale-110">
                <ImagePlus className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-text-primary group-hover:text-primary-700 transition-colors">
                Tambah Gambar
              </p>
              <p className="text-[11px] font-medium text-text-tertiary mt-1.5 px-4">
                Maksimal 5MB (JPG, PNG, WebP)
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
        message="Apakah Anda yakin ingin menghapus gambar ini? Gambar yang dihapus dari form tidak akan langsung terhapus dari server sampai Anda menyimpan form ini."
        onConfirm={confirmRemove}
        onCancel={() => {
          setShowConfirm(false);
          setImageToRemove(null);
        }}
      />
    </div>
  );
}
