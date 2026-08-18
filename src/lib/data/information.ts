import { Information } from '@/lib/types';
import { prisma } from '@/lib/prisma';

export async function getAllInformation(): Promise<Information[]> {
  const info = await prisma.information.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return info.map(i => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }));
}

export async function getPublishedInformation(): Promise<Information[]> {
  const info = await prisma.information.findMany({
    where: { published: true },
    orderBy: { date: 'desc' }
  });
  return info.map(i => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }));
}

export async function getInformationById(id: string): Promise<Information | undefined> {
  const info = await prisma.information.findUnique({
    where: { id }
  });
  if (!info) return undefined;
  return {
    ...info,
    createdAt: info.createdAt.toISOString(),
    updatedAt: info.updatedAt.toISOString(),
  };
}

export async function getInformationBySlug(slug: string): Promise<Information | undefined> {
  const info = await prisma.information.findUnique({
    where: { slug }
  });
  if (!info) return undefined;
  return {
    ...info,
    createdAt: info.createdAt.toISOString(),
    updatedAt: info.updatedAt.toISOString(),
  };
}

export async function getInformationByCategory(category: string): Promise<Information[]> {
  if (category === 'Semua') return getPublishedInformation();
  
  const info = await prisma.information.findMany({
    where: { 
      published: true,
      category
    },
    orderBy: { date: 'desc' }
  });
  return info.map(i => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }));
}

export async function createInformation(item: Information): Promise<Information> {
  const created = await prisma.information.create({
    data: {
      id: item.id,
      title: item.title,
      slug: item.slug,
      content: item.content,
      excerpt: item.excerpt,
      thumbnail: item.thumbnail,
      category: item.category,
      date: item.date,
      published: item.published,
      createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
    }
  });
  return {
    ...created,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updateInformation(id: string, updates: Partial<Information>): Promise<Information | null> {
  try {
    const updated = await prisma.information.update({
      where: { id },
      data: {
        title: updates.title,
        slug: updates.slug,
        content: updates.content,
        excerpt: updates.excerpt,
        thumbnail: updates.thumbnail,
        category: updates.category,
        date: updates.date,
        published: updates.published,
      }
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

export async function deleteInformation(id: string): Promise<boolean> {
  try {
    await prisma.information.delete({
      where: { id }
    });
    return true;
  } catch {
    return false;
  }
}

export async function getInformationCount(): Promise<number> {
  return prisma.information.count();
}

export async function getRecentInformation(limit: number = 3): Promise<Information[]> {
  const info = await prisma.information.findMany({
    where: { published: true },
    orderBy: { date: 'desc' },
    take: limit
  });
  return info.map(i => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }));
}
