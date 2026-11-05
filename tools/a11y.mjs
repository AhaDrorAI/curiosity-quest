// Accessibility scan (axe-core) of the hub and the geography activity:  node tools/a11y.mjs <base-url>
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const base = process.argv[2] || 'http://localhost:8080';
const axe = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
let problems = 0;
for (const path of ['/?lang=en', '/?lang=he', '/?lang=nl', '/activities/western-europe/?lang=en', '/activities/western-europe/?lang=he']) {
  const page = await browser.newPage();
  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.addScriptTag({ content: axe });
  const res = await page.evaluate(() => axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] }));
  const v = res.violations;
  problems += v.length;
  console.log(`${path}: ${v.length ? v.map((x) => `${x.id} (${x.nodes.length})`).join(', ') : 'no WCAG A/AA issues'}`);
  for (const x of v) for (const n of x.nodes.slice(0, 3)) console.log('   ', x.id, n.target.join(' '), n.any[0]?.message || '');
  await page.close();
}
await browser.close();
process.exit(problems ? 1 : 0);
