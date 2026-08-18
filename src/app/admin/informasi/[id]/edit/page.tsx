import { notFound } from 'next/navigation';
import { getInformationById } from '@/lib/data/information';
import InformationForm from '@/components/admin/InformationForm';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function EditInformasiPage({ params }: Props) {
  const { id } = await params;
  const item = await getInformationById(id);

  if (!item) notFound();

  return <InformationForm initialData={item} />;
}
