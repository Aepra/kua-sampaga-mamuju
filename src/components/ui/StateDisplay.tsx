import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'Belum ada data',
  description = 'Data belum tersedia saat ini.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-tertiary flex items-center justify-center mb-4">
        {icon || <FileQuestion className="w-8 h-8 text-text-tertiary" />}
      </div>
      <h3 className="text-lg font-semibold text-text-primary font-heading">{title}</h3>
      <p className="mt-1 text-sm text-text-secondary max-w-sm">{description}</p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="space-y-4 py-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-surface-tertiary rounded-xl p-6">
            <div className="h-4 bg-border-light rounded w-1/3 mb-3" />
            <div className="h-3 bg-border-light rounded w-2/3 mb-2" />
            <div className="h-3 bg-border-light rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-surface-tertiary rounded-xl overflow-hidden">
            <div className="h-48 bg-border-light" />
            <div className="p-4">
              <div className="h-4 bg-border-light rounded w-2/3 mb-2" />
              <div className="h-3 bg-border-light rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message = 'Terjadi kesalahan. Silakan coba lagi.' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary font-heading">Terjadi Kesalahan</h3>
      <p className="mt-1 text-sm text-text-secondary max-w-sm">{message}</p>
    </div>
  );
}
