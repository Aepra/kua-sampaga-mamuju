const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  const panduanDir = path.join(process.cwd(), 'public', 'panduan');
  if (!fs.existsSync(panduanDir)) {
    fs.mkdirSync(panduanDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: {
      width: 390,
      height: 844,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2
    }
  });

  const page = await browser.newPage();
  
  // Login
  console.log('Navigating to login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"]', 'admin_test@kuasampaga.test');
  await page.type('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  console.log('Waiting for login to complete (3 seconds)...');
  await delay(3000);

  // Take Dashboard Screenshot
  console.log('Capturing Dashboard...');
  await page.screenshot({ path: path.join(panduanDir, '1-dashboard.png') });

  // Sidebar Menu Screenshot
  console.log('Capturing Sidebar...');
  // Click the burger menu icon (assuming it has a specific class or we can find it)
  // Let's use the first button that looks like a burger. Usually it's in a specific place.
  // Actually, we can just click by finding the Lucide "Menu" icon.
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const menuBtn = buttons.find(b => b.innerHTML.includes('lucide-menu') || b.querySelector('svg'));
    if (menuBtn) menuBtn.click();
  });
  await delay(1000);
  await page.screenshot({ path: path.join(panduanDir, '2-sidebar.png') });
  
  // Close sidebar by clicking the close button or outside
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const closeBtn = buttons.find(b => b.innerHTML.includes('lucide-x') || b.querySelector('svg.lucide-x'));
    if (closeBtn) closeBtn.click();
  });
  await delay(500);

  // Pages to capture
  const pagesToCapture = [
    { url: '/admin/layanan', name: '3-layanan-list.png' },
    { url: '/admin/layanan/tambah', name: '4-layanan-tambah.png' },
    { url: '/admin/informasi', name: '5-informasi-list.png' },
    { url: '/admin/galeri', name: '6-galeri-list.png' },
    { url: '/admin/peraturan', name: '7-peraturan-list.png' },
    { url: '/admin/masukan', name: '8-masukan-list.png' },
    { url: '/admin/pengguna', name: '9-pengguna-list.png' },
    { url: '/admin/pengaturan', name: '10-pengaturan.png' }
  ];

  for (const p of pagesToCapture) {
    console.log(`Navigating to ${p.url}...`);
    await page.goto(`http://localhost:3000${p.url}`, { waitUntil: 'networkidle2' });
    await delay(1500); // give tables time to load API data
    
    // Attempt to trigger the delete dialog if it's a list page to show loading/confirm
    // but maybe too complex. Just static is fine.

    console.log(`Capturing ${p.name}...`);
    await page.screenshot({ path: path.join(panduanDir, p.name) });
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch(err => {
  console.error('Error generating screenshots:', err);
  process.exit(1);
});
