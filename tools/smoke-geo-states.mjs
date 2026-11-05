// Browser checks for states the first-load tests missed:
// empty filters, language handoff vs saved choice, quiz timers, local-map failure, contrast after answering.
// Usage: node tools/smoke-geo-states.mjs <base-url>
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const base = process.argv[2] || 'http://localhost:8080';
const url = base + '/activities/western-europe/';
const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const results = [];
const check = (name, ok, extra = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`);
const fresh = async (opts = {}) => { const ctx = await browser.newContext(opts); return [ctx, await ctx.newPage()]; };

async function contrastIssues(page) {
  await page.waitForTimeout(400); // let color transitions finish, so we measure the settled state
  if (!(await page.evaluate(() => !!window.axe))) await page.addScriptTag({ content: axeSource });
  const r = await page.evaluate(() => axe.run(document, { runOnly: ['color-contrast'] }));
  return r.violations.flatMap((v) => v.nodes.map((n) => `${n.target.join(' ')}: ${n.any[0]?.message.match(/of [\d.]+/)?.[0]}`));
}

// 1) "Needs review" with nothing starred: every quiz shows an empty state, never a target from all places
{
  const [ctx, page] = await fresh();
  await page.goto(url + '?lang=en', { waitUntil: 'networkidle' });
  await page.selectOption('#map-filter-select', 'hard');
  await page.click('#btn-mode-find');
  check('find-on-map: empty state shown', await page.isVisible('#map-quiz-empty'));
  check('find-on-map: no target with zero pins', !(await page.isVisible('#map-quiz-target-main')) && (await page.locator('.topo-pin').count()) === 0);
  await page.click('#btn-mode-name');
  check('name-the-symbol: empty state, no choices', await page.isVisible('#map-quiz-empty') && !(await page.isVisible('#map-quiz-choices')));
  await page.click('#btn-mode-explore');
  check('explore list: empty message', await page.isVisible('#sidebar-items-list .empty-note'));
  await page.click('[data-tab=flashcards]');
  await page.selectOption('#fc-cat-select', 'hard');
  check('flashcards: empty state instead of a stray card', await page.isVisible('#fc-empty') && !(await page.isVisible('#fc-card-inner')));
  await page.click('[data-tab=quiz]');
  await page.selectOption('#quiz-cat-filter', 'hard');
  check('written quiz: empty state, no answers', await page.isVisible('#wq-empty') && (await page.locator('#wq-mc-area button').count()) === 0);
  // Star one place, and the review quiz uses exactly that place
  await page.click('[data-tab=map]');
  await page.selectOption('#map-filter-select', 'all');
  await page.evaluate(() => selectFromSidebar('L_E'));
  await page.click('#btn-toggle-hard');
  await page.selectOption('#map-filter-select', 'hard');
  await page.click('#btn-mode-find');
  check('one starred place: quiz asks for it', (await page.textContent('#map-quiz-target-main')).trim() === 'België');
  await ctx.close();
}

// 2) A ?lang= link shows that language but does not overwrite the saved choice
{
  const [ctx, page] = await fresh();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.click('#lang-btn-ru'); // explicit choice: saved
  await page.goto(url + '?lang=en', { waitUntil: 'networkidle' });
  check('?lang=en link opens in English', (await page.getAttribute('html', 'lang')) === 'en');
  check('saved Russian preference kept', (await page.evaluate(() => localStorage.getItem('topo_app_lang'))) === 'ru');
  await page.goto(url, { waitUntil: 'networkidle' });
  check('next plain visit is Russian again', (await page.getAttribute('html', 'lang')) === 'ru');
  await ctx.close();
}

// 3) Answer correctly, press Next at once: the old timer must not skip the new question
for (const mode of ['name', 'find']) {
  const [ctx, page] = await fresh();
  await page.goto(url + '?lang=en', { waitUntil: 'networkidle' });
  await page.click(`#btn-mode-${mode}`);
  const id = await page.evaluate(() => mapQuizTarget.id);
  if (mode === 'name') await page.click(`#map-quiz-choices button[data-id="${id}"]`);
  else await page.evaluate((i) => handleMarkerClick(topoData.find((x) => x.id === i)), id);
  await page.click('#btn-map-quiz-next');
  const after = await page.evaluate(() => mapQuizTarget.id);
  await page.waitForTimeout(1600);
  check(`${mode}: Next cancels the pending auto-advance`, (await page.evaluate(() => mapQuizTarget.id)) === after);
  // switching modes also cancels it
  const id2 = await page.evaluate(() => mapQuizTarget.id);
  if (mode === 'name') await page.click(`#map-quiz-choices button[data-id="${id2}"]`);
  else await page.evaluate((i) => handleMarkerClick(topoData.find((x) => x.id === i)), id2);
  await page.click('#btn-mode-explore');
  await page.waitForTimeout(1600);
  check(`${mode}: leaving the quiz cancels it too`, (await page.evaluate(() => mapInteractionMode)) === 'explore' && (await page.isVisible('#side-explore-view')));
  await ctx.close();
}

