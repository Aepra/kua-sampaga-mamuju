import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin_test@kuasampaga.test' },
    update: {
      passwordHash,
      role: 'super_admin'
    },
    create: {
      email: 'admin_test@kuasampaga.test',
      name: 'Admin Tester',
      passwordHash,
      role: 'super_admin'
    }
  });
  
  console.log('Admin user created/updated successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
