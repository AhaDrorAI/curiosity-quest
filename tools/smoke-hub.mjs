// Browser checks for the hub:  node tools/smoke-hub.mjs http://localhost:8080
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:8080';
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const results = [];
const check = (name, ok, extra = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`);

// Browser language decides the first language; a manual choice is remembered
for (const [locale, expect] of [['nl-NL', 'nl'], ['he-IL', 'he'], ['fr-FR', 'en']]) {
  const ctx = await browser.newContext({ locale });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  check(`browser ${locale} opens in ${expect}`, (await page.getAttribute('html', 'lang')) === expect);
  check(`no errors (${locale})`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}

const ctx = await browser.newContext({ locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(base + '/', { waitUntil: 'networkidle' });
const catalogSize = await page.evaluate(() => window.CQ_CATALOG.length);
check(`one card per catalog entry (${catalogSize})`, catalogSize > 0 && (await page.locator('.destination').count()) === catalogSize);
const ctaCount = catalogSize;
await page.click('button[data-lang="he"]');
check('Hebrew switch sets rtl', (await page.getAttribute('html', 'dir')) === 'rtl');
await page.reload({ waitUntil: 'networkidle' });
check('manual choice remembered after reload', (await page.getAttribute('html', 'lang')) === 'he');
const geoHref = await page.getAttribute('.destination[data-id="western-europe"] .dest-cta', 'href');
check('Europe link passes hub language', geoHref === 'activities/western-europe/?lang=he', geoHref);
const space = page.locator('.destination[data-id="space"] .dest-cta');
check('space opens in a new tab, safely', (await space.getAttribute('target')) === '_blank' && (await space.getAttribute('rel')) === 'noopener');
check('space link says it opens a new tab', /כרטיסייה חדשה/.test(await space.textContent()));

// Keyboard: Tab reaches the language switch and both cards
await page.click('button[data-lang="en"]');
const focusOrder = [];
for (let i = 0; i < ctaCount + 6; i++) {
  await page.keyboard.press('Tab');
  focusOrder.push(await page.evaluate(() => document.activeElement.className || document.activeElement.tagName));
}
check('keyboard reaches every card', focusOrder.filter((c) => c.includes('dest-cta')).length === ctaCount, focusOrder.join(', '));

// About panel
await page.click('.about summary');
check('about text shows', (await page.locator('#about-body p').count()) === 3);

// Following the Europe card lands in the activity in the same language, and it can come back
await page.click('button[data-lang="nl"]');
await page.click('.destination[data-id="western-europe"] .dest-cta');
await page.waitForLoadState('networkidle');
check('activity opens in Dutch from the hub', (await page.getAttribute('html', 'lang')) === 'nl');
await page.click('#back-to-hub');
await page.waitForLoadState('networkidle');
check('return link goes back to the hub', (await page.locator('.destination').count()) === catalogSize);

// Missing illustration shows the fallback text
await page.route('**/assets/img/space.svg', (r) => r.abort());
await page.reload({ waitUntil: 'networkidle' });
check('fallback text when an illustration fails', await page.isVisible('.destination[data-id="space"] .dest-fallback'));
await page.unroute('**/assets/img/space.svg');

// Phone: no sideways scrolling in any language
const phone = await browser.newPage({ viewport: { width: 360, height: 740 } });
for (const lang of ['he', 'en', 'nl']) {
  await phone.goto(`${base}/?lang=${lang}`, { waitUntil: 'networkidle' });
  const overflow = await phone.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  check(`phone ${lang}: no horizontal overflow`, overflow <= 0, `${overflow}px`);
}

// Reduced motion: illustrations stop animating
const calm = await browser.newPage({ reducedMotion: 'reduce' });
await calm.goto(base + '/assets/img/space.svg');
const anim = await calm.evaluate(() => getComputedStyle(document.querySelector('.orbit')).animationName);
check('reduced motion stops the planets', anim === 'none', anim);

console.log(results.join('\n'));
await browser.close();
process.exit(results.some((r) => r.startsWith('FAIL')) ? 1 : 0);
