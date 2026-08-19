const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('password', 12);
  await prisma.user.updateMany({
    data: { passwordHash: hash }
  });
  console.log('success');
}

main().then(() => prisma.$disconnect());
