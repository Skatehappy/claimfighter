// api/checklist.js
import { MODEL } from './_config.js';
import { verifyLicense, isG4TCode, g4tCount } from './_auth.js';
import { verifiedFor, citationBlock } from './_citelint.js';
import { lockChecklist } from './_checklist-lock.js';
import { callComplete } from './_complete.js';
import { typeInfo, fallbackFor } from './_checklist-fallbacks.js';

export const config = { runtime: 'edge' };

const PRODUCT_LINK = 'O80Tw';

// Called only after the license gate in the handler. [2000, 4000]: one retry with a higher limit on truncation.
// Edge must start responding within 25s: model time is capped at 20s (hard abort -> per-type fallback) and the
// 4000-token retry only runs when >= 50% of that budget is left. CF_CL_BUDGET_MS only exists so tests can scale time.
export const CHECKLIST_BUDGET_MS = 20000;
const callModel = (apiKey, system, prompt, t0) => {
  const B = Number(process.env.CF_CL_BUDGET_MS) || CHECKLIST_BUDGET_MS;
  return callComplete('https://api.anthropic.com/v1/messages', apiKey, max => ({ model: MODEL, max_tokens: max, system: system || undefined, thinking: { type: 'disabled' }, messages: [{ role: 'user', content: prompt }] }), [2000, 4000], { deadline: Math.min(Date.now() + B, t0 + B * 1.1), minRetryMs: B * 0.5 });
};

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });

  const t0 = Date.now();
  try {
    const { accessCode, state: rawState, varianceType: rawVar, claimType: rawClaim, letterExcerpt } = await req.json();
    // Input caps: over-cap = invalid input, the code is not consumed.
    const tooLong = (v, n) => typeof v === 'string' && v.length > n;
    if (tooLong(accessCode, 128) || tooLong(rawState, 60) || tooLong(rawVar, 120) || tooLong(letterExcerpt, 20000)) {
      return new Response(JSON.stringify({ error: 'Input too long. Shorten your entries and try again — your access code has not been used.', kind: 'invalid_input' }), { status: 413, headers });
    }
    const state = String(rawState || '').slice(0, 60);
    // The client sends the selected claim type as varianceType (older clients sent a constant: treated as neutral).
    const varianceType = String(rawClaim || rawVar || '').slice(0, 120);

    // Same gate as api/generate.js: a passed Payhip verify or a G4T test code, else no Anthropic call.
    const payhipApiKey = process.env.PAYHIP_API_KEY;
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!accessCode || !String(accessCode).trim()) {
      return new Response(JSON.stringify({ error: 'Access code required' }), { status: 401, headers });
    }
    if (!payhipApiKey || !apiKey) {
      return new Response(JSON.stringify({ error: 'Service not configured' }), { status: 500, headers });
    }
    const testMode = isG4TCode(accessCode);
    if (testMode) {
      if (!g4tCount()) return new Response(JSON.stringify({ error: 'G4T daily cap reached.' }), { status: 429, headers });
    } else {
      const lic = await verifyLicense(accessCode, PRODUCT_LINK, payhipApiKey);
      if (!lic.ok) return new Response(JSON.stringify({ error: lic.error }), { status: lic.status, headers });
    }

    const system = citationBlock(verifiedFor(state)).trim();
    const prompt = `Generate a practical submission checklist for someone appealing ${typeInfo(varianceType).focus}, as a JSON array of 8 to 10 strings. Every item is one plain action step of at most 25 words and fits this situation only. Always include sending the letter by certified mail with return receipt and keeping a copy. Do not state any deadline, dollar amount or percentage unless it is in the verified list. Return ONLY a valid JSON array, no other text.

State: ${state}
Claim type: ${varianceType || 'insurance appeal'}
Letter excerpt: ${letterExcerpt?.substring(0, 200) || ''}`;

    // Never parse a cut-off reply: callComplete retries once with a higher limit, then reports truncation.
    // ANY model failure (HTTP error, truncation, unparseable reply, too few survivors of the lock) returns
    // HTTP 200 with this claim type's own fallback list.
    const diag = {};
    const r = await callModel(apiKey, system, prompt, t0);
    diag.attempts = r.attempts; diag.stop = r.stop; diag.status = r.status;
    let checklist = null;
    if (r.ok) {
      try {
        const clean = r.text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean);
        checklist = lockChecklist(Array.isArray(parsed) ? parsed : [], verifiedFor(state), `${state} ${varianceType} ${letterExcerpt?.substring(0, 200) || ''}`);
        diag.survivors = checklist.length;
      } catch { diag.parseFailed = true; }
    } else {
      diag.failed = r.truncated ? 'truncated' : r.timeout ? 'timeout' : 'model-error';
      console.log(JSON.stringify({ evt: 'checklist_model_fail', reason: diag.failed, status: r.status || null }));
    }
    if (!Array.isArray(checklist) || checklist.length < 3) { diag.usedFallback = true; checklist = fallbackFor(varianceType); }

    return new Response(JSON.stringify(testMode ? { checklist, _diag: diag } : { checklist }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}
