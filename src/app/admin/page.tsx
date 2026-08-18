import Link from 'next/link';
import {
  FileText, BookOpen, Image as ImageIcon, Scale, Users,
  Plus, ArrowRight, Clock, Activity
} from 'lucide-react';
import { getServiceCount, getRecentServices } from '@/lib/data/services';
import { getInformationCount, getRecentInformation } from '@/lib/data/information';
import { getGalleryCount, getRecentGallery } from '@/lib/data/gallery';
import { getRegulationCount } from '@/lib/data/regulations';
import { getUserCount } from '@/lib/data/users';
import { getRecentLogs } from '@/lib/data/activity-logs';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    serviceCount,
    infoCount,
    galleryCount,
    regCount,
    userCount,
    recentServices,
    , // recentInfo
    , // recentGallery
    recentLogs,
  ] = await Promise.all([
    getServiceCount(),
    getInformationCount(),
    getGalleryCount(),
    getRegulationCount(),
    getUserCount(),
    getRecentServices(5),
    getRecentInformation(3),
    getRecentGallery(4),
    getRecentLogs(5),
  ]);

  const stats = [
    { label: 'Total Layanan', value: serviceCount, icon: FileText, color: 'bg-blue-50 text-blue-600', href: '/admin/layanan' },
    { label: 'Total Informasi', value: infoCount, icon: BookOpen, color: 'bg-amber-50 text-amber-600', href: '/admin/informasi' },
    { label: 'Total Galeri', value: galleryCount, icon: ImageIcon, color: 'bg-emerald-50 text-emerald-600', href: '/admin/galeri' },
    { label: 'Total Peraturan', value: regCount, icon: Scale, color: 'bg-purple-50 text-purple-600', href: '/admin/peraturan' },
    { label: 'Total Pengguna', value: userCount, icon: Users, color: 'bg-pink-50 text-pink-600', href: '/admin/pengaturan' },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary font-heading">Dashboard Admin</h1>
        <p className="text-sm text-text-secondary mt-1">
          Ringkasan data dan aktivitas pengelolaan website KUA Kecamatan Sampaga.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link
              key={i}
              href={stat.href}
              className="bg-white rounded-xl border border-border-light p-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-text-primary font-heading">{stat.value}</span>
              </div>
              <p className="mt-3 text-xs font-medium text-text-secondary group-hover:text-primary-700 transition-colors">
                {stat.label}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-border-light p-5">
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 font-heading">
          Aksi Cepat
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/layanan/tambah"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Layanan
          </Link>
          <Link
            href="/admin/informasi/tambah"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Informasi
          </Link>
          <Link
            href="/admin/galeri/tambah"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Galeri
          </Link>
          <Link
            href="/admin/peraturan/tambah"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Peraturan
          </Link>
        </div>
      </div>

      {/* Content grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Layanan Terbaru */}
        <div className="bg-white rounded-xl border border-border-light p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-text-primary font-heading">Layanan Terbaru</h2>
            <Link href="/admin/layanan" className="text-xs text-primary-600 hover:underline flex items-center gap-1 font-medium">
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentServices.map(service => (
              <div key={service.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary">
                <div>
                  <p className="text-sm font-medium text-text-primary">{service.title}</p>
                  <p className="text-xs text-text-tertiary">{service.category} · {service.requirements.length} Persyaratan</p>
                </div>
                <Link
                  href={`/admin/layanan/${service.id}/edit`}
                  className="text-xs text-primary-600 hover:underline font-medium"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Log Aktivitas Terbaru */}
        <div className="bg-white rounded-xl border border-border-light p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary-600" />
            <h2 className="text-base font-bold text-text-primary font-heading">Aktivitas Terbaru</h2>
          </div>
          {recentLogs.length > 0 ? (
            <div className="space-y-3">
              {recentLogs.map(log => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-surface-secondary">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary">{log.action}</p>
                    <p className="text-xs text-text-secondary truncate">{log.detail}</p>
                    <p className="text-[10px] text-text-tertiary mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.userName} · {new Date(log.timestamp).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-tertiary py-4 text-center">Belum ada aktivitas tercatat.</p>
          )}
        </div>
      </div>
    </div>
  );
}
