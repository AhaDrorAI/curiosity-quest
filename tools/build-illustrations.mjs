// Draws the hub's original illustrations as SVG files.
// - europe.svg is drawn from real Natural Earth outlines (see build-geo.mjs), so the map is accurate.
// - space.svg is a top-down Solar System sketch.
// Both animate gently and stop moving when the visitor prefers reduced motion.
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const C = { navy: '#0F2747', ink: '#0E2240', yellow: '#FFC845', teal: '#2EC4B6', white: '#F6FAFF', sea: '#CFE9F2', land: '#E6EDF5', study: '#FFD978' };

const motionCss = (rules) => `
  <style>
    ${rules}
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
  </style>`;

// ---------- Western Europe ----------
const geo = JSON.parse(readFileSync(`${root}tools/out/europe-paths.json`, 'utf8'));
const { width: W, height: H } = geo;
const { box, kx } = geo.project;
const cos = Math.cos(51 * Math.PI / 180);
const P = (lat, lon) => [((lon - box[0]) * cos * kx), ((box[3] - lat) * kx)];

// A trail hopping between capitals of the study area
const stops = [[53.35, -6.26], [51.51, -0.13], [52.37, 4.9], [50.85, 4.35], [48.86, 2.35], [52.52, 13.4]].map(([a, b]) => P(a, b));
const trail = 'M' + stops.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L');
const pins = stops.map(([x, y], i) => `
    <g class="pin" style="animation-delay:${(i * 0.35).toFixed(2)}s">
      <path d="M${x.toFixed(1)} ${(y - 2).toFixed(1)} c-6 -8 -9 -11 -9 -16 a9 9 0 0 1 18 0 c0 5 -3 8 -9 16z" fill="${i === 2 ? C.teal : C.yellow}" stroke="${C.ink}" stroke-width="1.6"/>
      <circle cx="${x.toFixed(1)}" cy="${(y - 18).toFixed(1)}" r="3.2" fill="${C.ink}"/>
    </g>`).join('');

const compass = (cx, cy, r) => `
  <g transform="translate(${cx} ${cy})" class="compass">
    <circle r="${r}" fill="${C.white}" stroke="${C.ink}" stroke-width="1.5"/>
    <circle r="${r - 5}" fill="none" stroke="${C.ink}" stroke-width="0.8" stroke-dasharray="1.5 3"/>
    <g class="needle">
      <path d="M0 ${-r + 7} L5 0 L0 ${r - 7} L-5 0Z" fill="${C.ink}"/>
      <path d="M0 ${-r + 7} L5 0 L-5 0Z" fill="${C.teal}"/>
    </g>
    <text y="${-r - 5}" text-anchor="middle" font-family="Rubik, Arial, sans-serif" font-weight="800" font-size="12" fill="${C.ink}">N</text>
  </g>`;

const europe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Map of Western Europe">${motionCss(`
    .pin { animation: hop 3.2s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100%; }
    @keyframes hop { 0%, 70%, 100% { transform: translateY(0); } 80% { transform: translateY(-5px); } }
    .route { animation: march 18s linear infinite; }
    @keyframes march { to { stroke-dashoffset: -120; } }
    .needle { animation: sway 6s ease-in-out infinite; transform-origin: 0 0; }
    @keyframes sway { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }`)}
  <rect width="${W}" height="${H}" fill="${C.sea}"/>
  <g stroke="#9FCBDD" stroke-width="0.8" fill="none" opacity="0.8">
    ${[46, 48, 50, 52, 54, 56].map((lat) => { const y = P(lat, 0)[1].toFixed(1); return `<line x1="0" x2="${W}" y1="${y}" y2="${y}"/>`; }).join('')}
    ${[-10, -5, 0, 5, 10, 15].map((lon) => { const x = P(50, lon)[0].toFixed(1); return `<line y1="0" y2="${H}" x1="${x}" x2="${x}"/>`; }).join('')}
  </g>
  <g fill="${C.land}" stroke="#8FA6BF" stroke-width="0.7" stroke-linejoin="round">${geo.other.map((d) => `<path d="${d}"/>`).join('')}</g>
  <g fill="${C.study}" stroke="${C.ink}" stroke-width="1.1" stroke-linejoin="round">${geo.highlight.map((d) => `<path d="${d}"/>`).join('')}</g>
  <path class="route" d="${trail}" fill="none" stroke="${C.ink}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="0.1 8"/>
  ${pins}
  ${compass(W - 34, H - 36, 20)}
</svg>
`;
writeFileSync(`${root}site/assets/img/europe.svg`, europe);

