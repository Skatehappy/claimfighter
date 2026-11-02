// api/_checklist-lock.js — citation + numeric lock for the appeal checklist (used by api/checklist.js and the gate tests).
import { findUnverified, trimUnverifiedSubsections } from './_citelint.js';
import { figureSet, sentenceFigureHits } from './_numlint.js';

// Safe default checklist: no statute, dollar, percentage or day-count claims at all.
export const FALLBACK_CHECKLIST = [
  'Send the letter by certified mail with return receipt requested',
  'Keep a complete copy of everything you send',
  'Note the appeal or response deadline stated in your denial letter and calendar it',
  'Attach all supporting documentation: medical records, repair estimates, receipts',
  'Get a letter from your doctor or contractor supporting your claim if applicable',
  'Document every call with the insurer: date, time, representative name, what was said',
  'Request written confirmation that the insurer received your appeal',
  'If denied again, ask about external independent review and how to request it',
  'File a complaint with your state insurance department if you believe the claim was handled unfairly',
  'Consider consulting an attorney if the amount at stake is significant',
];

// Lock a model-written checklist to verified authorities and verified figures. Items that still
// carry an unverified citation or figure are dropped; unverified subsections are trimmed.
export function lockChecklist(items, verified, userFacts = '') {
  const allowed = new Set([...verified.figSet, ...figureSet([userFacts])]);
  const out = [];
  for (const raw of items) {
    if (typeof raw !== 'string') continue;
    const item = trimUnverifiedSubsections(raw.slice(0, 300), verified).text;
    if (findUnverified(item, verified.set).length) continue;
    if (sentenceFigureHits(item, allowed).length) continue;
    out.push(item);
  }
  return out;
}

