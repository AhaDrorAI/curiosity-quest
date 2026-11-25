// Static checks that run without a browser:  npm run check
// Catches the mistakes that are easy to make when adding an adventure or a translation.
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url).pathname;
const errors = [];
const fail = (msg) => errors.push(msg);

// Load the browser scripts in a sandbox to read their data
const sandbox = { window: {} };
vm.createContext(sandbox);
for (const f of ['site/assets/js/i18n.js', 'site/assets/js/catalog.js']) {
  vm.runInContext(readFileSync(root + f, 'utf8'), sandbox, { filename: f });
}
const { CQ_HUB_LANGUAGES: LANGS, CQ_TEXT: TEXT, CQ_SUBJECTS: SUBJECTS, CQ_LANGUAGE_NAMES: NAMES, CQ_CATALOG: CATALOG } = sandbox.window;

// 1) Every hub text exists in every hub language
const keys = new Set(Object.values(TEXT).flatMap((t) => Object.keys(t)));
for (const lang of LANGS) {
  if (!TEXT[lang]) { fail(`i18n: language "${lang}" has no text block`); continue; }
  for (const k of keys) if (TEXT[lang][k] === undefined || TEXT[lang][k] === '') fail(`i18n: "${k}" is missing in ${lang}`);
}
for (const [key, tr] of Object.entries(SUBJECTS)) for (const lang of LANGS) if (!tr[lang]) fail(`subject "${key}" has no ${lang} name`);

