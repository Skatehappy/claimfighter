# ClaimFighter — Regulatory Verification Log
Created: 2026-07-19
Retrieval layer: Perplexity MCP
Master input: C:\NEWEST OF THE NEW\reports\Portfolio-Regulatory-Sweep.md
Standard: Three-Gate v7

### 2026-07-19 — 29 U.S.C. §1133 (ERISA §503)
- **Source file:** src/App.jsx:357
- **Verdict:** VERIFIED
- **Subject:** ERISA §503 full-and-fair-review requirement for adverse benefit determinations.
- **Source:** https://www.law.cornell.edu/uscode/text/29/1133
- **Action:** no change — confirmed.

### 2026-07-19 — §1133
- **Source file:** src/App.jsx:357
- **Verdict:** VERIFIED
- **Subject:** Section-symbol form of 29 U.S.C. §1133 (ERISA §503 claims procedure).
- **Source:** https://www.law.cornell.edu/uscode/text/29/1133
- **Action:** no change — confirmed.

### 2026-07-19 — 29 CFR §2560.503-1
- **Source file:** src/App.jsx:357
- **Verdict:** VERIFIED
- **Subject:** DOL ERISA claims-procedure regulation (full-and-fair-review; deadlines at §2560.503-1(h)).
- **Source:** https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XXV/subchapter-L/part-2560/section-2560.503-1
- **Action:** no change — confirmed. Cited in the scoped appeal-deadline language added at src/App.jsx:357.

### 2026-07-19 — §2560.503-1
- **Source file:** src/App.jsx:357
- **Verdict:** VERIFIED
- **Subject:** Section-symbol form of 29 CFR §2560.503-1 (ERISA claims-procedure regulation).
- **Source:** https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XXV/subchapter-L/part-2560/section-2560.503-1
- **Action:** no change — confirmed.

### 2026-07-19 — ERISA 180-day appeal deadline (SCOPED)
- **Source file:** src/App.jsx:357
- **Verdict:** SCOPED
- **Subject:** Appeal window for adverse ERISA benefit determinations.
- **Source:** https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XXV/subchapter-L/part-2560/section-2560.503-1
- **Action:** code change — 180 days is correct only for HEALTH and DISABILITY claims (29 CFR §2560.503-1(h)); other ERISA welfare/pension claims are 60 days. Replaced the flat "180-day appeal deadline" text with "the applicable appeal deadline (180 days for health and disability claims under 29 CFR §2560.503-1(h); 60 days for other ERISA welfare or pension claims)".

### 2026-07-19 — 42 U.S.C. §§300gg-111 (No Surprises Act)
- **Source file:** src/App.jsx:410
- **Verdict:** VERIFIED
- **Subject:** Federal No Surprises Act codification (surprise-billing / balance-billing protections).
- **Source:** https://www.law.cornell.edu/uscode/text/42/300gg-111
- **Action:** no change — confirmed.

### 2026-07-19 — §§300gg-111
- **Source file:** src/App.jsx:410
- **Verdict:** VERIFIED
- **Subject:** Section-symbol form of 42 U.S.C. §§300gg-111 (No Surprises Act).
- **Source:** https://www.law.cornell.edu/uscode/text/42/300gg-111
- **Action:** no change — confirmed.

### 2026-07-19 — No Surprises Act effective Jan 1 2022
- **Source file:** src/App.jsx:410
- **Verdict:** VERIFIED
- **Subject:** Effective date of the federal No Surprises Act.
- **Source:** https://www.cms.gov/nosurprises
- **Action:** no change — confirmed.

### 2026-07-19 — 29 CFR §2590.716-4 (NSA out-of-network payment)
- **Source file:** src/App.jsx:410
- **Verdict:** VERIFIED
- **Subject:** DOL NSA out-of-network payment rules (correct section; feeds the IDR process).
- **Source:** https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XXV/subchapter-L/part-2590/section-2590.716-4
- **Action:** no change — confirmed.

### 2026-07-19 — §2590.716-4
- **Source file:** src/App.jsx:410
- **Verdict:** VERIFIED
- **Subject:** Section-symbol form of 29 CFR §2590.716-4 (NSA out-of-network payment).
- **Source:** https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XXV/subchapter-L/part-2590/section-2590.716-4
- **Action:** no change — confirmed.

