// Three-Gate v7 — Gate 2 (execution-based verify) for letter apps.
// A1: required files present + package.json valid JSON.
// A9: citation-log parity — every statutory citation in src/App.jsx,
//     public/landing.html, landing.html, api/checklist.js must have a matching
//     entry in VERIFICATION_LOG.md (the citation identifier appears literally).
// Nonzero exit on any failure. Runs on pre-commit + GitHub Actions.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CITATION_FILES = ['src/App.jsx', 'public/landing.html', 'landing.html', 'api/checklist.js'];
const LOG = join(ROOT, 'VERIFICATION_LOG.md');

function fail(msg) { console.error('GATE RED — ' + msg); process.exit(1); }

// ── A1: required files ───────────────────────────────────────────────────────
for (const f of ['src/App.jsx', 'package.json']) if (!existsSync(join(ROOT, f))) fail('A1: missing ' + f);
try { JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')); } catch { fail('A1: package.json is not valid JSON'); }

// ── A9: citation-log parity ──────────────────────────────────────────────────
if (!existsSync(LOG)) fail('A9: VERIFICATION_LOG.md is missing');
const logNorm = readFileSync(LOG, 'utf8').replace(/\s+/g, '').toLowerCase();

let code = '';
for (const f of CITATION_FILES) { const p = join(ROOT, f); if (existsSync(p)) code += '\n' + readFileSync(p, 'utf8'); }

const tokens = new Set();
// section-symbol citations: §1954, §§5600-5615, §235-b, §92.0081, §27-2005 …
for (const m of code.matchAll(/§+\s*\d[0-9A-Za-z.\-]*/g)) {
  let t = m[0].replace(/\s+/g, '').replace(/[.\-]+$/, '');
  if (t.length > 1) tokens.add(t);
}
// CFR / U.S.C. citations: 42 U.S.C. §3604, 29 CFR §2560.503-1, 47 CFR §1.4000 …
for (const m of code.matchAll(/\b\d+\s+(?:U\.?\s?S\.?\s?C\.?|C?\.?\s?F\.?\s?R\.?)\s*§?\s*\d[0-9A-Za-z.\-]*/gi)) {
  tokens.add(m[0].replace(/\s+/g, ''));
}

const missing = [];
for (const t of tokens) if (!logNorm.includes(t.toLowerCase())) missing.push(t);

if (missing.length) {
  console.error('A9 FAIL — citations in code with no VERIFICATION_LOG.md entry (' + missing.length + '):');
  for (const m of [...missing].sort()) console.error('  ' + m);
  fail(missing.length + ' unlogged citation(s)');
}
// ── A10: citation lock — verified-citation set is current, and the lint/G4T mock test passes ──
import { execFileSync } from 'node:child_process';
for (const [label, args] of [['A10: api/_verified-citations.json is stale (run npm run generate:citations)', ['scripts/build-verified-citations.mjs', '--check']], ['A10: citation-lint mock test failed (run npm run test:citelint)', ['scripts/test-citelint.mjs']], ['A11: auth-gate test failed — generate/checklist can reach Anthropic without a passed Payhip/G4T check (run npm run test:authgate)', ['scripts/test-authgate.mjs']]]) {
  try { execFileSync(process.execPath, args, { cwd: ROOT, stdio: 'pipe' }); } catch { fail(label); }
}

// ── A13: api mock tests (Payhip, isCheckCall, citation/subsection/numeric lock, checklist lock, template parity) ──
// ── A14: Playwright UI wiring test (every button / nav / export, zero console errors; /api mocked) ──
for (const [label, files] of [['A13: tests/*.test.js failed (run npm test)', ['tests/payhip-mock.test.js', 'tests/isCheckCall.test.js', 'tests/lock-extended.test.js', 'tests/verified-on.test.js']], ['A14: UI wiring test failed (run npm run test:ui)', ['tests/ui-wiring.test.mjs']]]) {
  try { execFileSync(process.execPath, ['--test', ...files], { cwd: ROOT, stdio: 'pipe', timeout: 240000 }); } catch (e) { fail(label + '\n' + String(e.stdout || '').split('\n').filter(l => /^\s*(not ok|error:)/.test(l)).slice(0, 8).join('\n')); }
}

// ── A15: verified_on freshness (every log entry dated; nothing rendered/generated from an entry older than 12 months; warns at 10) ──
try {
  const o = execFileSync(process.execPath, ['scripts/check-verified-on.mjs'], { cwd: ROOT, stdio: 'pipe', encoding: 'utf8' });
  console.log(o.trim());
} catch (e) { fail('A15: verified_on check failed (run node scripts/stamp-verified-on.mjs for new entries; re-verify stale ones) - ' + String(e.stderr || e.stdout || '').trim()); }

console.log('GATE GREEN — A1 files ok; A9 citation-log parity: all ' + tokens.size + ' citations logged; A10 citation lock current + mock test passes; A11 no Anthropic call without Payhip/G4T; A13 api mock tests pass; A14 UI wiring test passes; A15 verified_on dated and fresh.');
process.exit(0);
