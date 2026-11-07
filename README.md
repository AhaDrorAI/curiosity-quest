# Curiosity Quest

*Made for my kids. Open to every curious mind.*

A public hub of free learning adventures, in Hebrew, English and Dutch.
No accounts, no ads, no tracking.

[![Netlify Status](https://api.netlify.com/api/v1/badges/d1a90bec-3bdd-4141-a544-6ae4d0533566/deploy-status)](https://app.netlify.com/projects/curiosity-quest-kids/deploys)

**Live:** https://curiosity-quest-kids.netlify.app · **Code:** https://github.com/AhaDrorAI/curiosity-quest

Every push to `main` is built and published by Netlify automatically (about a minute).

| Adventure | Where it lives | Languages |
|---|---|---|
| Space adventure | https://ahadrorai.github.io/solar-system-madaim/ (separate site) | Hebrew, English |
| Western Europe | `site/activities/western-europe/` (hosted here) | Hebrew, English, Dutch, Russian |

## Everyday tasks (for a human)

- **Add an adventure:** ask an AI agent: *"Read AGENTS.md and add this activity to Curiosity Quest"*, and attach the HTML or give the link. AGENTS.md has the full checklist.
- **Change colors or fonts:** edit `site/assets/css/tokens.css`.
- **Change hub wording:** edit `site/assets/js/i18n.js` (all three languages).
- **Publish:** push to `main` on GitHub; Netlify builds and publishes it. Run `npm test` first (see AGENTS.md).

## What changed in the Western Europe activity

The original file is kept unchanged in `original/`. The hosted version:

- **Bug fixes:** the map quizzes now show their question and answer buttons (a duplicate panel was hiding them); spelling feedback follows the chosen language (a second, Hebrew-only copy of the function was overriding it); the page no longer stops working when the browser blocks storage.
- **Phone layout:** the header no longer overflows; tabs sit in their own row.
- **Removed:** the "upload test sheet / Google Drive" feature, which loaded a scan of school material from a private Drive file.
- **Privacy and reliability:** all code, fonts and country borders are now part of the site. Esri and OpenStreetMap maps still load only if chosen, with their required credit.
- **Accessibility:** map pins work with the keyboard, flashcards have a Flip button, visible focus, readable contrast, reduced-motion support, text labels instead of flag emoji.
- **Hub link:** an "All adventures" button returns to the hub; links from the hub open the activity in the hub's language (`?lang=`).

## Credits

- Country borders: [Natural Earth](https://www.naturalearthdata.com/) (public domain), via `world-atlas`.
- Map library: [Leaflet](https://leafletjs.com/) (BSD-2).
- Font: [Rubik](https://github.com/googlefonts/rubik) (SIL Open Font License).
- Illustrations: original, drawn for this project.
