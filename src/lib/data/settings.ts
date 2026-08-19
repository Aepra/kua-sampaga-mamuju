import { SiteSettings } from '@/lib/types';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export const getSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' }
    });
    
    if (!settings) {
      throw new Error('Settings not found');
    }

    return settings;
  },
  ['site-settings'], // cache key
  { tags: ['settings'], revalidate: 3600 } // revalidate every 1 hour or when tagged
);

import { revalidateTag } from 'next/cache';

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const updated = await prisma.siteSettings.update({
    where: { id: 'default' },
    data: { ...updates }
  });
  revalidateTag('settings'); // Purge the cache after update
  return updated;
}
