// api/generate.js
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
    const body = await req.json();
    const { accessCode, systemPrompt, userPrompt, reviewMode, draftLetter } = body;

    if (!accessCode || !accessCode.trim()) {
      return new Response(JSON.stringify({ error: 'Access code required' }), { status: 401, headers });
    }

    const payhipSecret = process.env.PAYHIP_SECRET_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!payhipSecret) {
      return new Response(JSON.stringify({ error: 'Service not configured' }), { status: 500, headers });
    }

    const isCheckCall = systemPrompt === 'Reply: VALID';

    if (!isCheckCall) {
      // Verify license key against Payhip API v2
      const payhipRes = await fetch(
        `https://payhip.com/api/v2/license/verify?license_key=${encodeURIComponent(accessCode.trim())}`,
        {
          method: 'GET',
          headers: { 'product-secret-key': payhipSecret },
        }
      );

      const payhipData = payhipRes.ok ? await payhipRes.json() : null;

      if (!payhipData || !payhipData.data || payhipData.data.enabled === false) {
        return new Response(JSON.stringify({ error: 'Invalid access code. Check your Payhip receipt email.' }), { status: 401, headers });
      }

      if (payhipData.data.uses >= 1) {
        return new Response(JSON.stringify({ error: 'This code has already been used. Each code generates one letter.' }), { status: 401, headers });
      }
    }

    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: 'API not configured' }), { status: 500, headers });
    }

    let messages;
    if (reviewMode && draftLetter) {
      messages = [{ role: 'user', content: `Review and improve this appeal letter. Fix vague language, ensure all arguments are explicitly stated, remove emotional appeals, tighten redundancy. Return ONLY the improved letter:\n\n${draftLetter}` }];
    } else {
      messages = [{ role: 'user', content: userPrompt }];
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: (!isCheckCall && systemPrompt) ? systemPrompt : undefined,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: 'AI generation failed', detail: err }), { status: 502, headers });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Mark license as used after successful generation (non-blocking)
    if (!isCheckCall) {
      fetch(
        `https://payhip.com/api/v2/license/usage?license_key=${encodeURIComponent(accessCode.trim())}`,
        {
          method: 'PUT',
          headers: { 'product-secret-key': payhipSecret },
        }
      ).catch(() => {});
    }

    return new Response(JSON.stringify({ text }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}
