// ============================================================
// Regulations Data Access Layer (Prisma + Supabase)
// ============================================================

import { prisma } from '@/lib/prisma';
import { Regulation } from '@/lib/types';

export async function getAllRegulations(): Promise<Regulation[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const regs = await (prisma as any).regulation.findMany({
    orderBy: { createdAt: 'desc' },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return regs.map((r: any) => ({
    ...r,
    createdAt: typeof r.createdAt === 'string' ? r.createdAt : r.createdAt.toISOString().split('T')[0],
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : r.updatedAt.toISOString().split('T')[0],
  }));
}

export async function getPublishedRegulations(): Promise<Regulation[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const regs = await (prisma as any).regulation.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return regs.map((r: any) => ({
    ...r,
    createdAt: typeof r.createdAt === 'string' ? r.createdAt : r.createdAt.toISOString().split('T')[0],
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : r.updatedAt.toISOString().split('T')[0],
  }));
}

export async function getRegulationById(id: string): Promise<Regulation | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reg = await (prisma as any).regulation.findUnique({
    where: { id },
  });
  if (!reg) return null;
  return {
    ...reg,
    createdAt: typeof reg.createdAt === 'string' ? reg.createdAt : reg.createdAt.toISOString().split('T')[0],
    updatedAt: typeof reg.updatedAt === 'string' ? reg.updatedAt : reg.updatedAt.toISOString().split('T')[0],
  };
}

export async function createRegulation(data: {
  title: string;
  number?: string;
  year?: string;
  description?: string;
  documentLink?: string;
  published?: boolean;
}): Promise<Regulation> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reg = await (prisma as any).regulation.create({
    data: {
      title: data.title,
      number: data.number || '',
      year: data.year || '',
      description: data.description || '',
      documentLink: data.documentLink || '',
      published: data.published ?? true,
    },
  });
  return {
    ...reg,
    createdAt: typeof reg.createdAt === 'string' ? reg.createdAt : reg.createdAt.toISOString().split('T')[0],
    updatedAt: typeof reg.updatedAt === 'string' ? reg.updatedAt : reg.updatedAt.toISOString().split('T')[0],
  };
}

export async function updateRegulation(
  id: string,
  data: Partial<Regulation>
): Promise<Regulation | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reg = await (prisma as any).regulation.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.number !== undefined && { number: data.number }),
      ...(data.year !== undefined && { year: data.year }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.documentLink !== undefined && { documentLink: data.documentLink }),
      ...(data.published !== undefined && { published: data.published }),
    },
  });
  if (!reg) return null;
  return {
    ...reg,
    createdAt: typeof reg.createdAt === 'string' ? reg.createdAt : reg.createdAt.toISOString().split('T')[0],
    updatedAt: typeof reg.updatedAt === 'string' ? reg.updatedAt : reg.updatedAt.toISOString().split('T')[0],
  };
}

export async function deleteRegulation(id: string): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).regulation.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}

export async function getRegulationCount(): Promise<number> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any).regulation.count();
}
