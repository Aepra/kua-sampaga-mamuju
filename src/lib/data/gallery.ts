// ============================================================
// Gallery Data Access Layer
// ============================================================

import { GalleryItem } from '@/lib/types';
import { readJsonFile, writeJsonFile } from './json-helper';

const FILE = 'gallery.json';

export async function getAllGallery(): Promise<GalleryItem[]> {
  return readJsonFile<GalleryItem[]>(FILE);
}

export async function getPublishedGallery(): Promise<GalleryItem[]> {
  const gallery = await getAllGallery();
  return gallery.filter(g => g.published);
}

export async function getGalleryById(id: string): Promise<GalleryItem | undefined> {
  const gallery = await getAllGallery();
  return gallery.find(g => g.id === id);
}

export async function getGalleryByCategory(category: string): Promise<GalleryItem[]> {
  const gallery = await getPublishedGallery();
  if (category === 'Semua') return gallery;
  return gallery.filter(g => g.category === category);
}

export async function createGalleryItem(item: GalleryItem): Promise<GalleryItem> {
  const gallery = await getAllGallery();
  gallery.push(item);
  await writeJsonFile(FILE, gallery);
  return item;
}

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> {
  const gallery = await getAllGallery();
  const index = gallery.findIndex(g => g.id === id);
  if (index === -1) return null;

  gallery[index] = { ...gallery[index], ...updates, updatedAt: new Date().toISOString().split('T')[0] };
  await writeJsonFile(FILE, gallery);
  return gallery[index];
}

export async function deleteGalleryItem(id: string): Promise<GalleryItem | null> {
  const gallery = await getAllGallery();
  const item = gallery.find(g => g.id === id);
  if (!item) return null;

  const filtered = gallery.filter(g => g.id !== id);
  await writeJsonFile(FILE, filtered);
  return item;
}

export async function getGalleryCount(): Promise<number> {
  const gallery = await getAllGallery();
  return gallery.length;
}

export async function getRecentGallery(limit: number = 4): Promise<GalleryItem[]> {
  const gallery = await getPublishedGallery();
  return gallery
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
