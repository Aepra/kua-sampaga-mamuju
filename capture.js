const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Set viewport to desktop for homepage
    await page.setViewport({ width: 1280, height: 800 });

    // 1. Homepage
    console.log('Capturing homepage...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'assets/kua_homepage_ss.png' });

    // 2. Login Page
    console.log('Capturing login page...');
    await page.goto('http://localhost:3000/api/auth/signin', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'assets/kua_login_ss.png' });

    // 3. Login as Admin
    console.log('Logging in as admin...');
    const emailInput = await page.$('input[name="email"]') || await page.$('input[type="email"]') || await page.$('input[name="username"]');
    if (emailInput) {
      await emailInput.type('admin@kuasampaga.test');
    }
    const passwordInput = await page.$('input[name="password"]') || await page.$('input[type="password"]');
    if (passwordInput) {
      await passwordInput.type('password');
    }
    const submitButton = await page.$('button[type="submit"]') || await page.$('button');
    if (submitButton) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
        submitButton.click(),
      ]);
    }

    // 4. Admin Dashboard
    console.log('Capturing admin dashboard...');
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'assets/kua_admin_ss.png' });

    // 5. Tambah Layanan form (Admin)
    console.log('Capturing admin tambah layanan form...');
    try {
      const tambahBtn = await page.$('a[href*="layanan"] button') || await page.$('button::-p-text(Tambah Layanan)') || await page.$('button::-p-text(Tambah)');
      if (tambahBtn) {
        await tambahBtn.click();
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: 'assets/kua_tambah_layanan_ss.png' });
      } else {
         await page.goto('http://localhost:3000/admin/layanan', { waitUntil: 'networkidle2' });
         const realTambah = await page.$('button::-p-text(Tambah Layanan)');
         if (realTambah) {
            await realTambah.click();
            await new Promise(r => setTimeout(r, 2000));
         }
         await page.screenshot({ path: 'assets/kua_tambah_layanan_ss.png' });
      }
    } catch(e) {}

    // 6. Logout admin
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');

    // 7. Login as User
    console.log('Logging in as user...');
    await page.goto('http://localhost:3000/api/auth/signin', { waitUntil: 'networkidle2' });
    const emailInputU = await page.$('input[name="email"]') || await page.$('input[type="email"]') || await page.$('input[name="username"]');
    if (emailInputU) await emailInputU.type('user@kuasampaga.test');
    const passwordInputU = await page.$('input[name="password"]') || await page.$('input[type="password"]');
    if (passwordInputU) await passwordInputU.type('password');
    const submitButtonU = await page.$('button[type="submit"]') || await page.$('button');
    if (submitButtonU) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
        submitButtonU.click(),
      ]);
    }

    // 8. Mobile checklist
    console.log('Capturing user checklist (mobile view)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.goto('http://localhost:3000/layanan/pendaftaran-nikah', { waitUntil: 'networkidle2' });
    
    try {
      const persiapkan = await page.$('button::-p-text(Persiapkan)');
      if (persiapkan) {
        await Promise.all([
           page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
           persiapkan.click()
        ]);
      }
    } catch (e) {}

    await page.screenshot({ path: 'assets/kua_mobile_checklist_ss.png' });

    console.log('Done!');
    await browser.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
