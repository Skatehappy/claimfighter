// Gate A15 - verified_on freshness.
//   FAIL  any VERIFICATION_LOG-SEO-CONTENT.md entry without a valid verified_on date
//   FAIL  any citation/figure fed to a generator (api/_verified-data.js: what api/generate.js and
//         api/checklist.js receive) or rendered on a page (public/**/*.html) whose log entry is
//         verified more than 12 months before `now`
//   FAIL  (strict) any citation in a page, generator data or ANY source file, and any figure on a page or
//         in generator data, with no dated log entry
//   WARN  (non-fatal, listed) the same at more than 10 months
// `now` is injectable: runCheck({ now }) / `--now=YYYY-MM-DD`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseLogEntries, evaluate, dayMs } from './lib/verified-on.mjs';
import { extractCitations } from '../api/_citelint.js';
import { extractFigures } from '../api/_numlint.js';
import { figureIndex, figureOn, sourceTexts } from './lib/strict-sources.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = { california: 'CA', texas: 'TX', florida: 'FL', 'new-york': 'NY', illinois: 'IL', pennsylvania: 'PA', ohio: 'OH', georgia: 'GA', 'north-carolina': 'NC', arizona: 'AZ' };
const minD = (a, b) => (!a ? b : !b ? a : a < b ? a : b);

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p); else if (e.name.endsWith('.html')) yield p;
  }
}
const visibleText = html => html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&sect;/g, '§').replace(/&#167;/g, '§').replace(/\s+/g, ' ');

// STRICT: nothing is skipped. A citation (page, generator data, or ANY source file) with no dated log
// entry, and a figure (page or generator data) that no dated log entry states, are reported in
// `unmapped` and fail the gate. Each figure carries the date of the log entry that states it.
export function collectConsumers({ data, pagesDir, pages, sources, figIdx }) {
  const { VERIFIED, FIGURES } = data;
  const consumers = [], unmapped = [];
  const keyOn = { ALL: new Map() };
  const addEntries = (bucket, list) => {
    const m = (keyOn[bucket] ||= new Map());
    for (const e of list) {
      consumers.push({ where: `api/_verified-data.js [${bucket}]`, what: e.cite, on: e.on });
      for (const k of extractCitations(e.cite).keys()) m.set(k, minD(m.get(k), e.on || '0000-00-00'));
    }
  };
  addEntries('ALL', VERIFIED.all || []);
  for (const [b, list] of Object.entries(VERIFIED.states || {})) addEntries(b, list);
  const figCount = b => (b === 'ALL' ? (FIGURES.all || []) : (FIGURES.states?.[b] || [])).length;
  const figConsumer = (where, bucket, text) => {
    for (const [k, v] of extractFigures(text)) {
      const on = figIdx ? figureOn(figIdx, bucket, k) : undefined;
      if (on === undefined) unmapped.push(`${where}: figure "${v.sample}" has no dated log entry`);
      else consumers.push({ where, what: `figure "${v.sample}"`, on });
    }
  };
  for (const b of ['ALL', ...Object.keys(FIGURES.states || {})]) if (figCount(b)) for (const s of (b === 'ALL' ? (FIGURES.all || []) : FIGURES.states[b])) figConsumer(`api/_verified-data.js [${b}] figures`, b, s);

  const files = pages || (pagesDir && fs.existsSync(pagesDir) ? [...walk(pagesDir)].map(f => ({ file: path.relative(ROOT, f).replace(/\\/g, '/'), html: fs.readFileSync(f, 'utf8') })) : []);
  for (const { file, html } of files) {
    const seg = file.replace(/^public\//, '').split('/')[0];
    const bucket = SLUG[seg] || 'ALL';
    const text = visibleText(html);
    for (const [k, sample] of extractCitations(text)) {
      const on = keyOn[bucket]?.get(k) ?? keyOn.ALL.get(k);
      if (on === undefined) unmapped.push(`${file}: citation "${sample}" has no dated log entry`);
      else consumers.push({ where: file, what: sample, on: on === '0000-00-00' ? null : on });
    }
    figConsumer(file, bucket, text);
  }
  for (const { file, bucket, text } of sources || []) {
    for (const [k, sample] of extractCitations(text)) {
      const on = keyOn[bucket]?.get(k) ?? keyOn.ALL.get(k);
      if (on === undefined) unmapped.push(`${file}: citation "${sample}" has no dated log entry`);
      else consumers.push({ where: file, what: sample, on: on === '0000-00-00' ? null : on });
    }
  }
  return { consumers, unmapped };
}

export async function runCheck({ now = new Date(), logText, data, pages, sources, pagesDir = path.join(ROOT, 'public') } = {}) {
  logText ??= fs.readFileSync(path.join(ROOT, 'VERIFICATION_LOG-SEO-CONTENT.md'), 'utf8');
  data ??= await import(pathToFileURL(path.join(ROOT, 'api', '_verified-data.js')).href);
  const entries = parseLogEntries(logText);
  sources ??= sourceTexts(ROOT);
  const { consumers, unmapped } = collectConsumers({ data, pagesDir, pages, sources, figIdx: figureIndex(logText) });
  const r = evaluate({ entries, consumers, now });
  r.fail.push(...[...new Set(unmapped)].map(u => 'UNMAPPED ' + u));
  const dates = entries.map(e => e.on).filter(on => !Number.isNaN(dayMs(on)));
  const age = m => { const d = new Date(now.getTime()); d.setUTCMonth(d.getUTCMonth() - m); return d.getTime(); };
  return { ...r, total: entries.length, over10: dates.filter(d => dayMs(d) < age(10)).length, over12: dates.filter(d => dayMs(d) < age(12)).length, undated: entries.filter(e => !e.on || Number.isNaN(dayMs(e.on))).length, consumers: consumers.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const a = process.argv.find(x => x.startsWith('--now='));
  const now = a ? new Date(a.slice(6) + 'T00:00:00Z') : new Date();
  const r = await runCheck({ now });
  for (const w of r.warn) console.warn('A15 WARN - ' + w);
  if (r.fail.length) { console.error('A15 FAIL - verified_on (' + r.fail.length + '):'); for (const f of r.fail.slice(0, 40)) console.error('  ' + f); process.exit(1); }
  console.log(`A15 ok: ${r.total} log entries dated, ${r.consumers} citation/figure consumers checked, ${r.warn.length} warning(s), ${r.over10} entries >10mo, ${r.over12} >12mo`);
}
