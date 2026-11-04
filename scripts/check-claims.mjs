// Marketing-claims check: fails if any public page, template, JSON-LD or src string
// contains banned "attorney-quality"-style claims, or "legal advice" outside a not/no/n't disclaimer.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BANNED = [/attorney[\s-]*quality/i, /lawyer[\s-]*quality/i, /attorney[\s-]*grade/i, /lawyer[\s-]*grade/i,
  /attorney[\s-]*written/i, /attorney[\s-]*drafted/i, /lawyer[\s-]*written/i, /lawyer[\s-]*drafted/i, /real\s+lawyer/i];
const NEG = /b(not|no|never|nor|without|cannot)b|n['’]tb/i;

// Returns a list of problems for a text blob.
export function findViolations(text) {
  const out = [];
  for (const re of BANNED) { const m = text.match(re); if (m) out.push(`banned phrase "${m[0]}"`); }
  // sentence-ish windows around each "legal advice"
  const re = /legal advice/gi; let m;
  while ((m = re.exec(text))) {
    const before = text.slice(Math.max(0, m.index - 140), m.index);
    const sentence = before.split(/[.!?<>\n]/).pop();
    if (!NEG.test(sentence)) out.push('"legal advice" outside a not/no/n\'t disclaimer: ' + (sentence + m[0]).trim().slice(-80));
  }
  return out;
}

function walk(dir, acc = []) {
  for (const n of readdirSync(dir)) {
    if (n === 'node_modules' || n === '.git') continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, acc); else acc.push(p);
  }
  return acc;
}

export function scanRepo(root) {
  const files = [];
  for (const d of ['public', 'scripts/templates']) if (existsSync(join(root, d))) files.push(...walk(join(root, d)));
  for (const f of ['landing.html', 'index.html', 'src/App.jsx', 'scripts/generate-content.js', 'scripts/build-pages.js', 'scripts/data/config.js', 'scripts/data/national-pages.js', 'api/generate.js', 'api/checklist.js']) if (existsSync(join(root, f))) files.push(join(root, f));
  const bad = [];
  for (const f of files) {
    if (!['.html', '.js', '.jsx', '.json', '.xml', '.txt', '.mjs'].includes(extname(f))) continue;
    // generate-content.js prompt legitimately names the banned phrases in a prohibition line
    let t = readFileSync(f, 'utf8');
    if (/generate-content\.js$/.test(f)) t = t.replace(/^- Never describe the letter.*$/m, '');
    for (const v of findViolations(t)) bad.push(f.slice(root.length + 1).split(String.fromCharCode(92)).join('/') + ': ' + v);
  }
  return bad;
}

if (process.argv[1] && process.argv[1].endsWith('check-claims.mjs')) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  const bad = scanRepo(root);
  if (bad.length) { console.error('CLAIMS CHECK FAILED (' + bad.length + '):\n  ' + bad.slice(0, 40).join('\n  ')); process.exit(1); }
  console.log('claims check ok');
}
