// Checklist + generate: truncation handling and per-claim-type content (mocked Anthropic + Payhip; no network, no test code).
//  - stop_reason "max_tokens" is never parsed: retried once with a higher limit, then fallback / 502
//  - every claim type gets its own fallback on forced failure; fallbacks carry no digits, citations or cross-type wording
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

process.env.PAYHIP_API_KEY = 'x'; process.env.ANTHROPIC_API_KEY = 'x'; delete process.env.G4_TEST_CODE_SECRET;
const CODE = 'REAL-MOCK-0001';  // a real-buyer code; Payhip is mocked below
const { default: checklist } = await import('../api/checklist.js');
const { default: generate } = await import('../api/generate.js');
const { TYPES, fallbackFor } = await import('../api/_checklist-fallbacks.js');
const { extractCitations } = await import('../api/_citelint.js');
const { extractFigures } = await import('../api/_numlint.js');

const TYPE_NAMES = Object.keys(TYPES);
const realFetch = globalThis.fetch;
let calls, usage = 0;
function mockModel(replies) {
  calls = []; usage = 0;
  globalThis.fetch = async (url, init) => {
    const u = String(url);
    if (u.includes('/license/verify')) return new Response(JSON.stringify({ data: { enabled: true, product_link: 'O80Tw' } }), { status: 200 });
    if (u.includes('/license/usage')) { usage++; return new Response('{}', { status: 200 }); }
    assert.ok(u.includes('api.anthropic.com'), 'unexpected fetch: ' + u);
    const body = JSON.parse(init.body); calls.push(body);
    const r = replies[Math.min(calls.length - 1, replies.length - 1)];
    if (r.http) return new Response('boom', { status: r.http });
    return new Response(JSON.stringify({ stop_reason: r.stop || 'end_turn', content: [{ type: 'text', text: r.text }] }), { status: 200 });
  };
}
test.afterEach(() => { globalThis.fetch = realFetch; });

const callChecklist = async (varianceType, state = 'Texas') => {
  const res = await checklist(new Request('http://x/api/checklist', { method: 'POST', body: JSON.stringify({ accessCode: CODE, state, varianceType, letterExcerpt: 'excerpt' }) }));
  return { status: res.status, ...(await res.json()) };
};
const modelItems = type => Array.from({ length: 8 }, (_, i) => `Model step ${i + 1} for ${type}: keep dated records and send copies by certified mail`);

// words that belong to one claim type only, and must not leak into the others' fallbacks
const OWN_WORDS = {
  'Life Insurance Claim Denied': /beneficiar|death certificate/i,
  'Disability Insurance Denied': /disability|independent medical/i,
  'Long-Term Care Denied': /long-term|daily activities|caregiver/i,
  'Home / Auto / Renters Claim': /contractor|body shop|adjuster|rental vehicle/i,
  'Surprise Medical Bill': /out-of-network|in-network/i,
  'Medical Bill Dispute': /itemized bill|billing codes/i,
};

test('the claim-type list covers every type the UI offers', () => {
  const src = fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  const m = src.match(/key: "claimType"[^\n]*\n\s*options: \[([^\]]+)\]/);
  const ui = [...m[1].matchAll(/"([^"]+)"/g)].map(x => x[1]);
  assert.ok(ui.length >= 8);
  for (const t of ui) assert.ok(TYPE_NAMES.includes(t), 'missing type: ' + t);
});

for (const type of TYPE_NAMES) {
  test(`checklist model path returns the model's items: ${type}`, async () => {
    mockModel([{ text: JSON.stringify(modelItems(type)) }]);
    const r = await callChecklist(type);
    assert.equal(r.status, 200);
    assert.deepEqual(r.checklist, modelItems(type));
    assert.equal(r._diag, undefined, 'real buyers never see diagnostics');
    assert.ok(calls[0].messages[0].content.includes(TYPES[type].focus), 'prompt is built for this claim type');
    assert.equal(calls[0].max_tokens, 2000);
  });

  test(`forced model failure returns this type's own fallback: ${type}`, async () => {
    mockModel([{ http: 500 }]);
    const r = await callChecklist(type);
    assert.equal(r.status, 200);
    assert.equal(r._diag, undefined);
    assert.deepEqual(r.checklist, fallbackFor(type));
    assert.ok(r.checklist.length >= 6);
  });

  test(`fallback is verified-content-only and type-specific: ${type}`, () => {
    const items = fallbackFor(type), text = items.join('\n');
    assert.ok(!/\d/.test(text), 'no digits at all');
    assert.equal(extractCitations(text).size, 0, 'cites nothing');
    assert.equal(extractFigures(text).size, 0, 'states no figures');
    assert.ok(!/deposit|landlord|tenant/i.test(text), 'no foreign-domain wording');
    for (const [other, re] of Object.entries(OWN_WORDS)) if (other !== type) assert.doesNotMatch(text, re, `${other} wording leaked into ${type}`);
  });
}

