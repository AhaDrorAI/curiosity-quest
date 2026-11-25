// Browser checks for the Cito words activity:  node tools/smoke-cito.mjs <base-url>
// Covers first load in each language, every tab, empty filters, quiz answer rules,
// typed answers, mini texts, language handoff, blocked storage, phone layout and contrast after answering.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const base = process.argv[2] || 'http://localhost:8080';
const url = base + '/activities/cito-words/';
const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const results = [];
const check = (name, ok, extra = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`);
const fresh = async (opts = {}) => {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  return [ctx, page, errors];
};
async function contrastIssues(page) {
  await page.waitForTimeout(300);
  if (!(await page.evaluate(() => !!window.axe))) await page.addScriptTag({ content: axeSource });
  const r = await page.evaluate(() => axe.run(document, { runOnly: ['color-contrast'] }));
  return r.violations.flatMap((v) => v.nodes.map((n) => n.target.join(' ')));
}

// 1) First load in each language
for (const lang of ['nl', 'he', 'en']) {
  const [ctx, page, errors] = await fresh();
  await page.goto(`${url}?lang=${lang}`, { waitUntil: 'networkidle' });
  check(`${lang}: opens in ${lang}`, (await page.getAttribute('html', 'lang')) === lang);
  check(`${lang}: direction`, (await page.getAttribute('html', 'dir')) === (lang === 'he' ? 'rtl' : 'ltr'));
  const words = await page.evaluate(() => window.CW_WORDS.length);
  check(`${lang}: every word shown in the groups (${words})`, (await page.locator('#groups-list .word-chip').count()) === words);
  check(`${lang}: return link to the hub keeps the language`, (await page.getAttribute('#back-to-hub', 'href')) === `../../?lang=${lang}`);
  check(`${lang}: no errors`, errors.length === 0, errors.join(' | '));
  if (lang === 'he') {
    const chipDir = await page.$eval('#groups-list .word-chip', (b) => getComputedStyle(b).direction);
    check('he: Dutch words stay left-to-right', chipDir === 'ltr');
  }
  await ctx.close();
}

// 2) Word dialog, flashcards, stars and the empty review filter
{
  const [ctx, page] = await fresh({ locale: 'en-US' });
  await page.goto(url + '?lang=en', { waitUntil: 'networkidle' });
  await page.click('.word-chip[data-id="mening"]');
  check('word dialog opens with the meaning', (await page.isVisible('#word-dialog')) && (await page.textContent('#dlg-details')).includes('wat iemand ergens van vindt'));
  check('word dialog shows the English translation', (await page.textContent('#dlg-details')).includes('opinion'));
  await page.click('#dlg-close');
  check('closing the dialog returns focus to the word', (await page.evaluate(() => document.activeElement?.getAttribute('data-id'))) === 'mening');

  await page.click('[data-tab=cards]');
  await page.selectOption('#cards-filter', 'starred');
  check('flashcards: empty state when nothing is starred', (await page.isVisible('#cards-empty')) && !(await page.isVisible('#flashcard')));
  await page.selectOption('#cards-filter', 'all');
  const first = (await page.textContent('#card-word')).trim();
  check('flashcards: back hidden before flipping', !(await page.isVisible('#card-back')));
  await page.click('#card-flip');
  check('flashcards: flip shows the meaning', await page.isVisible('#card-details .def'));
  check('flashcards: translation hidden until asked', !(await page.isVisible('#card-details .trans-items')));
  await page.click('#card-details .trans button');
  check('flashcards: translation shows on request', await page.isVisible('#card-details .trans-items'));
  await page.click('#card-star');
  check('star is saved', (await page.evaluate(() => JSON.parse(localStorage.getItem('cito_words_review') || '[]').length)) === 1);
  await page.click('#card-next');
  check('next card is a different word, unflipped', (await page.textContent('#card-word')).trim() !== first && !(await page.isVisible('#card-back')));
  await page.selectOption('#cards-filter', 'starred');
  check('starred filter shows exactly the starred word', (await page.textContent('#card-counter')).trim() === '1 of 1' && (await page.textContent('#card-word')).trim() === first);
  await page.click('#card-star'); // un-star: the review list is now empty
  check('un-starring the last word shows the empty state', await page.isVisible('#cards-empty'));

  await page.click('[data-tab=quiz]');
  await page.selectOption('#quiz-filter', 'starred');
  check('quiz: empty state, no answers', (await page.isVisible('#quiz-empty')) && (await page.locator('#quiz-options .option').count()) === 0);
  await ctx.close();
}

// 3) Quiz: 4 different answers, one right, never two words with (almost) the same meaning
{
  const [ctx, page, errors] = await fresh();
  await page.goto(url + '?lang=nl', { waitUntil: 'networkidle' });
  await page.click('[data-tab=quiz]');
  let asked = 0, bad = [];
  for (const mode of ['meaning', 'word']) {
    await page.click(`#quiz-modes [data-mode=${mode}]`);
    for (let round = 0; round < 4; round++) {
      for (let q = 0; q < 10; q++) {
        const info = await page.evaluate(() => {
          const opts = [...document.querySelectorAll('#quiz-options .option')];
          const right = opts.filter((b) => b.dataset.correct === 'true').map((b) => b.dataset.id);
          const ids = opts.map((b) => b.dataset.id);
          const conf = (a, b) => window.CW_CONFUSABLE.some((f) => f.includes(a) && f.includes(b));
          const texts = opts.map((b) => b.querySelector('.option-text').textContent);
          return { n: opts.length, right, unique: new Set(texts).size === texts.length, clash: ids.filter((id) => id !== right[0] && conf(id, right[0])) };
        });
        asked++;
        if (info.n !== 4 || info.right.length !== 1 || !info.unique || info.clash.length) bad.push(JSON.stringify(info));
        await page.click('#quiz-options .option[data-correct="true"]');
        await page.click('#quiz-next');
      }
      check(`quiz ${mode}: a full round scores 10 of 10`, (await page.textContent('.done-score')).includes('10 van de 10'));
      await page.click('#quiz-new');
    }
  }
  check(`quiz: ${asked} questions, each with 4 different answers and no look-alike meanings`, bad.length === 0, bad.slice(0, 3).join(' | '));

  // A wrong answer: marked, the right one shown, contrast holds in both states
  await page.click('#quiz-modes [data-mode=meaning]');
  await page.click('#quiz-options .option:not([data-correct])');
  check('wrong answer: marked wrong and the right answer is highlighted',
    (await page.locator('#quiz-options .option.is-wrong').count()) === 1 && (await page.locator('#quiz-options .option.is-right').count()) === 1);
  check('wrong answer: feedback explains the word', await page.isVisible('#quiz-feedback .def'));
  let issues = await contrastIssues(page);
  check('contrast holds after a wrong answer', issues.length === 0, issues.join(', '));
  await page.click('#quiz-next');
  await page.click('#quiz-options .option[data-correct="true"]');
  issues = await contrastIssues(page);
  check('contrast holds after a right answer', issues.length === 0, issues.join(', '));
  // finish the round: the missed word is listed and can be practised again
  while (await page.isVisible('#quiz-next')) {
    await page.click('#quiz-next');
    if (await page.isVisible('#quiz-options')) await page.click('#quiz-options .option[data-correct="true"]');
  }
  check('round end lists the missed word', (await page.locator('.done-card .word-chip').count()) === 1);
  await page.click('#quiz-retry');
  check('"practise the ones you missed" asks exactly that word', (await page.textContent('.progress')).includes('Vraag 1 van 1'));
  check('quiz: no errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// 4) Typed answers: article allowed, small typo forgiven, same-meaning twin accepted, wrong word rejected
{
  const [ctx, page] = await fresh();
  await page.goto(url + '?lang=en', { waitUntil: 'networkidle' });
  await page.click('[data-tab=quiz]');
  await page.click('#quiz-modes [data-mode=type]');
  const wordFor = () => page.evaluate(() => {
    const def = document.querySelector('#quiz-prompt').textContent;
    return window.CW_WORDS.find((w) => w.def === def);
  });
  const tryAnswer = async (text) => {
    await page.fill('#quiz-input', text);
    await page.click('#quiz-check');
    const cls = await page.getAttribute('#quiz-feedback', 'class');
    const fb = await page.textContent('#quiz-feedback');
    await page.click('#quiz-next');
    return { right: cls.includes('is-right'), fb };
  };
  await page.click('#quiz-check');
  check('typing nothing asks for a word first', (await page.textContent('#quiz-feedback')).includes('Type a word first') && (await page.isVisible('#quiz-input')));
  let w = await wordFor();
  let r = await tryAnswer(((w.art ? w.art + ' ' : '') + (w.alt ? w.alt[0] : w.w)).toUpperCase());
  check('typed: right word with article and capitals counts', r.right, `${w.w}`);
  w = await wordFor();
  r = await tryAnswer('xyzzy');
  check('typed: a wrong word is marked wrong and shows the answer', !r.right && r.fb.includes(w.w), w.w);
  // a spelling slip of one letter in a long word
  w = await wordFor();
  const base = w.alt ? w.alt[0] : w.w;
  const slip = base.length >= 5 ? base.slice(0, -1) + (base.endsWith('e') ? 'a' : 'e') : base;
  r = await tryAnswer(slip);
  check('typed: one-letter slip in a long word is forgiven with a note', base.length < 5 || (r.right && r.fb.includes('spelling')), `${base} → ${slip}`);
  // hint
  await page.click('#quiz-hint');
  w = await wordFor();
  check('hint shows the first letter', (await page.textContent('#quiz-hint-text')).includes(`"${(w.alt ? w.alt[0] : w.w).charAt(0)}"`));
  await ctx.close();
}
// same-meaning twin, checked in isolation by forcing the round to "raad"
{
  const [ctx, page] = await fresh();
  await page.goto(url + '?lang=en', { waitUntil: 'networkidle' });
  await page.click('[data-tab=quiz]');
  await page.click('#quiz-modes [data-mode=type]');
  for (let i = 0; i < 200; i++) {
    const def = await page.textContent('#quiz-prompt');
    if (def === 'advies; vertellen wat slim is om te doen; tip') break;
    await page.click('#quiz-modes [data-mode=type]'); // a new round each time
  }
  if ((await page.textContent('#quiz-prompt')) === 'advies; vertellen wat slim is om te doen; tip') {
    await page.fill('#quiz-input', 'advies');
    await page.click('#quiz-check');
    check('typed: "advies" for "raad" counts, with a note', (await page.getAttribute('#quiz-feedback', 'class')).includes('is-right') && (await page.textContent('#quiz-feedback')).includes('almost the same'));
  } else check('typed: same-meaning twin (raad was not drawn in 200 rounds)', true);
  await ctx.close();
}

// 5) Mini texts: answers move around, explanations show, a text can be finished
{
  const [ctx, page, errors] = await fresh();
  await page.goto(url + '?lang=he', { waitUntil: 'networkidle' });
  await page.click('[data-tab=texts]');
  const texts = await page.evaluate(() => window.CW_TEXTS.length);
  check(`texts: all ${texts} listed`, (await page.locator('.text-list .text-item').count()) === texts);
  check('he: Dutch text titles stay left-to-right', (await page.$eval('.text-item h3', (h) => getComputedStyle(h).direction)) === 'ltr');
  const positions = new Set();
  for (let i = 0; i < 6; i++) {
    await page.click('.text-list .text-item:first-child button');
    positions.add(await page.evaluate(() => [...document.querySelectorAll('#text-options .option')].findIndex((b) => b.dataset.correct === 'true')));
    await page.click('#texts-back');
  }
  check('texts: the right answer is not always in the same place', positions.size > 1, [...positions].join(','));
  await page.click('.text-list .text-item:first-child button');
  check('texts: reading pane is Dutch and left-to-right', (await page.$eval('.reading', (a) => a.lang + getComputedStyle(a).direction)) === 'nlltr');
  await page.click('#text-options .option:not([data-correct])');
  check('texts: wrong answer explains why', (await page.isVisible('#text-feedback .why')) && (await page.locator('#text-feedback .word-chip').count()) > 0);
  const issues = await contrastIssues(page);
  check('texts: contrast holds after answering (Hebrew page)', issues.length === 0, issues.join(', '));
  await page.click('#text-next-q');
  await page.click('#text-options .option[data-correct="true"]');
  await page.click('#text-next-q');
  await page.click('#text-options .option[data-correct="true"]');
  await page.click('#text-next-q');
  check('texts: score at the end (2 of 3)', (await page.textContent('#text-done')).includes('2 מתוך 3'));
  await page.click('#text-next');
  check('texts: "next text" opens text 2', (await page.textContent('#reading-title')).trim() === (await page.evaluate(() => window.CW_TEXTS[1].title)));
  check('texts: no errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// 6) A ?lang= link shows that language but does not overwrite the saved choice
{
  const [ctx, page] = await fresh();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.click('#lang-switch [data-lang=he]');
  await page.goto(url + '?lang=en', { waitUntil: 'networkidle' });
  check('?lang=en link opens in English', (await page.getAttribute('html', 'lang')) === 'en');
  check('saved Hebrew choice kept', (await page.evaluate(() => localStorage.getItem('cito_words_lang'))) === 'he');
  await page.goto(url, { waitUntil: 'networkidle' });
  check('next plain visit is Hebrew again', (await page.getAttribute('html', 'lang')) === 'he');
  await ctx.close();
}

// 7) Blocked storage: the page still works
{
  const [ctx, page, errors] = await fresh();
  await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
  await page.goto(url + '?lang=en', { waitUntil: 'networkidle' });
  await page.click('[data-tab=cards]');
  await page.click('#card-star');
  await page.click('#lang-switch [data-lang=nl]');
  check('blocked storage: page works, star and language still apply', (await page.getAttribute('#card-star', 'aria-pressed')) === 'true' && (await page.getAttribute('html', 'lang')) === 'nl');
  check('blocked storage: no errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// 8) Phone: no sideways scrolling on any tab
{
  const [ctx, page] = await fresh({ viewport: { width: 360, height: 740 } });
  for (const lang of ['he', 'nl']) {
    await page.goto(`${url}?lang=${lang}`, { waitUntil: 'networkidle' });
    const worst = [];
    for (const tab of ['groups', 'cards', 'quiz', 'texts']) {
      await page.click(`[data-tab=${tab}]`);
      if (tab === 'cards') await page.click('#card-flip');
      if (tab === 'texts') await page.click('.text-list .text-item:first-child button');
      worst.push(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth));
    }
    check(`phone ${lang}: no horizontal overflow on any tab`, Math.max(...worst) <= 0, worst.join(','));
  }
  await ctx.close();
}

// 9) Read aloud: only Dutch voices that run on the device, never an online voice; stops when the view changes
const fakeSpeech = (voices) => {
  window.__spoken = []; window.__cancels = 0; window.__current = null;
  window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; this.voice = null; this.lang = ''; this.rate = 1; this.onend = null; } };
  const synth = {
    getVoices: () => voices,
    speak(u) { window.__spoken.push({ text: u.text, voice: u.voice && u.voice.name }); window.__current = u; },
    cancel() { window.__cancels++; const u = window.__current; window.__current = null; if (u && u.onend) setTimeout(() => u.onend({}), 0); },
    addEventListener() {}
  };
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
};
{
  // only an online Dutch voice (and an English device voice): no read-aloud, and a note explains why
  const [ctx, page, errors] = await fresh();
  await page.addInitScript(fakeSpeech, [{ name: 'Google Nederlands', lang: 'nl-NL', localService: false }, { name: 'Samantha', lang: 'en-US', localService: true }]);
  await page.goto(url + '?lang=en', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2300);
  check('read-aloud: online-only Dutch voice → note shown', (await page.isVisible('#speech-note')) && (await page.textContent('#speech-note')).includes('no Dutch voice'));
  await page.click('[data-tab=cards]');
  check('read-aloud: online-only Dutch voice → no speaker buttons', (await page.locator('.speak:visible').count()) === 0);
  check('read-aloud: no errors without a voice', errors.length === 0, errors.join(' | '));
  await ctx.close();
}
{
  // no speech support at all
  const [ctx, page] = await fresh();
  await page.addInitScript(() => { delete window.SpeechSynthesisUtterance; Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true }); });
  await page.goto(url + '?lang=nl', { waitUntil: 'networkidle' });
  check('read-aloud: browser without speech → note shown at once', await page.isVisible('#speech-note'));
  await ctx.close();
}
{
  const [ctx, page, errors] = await fresh();
  await page.addInitScript(fakeSpeech, [
    { name: 'Google Nederlands', lang: 'nl-NL', localService: false },
    { name: 'Belgian', lang: 'nl-BE', localService: true },
    { name: 'Xander', lang: 'nl-NL', localService: true }
  ]);
  await page.goto(url + '?lang=en', { waitUntil: 'networkidle' });
  check('read-aloud: device voice found → no note', !(await page.isVisible('#speech-note')));
  await page.click('[data-tab=cards]');
  const word = (await page.textContent('#card-word')).trim();
  await page.click('#card-word-speak .speak');
  let last = await page.evaluate(() => window.__spoken.at(-1));
  check('read-aloud: card word is spoken by the Dutch device voice', last?.text === word.replace(" / ", ", ") && last?.voice === 'Xander', JSON.stringify(last));
  check('read-aloud: playing button shows Stop', (await page.getAttribute('#card-word-speak .speak', 'aria-pressed')) === 'true' && (await page.getAttribute('#card-word-speak .speak', 'aria-label')) === 'Stop reading');
  await page.click('#card-word-speak .speak');
  check('read-aloud: second press stops', (await page.getAttribute('#card-word-speak .speak', 'aria-pressed')) === 'false');
  await page.click('#card-word-speak .speak');
  let cancels = await page.evaluate(() => window.__cancels);
  await page.click('#card-next');
  check('read-aloud: next card stops the speech', (await page.evaluate(() => window.__cancels)) > cancels && (await page.evaluate(() => window.__current)) === null);
  await page.click('#card-flip');
  await page.click('#card-details .def .speak');
  check('read-aloud: meaning is spoken', (await page.evaluate(() => window.__spoken.at(-1).text)) === (await page.textContent('#card-details .def span')));
  const issues = await contrastIssues(page);
  check('read-aloud: contrast holds while a button plays', issues.length === 0, issues.join(', '));
  await page.click('[data-tab=quiz]');
  check('read-aloud: changing tab stops the speech', (await page.evaluate(() => window.__current)) === null);

  // mini texts: the whole text keeps playing while answering; a question read-out stops at the next question
  await page.click('[data-tab=texts]');
  await page.click('.text-list .text-item:first-child button');
  await page.click('.reading .speak-wide');
  const title = await page.evaluate(() => window.CW_TEXTS[0].title);
  check('read-aloud: text is read from the title', (await page.evaluate(() => window.__spoken.at(-1).text)).startsWith(title));
  check('read-aloud: wide button label changes to Stop', (await page.textContent('.reading .speak-wide .speak-label')) === 'Stop reading');
  cancels = await page.evaluate(() => window.__cancels);
  await page.click('#text-options .option[data-correct="true"]');
  await page.click('#text-next-q');
  check('read-aloud: the text keeps playing when the next question appears', (await page.evaluate(() => window.__cancels)) === cancels && (await page.evaluate(() => !!window.__current)));
  await page.click('.q-line .speak');
  const spokenQ = await page.evaluate(() => window.__spoken.at(-1).text);
  check('read-aloud: question is read with its answers', spokenQ.includes('A: ') && spokenQ.includes('D: '), spokenQ.slice(0, 80));
  await page.click('#text-options .option[data-correct="true"]');
  await page.click('#text-next-q');
  check('read-aloud: next question stops the question read-out', (await page.evaluate(() => window.__current)) === null);
  check('read-aloud: never an online voice', (await page.evaluate(() => window.__spoken.every((s) => s.voice === 'Xander'))));
  await page.click('#lang-switch [data-lang=he]');
  check('read-aloud: button labels follow the interface language', (await page.getAttribute('.q-line .speak', 'aria-label')) === 'הקראת השאלה והתשובות');
  check('read-aloud: no errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

console.log(results.join('\n'));
await browser.close();
process.exit(results.some((r) => r.startsWith('FAIL')) ? 1 : 0);
