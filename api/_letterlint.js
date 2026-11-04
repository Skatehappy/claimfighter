// api/_letterlint.js — "no attorney voice" lint. Letters are written and signed by the claimant, never by counsel.
// Dependency-free (also imported by the Edge checklist function). Returns the matched phrase (as written) or null.
export const SIGN_RULE = 'The letter is written and signed by the claimant in their own name ([Your Name]). Never describe the writer as an attorney, counsel, law firm or representative and never sign for a client.';

// Normalize so spacing and quote variants cannot dodge the patterns: curly quotes/dashes, NBSP and other spaces, zero-width
// characters (checked both removed and as a space). Line breaks are kept: a signature line starts a line.
const norm = (s, zw) => String(s || '')
  .replace(/[​-‍⁠﻿]/g, zw)
  .replace(/[‘’‛′]/g, "'").replace(/[“”‟″]/g, '"')
  .replace(/[‐-―]/g, '-')
  .replace(/[^\S\n]+/g, ' ').replace(/ ?\n\s*/g, '\n');

// "Attorney for" / "Counsel for" only count as a signature or self-description: at the start of a line or sentence, or after a
// comma, dash or opening bracket ("Jane Roe, Attorney for the Claimant"). That keeps "consult an attorney for advice" legal.
const LEAD = String.raw`(?:^|[.;:,(\[\-!?]\s*|\s-\s)`;
const PATTERNS = [
  new RegExp(LEAD + String.raw`(attorneys?\s+for)\b`, 'im'),
  new RegExp(LEAD + String.raw`((?:legal\s+)?counsel\s+for)\b`, 'im'),
  /\b(esq)\b\.?/i,
  /\b(esquire)\b/i,
  /\b(on\s+behalf\s+of\s+(?:my|our|the)\s+client)/i,
  /\b(this\s+(?:law\s+)?firm\s+represents)\b/i,
  /\b((?:my|our)\s+clients?)\b/i,
  /\b(attorneys?\s+at\s+law)\b/i,
  /\b(law\s+offices?\s+of)\b/i,
];

export function findAttorneyVoice(text) {
  for (const t of [norm(text, ''), norm(text, ' ')]) for (const re of PATTERNS) { const m = t.match(re); if (m) return m[1].trim(); }
  return null;
}
