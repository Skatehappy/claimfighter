// Auth-gate test (gate A11): api/generate.js and api/checklist.js must NEVER reach api.anthropic.com
// without a passed Payhip verify (or a G4T code). Stubs global fetch: no real Payhip/Anthropic call.
// Run: node scripts/test-authgate.mjs   (exit 1 on any failure)
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
process.env.PAYHIP_API_KEY = 'stub-payhip';
process.env.ANTHROPIC_API_KEY = 'stub-anthropic';
delete process.env.G4_TEST_CODE_SECRET;
let failed = 0;
const ok = (c, m) => { if (!c) { failed++; console.error('FAIL  ' + m); } else console.log('ok    ' + m); };

// ── static: no hard-coded bypass keys / legacy code lists, every Anthropic caller imports the gate ──
const apiDir = join(ROOT, 'api');
for (const f of readdirSync(apiDir).filter(f => f.endsWith('.js'))) {
  const src = readFileSync(join(apiDir, f), 'utf8');
  ok(!/SMOKE-TEST|TEST_KEYS|ACCESS_CODES|isTestKey/.test(src), `api/${f}: no bypass key / legacy code list`);
  if (src.includes('api.anthropic.com') && !f.startsWith('_')) {
    const iAnth = src.indexOf('api.anthropic.com');
    ok(/from '\.\/_auth\.js'/.test(src), `api/${f}: reaches Anthropic and imports the _auth gate`);
    const handlerAt = src.indexOf('export default async function handler');
    const iVerify = src.indexOf('verifyLicense(', handlerAt);
    const iCall = src.search(/\bcallModel\(|await fetch\('https:\/\/api\.anthropic\.com/);
    // the handler body must run verifyLicense before its first model call / Anthropic fetch
    const firstCallInHandler = src.slice(handlerAt).search(/\bcallModel\(|fetch\('https:\/\/api\.anthropic\.com/);
    ok(iVerify > handlerAt && firstCallInHandler > -1 && iVerify < handlerAt + firstCallInHandler, `api/${f}: verifyLicense() precedes the first Anthropic call in the handler`);
  }
}
for (const f of ['public', 'src', 'vercel.json', 'package.json']) {
  // client/config must not ship a bypass key either
  const walk = p => { try { return readdirSync(p, { withFileTypes: true }).flatMap(d => d.isDirectory() ? walk(join(p, d.name)) : [join(p, d.name)]); } catch { return [p]; } };
  for (const p of walk(join(ROOT, f))) { try { if (/SMOKE-TEST-2026|TEST_KEYS/.test(readFileSync(p, 'utf8'))) { failed++; console.error('FAIL  bypass key in ' + p); } } catch {} }
}

// ── behavioral ──────────────────────────────────────────────────────────────
const calls = { anthropic: 0, usage: 0 };
let payhip = 'enabled';
globalThis.fetch = async (url) => {
  const u = String(url);
  if (u.includes('api.anthropic.com')) { calls.anthropic++; return { ok: true, status: 200, json: async () => ({ content: [{ type: 'text', text: '["a"]' }] }), text: async () => '' }; }
  if (u.includes('license/usage')) { calls.usage++; return { status: 200, json: async () => ({}) }; }
  if (u.includes('license/verify')) {
    if (payhip === 'down') throw new Error('network');
    if (payhip === '500') return { status: 500, json: async () => ({}) };
    if (payhip === '404') return { status: 404, json: async () => ({}) };
    if (payhip === 'disabled') return { status: 200, json: async () => ({ data: { enabled: false, product_link: 'O80Tw' } }) };
    if (payhip === 'wrongproduct') return { status: 200, json: async () => ({ data: { enabled: true, product_link: 'OTHER' } }) };
    if (payhip === 'nodata') return { status: 200, json: async () => ({}) };
    return { status: 200, json: async () => ({ data: { enabled: true, product_link: 'O80Tw' } }) };
  }
  throw new Error('unexpected fetch ' + u);
};
const realLog = console.log; console.log = () => {};

const gen = (await import('../api/generate.js')).default;
const chk = (await import('../api/checklist.js')).default;
const callGen = body => new Promise(resolve => {
  const res = { setHeader() {}, status(c) { this.code = c; return this; }, json(o) { resolve({ code: this.code ?? 200, body: o }); }, end() { resolve({ code: this.code }); } };
  gen({ method: 'POST', body }, res);
});
const callChk = async body => { const r = await chk({ method: 'POST', json: async () => body }); return { code: r.status, body: await r.json() }; };
const APPS = { generate: b => callGen({ systemPrompt: 's', userPrompt: 'u', state: 'Texas', ...b }), checklist: b => callChk({ state: 'Texas', ...b }) };

const cases = [
  ['no code', undefined, 'enabled'], ['blank code', '   ', 'enabled'],
  ['fake code (Payhip 404)', 'FAKE-CODE-0000', '404'], ['Payhip non-ok (500)', 'FAKE-CODE-0000', '500'],
  ['Payhip down', 'FAKE-CODE-0000', 'down'], ['code disabled', 'FAKE-CODE-0000', 'disabled'],
  ['wrong product', 'FAKE-CODE-0000', 'wrongproduct'], ['Payhip no data', 'FAKE-CODE-0000', 'nodata'],
];
console.log = realLog;
for (const [app, fn] of Object.entries(APPS)) {
  for (const [label, accessCode, mode] of cases) {
    payhip = mode; calls.anthropic = 0; calls.usage = 0; console.log = () => {};
    const r = await fn({ accessCode });
    console.log = realLog;
    ok(calls.anthropic === 0 && r.code >= 400 && r.code < 600, `${app}: ${label} -> ${r.code}, Anthropic never called`);
  }
  // G4T with no secret set is just a bad code
  payhip = '404'; calls.anthropic = 0; console.log = () => {};
  let r = await fn({ accessCode: 'G4T-anything-at-all-123456' });
  console.log = realLog;
  ok(calls.anthropic === 0 && r.code === 401, `${app}: G4T code with no env secret -> 401, Anthropic never called`);
}
// positive control: a passed Payhip verify DOES reach Anthropic (checklist / real generation)
payhip = 'enabled'; calls.anthropic = 0; console.log = () => {};
let r = await APPS.checklist({ accessCode: 'GOOD-CODE' });
console.log = realLog;
ok(r.code === 200 && calls.anthropic === 1, 'checklist: verified code reaches Anthropic exactly once (positive control)');
// access-check ("Reply: VALID"): 3 checks => no model call, no usage-mark
calls.anthropic = 0; calls.usage = 0; console.log = () => {};
const outs = [];
for (let i = 0; i < 3; i++) outs.push(await callGen({ accessCode: 'GOOD-CODE', systemPrompt: 'Reply: VALID', userPrompt: 'check' }));
console.log = realLog;
ok(outs.every(o => o.code === 200 && o.body.text === 'VALID') && calls.anthropic === 0 && calls.usage === 0, 'access-check x3: VALID, zero model calls, zero usage-marks');

console.log = realLog;
if (failed) { console.error(failed + ' auth-gate assertion(s) failed'); process.exit(1); }
console.log('auth-gate test passed');
