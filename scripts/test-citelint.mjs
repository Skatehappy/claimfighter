// Mock test for the citation lock (S7) and the G4T test-code path (S6).
// Stubs global fetch: NO Payhip call, NO Anthropic call, no real code is used or burned.
// Run: node scripts/test-citelint.mjs   (exit 1 on any failure)
process.env.PAYHIP_API_KEY = 'stub-payhip';
process.env.ANTHROPIC_API_KEY = 'stub-anthropic';
const SECRET = 'unit-test-secret-0123456789';   // test-process only; never a deployed value

const calls = { anthropic: [], payhipVerify: 0, payhipUsage: 0 };
let anthropicReplies = [];
globalThis.fetch = async (url, opts = {}) => {
  const u = String(url);
  if (u.includes('api.anthropic.com')) {
    calls.anthropic.push(JSON.parse(opts.body));
    const text = anthropicReplies.shift() ?? 'Stub letter with no citations.';
    return { ok: true, status: 200, json: async () => ({ content: [{ type: 'text', text }], stop_reason: 'end_turn' }), text: async () => '' };
  }
  if (u.includes('license/verify')) { calls.payhipVerify++; return { status: 200, json: async () => ({ data: { enabled: true, product_link: 'O80Tw' } }) }; }
  if (u.includes('license/usage')) { calls.payhipUsage++; return { status: 200, json: async () => ({}) }; }
  throw new Error('unexpected fetch ' + u);
};
const logs = [];
const realLog = console.log; console.log = (...a) => logs.push(a.join(' '));

const { default: handler } = await import('../api/generate.js');
const { extractCitations, toKeySet, verifiedFor } = await import('../api/_citelint.js');

function call(body) {
  return new Promise(resolve => {
    const res = { headers: {}, setHeader() {}, status(c) { this.code = c; return this; }, json(o) { resolve({ code: this.code ?? 200, body: o }); }, end() { resolve({ code: this.code }); } };
    handler({ method: 'POST', body }, res);
  });
}
const reset = () => { calls.anthropic = []; calls.payhipVerify = 0; calls.payhipUsage = 0; logs.length = 0; };
let failed = 0;
const ok = (cond, msg) => { if (!cond) { failed++; realLog('FAIL  ' + msg); } else realLog('ok    ' + msg); };

const FAKE_STAT = 'Tex. Ins. Code § 542.999';
const FAKE_CASE = 'Smith v. Imaginary Mutual Insurance Co.';
const REAL = 'Tex. Ins. Code § 542.060';
const dirty = `Re: Claim 123\n\nYour delay violates ${REAL}, which sets 18% interest. It also violates ${FAKE_STAT}. As held in ${FAKE_CASE}, bad faith is actionable. Please pay within 30 days.`;
const code = 'G4T-' + SECRET;
const base = { systemPrompt: 'You are a letter writer.', userPrompt: 'Write it.', state: 'Texas' };

// extractor sanity: real TX cite is in the verified TX set, the fakes are not
const tx = verifiedFor('Texas');
ok(tx.set.has('S:542.060'), 'verified TX set contains § 542.060');
ok(!tx.set.has('S:542.999') && !tx.set.has('C:smith'), 'verified TX set lacks the fake statute and fake case');
ok(extractCitations(dirty).has('S:542.999') && extractCitations(dirty).has('C:smith'), 'extractor finds the fake statute and fake case');

// S6: inert without the env var
delete process.env.G4_TEST_CODE_SECRET; reset();
let r = await call({ ...base, accessCode: code });
ok(r.code === 200 && calls.payhipVerify === 1, 'G4T code is inert when G4_TEST_CODE_SECRET is unset (goes through Payhip verify like any code)');
process.env.G4_TEST_CODE_SECRET = 'short'; reset();
await call({ ...base, accessCode: 'G4T-short' });
ok(calls.payhipVerify === 1, 'a secret shorter than 16 chars is ignored (inert)');