// ---------- Space ----------
const SW = 400, SH = 289, sx = 200, sy = 150;
const stars = [];
let seed = 7;
const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
for (let i = 0; i < 46; i++) {
  const x = rnd() * SW, y = rnd() * SH;
  if (Math.hypot(x - sx, y - sy) < 40) continue;
  stars.push(`<circle class="${i % 3 === 0 ? 'tw' : ''}" style="animation-delay:${(rnd() * 4).toFixed(2)}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.6 + rnd() * 1.3).toFixed(2)}" fill="#DCE8FF"/>`);
}
const orbits = [42, 70, 100, 132];
const planet = (k, dur, start, body) => `
  <g transform="rotate(${start} ${sx} ${sy})"><g class="orbit" style="animation-duration:${dur}s">${body(sx + orbits[k], sy)}</g></g>`;
const space = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SW} ${SH}" role="img" aria-label="Planets circling the Sun">${motionCss(`
    .orbit { transform-origin: ${sx}px ${sy}px; animation-name: spin; animation-timing-function: linear; animation-iteration-count: infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .tw { animation: twinkle 4s ease-in-out infinite; }
    @keyframes twinkle { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
    .glow { animation: pulse 5s ease-in-out infinite; transform-origin: ${sx}px ${sy}px; }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }`)}
  <defs>
    <radialGradient id="sun" cx="0.4" cy="0.4" r="0.7"><stop offset="0" stop-color="#FFF4C2"/><stop offset="0.55" stop-color="${C.yellow}"/><stop offset="1" stop-color="#F59E0B"/></radialGradient>
    <radialGradient id="halo"><stop offset="0" stop-color="${C.yellow}" stop-opacity="0.55"/><stop offset="1" stop-color="${C.yellow}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${SW}" height="${SH}" fill="#0B1E3A"/>
  ${stars.join('')}
  <g fill="none" stroke="#5B7BB0" stroke-width="1" stroke-dasharray="2 5">${orbits.map((r) => `<circle cx="${sx}" cy="${sy}" r="${r}"/>`).join('')}</g>
  <circle class="glow" cx="${sx}" cy="${sy}" r="40" fill="url(#halo)"/>
  <circle cx="${sx}" cy="${sy}" r="21" fill="url(#sun)" stroke="${C.ink}" stroke-width="1.5"/>
  ${planet(0, 26, 200, (x, y) => `<circle cx="${x}" cy="${y}" r="5" fill="#B9C3D3" stroke="${C.ink}" stroke-width="1.2"/>`)}
  ${planet(1, 44, 320, (x, y) => `<circle cx="${x}" cy="${y}" r="9.5" fill="${C.teal}" stroke="${C.ink}" stroke-width="1.4"/><path d="M${x - 5} ${y - 3} q3 -4 7 -1 q1 4 -3 5 q-3 1 -4 -4z" fill="#2E9F5B"/><circle cx="${x + 16}" cy="${y - 6}" r="2.6" fill="#DCE3EE" stroke="${C.ink}" stroke-width="0.8"/>`)}
  ${planet(2, 70, 40, (x, y) => `<circle cx="${x}" cy="${y}" r="7" fill="#F0745A" stroke="${C.ink}" stroke-width="1.3"/>`)}
  ${planet(3, 120, 150, (x, y) => `<ellipse cx="${x}" cy="${y}" rx="25" ry="7" fill="none" stroke="#F3DFA2" stroke-width="3" transform="rotate(-20 ${x} ${y})"/><circle cx="${x}" cy="${y}" r="13" fill="${C.yellow}" stroke="${C.ink}" stroke-width="1.5"/><path d="M${x - 12} ${y - 3} h24 M${x - 11} ${y + 4} h22" stroke="#E0A53A" stroke-width="2"/>`)}
</svg>
`;
writeFileSync(`${root}site/assets/img/space.svg`, space);

// ---------- Favicon: a map pin with a spark of curiosity ----------
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="${C.navy}"/>
  <path d="M32 56 C22 43 15 36 15 26 a17 17 0 0 1 34 0 c0 10 -7 17 -17 30z" fill="${C.yellow}" stroke="${C.ink}" stroke-width="2.5"/>
  <circle cx="32" cy="26" r="7" fill="${C.teal}" stroke="${C.ink}" stroke-width="2.5"/>
</svg>
`;
writeFileSync(`${root}site/assets/img/favicon.svg`, favicon);
console.log('illustrations written');
