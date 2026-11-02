// Strict mode support for gate A15: map every citation and every figure to a dated log entry,
// and enumerate every source file that can reach a page or a generator.
import fs from 'node:fs';
import path from 'node:path';
import { extractFigures } from '../../api/_numlint.js';

export const SLUG = { california: 'CA', texas: 'TX', florida: 'FL', 'new-york': 'NY', illinois: 'IL', pennsylvania: 'PA', ohio: 'OH', georgia: 'GA', 'north-carolina': 'NC', arizona: 'AZ' };
const NAMES = { california: 'CA', texas: 'TX', florida: 'FL', 'new york': 'NY', illinois: 'IL', pennsylvania: 'PA', ohio: 'OH', georgia: 'GA', 'north carolina': 'NC', arizona: 'AZ' };
const ABBRS = new Set(Object.values(NAMES));
export const isDate = x => /^\d{4}-\d{2}-\d{2}$/.test(x || '');
const newer = (a, b) => (!a ? b : !b ? a : a > b ? a : b);

export function bucketOf(heading) {
  const h = heading.toLowerCase();
  if (/national pages/.test(h)) return 'ALL';
  const m = heading.match(/\(([A-Z]{2})\)/);
  if (m && ABBRS.has(m[1])) return m[1];
  for (const [n, a] of Object.entries(NAMES)) if (h.includes(n)) return a;
  return null;
}

// canonical figure key -> accepted aliases ("15bd" is also supported by a logged "15d")
const keysFor = k => [k, k.replace(/^(\d+)b/, '$1')];

// Map bucket -> Map(figureKey -> verified_on of the newest dated log entry that states that figure).
// Row entries carry their own date; Phase A state blocks use the block's verified_on line; the
// "Remaining SECONDARY" bullets carry a trailing [verified_on: ...].
export function figureIndex(logText) {
  const idx = {};
  const note = (bucket, text, on) => {
    if (!bucket || !isDate(on)) return;
    const m = (idx[bucket] ||= new Map());
    for (const k of extractFigures(text).keys()) m.set(k, newer(m.get(k), on));
  };
  let bucket = null, blockOn = null, inBlock = false, phaseA = false;
  for (const line of logText.replace(/\r/g, '').split('\n')) {
    const h = line.match(/^(#{2,4})\s+(.*)/);
    if (h) { bucket = bucketOf(h[2]); inBlock = h[1].length === 2 && !!bucket; blockOn = null; continue; }
    if (!bucket) continue;
    const vo = line.match(/^- \*\*verified_on:\*\*\s*(\S+)/);
    if (vo && inBlock) { blockOn = vo[1]; continue; }
    if (line.startsWith('|')) {
      const c = line.split('|').slice(1, -1).map(x => x.trim());
      if (c.length < 5 || /^[-\s:]+$/.test(c[0]) || /^citation/i.test(c[0]) || /^REMOVED/i.test(c[1])) continue;
      note(bucket, c[0] + ' ' + c[2], c[c.length - 1]);
    } else if (inBlock && /^- \*\*(Primary framework|Key verified facts)/.test(line)) {
      note(bucket, line, blockOn);
    } else if (/^- \*\*/.test(line)) {
      const v = line.match(/\[verified_on:\s*([^\]]*)\]\s*$/);
      if (v) note(bucket, line, v[1].trim());
    }
  }
  return idx;
}

// -> verified_on string, or undefined when no dated log entry states this figure in `bucket` (or ALL)
export function figureOn(idx, bucket, key) {
  for (const b of [bucket, 'ALL']) for (const k of keysFor(key)) { const on = idx[b]?.get(k); if (on) return on; }
  return undefined;
}

// Every file that can feed a rendered page or a generator, except the lint code itself.
const SKIP = /(^|\/)(_citelint\.js|_numlint\.js|_verified-[^/]*)$/;
export function* sourceFiles(root) {
  const add = [];
  const walk = (dir, exts) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p, exts); else if (exts.some(x => e.name.endsWith(x))) add.push(p);
    }
  };
  walk(path.join(root, 'scripts', 'data'), ['.json', '.js']);
  walk(path.join(root, 'scripts', 'templates'), ['.js']);
  walk(path.join(root, 'api'), ['.js', '.json']);
  walk(path.join(root, 'src'), ['.jsx', '.js']);
  for (const f of ['landing.html', 'index.html', path.join('public', 'landing.html')]) if (fs.existsSync(path.join(root, f))) add.push(path.join(root, f));
  for (const p of add) { const rel = path.relative(root, p).replaceAll(path.sep, '/'); if (!SKIP.test(rel)) yield { file: rel, abs: p }; }
}

const leaves = (o, acc = []) => { if (typeof o === 'string') acc.push(o); else if (o && typeof o === 'object') for (const k in o) leaves(o[k], acc); return acc; };

// -> [{ file, bucket, text }]  (JSON: one entry per bucket, built from string leaves; code/html: raw text)
export function sourceTexts(root, files = [...sourceFiles(root)]) {
  const out = [];
  for (const { file, abs } of files) {
    const raw = fs.readFileSync(abs, 'utf8');
    const gen = file.match(/^scripts\/data\/generated\/([^/]+)\//);
    if (gen) {
      let t = raw; try { t = leaves(JSON.parse(raw)).join('\n'); } catch {}
      out.push({ file, bucket: SLUG[gen[1]] || 'ALL', text: t });
    } else if (file === 'scripts/data/state-data.json') {
      const j = JSON.parse(raw);
      for (const [k, v] of Object.entries(j)) out.push({ file: `${file}[${k}]`, bucket: ABBRS.has(k) ? k : 'ALL', text: leaves(v).join('\n') });
    } else if (file.endsWith('.json')) {
      let t = raw; try { t = leaves(JSON.parse(raw)).join('\n'); } catch {}
      out.push({ file, bucket: 'ALL', text: t });
    } else out.push({ file, bucket: 'ALL', text: raw });
  }
  return out;
}
