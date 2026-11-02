// api/generate.js
import { MODEL } from './_config.js';
import { verifiedFor, citationBlock, lintLetter } from './_citelint.js';
import { verifyLicense, isG4TCode, g4tCount } from './_auth.js';

// Node serverless runtime (NOT edge). Edge caps at ~25s on Hobby and ignores
// maxDuration, which 504'd ~25s Opus letters. Node honors maxDuration:60. This
// MUST use the classic (req, res) handler: Vercel's Node runtime writes the
// response via res and IGNORES a returned Response object (returning one hangs
// the function until the timeout).
export const config = { maxDuration: 60 };

const PRODUCT_LINK = 'O80Tw';

// One Anthropic call; returns the text or throws.
async function callModel({ anthropicKey, system, messages }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 3000, thinking: { type: 'disabled' }, system: system || undefined, messages }),
  });
  if (!response.ok) { const e = new Error('AI generation failed'); e.status = 502; e.detail = await response.text(); throw e; }
  const data = await response.json();
  // Extract the text block by type, not by position (adaptive thinking can put a thinking block first).
  const text = data.content?.find(b => b.type === 'text')?.text;
  if (!text) throw new Error(`No text block in API response (stop_reason: ${data.stop_reason || 'unknown'})`);
  return text;
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
}

async function readBody(req) {
  if (req.body !== undefined && req.body !== null) {
    return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  }
  const chunks = [];
  for await (const c of req) chunks.push(typeof c === 'string' ? Buffer.from(c) : c);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  cors(res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const t0 = Date.now();
  try {
    const { accessCode, systemPrompt, userPrompt, reviewMode, draftLetter, state } = await readBody(req);

    if (!accessCode || !accessCode.trim()) {
      return res.status(401).json({ error: 'Access code required' });
    }

    const payhipApiKey = process.env.PAYHIP_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!payhipApiKey || !anthropicKey) {
      return res.status(500).json({ error: 'Service not configured' });
    }

    const isCheckCall = systemPrompt === 'Reply: VALID';

    const g4t = isG4TCode(accessCode);
    if (g4t) {
      // Gate-check call: answer without touching Payhip or the model.
      if (isCheckCall) { console.log(JSON.stringify({ event: 'g4t_use', kind: 'check' })); return res.status(200).json({ text: 'VALID' }); }
      if (!g4tCount()) return res.status(429).json({ error: 'G4T daily cap reached.' });
    } else {
      const lic = await verifyLicense(accessCode, PRODUCT_LINK, payhipApiKey);
      if (!lic.ok) return res.status(lic.status).json({ error: lic.error });
    }

    // Gate-check call: the license is verified above; answer without a model call or usage-mark.
    if (isCheckCall) return res.status(200).json({ text: 'VALID' });

    let messages;
    if (reviewMode && draftLetter) {
      messages = [{ role: 'user', content: `Review and improve this appeal letter. Fix vague language, ensure all arguments are explicitly stated, remove emotional appeals, tighten redundancy. Return ONLY the improved letter:\n\n${draftLetter}` }];
    } else {
      messages = [{ role: 'user', content: userPrompt }];
    }

    // Citation lock: the model sees only VERIFICATION_LOG-verified authorities for the buyer's
    // state (plus federal), and the output is linted against the same set below. The check call
    // ("Reply: VALID") is not a letter and is left untouched.
    const verified = verifiedFor(state);
    const lock = isCheckCall ? '' : citationBlock(verified);
    const system = isCheckCall ? undefined : ((systemPrompt || '') + lock).trim() || undefined;

    let text = await callModel({ anthropicKey, system, messages });

    if (!isCheckCall) {
      const linted = await lintLetter(text, verified, async forbidden => {
        // one regeneration, skipped when the 60s function budget is mostly spent
        if (Date.now() - t0 > 30000) return null;
        try {
          return await callModel({ anthropicKey, system: (system || '') + `

Your previous draft cited authorities that are not verified: ${forbidden.join('; ')}. Rewrite the letter and do NOT cite those or any authority not in the verified list.`, messages });
        } catch { return null; }
      });
      text = linted.text;
      if (!text) throw new Error('Letter was empty after citation check.');
    }

    // Mark license as used. Awaited (not fire-and-forget): on Node serverless,
    // work after res is sent is not guaranteed to run. Only for real buyer codes.
    if (!isCheckCall && !g4t) {
      try {
        await fetch(`https://payhip.com/api/v1/license/usage`, {
          method: 'PUT',
          headers: { 'payhip-api-key': payhipApiKey, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `product_link=${PRODUCT_LINK}&license_key=${encodeURIComponent(accessCode.trim())}`,
        });
      } catch { /* letter already generated; don't fail the response on a usage-mark hiccup */ }
    }

    return res.status(200).json({ text });

  } catch (err) {
    if (err.status === 502) return res.status(502).json({ error: err.message, detail: err.detail });
    return res.status(500).json({ error: err.message });
  }
}
