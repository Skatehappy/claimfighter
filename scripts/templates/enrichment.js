// scripts/templates/enrichment.js
// ── SEO Content Enrichment (Phase 2) ──────────────────────────────────────────
// Injects verified, state-specific insurance-claims regulatory sections BELOW the
// existing page content. All prose is assembled from scripts/data/state-data.json
// so the sentences a reader sees are driven by each state's ACTUAL claims-handling
// framework (a bad-faith-tort state reads differently from a statutory-penalty
// state) — never the same paragraph with the state name swapped.
//
// PORTABLE ACROSS ALL 5 LETTER APPS: the section scaffold, FAQ-schema merge, and
// state-link cluster are domain-agnostic. Only TOPIC_EMPHASIS (which data fields a
// given dispute slug leans on) and the field-specific prose helpers change per app
// domain. See VERIFICATION_LOG-SEO-CONTENT.md.

function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
function has(v) {
  if (v == null) return false;
  const s = String(v).trim();
  return s !== '' && s.toLowerCase() !== 'null' && s.toLowerCase() !== 'n/a';
}
function article(word) { return /^[aeiou]/i.test(String(word).trim()) ? 'an' : 'a'; }

// Which data fields each dispute topic should foreground in "Your Rights".
// Falls back to the general set for any slug not listed.
const TOPIC_EMPHASIS = {
  'denied-homeowners-insurance-claim':   ['claim_deadlines', 'bad_faith'],
  'underpaid-property-damage-claim':     ['appraisal', 'bad_faith'],
  'hurricane-storm-damage-dispute':      ['claim_deadlines', 'appraisal'],
  'water-damage-claim-denial':           ['claim_deadlines', 'bad_faith'],
  'fire-damage-claim-underpayment':      ['appraisal', 'statute_of_limitations'],
  'auto-insurance-claim-denial':         ['claim_deadlines', 'bad_faith'],
  'health-insurance-claim-appeal':       ['external_review', 'claim_deadlines'],
  'roof-damage-claim-dispute':           ['appraisal', 'bad_faith'],
  'bad-faith-insurance-letter':          ['bad_faith', 'claim_deadlines'],
  'business-interruption-claim-dispute': ['claim_deadlines', 'bad_faith'],
};
const ALL_RIGHTS = ['claim_deadlines', 'bad_faith', 'appraisal', 'statute_of_limitations', 'external_review'];

// Text helpers: keep authoritative data verbatim, control punctuation/casing.
function clean(str) { return String(str == null ? '' : str).trim().replace(/\s+/g, ' ').replace(/\.+$/, ''); }
function sent(str) { const t = clean(str); return t ? t + '.' : ''; }

// ── Prose builders (each returns plain text, escaped later) ────────────────────

function deadlineProse(state, d) {
  const c = d.claim_deadlines || {};
  const bits = [];
  if (has(c.acknowledge) && has(c.decision) && has(c.payment)) {
    bits.push(`In ${state}, your insurer must acknowledge your claim ${clean(c.acknowledge)}, accept or deny it ${clean(c.decision)}, and pay an accepted claim ${clean(c.payment)}.`);
  } else {
    if (has(c.acknowledge)) bits.push(`In ${state}, your insurer must acknowledge your claim ${clean(c.acknowledge)}.`);
    if (has(c.decision)) bits.push(`It must accept or deny the claim ${clean(c.decision)}.`);
    if (has(c.payment)) bits.push(`An accepted claim must be paid ${clean(c.payment)}.`);
  }
  if (has(c.status_updates)) bits.push(sent(c.status_updates));
  if (has(c.interest_penalty)) bits.push(sent(c.interest_penalty));
  return bits.join(' ');
}

function badFaithProse(state, d) {
  const b = d.bad_faith || {};
  const bits = [];
  if (b.recognized === false) {
    bits.push(`${state} does not recognize a separate first-party bad-faith tort.`);
  } else if (has(b.type)) {
    bits.push(`${state} recognizes ${b.type}.`);
  }
  if (has(b.basis)) bits.push(sent(b.basis));
  if (has(b.remedies)) bits.push(sent(b.remedies));
  return bits.join(' ');
}

function appraisalProse(state, d) {
  const a = d.appraisal || {};
  if (a.available === false) {
    return `${state} law does not provide a statutory appraisal process; disputes over the amount of loss are resolved by negotiation or the courts.`;
  }
  if (has(a.notes)) return clean(a.notes) + '.';
  return `${state} property policies commonly include an appraisal clause that either party may invoke to resolve a dispute over the amount of loss.`;
}

function solProse(state, d) {
  return has(d.statute_of_limitations) ? sent(d.statute_of_limitations) : '';
}

function externalReviewProse(state, d) {
  return has(d.external_review) ? sent(d.external_review) : '';
}

const RIGHTS_RENDER = {
  claim_deadlines:        { label: 'Claim-handling deadlines', fn: deadlineProse },
  bad_faith:              { label: 'Bad-faith remedies',       fn: badFaithProse },
  appraisal:              { label: 'Appraisal rights',         fn: appraisalProse },
  statute_of_limitations: { label: 'Deadline to sue',          fn: solProse },
  external_review:        { label: 'Health-claim appeals',     fn: externalReviewProse },
};

