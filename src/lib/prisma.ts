import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Pastikan selalu ada connection_limit=10 saat instantiate Prisma
// untuk mencegah error P2024 (timeout pool) saat Vercel build
let prismaUrl = process.env.DATABASE_URL || '';
try {
  if (prismaUrl) {
    const parsedUrl = new URL(prismaUrl);
    parsedUrl.searchParams.set('connection_limit', '10');
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
