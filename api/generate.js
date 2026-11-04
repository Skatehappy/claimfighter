// api/generate.js
import { MODEL } from './_config.js';
import { verifiedFor, citationBlock, lintLetter } from './_citelint.js';
import { verifyLicense, isG4TCode, g4tCount } from './_auth.js';
import { figureSet } from './_numlint.js';
import { callComplete } from './_complete.js';

// Node serverless runtime (NOT edge). Edge caps at ~25s on Hobby and ignores
// maxDuration, which 504'd ~25s Opus letters. Node honors maxDuration:60. This
// MUST use the classic (req, res) handler: Vercel's Node runtime writes the
// response via res and IGNORES a returned Response object (returning one hangs
// the function until the timeout).
export const config = { maxDuration: 60 };

const PRODUCT_LINK = 'O80Tw';

// One Anthropic call; returns the text or throws. stop_reason "max_tokens" = truncated: callComplete retries
// once with a higher limit, and a still-truncated reply throws a 502 so no partial letter is ever linted,
// returned or counted against the license.
const TOKEN_LIMITS = [3000, 6000];
// Time budget: ONE request must stay well under the 60s Node limit (Hobby max). Model calls (first call, truncation
// retry, lint regeneration) share one hard deadline at MODEL_BUDGET_MS after handler start (the license verify is
// already inside it; the usage mark adds <=4s: worst case ~48s). The truncation retry needs 68% of the budget still
// free and the lint regeneration 57%; otherwise they are skipped (retry -> clean 502 try again, regeneration ->
// unverified sentences are stripped). CF_GEN_BUDGET_MS only exists so tests can scale time.
export const MODEL_BUDGET_MS = 44000;
const budgetMs = () => Number(process.env.CF_GEN_BUDGET_MS) || MODEL_BUDGET_MS;
async function callModel({ anthropicKey, system, messages, deadline, limits = TOKEN_LIMITS, minRetryMs = 0 }) {
  const r = await callComplete('https://api.anthropic.com/v1/messages', anthropicKey, max => ({ model: MODEL, max_tokens: max, thinking: { type: 'disabled' }, system: system || undefined, messages }), limits, { deadline, minRetryMs });
  if (!r.ok) {
    const e = new Error(r.truncated ? 'The letter came out incomplete. Nothing was lost and your access code has not been used. Click Try again; it is free.' : r.timeout ? 'The AI took too long. Nothing was lost and your access code has not been used. Click Try again; it is free.' : 'AI generation failed');
    e.status = 502; e.detail = r.err; throw e;
  }
  return r.text;
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
    // Input caps (server side; the client shows a visible counter). Over-cap = invalid input, code NOT consumed.
    const over = (v, n) => typeof v === 'string' && v.length > n;
    if (over(accessCode, 128) || over(systemPrompt, 20000) || over(userPrompt, 20000) || over(draftLetter, 20000) || over(state, 60)) {
      return res.status(413).json({ error: 'Input too long. Shorten your entries and try again — your access code has not been used.', kind: 'invalid_input' });
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
      messages = [{ role: 'user', content: `Review and improve this appeal letter. Write plain text only: no markdown, no asterisks, no # headings, no tables. Keep the sender contact block ([Your Name], [Address], [Phone], [Email]) and [DATE] placeholders exactly as in the draft. Fix vague language, ensure all arguments are explicitly stated, remove emotional appeals, tighten redundancy. Return ONLY the improved letter:\n\n${draftLetter}` }];
    } else {
      messages = [{ role: 'user', content: userPrompt }];
    }

    // Citation lock: the model sees only VERIFICATION_LOG-verified authorities for the buyer's
    // state (plus federal), and the output is linted against the same set below. The check call
    // ("Reply: VALID") is not a letter and is left untouched.
    const verified = verifiedFor(state);
    const lock = isCheckCall ? '' : citationBlock(verified);
    const system = isCheckCall ? undefined : ((systemPrompt || '') + lock).trim() || undefined;

    const B = budgetMs(), deadline = t0 + B;
    let text = await callModel({ anthropicKey, system, messages, deadline, minRetryMs: B * 0.68 });

    if (!isCheckCall) {
      // numeric-claims allow-list: verified data for this state + the buyer's own facts + this app's own instructions
      const figAllowed = new Set([...verified.figSet, ...figureSet([systemPrompt || '', userPrompt || '', draftLetter || ''])]);
      const linted = await lintLetter(text, verified, async forbidden => {
        // one regeneration (single call, no truncation retry), skipped unless 57% of the budget is still free
        if (deadline - Date.now() < B * 0.57) return null;
        try {
          return await callModel({ anthropicKey, deadline, limits: [TOKEN_LIMITS[1]], system: (system || '') + `

Your previous draft cited authorities or stated figures that are not verified: ${forbidden.join('; ')}. Rewrite the letter and do NOT cite those or any authority not in the verified list, and do not state any dollar amount, percentage or number of days/months/years as a legal rule unless it is in the verified list or the policyholder's own facts.`, messages });
        } catch { return null; }
      }, console.log, { figAllowed });
      text = linted.text;
      if (!text) throw new Error('Letter was empty after citation check.');
    }

    // Mark license as used. Awaited (not fire-and-forget): on Node serverless,
    // work after res is sent is not guaranteed to run. Only for real buyer codes.
    if (!isCheckCall && !g4t) {
      try {
        await fetch(`https://payhip.com/api/v1/license/usage`, {
          signal: AbortSignal.timeout(Math.min(4000, B / 10)),
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
