import { notFound } from 'next/navigation';
import { getServiceById } from '@/lib/data/services';
import ServiceForm from '@/components/admin/ServiceForm';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function EditLayananPage({ params }: Props) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) notFound();

  return <ServiceForm initialData={service} />;
}



