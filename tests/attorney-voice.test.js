// "No attorney voice": letters are written and signed by the claimant. Lint unit tests, generate/checklist behaviour with a
// mocked model, prompt contents and static samples/templates. No network, no access code.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.PAYHIP_API_KEY = 'x'; process.env.ANTHROPIC_API_KEY = 'x'; delete process.env.G4_TEST_CODE_SECRET;
const { default: generate } = await import('../api/generate.js');
const { default: checklist } = await import('../api/checklist.js');
const { findAttorneyVoice, SIGN_RULE } = await import('../api/_letterlint.js');
const { SIGN_RULE: CLIENT_RULE } = await import('../src/letterRules.js');
const { fallbackFor, TYPES } = await import('../api/_checklist-fallbacks.js');

test('server and client rule text are identical', () => assert.equal(SIGN_RULE, CLIENT_RULE));

const BAD = [
  'Attorney for the Claimant', 'ATTORNEY FOR the claimant', 'attorney   for the claimant', 'Attorney\nfor the Claimant', 'Attorney for the Claimant',
  'Jane Roe, Attorney for Jane Doe', 'Counsel for the Claimant', 'Sincerely,\nJ. Roe, counsel for Ms. Doe', 'Legal Counsel for the Insured',
  'John Smith, Esq.', 'John Smith ESQ', 'John Smith, esq .', 'Jane Roe, Esquire', 'ESQUIRE',
  'I write on behalf of my client', 'On  Behalf  of  my  client, Ms. Doe', 'on behalf of the client', 'on behalf of our client',
  'This firm represents Ms. Doe', 'this law firm represents the insured', 'my client was denied', 'Our client, Ms. Doe', 'Attorney at Law', 'Attorneys at law', 'Law Office of J. Roe', 'Law Offices of Roe & Roe',
  'Signed: Attorney for​the claimant', 'Jane Roe—Attorney for Jane Doe',
];
const GOOD = [
  'You may wish to consult an attorney.', 'You may wish to consult an attorney for advice on your options.', 'consider a consult with an attorney for help',
  'I may recover attorney’s fees and attorney\'s fees under the statute.', 'Brandt fees (attorney fees as damages)', 'If you hire an attorney, for example, tell us.',
  'Sincerely,\n[Your Name]', 'The insurer\'s counselor called me.', 'Please ask the insurer\'s legal counsel to respond.', 'Counsel at the insurer never replied.',
  'I am the policyholder and I am writing in my own name.', 'The attorney-client privilege does not apply.', 'The attorney general\'s office', 'Professor Esquivel',
];
test('lint detects every banned phrase and variant', () => { for (const t of BAD) assert.ok(findAttorneyVoice(t), 'missed: ' + JSON.stringify(t)); });
test('lint does not flag legitimate claimant text', () => { for (const t of GOOD) assert.equal(findAttorneyVoice(t), null, 'false positive: ' + JSON.stringify(t) + ' -> ' + findAttorneyVoice(t)); });

const realFetch = globalThis.fetch;
let calls, usage, systems;
function mockModel(replies) {
  calls = 0; usage = 0; systems = [];
  globalThis.fetch = async (url, init = {}) => {
    const u = String(url);
    if (u.includes('/license/verify')) return new Response(JSON.stringify({ data: { enabled: true, product_link: 'O80Tw' } }), { status: 200 });
    if (u.includes('/license/usage')) { usage++; return new Response('{}', { status: 200 }); }
    assert.ok(u.includes('api.anthropic.com'), 'unexpected fetch ' + u);
    const body = JSON.parse(init.body); systems.push(body.system || '');
    const r = replies[Math.min(calls++, replies.length - 1)];
    return new Response(JSON.stringify({ stop_reason: 'end_turn', content: [{ type: 'text', text: r }] }), { status: 200 });
  };
}
test.afterEach(() => { globalThis.fetch = realFetch; });
function callGen(body) {
  return new Promise(resolve => {
    const res = { setHeader() {}, status(c) { this.code = c; return this; }, json(o) { resolve({ code: this.code ?? 200, body: o }); }, end() { resolve({ code: this.code }); } };
    generate({ method: 'POST', body: { accessCode: 'REAL-MOCK-0001', systemPrompt: 'You write letters.', userPrompt: 'Policyholder in Texas.', state: 'Texas', ...body } }, res);
  });
}
const CLEAN = 'Dear Claims Department,\n\nI am appealing the denial of my claim.\n\nSincerely,\n[Your Name]';
const DIRTY = 'Dear Claims Department,\n\nI am appealing.\n\nSincerely,\nJane Roe\nAttorney for the Claimant';

