const { PrismaClient } = require('@prisma/client');
// Initialize with direct connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.nscwzisqzorjtiqcuorw:KuaSampagaU116@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres?connection_limit=1"
    }
  }
});

async function main() {
  try {
    const count = await prisma.siteSettings.count();
    console.log("SUCCESS on port 5432! Settings count:", count);
  } catch (e) {
    console.error("FAIL on port 5432:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
