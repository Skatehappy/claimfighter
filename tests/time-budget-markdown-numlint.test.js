// Function time limits (mocked SLOW fetch), markdown stripping, and spelled-out number lint. No network, no access code.
import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.PAYHIP_API_KEY = 'x'; process.env.ANTHROPIC_API_KEY = 'x'; delete process.env.G4_TEST_CODE_SECRET;
process.env.CF_GEN_BUDGET_MS = '2000';   // scaled-down time: all thresholds in the handlers are ratios of this budget
process.env.CF_CL_BUDGET_MS = '1000';
const { default: generate } = await import('../api/generate.js');
const { default: checklist } = await import('../api/checklist.js');
const { stripMarkdown } = await import('../src/stripMarkdown.js');
const { extractFigures, figureSet, sentenceFigureHits, findUnsupportedFigures } = await import('../api/_numlint.js');
const { fallbackFor } = await import('../api/_checklist-fallbacks.js');

const GEN_B = 2000, CL_B = 1000;
const realFetch = globalThis.fetch;
let calls, usage;
// replies: [{ delay, stop, text, hang }] consumed per Anthropic call; a delayed/hanging call honors the abort signal.
function mockModel(replies) {
  calls = 0; usage = 0;
  globalThis.fetch = async (url, init = {}) => {
    const u = String(url);
    if (u.includes('/license/verify')) return new Response(JSON.stringify({ data: { enabled: true, product_link: 'O80Tw' } }), { status: 200 });
    if (u.includes('/license/usage')) { usage++; return new Response('{}', { status: 200 }); }
    assert.ok(u.includes('api.anthropic.com'), 'unexpected fetch ' + u);
    const r = replies[Math.min(calls++, replies.length - 1)];
    await new Promise((resolve, reject) => {
      const t = setTimeout(resolve, r.hang ? 60000 : (r.delay || 0));
      init.signal?.addEventListener('abort', () => { clearTimeout(t); reject(Object.assign(new Error('aborted'), { name: 'AbortError' })); });
    });
    return new Response(JSON.stringify({ stop_reason: r.stop || 'end_turn', content: [{ type: 'text', text: r.text ?? 'A clean letter with no figures.' }] }), { status: 200 });
  };
}
test.afterEach(() => { globalThis.fetch = realFetch; });

function callGen(body) {
  return new Promise(resolve => {
    const res = { setHeader() {}, status(c) { this.code = c; return this; }, json(o) { resolve({ code: this.code ?? 200, body: o }); }, end() { resolve({ code: this.code }); } };
    generate({ method: 'POST', body: { accessCode: 'REAL-MOCK-0001', systemPrompt: 'You write letters.', userPrompt: 'Policyholder in Texas.', state: 'Texas', ...body } }, res);
  });
}
const timed = async fn => { const t = Date.now(); const r = await fn(); return { ...r, ms: Date.now() - t }; };
const DIRTY = 'The insurer must pay within 7 business days by law. Interest is 18% under Tex. Ins. Code § 542.060. Please respond within 30 days of this letter.';

test('generate: a hung model call is aborted at the budget (502, code not used)', async () => {
  mockModel([{ hang: true }]);
  const r = await timed(() => callGen({}));
  assert.equal(r.code, 502); assert.equal(usage, 0);
  assert.ok(r.ms <= GEN_B * 1.25, `took ${r.ms}ms`);
});

test('generate: fast truncation still gets its one retry (plenty of budget left)', async () => {
  mockModel([{ stop: 'max_tokens', text: 'cut' }, { text: 'Complete letter.' }]);
  const r = await callGen({});
  assert.equal(r.code, 200); assert.equal(calls, 2); assert.equal(r.body.text, 'Complete letter.');
});

test('generate: slow truncation skips the retry (would stack past the limit) and fails clean', async () => {
  mockModel([{ stop: 'max_tokens', text: 'cut', delay: GEN_B * 0.5 }, { text: 'never used' }]);
  const r = await timed(() => callGen({}));
  assert.equal(r.code, 502); assert.equal(calls, 1); assert.equal(usage, 0);
  assert.ok(r.ms <= GEN_B * 0.8, `took ${r.ms}ms`);
});

test('generate: slow first call skips lint regeneration; unverified sentence is stripped instead', async () => {
  mockModel([{ text: DIRTY, delay: GEN_B * 0.5 }, { text: 'never used' }]);
  const r = await timed(() => callGen({}));
  assert.equal(r.code, 200); assert.equal(calls, 1);
  assert.doesNotMatch(r.body.text, /7 business days/);
  assert.match(r.body.text, /18%/);
  assert.ok(r.ms <= GEN_B * 0.8, `took ${r.ms}ms`);
});

test('generate: lint regeneration that hangs is aborted at the deadline, then stripped', async () => {
  mockModel([{ text: DIRTY }, { hang: true }]);
  const r = await timed(() => callGen({}));
  assert.equal(r.code, 200); assert.equal(calls, 2);
  assert.doesNotMatch(r.body.text, /7 business days/);
  assert.ok(r.ms <= GEN_B * 1.25, `took ${r.ms}ms`);
});

