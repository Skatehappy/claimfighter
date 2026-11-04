import test from 'node:test';
import assert from 'node:assert/strict';
import { findViolations, scanRepo } from '../scripts/check-claims.mjs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

test('banned phrases are caught case-insensitively', () => {
  for (const s of ['Attorney-quality letter', 'ATTORNEY QUALITY', 'lawyer-quality', 'Lawyer quality', 'attorney-grade', 'lawyer-grade', 'attorney-written', 'attorney-drafted', 'a Real Lawyer would']) {
    assert.ok(findViolations(s).length > 0, s);
  }
});
test('legal advice allowed only in a negated disclaimer', () => {
  assert.equal(findViolations('This is not legal advice.').length, 0);
  assert.equal(findViolations('ClaimFighter does not give legal advice.').length, 0);
  assert.equal(findViolations("It isn't legal advice.").length, 0);
  assert.equal(findViolations('We provide legal advice for you.').length, 1);
  assert.equal(findViolations('Get legal advice in 5 minutes. It is not a lawyer.').length, 1);
});
test('clean copy passes', () => {
  assert.equal(findViolations('A clear, well-organized letter citing your state law. Consult a licensed attorney.').length, 0);
});
test('repo has no banned claims', () => {
  assert.deepEqual(scanRepo(join(dirname(fileURLToPath(import.meta.url)), '..')), []);
});
