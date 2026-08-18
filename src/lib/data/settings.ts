import { SiteSettings } from '@/lib/types';
import { prisma } from '@/lib/prisma';

export async function getSettings(): Promise<SiteSettings> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'default' }
  });
  
  if (!settings) {
    throw new Error('Settings not found');
  }

  return settings;
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const settings = await getSettings();
  const updated = await prisma.siteSettings.update({
    where: { id: 'default' },
    data: { ...updates }
  });
  return updated;
}
