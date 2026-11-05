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

if (errors.length) {
  console.error('Check failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log(`Check passed: ${CATALOG.length} adventures, ${LANGS.length} hub languages, ${keys.size} texts each.`);
