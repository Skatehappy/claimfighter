// Shared mock harness for the api tests. NO Payhip call, NO Anthropic call, no real code is used.
process.env.PAYHIP_API_KEY = 'stub-payhip';
process.env.ANTHROPIC_API_KEY = 'stub-anthropic';
delete process.env.G4_TEST_CODE_SECRET;

export const calls = { anthropic: [], payhipVerify: [], payhipUsage: [], other: [] };
export const mock = { payhip: 'enabled', anthropicReplies: [], anthropicStatus: 200, usageFails: false };

export function resetMock() {
  calls.anthropic = []; calls.payhipVerify = []; calls.payhipUsage = []; calls.other = [];
  mock.payhip = 'enabled'; mock.anthropicReplies = []; mock.anthropicStatus = 200; mock.usageFails = false;
}

globalThis.fetch = async (url, opts = {}) => {
  const u = String(url);
  if (u.startsWith('https://api.anthropic.com/')) {
    calls.anthropic.push(JSON.parse(opts.body));
    if (mock.anthropicStatus !== 200) return { ok: false, status: mock.anthropicStatus, text: async () => 'upstream', json: async () => ({}) };
    const text = mock.anthropicReplies.length ? mock.anthropicReplies.shift() : 'Stub letter with no citations.';
    return { ok: true, status: 200, json: async () => ({ content: [{ type: 'text', text }], stop_reason: 'end_turn' }), text: async () => '' };
  }
  if (u.startsWith('https://payhip.com/api/v1/license/verify')) {
    calls.payhipVerify.push({ url: u, headers: opts.headers });
    const m = mock.payhip;
    if (m === 'down') throw new Error('network');
    if (m === '500') return { status: 500, json: async () => ({}) };
    if (m === '404') return { status: 404, json: async () => ({}) };
    if (m === 'disabled') return { status: 200, json: async () => ({ data: { enabled: false, product_link: 'O80Tw' } }) };
    if (m === 'wrongproduct') return { status: 200, json: async () => ({ data: { enabled: true, product_link: 'OTHER' } }) };
    if (m === 'nodata') return { status: 200, json: async () => ({}) };
    return { status: 200, json: async () => ({ data: { enabled: true, product_link: 'O80Tw' } }) };
  }
  if (u.startsWith('https://payhip.com/api/v1/license/usage')) {
    calls.payhipUsage.push({ url: u, headers: opts.headers, body: opts.body });
    if (mock.usageFails) throw new Error('usage network');
    return { status: 200, json: async () => ({}) };
  }
  calls.other.push(u);
  throw new Error('unexpected fetch ' + u);
};

const quiet = fn => async (...a) => { const l = console.log; console.log = () => {}; try { return await fn(...a); } finally { console.log = l; } };

const gen = (await import('../api/generate.js')).default;
const chk = (await import('../api/checklist.js')).default;

export const callGen = quiet(body => new Promise(resolve => {
  const res = { setHeader() {}, status(c) { this.code = c; return this; }, json(o) { resolve({ code: this.code ?? 200, body: o }); }, end() { resolve({ code: this.code }); } };
  gen({ method: 'POST', body }, res);
}));
export const callChk = quiet(async body => { const r = await chk({ method: 'POST', json: async () => body }); return { code: r.status, body: await r.json() }; });
