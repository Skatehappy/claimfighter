// verified_on support for VERIFICATION_LOG-SEO-CONTENT.md (gate A15).
//
// Format (every entry carries an ISO date, YYYY-MM-DD):
//   - table data row ........ last column, header cell "verified_on"
//   - Phase A state block ... a "- **verified_on:** YYYY-MM-DD" line directly under the "## State (XX)" heading
//   - Held-back / Remaining SECONDARY bullets ("- **...") ... a trailing "[verified_on: YYYY-MM-DD]"
// A new entry gets today's date: run `node scripts/stamp-verified-on.mjs` (fills only the MISSING dates).
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const FAIL_MONTHS = 12;
export const WARN_MONTHS = 10;

const STATE_H2 = /\(([A-Z]{2})\)/;

// -> [{ line (1-based), kind: 'row'|'block'|'bullet', label, on (string|null) }]
export function parseLogEntries(text) {
  const lines = text.replace(/\r/g, '').split('\n');
  const out = [];
  let h2 = '', h3 = '', block = null;
  const closeBlock = () => { if (block) { out.push(block); block = null; } };
  lines.forEach((l, i) => {
    let m;
    if ((m = l.match(/^## (.*)/))) {
      closeBlock(); h2 = m[1]; h3 = '';
      if (STATE_H2.test(h2) && !/Phase B|audit/i.test(h2)) block = { line: i + 1, kind: 'block', label: h2, on: null };
      return;
    }
    if ((m = l.match(/^### (.*)/))) { closeBlock(); h3 = m[1]; return; }
    if (block && (m = l.match(/^- \*\*verified_on:\*\*\s*(\S*)/))) { block.on = m[1]; return; }
    if (l.startsWith('|')) {
      const c = l.split('|').slice(1, -1).map(x => x.trim());
      if (/^[-\s:|]+$/.test(l)) return;
      if (/^citation/i.test(c[0])) { // header: must declare the verified_on column
        if (c[c.length - 1] !== 'verified_on') out.push({ line: i + 1, kind: 'row', label: 'table header lacks verified_on column', on: null });
        return;
      }
      out.push({ line: i + 1, kind: 'row', label: c[0].slice(0, 70), on: c.length >= 5 ? c[c.length - 1] : null });
      return;
    }
    if (/^- \*\*/.test(l) && /^(Held-back|Remaining SECONDARY)/.test(h3)) {
      const v = l.match(/\[verified_on:\s*([^\]]*)\]\s*$/);
      out.push({ line: i + 1, kind: 'bullet', label: l.slice(0, 70), on: v ? v[1].trim() : null });
    }
  });
  closeBlock();
  return out;
}

// date string -> UTC midnight ms (NaN when malformed / impossible)
export function dayMs(s) {
  if (!DATE_RE.test(s || '')) return NaN;
  const d = new Date(s + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s ? d.getTime() : NaN;
}

// 'fail' if on is older than FAIL_MONTHS before now, 'warn' if older than WARN_MONTHS, else 'ok'
export function staleness(on, now = new Date()) {
  const t = dayMs(on);
  if (Number.isNaN(t)) return 'invalid';
  const back = n => { const d = new Date(now.getTime()); d.setUTCMonth(d.getUTCMonth() - n); return d.getTime(); };
  if (t < back(FAIL_MONTHS)) return 'fail';
  if (t < back(WARN_MONTHS)) return 'warn';
  return 'ok';
}

// Pure evaluation (injectable `now`).
//   entries    parseLogEntries() output
//   consumers  [{ where, what, on }]  every citation/figure rendered or fed to a generator, with the
//              verified_on of the log entry it maps to (null/undefined = no date = fail)
export function evaluate({ entries, consumers = [], now = new Date() }) {
  const fail = [], warn = [];
  for (const e of entries) {
    if (!e.on) fail.push(`log line ${e.line} (${e.label}): missing verified_on`);
    else if (Number.isNaN(dayMs(e.on))) fail.push(`log line ${e.line} (${e.label}): invalid verified_on "${e.on}"`);
  }
  const seen = new Set();
  for (const c of consumers) {
    const s = staleness(c.on, now);
    const msg = `${c.where}: ${c.what} (verified_on ${c.on || 'none'})`;
    if (seen.has(msg)) continue; seen.add(msg);
    if (s === 'invalid') fail.push(`${msg} - no valid verified_on`);
    else if (s === 'fail') fail.push(`${msg} - older than ${FAIL_MONTHS} months`);
    else if (s === 'warn') warn.push(`${msg} - older than ${WARN_MONTHS} months, re-verify soon`);
  }
  return { fail, warn };
}

// Stamp every entry that lacks a date with `today` (YYYY-MM-DD). Existing dates are never touched.
export function stampMissing(text, today) {
  const crlf = text.includes('\r\n');
  const lines = text.replace(/\r/g, '').split('\n');
  const miss = new Map(parseLogEntries(text).filter(e => !e.on).map(e => [e.line, e]));
  const out = [];
  let stamped = 0;
  lines.forEach((l, i) => {
    const e = miss.get(i + 1);
    if (!e) { out.push(l); return; }
    if (e.kind === 'block') { out.push(l); return; } // heading; the dated line is inserted below
    stamped++;
    if (e.kind === 'bullet') { out.push(l.replace(/\s*\[verified_on:[^\]]*\]\s*$/, '') + ` [verified_on: ${today}]`); return; }
    if (e.label === 'table header lacks verified_on column') { out.push(l.replace(/\s*$/, '') + ' verified_on |'); return; }
    out.push(l.replace(/\s*$/, '') + ` ${today} |`);
  });
  // blocks with no verified_on line at all: insert one right under the heading
  const text2 = out.join('\n');
  const res = [];
  const ls = text2.split('\n');
  let h2 = null;
  for (let i = 0; i < ls.length; i++) {
    res.push(ls[i]);
    const m = ls[i].match(/^## (.*)/);
    if (m && STATE_H2.test(m[1]) && !/Phase B|audit/i.test(m[1]) && !/^- \*\*verified_on:\*\*/.test(ls[i + 1] || '')) {
      let has = false;
      for (let k = i + 1; k < ls.length && !/^##? /.test(ls[k]); k++) if (/^- \*\*verified_on:\*\*/.test(ls[k])) has = true;
      if (!has) { res.push(`- **verified_on:** ${today}`); stamped++; }
    }
  }
  const joined = res.join('\n');
  return { text: crlf ? joined.replace(/\n/g, '\r\n') : joined, stamped };
}