test('generate: worst-case stacking (truncation + dirty + slow) never exceeds the time budget (<=3 calls only when fast)', async () => {
  for (const replies of [
    [{ stop: 'max_tokens', delay: 200 }, { text: DIRTY, delay: 400 }, { hang: true }],
    [{ text: DIRTY, delay: 900 }, { text: DIRTY, delay: 900 }, { text: DIRTY, delay: 900 }],
    [{ stop: 'max_tokens', delay: 700 }, { stop: 'max_tokens', delay: 700 }],
  ]) {
    mockModel(replies);
    const r = await timed(() => callGen({}));
    assert.ok(calls <= 3, `calls ${calls}`);
    assert.ok(r.ms <= GEN_B * 1.25, `took ${r.ms}ms`);
  }
});

test('checklist: hung model returns the per-type fallback within the Edge budget', async () => {
  mockModel([{ hang: true }]);
  const t = Date.now();
  const res = await checklist(new Request('http://x/api/checklist', { method: 'POST', body: JSON.stringify({ accessCode: 'REAL-MOCK-0001', state: 'Texas', varianceType: 'Other', letterExcerpt: 'x' }) }));
  const ms = Date.now() - t; const j = await res.json();
  assert.equal(res.status, 200); assert.deepEqual(j.checklist, fallbackFor('Other'));
  assert.ok(ms <= CL_B * 1.3, `took ${ms}ms`);
});

test('checklist: slow truncation skips the retry and falls back (never 2 stacked slow calls)', async () => {
  mockModel([{ stop: 'max_tokens', delay: CL_B * 0.6 }, { text: '[]' }]);
  const t = Date.now();
  const res = await checklist(new Request('http://x/api/checklist', { method: 'POST', body: JSON.stringify({ accessCode: 'REAL-MOCK-0001', state: 'Texas', varianceType: 'Other', letterExcerpt: 'x' }) }));
  assert.equal(res.status, 200); assert.equal(calls, 1);
  assert.ok(Date.now() - t <= CL_B * 0.9);
});

// ---------- markdown ----------
test('stripMarkdown: headings, bold, italic, bullets, tables, fences, rules; placeholders and prose untouched', () => {
  const src = '# Title\n**I. Basis for Appeal**\n__II. Facts__\nThis is *very* important and **bold** and 5 * 3 stays.\n* first\n+ second\n\n| Item | Amount |\n|---|---|\n| Bill | $4,200 |\n\n```\ncode line\n```\n---\n[Address]\n[DATE]\nsnake_case_word stays';
  const out = stripMarkdown(src);
  assert.doesNotMatch(out, /\*\*|__|^#|```|\|/m);
  for (const s of ['Title', 'I. Basis for Appeal', 'II. Facts', 'This is very important and bold and 5 * 3 stays.', '- first', '- second', 'Item,  Amount', 'Bill,  $4,200', 'code line', '[Address]', '[DATE]', 'snake_case_word stays']) assert.ok(out.includes(s), s);
  assert.doesNotMatch(out, /^-{3,}$/m);
  assert.equal(stripMarkdown('Plain text. Nothing to do.'), 'Plain text. Nothing to do.');
  assert.equal(stripMarkdown(''), '');
});

// ---------- spelled-out numbers ----------
const keys = t => [...extractFigures(t).keys()].sort();
test('numlint extracts spelled-out days, percent, dollars, hyphenated compounds and parentheticals', () => {
  assert.deepEqual(keys('within thirty (30) days'), ['30d']);
  assert.deepEqual(keys('within thirty days'), ['30d']);
  assert.deepEqual(keys('a ten percent penalty'), ['10%']);
  assert.deepEqual(keys('ten (10) percent'), ['10%']);
  assert.deepEqual(keys('a fee of five hundred dollars'), ['$500']);
  assert.deepEqual(keys('500 dollars'), ['$500']);
  assert.deepEqual(keys('two thousand five hundred dollars'), ['$2500']);
  assert.deepEqual(keys('thirty-six months'), ['36m']);
  assert.deepEqual(keys('sixty-one days'), ['61d']);
  assert.deepEqual(keys('one hundred twenty days'), ['120d']);
  assert.deepEqual(keys('30 (thirty) days'), ['30d']);
  assert.deepEqual(keys('ten business days'), ['10bd']);
  assert.deepEqual(keys('two years'), ['2y']);
});

test('numlint: spelled-out unverified legal figures are flagged; verified, user-supplied and demand figures are not', () => {
  const allowed = figureSet(['18% interest', 'Claim of $4,200', 'the insurer must acknowledge within 15 business days', 'limitation of four years']);
  const hit = s => sentenceFigureHits(s, allowed).length;
  assert.equal(hit('Texas law gives the insurer thirty (30) days to pay.'), 1);
  assert.equal(hit('The statutory penalty is ten percent of the claim.'), 1);
  assert.equal(hit('A five hundred dollars penalty applies by statute.'), 1);
  assert.equal(hit('The rule runs thirty-six months from the loss.'), 1);
  assert.equal(hit('Interest accrues at eighteen percent per year.'), 0);        // verified (18%)
  assert.equal(hit('The insurer must respond within fifteen (15) business days.'), 0); // verified
  assert.equal(hit('You have four years to sue.'), 0);                              // verified years window
  assert.equal(hit('My claim is for four thousand two hundred dollars.'), 0);       // user-supplied $4,200
  assert.equal(hit('Please respond within thirty (30) days of receipt of this letter.'), 0); // demand deadline
  assert.equal(hit('The adjuster someone sent no one a letter.'), 0);                 // no false positive on "one"
  assert.equal(findUnsupportedFigures('one hundred twenty days', allowed).length, 1);
});
