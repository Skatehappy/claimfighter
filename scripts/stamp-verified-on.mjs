// Stamp every VERIFICATION_LOG-SEO-CONTENT.md entry that has no verified_on with today's date
// (new entries get the day they were verified). Existing dates are never changed.
//   node scripts/stamp-verified-on.mjs [--today=YYYY-MM-DD]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stampMissing } from './lib/verified-on.mjs';

const f = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'VERIFICATION_LOG-SEO-CONTENT.md');
const a = process.argv.find(x => x.startsWith('--today='));
const today = a ? a.slice(8) : new Date().toISOString().slice(0, 10);
const { text, stamped } = stampMissing(fs.readFileSync(f, 'utf8'), today);
if (stamped) fs.writeFileSync(f, text);
console.log(`stamped ${stamped} entr${stamped === 1 ? 'y' : 'ies'} with ${today}`);