test('generate: attorney voice then a clean letter -> clean letter returned, notice names the phrase, usage marked once', async () => {
  mockModel([DIRTY, CLEAN]);
  const r = await callGen({});
  assert.equal(r.code, 200); assert.equal(r.body.text, CLEAN); assert.equal(calls, 2); assert.equal(usage, 1);
  assert.match(systems[1], /Attorney for/);
  assert.ok(systems[0].includes(SIGN_RULE), 'user-signs rule is sent even for an old client prompt');
});
test('generate: attorney voice twice -> 502, usage NOT marked, offending text never returned', async () => {
  mockModel([DIRTY, DIRTY]);
  const r = await callGen({});
  assert.equal(r.code, 502); assert.equal(usage, 0); assert.equal(calls, 2);
  assert.doesNotMatch(JSON.stringify(r.body), /Attorney for the Claimant|Jane Roe/);
  assert.match(r.body.error, /Attorney for/);
});
test('generate: review mode is linted too', async () => {
  mockModel(['Reviewed.\nJohn Smith, Esq.', 'Reviewed.\nJohn Smith, Esq.']);
  const r = await callGen({ reviewMode: true, draftLetter: CLEAN, systemPrompt: '', userPrompt: '' });
  assert.equal(r.code, 502); assert.equal(usage, 0);
});
test('generate: legit "consult an attorney" text passes untouched', async () => {
  const t = 'I am appealing. You may wish to consult an attorney for advice. Sincerely,\n[Your Name]';
  mockModel([t]);
  const r = await callGen({});
  assert.equal(r.code, 200); assert.equal(r.body.text, t); assert.equal(calls, 1);
});

async function callChecklist() {
  const res = await checklist(new Request('http://x/api/checklist', { method: 'POST', body: JSON.stringify({ accessCode: 'REAL-MOCK-0001', state: 'Texas', varianceType: 'Health Insurance Denial', letterExcerpt: 'x' }) }));
  return { code: res.status, body: await res.json() };
}
test('checklist: an item with attorney voice discards the model list for the type fallback', async () => {
  const items = Array.from({ length: 8 }, (_, i) => `Keep a copy of document number ${i} for your records`); items[3] = 'Have our client sign the form';
  mockModel([JSON.stringify(items)]);
  const r = await callChecklist();
  assert.equal(r.code, 200); assert.deepEqual(r.body.checklist, fallbackFor('Health Insurance Denial'));
});
test('checklist: a clean model list is kept', async () => {
  const items = Array.from({ length: 8 }, (_, i) => `Keep a copy of document number ${i} for your records`);
  mockModel([JSON.stringify(items)]);
  const r = await callChecklist();
  assert.deepEqual(r.body.checklist, items);
});
test('checklist fallbacks (every type) contain no attorney voice', () => {
  for (const k of Object.keys(TYPES)) for (const s of fallbackFor(k)) assert.equal(findAttorneyVoice(s), null, k + ': ' + s);
});

test('every claim-type prompt has the user-signs rule, a non-attorney persona and no banned phrase', () => {
  const src = fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  assert.match(src, /import \{ SIGN_RULE \} from "\.\/letterRules\.js"/);
  const found = [...src.matchAll(/const (\w*[sS]ystemPrompt|surpriseBillPrompt) = `([\s\S]*?)`;/g)];
  assert.equal(found.length, 6, 'expected the 6 claim-type prompts');
  for (const [, name, body] of found) {
    const text = body.split('${SIGN_RULE}').join(SIGN_RULE);
    assert.ok(text.includes(SIGN_RULE), name + ' lacks the rule');
    assert.match(text, /^You are an expert insurance-appeal letter writer/, name);
    assert.doesNotMatch(text, /appeal attorney|insurance attorney|law firm for/i, name);
    assert.equal(findAttorneyVoice(text), null, name);
  }
  assert.doesNotMatch(src, /expert insurance appeal attorney/i);
});

test('static samples, templates and pages contain no attorney voice', () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (['node_modules', '.git', 'dist'].includes(e.name) ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
  const files = [...['public', 'scripts', 'src', 'api'].flatMap(d => walk(path.join(root, d))), path.join(root, 'landing.html'), path.join(root, 'index.html')]
    .filter(p => /\.(html|js|mjs|jsx|json)$/.test(p) && !/_letterlint.js$|api.generate.js$/.test(p) && !/_verified-/.test(p));
  assert.ok(files.length > 100);
  for (const p of files) { const h = findAttorneyVoice(fs.readFileSync(p, 'utf8')); assert.equal(h, null, p + ' -> ' + h); }
});
