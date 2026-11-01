// Compiles the VERIFICATION_LOG files into api/_verified-citations.json: the only authorities
// the letter generator may cite (see api/_citelint.js). Run by `npm run generate:citations`
// and by the gate; commit the output so Vercel ships it.
//
// Counted: table rows whose status begins VERIFIED or CORRECTED (the NEW citation in column 1
// only), "### date — <cite>" entries in VERIFICATION_LOG.md with a VERIFIED/CORRECTED verdict,
// and the "Key verified facts" prose in the per-state sections. A citation recorded as REMOVED
// for a state is dropped from that state's prose-derived entries.
// Not counted: REMOVED / SCOPED / REQUIRES_HUMAN_JUDGMENT rows, "CORRECTED from <old>" text,
// source URLs, and sections not attributable to a state or to the national/federal set.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractCitations } from '../api/_citelint.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'api', '_verified-citations.json');
const NAMES = { california: 'CA', texas: 'TX', florida: 'FL', 'new york': 'NY', illinois: 'IL', pennsylvania: 'PA', ohio: 'OH', georgia: 'GA', 'north carolina': 'NC', arizona: 'AZ' };
const MAX_PER_STATE = 160;

const read = f => { const p = path.join(ROOT, f); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').replace(/\r/g, '') : ''; };
const clean = s => s.replace(/`/g, '').replace(/\s+/g, ' ').trim();

function bucketOf(heading) {
  const h = heading.toLowerCase();
  if (/national pages/.test(h)) return 'ALL';
  const m = heading.match(/\(([A-Z]{2})\)/);
  if (m && Object.values(NAMES).includes(m[1])) return m[1];
  for (const [n, a] of Object.entries(NAMES)) if (h.includes(n)) return a;
  return null;
}

const entries = { ALL: new Map() };     // bucket -> Map(key -> {cite, what})
const removed = {};                     // bucket -> Set(key)
const prose = {};                       // bucket -> Map(key -> entry) (subject to removal)
const put = (store, bucket, cite, what) => {
  const m = (store[bucket] ||= new Map());
  for (const k of extractCitations(cite).keys()) if (!m.has(k)) m.set(k, { cite: clean(cite).slice(0, 110), what: clean(what || '').slice(0, 140) });
};

// ── VERIFICATION_LOG-SEO-CONTENT.md ──────────────────────────────────────────
let bucket = null, inProse = false;
for (const line of read('VERIFICATION_LOG-SEO-CONTENT.md').split('\n')) {
  const h = line.match(/^(#{2,4})\s+(.*)/);
  if (h) { bucket = bucketOf(h[2]); inProse = h[1].length === 2 && !!bucket; continue; }
  if (!bucket) continue;
  if (line.startsWith('|')) {
    const c = line.split('|').slice(1, -1).map(x => x.trim());
    if (c.length < 3 || /^-+$/.test(c[0].replace(/\s/g, '')) || /^citation|^status/i.test(c[0])) continue;
    const status = c[1].toUpperCase();
    if (status.startsWith('REMOVED')) { for (const k of extractCitations(c[0]).keys()) (removed[bucket] ||= new Set()).add(k); }
    else if (status.startsWith('VERIFIED') || status.startsWith('CORRECTED')) put(entries, bucket, c[0], c[2]);
  } else if (inProse && /^- \*\*(Primary framework|Key verified facts)/.test(line)) {
    const body = line.replace(/^- \*\*[^*]+\*\*:?\s*/, '');
    for (const [, sample] of extractCitations(body)) put(prose, bucket, sample, '');
  }
}
// prose-derived entries: keep unless a REMOVED row for the same state/key (and not re-verified in a row)
for (const [b, m] of Object.entries(prose)) {
  const dest = (entries[b] ||= new Map());
  for (const [k, e] of m) if (!dest.has(k) && !(removed[b] && removed[b].has(k))) dest.set(k, e);
}

// ── VERIFICATION_LOG.md (federal / app-wide, applies to every state) ─────────
const lines = read('VERIFICATION_LOG.md').split('\n');
for (let i = 0; i < lines.length; i++) {
  const h = lines[i].match(/^###\s+\d{4}-\d{2}-\d{2}\s+—\s+(.*)/);
  if (!h) continue;
  let verdict = '', subject = '';
  for (let j = i + 1; j < lines.length && !lines[j].startsWith('### '); j++) {
    const v = lines[j].match(/\*\*Verdict:\*\*\s*(\S+)/); if (v) verdict = v[1].toUpperCase();
    const s = lines[j].match(/\*\*Subject:\*\*\s*(.*)/); if (s) subject = s[1];
  }
  if (/^(VERIFIED|CORRECTED)/.test(verdict)) put(entries, 'ALL', h[1], subject);
}

const toList = m => { const seen = new Set(); return [...(m || new Map()).values()].filter(e => !seen.has(e.cite) && seen.add(e.cite)); };
const states = {};
for (const a of Object.values(NAMES)) states[a] = toList(entries[a]).slice(0, MAX_PER_STATE);
const out = { all: toList(entries.ALL), states };
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
console.log(`verified citations: ALL ${out.all.length}; ` + Object.entries(states).map(([a, l]) => `${a} ${l.length}`).join(', '));