### 2026-07-19 — 45 CFR §149.130 (NSA air-ambulance)
- **Source file:** src/App.jsx:413
- **Verdict:** VERIFIED
- **Subject:** NSA air-ambulance balance-billing protection (Subpart B).
- **Source:** https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-B/part-149/subpart-B/section-149.130
- **Action:** no change — confirmed.

### 2026-07-19 — §149.130
- **Source file:** src/App.jsx:413
- **Verdict:** VERIFIED
- **Subject:** Section-symbol form of 45 CFR §149.130 (NSA air-ambulance).
- **Source:** https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-B/part-149/subpart-B/section-149.130
- **Action:** no change — confirmed.

### 2026-07-19 — 45 CFR §149.110 (NSA emergency services)
- **Source file:** src/App.jsx:414
- **Verdict:** VERIFIED
- **Subject:** NSA emergency-services balance-billing protection.
- **Source:** https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-B/part-149/section-149.110
- **Action:** no change — confirmed.

### 2026-07-19 — §149.110
- **Source file:** src/App.jsx:414
- **Verdict:** VERIFIED
- **Subject:** Section-symbol form of 45 CFR §149.110 (NSA emergency services).
- **Source:** https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-B/part-149/section-149.110
- **Action:** no change — confirmed.

### 2026-07-19 — 45 CFR §149.410 (REQUIRES_HUMAN_JUDGMENT)
- **Source file:** src/App.jsx:412
- **Verdict:** REQUIRES_HUMAN_JUDGMENT
- **Subject:** App maps §149.410 to "out-of-network provider at an in-network facility."
- **Source:** https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-B/part-149
- **Action:** no code change. FLAG FOR ROB — §149.410 (Subpart E) is the emergency-services provider balance-billing rule; the non-emergency-at-a-participating-facility provider rule is §149.420. The cite may need to be 420 rather than 410. Number left unchanged to avoid introducing an unverified citation; Rob to confirm 410 vs 420.

### 2026-07-19 — §149.410
- **Source file:** src/App.jsx:412
- **Verdict:** REQUIRES_HUMAN_JUDGMENT
- **Subject:** Section-symbol form of 45 CFR §149.410 (see full entry above).
- **Source:** https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-B/part-149
- **Action:** no code change — flagged for human judgment (410 vs 420).

### 2026-07-19 — NY Financial Services Law §606
- **Source file:** src/App.jsx:417
- **Verdict:** VERIFIED
- **Subject:** New York state surprise-billing / out-of-network protection.
- **Source:** https://www.nysenate.gov/legislation/laws/FIS/606
- **Action:** no change — confirmed.

### 2026-07-19 — §606
- **Source file:** src/App.jsx:417
- **Verdict:** VERIFIED
- **Subject:** Section-symbol form of NY Financial Services Law §606.
- **Source:** https://www.nysenate.gov/legislation/laws/FIS/606
- **Action:** no change — confirmed.

### 2026-07-19 — No Surprises Help Desk 1-800-985-3059
- **Source file:** src/App.jsx:419
- **Verdict:** VERIFIED
- **Subject:** Federal No Surprises Help Desk phone number for consumer complaints.
- **Source:** https://www.cms.gov/nosurprises/consumers
- **Action:** no change — confirmed.

### 2026-07-19 — Good-Faith-Estimate right
- **Source file:** src/App.jsx (No Surprises Act prompt)
- **Verdict:** VERIFIED
- **Subject:** Good-Faith-Estimate right — scope: uninsured / self-pay patients.
- **Source:** https://www.cms.gov/nosurprises/consumers/understanding-costs-in-advance
- **Action:** no change — confirmed (scope note: uninsured/self-pay).

### 2026-07-19 — Life-insurance 2-year contestability period
- **Source file:** src/App.jsx:340
- **Verdict:** VERIFIED
- **Subject:** Two-year contestability / incontestability standard for life-insurance policies.
- **Source:** NAIC standard (Standard Nonforfeiture / incontestability model provisions).
- **Action:** no change — confirmed (NAIC standard; typically 2 years, per applicable state code).
