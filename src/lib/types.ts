// ============================================================
// Core Types for KUA Kecamatan Sampaga Website
// ============================================================

// --- Service Types ---
export interface Requirement {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  category: string;
  icon: string;
  image: string;
  description: string;
  additionalDescription: string;
  requirements: Requirement[];
  documentsToBring: string[];
  steps: string[];
  notes: string[];
  fee: string | null;
  processingTime: string | null;
  externalLink: string | null;
  keywords: string[];
  published: boolean;
  isDummy: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Gallery Types ---
export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  date: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Information Types ---
export interface Information {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  images: string[];
  thumbnail: string;
  category: string;
  date: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Regulation Types ---
export interface Regulation {
  id: string;
  title: string;
  number: string;
  year: string;
  description: string;
  documentLink: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- User Types ---
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'super_admin' | 'user';
  createdAt: string;
}

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin' | 'user';
}

// --- Site Settings ---
export interface SiteSettings {
  name: string;
  head: string;
  nip: string;
  address: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  description: string;
  vision: string;
  mission: string[];
  officeImage: string;
  headImage: string;
  officeHours: string;
}

// --- Activity Log ---
export interface ActivityLog {
  id: string;
  action: string;
  detail: string;
  userId: string;
  userName: string;
  timestamp: string;
}

// --- API Response ---
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// --- Search ---
export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  type: 'service' | 'information' | 'regulation';
}

// --- Categories ---
export const SERVICE_CATEGORIES = [
  'Semua',
  'Pernikahan',
  'Administrasi',
  'Keluarga',
  'Wakaf',
  'Keagamaan',
  'Konsultasi',
  'Lainnya',
] as const;

export const GALLERY_CATEGORIES = [
  'Semua',
  'Kegiatan',
  'Pelayanan',
  'Bimbingan',
  'Pernikahan',
  'Keagamaan',
  'Lainnya',
] as const;

export const INFORMATION_CATEGORIES = [
  'Semua',
  'Pengumuman',
  'Berita',
  'Kegiatan',
  'Pelayanan',
  'Lainnya',
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number];
export type GalleryCategory = typeof GALLERY_CATEGORIES[number];
export type InformationCategory = typeof INFORMATION_CATEGORIES[number];
