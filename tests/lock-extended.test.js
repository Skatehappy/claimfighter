// Citation lock extensions: subsection pin-cites, numeric-claims check, checklist lock, template parity.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { calls, resetMock, mock, callGen, callChk } from './helpers.js';
import { verifiedFor, extractCitations, findUnverified, trimUnverifiedSubsections, findUnverifiedSubsections, subsectionMap } from '../api/_citelint.js';
import { extractFigures, figureSet, sentenceFigureHits } from '../api/_numlint.js';
import { lockChecklist, FALLBACK_CHECKLIST } from '../api/_checklist-lock.js';

const read = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const gbody = (o = {}) => ({ accessCode: 'REAL-CODE-1', systemPrompt: 'You write letters.', userPrompt: 'Policyholder in Texas.', state: 'Texas', ...o });

test('subsection map: a logged pin covers children and parents, an unlogged one does not', () => {
  const m = subsectionMap(['Tex. Ins. Code § 542A.003(a), (b), (d) notice']);
  const v = { subs: m };
  assert.equal(findUnverifiedSubsections('See § 542A.003(a).', v).length, 0);
  assert.equal(findUnverifiedSubsections('See § 542A.003(b)(1).', v).length, 0);
  assert.equal(findUnverifiedSubsections('See § 542A.003(z).', v).length, 1);
  assert.equal(findUnverifiedSubsections('See § 542A.003(a) and (z).', v).length, 1);
});

test('TX: logged subsection kept, wrong subsection trimmed to the section, section itself untouched', () => {
  const tx = verifiedFor('Texas');
  const t = trimUnverifiedSubsections('Interest under Tex. Ins. Code § 542.060(c) and also § 542.060(q).', tx);
  assert.match(t.text, /§ 542\.060\(c\)/);
  assert.doesNotMatch(t.text, /\(q\)/);
  assert.match(t.text, /§ 542\.060\./);
  assert.equal(t.trimmed, 1);
  assert.equal(findUnverified(t.text, tx.set).length, 0);
});

test('figure extractor canonicalises dollars, percents and durations', () => {
  const f = [...extractFigures('Pay $60,000 or 60% within ten-working-day, 15 business days, 30 days, two years, the 61st day, $1.5 million').keys()];
  for (const k of ['$60000', '60%', '10bd', '15bd', '30d', '2y', '61d', '$1500000']) assert.ok(f.includes(k), k);
  assert.ok(figureSet(['15 business days']).has('15d'));
});

test('numeric check: unsupported legal figure flagged, demand deadline and user facts exempt', () => {
  const allowed = figureSet(['18% interest', 'Claim of $4,200']);
  assert.equal(sentenceFigureHits('Texas law gives the insurer 7 days to pay.', allowed).length, 1);
  assert.equal(sentenceFigureHits('The penalty is 99% of the claim.', allowed).length, 1);
  assert.equal(sentenceFigureHits('Interest accrues at 18% per year.', allowed).length, 0);
  assert.equal(sentenceFigureHits('My claim is for $4,200.', allowed).length, 0);
  assert.equal(sentenceFigureHits('Please respond within 14 days of receipt of this letter.', allowed).length, 0);
});

test('generate: contradicting figure triggers one regeneration naming it; clean redo is used', async () => {
  resetMock();
  mock.anthropicReplies = ['Under Tex. Ins. Code § 542.060 you must pay a 99% penalty. Please respond within 14 days of receipt.', 'Interest accrues at 18% under Tex. Ins. Code § 542.060. Please respond within 14 days of receipt.'];
  const r = await callGen(gbody());
  assert.equal(r.code, 200);
  assert.equal(calls.anthropic.length, 2);
  assert.match(calls.anthropic[1].system, /99%/);
  assert.match(r.body.text, /18%/);
  assert.doesNotMatch(r.body.text, /99%/);
});

