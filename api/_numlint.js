// api/_numlint.js — numeric-claims check for generated letters and checklists.
//
// A dollar amount, percentage, or day/hour/week/month/year count may be stated as a legal rule only
// if it appears in the verified data for the buyer's state (VERIFIED citations + their "what" text,
// plus the Phase-B-corrected state data compiled into _verified-figures.json) or in the buyer's own
// facts / the app's own instructions. Anything else is regenerated or its sentence is stripped.
// Demand deadlines the letter sets for the insurer ("within 30 days of receipt of this letter")
// are the buyer's choice, not a statement of law, and are exempt.

const WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20, thirty: 30, forty: 40, 'forty-five': 45, sixty: 60, ninety: 90, 'one hundred twenty': 120, 'one hundred eighty': 180 };
const UNIT = { day: 'd', hour: 'h', week: 'w', month: 'm', year: 'y' };
const wordAlt = Object.keys(WORDS).sort((a, b) => b.length - a.length).map(w => w.replace('-', '[- ]')).join('|');

// → Map(canonical → sample text)
export function extractFigures(text) {
  const out = new Map();
  const add = (k, s, dur) => { if (k && !out.has(k)) out.set(k, { sample: s.trim(), dur: !!dur }); };
  const money = /\$\s?(\d(?:[\d,]*\d)?(?:\.\d+)?)(\s*(million|thousand))?/gi;
  for (const m of text.matchAll(money)) {
    let n = parseFloat(m[1].replace(/,/g, '')); if (!Number.isFinite(n)) continue;
    if (/million/i.test(m[3] || '')) n *= 1e6; else if (/thousand/i.test(m[3] || '')) n *= 1e3;
    add('$' + n, m[0]);
  }
  for (const m of text.matchAll(/(\d+(?:\.\d+)?)\s?(?:%|percent\b)/gi)) add(parseFloat(m[1]) + '%', m[0]);
  const dur = new RegExp(String.raw`\b(\d+|${wordAlt})[\s-]+(?:(business|working|calendar)[\s-]+)?(day|hour|week|month|year)s?\b`, 'gi');
  for (const m of text.matchAll(dur)) {
    const raw = m[1].toLowerCase().replace(/ /g, '-');
    const n = /^\d+$/.test(raw) ? parseInt(raw, 10) : (WORDS[raw] ?? WORDS[raw.replace(/-/g, ' ')]);
    if (!n) continue;
    const bd = /business|working/i.test(m[2] || '') ? 'b' : '';
    add(n + bd + UNIT[m[3].toLowerCase()], m[0], true);
  }
  for (const m of text.matchAll(/\b(\d+)(?:st|nd|rd|th)\s+day\b/gi)) add(m[1] + 'd', m[0], true);
  return out;
}

// Set of canonical figures found in a list of strings.
export function figureSet(strings) {
  const set = new Set();
  for (const s of strings) for (const k of extractFigures(String(s)).keys()) { set.add(k); if (k.endsWith('b' + 'd')) set.add(k.replace('bd', 'd')); }
  return set;
}
// a "15 business days" fact also supports "15 days"; "15 days" does not support "15 business days"
const supported = (k, allowed) => allowed.has(k) || allowed.has(k.replace(/^(\d+)b/, '$1'));

const DEMAND = /\b(this letter|receipt of|the date of (?:this|my)|I (?:demand|request|require|expect|will|intend)|we (?:demand|will)|please\b|respond|prior to (?:filing|taking)|otherwise)\b/i;

export function findUnsupportedFigures(text, allowed) {
  const out = [];
  for (const [k, v] of extractFigures(text)) {
    if (supported(k, allowed)) continue;
    out.push({ key: k, fig: v.sample, dur: v.dur });
  }
  return out;
}
// per-sentence variant used by the stripper: demand-deadline durations are exempt
export function sentenceFigureHits(sentence, allowed) {
  return findUnsupportedFigures(sentence, allowed).filter(h => !(h.dur && DEMAND.test(sentence)));
}
