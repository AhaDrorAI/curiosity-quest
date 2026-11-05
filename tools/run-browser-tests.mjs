// Serves dist/ on a free port and runs every browser test against it:  npm test
// Uses $CHROME_PATH if set, otherwise Playwright's Chromium (`npx playwright install chromium`).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { spawn } from 'node:child_process';

const dist = new URL('../dist/', import.meta.url).pathname;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.geojson': 'application/geo+json', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  if (path.endsWith('/')) path += 'index.html';
  try { const body = await readFile(join(dist, path)); res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' }); res.end(body); }
  catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
let failed = false;
for (const [script, ...args] of [['tools/smoke-hub.mjs'], ['tools/smoke-geo.mjs', 'tools/out'], ['tools/smoke-geo-states.mjs'], ['tools/a11y.mjs']]) {
  console.log(`\n== ${script}`);
  // run asynchronously so this process can keep serving pages to the test browser
  const code = await new Promise((resolve) => spawn('node', [script, base, ...args], { stdio: 'inherit' }).on('exit', resolve));
  if (code !== 0) failed = true;
}
server.close();
process.exit(failed ? 1 : 0);
