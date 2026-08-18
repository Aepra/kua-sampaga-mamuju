import { notFound } from 'next/navigation';
import { getGalleryById } from '@/lib/data/gallery';
import GalleryForm from '@/components/admin/GalleryForm';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function EditGaleriPage({ params }: Props) {
  const { id } = await params;
  const item = await getGalleryById(id);

  if (!item) notFound();

  return <GalleryForm initialData={item} />;
}
