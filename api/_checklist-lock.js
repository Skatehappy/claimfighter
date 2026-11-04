// api/_checklist-lock.js — citation + numeric lock for the appeal checklist (used by api/checklist.js and the gate tests).
import { findUnverified, trimUnverifiedSubsections } from './_citelint.js';
import { figureSet, sentenceFigureHits } from './_numlint.js';

// Fallback lists are per claim type: see api/_checklist-fallbacks.js.

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