// 2) Catalog entries are complete and point at real files
const html = readFileSync(root + 'site/index.html', 'utf8');
const ids = new Set();
for (const e of CATALOG) {
  const where = `catalog "${e.id}"`;
  if (!/^[a-z0-9-]+$/.test(e.id || '')) fail(`${where}: id must be lowercase letters, digits and dashes`);
  if (ids.has(e.id)) fail(`${where}: duplicate id`); ids.add(e.id);
  if (!['hosted', 'external'].includes(e.type)) fail(`${where}: type must be "hosted" or "external"`);
  for (const field of ['title', 'description', 'cta']) for (const lang of LANGS) if (!e[field]?.[lang]) fail(`${where}: ${field} missing in ${lang}`);
  if (!e.languages?.length) fail(`${where}: list at least one language`);
  for (const l of e.languages || []) if (!NAMES[l]) fail(`${where}: language "${l}" needs a name in CQ_LANGUAGE_NAMES`);
  for (const s of e.subjects || []) if (!SUBJECTS[s]) fail(`${where}: subject "${s}" is not defined in CQ_SUBJECTS`);
  if (!existsSync(root + 'site/' + e.illustration)) fail(`${where}: illustration ${e.illustration} not found`);
  if (e.type === 'hosted') {
    if (!e.url.endsWith('/') || e.url.startsWith('/') || e.url.startsWith('http')) fail(`${where}: hosted url must be relative and end with "/" (e.g. activities/${e.id}/)`);
    else if (!existsSync(root + 'site/' + e.url + 'index.html')) fail(`${where}: site/${e.url}index.html not found`);
    else {
      const page = readFileSync(root + 'site/' + e.url + 'index.html', 'utf8');
      if (!page.includes('href="../../"')) fail(`${where}: the activity has no return link to the hub (href="../../")`);
      if (/https:\/\/(cdn\.tailwindcss\.com|unpkg\.com|fonts\.googleapis\.com|cdn\.jsdelivr\.net|raw\.githubusercontent\.com)/.test(page)) fail(`${where}: loads code or fonts from another site; bundle them locally`);
    }
  }
  if (e.type === 'external' && !/^https:\/\//.test(e.url)) fail(`${where}: external url must start with https://`);
  if (!html.includes(`href="${e.url}"`)) fail(`${where}: add a link to ${e.url} in the <noscript> list in site/index.html`);
}

// 3) Cito words: the word list and the practice texts are complete and consistent
{
  const cw = { window: {} };
  vm.createContext(cw);
  for (const f of ['site/activities/cito-words/words.js', 'site/activities/cito-words/texts.js']) {
    vm.runInContext(readFileSync(root + f, 'utf8'), cw, { filename: f });
  }
  const { CW_WORDS: W, CW_GROUPS: G, CW_CONFUSABLE: CONF, CW_SAME_MEANING: SAME, CW_TEXTS: T } = cw.window;
  const ids = new Set(), words = new Set();
  for (const w of W) {
    const where = `cito word "${w.id}"`;
    if (!/^[a-z-]+$/.test(w.id || '')) fail(`${where}: id must be lowercase letters and dashes`);
    if (ids.has(w.id)) fail(`${where}: duplicate id`); ids.add(w.id);
    if (words.has(w.w)) fail(`${where}: the word "${w.w}" is listed twice`); words.add(w.w);
    for (const k of ['w', 'def', 'ex', 'he', 'en']) if (!w[k]) fail(`${where}: "${k}" is missing`);
    if (!['', 'de', 'het'].includes(w.art)) fail(`${where}: art must be "de", "het" or ""`);
    if (!G[w.g]) fail(`${where}: group "${w.g}" is not in CW_GROUPS`);
    if (w.w.includes('/') || w.w.includes('(')) if (!w.alt?.length) fail(`${where}: "${w.w}" has several forms; list them in alt`);
  }
  for (const [g, names] of Object.entries(G)) {
    for (const l of LANGS) if (!names[l]) fail(`cito group "${g}" has no ${l} name`);
    if (!W.some((w) => w.g === g)) fail(`cito group "${g}" has no words`);
  }
  for (const fam of [...CONF, ...SAME]) for (const id of fam) if (!ids.has(id)) fail(`cito confusable list names unknown word "${id}"`);
  // a quiz needs 3 wrong answers that are not confusable with the right one
  const conf = (a, b) => CONF.some((f) => f.includes(a) && f.includes(b));
  for (const w of W) if (W.filter((o) => o.id !== w.id && !conf(o.id, w.id) && o.def !== w.def).length < 3) fail(`cito word "${w.id}": fewer than 3 possible wrong answers`);
  const defs = new Map();
  for (const w of W) { if (defs.has(w.def) && !conf(w.id, defs.get(w.def))) fail(`cito words "${w.id}" and "${defs.get(w.def)}" share a definition but are not marked confusable`); defs.set(w.def, w.id); }
  const tids = new Set();
  for (const tx of T) {
    const where = `cito text "${tx.id}"`;
    if (tids.has(tx.id)) fail(`${where}: duplicate id`); tids.add(tx.id);
    if (!tx.title || !tx.body?.length || !tx.qs?.length) fail(`${where}: needs a title, body and questions`);
    tx.qs.forEach((q, i) => {
      if (!q.q || !q.why) fail(`${where} question ${i + 1}: needs q and why`);
      if (!Array.isArray(q.opts) || q.opts.length < 2 || q.opts.length > 4) fail(`${where} question ${i + 1}: needs 2 to 4 answers`);
      else if (!(q.a >= 0 && q.a < q.opts.length)) fail(`${where} question ${i + 1}: answer index ${q.a} is out of range`);
      if (new Set(q.opts).size !== q.opts.length) fail(`${where} question ${i + 1}: two answers are the same`);
      for (const id of q.words || []) if (!ids.has(id)) fail(`${where} question ${i + 1}: unknown word "${id}"`);
    });
  }
  // the hub card states how many words there are
  const card = CATALOG.find((e) => e.id === 'cito-words');
  for (const lang of LANGS) {
    const n = card?.description?.[lang]?.match(/\d+/)?.[0];
    if (n && Number(n) !== W.length) fail(`catalog "cito-words": the ${lang} description says ${n} words, the list has ${W.length}`);
  }
}

if (errors.length) {
  console.error('Check failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log(`Check passed: ${CATALOG.length} adventures, ${LANGS.length} hub languages, ${keys.size} texts each.`);
