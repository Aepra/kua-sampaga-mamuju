import type { Metadata } from 'next';
import { getPublishedServices, getCategories } from '@/lib/data/services';
import ServiceListClient from './ServiceListClient';

export const metadata: Metadata = {
  title: 'Layanan',
  description: 'Daftar layanan KUA Kecamatan Sampaga Kabupaten Mamuju. Temukan informasi persyaratan dan panduan pengurusan.',
};

export const revalidate = 60;

export default async function LayananPage() {
  const [services, categories] = await Promise.all([
    getPublishedServices(),
    getCategories(),
  ]);

  return <ServiceListClient services={services} categories={categories} />;
}

