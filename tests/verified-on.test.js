// verified_on freshness (gate A15): fresh / 10-month warn / 13-month fail / missing-date fail, plus stamping.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { runCheck } from '../scripts/check-verified-on.mjs';
import { parseLogEntries, stampMissing, staleness } from '../scripts/lib/verified-on.mjs';

const LOG = fs.readFileSync(new URL('../VERIFICATION_LOG-SEO-CONTENT.md', import.meta.url), 'utf8');
const D = s => new Date(s + 'T00:00:00Z');

test('real log: every entry dated, nothing stale at 2026-11-02', async () => {
  const r = await runCheck({ now: D('2026-11-02') });
  assert.deepEqual(r.fail, []);
  assert.equal(r.warn.length, 0);
  assert.equal(r.undated, 0);
  assert.ok(r.total > 150 && r.consumers > 100);
});

test('10-month-old entries: warn (non-fatal), listed', async () => {
  const r = await runCheck({ now: D('2027-07-01') });
  assert.equal(r.fail.length, 0);
  assert.ok(r.warn.length > 0 && /older than 10 months/.test(r.warn[0]));
});

test('13-month-old entries: fail, for generator data and rendered pages', async () => {
  const r = await runCheck({ now: D('2027-12-15') });
  assert.ok(r.fail.some(f => /api\/_verified-data\.js/.test(f) && /older than 12 months/.test(f)), 'generator data');
  assert.ok(r.fail.some(f => /^public\//.test(f)), 'rendered page');
});

test('rendered page citation maps to its log entry date', async () => {
  const page = { file: 'public/texas/x/index.html', html: '<p>See Tex. Ins. Code &sect; 542.060 for interest.</p>' };
  const ok = await runCheck({ now: D('2026-11-02'), pages: [page] });
  assert.equal(ok.fail.length, 0);
  const old = await runCheck({ now: D('2027-12-15'), pages: [page] });
  assert.ok(old.fail.some(f => f.startsWith('public/texas/x/index.html')));
});

test('missing / malformed verified_on fails', async () => {
  const noRow = LOG.replace(/(\| VERIFIED[^\r\n]*?\|) 2026-11-01 \|/, '$1');
  assert.notEqual(noRow, LOG);
  let r = await runCheck({ now: D('2026-11-02'), logText: noRow });
  assert.ok(r.fail.some(f => /missing verified_on/.test(f)));
  const noBlock = LOG.replace(/- \*\*verified_on:\*\* \S+/, '');
  r = await runCheck({ now: D('2026-11-02'), logText: noBlock });
  assert.ok(r.fail.some(f => /missing verified_on/.test(f)));
  const bad = LOG.replace(/\[verified_on: 2026-11-01\]/, '[verified_on: 2026-13-45]');
  r = await runCheck({ now: D('2026-11-02'), logText: bad });
  assert.ok(r.fail.some(f => /invalid verified_on/.test(f)));
});

test('month boundaries', () => {
  assert.equal(staleness('2026-11-01', D('2027-09-01')), 'ok');
  assert.equal(staleness('2026-11-01', D('2027-09-02')), 'warn');
  assert.equal(staleness('2026-11-01', D('2027-11-01')), 'warn');
  assert.equal(staleness('2026-11-01', D('2027-11-02')), 'fail');
  assert.equal(staleness(null, D('2027-11-02')), 'invalid');
});

test('stamp: new undated entries get today, existing dates untouched, idempotent', () => {
  const newRow = LOG.trimEnd() + '\r\n| New cite | VERIFIED | x | https://example.gov |\r\n';
  const s = stampMissing(newRow, '2026-12-05');
  assert.equal(s.stamped, 1);
  assert.match(s.text, /\| New cite \| VERIFIED \| x \| https:\/\/example\.gov \| 2026-12-05 \|/);
  assert.equal(parseLogEntries(s.text).filter(e => !e.on).length, 0);
  assert.equal(stampMissing(s.text, '2030-01-01').stamped, 0);
  assert.equal(stampMissing(LOG, '2030-01-01').text, LOG);
});

// ── strict mode: nothing is skipped ──
test('strict: a page citation with no log entry FAILS', async () => {
  const page = { file: 'public/texas/x/index.html', html: '<p>See Tex. Ins. Code &sect; 999.999 and Fakecase v. Nobody.</p>' };
  const r = await runCheck({ now: D('2026-11-02'), pages: [page], sources: [] });
  assert.ok(r.fail.some(f => /UNMAPPED public\/texas\/x\/index\.html: citation .*999\.999/.test(f)), r.fail.join('\n'));
  assert.ok(r.fail.some(f => /citation .*Fakecase/.test(f)));
});

test('strict: a page figure with no log entry FAILS; a logged figure passes', async () => {
  const bad = { file: 'public/texas/x/index.html', html: '<p>The filing fee is $777 and you have 23 days.</p>' };
  const r = await runCheck({ now: D('2026-11-02'), pages: [bad], sources: [] });
  assert.ok(r.fail.some(f => /figure "\$777" has no dated log entry/.test(f)), r.fail.join('\n'));
  assert.ok(r.fail.some(f => /figure "23 days" has no dated log entry/.test(f)));
  const ok = { file: 'public/texas/x/index.html', html: '<p>Justice courts hear cases up to $20,000.</p>' };
  const r2 = await runCheck({ now: D('2026-11-02'), pages: [ok], sources: [] });
  assert.equal(r2.fail.length, 0, r2.fail.join('\n'));
});

test('strict: generator data (FIGURES) with an unlogged figure FAILS', async () => {
  const data = await import('../api/_verified-data.js');
  const bad = { ...data, FIGURES: { all: [], states: { TX: ['a 913-day wait'] } } };
  const r = await runCheck({ now: D('2026-11-02'), data: bad, pages: [], sources: [] });
  assert.ok(r.fail.some(f => /\[TX\] figures: figure "913-day"?.* has no dated log entry|figure "913/.test(f)), r.fail.join('\n'));
});

test('strict: an unlogged citation in ANY source file FAILS (json leaf, code, merged/unrendered)', async () => {
  const sources = [
    { file: 'scripts/data/generated/ohio/x.json', bucket: 'OH', text: 'R.C. 9999.99 applies.' },
    { file: 'src/App.jsx', bucket: 'ALL', text: 'cites 42 U.S.C. § 99999 here' },
    { file: 'scripts/data/generated/texas/y.json', bucket: 'TX', text: 'Tex. Ins. Code § 542.060 is logged.' },
  ];
  const r = await runCheck({ now: D('2026-11-02'), pages: [], sources });
  assert.ok(r.fail.some(f => /scripts\/data\/generated\/ohio\/x\.json: citation .*9999\.99/.test(f)), r.fail.join('\n'));
  assert.ok(r.fail.some(f => /src\/App\.jsx: citation/.test(f)));
  assert.ok(!r.fail.some(f => /generated\/texas\/y\.json/.test(f)));
});

test('strict: per-figure staleness - one stale row flags only the figures it alone supports', async () => {
  const page = { file: 'public/texas/x/index.html', html: '<p>Justice courts hear cases up to $20,000. Contract suits have a four-year period.</p>' };
  const logText = LOG.replace(/(\| Tex\. Gov't Code § 27\.031 \|[^\r\n]*\|) 2026-11-02 \|/, '$1 2025-01-01 |');
  assert.notEqual(logText, LOG);
  const r = await runCheck({ now: D('2026-11-02'), logText, pages: [page], sources: [] });
  assert.ok(r.fail.some(f => f.includes('figure "$20,000"') && /older than 12 months/.test(f)), r.fail.join('\n'));
  assert.ok(!r.fail.some(f => /four-year/.test(f)), r.fail.join('\n'));
});
