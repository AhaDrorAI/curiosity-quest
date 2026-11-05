// Builds local map data so the site never depends on a third-party GeoJSON URL.
// Source: Natural Earth via the `world-atlas` npm package (public domain).
// Output: site/activities/western-europe/europe.geojson
//         tools/out/europe-paths.json (simplified outlines for the hub illustration)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { feature } from 'topojson-client';

const root = new URL('..', import.meta.url).pathname;
const SCALE = process.argv.includes('--50m') ? '50m' : '10m';

// Rectangle clip (Sutherland-Hodgman) so huge countries like Russia stay small.
function clipRing(ring, [minX, minY, maxX, maxY]) {
  const edges = [
    (p) => p[0] >= minX, (p) => p[0] <= maxX, (p) => p[1] >= minY, (p) => p[1] <= maxY,
  ];
  const cut = [
    (a, b) => { const t = (minX - a[0]) / (b[0] - a[0]); return [minX, a[1] + t * (b[1] - a[1])]; },
    (a, b) => { const t = (maxX - a[0]) / (b[0] - a[0]); return [maxX, a[1] + t * (b[1] - a[1])]; },
    (a, b) => { const t = (minY - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), minY]; },
    (a, b) => { const t = (maxY - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), maxY]; },
  ];
  let out = ring;
  for (let e = 0; e < 4; e++) {
    const input = out; out = [];
    if (!input.length) break;
    for (let i = 0; i < input.length; i++) {
      const cur = input[i], prev = input[(i + input.length - 1) % input.length];
      const ci = edges[e](cur), pi = edges[e](prev);
      if (ci) { if (!pi) out.push(cut[e](prev, cur)); out.push(cur); }
      else if (pi) out.push(cut[e](prev, cur));
    }
  }
  if (out.length < 4) return null;
  const f = out[0], l = out[out.length - 1];
  if (f[0] !== l[0] || f[1] !== l[1]) out.push([...f]);
  return out;
}

function clipGeometry(geom, box, digits) {
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.type === 'MultiPolygon' ? geom.coordinates : [];
  const round = (p) => [Number(p[0].toFixed(digits)), Number(p[1].toFixed(digits))];
  const result = [];
  for (const poly of polys) {
    const outer = clipRing(poly[0], box);
    if (!outer) continue;
    const holes = poly.slice(1).map((r) => clipRing(r, box)).filter(Boolean);
    // drop consecutive duplicate points created by rounding
    const tidy = (r) => r.map(round).filter((p, i, a) => i === 0 || p[0] !== a[i - 1][0] || p[1] !== a[i - 1][1]);
    const rings = [outer, ...holes].map(tidy).filter((r) => r.length >= 4);
    if (rings.length) result.push(rings);
  }
  if (!result.length) return null;
  return result.length === 1 ? { type: 'Polygon', coordinates: result[0] } : { type: 'MultiPolygon', coordinates: result };
}

const topo = JSON.parse(readFileSync(`${root}node_modules/world-atlas/countries-${SCALE}.json`, 'utf8'));
const fc = feature(topo, topo.objects.countries);

// 1) GeoJSON for the Leaflet map (wide box so panning never shows empty land)
const mapBox = [-26, 33, 32, 72];
const mapFeatures = [];
for (const f of fc.features) {
  const g = clipGeometry(f.geometry, mapBox, 3);
  if (g) mapFeatures.push({ type: 'Feature', properties: { name: f.properties.name }, geometry: g });
}
writeFileSync(`${root}site/activities/western-europe/europe.geojson`,
  JSON.stringify({ type: 'FeatureCollection', features: mapFeatures }));

// 2) Simplified SVG paths for the hub illustration (from the 50m data, enough detail for a card)
const topo50 = JSON.parse(readFileSync(`${root}node_modules/world-atlas/countries-50m.json`, 'utf8'));
const fc50 = feature(topo50, topo50.objects.countries);
const illoBox = [-11, 44.6, 18, 57.8]; // wide crop for a landscape card
const lat0 = 51 * Math.PI / 180;
const W = 400, kx = W / ((illoBox[2] - illoBox[0]) * Math.cos(lat0));
const H = Math.round((illoBox[3] - illoBox[1]) * kx);
const proj = ([lon, lat]) => [((lon - illoBox[0]) * Math.cos(lat0) * kx), ((illoBox[3] - lat) * kx)];
const highlight = ['Ireland', 'United Kingdom', 'Netherlands', 'Belgium', 'Luxembourg', 'France', 'Germany'];
const paths = { width: W, height: H, highlight: [], other: [] };
for (const f of fc50.features) {
  const g = clipGeometry(f.geometry, illoBox, 4);
  if (!g) continue;
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  let d = '';
  for (const poly of polys) for (const ring of poly) {
    const pts = ring.map(proj);
    // light decimation: drop points closer than 0.8px to the last kept point
    const kept = [pts[0]];
    for (const p of pts.slice(1)) { const q = kept[kept.length - 1]; if (Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.8) kept.push(p); }
    if (kept.length < 3) continue;
    d += 'M' + kept.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L') + 'Z';
  }
  if (d) (highlight.includes(f.properties.name) ? paths.highlight : paths.other).push(d);
}
mkdirSync(`${root}tools/out`, { recursive: true });
writeFileSync(`${root}tools/out/europe-paths.json`, JSON.stringify({ ...paths, project: { box: illoBox, kx, lat0: 51 } }));
console.log(`map features: ${mapFeatures.length}; illustration ${W}x${H}`);
