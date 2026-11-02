// The access-check ("Reply: VALID") contract between the client and api/generate.js:
// the client sends the exact string the server matches; a check burns nothing and never calls the model.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { calls, resetMock, mock, callGen } from './helpers.js';

const CHECK = 'Reply: VALID';
const read = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');

test('client and server agree on the check string', () => {
  assert.ok(read('src/App.jsx').includes(`systemPrompt: "${CHECK}"`), 'App.jsx must send the exact check string');
  assert.ok(read('api/generate.js').includes(`systemPrompt === '${CHECK}'`), 'generate.js must match the exact check string');
});

test('valid code + check: 200 VALID, zero model calls, zero usage-marks', async () => {
  for (let i = 0; i < 3; i++) {
    resetMock();
    const r = await callGen({ accessCode: 'REAL-CODE-1', systemPrompt: CHECK, userPrompt: 'check' });
    assert.equal(r.code, 200);
    assert.equal(r.body.text, 'VALID');
    assert.equal(calls.anthropic.length, 0);
    assert.equal(calls.payhipUsage.length, 0);
    assert.equal(calls.payhipVerify.length, 1);
  }
});

test('invalid code + check: 401 and nothing else happens', async () => {
  resetMock(); mock.payhip = '404';
  const r = await callGen({ accessCode: 'FAKE', systemPrompt: CHECK, userPrompt: 'check' });
  assert.equal(r.code, 401);
  assert.equal(calls.anthropic.length, 0);
});

test('Payhip outage + check: 503 (never reported as an invalid code)', async () => {
  resetMock(); mock.payhip = 'down';
  const r = await callGen({ accessCode: 'REAL-CODE-1', systemPrompt: CHECK, userPrompt: 'check' });
  assert.equal(r.code, 503);
});

test('near-miss strings are NOT treated as a check (they are real generations)', async () => {
  for (const sp of ['Reply:VALID', 'reply: valid', 'Respond with only: VALID', ' Reply: VALID']) {
    resetMock();
    await callGen({ accessCode: 'REAL-CODE-1', systemPrompt: sp, userPrompt: 'check', state: 'Texas' });
    assert.equal(calls.anthropic.length >= 1, true, sp);
  }
});
