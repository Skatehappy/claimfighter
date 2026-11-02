// api/_auth.js — shared license gate for api/generate.js and api/checklist.js.
// Nothing may reach api.anthropic.com unless verifyLicense() passed or isG4TCode() matched
// (scripts/verify-gate.mjs A11 enforces this).

// Fail-closed Payhip license verify. Runs on EVERY request (gate check and
// generation). Rejects unless HTTP 200 + data.enabled===true + product_link
// matches this app. Network error / timeout / non-JSON -> 503 (never "invalid").
export async function verifyLicense(licenseKey, productLink, apiKey) {
  const key = (licenseKey || '').trim();
  if (!key) return { ok: false, status: 401, error: 'Invalid license key.' };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const url = `https://payhip.com/api/v1/license/verify?product_link=${encodeURIComponent(productLink)}&license_key=${encodeURIComponent(key)}`;
    const res = await fetch(url, { headers: { 'payhip-api-key': apiKey }, signal: controller.signal });
    if (res.status !== 200) return { ok: false, status: 401, error: 'Invalid license key.' };
    const json = await res.json();
    const d = json && json.data;
    if (!d || d.enabled !== true || d.product_link !== productLink) {
      return { ok: false, status: 401, error: 'Invalid license key.' };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, status: 503, error: 'License verification unavailable — please try again shortly.' };
  } finally {
    clearTimeout(timer);
  }
}

// ── Gate-4 test code (G4T-) ─────────────────────────────────────────────────
// Lets the owner run the full generate flow without burning a Payhip code. INERT unless the
// Vercel env var G4_TEST_CODE_SECRET (>=16 chars, no default) is set; the accepted code is
// "G4T-" + that secret. A G4T code skips the Payhip verify and the usage-mark, never calls
// the model for the gate check, and is capped at G4T_DAILY_MODEL_CALLS model calls per UTC day
// (30 = 10 letters of 3 calls). The counter is in module memory: best-effort per warm
// serverless instance (resets on cold start, not shared across instances), so treat the cap
// as a runaway guard, not an accounting limit. Every use is logged (never the code itself).
const G4T_DAILY_MODEL_CALLS = 30;
const g4tUse = { day: '', n: 0 };
function safeEq(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
export function isG4TCode(accessCode) {
  const secret = process.env.G4_TEST_CODE_SECRET || '';
  if (secret.length < 16) return false;
  return safeEq(String(accessCode || '').trim(), 'G4T-' + secret);
}
export function g4tCount() {
  const day = new Date().toISOString().slice(0, 10);
  if (g4tUse.day !== day) { g4tUse.day = day; g4tUse.n = 0; }
  if (g4tUse.n >= G4T_DAILY_MODEL_CALLS) return false;
  g4tUse.n++;
  console.log(JSON.stringify({ event: 'g4t_use', n: g4tUse.n, cap: G4T_DAILY_MODEL_CALLS, day }));
  return true;
}