test('generate: persistent bad figure is stripped, rest of the letter survives', async () => {
  resetMock();
  const dirty = 'The insurer must pay within 7 business days by law. Interest is 18% under Tex. Ins. Code § 542.060. Please respond within 30 days of this letter.';
  mock.anthropicReplies = [dirty, dirty];
  const r = await callGen(gbody());
  assert.doesNotMatch(r.body.text, /7 business days/);
  assert.match(r.body.text, /18%/);
  assert.match(r.body.text, /respond within 30 days/);
});

test('generate: a wrong subsection is trimmed with no extra model call', async () => {
  resetMock();
  mock.anthropicReplies = ['Interest under Tex. Ins. Code § 542.060(z) is owed.'];
  const r = await callGen(gbody());
  assert.equal(calls.anthropic.length, 1);
  assert.doesNotMatch(r.body.text, /\(z\)/);
  assert.match(r.body.text, /§ 542\.060/);
});

test('system prompt carries the pin-cite and numbers rules plus the verified figures', async () => {
  resetMock();
  await callGen(gbody());
  const s = calls.anthropic[0].system;
  assert.match(s, /NUMBERS RULE/);
  assert.match(s, /pinpoint subsection/);
  assert.match(s, /VERIFIED FIGURES/);
});

test('checklist: model output is locked (fake cite, unsupported figure, bad subsection) and the API call carries the lock', async () => {
  resetMock();
  mock.anthropicReplies = [JSON.stringify([
    'Send by certified mail', 'Keep copies of everything', 'Document every call',
    'Cite Tex. Ins. Code § 542.999 in your letter', 'The insurer has 9 days to answer under Texas law',
    'Interest runs under Tex. Ins. Code § 542.060(z)', 'Request external review',
  ])];
  const r = await callChk({ accessCode: 'REAL-CODE-1', state: 'Texas', varianceType: 'insurance appeal', letterExcerpt: 'x' });
  assert.equal(r.code, 200);
  assert.match(calls.anthropic[0].system, /CITATION RULE/);
  const joined = r.body.checklist.join(' | ');
  assert.doesNotMatch(joined, /542\.999/);
  assert.doesNotMatch(joined, /9 days/);
  assert.doesNotMatch(joined, /\(z\)/);
  assert.match(joined, /certified mail/);
});

test('checklist: unparseable or thin model output falls back to a claim-free default', async () => {
  resetMock(); mock.anthropicReplies = ['not json'];
  const r = await callChk({ accessCode: 'REAL-CODE-1', state: 'Texas' });
  assert.deepEqual(r.body.checklist, FALLBACK_CHECKLIST);
  const tx = verifiedFor('Texas');
  assert.equal(lockChecklist(FALLBACK_CHECKLIST, tx).length, FALLBACK_CHECKLIST.length, 'fallback passes its own lock');
  assert.equal(extractFigures(FALLBACK_CHECKLIST.join(' ')).size, 0, 'fallback states no figures');
  assert.equal(extractCitations(FALLBACK_CHECKLIST.join(' ')).size, 0, 'fallback cites nothing');
});

test('client templates: every authority in src/App.jsx and api/checklist.js is in the verified national set', () => {
  const all = verifiedFor('');   // federal-only set
  const text = read('src/App.jsx') + '\n' + read('api/checklist.js');
  const bad = findUnverified(text, all.set);
  assert.deepEqual(bad.map(b => b.cite), [], 'unverified authorities in templates');
});

test('client templates: every legal figure in the letter prompts is verified or is a demand deadline', () => {
  const all = verifiedFor('');
  const app = read('src/App.jsx');
  const start = app.indexOf('const systemPrompt = `');
  const end = app.indexOf('const pickSystemPrompt', start) > 0 ? app.indexOf('const pickSystemPrompt', start) : start + 9000;
  const prompts = app.slice(start, end);
  const allowed = all.figSet;
  const offenders = [];
  for (const line of prompts.split('\n')) {
    if (/response deadline|effective|help desk|1-800|Jan/i.test(line)) continue;
    for (const h of sentenceFigureHits(line, allowed)) offenders.push(h.fig + ' :: ' + line.trim().slice(0, 90));
  }
  assert.deepEqual(offenders, []);
});
