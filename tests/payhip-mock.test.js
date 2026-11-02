// Payhip behavior under mocks: verify is fail-closed, talks only to payhip.com, usage-mark runs
// only for a real code after a real generation. Run: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { calls, mock, resetMock, callGen, callChk } from './helpers.js';
import { verifyLicense } from '../api/_auth.js';

const body = o => ({ systemPrompt: 'You write letters.', userPrompt: 'Write it.', state: 'Texas', accessCode: 'REAL-CODE-1', ...o });

test('verifyLicense: only a 200 + enabled + matching product passes', async () => {
  for (const [mode, ok, status] of [['enabled', true], ['404', false, 401], ['500', false, 401], ['disabled', false, 401], ['wrongproduct', false, 401], ['nodata', false, 401], ['down', false, 503]]) {
    resetMock(); mock.payhip = mode;
    const r = await verifyLicense('CODE', 'O80Tw', 'k');
    assert.equal(r.ok, ok, mode);
    if (!ok) assert.equal(r.status, status, mode);
  }
  assert.equal((await verifyLicense('   ', 'O80Tw', 'k')).status, 401);
});

test('verify call goes to payhip.com only, with the api key in the payhip header and the code URL-encoded', async () => {
  resetMock();
  await verifyLicense('A B&C', 'O80Tw', 'stub-key');
  const c = calls.payhipVerify[0];
  assert.ok(c.url.startsWith('https://payhip.com/api/v1/license/verify?'));
  assert.equal(c.headers['payhip-api-key'], 'stub-key');
  assert.ok(c.url.includes('license_key=A%20B%26C'));
  assert.deepEqual(calls.other, []);
});

test('generate: successful letter marks usage exactly once, after the model call', async () => {
  resetMock();
  const r = await callGen(body());
  assert.equal(r.code, 200);
  assert.equal(calls.payhipVerify.length, 1);
  assert.equal(calls.payhipUsage.length, 1);
  assert.ok(calls.payhipUsage[0].body.includes('license_key=REAL-CODE-1'));
  assert.equal(calls.anthropic.length, 1);
});

test('generate: a usage-mark network failure does not fail the delivered letter', async () => {
  resetMock(); mock.usageFails = true;
  const r = await callGen(body());
  assert.equal(r.code, 200);
  assert.ok(r.body.text);
});

test('generate: model outage (502) is a transient error and the code is NOT marked used', async () => {
  resetMock(); mock.anthropicStatus = 529;
  const r = await callGen(body());
  assert.equal(r.code, 502);
  assert.equal(calls.payhipUsage.length, 0);
});

test('generate: bad codes never reach Anthropic and never mark usage', async () => {
  for (const mode of ['404', '500', 'disabled', 'wrongproduct', 'nodata', 'down']) {
    resetMock(); mock.payhip = mode;
    const r = await callGen(body());
    assert.ok(r.code === 401 || r.code === 503, mode + ' -> ' + r.code);
    assert.equal(calls.anthropic.length, 0, mode);
    assert.equal(calls.payhipUsage.length, 0, mode);
  }
});

test('checklist: same gate, and a passed verify does not mark usage', async () => {
  resetMock(); mock.payhip = '404';
  assert.equal((await callChk({ accessCode: 'FAKE', state: 'Texas' })).code, 401);
  assert.equal(calls.anthropic.length, 0);
  resetMock();
  const r = await callChk({ accessCode: 'REAL-CODE-1', state: 'Texas' });
  assert.equal(r.code, 200);
  assert.equal(calls.payhipUsage.length, 0);
});

test('over-cap input is rejected as invalid input (413) before Payhip or the model is touched', async () => {
  resetMock();
  const r = await callGen(body({ userPrompt: 'x'.repeat(20001) }));
  assert.equal(r.code, 413);
  assert.equal(r.body.kind, 'invalid_input');
  assert.equal(calls.payhipVerify.length, 0);
  assert.equal(calls.anthropic.length, 0);
  const c = await callChk({ accessCode: 'REAL-CODE-1', state: 'T'.repeat(61) });
  assert.equal(c.code, 413);
  assert.equal(calls.payhipUsage.length, 0);
});