test('checklist: truncated reply is retried once with a higher limit and the partial is never parsed', async () => {
  const partial = '["PARTIAL-ONLY item one", "PARTIAL-ONLY item two", "PARTIAL-ONLY item three", "PARTIAL-ONLY item f';
  mockModel([{ stop: 'max_tokens', text: partial }, { text: JSON.stringify(modelItems('Health Insurance Denial')) }]);
  const r = await callChecklist('Health Insurance Denial');
  assert.equal(calls.length, 2);
  assert.equal(calls[0].max_tokens, 2000); assert.equal(calls[1].max_tokens, 4000);
  assert.deepEqual(r.checklist, modelItems('Health Insurance Denial'));
  assert.ok(!JSON.stringify(r).includes('PARTIAL-ONLY'));
});

test('checklist: truncated twice falls back to the type list and never uses partial output', async () => {
  const partial = '["PARTIAL-ONLY one", "PARTIAL-ONLY two", "PARTIAL-ONLY three", "PARTIAL-ONLY four"]';  // even a parseable body is ignored when truncated
  mockModel([{ stop: 'max_tokens', text: partial }]);
  const r = await callChecklist('Life Insurance Claim Denied');
  assert.equal(r.status, 200);
  assert.equal(calls.length, 2, 'exactly one retry');
  assert.deepEqual(r.checklist, fallbackFor('Life Insurance Claim Denied'));
  assert.ok(!JSON.stringify(r).includes('PARTIAL-ONLY'));
});

test('checklist: unparseable reply and thin lock survivors return the type fallback with HTTP 200', async () => {
  mockModel([{ text: 'not json at all' }]);
  assert.deepEqual((await callChecklist('Surprise Medical Bill')).checklist, fallbackFor('Surprise Medical Bill'));
  mockModel([{ text: JSON.stringify(['Cite Tex. Ins. Code § 542.999', 'You have 9 days under Texas law', 'Pay $4,321 now']) }]);
  const r = await callChecklist('Surprise Medical Bill');
  assert.equal(r.status, 200);
  assert.deepEqual(r.checklist, fallbackFor('Surprise Medical Bill'));
});

test('checklist: an unknown, missing or legacy constant type gets the neutral list', async () => {
  for (const t of [undefined, 'insurance appeal', 'Something else']) {
    mockModel([{ http: 500 }]);
    assert.deepEqual((await callChecklist(t)).checklist, fallbackFor('Other'));
  }
});

// ---- generate (Node-style handler)
function callGenerate(body) {
  return new Promise(resolve => {
    const out = { code: 200 };
    const res = { setHeader() {}, status(c) { out.code = c; return this; }, json(o) { out.body = o; resolve(out); return this; }, end() { resolve(out); return this; } };
    generate({ method: 'POST', body: { accessCode: CODE, state: 'Texas', systemPrompt: 'sys', userPrompt: 'Write the letter.', ...body }, headers: {} }, res);
  });
}

test('generate: truncated letter is retried once with a higher limit, then the full letter is used', async () => {
  const letter = 'Dear Insurer, please reconsider the denial of this claim. '.repeat(10);
  mockModel([{ stop: 'max_tokens', text: 'HALF A LETTER' }, { text: letter }]);
  const r = await callGenerate({});
  assert.equal(r.code, 200);
  assert.equal(calls[0].max_tokens, 3000); assert.equal(calls[1].max_tokens, 6000);
  assert.equal(r.body.text, letter);
  assert.ok(!JSON.stringify(r.body).includes('HALF A LETTER'));
  assert.equal(usage, 1, 'the delivered letter marks the license used');
});

test('generate: truncated twice returns 502, never the partial letter, and the license is NOT marked used', async () => {
  mockModel([{ stop: 'max_tokens', text: 'HALF A LETTER ' + 'x'.repeat(400) }]);
  const r = await callGenerate({});
  assert.equal(r.code, 502);
  assert.equal(calls.length, 2, 'exactly one retry');
  assert.ok(!JSON.stringify(r.body).includes('HALF A LETTER'));
  assert.match(r.body.error, /not been used/);
  assert.equal(usage, 0);
});

test('generate: review pass is also guarded against truncation', async () => {
  mockModel([{ stop: 'max_tokens', text: 'HALF REVIEW' }]);
  const r = await callGenerate({ reviewMode: true, draftLetter: 'Draft letter body.', systemPrompt: '', userPrompt: '' });
  assert.equal(r.code, 502);
  assert.ok(!JSON.stringify(r.body).includes('HALF REVIEW'));
  assert.equal(usage, 0);
});
