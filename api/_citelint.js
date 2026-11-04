// api/_citelint.js — citation lock for generated letters (files prefixed "_" are not routed).
//
// Rule: a letter may cite only authorities that appear as VERIFIED/CORRECTED in the
// VERIFICATION_LOG files (compiled at build time into _verified-citations.json by
// scripts/build-verified-citations.mjs). extractCitations() is the single matcher used
// both to build that set and to lint model output, so the two sides always agree.
//
// Matching is on the citation CORE (e.g. "542.060" for "Tex. Ins. Code § 542.060(c)"),
// so a real section with a wrong subsection letter passes; an unlogged section, rule
// or case name does not. Logs carry only citation strings and counts, never letter text.
import { VERIFIED, FIGURES } from './_verified-data.js';
import { figureSet, sentenceFigureHits } from './_numlint.js';

const core = x => (x.match(/\d[\d.\-–/:]*[A-Za-z]?(?:[.\-]\d+)*/) || [''])[0].replace(/[–]/g, '-').replace(/[.\-/:]+$/, '');
const CASE_SKIP = new Set(['in', 'under', 'yes', 'see', 'the', 'inc', 'llc', 'co', 'corp', 'if', 'and', 'when', 'as', 'per', 'cf', 'also', 'after', 'because', 'following', 'landmark', 'court', 'case', 'courts', 'decision', 'ruling', 'holding']);

