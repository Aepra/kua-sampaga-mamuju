import type { Metadata } from 'next';
import { getPublishedServices, getCategories } from '@/lib/data/services';
import ServiceListClient from './ServiceListClient';

export const metadata: Metadata = {
  title: 'Layanan',
  description: 'Daftar layanan KUA Kecamatan Sampaga Kabupaten Mamuju. Temukan informasi persyaratan dan panduan pengurusan.',
};

export const dynamic = 'force-dynamic';

export default async function LayananPage() {
  const services = await getPublishedServices();
  const categories = await getCategories();

  return <ServiceListClient services={services} categories={categories} />;
}
