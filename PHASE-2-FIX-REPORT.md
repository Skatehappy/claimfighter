# ClaimFighter — Phase-2 Regulatory Fix Report
Date: 2026-07-19
Standard: Three-Gate v7
Retrieval layer: Perplexity MCP (verdicts dated 2026-07-19)

## Summary
Created VERIFICATION_LOG.md, verified every statutory citation surfaced by
`scripts/verify-gate.mjs` (A9 citation-log parity), applied one scope fix to the
ERISA appeal-deadline language, and drove the verify gate green.

## Gate status
- Before: GATE RED — 14 unlogged citation(s).
- After: GATE GREEN — A1 files ok; A9 citation-log parity: all 14 citations logged.

## Citations audited
All statutory tokens live in `src/App.jsx`. `landing.html` and `public/landing.html`
were scanned by the gate; neither contains gate-matched statutory tokens (only
non-statutory marketing prose), so they added no new citations.

Distinct statutes / references verified (long form + section-symbol duplicates
counted once each by the gate = 14 tokens):
- 29 U.S.C. §1133 (ERISA §503 full-and-fair-review)
- 29 CFR §2560.503-1 (DOL ERISA claims-procedure regulation; deadlines at (h))
- 29 CFR §2590.716-4 (NSA out-of-network payment; feeds IDR)
- 42 U.S.C. §§300gg-111 (No Surprises Act)
- 45 CFR §149.110 (NSA emergency-services balance-billing)
- 45 CFR §149.130 (NSA air-ambulance balance-billing, Subpart B)
- 45 CFR §149.410 (mapped to OON-provider-at-in-network-facility — see flag)
- NY Financial Services Law §606 (state surprise-billing)
- No Surprises Act effective Jan 1 2022
- No Surprises Help Desk 1-800-985-3059
- Good-Faith-Estimate right (scope: uninsured / self-pay)
- Life-insurance 2-year contestability (NAIC standard)

## Verdict counts
- VERIFIED (no change): 11 statutes/references
  (29 U.S.C. §1133; 29 CFR §2560.503-1; 29 CFR §2590.716-4; 42 U.S.C. §§300gg-111;
   45 CFR §149.110; 45 CFR §149.130; NY FSL §606; NSA effective Jan 1 2022;
   Help Desk 1-800-985-3059; Good-Faith-Estimate right; 2-year contestability)
- SCOPED (fixed): 1
  (ERISA "180-day appeal deadline", src/App.jsx:357)
- REQUIRES_HUMAN_JUDGMENT (logged, no code change): 1
  (45 CFR §149.410, src/App.jsx:412)

## Code change (SCOPED)
File: `src/App.jsx` (line ~357).
Replaced:
  `note the 180-day appeal deadline for adverse benefit determinations`
with:
  `note the applicable appeal deadline (180 days for health and disability claims
   under 29 CFR §2560.503-1(h); 60 days for other ERISA welfare or pension claims)`

Rationale: 180 days is correct only for HEALTH and DISABILITY claims under
29 CFR §2560.503-1(h). Other ERISA welfare/pension claims carry a 60-day window.
The flat "180-day" statement overstated the deadline for non-health/disability
ERISA claims.

## Unknowns / flags for human judgment
- **45 CFR §149.410 (src/App.jsx:412)** — The app maps §149.410 to
  "out-of-network provider at an in-network facility." However, §149.410
  (Subpart E) is the emergency-services provider balance-billing rule; the
  non-emergency-at-a-participating-facility provider rule is §149.420. The cite
  may need to be **420** rather than 410. The number was **left unchanged** to
  avoid introducing an unverified citation. **Rob to confirm 410 vs 420.**

## Files touched
- Added: `VERIFICATION_LOG.md`
- Added: `PHASE-2-FIX-REPORT.md`
- Modified: `src/App.jsx` (ERISA appeal-deadline scope fix)
