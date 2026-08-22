'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, Save, Undo2, Redo2 } from 'lucide-react';
import type { Service, Requirement } from '@/lib/types';
import { SERVICE_CATEGORIES } from '@/lib/types';
import UploadImage from '@/components/admin/UploadImage';
import { useToast } from '@/components/ui/Toast';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { useFormHistory } from '@/hooks/useFormHistory';

interface ServiceFormProps {
  initialData?: Service;
}

export default function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [category, setCategory] = useState(initialData?.category || 'Pernikahan');
  const [icon, setIcon] = useState(initialData?.icon || 'FileText');
  const [image, setImage] = useState(initialData?.image || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [additionalDescription, setAdditionalDescription] = useState(initialData?.additionalDescription || '');
  const [fee, setFee] = useState(initialData?.fee || '');
  const [processingTime, setProcessingTime] = useState(initialData?.processingTime || '');
  const [externalLink, setExternalLink] = useState(initialData?.externalLink || '');
  const [published, setPublished] = useState(initialData?.published ?? true);

  // Dynamic arrays
  const [requirements, setRequirements] = useState<Requirement[]>(
    initialData?.requirements || []
  );
  const [documentsToBring, setDocumentsToBring] = useState<string[]>(
    initialData?.documentsToBring || []
  );
  const [steps, setSteps] = useState<string[]>(
    initialData?.steps || []
  );
  const [notes, setNotes] = useState<string[]>(
    initialData?.notes || []
  );
  const [keywords, setKeywords] = useState<string>(
    initialData?.keywords?.join(', ') || ''
  );

  // Form history for Undo/Redo
  const { undo, redo, canUndo, canRedo, isDirty, markSaved } = useFormHistory(
    {
      title, slug, category, icon, image, description,
      additionalDescription, fee, processingTime, externalLink,
      published, requirements, documentsToBring, steps, notes, keywords
    },
    (state) => {
      setTitle(state.title);
      setSlug(state.slug);
      setCategory(state.category);
      setIcon(state.icon);
      setImage(state.image);
      setDescription(state.description);
      setAdditionalDescription(state.additionalDescription);
      setFee(state.fee);
      setProcessingTime(state.processingTime);
      setExternalLink(state.externalLink);
      setPublished(state.published);
      setRequirements(state.requirements);
      setDocumentsToBring(state.documentsToBring);
      setSteps(state.steps);
      setNotes(state.notes);
      setKeywords(state.keywords);
    }
  );

  // Auto generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
      );
    }
  };

  // Requirement Handlers
  const addRequirement = () => {
    setRequirements(prev => [
      ...prev,
      {
        id: `req-${Date.now()}`,
        title: '',
        description: '',
        required: true,
      },
    ]);
  };

  const updateRequirement = (id: string, key: keyof Requirement, value: string | boolean) => {
    setRequirements(prev =>
      prev.map(r => (r.id === id ? { ...r, [key]: value } : r))
    );
  };

  const removeRequirement = (id: string) => {
    setRequirements(prev => prev.filter(r => r.id !== id));
  };

  // Generic List Handlers
  const addListItem = (setFn: React.Dispatch<React.SetStateAction<string[]>>) => {
    setFn(prev => [...prev, '']);
  };

  const updateListItem = (
    setFn: React.Dispatch<React.SetStateAction<string[]>>,
    idx: number,
    val: string
  ) => {
    setFn(prev => prev.map((item, i) => (i === idx ? val : item)));
  };

  const removeListItem = (
    setFn: React.Dispatch<React.SetStateAction<string[]>>,
    idx: number
  ) => {
    setFn(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      showToast('Judul dan slug wajib diisi.', 'error');
      return;
    }

    setLoading(true);

    const payload = {
      title,
      slug,
      category,
      icon,
      image,
      description,
      additionalDescription,
      requirements: requirements.filter(r => r.title.trim()),
      documentsToBring: documentsToBring.filter(d => d.trim()),
      steps: steps.filter(s => s.trim()),
      notes: notes.filter(n => n.trim()),
      fee: fee.trim() || null,
      processingTime: processingTime.trim() || null,
      externalLink: externalLink.trim() || null,
      keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
      published,
    };

    try {
      const url = initialData ? `/api/services/${initialData.id}` : '/api/services';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        showToast(`Layanan berhasil ${initialData ? 'diperbarui' : 'ditambahkan'}.`, 'success');
        if (!initialData && data.data?.id) {
          router.replace(`/admin/layanan/${data.data.id}/edit`);
        } else {
          markSaved({
            title, slug, category, icon, image, description,
            additionalDescription, fee, processingTime, externalLink,
            published, requirements, documentsToBring, steps, notes, keywords
          });
          router.refresh();
        }
      } else {
        showToast(data.error || 'Gagal menyimpan layanan.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FullScreenLoader isLoading={loading} message={initialData ? 'Memperbarui layanan...' : 'Menambahkan layanan...'} />
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-12">
        {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-light dark:border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/layanan')}
            className="p-2 text-text-secondary dark:text-gray-400 hover:text-text-primary dark:text-gray-100 hover:bg-surface-tertiary dark:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary dark:text-gray-100 font-heading">
              {initialData ? 'Edit Layanan' : 'Tambah Layanan Baru'}
            </h1>
            <p className="text-xs text-text-tertiary dark:text-gray-500">
              Lengkapi formulir di bawah ini untuk mengelola data layanan.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1 mr-2 border-r border-border-medium dark:border-gray-600 pr-3">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="p-2 text-text-secondary dark:text-gray-400 hover:text-text-primary dark:text-gray-100 hover:bg-surface-tertiary dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              title="Undo"
            >
              <Undo2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="p-2 text-text-secondary dark:text-gray-400 hover:text-text-primary dark:text-gray-100 hover:bg-surface-tertiary dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              title="Redo"
            >
              <Redo2 className="w-5 h-5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => router.push('/admin/layanan')}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-text-secondary dark:text-gray-400 bg-surface-tertiary dark:bg-gray-700 rounded-lg hover:bg-border-light dark:hover:bg-gray-600"
          >
            Kembali
          </button>
          <button
            type="submit"
            disabled={loading || !isDirty}
            className={`flex-1 sm:flex-none justify-center inline-flex items-center gap-2 px-5 py-2 text-white rounded-lg text-sm font-medium transition-colors ${
              !isDirty
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400'
            }`}
          >
            <Save className="w-4 h-4" />
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 p-6 space-y-6">
        <h2 className="text-base font-bold text-text-primary dark:text-gray-100 font-heading">Informasi Utama</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
              Judul Layanan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Contoh: Pendaftaran Nikah"
              required
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="pendaftaran-nikah"
              required
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
            >
              {SERVICE_CATEGORIES.filter(c => c !== 'Semua').map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
              Icon Layanan
            </label>
            <select
              value={icon}
              onChange={e => setIcon(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
            >
              <option value="Heart">Heart (Pernikahan)</option>
              <option value="Globe">Globe (Online)</option>
              <option value="FileText">FileText (Dokumen)</option>
              <option value="FileEdit">FileEdit (Perubahan)</option>
              <option value="UserCog">UserCog (Nama/Data)</option>
              <option value="ScrollText">ScrollText (Pengantar)</option>
              <option value="Landmark">Landmark (Wakaf)</option>
              <option value="Users">Users (Konsultasi)</option>
              <option value="BookHeart">BookHeart (Bimbingan)</option>
              <option value="HeartHandshake">HeartHandshake (Rujuk)</option>
              <option value="BadgeCheck">BadgeCheck (Legalisasi)</option>
              <option value="BookOpen">BookOpen (Keagamaan)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
            Deskripsi Ringkas <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Ringkasan singkat layanan untuk kartu layanan dan search..."
            required
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
            Deskripsi Tambahan / Pengantar Detail
          </label>
          <textarea
            rows={3}
            value={additionalDescription}
            onChange={e => setAdditionalDescription(e.target.value)}
            placeholder="Penjelasan lebih rinci mengenai layanan ini..."
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <UploadImage
          value={image}
          onChange={setImage}
          folder="services"
          prefix={slug || 'service'}
          label="Gambar Header Layanan (Opsional)"
        />
      </div>

      {/* Persyaratan (Dynamic) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-text-primary dark:text-gray-100 font-heading">Persyaratan Layanan</h2>
          <button
            type="button"
            onClick={addRequirement}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Syarat
          </button>
        </div>

        {requirements.length > 0 ? (
          <div className="space-y-3">
            {requirements.map((req, idx) => (
              <div key={req.id} className="p-4 bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl border border-border-light dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-text-tertiary dark:text-gray-500">Syarat #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(req.id)}
                    className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={req.title}
                      onChange={e => updateRequirement(req.id, 'title', e.target.value)}
                      placeholder="Nama Dokumen / Syarat (cth: KTP)"
                      className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-xs text-text-primary dark:text-gray-100 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={req.required}
                        onChange={e => updateRequirement(req.id, 'required', e.target.checked)}
                        className="rounded border-border-medium text-primary-600 dark:text-primary-400 focus:ring-primary-500"
                      />
                      Syarat Wajib
                    </label>
                  </div>
                </div>
                <input
                  type="text"
                  value={req.description}
                  onChange={e => updateRequirement(req.id, 'description', e.target.value)}
                  placeholder="Keterangan tambahan (cth: KTP asli dan fotokopi)"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-tertiary dark:text-gray-500 italic">Belum ada persyaratan. Klik tombol di atas untuk menambah.</p>
        )}
      </div>

      {/* Dokumen yang perlu dibawa */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-text-primary dark:text-gray-100 font-heading">Dokumen yang Harus Dibawa</h2>
          <button
            type="button"
            onClick={() => addListItem(setDocumentsToBring)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Dokumen
          </button>
        </div>

        {documentsToBring.length > 0 ? (
          <div className="space-y-2">
            {documentsToBring.map((doc, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={doc}
                  onChange={e => updateListItem(setDocumentsToBring, idx, e.target.value)}
                  placeholder="Contoh: KTP asli dan fotokopi"
                  className="flex-1 px-3 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeListItem(setDocumentsToBring, idx)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:bg-red-900/30 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-tertiary dark:text-gray-500 italic">Belum ada dokumen yang dimasukkan.</p>
        )}
      </div>

      {/* Langkah Pengurusan Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-text-primary dark:text-gray-100 font-heading">Langkah Pengurusan (Alur)</h2>
          <button
            type="button"
            onClick={() => addListItem(setSteps)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Langkah
          </button>
        </div>

        {steps.length > 0 ? (
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-800 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={step}
                  onChange={e => updateListItem(setSteps, idx, e.target.value)}
                  placeholder="Contoh: Siapkan dokumen persyaratan"
                  className="flex-1 px-3 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeListItem(setSteps, idx)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:bg-red-900/30 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-tertiary dark:text-gray-500 italic">Belum ada langkah pengurusan.</p>
        )}
      </div>

      {/* Catatan Penting */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-text-primary dark:text-gray-100 font-heading">Catatan Penting</h2>
          <button
            type="button"
            onClick={() => addListItem(setNotes)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Catatan
          </button>
        </div>

        {notes.length > 0 ? (
          <div className="space-y-2">
            {notes.map((note, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={note}
                  onChange={e => updateListItem(setNotes, idx, e.target.value)}
                  placeholder="Contoh: Pastikan data pada KTP dan KK sesuai."
                  className="flex-1 px-3 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeListItem(setNotes, idx)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:bg-red-900/30 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-tertiary dark:text-gray-500 italic">Belum ada catatan penting.</p>
        )}
      </div>

      {/* Additional Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-base font-bold text-text-primary dark:text-gray-100 font-heading">Pengaturan Tambahan</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">Biaya Pelayanan</label>
            <input
              type="text"
              value={fee}
              onChange={e => setFee(e.target.value)}
              placeholder="cth: Gratis / Sesuai ketentuan"
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">Waktu Pelayanan</label>
            <input
              type="text"
              value={processingTime}
              onChange={e => setProcessingTime(e.target.value)}
              placeholder="cth: 10 hari kerja"
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
            Link Eksternal Pendaftaran (Opsional)
          </label>
          <input
            type="url"
            value={externalLink}
            onChange={e => setExternalLink(e.target.value)}
            placeholder="https://simkah4.kemenag.go.id"
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-1">
            Kata Kunci Pencarian (Pisahkan dengan koma)
          </label>
          <input
            type="text"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            placeholder="nikah, pendaftaran, perkawinan, kawin"
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary dark:bg-gray-900 text-text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-border-light dark:border-gray-700 rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={e => setPublished(e.target.checked)}
              className="rounded border-border-medium text-primary-600 dark:text-primary-400 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-text-primary dark:text-gray-100">Dipublikasikan di website publik</span>
          </label>
        </div>
        </div>
      </form>
    </>
  );
}


