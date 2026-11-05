// Quick browser check of the geography activity: no JS errors, every feature reachable.
// Usage: node tools/smoke-geo.mjs http://localhost:8080
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:8080';
const out = process.argv[3] || 'tools/out';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
const external = [];
page.on('request', (r) => { const u = new URL(r.url()); if (!['localhost', '127.0.0.1'].includes(u.hostname)) external.push(u.hostname); });

const results = [];
const check = (name, ok, extra = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`);

await page.goto(base + '/activities/western-europe/?lang=en', { waitUntil: 'networkidle' });
check('loads in English via ?lang=en', (await page.getAttribute('html', 'lang')) === 'en');
check('country borders drawn locally', (await page.locator('.leaflet-overlay-pane path').count()) > 20);
check('48 pins on map', (await page.locator('.topo-pin').count()) === 48);
check('pins are keyboard buttons', (await page.locator('.leaflet-marker-icon[role=button][tabindex="0"]').count()) === 48);

// Map quiz: Find on map — prompt must be visible (was hidden by the duplicate box)
await page.click('#btn-mode-find');
const target = await page.textContent('#map-quiz-target-main');
check('Find-on-map prompt visible', await page.isVisible('#map-quiz-target-main'), `target: ${target}`);
// Click the correct pin via keyboard
const id = await page.evaluate(() => mapQuizTarget.id);
await page.focus(`.leaflet-marker-icon[data-item-id="${id}"]`);
await page.keyboard.press('Enter');
check('Enter on a pin answers the quiz', (await page.textContent('#map-quiz-score')) === '1');

// Name the symbol — 4 choices must appear
await page.click('#btn-mode-name');
check('Name-the-symbol choices visible', await page.isVisible('#map-quiz-choices') && (await page.locator('#map-quiz-choices button').count()) === 4);
await page.screenshot({ path: `${out}/geo-name-quiz.png` });
await page.click('#btn-mode-explore');

// Language switch to Russian, then spelling feedback must be in Russian
await page.click('#lang-btn-ru');
check('language switch to Russian', (await page.getAttribute('html', 'lang')) === 'ru' && (await page.getAttribute('#lang-btn-ru', 'aria-pressed')) === 'true');
await page.click('[data-tab=quiz]');
await page.click('#btn-qmode-spell');
await page.fill('#wq-spell-input', 'xxxx');
await page.click('#btn-wq-check-spell');
const fb = await page.textContent('#wq-feedback-box');
check('spelling feedback follows language (ru)', /Правильно/.test(fb), fb);

// Flashcards: Flip button flips, hidden face is inert
await page.click('[data-tab=flashcards]');
await page.click('#btn-fc-flip');
check('Flip button flips the card', await page.evaluate(() => document.getElementById('fc-face-front').inert && !document.getElementById('fc-face-back').inert));

// Vocab tab renders tables
await page.click('[data-tab=vocab]');
check('vocabulary tables render', (await page.locator('#full-tables-container tr').count()) > 48);

// Hebrew RTL
await page.click('#lang-btn-he');
check('Hebrew sets rtl', (await page.getAttribute('html', 'dir')) === 'rtl');
check('back-to-hub link', (await page.getAttribute('#back-to-hub', 'href')) === '../../');

// Storage blocked must not break the page
const ctx2 = await browser.newContext();
await ctx2.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
const p2 = await ctx2.newPage();
const errs2 = [];
p2.on('pageerror', (e) => errs2.push(e.message));
await p2.goto(base + '/activities/western-europe/', { waitUntil: 'networkidle' });
check('works with storage blocked', errs2.length === 0 && (await p2.locator('.topo-pin').count()) === 48, errs2.join(' | '));

// Phone layout: no sideways overflow, all 4 tabs visible
const phone = await browser.newPage({ viewport: { width: 375, height: 800 }, deviceScaleFactor: 2 });
await phone.goto(base + '/activities/western-europe/?lang=he', { waitUntil: 'networkidle' });
const overflow = await phone.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
check('phone: no horizontal overflow', overflow <= 0, `overflow ${overflow}px`);
const tabsVisible = await phone.evaluate(() => [...document.querySelectorAll('.main-tab-btn')].every((b) => { const r = b.getBoundingClientRect(); return r.right <= innerWidth && r.left >= 0 && r.width > 0; }));
check('phone: all tabs on screen', tabsVisible);
await phone.screenshot({ path: `${out}/geo-phone-he.png` });
await page.screenshot({ path: `${out}/geo-desktop.png` });

check('no JS errors', errors.length === 0, errors.join(' | '));
check('no external requests by default', external.length === 0, [...new Set(external)].join(', '));
console.log(results.join('\n'));
await browser.close();
process.exit(results.some((r) => r.startsWith('FAIL')) ? 1 : 0);
