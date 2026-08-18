// ============================================================
// Regulations Data Access Layer
// ============================================================

import { Regulation } from '@/lib/types';
import { readJsonFile, writeJsonFile } from './json-helper';

const FILE = 'regulations.json';

export async function getAllRegulations(): Promise<Regulation[]> {
  return readJsonFile<Regulation[]>(FILE);
}

export async function getPublishedRegulations(): Promise<Regulation[]> {
  const regs = await getAllRegulations();
  return regs.filter(r => r.published);
}

export async function getRegulationById(id: string): Promise<Regulation | undefined> {
  const regs = await getAllRegulations();
  return regs.find(r => r.id === id);
}

export async function createRegulation(reg: Regulation): Promise<Regulation> {
  const regs = await getAllRegulations();
  regs.push(reg);
  await writeJsonFile(FILE, regs);
  return reg;
}

export async function updateRegulation(id: string, updates: Partial<Regulation>): Promise<Regulation | null> {
  const regs = await getAllRegulations();
  const index = regs.findIndex(r => r.id === id);
  if (index === -1) return null;

  regs[index] = { ...regs[index], ...updates, updatedAt: new Date().toISOString().split('T')[0] };
  await writeJsonFile(FILE, regs);
  return regs[index];
}

export async function deleteRegulation(id: string): Promise<boolean> {
  const regs = await getAllRegulations();
  const filtered = regs.filter(r => r.id !== id);
  if (filtered.length === regs.length) return false;

  await writeJsonFile(FILE, filtered);
  return true;
}

export async function getRegulationCount(): Promise<number> {
  const regs = await getAllRegulations();
  return regs.length;
}
