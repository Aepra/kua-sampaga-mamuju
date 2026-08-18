// ============================================================
// Information Data Access Layer
// ============================================================

import { Information } from '@/lib/types';
import { readJsonFile, writeJsonFile } from './json-helper';

const FILE = 'information.json';

export async function getAllInformation(): Promise<Information[]> {
  return readJsonFile<Information[]>(FILE);
}

export async function getPublishedInformation(): Promise<Information[]> {
  const info = await getAllInformation();
  return info.filter(i => i.published);
}

export async function getInformationById(id: string): Promise<Information | undefined> {
  const info = await getAllInformation();
  return info.find(i => i.id === id);
}

export async function getInformationBySlug(slug: string): Promise<Information | undefined> {
  const info = await getAllInformation();
  return info.find(i => i.slug === slug);
}

export async function getInformationByCategory(category: string): Promise<Information[]> {
  const info = await getPublishedInformation();
  if (category === 'Semua') return info;
  return info.filter(i => i.category === category);
}

export async function createInformation(item: Information): Promise<Information> {
  const info = await getAllInformation();
  info.push(item);
  await writeJsonFile(FILE, info);
  return item;
}

export async function updateInformation(id: string, updates: Partial<Information>): Promise<Information | null> {
  const info = await getAllInformation();
  const index = info.findIndex(i => i.id === id);
  if (index === -1) return null;

  info[index] = { ...info[index], ...updates, updatedAt: new Date().toISOString().split('T')[0] };
  await writeJsonFile(FILE, info);
  return info[index];
}

export async function deleteInformation(id: string): Promise<boolean> {
  const info = await getAllInformation();
  const filtered = info.filter(i => i.id !== id);
  if (filtered.length === info.length) return false;

  await writeJsonFile(FILE, filtered);
  return true;
}

export async function getInformationCount(): Promise<number> {
  const info = await getAllInformation();
  return info.length;
}

export async function getRecentInformation(limit: number = 3): Promise<Information[]> {
  const info = await getPublishedInformation();
  return info
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
