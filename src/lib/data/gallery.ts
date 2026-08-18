import { GalleryItem } from '@/lib/types';
import { prisma } from '@/lib/prisma';

export async function getAllGallery(): Promise<GalleryItem[]> {
  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: 'desc' }
  });
  // Prisma returns dates as Date objects, we map them back to string if needed by types, or just return as is since they match types mostly
  return items.map(i => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }));
}

export async function getPublishedGallery(): Promise<GalleryItem[]> {
  const items = await prisma.galleryItem.findMany({
    where: { published: true },
    orderBy: { date: 'desc' }
  });
  return items.map(i => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }));
}

export async function getGalleryById(id: string): Promise<GalleryItem | undefined> {
  const item = await prisma.galleryItem.findUnique({
    where: { id }
  });
  if (!item) return undefined;
  return {
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export async function getGalleryByCategory(category: string): Promise<GalleryItem[]> {
  if (category === 'Semua') return getPublishedGallery();
  
  const items = await prisma.galleryItem.findMany({
    where: { 
      published: true,
      category
    },
    orderBy: { date: 'desc' }
  });
  return items.map(i => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }));
}

export async function createGalleryItem(item: GalleryItem): Promise<GalleryItem> {
  const created = await prisma.galleryItem.create({
    data: {
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      image: item.image,
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

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> {
  try {
    const updated = await prisma.galleryItem.update({
      where: { id },
      data: {
        title: updates.title,
        description: updates.description,
        category: updates.category,
        image: updates.image,
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

export async function deleteGalleryItem(id: string): Promise<GalleryItem | null> {
  try {
    const deleted = await prisma.galleryItem.delete({
      where: { id }
    });
    return {
      ...deleted,
      createdAt: deleted.createdAt.toISOString(),
      updatedAt: deleted.updatedAt.toISOString(),
    };
  } catch {
    return null;
  }
}

export async function getGalleryCount(): Promise<number> {
  return prisma.galleryItem.count();
}

export async function getRecentGallery(limit: number = 4): Promise<GalleryItem[]> {
  const items = await prisma.galleryItem.findMany({
    where: { published: true },
    orderBy: { date: 'desc' },
    take: limit
  });
  return items.map(i => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }));
}
