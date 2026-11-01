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
import VERIFIED from './_verified-citations.json' with { type: 'json' };

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
    cache.set(abbr, { abbr, entries, set: toKeySet(entries.map(e => e.cite)) });
  }
  return cache.get(abbr);
}

// Server-side block appended to the system prompt: the only authorities the letter may cite.
export function citationBlock(v) {
  const list = v.entries.map(e => `- ${e.cite}${e.what ? ` — ${e.what}` : ''}`).join('\n');
  return `\n\nCITATION RULE (mandatory): you may cite ONLY the legal authorities in the verified list below${v.abbr ? ` (${v.abbr} state law plus federal law)` : ' (federal law only; the policyholder\'s state is not in our verified set, so cite NO state statute, regulation or case)'}. Do not cite, name or number any other statute, regulation, bulletin or court case, even one you believe is real. If no listed authority fits a point, make the argument from the policy language and the facts, or state the general right without a citation.\n\nVERIFIED AUTHORITIES:\n${list || '(none)'}`;
}

// Sentence splitter. Unlike scripts/data/pending.js it must not merge ordinary sentence endings
// ("...you must pay. Under..."), so only listed citation/name abbreviations suppress a split.
const ABBR = new Set(['tex', 'ins', 'code', 'stat', 'ann', 'rev', 'gen', 'cal', 'civ', 'prac', 'rem', 'comp', 'reg', 'regs', 'admin', 'fla', 'pa', 'ill', 'ga', 'ariz', 'no', 'nos', 'ch', 'sec', 'art', 'v', 'vs', 'al', 'cf', 'inc', 'co', 'ltd', 'corp', 'mr', 'mrs', 'ms', 'dr', 'st', 'dept', 'cir', 'supp', 'subch', 'para']);
function sentences(s) {
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
export function stripUnverified(text, set) {
  let removed = 0;
  const lines = text.split('\n').map(line => {
    if (!findUnverified(line, set).length) return line;
    const kept = sentences(line).filter(s => { const bad = findUnverified(s, set).length > 0; if (bad) removed++; return !bad; });
    return kept.join('').replace(/[ \t]+$/g, '');
  });
  return { text: lines.join('\n').replace(/\n{3,}/g, '\n\n').trim(), removed };
}

// Lint orchestration. regenerate(forbiddenCites) → new text (or null on failure/skip).
// Returns { text, hits, regenerated, stripped }.
export async function lintLetter(text, v, regenerate, log = console.log) {
  const first = findUnverified(text, v.set);
  if (!first.length) return { text, hits: 0, regenerated: false, stripped: 0 };
  let out = text, regenerated = false, current = first;
  const redo = await regenerate(first.map(h => h.cite));
  if (redo) {
    regenerated = true; out = redo; current = findUnverified(redo, v.set);
  }
  let stripped = 0;
  if (current.length) { const r = stripUnverified(out, v.set); out = r.text; stripped = r.removed; }
  log(JSON.stringify({ event: 'citelint', state: v.abbr || 'other', hits: first.length, cites: first.map(h => h.cite), regenerated, stripped }));
  return { text: out, hits: first.length, regenerated, stripped };
}
