import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Pastikan selalu ada connection_limit saat instantiate Prisma
// untuk mencegah error P2024 (timeout pool) saat Vercel build
const url = process.env.DATABASE_URL || '';
const prismaUrl = url.includes('connection_limit') 
  ? url 
  : `${url}${url.includes('?') ? '&' : '?'}connection_limit=10&pool_timeout=30`;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: prismaUrl,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
