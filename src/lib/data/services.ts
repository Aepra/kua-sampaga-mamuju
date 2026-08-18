// ============================================================
// Services Data Access Layer
// ============================================================

import { Service } from '@/lib/types';
import { readJsonFile, writeJsonFile } from './json-helper';

const FILE = 'services.json';

export async function getAllServices(): Promise<Service[]> {
  return readJsonFile<Service[]>(FILE);
}

export async function getPublishedServices(): Promise<Service[]> {
  const services = await getAllServices();
  return services.filter(s => s.published);
}

export async function getServiceById(id: string): Promise<Service | undefined> {
  const services = await getAllServices();
  return services.find(s => s.id === id);
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const services = await getAllServices();
  return services.find(s => s.slug === slug);
}

export async function getServicesByCategory(category: string): Promise<Service[]> {
  const services = await getPublishedServices();
  if (category === 'Semua') return services;
  return services.filter(s => s.category === category);
}

export async function searchServices(query: string): Promise<Service[]> {
  const services = await getPublishedServices();
  const q = query.toLowerCase();
  return services.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q) ||
    s.keywords.some(k => k.toLowerCase().includes(q)) ||
    s.requirements.some(r => r.title.toLowerCase().includes(q))
  );
}

export async function createService(service: Service): Promise<Service> {
  const services = await getAllServices();
  services.push(service);
  await writeJsonFile(FILE, services);
  return service;
}

export async function updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
  const services = await getAllServices();
  const index = services.findIndex(s => s.id === id);
  if (index === -1) return null;

  services[index] = { ...services[index], ...updates, updatedAt: new Date().toISOString().split('T')[0] };
  await writeJsonFile(FILE, services);
  return services[index];
}

export async function deleteService(id: string): Promise<boolean> {
  const services = await getAllServices();
  const filtered = services.filter(s => s.id !== id);
  if (filtered.length === services.length) return false;

  await writeJsonFile(FILE, filtered);
  return true;
}

export async function getServiceCount(): Promise<number> {
  const services = await getAllServices();
  return services.length;
}

export async function getRecentServices(limit: number = 5): Promise<Service[]> {
  const services = await getPublishedServices();
  return services
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getCategories(): Promise<string[]> {
  const services = await getPublishedServices();
  const cats = new Set(services.map(s => s.category));
  return Array.from(cats);
}
