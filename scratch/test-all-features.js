const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runAudit() {
  console.log('=== STARTING AUDIT TEST SUITE ===');
  const results = {
    auth: {},
    publicPages: {},
    adminAPIs: {},
    userAPIs: {},
    dbCounts: {},
    issuesFound: []
  };

  // 1. Check DB contents
  try {
    results.dbCounts.users = await prisma.user.count();
    results.dbCounts.services = await prisma.service.count();
    results.dbCounts.information = await prisma.information.count();
    results.dbCounts.gallery = await prisma.galleryItem.count();
    results.dbCounts.settings = await prisma.siteSettings.count();
    results.dbCounts.savedServices = await prisma.userSavedService.count();
  } catch (err) {
    results.issuesFound.push({ severity: 'HIGH', category: 'Database', message: err.message });
  }

  // 2. Test HTTP Endpoints
  const baseUrl = 'http://localhost:3000';
  const publicRoutes = ['/', '/layanan', '/galeri', '/informasi', '/tentang', '/kontak', '/login'];
  
  for (const route of publicRoutes) {
    try {
      const res = await fetch(`${baseUrl}${route}`);
      results.publicPages[route] = { status: res.status, ok: res.ok };
      if (!res.ok) {
        results.issuesFound.push({ severity: 'HIGH', category: 'Public Route', message: `Route ${route} returned status ${res.status}` });
      }
    } catch (err) {
      results.publicPages[route] = { error: err.message };
      results.issuesFound.push({ severity: 'HIGH', category: 'Public Route', message: `Route ${route} failed to respond: ${err.message}` });
    }
  }

  // 3. Test API GET Endpoints
  const apiRoutes = [
    '/api/services',
    '/api/information',
    '/api/gallery',
    '/api/settings',
    '/api/users',
    '/api/user/saved-services'
  ];

  for (const route of apiRoutes) {
    try {
      const res = await fetch(`${baseUrl}${route}`);
      const data = await res.json().catch(() => null);
      results.adminAPIs[route] = { status: res.status, ok: res.ok, dataCount: Array.isArray(data?.data) ? data.data.length : (data ? 'object' : 'none') };
    } catch (err) {
      results.adminAPIs[route] = { error: err.message };
    }
  }

  // 4. Test Service Detail Pages for all services in DB
  try {
    const services = await prisma.service.findMany({ select: { slug: true, title: true } });
    for (const svc of services) {
      const res = await fetch(`${baseUrl}/layanan/${svc.slug}`);
      if (!res.ok) {
        results.issuesFound.push({ severity: 'MEDIUM', category: 'Service Detail Page', message: `Service detail page for "${svc.slug}" returned status ${res.status}` });
      }
    }
  } catch (err) {
    results.issuesFound.push({ severity: 'HIGH', category: 'Service Check', message: err.message });
  }

  // 5. Test Information Detail Pages
  try {
    const infos = await prisma.information.findMany({ select: { slug: true, title: true } });
    for (const info of infos) {
      const res = await fetch(`${baseUrl}/informasi/${info.slug}`);
      if (!res.ok) {
        results.issuesFound.push({ severity: 'MEDIUM', category: 'Information Detail Page', message: `Information detail page for "${info.slug}" returned status ${res.status}` });
      }
    }
  } catch (err) {
    results.issuesFound.push({ severity: 'HIGH', category: 'Information Check', message: err.message });
  }

  console.log('AUDIT COMPLETE:');
  console.log(JSON.stringify(results, null, 2));
}

runAudit().then(() => prisma.$disconnect());
