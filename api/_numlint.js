// api/_numlint.js — numeric-claims check for generated letters and checklists.
//
// A dollar amount, percentage, or day/hour/week/month/year count may be stated as a legal rule only
// if it appears in the verified data for the buyer's state (VERIFIED citations + their "what" text,
// plus the Phase-B-corrected state data compiled into _verified-figures.json) or in the buyer's own
// facts / the app's own instructions. Anything else is regenerated or its sentence is stripped.
// Demand deadlines the letter sets for the insurer ("within 30 days of receipt of this letter")
// are the buyer's choice, not a statement of law, and are exempt.

// Spelled-out numbers up to 999,999: "thirty", "thirty-six", "thirty six", "one hundred twenty", "five hundred",
// "two thousand five hundred". NUM is a regex source (no capture groups); wordsToNumber() turns a match into a number.
const ONES = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };
const TEENS = { ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 };
const TENS = { twenty: 20, thirty: 30, forty: 40, fourty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const WORDNUM = { ...ONES, ...TEENS, ...TENS };
const alt = o => Object.keys(o).sort((x, y) => y.length - x.length).join('|');
const B100 = String.raw`(?:(?:${alt(TENS)})(?:[-\s]+(?:${alt(ONES)}))?|${alt(TEENS)}|${alt(ONES)})`;
const B1000 = String.raw`(?:(?:${alt(ONES)})\s+hundred(?:\s+(?:and\s+)?${B100})?|${B100})`;
const NUM = String.raw`(?:${B1000}\s+thousand(?:\s+(?:and\s+)?${B1000})?|${B1000})`;
export function wordsToNumber(str) {
  let total = 0, cur = 0;
  for (const t of String(str).toLowerCase().split(/[-\s]+/)) {
    if (t === 'and') continue;
    if (t === 'hundred') cur = (cur || 1) * 100;
    else if (t === 'thousand') { total += (cur || 1) * 1000; cur = 0; }
    else if (WORDNUM[t]) cur += WORDNUM[t];
    else return NaN;
  }
  return total + cur;
}
const toN = x => (/^[\d.,]+$/.test(x) ? parseFloat(x.replace(/,/g, '')) : wordsToNumber(x));
const UNIT = { day: 'd', hour: 'h', week: 'w', month: 'm', year: 'y' };
// optional parenthetical repeat of the number: "thirty (30) days", "30 (thirty) days", "five hundred dollars ($500)"
const PAREN = String.raw`(?:\s*\(\s*\$?(${NUM}|\d[\d,]*(?:\.\d+)?)\s*%?\s*\))?`;

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
  // "five hundred dollars", "500 dollars", "five hundred (500) dollars"
  const dollars = new RegExp(String.raw`\b(\d[\d,]*(?:\.\d+)?|${NUM})${PAREN}\s+dollars?\b`, 'gi');
  for (const m of text.matchAll(dollars)) for (const g of [m[1], m[2]]) { const n = g && toN(g); if (Number.isFinite(n) && n > 0) add('$' + n, m[0]); }
  // "10%", "ten percent", "ten (10) percent", "ten per cent"
  const pct = new RegExp(String.raw`(?<![\w.])(\d+(?:\.\d+)?|${NUM})${PAREN}\s?(?:%|percent\b|per\s?cent\b)`, 'gi');
  for (const m of text.matchAll(pct)) for (const g of [m[1], m[2]]) { const n = g && toN(g); if (Number.isFinite(n)) add(n + '%', m[0]); }
  // "30 days", "thirty days", "thirty (30) days", "thirty-six months", "ten business days"
  const dur = new RegExp(String.raw`\b(\d+|${NUM})${PAREN}[\s-]+(?:(business|working|calendar)[\s-]+)?(day|hour|week|month|year)s?\b`, 'gi');
  for (const m of text.matchAll(dur)) {
    const bd = /business|working/i.test(m[3] || '') ? 'b' : '';
    for (const g of [m[1], m[2]]) { const n = g && toN(g); if (n) add(n + bd + UNIT[m[4].toLowerCase()], m[0], true); }
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
