import { Service } from '@/lib/types';
import { prisma } from '@/lib/prisma';

export async function getAllServices(): Promise<Service[]> {
  const services = await prisma.service.findMany({
    include: { requirements: true },
    orderBy: { createdAt: 'desc' }
  });
  return services.map(s => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));
}

export async function getPublishedServices(): Promise<Service[]> {
  const services = await prisma.service.findMany({
    where: { published: true },
    include: { requirements: true },
    orderBy: { createdAt: 'desc' }
  });
  return services.map(s => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));
}

export async function getServiceById(id: string): Promise<Service | undefined> {
  const service = await prisma.service.findUnique({
    where: { id },
    include: { requirements: true },
  });
  if (!service) return undefined;
  return {
    ...service,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  };
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const service = await prisma.service.findUnique({
    where: { slug },
    include: { requirements: true },
  });
  if (!service) return undefined;
  return {
    ...service,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  };
}

export async function getServicesByCategory(category: string): Promise<Service[]> {
  if (category === 'Semua') return getPublishedServices();
  
  const services = await prisma.service.findMany({
    where: { 
      published: true,
      category
    },
    include: { requirements: true },
    orderBy: { createdAt: 'desc' }
  });
  return services.map(s => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));
}

export async function searchServices(query: string): Promise<Service[]> {
  const q = query.toLowerCase();
  // Using basic findMany and JS filter because Prisma doesn't support complex full text search on arrays (like keywords/requirements) as easily out of the box in simple findMany.
  // We can just fetch all published and filter since the dataset is small, or use Prisma's `contains`.
  // For small to medium data, this is perfectly fine.
  const services = await getPublishedServices();
  return services.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q) ||
    s.keywords.some(k => k.toLowerCase().includes(q)) ||
    s.requirements.some(r => r.title.toLowerCase().includes(q))
  );
}

export async function createService(service: Service): Promise<Service> {
  const created = await prisma.service.create({
    data: {
      id: service.id,
      title: service.title,
      slug: service.slug,
      category: service.category,
      icon: service.icon,
      image: service.image,
      description: service.description,
      additionalDescription: service.additionalDescription,
      documentsToBring: service.documentsToBring,
      steps: service.steps,
      notes: service.notes,
      fee: service.fee,
      processingTime: service.processingTime,
      externalLink: service.externalLink,
      keywords: service.keywords,
      published: service.published,
      isDummy: service.isDummy,
      createdAt: service.createdAt ? new Date(service.createdAt) : undefined,
      updatedAt: service.updatedAt ? new Date(service.updatedAt) : undefined,
      requirements: {
        create: service.requirements.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description,
          required: r.required,
        }))
      }
    },
    include: { requirements: true }
  });

  return {
    ...created,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
  try {
    const updated = await prisma.service.update({
      where: { id },
      data: {
        title: updates.title,
        slug: updates.slug,
        category: updates.category,
        icon: updates.icon,
        image: updates.image,
        description: updates.description,
        additionalDescription: updates.additionalDescription,
        documentsToBring: updates.documentsToBring,
        steps: updates.steps,
        notes: updates.notes,
        fee: updates.fee,
        processingTime: updates.processingTime,
        externalLink: updates.externalLink,
        keywords: updates.keywords,
        published: updates.published,
        isDummy: updates.isDummy,
        
        // If requirements are passed in updates, we need to delete old ones and recreate
        ...(updates.requirements ? {
          requirements: {
            deleteMany: {},
            create: updates.requirements.map(r => ({
              id: r.id,
              title: r.title,
              description: r.description,
              required: r.required,
            }))
          }
        } : {})
      },
      include: { requirements: true }
    });

    return {
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  } catch {
    return null;
  }
}

export async function deleteService(id: string): Promise<boolean> {
  try {
    await prisma.service.delete({
      where: { id }
    });
    return true;
  } catch {
    return false;
  }
}

export async function getServiceCount(): Promise<number> {
  return prisma.service.count();
}

export async function getRecentServices(limit: number = 5): Promise<Service[]> {
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { requirements: true }
  });
  return services.map(s => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));
}

export async function getCategories(): Promise<string[]> {
  const services = await prisma.service.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ['category']
  });
  return services.map(s => s.category);
}
