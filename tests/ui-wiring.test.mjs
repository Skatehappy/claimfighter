// Playwright UI wiring test: every button / nav control / export on the real built app does what it says,
// with ZERO console errors and zero page errors. /api/** is mocked in the browser (no Payhip, no Anthropic).
// Needs playwright-core and an installed Chromium-family browser (Edge channel by default).
// playwright-core is a devDependency (npm install). Browser: Edge channel by default (UI_BROWSER_CHANNEL overrides).
// Run: node --test tests/ui-wiring.test.mjs
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '.uitest-dist');
const require = createRequire(import.meta.url);
function loadPlaywright() { return require('playwright-core'); }

let server, browser, base;
const state = { mode: 'ok', apiCalls: [] };
// the browser logs every deliberate non-2xx mock response (401/413/503) as a console error; anything else is a real error
const EXPECTED_HTTP = /Failed to load resource: the server responded with a status of (401|413|503)/;

before(async () => {
  execFileSync(process.execPath, [path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js'), 'build', '--outDir', OUT, '--emptyOutDir'], { cwd: ROOT, stdio: 'pipe' });
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
  server = http.createServer((req, res) => {
    let f = path.join(OUT, decodeURIComponent(req.url.split('?')[0]));
    if (!f.startsWith(OUT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(OUT, 'index.html');
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  base = 'http://127.0.0.1:' + server.address().port;
  const { chromium } = loadPlaywright();
  browser = await chromium.launch({ channel: process.env.UI_BROWSER_CHANNEL || 'msedge', headless: true });
});
after(async () => { await browser?.close(); server?.close(); fs.rmSync(OUT, { recursive: true, force: true }); });

async function newPage() {
  const ctx = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', r => { if (r.url().startsWith(base)) errors.push('requestfailed: ' + r.url()); });
  await page.route(u => !u.href.startsWith(base), r => {
    const u = r.request().url();
    if (u.includes('jspdf')) return r.fulfill({ contentType: 'text/javascript', body: 'window.__pdf=[];window.jspdf={jsPDF:function(){this.internal={pageSize:{getWidth:()=>612,getHeight:()=>792}};this.setFont=()=>{};this.setFontSize=()=>{};this.splitTextToSize=t=>String(t).split("\\n");this.text=()=>{};this.addPage=()=>{};this.save=n=>window.__pdf.push(n);}};' });
    return r.fulfill({ contentType: 'text/css', body: '' });
  });
  await page.route('**/api/generate', async r => {
    const b = JSON.parse(r.request().postData() || '{}');
    state.apiCalls.push({ url: 'generate', check: b.systemPrompt === 'Reply: VALID', code: b.accessCode });
    if (b.accessCode === 'BAD') return r.fulfill({ status: 401, contentType: 'application/json', body: '{"error":"Invalid license key."}' });
    if (b.systemPrompt === 'Reply: VALID') return r.fulfill({ status: 200, contentType: 'application/json', body: '{"text":"VALID"}' });
    if (state.mode === 'transient') return r.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"unavailable"}' });
    if (state.mode === 'consumed') return r.fulfill({ status: 401, contentType: 'application/json', body: '{"error":"Invalid license key."}' });
    if (state.mode === 'invalid') return r.fulfill({ status: 413, contentType: 'application/json', body: '{"error":"Input too long."}' });
    return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ text: 'Dear Insurer, STUB LETTER ' + (b.userPrompt || '').slice(0, 20) }) });
  });
  await page.route('**/api/checklist', r => { state.apiCalls.push({ url: 'checklist' }); return r.fulfill({ status: 200, contentType: 'application/json', body: '{"checklist":["Send by certified mail","Keep copies"]}' }); });
  return { page, errors, ctx };
}

async function unlock(page, code = 'GOOD-CODE') {
  await page.goto(base + '/');
  await page.getByPlaceholder('e.g. CF-ABC123').fill(code);
  await page.getByRole('button', { name: /Unlock My Letter/ }).click();
}
async function fillAndAdvance(page) {
  // Policyholder
  await page.getByPlaceholder('Jane Smith').fill('Test Owner');
  await page.getByPlaceholder('Connecticut').fill('Texas');
  await page.getByRole('button', { name: /Continue|Next/ }).click();
  // Property
  await page.getByPlaceholder(/State Farm/).fill('Acme Mutual');
  await page.locator('select').first().selectOption({ index: 1 });
  await page.getByRole('button', { name: /Continue|Next/ }).click();
}

test('access code: bad code is rejected, nothing advances; good code unlocks', async () => {
  const { page, errors, ctx } = await newPage();
  await unlock(page, 'BAD');
  await page.getByText('Invalid access code').waitFor();
  await unlock(page, 'GOOD-CODE');
  await page.getByText('About You').waitFor();
  assert.deepEqual(errors.filter(e => !EXPECTED_HTTP.test(e)), []);
  await ctx.close();
});

test('intro links: purchase link points at Payhip', async () => {
  const { page, errors, ctx } = await newPage();
  await page.goto(base + '/');
  const href = await page.getByRole('link', { name: /Purchase for/ }).getAttribute('href');
  assert.match(href, /^https:\/\/payhip\.com\//);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('wizard: Continue is disabled until required fields are filled; Back works; counters are visible and capped', async () => {
  const { page, errors, ctx } = await newPage();
  await unlock(page);
  await page.getByText('About You').waitFor();
  const cont = page.getByRole('button', { name: /Continue|Next/ });
  assert.equal(await cont.isDisabled(), true);
  await page.getByPlaceholder('Jane Smith').fill('Test Owner');
  await page.getByPlaceholder('Connecticut').fill('Texas');
  assert.equal(await cont.isDisabled(), false);
  const counters = await page.getByTestId('char-counter').allTextContents();
  assert.ok(counters.length >= 3 && counters.every(c => /^\d+ \/ \d+$/.test(c)), 'visible counters: ' + counters);
  await page.getByPlaceholder('Jane Smith').fill('x'.repeat(500));
  assert.equal((await page.getByPlaceholder('Jane Smith').inputValue()).length, 200, 'text input capped at 200');
  await page.getByPlaceholder('Jane Smith').fill('Test Owner');
  await cont.click();
  await page.getByText('Your Policy & Insurer').waitFor();
  await page.getByRole('button', { name: /Back/ }).click();
  await page.getByText('About You').waitFor();
  assert.deepEqual(errors, []);
  await ctx.close();
});

async function toGenerate(page) {
  await unlock(page);
  await fillAndAdvance(page);
  await page.locator('textarea').nth(0).fill('Claim denied for no reason');
  await page.locator('textarea').nth(1).fill('Policy covers it');
  await page.getByRole('button', { name: /Continue|Next/ }).click();
  await page.getByText('Your Demand').first().waitFor();
  await page.locator('select').first().selectOption({ index: 1 });
  await page.getByRole('button', { name: /Continue|Next/ }).click();
  await page.getByRole('button', { name: /Generate My Letter/ }).waitFor();
}

test('generate -> letter: tabs, copy, PDF export, checklist, New Letter, zero console errors', async () => {
  state.mode = 'ok'; state.apiCalls = [];
  const { page, errors, ctx } = await newPage();
  await toGenerate(page);
  await page.getByRole('button', { name: /Generate My Letter/ }).click();
  await page.getByText('Your Letter is Ready').waitFor();
  assert.ok(state.apiCalls.some(c => c.url === 'checklist'), 'checklist requested');
  assert.equal(state.apiCalls.filter(c => c.url === 'generate' && !c.check).length, 3, 'three generation passes');
  await page.getByText('Send by certified mail').waitFor();
  // tabs
  await page.getByRole('button', { name: /Assertive/ }).click();
  await page.getByText('Stronger framing').waitFor();
  await page.getByRole('button', { name: /Standard/ }).click();
  await page.getByText('Measured, professional tone').waitFor();
  // copy
  await page.getByRole('button', { name: /Copy Letter/ }).click();
  await page.getByText('Copied').waitFor();
  assert.match(await page.evaluate(() => navigator.clipboard.readText()), /STUB LETTER/);
  // PDF export
  await page.getByRole('button', { name: /PDF/ }).click();
  assert.deepEqual(await page.evaluate(() => window.__pdf), ['ClaimFighter-appeal-letter.pdf']);
  // draft persistence: reload keeps the letter (localStorage), and never stores the code
  const saved = await page.evaluate(() => localStorage.getItem('cf_draft_v1'));
  assert.ok(saved && saved.includes('STUB LETTER'), 'letter persisted');
  assert.ok(!saved.includes('GOOD-CODE'), 'access code is not persisted');
  await page.reload();
  await page.getByTestId('view-saved').click();
  await page.getByText('Your Letter is Ready').waitFor();
  // New Letter resets and clears the stored draft
  await page.getByRole('button', { name: /New Letter/ }).click();
  assert.equal(await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('cf_draft_v1') || 'null'); return d && d.letter || ''; }), '');
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('error taxonomy: transient = free retry + resumes; invalid = fix and retry; consumed = contact support, no retry button', async () => {
  const { page, errors, ctx } = await newPage();
  await toGenerate(page);
  state.mode = 'transient'; state.apiCalls = [];
  await page.getByRole('button', { name: /Generate My Letter/ }).click();
  await page.getByText(/temporary problem/).waitFor();
  await page.getByText(/access code is intact/).waitFor();
  state.mode = 'ok';
  await page.getByRole('button', { name: /Try again \(free\)/ }).click();
  await page.getByText('Your Letter is Ready').waitFor();
  const c2 = await newPage();
  await toGenerate(c2.page);
  state.mode = 'invalid';
  await c2.page.getByRole('button', { name: /Generate My Letter/ }).click();
  await c2.page.getByText(/Fix your entries/).waitFor();
  await c2.page.getByRole('button', { name: /Retry after fixing/ }).waitFor();

  const c3 = await newPage();
  await toGenerate(c3.page);
  state.mode = 'consumed';
  await c3.page.getByRole('button', { name: /Generate My Letter/ }).click();
  await c3.page.getByText(/contact support@buyappsonce\.com/i).waitFor();
  assert.equal(await c3.page.getByRole('button', { name: /Try again/ }).count(), 0);
  state.mode = 'ok';
  assert.deepEqual([...errors, ...c2.errors, ...c3.errors].filter(e => !EXPECTED_HTTP.test(e)), []);
  await ctx.close(); await c2.ctx.close(); await c3.ctx.close();
});
