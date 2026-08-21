import type { Metadata } from 'next';
import { getPublishedGallery } from '@/lib/data/gallery';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Galeri',
  description: 'Galeri foto kegiatan KUA Kecamatan Sampaga Kabupaten Mamuju.',
};

export const revalidate = 60;

export default async function GaleriPage() {
  const gallery = await getPublishedGallery();
  return <GalleryClient gallery={gallery} />;
}

