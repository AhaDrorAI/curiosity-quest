// Screenshots for review: node tools/shoot.mjs <base-url> <out-dir>
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:8080';
const out = process.argv[3] || 'tools/out';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const shots = [
  ['hub-desktop-en', { width: 1280, height: 1000 }, '/?lang=en', true],
  ['hub-desktop-he', { width: 1280, height: 1000 }, '/?lang=he', true],
  ['hub-phone-nl', { width: 375, height: 812 }, '/?lang=nl', true],
  ['hub-phone-he', { width: 375, height: 812 }, '/?lang=he', true],
];
for (const [name, viewport, path, full] of shots) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: viewport.width < 500 ? 2 : 1 });
  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: full });
  await page.close();
}
await browser.close();
console.log('done');
