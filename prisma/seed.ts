import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const DATA_DIR = path.join(process.cwd(), 'data');

async function readJson(filename: string) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.log(`Failed to read ${filename}`, e);
    return null;
  }
}

async function main() {
  console.log('Start seeding...');

  // 1. Settings
  const settingsData = await readJson('site-settings.json');
  if (settingsData) {
    await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: { ...settingsData, id: 'default' },
      create: { ...settingsData, id: 'default' },
    });
    console.log('Seeded settings');
  }

  // 2. Users
  const users = await readJson('users.json');
  if (users) {
    for (const user of users) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          passwordHash: user.passwordHash,
          role: user.role,
          createdAt: new Date(user.createdAt),
        },
      });
    }
    console.log(`Seeded ${users.length} users`);
  }

  // 3. Information
  const infos = await readJson('information.json');
  if (infos) {
    for (const info of infos) {
      await prisma.information.upsert({
        where: { slug: info.slug },
        update: {},
        create: {
          id: info.id,
          title: info.title,
          slug: info.slug,
          content: info.content,
          excerpt: info.excerpt,
          thumbnail: info.thumbnail,
          category: info.category,
          date: info.date,
          published: info.published,
          createdAt: new Date(info.createdAt),
          updatedAt: new Date(info.updatedAt),
        },
      });
    }
    console.log(`Seeded ${infos.length} information items`);
  }

  // 4. Gallery
  const gallery = await readJson('gallery.json');
  if (gallery) {
    for (const item of gallery) {
      await prisma.galleryItem.upsert({
        where: { id: item.id },
        update: {},
        create: {
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          image: item.image,
          date: item.date,
          published: item.published,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        },
      });
    }
    console.log(`Seeded ${gallery.length} gallery items`);
  }

  // 5. Activity Logs
  const logs = await readJson('activity-logs.json');
  if (logs) {
    for (const log of logs) {
      await prisma.activityLog.upsert({
        where: { id: log.id },
        update: {},
        create: {
          id: log.id,
          action: log.action,
          detail: log.detail,
          userId: log.userId,
          userName: log.userName,
          timestamp: new Date(log.timestamp),
        },
      });
    }
    console.log(`Seeded ${logs.length} activity logs`);
  }

  // 6. Services
  const services = await readJson('services.json');
  if (services) {
    for (const svc of services) {
      // First create service
      await prisma.service.upsert({
        where: { slug: svc.slug },
        update: {},
        create: {
          id: svc.id,
          title: svc.title,
          slug: svc.slug,
          category: svc.category,
          icon: svc.icon,
          image: svc.image,
          description: svc.description,
          additionalDescription: svc.additionalDescription,
          documentsToBring: svc.documentsToBring,
          steps: svc.steps,
          notes: svc.notes,
          fee: svc.fee,
          processingTime: svc.processingTime,
          externalLink: svc.externalLink,
          keywords: svc.keywords,
          published: svc.published,
          isDummy: svc.isDummy,
          createdAt: new Date(svc.createdAt),
          updatedAt: new Date(svc.updatedAt),
          requirements: {
            create: svc.requirements.map((r: any) => ({
              id: r.id,
              title: r.title,
              description: r.description,
              required: r.required,
            }))
          }
        },
      });
    }
    console.log(`Seeded ${services.length} services`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
