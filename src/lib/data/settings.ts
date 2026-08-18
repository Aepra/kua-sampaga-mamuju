// ============================================================
// Site Settings Data Access Layer
// ============================================================

import { SiteSettings } from '@/lib/types';
import { readJsonFile, writeJsonFile } from './json-helper';

const FILE = 'site-settings.json';

export async function getSettings(): Promise<SiteSettings> {
  return readJsonFile<SiteSettings>(FILE);
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const settings = await getSettings();
  const updated = { ...settings, ...updates };
  await writeJsonFile(FILE, updated);
  return updated;
}
