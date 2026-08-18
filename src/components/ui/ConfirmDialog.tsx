'use client';

import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Hapus',
  cancelLabel = 'Batal',
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full animate-scale-in">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-full ${variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'}`}>
              <AlertTriangle className={`w-6 h-6 ${variant === 'danger' ? 'text-red-600' : 'text-amber-600'}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{message}</p>
            </div>
            <button onClick={onCancel} className="text-text-tertiary hover:text-text-primary" aria-label="Tutup">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface-tertiary rounded-lg hover:bg-border-light transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
