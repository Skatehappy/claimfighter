// api/checklist.js
import { MODEL } from './_config.js';

export const config = { runtime: 'edge' };

const VALID_CODES = (process.env.ACCESS_CODES || '').split(',').map(c => c.trim()).filter(Boolean);

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
    const { accessCode, state, varianceType, letterExcerpt } = await req.json();

    if (!accessCode || !VALID_CODES.includes(accessCode.toUpperCase())) {
      return new Response(JSON.stringify({ error: 'Invalid access code' }), { status: 401, headers });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

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
        thinking: { type: 'disabled' },
        messages: [{
          role: 'user',
          content: `Generate a practical insurance appeal submission checklist as a JSON array of strings. Be specific to an insurance claim appeal. Include items like: send via certified mail, keep copy of everything, note the deadline, include all supporting medical records or repair estimates, get doctor's letter if health claim, document all communications, request external review if denied again, file state insurance commissioner complaint if needed, etc. Return ONLY a valid JSON array, no other text.

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
      checklist = JSON.parse(clean);
    } catch {
      checklist = [
        'Send letter via certified mail with return receipt requested',
        'Keep a complete copy of everything you send',
        'Note the appeal deadline — most insurers require response within 30-60 days',
        'Attach all supporting documentation: medical records, repair estimates, receipts',
        'Get a letter from your doctor or contractor supporting your claim if applicable',
        'Document all phone calls with insurer — date, time, rep name, what was said',
        'Request confirmation of receipt in writing',
        'If denied again, request external independent review (your legal right under ACA)',
        'File a complaint with your state insurance commissioner if bad faith is suspected',
        'Consult an attorney for claims over $10,000',
      ];
    }

    return new Response(JSON.stringify({ checklist }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}
