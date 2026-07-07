const { chromium } = require('playwright');
const path = require('path');

const input = process.argv[2] || 'flyer.html';
const output = process.argv[3] || 'flyer.pdf';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const fileUrl = 'file://' + path.resolve(__dirname, '..', '..', input);
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) { await document.fonts.ready; }
    const imgs = Array.from(document.images);
    await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })));
  });
  await page.pdf({
    path: path.resolve(__dirname, '..', '..', output),
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' }
  });
  await browser.close();
  console.log(output + ' собран');
})();
