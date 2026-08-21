import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);


export async function getDatabaseUsage() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (prisma as any).$queryRaw`SELECT pg_database_size(current_database()) as size`;
    
    // Konversi BigInt ke Number
    const sizeInBytes = Number(result[0].size);
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    // Kuota Supabase Free Tier: 500 MB
    const maxCapacityMB = 500;
    const percentage = (sizeInMB / maxCapacityMB) * 100;
    
    return {
      sizeInMB: Number(sizeInMB.toFixed(2)),
      maxCapacityMB,
      percentage: Number(percentage.toFixed(2)),
      isWarning: percentage > 80,
      isDanger: percentage > 95,
    };
  } catch (error) {
    console.error('Error fetching database size:', error);
    return {
      sizeInMB: 0,
      maxCapacityMB: 500,
      percentage: 0,
      isWarning: false,
      isDanger: false,
    };
  }
}

export async function getStorageUsage() {
  try {
    const folders = ['gallery', 'information', 'profile', 'services'];
    let totalSizeBytes = 0;

    for (const folder of folders) {
      const { data, error } = await supabase.storage.from('uploads').list(folder, {
        limit: 5000,
      });
      if (data && !error) {
        for (const file of data) {
          if (file.metadata && file.metadata.size) {
            totalSizeBytes += file.metadata.size;
          }
        }
      }
    }

    const sizeInMB = totalSizeBytes / (1024 * 1024);
    const maxCapacityMB = 1024; // Kuota Supabase Free Tier: 1 GB (1024 MB)
    const percentage = (sizeInMB / maxCapacityMB) * 100;

    return {
      sizeInMB: Number(sizeInMB.toFixed(2)),
      maxCapacityMB,
      percentage: Number(percentage.toFixed(2)),
      isWarning: percentage > 80,
      isDanger: percentage > 95,
    };
  } catch (error) {
    console.error('Error fetching storage size:', error);
    return {
      sizeInMB: 0,
      maxCapacityMB: 1024,
      percentage: 0,
      isWarning: false,
      isDanger: false,
    };
  }
}

