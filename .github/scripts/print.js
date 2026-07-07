const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const fileUrl = 'file://' + path.resolve(__dirname, '..', '..', 'flyer.html');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  // дождаться шрифтов и картинок
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) { await document.fonts.ready; }
    const imgs = Array.from(document.images);
    await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })));
  });
  await page.pdf({
    path: path.resolve(__dirname, '..', '..', 'flyer.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '8mm', bottom: '8mm', left: '8mm', right: '8mm' }
  });
  await browser.close();
  console.log('flyer.pdf собран');
})();