function overviewProse(state, d) {
  const st = d.primary_insurance_statute || {};
  const paras = [];
  // Para 1 — the governing statute/regulations.
  if (has(st.name)) {
    paras.push(`${state} regulates how insurers handle claims primarily through the ${st.name}${has(st.citation) ? ` (${st.citation})` : ''}. It sets the baseline rules for acknowledging, investigating, and paying claims that every insurer in the state must follow, regardless of what an individual adjuster prefers.`);
  }
  // Para 2 — regulator + how to complain.
  const rb = d.regulatory_body || '';
  if (has(rb)) {
    paras.push(`${sent(rb)}${has(d.complaint_process) ? ' ' + sent(d.complaint_process) : ''}`);
  }
  // Para 3 — recent reform, only if it is an actual change (skip "no/none").
  if (has(d.last_major_reform) && !/^(no|none)\b/i.test(d.last_major_reform)) {
    paras.push(`A recent change to watch: ${sent(d.last_major_reform)}`);
  }
  return paras;
}

// ── Section renderer ──────────────────────────────────────────────────────────
export function renderEnrichmentSections(state, dispute, d) {
  if (!d) return ''; // no data for this state → inject nothing (fail safe)
  const S = state.name;

  const overview = overviewProse(S, d).map(p => `      <p>${esc(p)}</p>`).join('\n');

  const emphasis = TOPIC_EMPHASIS[dispute.slug] || ALL_RIGHTS;
  const ordered = [...emphasis, ...ALL_RIGHTS.filter(k => !emphasis.includes(k))];
  const rights = ordered.map(k => {
    const r = RIGHTS_RENDER[k];
    if (!r) return '';
    const text = r.fn(S, d);
    if (!has(text)) return '';
    return `      <p><strong>${r.label}:</strong> ${esc(text)}</p>`;
  }).filter(Boolean).join('\n');

  // How to file a complaint / take action.
  const complaintBody = has(d.complaint_process)
    ? esc(d.complaint_process)
    : `${esc(S)} policyholders can file a complaint with the state insurance regulator, and a statute-cited demand letter is usually the practical first step toward getting a denied or underpaid claim reconsidered.`;

  // Common disputes.
  const issues = Array.isArray(d.common_issues) ? d.common_issues.filter(has) : [];
  const issuesList = issues.length
    ? `      <ul>\n${issues.map(i => `        <li>${esc(i)}</li>`).join('\n')}\n      </ul>`
    : `      <p>The most common ${esc(S)} insurance-claim disputes involve wind, water, and fire losses and disagreements over the amount of loss.</p>`;

  const protections = Array.isArray(d.unique_protections) ? d.unique_protections.filter(has) : [];
  const protectionsBlock = protections.length
    ? `    <section class="enrich-section report-avoid-break">
      <h2>${esc(S)} Policyholder Protections Worth Knowing</h2>
      <ul>\n${protections.slice(0, 5).map(p => `        <li>${esc(p)}</li>`).join('\n')}\n      </ul>
    </section>`
    : '';

  return `
  <div class="enrich">
    <section class="enrich-section report-avoid-break">
      <h2>${esc(S)} Insurance Claim Law Overview</h2>
${overview}
    </section>

    <section class="enrich-section report-avoid-break">
      <h2>Your Rights as ${article(S)} ${esc(S)} Policyholder</h2>
${rights}
    </section>

    <section class="enrich-section report-avoid-break">
      <h2>How to File an Insurance Complaint in ${esc(S)}</h2>
      <p>${complaintBody}</p>
    </section>

    <section class="enrich-section report-avoid-break">
      <h2>Common Insurance Claim Disputes in ${esc(S)}</h2>
${issuesList}
    </section>
${protectionsBlock}
  </div>`;
}

// ── Data-derived FAQ Q&As (2–3) to merge into the existing FAQ + schema ────────
export function dataFaqs(state, d) {
  if (!d) return [];
  const S = state.name;
  const out = [];

  const c = d.claim_deadlines || {};
  if (has(c.decision)) {
    const bits = [`In ${S}, your insurer must acknowledge your claim ${clean(c.acknowledge)} and accept or deny it ${clean(c.decision)}.`];
    if (has(c.interest_penalty)) bits.push(sent(c.interest_penalty));
    out.push({ q: `How long does my ${S} insurer have to pay or deny my claim?`, a: bits.join(' ') });
  }

  const b = d.bad_faith || {};
  if (b.recognized === false) {
    out.push({ q: `Does ${S} recognize a bad-faith insurance claim?`, a: `${clean(badFaithProse(S, d))}.` });
  } else if (has(b.remedies)) {
    out.push({ q: `What can I recover if my ${S} insurer acted in bad faith?`, a: sent(b.remedies) });
  }

  if (has(d.statute_of_limitations)) {
    out.push({ q: `How long do I have to sue my insurer for a denied claim in ${S}?`, a: sent(d.statute_of_limitations) });
  }

  return out.slice(0, 3);
}

// One-paragraph state-law snapshot for the per-state hub page (plain text).
export function stateLawSnapshot(stateName, d) {
  if (!d) return '';
  return overviewProse(stateName, d)[0] || '';
}

// ── Small hub/teaser helper: a one-line state-law teaser ──────────────────────
export function stateTeaser(state, d) {
  if (!d) return '';
  const st = d.primary_insurance_statute || {};
  const b = d.bad_faith || {};
  const badFaith = b.recognized === false
    ? 'no separate bad-faith tort (contract + consequential damages)'
    : (has(b.type) ? b.type : 'bad-faith remedies');
  return `Governed by ${has(st.name) ? st.name : 'state insurance law'}${has(st.citation) ? ` (${st.citation})` : ''}; ${badFaith}`;
}
