const { mdToPdf } = require('md-to-pdf');
const path = require('path');

async function convert() {
  try {
    const mdPath = path.join(__dirname, '../public/panduan/panduan-admin.md');
    const pdfPath = path.join(__dirname, '../public/Panduan-Admin-KUA-Mobile.pdf');
    
    console.log('Converting', mdPath, 'to', pdfPath);
    
    const pdf = await mdToPdf(
      { path: mdPath }, 
      { 
        dest: pdfPath,
        basedir: path.join(__dirname, '../public/panduan'),
        pdf_options: { format: 'A4', margin: '20mm' },
        launch_options: { headless: 'new' },
        css: `
          body { font-size: 18px !important; line-height: 1.7 !important; }
          h1 { font-size: 28px !important; margin-bottom: 24px !important; }
          h2 { font-size: 24px !important; margin-top: 30px !important; }
          h3 { font-size: 20px !important; margin-top: 24px !important; }
          li { margin-bottom: 8px !important; }
          p { margin-bottom: 16px !important; }
        `
      }
    );
    
    console.log('PDF generated successfully!');
  } catch (err) {
    console.error('Error generating PDF:', err);
    process.exit(1);
  }
}

convert();
