// Builds the publishable site into dist/.
//   npm run build            -> everything (map data, illustrations, CSS, share image, dist/)
// Netlify publishes dist/ (see netlify.toml).
import { cpSync, rmSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const SITE_URL = process.env.SITE_URL || 'https://curiosity-quest-kids.netlify.app';
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' });

run('node tools/build-geo.mjs');
run('node tools/build-illustrations.mjs');
run('npx tailwindcss -c tools/tailwind.config.cjs -i tools/tailwind.input.css -o site/activities/western-europe/app.css --minify');

// Share image (1200x630) rendered from tools/og.html with a real browser, so fonts match the site
const { chromium } = await import('playwright');
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto('file://' + join(root, 'tools/og.html'), { waitUntil: 'networkidle' });
await page.screenshot({ path: join(root, 'site/assets/img/og-image.png') });
await browser.close();

// Copy site/ -> dist/ and fill in the public address where pages need an absolute URL
rmSync(join(root, 'dist'), { recursive: true, force: true });
cpSync(join(root, 'site'), join(root, 'dist'), { recursive: true });
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
for (const file of walk(join(root, 'dist')).filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  if (html.includes('__SITE_URL__')) writeFileSync(file, html.replaceAll('__SITE_URL__', SITE_URL));
}
console.log(`Built dist/ for ${SITE_URL}`);
