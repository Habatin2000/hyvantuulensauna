import puppeteer from 'puppeteer-core';
const url = 'http://127.0.0.1:8794/saunalauttaristeilyt-helsingissa/';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1200 });
await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 2000));
const widget = await page.$('#varaus');
await widget.evaluate(e => e.scrollIntoView({ block: 'start' }));
await new Promise(r => setTimeout(r, 500));
// Click Virta card inside widget (first button with text Saunalautta Virta)
const virtaBtn = await widget.$('button:has-text("Saunalautta Virta")');
if (virtaBtn) await virtaBtn.click();
await new Promise(r => setTimeout(r, 2000));
// Click first green day
const day = await widget.$('[class*="bg-green-500"]');
if (day) await day.click();
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: '/tmp/booking-widget2.png' });
await browser.close();