// S6: enabled
process.env.G4_TEST_CODE_SECRET = SECRET; reset();
r = await call({ accessCode: code, systemPrompt: 'Reply: VALID', userPrompt: 'check' });
ok(r.code === 200 && r.body.text === 'VALID' && calls.anthropic.length === 0 && calls.payhipVerify === 0, 'G4T gate-check: 200 VALID, no Payhip, no model call');
reset(); anthropicReplies = ['Clean letter citing ' + REAL + '.'];
r = await call({ ...base, accessCode: code });
ok(r.code === 200 && calls.payhipVerify === 0 && calls.payhipUsage === 0, 'G4T generation skips Payhip verify and usage-mark');
ok(logs.some(l => l.includes('"event":"g4t_use"') && !l.includes(SECRET)), 'G4T use is logged without the secret');
reset(); anthropicReplies = ['x'];
r = await call({ ...base, accessCode: 'G4T-wrong-secret-0123456789' });
ok(calls.payhipVerify === 1 && calls.payhipUsage === 1, 'wrong G4T secret is treated as an ordinary code (Payhip verify + usage-mark run)');

// S7: lock block reaches the model; verified cites are listed, nothing else
reset(); anthropicReplies = ['Clean letter citing ' + REAL + '.'];
r = await call({ ...base, accessCode: code });
const sys = calls.anthropic[0].system;
ok(sys.includes('CITATION RULE') && sys.includes('542.060') && !sys.includes('542.999'), 'system prompt carries the verified list for TX (and not the fake)');
ok(calls.anthropic.length === 1 && r.body.text.includes(REAL), 'a letter with only verified citations passes untouched (1 model call)');

// S7: fake citation, regeneration also dirty → sentences stripped, verified kept
reset(); anthropicReplies = [dirty, dirty];
r = await call({ ...base, accessCode: code });
ok(calls.anthropic.length === 2, 'fake citation triggers exactly one regeneration');
ok(calls.anthropic[1].system.includes('do NOT cite') && calls.anthropic[1].system.includes('542.999'), 'regeneration instruction names the forbidden citation');
ok(!r.body.text.includes('542.999') && !/Imaginary/.test(r.body.text), 'fake statute and fake case are stripped from the output');
ok(r.body.text.includes(REAL) && r.body.text.includes('Please pay within 30 days'), 'verified citation and non-citing sentences survive the strip');
const log = logs.find(l => l.includes('"event":"citelint"'));
realLog(log);
ok(log && JSON.parse(log).hits === 2 && JSON.parse(log).stripped >= 1 && !log.includes('Please pay'), 'hit is logged (citations/counts only, no letter text)');

// S7: regeneration comes back clean → used as-is, no strip
reset(); anthropicReplies = [dirty, `Clean rewrite citing ${REAL}.`];
r = await call({ ...base, accessCode: code });
ok(calls.anthropic.length === 2 && r.body.text === `Clean rewrite citing ${REAL}.`, 'clean regeneration is returned as-is');

// S7: review pass is linted too
reset(); anthropicReplies = [dirty, dirty];
r = await call({ accessCode: code, systemPrompt: '', userPrompt: '', reviewMode: true, draftLetter: 'draft', state: 'TX' });
ok(!r.body.text.includes('542.999'), 'review-mode output is linted');

// S7: a state outside the verified table gets federal law only
reset(); anthropicReplies = [`Per ${REAL} you must pay. Under 29 CFR § 2560.503-1(h)(3)(i) I have 180 days to appeal.`, `Per ${REAL} you must pay. Under 29 CFR § 2560.503-1(h)(3)(i) I have 180 days to appeal.`];
r = await call({ ...base, state: 'Connecticut', accessCode: code });
ok(!r.body.text.includes('542.060') && r.body.text.includes('2560.503-1'), 'unlisted state: state cite stripped, federal verified cite kept');
ok(calls.anthropic[0].system.includes('federal law only'), 'unlisted state prompt says federal law only');

// real buyer code path unchanged: verify + usage-mark happen
reset(); anthropicReplies = ['Clean letter.'];
r = await call({ ...base, accessCode: 'REAL-LOOKING-CODE' });
ok(r.code === 200 && calls.payhipVerify === 1 && calls.payhipUsage === 1, 'ordinary code: Payhip verify + usage-mark still run');

// S6: daily cap
reset();
let last;
for (let i = 0; i < 40; i++) { anthropicReplies = ['ok']; last = await call({ ...base, accessCode: code }); if (last.code === 429) break; }
ok(last.code === 429, 'G4T is capped (429 once the daily call cap is reached)');

console.log = realLog;
if (failed) { console.error(`\n${failed} FAILED`); process.exit(1); }
console.log('\nALL PASSED');
