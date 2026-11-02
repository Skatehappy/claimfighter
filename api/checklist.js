// api/checklist.js
import { MODEL } from './_config.js';
import { verifyLicense, isG4TCode, g4tCount } from './_auth.js';
import { verifiedFor, citationBlock } from './_citelint.js';
import { FALLBACK_CHECKLIST, lockChecklist } from './_checklist-lock.js';

export const config = { runtime: 'edge' };

const PRODUCT_LINK = 'O80Tw';

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });

  try {
    const { accessCode, state: rawState, varianceType: rawVar, letterExcerpt } = await req.json();
    // Input caps: over-cap = invalid input, the code is not consumed.
    const tooLong = (v, n) => typeof v === 'string' && v.length > n;
    if (tooLong(accessCode, 128) || tooLong(rawState, 60) || tooLong(rawVar, 120) || tooLong(letterExcerpt, 20000)) {
      return new Response(JSON.stringify({ error: 'Input too long. Shorten your entries and try again — your access code has not been used.', kind: 'invalid_input' }), { status: 413, headers });
    }
    const state = String(rawState || '').slice(0, 60);
    const varianceType = String(rawVar || '').slice(0, 120);

    // Same gate as api/generate.js: a passed Payhip verify or a G4T test code, else no Anthropic call.
    const payhipApiKey = process.env.PAYHIP_API_KEY;
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!accessCode || !String(accessCode).trim()) {
      return new Response(JSON.stringify({ error: 'Access code required' }), { status: 401, headers });
    }
    if (!payhipApiKey || !apiKey) {
      return new Response(JSON.stringify({ error: 'Service not configured' }), { status: 500, headers });
    }
    if (isG4TCode(accessCode)) {
      if (!g4tCount()) return new Response(JSON.stringify({ error: 'G4T daily cap reached.' }), { status: 429, headers });
    } else {
      const lic = await verifyLicense(accessCode, PRODUCT_LINK, payhipApiKey);
      if (!lic.ok) return new Response(JSON.stringify({ error: lic.error }), { status: lic.status, headers });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 900,
        system: citationBlock(verifiedFor(state)).trim(),
        thinking: { type: 'disabled' },
        messages: [{
          role: 'user',
          content: `Generate a practical insurance appeal submission checklist as a JSON array of strings. Be specific to an insurance claim appeal. Include practical steps like: send via certified mail, keep a copy of everything, note the deadline stated in the denial, include supporting records or estimates, document all communications, ask about external review, file a state insurance department complaint if needed. Do not state any deadline, dollar amount or percentage unless it is in the verified list. Return ONLY a valid JSON array, no other text.

State: ${state}
Claim type: ${varianceType || 'insurance appeal'}
Letter excerpt: ${letterExcerpt?.substring(0, 200) || ''}`,
        }],
      }),
    });

    // Fail loudly on an API error instead of silently returning an empty
    // checklist (the pre-migration bug: a dead model 404'd and this returned []).
    if (!response.ok) {
      const detail = await response.text();
      return new Response(JSON.stringify({ error: 'Checklist generation failed', detail }), { status: 502, headers });
    }

    const data = await response.json();
    const text = data.content?.find(b => b.type === 'text')?.text || '[]';
    const clean = text.replace(/```json|```/g, '').trim();

    let checklist;
    try {
      const parsed = JSON.parse(clean);
      checklist = lockChecklist(Array.isArray(parsed) ? parsed : [], verifiedFor(state), `${state} ${varianceType} ${letterExcerpt?.substring(0, 200) || ''}`);
      if (checklist.length < 3) checklist = FALLBACK_CHECKLIST;
    } catch {
      checklist = FALLBACK_CHECKLIST;
    }

    return new Response(JSON.stringify({ checklist }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}
