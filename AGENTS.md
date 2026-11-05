# Instructions for AI agents working on Curiosity Quest

Curiosity Quest is a public, static website: a hub of free learning activities ("adventures")
that a parent builds for their own children and shares with everyone.
Live site: https://curiosity-quest-kids.netlify.app (Netlify project `curiosity-quest-kids`).

Read this whole file before changing anything.

## Ground rules

- **No accounts, ads, tracking, analytics, cookies banners, databases or learner-progress systems.** Only browser storage for small conveniences (language choice, "needs review" stars).
- **No code or fonts from other websites.** Everything is bundled in `site/`. The only outside requests allowed are the optional Esri / OpenStreetMap map tiles in the geography activity, which the visitor chooses, always with their credit line.
- **Never add personal details about the children** (names, ages, schools, photos) or invent activities that don't exist.
- **Never edit the solar-system repository** (`AhaDrorAI/solar-system-madaim`). It is linked as an external adventure only.
- Do not use copyrighted material (school test sheets, publisher maps, characters, logos). The geography activity's original "upload a test sheet" feature was removed on purpose.
- The hub speaks **Hebrew (he), English (en) and Dutch (nl)**. Hebrew is right-to-left. Activities may support other languages (the geography activity also has Russian).

## Project layout

```
site/                      source of the website (what visitors get, after the build)
  index.html               the hub page (one page; cards are drawn by hub.js)
  assets/css/tokens.css    design tokens: ALL colors, sizes, fonts. Change the look here.
  assets/css/hub.css       hub layout; uses only tokens
  assets/js/catalog.js     THE CATALOG: one entry per adventure
  assets/js/i18n.js        hub text in he/en/nl, subject names, language names
  assets/js/hub.js         renders the hub (language choice, cards, about panel)
  assets/img/              illustrations (generated), favicon, share image
  assets/fonts/            Rubik, self-hosted (SIL Open Font License)
  activities/<id>/         hosted adventures, one folder each, each with index.html
tools/                     build scripts and tests (not published)
original/                  untouched copies of files as first supplied, for reference
dist/                      build output that Netlify publishes (never edit by hand)
netlify.toml               publish folder + security headers
```

## Commands

```bash
npm install                # once
npm run build              # map data, illustrations, activity CSS, share image -> dist/
npm run check              # static checks (catalog, translations, files, links)
npm run serve              # preview dist/ at http://localhost:8080
node tools/smoke-hub.mjs http://localhost:8080        # browser tests for the hub
node tools/smoke-geo.mjs http://localhost:8080 tools/out   # browser tests for the geography activity
node tools/shoot.mjs http://localhost:8080 tools/out  # screenshots to review by eye
```

Set `CHROME_PATH` if Playwright's own browser is not installed (e.g. `CHROME_PATH=/usr/bin/google-chrome`).

## How to add an adventure

1. **Decide the type.**
   - Lives on another website → `type: "external"` (opens in a new tab; the hub says so).
   - Is a single HTML page you were given → `type: "hosted"`; put it at `site/activities/<id>/index.html`.
2. **For a hosted activity:**
   - Keep a pristine copy in `original/`.
   - Add a return link to the hub: `<a href="../../">` with a visible label in the activity's languages (see the "All adventures" pill in `activities/western-europe/index.html`). Don't add a 5th button to a crowded mobile header; replace or extend an existing element.
   - Replace CDN scripts, Google Fonts and remote data files with local copies (`assets/fonts/fonts.css` already provides Rubik). If it used the Tailwind Play CDN, build its CSS with the Tailwind CLI like `tools/tailwind.config.cjs` does for western-europe and add that step to `tools/build.mjs`.
   - Guard every `localStorage` call with try/catch.
   - If the activity can start in a chosen language, have it read `?lang=` and set `langParam: "lang"` in the catalog. Only then will the hub pass its language along.
3. **Illustration:** add `site/assets/img/<id>.svg`, 400×289 viewBox, original artwork in the atlas palette from `tokens.css`. Any animation must sit inside the SVG and be switched off by `@media (prefers-reduced-motion: reduce)`. Add the drawing code to `tools/build-illustrations.mjs` if it is generated.
4. **Catalog entry** in `site/assets/js/catalog.js`: `id`, `type`, `url`, optional `langParam`, `subjects`, `languages`, `illustration`, `fallbackIcon`, and `title` / `description` / `cta` in **he, en and nl**. New subject? Add it to `CQ_SUBJECTS` in `i18n.js` in all three languages. New activity language? Add its own-language name to `CQ_LANGUAGE_NAMES`.
5. **No-JavaScript fallback:** add a link to the new `url` in the `<noscript>` list in `site/index.html` (the check enforces this).
6. Run `npm run build && npm run check`, serve, run both smoke tests, take screenshots and look at them (phone in Hebrew, desktop in English). The dotted trail extends automatically for any number of cards; verify it still looks right.
7. Deploy (below).

## Translations

- Every visible hub string lives in `CQ_TEXT` (`i18n.js`) in he, en and nl; `npm run check` fails if one is missing.
- Write natural, short, child-friendly sentences. Hebrew addresses the reader in the plural (בחרו, גלו). Avoid machine-translation stiffness; ask the owner to have a native speaker review new Dutch.
- Language names are always written in their own language (עברית, English, Nederlands, Русский) and wrapped in `<bdi>` so mixed directions don't scramble.
- Brand name "Curiosity Quest" is not translated.

## Checks before publishing

- `npm run check` passes; both smoke tests pass with no errors.
- All three hub languages read correctly; Hebrew is right-to-left and aligned to the right.
- Phone (360px) and desktop: no sideways scrolling, cards stack on phones.
- Keyboard only: Tab reaches the language switch and every card; focus ring is visible.
- Reduced motion (DevTools > Rendering > prefers-reduced-motion): illustrations stand still.
- Each card opens the right place; hosted activities have a working return link; direct activity URLs load on their own.
- Text contrast stays readable (WCAG AA: 4.5:1 for normal text).

## Deploying

The site is deployed as static files from `dist/` to the Netlify project **curiosity-quest-kids**
(site id `d1a90bec-3bdd-4141-a544-6ae4d0533566`).
- With the Netlify CLI: `npm run build && npx netlify deploy --prod --dir dist --site d1a90bec-3bdd-4141-a544-6ae4d0533566`
- Or with the Netlify MCP tool `deploy-site` using that site id.
- Access must stay **public, no password, no sign-in**. After deploying, open the live URL in a private window to confirm.
- If this folder is later connected to GitHub for automatic deploys, set the build command to `npm run build` and publish directory to `dist`; add `.netlify` to `.gitignore` (already there).

## Future: "Warm Workshop" parent mode

Planned, not built. Add a second set of token values in `tokens.css` under `:root[data-theme="workshop"]`
and a switch that sets `data-theme` on `<html>`. Content, catalog and layout must not change.