// 4) If the built-in borders fail, nothing external loads until the visitor chooses it
{
  const [ctx, page] = await fresh();
  const outside = [];
  const own = new URL(base).hostname;
  page.on('request', (r) => { const u = new URL(r.url()); if (u.protocol.startsWith('http') && u.hostname !== own) outside.push(u.hostname); });
  let fails = true;
  await page.route('**/europe.geojson', (r) => (fails ? r.abort() : r.continue()));
  await page.goto(url + '?lang=en', { waitUntil: 'networkidle' });
  check('map failure: message with Retry', await page.isVisible('#map-load-error') && await page.isVisible('#btn-map-retry'));
  check('map failure: no external map loaded automatically', outside.length === 0, [...new Set(outside)].join(', '));
  fails = false;
  await page.click('#btn-map-retry');
  await page.waitForTimeout(800);
  check('Retry loads the built-in map', !(await page.isVisible('#map-load-error')) && (await page.locator('.leaflet-overlay-pane path').count()) > 20);
  await ctx.close();
  // and the explicit external option works
  const [ctx2, p2] = await fresh();
  await p2.route('**/europe.geojson', (r) => r.abort());
  await p2.goto(url + '?lang=en', { waitUntil: 'networkidle' });
  await p2.click('#btn-map-online');
  check('"Use online map" switches to Esri on request', (await p2.inputValue('#map-tile-select')) === 'esri_gray' && !(await p2.isVisible('#map-load-error')));
  await ctx2.close();
}

// 5) Contrast after answering (correct and wrong), in every quiz
{
  const [ctx, page] = await fresh();
  await page.goto(url + '?lang=en', { waitUntil: 'networkidle' });
  const issues = [];
  issues.push(...(await contrastIssues(page)));
  await page.click('#btn-mode-name');
  const target = await page.evaluate(() => mapQuizTarget.id);
  await page.click(`#map-quiz-choices button:not([data-id="${target}"])`);
  issues.push(...(await contrastIssues(page)));
  await page.click(`#map-quiz-choices button[data-id="${target}"]`);
  issues.push(...(await contrastIssues(page)));
  await page.click('#btn-mode-find');
  const t2 = await page.evaluate(() => mapQuizTarget.id);
  const wrong = await page.evaluate((t) => topoData.find((x) => x.id !== t).id, t2);
  await page.evaluate((w) => handleMarkerClick(topoData.find((x) => x.id === w)), wrong);
  await page.evaluate((t) => handleMarkerClick(topoData.find((x) => x.id === t)), t2);
  issues.push(...(await contrastIssues(page)));
  await page.click('[data-tab=quiz]');
  const wt = await page.evaluate(() => wqCurrent.id);
  await page.click(`#wq-mc-area button[data-id="${wt}"]`);
  issues.push(...(await contrastIssues(page)));
  await page.click('#btn-wq-next');
  const wt2 = await page.evaluate(() => wqCurrent.id);
  await page.click(`#wq-mc-area button:not([data-id="${wt2}"])`);
  issues.push(...(await contrastIssues(page)));
  await page.click('#btn-qmode-spell');
  await page.fill('#wq-spell-input', await page.evaluate(() => wqCurrent.nl));
  await page.click('#btn-wq-check-spell');
  issues.push(...(await contrastIssues(page)));
  check('contrast holds after correct and wrong answers', issues.length === 0, [...new Set(issues)].slice(0, 6).join(' | '));
  await ctx.close();
}

console.log(results.join('\n'));
await browser.close();
process.exit(results.some((r) => r.startsWith('FAIL')) ? 1 : 0);
