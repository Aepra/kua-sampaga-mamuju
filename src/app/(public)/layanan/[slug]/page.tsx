import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceBySlug } from '@/lib/data/services';
import { getSettings } from '@/lib/data/settings';
import ServiceDetailClient from './ServiceDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: 'Layanan Tidak Ditemukan' };

  return {
    title: service.title,
    description: service.description,
    openGraph: {
      title: `${service.title} | KUA Kecamatan Sampaga`,
      description: service.description,
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const settings = await getSettings();

  return <ServiceDetailClient service={service} settings={settings} />;
}
