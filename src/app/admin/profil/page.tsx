'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';
import UploadImage from '@/components/admin/UploadImage';
import { useToast } from '@/components/ui/Toast';
import FullScreenLoader from '@/components/ui/FullScreenLoader';

export default function AdminProfilPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState<SiteSettings>({
    name: '',
    head: '',
    nip: '',
    address: '',
    whatsapp: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    description: '',
    vision: '',
    mission: [],
    officeImage: '',
    headImage: '',
    officeHours: '',
  });

  const [missionText, setMissionText] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.data);
          setMissionText(data.data.mission?.join('\n') || '');
        }
      })
      .catch(() => showToast('Gagal memuat pengaturan.', 'error'))
      .finally(() => setLoading(false));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (key: keyof SiteSettings, value: string | string[]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...settings,
      mission: missionText.split('\n').map(m => m.trim()).filter(Boolean),
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        showToast('Profil KUA berhasil diperbarui.', 'success');
      } else {
        showToast(data.error || 'Gagal memperbarui profil KUA.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-text-secondary">Memuat profil KUA...</div>;
  }

  return (
    <>
      <FullScreenLoader isLoading={saving} message="Menyimpan profil..." />
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-light pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">Profil & Informasi KUA</h1>
          <p className="text-sm text-text-secondary mt-1">
            Kelola data resmi, kontak, media sosial, dan visi misi KUA.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {/* Data Resmi */}
      <div className="bg-white rounded-xl border border-border-light p-6 space-y-4">
        <h2 className="text-base font-bold text-text-primary font-heading">Data Resmi KUA</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-1">Nama Lembaga</label>
            <input
              type="text"
              value={settings.name}
              onChange={e => handleChange('name', e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Nama Kepala KUA</label>
            <input
              type="text"
              value={settings.head}
              onChange={e => handleChange('head', e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">NIP Kepala KUA</label>
            <input
              type="text"
              value={settings.nip}
              onChange={e => handleChange('nip', e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-1">Alamat Kantor</label>
            <input
              type="text"
              value={settings.address}
              onChange={e => handleChange('address', e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-1">Deskripsi Singkat</label>
            <textarea
              rows={3}
              value={settings.description}
              onChange={e => handleChange('description', e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Kontak & Medsos */}
      <div className="bg-white rounded-xl border border-border-light p-6 space-y-4">
        <h2 className="text-base font-bold text-text-primary font-heading">Kontak & Media Sosial</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Nomor WhatsApp</label>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={e => handleChange('whatsapp', e.target.value)}
              placeholder="08114169614"
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Facebook URL</label>
            <input
              type="url"
              value={settings.facebook}
              onChange={e => handleChange('facebook', e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Instagram URL</label>
            <input
              type="url"
              value={settings.instagram}
              onChange={e => handleChange('instagram', e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">TikTok URL</label>
            <input
              type="url"
              value={settings.tiktok}
              onChange={e => handleChange('tiktok', e.target.value)}
              placeholder="https://tiktok.com/@..."
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">YouTube URL</label>
            <input
              type="url"
              value={settings.youtube}
              onChange={e => handleChange('youtube', e.target.value)}
              placeholder="https://youtube.com/@..."
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Visi & Misi */}
      <div className="bg-white rounded-xl border border-border-light p-6 space-y-4">
        <h2 className="text-base font-bold text-text-primary font-heading">Visi & Misi</h2>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Visi</label>
          <textarea
            rows={2}
            value={settings.vision}
            onChange={e => handleChange('vision', e.target.value)}
            placeholder="Visi KUA Kecamatan Sampaga..."
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Misi (Pisahkan per baris baru)
          </label>
          <textarea
            rows={4}
            value={missionText}
            onChange={e => setMissionText(e.target.value)}
            placeholder="1. Misi pertama&#10;2. Misi kedua..."
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Jam Pelayanan</label>
          <textarea
            rows={3}
            value={settings.officeHours}
            onChange={e => handleChange('officeHours', e.target.value)}
            placeholder="Senin - Kamis: 08.00 - 16.00 WITA&#10;Jumat: 08.00 - 16.30 WITA"
            className="w-full px-3.5 py-2 text-sm bg-surface-secondary border border-border-light rounded-lg focus:border-primary-500 outline-none"
          />
        </div>
      </div>

      {/* Foto Kantor & Kepala KUA */}
      <div className="bg-white rounded-xl border border-border-light p-6 space-y-4">
        <h2 className="text-base font-bold text-text-primary font-heading">Gambar Profil KUA</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <UploadImage
            value={settings.officeImage}
            onChange={url => handleChange('officeImage', url)}
            folder="profile"
            prefix="kantor-kua"
            label="Foto Kantor KUA"
          />

          <UploadImage
            value={settings.headImage}
            onChange={url => handleChange('headImage', url)}
            folder="profile"
            prefix="kepala-kua"
            label="Foto Kepala KUA"
          />
        </div>
        </div>
      </form>
    </>
  );
}
