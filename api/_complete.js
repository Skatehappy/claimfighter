// api/_complete.js — one Anthropic Messages call that never hands back a truncated reply (Edge-safe: no node: imports).
// stop_reason "max_tokens" means the reply was cut off. The call is retried ONCE with the next, higher limit in
// `limits`; if that is also cut off the result is { ok: false, truncated: true } and no partial text is returned,
// so callers can never parse or send half an output.
// The endpoint URL is passed in by the handler (which has already passed verifyLicense): auth-gate rule - no helper
// module names the Anthropic host itself.
//
// Time budget (opts.deadline = absolute ms epoch, opts.minRetryMs): every fetch is aborted when the deadline passes
// (result { ok:false, timeout:true }), and the truncation retry is skipped (reported as truncated) unless at least
// minRetryMs remain, so one request can never stack calls past the function limit.
export async function callComplete(url, apiKey, buildBody, limits, opts = {}) {
  const { deadline = null, minRetryMs = 0 } = opts;
  for (let i = 0; i < limits.length; i++) {
    const remaining = deadline ? deadline - Date.now() : Infinity;
    if (i > 0 && remaining < minRetryMs) return { ok: false, truncated: true, retrySkipped: true, err: 'Model reply was cut off; retry skipped (time budget)', attempts: i };
    if (remaining <= 0) return { ok: false, timeout: true, err: 'time budget exhausted', attempts: i };
    const ctl = new AbortController();
    const timer = deadline ? setTimeout(() => ctl.abort(), remaining) : null;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify(buildBody(limits[i])),
        signal: ctl.signal,
      });
      if (!response.ok) return { ok: false, status: response.status, err: await response.text() };
      const data = await response.json();
      if (data.stop_reason === 'max_tokens') {
        if (i < limits.length - 1) continue;
        return { ok: false, truncated: true, err: 'Model reply was cut off at the token limit', stop: data.stop_reason, attempts: i + 1 };
      }
      // Extract the text block by type, not by position (adaptive thinking can put a "thinking" block first).
      const text = data.content?.find(b => b.type === 'text')?.text;
      if (!text) return { ok: false, err: `No text block in API response (stop_reason: ${data.stop_reason || 'unknown'})`, stop: data.stop_reason };
      return { ok: true, text, stop: data.stop_reason, attempts: i + 1 };
    } catch (e) {
      if (!deadline) throw e;
      return { ok: false, timeout: ctl.signal.aborted, err: String((e && e.message) || e), attempts: i + 1 };
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
  return { ok: false, err: 'no token limits given' };
}
