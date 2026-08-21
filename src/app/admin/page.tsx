import Link from 'next/link';
import {
  FileText, BookOpen, Image as ImageIcon, Scale, Users,
  Plus, ArrowRight, Clock, Activity, Database, HardDrive, CheckCircle, Sparkles, ShieldCheck
} from 'lucide-react';
import { getServiceCount, getRecentServices } from '@/lib/data/services';
import { getInformationCount } from '@/lib/data/information';
import { getGalleryCount } from '@/lib/data/gallery';
import { getUserCount } from '@/lib/data/users';
import { getRecentLogs } from '@/lib/data/activity-logs';
import { getDatabaseUsage, getStorageUsage } from '@/lib/data/metrics';
import DataCleanupModal from './components/DataCleanupModal';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    serviceCount,
    infoCount,
    galleryCount,
    userCount,
    recentServices,
    recentLogs,
    dbUsage,
    storageUsage,
  ] = await Promise.all([
    getServiceCount(),
    getInformationCount(),
    getGalleryCount(),
    getUserCount(),
    getRecentServices(5),
    getRecentLogs(5),
    getDatabaseUsage(),
    getStorageUsage(),
  ]);

  const stats = [
    { label: 'Total Layanan', value: serviceCount, icon: FileText, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20', href: '/admin/layanan' },
    { label: 'Total Informasi', value: infoCount, icon: BookOpen, gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/20', href: '/admin/informasi-dan-berita' },
    { label: 'Total Galeri', value: galleryCount, icon: ImageIcon, gradient: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20', href: '/admin/galeri' },
    { label: 'Total Pengguna', value: userCount, icon: Users, gradient: 'from-pink-500 to-rose-500', shadow: 'shadow-pink-500/20', href: '/admin/pengaturan' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-6">
      {/* Hero Welcome Banner (Compact) */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#10B981] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 p-5 sm:p-6 shadow-md">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white dark:bg-gray-800 dark:bg-gray-800 opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white dark:bg-gray-800 dark:bg-gray-800/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-wider mb-2 border border-white/20 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
              Sistem Pengelola Konten
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
              Halo, Admin KUA Sampaga!
            </h1>
            <p className="text-emerald-50 dark:text-slate-300 mt-1 max-w-xl text-xs sm:text-sm opacity-90 leading-relaxed">
              Ringkasan data, layanan, dan semua aktivitas terbaru di website instansi.
            </p>
          </div>
          <div className="hidden md:flex flex-shrink-0 items-center justify-center w-14 h-14 bg-white dark:bg-gray-800 dark:bg-gray-800/10 rounded-xl backdrop-blur-md border border-white/20 shadow-inner">
            <ShieldCheck className="w-7 h-7 text-white opacity-90" />
          </div>
        </div>
      </div>

      {/* Stats grid (Compact) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link
              key={i}
              href={stat.href}
              className="group relative bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 dark:border-gray-700 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-sm ${stat.shadow} flex items-center justify-center text-white transform group-hover:rotate-6 transition-transform duration-300`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-gray-800 dark:text-gray-200 dark:text-gray-100 font-heading tracking-tight">{stat.value}</span>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-gray-800 dark:text-gray-200 dark:text-gray-100 transition-colors">
                    {stat.label}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

        {/* Status Database & Storage */}
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 dark:border-gray-700 p-4 shadow-sm ">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center shadow-sm">
                <Database className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-black text-gray-800 dark:text-gray-200 dark:text-gray-100 font-heading">Status Kapasitas Server</h2>
            </div>
            <DataCleanupModal />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Teks & Data Server */}
            <div className="bg-gray-50 dark:bg-gray-800/50 dark:bg-gray-700/50 dark:bg-gray-900/80 p-5 rounded-xl border border-gray-200 dark:border-gray-700 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-black text-gray-800 dark:text-gray-200 dark:text-gray-100 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-indigo-500" />
                  Teks & Data Inti
                </span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 border ${dbUsage.isDanger ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200' : dbUsage.isWarning ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                  <CheckCircle className="w-2.5 h-2.5" /> {dbUsage.isDanger ? 'Kritis' : dbUsage.isWarning ? 'Peringatan' : 'Aman'}
                </span>
              </div>
              
              <div className="flex flex-row items-center gap-4 sm:gap-6">
                {/* Circular Chart */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <path
                      className="text-gray-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Progress Circle */}
                    <path
                      className={`${dbUsage.isDanger ? 'text-red-500 dark:text-red-400' : dbUsage.isWarning ? 'text-yellow-400' : 'text-emerald-500'} transition-all duration-1000 ease-out`}
                      strokeDasharray={`${Math.min(dbUsage.percentage, 100)}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-black text-gray-800 dark:text-gray-200 dark:text-gray-100">{dbUsage.percentage.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5 flex items-center justify-between">
                      <span>Total Kapasitas</span>
                      <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 dark:text-gray-100">{dbUsage.maxCapacityMB} MB</span>
                    </p>
                    <div className="w-full border-b border-gray-200 dark:border-gray-700 dark:border-gray-700 border-dashed mt-1"></div>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Terpakai</span>
                      <span className="text-[11px] font-black text-indigo-600">{dbUsage.sizeInMB} MB</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Tersisa</span>
                      <span className="text-[11px] font-black text-emerald-600">{(dbUsage.maxCapacityMB - dbUsage.sizeInMB).toFixed(2)} MB</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Penyimpanan Media (Storage) */}
            <div className="bg-gray-50 dark:bg-gray-800/50 dark:bg-gray-700/50 dark:bg-gray-900/80 p-5 rounded-xl border border-gray-200 dark:border-gray-700 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-black text-gray-800 dark:text-gray-200 dark:text-gray-100 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-500" />
                  Media & Foto Galeri
                </span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 border ${storageUsage.isDanger ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200' : storageUsage.isWarning ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                  <CheckCircle className="w-2.5 h-2.5" /> {storageUsage.isDanger ? 'Penuh' : storageUsage.isWarning ? 'Hampir Penuh' : 'Aman'}
                </span>
              </div>
              
              <div className="flex flex-row items-center gap-4 sm:gap-6">
                {/* Circular Chart */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <path
                      className="text-gray-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Progress Circle */}
                    <path
                      className={`${storageUsage.isDanger ? 'text-red-500 dark:text-red-400' : storageUsage.isWarning ? 'text-yellow-400' : 'text-amber-500'} transition-all duration-1000 ease-out`}
                      strokeDasharray={`${Math.min(storageUsage.percentage, 100)}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-black text-gray-800 dark:text-gray-200 dark:text-gray-100">{storageUsage.percentage.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5 flex items-center justify-between">
                      <span>Total Kapasitas</span>
                      <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 dark:text-gray-100">{storageUsage.maxCapacityMB >= 1024 ? `${(storageUsage.maxCapacityMB / 1024).toFixed(1)} GB` : `${storageUsage.maxCapacityMB} MB`}</span>
                    </p>
                    <div className="w-full border-b border-gray-200 dark:border-gray-700 dark:border-gray-700 border-dashed mt-1"></div>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-50 dark:bg-amber-900/300"></span> Terpakai</span>
                      <span className="text-[11px] font-black text-amber-600 dark:text-amber-400">{storageUsage.sizeInMB} MB</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Tersisa</span>
                      <span className="text-[11px] font-black text-emerald-600">{(storageUsage.maxCapacityMB - storageUsage.sizeInMB).toFixed(2)} MB</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Quick Actions (Compact) */}
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 dark:border-gray-700 p-4 shadow-sm">
        <h2 className="text-xs font-black text-gray-800 dark:text-gray-200 dark:text-gray-100 uppercase tracking-widest mb-3 font-heading flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/layanan/tambah"
            className="group relative overflow-hidden flex items-center gap-2.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-px"
          >
            <div className="bg-white dark:bg-gray-800 dark:bg-gray-800/20 p-1.5 rounded-md"><Plus className="w-3.5 h-3.5" /></div>
            Layanan Baru
          </Link>
          <Link
            href="/admin/informasi-dan-berita/tambah"
            className="group relative overflow-hidden flex items-center gap-2.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-px"
          >
            <div className="bg-white dark:bg-gray-800 dark:bg-gray-800/20 p-1.5 rounded-md"><Plus className="w-3.5 h-3.5" /></div>
            Berita Baru
          </Link>
          <Link
            href="/admin/galeri/tambah"
            className="group relative overflow-hidden flex items-center gap-2.5 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-px"
          >
            <div className="bg-white dark:bg-gray-800 dark:bg-gray-800/20 p-1.5 rounded-md"><Plus className="w-3.5 h-3.5" /></div>
            Unggah Foto
          </Link>
        </div>
      </div>

      {/* Content grids (Compact) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Layanan Terbaru */}
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-800 dark:text-gray-200 dark:text-gray-100 font-heading flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5" />
              </div>
              Layanan Terbaru
            </h2>
            <Link href="/admin/layanan" className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 dark:bg-gray-700/50 dark:bg-gray-900 hover:bg-gray-100 dark:bg-gray-700 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentServices.map(service => (
              <div key={service.id} className="group flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:bg-gray-700/50 dark:bg-gray-900/50 hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all">
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200 dark:text-gray-100 group-hover:text-blue-700 transition-colors">{service.title}</p>
                  <p className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wider">{service.category} · {service.requirements.length} Persyaratan</p>
                </div>
                <Link
                  href={`/admin/layanan/${service.id}/edit`}
                  className="w-6 h-6 rounded-md bg-white dark:bg-gray-800 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Log Aktivitas Terbaru (Compact List) */}
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-800 dark:text-gray-200 dark:text-gray-100 font-heading flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5" />
              </div>
              Aktivitas Terbaru
            </h2>
          </div>
          {recentLogs.length > 0 ? (
            <div className="space-y-3">
              {recentLogs.map(log => (
                <div key={log.id} className="flex items-start gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-700 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-gray-800 dark:text-gray-200 dark:text-gray-100">{log.action}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{log.detail}</p>
                    <p className="text-[9px] font-bold text-gray-400 mt-1 flex items-center gap-1 uppercase tracking-wider">
                      <Clock className="w-2.5 h-2.5" />
                      {log.userName} · {new Date(log.timestamp).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-semibold text-gray-400 py-6 text-center bg-gray-50 dark:bg-gray-800/50 dark:bg-gray-700/50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 dark:border-gray-700">Belum ada aktivitas tercatat.</p>
          )}
        </div>

      </div>
    </div>
  );
}