// → Map(key → sample text as written)
export function extractCitations(text) {
  const keys = new Map();
  const canon = k => {
    if (!k || !k.startsWith('S:')) return k;
    let v = k.slice(2).replace(/^(PA|FED)\d+-(?=\d)/, '');
    if (/^\d+\.\d+[A-Za-z]?-\d+\.\d+/.test(v)) v = v.split('-')[0];
    return 'S:' + v;
  };
  const add = (k, s) => { k = canon(k); if (k && !keys.has(k)) keys.set(k, s.trim().replace(/[.,;:]+$/, '').slice(0, 80)); };
  const pats = [
    [/§§?\s*(\d[\w.\-–:/]*)/g, m => 'S:' + core(m[1])],
    [/\b(\d+)\s*ILCS\s*([\d/.\-]+)/g, m => 'S:' + m[1] + 'ILCS' + core(m[2])],
    [/\b(\d+)\s*(?:Pa\.\s*C\.\s*S\.|P\.\s*S\.)\s*(?:§+\s*)?(\d[\d.\-]*)?/g, m => 'S:PA' + m[1] + (m[2] ? '-' + core(m[2]) : '')],
    [/\b(?:R\.\s*C\.|ORC)\s*(?:§\s*)?(\d{3,4}\.\d+)/g, m => 'S:' + m[1]],
    [/\b(?:Fla\.\s*Stat\.|Tex\.\s*[A-Z][a-z]+\.?\s*Code|Insurance Law|Ins\.\s*Law)\s+(?:§+\s*)?(\d[\d.\-]*\d)/g, m => 'S:' + core(m[1])],
    [/\bSection\s+(\d+\.\d[\d.\-]*|\d{3,}[\d.\-]*)/g, m => 'S:' + core(m[1])],
    [/\b(?:Chapter|Ch\.)\s+(\d+[A-Z]?)\b(?!\s*(?:bankruptcy|of the policy))/g, m => 'CH:' + m[1]],
    [/\b(\d+)\s*(?:U\.\s*S\.\s*C\.|USC|C\.\s*F\.\s*R\.|CFR)\s*(?:§+\s*)?(\d[\d.\-]*)?/g, m => 'S:FED' + m[1] + '-' + core(m[2] || '')],
    [/\b((?:[A-Z][A-Za-z'&.\-]*\s+){0,3}[A-Z][A-Za-z'&\-]*)\.?\s+v\.\s+([A-Z][A-Za-z'&\-]+)/g, m => {
      const pl = m[1].split(/\s+/).map(w => w.replace(/[.,]/g, '')).filter(w => w && !CASE_SKIP.has(w.toLowerCase()));
      const name = (pl[0] || m[2]).toLowerCase(); return name.length > 2 ? 'C:' + name : null;
    }],
  ];
  for (const [re, fn] of pats) for (const m of text.matchAll(re)) { const k = fn(m); if (k && !/^S:$|^S:FED\d+-$/.test(k) && k.length > 3) add(k, m[0]); }
  return keys;
}

// verified-set = Set of keys. A chapter is verified if any verified section lives in it.
export function toKeySet(citeStrings) {
  const set = new Set();
  for (const c of citeStrings) for (const k of extractCitations(c).keys()) set.add(k);
  return set;
}
function allowed(key, set) {
  if (set.has(key)) return true;
  if (key.startsWith('CH:')) { const n = key.slice(3).toLowerCase(); for (const k of set) if (k.toLowerCase().startsWith('s:' + n + '.')) return true; }
  return false;
}

export function findUnverified(text, set) {
  return [...extractCitations(text)].filter(([k]) => !allowed(k, set)).map(([k, sample]) => ({ key: k, cite: sample }));
}

// "California", "ca", "N. Carolina"… → abbr in the verified table, or '' (federal-only)
const STATE_NAMES = { california: 'CA', texas: 'TX', florida: 'FL', 'new york': 'NY', illinois: 'IL', pennsylvania: 'PA', ohio: 'OH', georgia: 'GA', 'north carolina': 'NC', arizona: 'AZ' };
export function normalizeState(s) {
  const t = String(s || '').trim().toLowerCase().replace(/[.,]/g, '');
  if (STATE_NAMES[t]) return STATE_NAMES[t];
  const up = t.toUpperCase();
  return Object.values(STATE_NAMES).includes(up) ? up : '';
}

const keySetCache = new Map();
export function verifiedFor(state, data = VERIFIED) {
  const abbr = normalizeState(state);
  if (!keySetCache.has(data)) keySetCache.set(data, new Map());
  const cache = keySetCache.get(data);
  if (!cache.has(abbr)) {
    const entries = [...(data.all || []), ...(abbr ? (data.states?.[abbr] || []) : [])];
    const figs = [...(FIGURES.all || []), ...(abbr ? (FIGURES.states?.[abbr] || []) : [])];
    cache.set(abbr, {
      abbr, entries, set: toKeySet(entries.map(e => e.cite)),
      subs: subsectionMap(entries.map(e => e.cite + ' ' + (e.what || ''))),
      figures: figs.slice(0, 80),
      figSet: figureSet(entries.map(e => e.cite + ' ' + (e.what || '')).concat(figs)),
    });
  }
  return cache.get(abbr);
}

// Server-side block appended to the system prompt: the only authorities the letter may cite.
export function citationBlock(v) {
  const list = v.entries.map(e => `- ${e.cite}${e.what ? ` — ${e.what}` : ''}`).join('\n');
  return `\n\nCITATION RULE (mandatory): you may cite ONLY the legal authorities in the verified list below${v.abbr ? ` (${v.abbr} state law plus federal law)` : ' (federal law only; the policyholder\'s state is not in our verified set, so cite NO state statute, regulation or case)'}. Do not cite, name or number any other statute, regulation, bulletin or court case, even one you believe is real. If no listed authority fits a point, make the argument from the policy language and the facts, or state the general right without a citation. Cite a pinpoint subsection (for example "(c)") ONLY if it appears in the list below; otherwise cite the section alone. NUMBERS RULE: state a dollar amount, percentage, or number of days, hours, months or years as a legal rule ONLY if it appears in the list below or in the policyholder's own facts; otherwise describe the right without a figure.\n\nVERIFIED AUTHORITIES:\n${list || '(none)'}${v.figures && v.figures.length ? `\n\nVERIFIED FIGURES (usable as legal rules): ${v.figures.join('; ')}` : ''}`;
}

// ── Subsection pin-cites ─────────────────────────────────────────────────────
// extractCitations() matches on the section number only, so "§ 542.060(f)" passed whenever
// § 542.060 was logged. A pinpoint subsection is now allowed only if the VERIFIED set records it
// (a logged "(c)" covers "(c)(1)" and vice-versa); otherwise the subsection is trimmed to the section.
const SUBRE = /(?:§§?|Section)\s*(\d[\w.\-–:/]*?)((?:\([A-Za-z0-9]{1,5}\))+)((?:\s*(?:,|and|or|&)\s*(?:\([A-Za-z0-9]{1,5}\))+)*)/g;
const secKey = s => s.replace(/[–]/g, '-').replace(/[.\-/:]+$/, '').toLowerCase();
const groups = (sub, cont) => [sub, ...(cont.match(/(?:\([A-Za-z0-9]{1,5}\))+/g) || [])].map(g => g.toLowerCase());
export function subsectionMap(strings) {
  const map = new Map();
  for (const s of strings) for (const m of String(s).matchAll(SUBRE)) {
    const k = secKey(m[1]); if (!map.has(k)) map.set(k, new Set());
    for (const g of groups(m[2], m[3])) map.get(k).add(g);
  }
  return map;
}
const subOk = (g, set) => !!set && [...set].some(x => x.startsWith(g) || g.startsWith(x));
export function findUnverifiedSubsections(text, v) {
  const out = [];
  for (const m of text.matchAll(SUBRE)) {
    const set = v.subs?.get(secKey(m[1]));
    if (!groups(m[2], m[3]).every(g => subOk(g, set))) out.push(m[0].trim());
  }
  return out;
}
export function trimUnverifiedSubsections(text, v) {
  let n = 0;
  const out = text.replace(SUBRE, (m, sec, sub, cont) => {
    const set = v.subs?.get(secKey(sec));
    if (groups(sub, cont).every(g => subOk(g, set))) return m;
    n++; return m.slice(0, m.length - sub.length - cont.length);
  });
  return { text: out, trimmed: n };
}

// Sentence splitter. Unlike scripts/data/pending.js it must not merge ordinary sentence endings
// ("...you must pay. Under..."), so only listed citation/name abbreviations suppress a split.
const ABBR = new Set(['tex', 'ins', 'code', 'stat', 'ann', 'rev', 'gen', 'cal', 'civ', 'prac', 'rem', 'comp', 'reg', 'regs', 'admin', 'fla', 'pa', 'ill', 'ga', 'ariz', 'no', 'nos', 'ch', 'sec', 'art', 'v', 'vs', 'al', 'cf', 'inc', 'co', 'ltd', 'corp', 'mr', 'mrs', 'ms', 'dr', 'st', 'dept', 'cir', 'supp', 'subch', 'para']);
export function sentences(s) {
  const out = []; let start = 0;
  const re = /[.!?]["')\]]?\s+(?=[A-Z"(§])/g; let m;
  while ((m = re.exec(s))) {
    const word = s.slice(start, m.index + 1).split(/[\s—–/(]+/).pop();
    if (/\..*\.$/.test(word) || /^\(?(§+|[A-Z]|\d+[A-Za-z]?)\.$/.test(word) || ABBR.has(word.replace(/^\(/, '').slice(0, -1).toLowerCase())) continue;
    out.push(s.slice(start, m.index + m[0].length)); start = m.index + m[0].length;
  }
  out.push(s.slice(start));
  return out;
}

// Remove every sentence that carries an unverified citation. Paragraph structure is kept.
export function stripSentences(text, isBad) {
  let removed = 0;
  const lines = text.split('\n').map(line => {
    if (!isBad(line)) return line;
    const kept = sentences(line).filter(s => { const bad = isBad(s); if (bad) removed++; return !bad; });
    return kept.join('').replace(/[ \t]+$/g, '');
  });
  return { text: lines.join('\n').replace(/\n{3,}/g, '\n\n').trim(), removed };
}
export function stripUnverified(text, set) { return stripSentences(text, s => findUnverified(s, set).length > 0); }

// Lint orchestration. regenerate(forbidden) → new text (or null on failure/skip).
// ctx = { figAllowed: Set } (optional) switches on the numeric-claims check. Returns
// { text, hits, regenerated, stripped, subsTrimmed, figHits }.
export async function lintLetter(text, v, regenerate, log = console.log, ctx = null) {
  const subFix = t => trimUnverifiedSubsections(t, v);
  const first0 = subFix(text); text = first0.text; let subsTrimmed = first0.trimmed;
  const figBad = t => (ctx?.figAllowed ? sentences(t).flatMap(s => sentenceFigureHits(s, ctx.figAllowed)) : []);
  const bad = t => [...findUnverified(t, v.set).map(h => h.cite), ...figBad(t).map(h => h.fig)];
  const first = bad(text);
  if (!first.length) {
    if (subsTrimmed) log(JSON.stringify({ event: 'citelint', state: v.abbr || 'other', hits: 0, subsTrimmed }));
    return { text, hits: 0, regenerated: false, stripped: 0, subsTrimmed, figHits: 0 };
  }
  let out = text, regenerated = false;
  const redo = await regenerate(first);
  if (redo) { const r = subFix(redo); subsTrimmed += r.trimmed; regenerated = true; out = r.text; }
  let stripped = 0;
  if (bad(out).length) { const r = stripSentences(out, s => findUnverified(s, v.set).length > 0 || figBad(s).length > 0); out = r.text; stripped = r.removed; }
  const figHits = first.filter(x => /[$%]|\d/.test(x) && !/§|v\./.test(x)).length;
  log(JSON.stringify({ event: 'citelint', state: v.abbr || 'other', hits: first.length, cites: first, regenerated, stripped, subsTrimmed, figHits }));
  return { text: out, hits: first.length, regenerated, stripped, subsTrimmed, figHits };
}
