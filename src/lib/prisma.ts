import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Pastikan selalu ada connection_limit=3 saat instantiate Prisma
// untuk mencegah error P2024 (timeout pool) dan EMAXCONNSESSION
let prismaUrl = process.env.DATABASE_URL || '';

try {
  if (prismaUrl) {
    const parsedUrl = new URL(prismaUrl);
    // Di dev mode Turbopack membuat banyak worker. Gunakan limit=1 agar total tidak lewat 15.
    const limit = process.env.NODE_ENV === 'development' ? '1' : '5';
    parsedUrl.searchParams.set('connection_limit', limit);
    parsedUrl.searchParams.set('pool_timeout', '30');
    prismaUrl = parsedUrl.toString();
  }
} catch (e) {
  // Ignore if url is invalid
}

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: prismaUrl,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
