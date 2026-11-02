# ClaimFighter — SEO Content Verification Log (state-data.json)
Created: 2026-07-22
Directive: All-Letter-Apps Content-Enrichment (Phase 2 — insurance-claims domain)
Retrieval layer: **Perplexity MCP** (`perplexity_ask`, Sonar Pro, `search_context_size: high`) — the Perplexity tools were connected this session, so research was done "the Perplexity way" (see [[project_letterapps_and_fueldesk_session]] open item #2). Every statutory citation, deadline, and regulatory body below is grounded in Perplexity's web-cited answers; representative source URLs are listed per state (retrieval date 2026-07-22).
verified_on: every entry carries an ISO date (table rows: last column; Phase A state blocks: a `- **verified_on:**` line; Held-back/Remaining SECONDARY bullets: trailing `[verified_on: YYYY-MM-DD]`). Gate A15 fails on a missing date or on anything rendered/generated from an entry older than 12 months and warns at 10. New entries: run `node scripts/stamp-verified-on.mjs` (stamps today). Backfill 2026-11-01 = date of the git commit that last changed the line (git blame); no entry was undatable.
Scope: the 10 states in `scripts/data/states.js` (CA, TX, FL, NY, IL, PA, OH, GA, NC, AZ) — NOT 50.
Domain fields per state: `primary_insurance_statute`, `regulatory_body` / `complaint_process`, `claim_deadlines` (acknowledge / decision / payment / status / interest), `bad_faith`, `appraisal`, `statute_of_limitations`, `external_review`, `unique_protections`, `common_issues`, `last_major_reform`.

---

## California (CA)
- **verified_on:** 2026-11-01
- **Primary framework:** Unfair Insurance Practices Act (Cal. Ins. Code § 790.03(h)) + Fair Claims Settlement Practices Regulations (10 CCR §§ 2695.1–2695.11); appraisal & 1-yr suit-limit under Ins. Code § 2071.
- **Key verified facts:** 15-day acknowledgment (10 CCR § 2695.5(e)); 40-day accept/deny after proof of claim (§ 2695.7(b)); 30-day status updates (§ 2695.7(c)); common-law bad faith (Gruenberg, Egan) with Brandt fees (Brandt v. Superior Court, 37 Cal.3d 813) and punitive damages (Civ. Code § 3294); DMHC/CDI Independent Medical Review; AB 3275 (eff. 1/1/2026) uniform 30-day health-claim pay/contest/deny; 2026 wildfire package (SB 495) 60% contents advance.
- **Sources:**
  - https://www.alfainternational.com/compendium/insurance-law/california/ (Fair Claims regs timing §§ 2695.5, 2695.7)
  - https://www.dwt.com/insights/2025/09/california-ab-3275-claim-payment-deadlines-2026 (AB 3275 30-day rule, eff. 2026)
  - https://hillguard.com/california-bad-faith-insurance-law/ (implied covenant, Brandt fees, § 3294 punitives, SOL)
  - https://uphelp.org/claim-guidance-publications/insurance-claim-rules-in-california-2020/ (Ins. Code § 2071 appraisal + 12-month suit-limit; 24-month emergency extension)
  - https://www.kqed.org/science/1999791/new-california-insurance-laws-on-the-books-in-2026 (2026 wildfire reforms, contents advances)

## Texas (TX)
- **verified_on:** 2026-11-01
- **Primary framework:** Prompt Payment of Claims Act (Tex. Ins. Code Ch. 542, Subch. B) + Unfair Settlement Practices (Ch. 541) + weather-claim Ch. 542A; new binding-appraisal Ch. 1813.
- **Key verified facts:** 15-day acknowledge (§ 542.055), 15-business-day accept/deny (§ 542.056), 5-business-day pay (§ 542.057), 15-day catastrophe extension (§ 542.059); late-payment interest 18% (pre-9/2017) or post-judgment+5% capped 20% + attorney's fees (§ 542.060); Ch. 541 treble damages for knowing violations + common-law bad faith (Arnold); SB 458 (2025)→Ch. 1813 binding appraisal eff. 1/1/2026; HB 2067 automatic non-renewal explanations eff. 1/1/2026.
- **Sources:**
  - https://www.dcspia.com/blog/texas-insurance-claim-deadlines-and-time-limits/ (§§ 542.055–542.060 deadlines & interest)
  - https://law.justia.com/codes/texas/insurance-code/title-5/subtitle-c/chapter-542/subchapter-b/section-542-058/ (Ch. 542 late-payment)
  - https://www.dicklawfirm.com/blog/2025/june/does-texas-have-bad-faith-insurance-laws-/ (Ch. 541/542 + treble damages)
  - https://www.gavnat.com/blog/texas-appraisal-law-updates-for-2026-what-sb-458-changes-for-homeowners-insurers-and-public-adjusters/ (SB 458 / Ch. 1813 binding appraisal, eff. 1/1/2026)
  - https://rguajardofirm.com/blog/understanding-texas-hb-2067-what-it-means-for-your-car-insurance-claim/ (HB 2067 explanations, eff. 1/1/2026)

## Florida (FL)
- **verified_on:** 2026-11-01
- **Primary framework:** Unfair Insurance Trade Practices Act (F.S. § 626.9541) + claim-handling § 627.70131 + Homeowner Claims Bill of Rights § 627.7142; bad-faith civil remedy § 624.155.
- **Key verified facts:** 7-day acknowledgment of each communication (§ 627.70131(1)(a)); 60-day pay/deny (§ 627.70131(7)(a), reduced from 90); interest via § 55.03; 20-day payment after settlement (§ 627.4265); § 624.155 civil-remedy notice + 60-day cure; SB 76 (2021) & SB 2-A (Dec 2022) repealed one-way fees, banned AOB, shortened notice to 1 yr / 18 mo supplemental (§ 627.70132); HB 837 (2023) SOL/fee reforms.
- **Sources:**
  - https://oceanpoint.claims/resources/florida-statutes/627-70131-claim-response-deadlines/ (§ 627.70131 deadlines + § 55.03 interest)
  - https://brelly.com/claim-resources/florida-guide/ (7/30/60-day markers; Homeowner Claims Bill of Rights)
  - https://ilabacalaw.com/blog/personal-injury/florida-bad-faith-insurance-claims-explained/ (§ 624.155 CRN + 60-day cure)
  - https://www.comegys.com/florida-property-insurance-reform-2025-legislative-updates-market-impact/ (SB 2-A: one-way fee repeal, AOB ban, notice shortening)
  - https://ilabacalaw.com/blog/personal-injury/florida-insurance-claim-deadlines-and-statutes-of-limitations/ (§ 95.11 5-yr contract SOL; § 627.70132 notice)

## New York (NY)
- **verified_on:** 2026-11-01
- **Primary framework:** Ins. Law § 2601 (unfair claim settlement) + Regulation 64 (11 NYCRR Part 216); health prompt-pay § 3224-a; standard fire policy / appraisal § 3408 and 2-yr suit-limit § 3404.
- **Key verified facts:** 15-business-day response (11 NYCRR 216.4(b)); investigate within 15 business days (216.6(a)); accept/deny within 15 business days of completing investigation (216.6(b)); health claims paid in 45 days + 12% interest (§ 3224-a); **NO first-party bad-faith tort** — recovery is breach of contract + foreseeable consequential damages (Bi-Economy Market v. Harleysville; Panasia Estates v. Hudson); appraisal incl. scope-of-loss (§ 3408, 2014 amendment); 6-yr contract SOL (CPLR 213(2)); DFS external appeal (4-month window).
- **Sources:**
  - https://ezel.ai/templates/coverage-position-denial-response/ny (Reg 64 / 11 NYCRR 216 timing)
  - https://www.dfs.ny.gov/insurance/ogco2002/rg207242.htm (§ 3224-a 45-day prompt-pay + interest)
  - https://www.robinskaplan.com/newsroom/insights/empire-state-of-mind-new-york-bad-faith-update (no bad-faith tort; Bi-Economy/Panasia consequential damages)
  - https://law.justia.com/codes/new-york/isc/article-34/ (§ 3404 2-yr suit-limit; § 3408 appraisal)
  - https://www.propertyinsurancecoveragelaw.com/blog/new-york-passes-legislation-allowing-appraisal-to-determine-scope-of-loss/ (§ 3408 scope-of-loss appraisal, 2014)

## Illinois (IL)
- **verified_on:** 2026-11-01
- **Primary framework:** Improper Claims Practices (215 ILCS 5/154.5–154.6) + reasonable-settlement regs (50 Ill. Adm. Code Part 919); exclusive statutory remedy 215 ILCS 5/155.
- **Key verified facts:** 15-working-day acknowledgment (919.40); 45-day status letters (919.80); **§ 155 is the exclusive first-party remedy** (no separate common-law bad-faith tort) — attorney's fees + costs + penalty = greater of 60% of amount owed, $60,000, or excess over the insurer's pre-suit offer; 10-yr written-contract SOL (735 ILCS 5/13-206) with commonly-enforced 1-yr policy suit-limit; Health Carrier External Review Act (215 ILCS 180), 4-month external-review window. *(Superseded 2026-11-01: 919.80 status timing corrected — see Phase B, Illinois.)*
- **Sources:**
  - https://voltaire.claims/resources/compendium/jurisdictions/illinois/ (Part 919 acknowledgment & 45-day updates)
  - https://www.illinoiscourts.gov/Resources/20c1fc42-7062-4b6e-918a-4a52c8a1ee6e/1002543.htm (§ 155 remedy structure)
  - https://www.illinoislegalaid.org/legal-information/litigating-policyholder-claims-against-insurance-companies (§ 155 exclusivity; penalty amounts)
  - https://uphelp.org/claim-guidance-publications/insurance-consumer-rights-in-illinois-2022/ (10-yr contract SOL; 1-yr policy suit-limit)
  - https://magmilelaw.com/what-is-the-unfair-claims-settlement-practices-act-and-is-your-insurance-company-violating-it/ (215 ILCS 180 external review, 4-month window)

## Pennsylvania (PA)
- **verified_on:** 2026-11-01
- **Primary framework:** Unfair Insurance Practices Act (40 P.S. §§ 1171.1–1171.15) + Unfair Claims Settlement Practices regs (31 Pa. Code Ch. 146); statutory bad faith 42 Pa.C.S. § 8371.
- **Key verified facts:** 10-working-day acknowledgment (§ 146.5(a)); 15-working-day accept/deny after proof of loss (§ 146.7(a)); 30-day investigation then 45-day delay letters (§ 146.6); **§ 8371 statutory bad faith** — interest at prime+3%, punitive damages, court costs & attorney's fees; Rancosky v. Washington National (2017) adopted the two-part Terletsky test; 4-yr contract SOL (§ 5525), 2-yr bad-faith SOL (§ 5524); Act 68 grievances + Act 146 of 2022 PID-administered external review.
- **Sources:**
  - https://www.pacodeandbulletin.gov/Display/pacode?file=/secure/pacode/data/031/chapter146/s146.6.html&d=reduce (§ 146.6 30-day investigation / 45-day delay letters)
  - https://www.propertyinsurancecoveragelaw.com/blog/claims-handling-requirements-by-state-pennsylvania/ (§§ 146.5, 146.7 deadlines)
  - https://siddonslaw.com/bad-faith-insurance-lawyer/pennsylvania/ (§ 8371 prime+3% interest, punitives, fees)
  - https://www.jdsupra.com/legalnews/pennsylvania-supreme-court-clarifies-69623/ (Rancosky / Terletsky standard, 2017)
  - https://www.claimprepguide.com/states/pennsylvania (§ 5525 / § 5524 limitations)

## Ohio (OH)
- **verified_on:** 2026-11-01
- **Primary framework:** Unfair & Deceptive Insurance Practices (R.C. 3901.20–3901.21) + OAC 3901-1-54; common-law first-party bad faith.
- **Key verified facts:** 15-day acknowledgment; 21-day accept/deny after proof of loss; 45-day status letters; 10-day payment after acceptance (all OAC 3901-1-54); common-law bad faith (Hoskins v. Aetna; Zoppo v. Homestead) with punitive damages on actual malice (capped under R.C. 2315.21); 8-yr written-contract SOL (R.C. 2305.06), 4-yr bad-faith tort SOL (R.C. 2305.09), 1-yr policy suit-limit common; R.C. Ch. 3922 external review; OAC 3901-1-54 amended 2022. *(Superseded 2026-11-01: R.C. 2305.06 is 6 years — see Phase B, Ohio.)*
- **Sources:**
  - https://voltaire.claims/resources/compendium/jurisdictions/ohio/ (OAC 3901-1-54 timeframes)
  - https://uphelp.org/claim-guidance-publications/insurance-consumer-rights-in-ohio-2022/ (acknowledgment/decision/payment timing; 1-yr suit-limit)
  - https://www.ohio-insurance-lawyer.com/insurance-bad-faith-ohio-zoppo-v-homestead.php (Zoppo/Hoskins bad-faith tort, punitives)
  - https://www.drodermiller.com/blog/2025/05/what-is-ohios-statute-of-limitations-for-insurance-claims/ (R.C. 2305.06 8-yr / 2305.09 4-yr)
  - https://www.registerofohio.state.oh.us/servlet/RooBusinessPDF?ruleActionId=596390&docTypeId=15 (OAC 3901-1-54 2022 amendment)

## Georgia (GA)
- **verified_on:** 2026-11-01
- **Primary framework:** Unfair Claims Settlement Practices Act (O.C.G.A. §§ 33-6-30 to 33-6-37) + bad-faith penalty O.C.G.A. § 33-4-6.
- **Key verified facts:** § 33-6-34 prompt acknowledgment/investigation, reasonable-time affirm/deny (no fixed statutory day count; 15 days applies only to personal auto claims under Ga. Comp. R. & Regs. 120-2-52-.03); **§ 33-4-6 requires a 60-day written demand** before penalties attach — recovery = greater of 50% of the insurer's liability or $5,000, plus attorney's fees (statute itself adds no separate punitive award); 6-yr written-contract SOL (O.C.G.A. § 9-3-24); appraisal contractual; O.C.G.A. Ch. 33-20E external review; HB 1344 (Georgia Insurance Affordability and Claims Integrity Act) signed May 12, 2026 (incl. 2-yr minimum property suit-limit).
- **Sources:**
  - https://law.justia.com/codes/georgia/2020/title-33/chapter-4/section-33-4-6/ (§ 33-4-6 60-day demand; 50%/$5,000 penalty + fees)
  - https://www.robinskaplan.com/newsroom/insights/claims-handling-practices-georgia (§§ 33-6-30 to 33-6-37; § 33-6-34 15-day decision)
  - https://legalclarity.org/georgia-insurance-claims-laws-deadlines-and-compliance/ (deadlines; § 9-3-24 6-yr SOL; policy suit-limit)
  - https://www.namic.org/news/260512ma05/ (HB 1344 signed May 12, 2026)
  - https://www.insurancejournal.com/news/southeast/2026/03/04/860355.htm (2026 property suit-limit ≥ 2 years)

## North Carolina (NC)
- **verified_on:** 2026-11-01
- **Primary framework:** Unfair Claim Settlement Practices Act (N.C.G.S. § 58-63-15(11)) + UDTPA (§ 75-1.1) with treble damages (§ 75-16) & fees (§ 75-16.1).
- **Key verified facts:** 30-day acknowledgment (§ 58-3-100(a)); 45-day status updates (§ 58-3-100(c)); 60-day payment after proof of loss + ascertainment by agreement/appraisal (§ 58-44-16(17)); common-law bad faith (refusal + bad faith + aggravating conduct → punitives) plus per se UDTPA treble damages + fees; **3-yr contract SOL (§ 1-52) that policies may NOT contractually shorten** for property claims; Smart NC external review (§§ 58-50-75 to 58-50-95); health clean-claims paid in 30 days (§ 58-3-225); SB 452 auto reform eff. 7/1/2025; HB 315 litigation-funding ban eff. 7/1/2026.
- **Sources:**
  - https://www.ncleg.net/enactedlegislation/statutes/html/bysection/chapter_58/gs_58-63-15.html (§ 58-63-15(11) unfair acts)
  - https://voltaire.claims/resources/compendium/jurisdictions/north-carolina/ (§ 58-3-100 30-day/45-day; § 58-44-16(17) 60-day payment)
  - https://www.jdsupra.com/legalnews/bad-faith-and-unfair-trade-practices-4545774/ (common-law bad faith + UDTPA treble damages)
  - https://www.propertyinsurancecoveragelaw.com/blog/insurance-claim-statute-of-limitations-in-north-carolina/ (§ 1-52 3-yr SOL; no contractual shortening)
  - https://www.ncdoi.gov/changes-rating-automobile-insurance-policies-effective-july-1-2025 (SB 452 auto reform, 7/1/2025)

## Arizona (AZ)
- **verified_on:** 2026-11-01
- **Primary framework:** Unfair Claim Settlement Practices Act (A.R.S. § 20-461) + A.A.C. R20-6-801; robust common-law first-party bad-faith tort.
- **Key verified facts:** 10-working-day acknowledgment; 15-working-day accept/deny after proof of loss; 45-day status communication (all R20-6-801); first-party benefits due within 30 days of acceptable proof of loss, then statutory interest (A.R.S. § 20-462(A)); strong common-law bad faith (Noble v. National American Life; Zilisch v. State Farm — duty beyond "fair debatability") with punitive/emotional-distress damages and **no 60-day demand prerequisite**; reasonable-expectations doctrine (Darner Motor Sales); 6-yr written-contract SOL (§ 12-548), 2-yr bad-faith SOL (§ 12-542), 1-yr policy suit-limit typical; A.R.S. §§ 20-2533–20-2537 external review.
- **Sources:**
  - https://www.propertyinsurancecoveragelaw.com/blog/arizona-claims-handling-guidelines-at-a-glance/ (R20-6-801 timeframes)
  - https://law.justia.com/codes/arizona/title-20/section-20-462/ (§ 20-462 30-day / interest)
  - https://www.casemine.com/commentary/us/recognition-of-tort-of-insurer-bad-faith-refusal-in-arizona:-noble-v.-national-american-life-insurance-company/view (Noble bad-faith tort)
  - https://www.casemine.com/commentary/us/arizona-supreme-court-reaffirms-insurer's-duty-of-good-faith-beyond-fair-debatability-in-first-party-bad-faith-claims/view (Zilisch, beyond fair debatability)
  - https://www.alfainternational.com/compendium/insurance-law/arizona/ (§ 12-548 / § 12-542 limitations; reasonable-expectations doctrine)

---

## Notes & honesty rail
- **Uniform 10-state scope** matches `scripts/data/states.js`; not a 50-state claim.
- **Recency-sensitive items flagged as such in the data** (AB 3275 eff. 1/1/2026; TX SB 458/Ch. 1813 & HB 2067 eff. 1/1/2026; GA HB 1344 signed 5/12/2026; NC SB 452 7/1/2025 & HB 315 7/1/2026). These are near-term/2025–2026 reforms — re-verify at the next content refresh.
- **State bad-faith posture is deliberately differentiated** (CA/OH/AZ common-law tort; PA/GA statutory; IL § 155 exclusive; NY no tort + consequential damages; TX statutory+common-law; FL § 624.155 with CRN; NC common-law + UDTPA treble) so the generated prose is structurally state-specific, not a name-swap.
- Enrichment renders on all 100 deep pages + 10 state hubs; missing-data states inject nothing (fail-safe in `enrichment.js`). Gate: `node scripts/verify-gate.mjs` GREEN (A9 citation-log parity unaffected — enrichment citations live in `state-data.json`, not the scanned app/landing files).

---

## Phase B — KEEP-page citation verification (2026-11-01)
Scope: the 122 unverified citation strings found on KEEP pages (`public/<state>/<topic>/index.html`), fixed at their sources (`scripts/data/generated/<state>/<topic>.json`, `scripts/data/state-data.json`), plus the two held-back hub fields (CA and IL `claim_deadlines`). Rule applied: a citation is kept only if an official or primary source confirms both that it exists and that it says what the sentence claims. A wrong section with a correct claim gets a corrected citation, a wrong claim gets corrected to what the law says, and anything unverifiable is removed along with the claim that rests on it. Sources: state legislature and code sites, state insurance departments and agency rule pages, official court reporters and courtlistener, law.cornell.edu (state regulations), through direct fetch or Perplexity with official-domain filters.

Totals: **122 checked — 74 VERIFIED, 39 CORRECTED, 9 REMOVED.**

### Arizona (AZ)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| A.R.S. §§ 20-2530 through 20-2540 | VERIFIED | Health care appeals article (definitions through the appeals fund) | https://www.azleg.gov/ars/20/02530.htm ; https://www.azleg.gov/ars/20/02540.htm | 2026-11-01 |
| A.R.S. § 20-2535 | CORRECTED from "bad faith damages and attorneys' fees under § 20-2535" | Initial appeal; member has up to two years after a denial to request it. It has no fee-shifting provision. The "180 days" deadline (cited to § 20-2533) was corrected to the two-year window. | https://www.azleg.gov/ars/20/02535.htm | 2026-11-01 |
| A.R.S. § 20-2534 | CORRECTED (the claim-file demand moved to § 20-2533) | Expedited review, 72-hour determination (verified). It contains no claim-file right; § 20-2533(E) requires the basis, criteria used, and clinical rationale. | https://www.azleg.gov/ars/20/02534.htm ; https://www.azleg.gov/ars/20/02533.htm | 2026-11-01 |
| A.R.S. § 22-503 | CORRECTED from "$3,500" | Small claims division jurisdiction is up to $5,000 | https://www.azleg.gov/ars/22/00503.htm | 2026-11-01 |
| A.R.S. § 12-555 | CORRECTED (unverified "recent amendments" claim removed) | UM/UIM claim requires written notice to the insurer within three years after the accident | https://www.azleg.gov/ars/12/00555.htm | 2026-11-01 |
| Title 20 | VERIFIED | Title 20 of the Arizona Revised Statutes is Insurance | https://www.azleg.gov/arstitle/ | 2026-11-01 |

### California (CA)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| 10 CCR §2695.7 (meta description) | CORRECTED from "Insurance Code … §2695" | §2695.x are Title 10 regulations, not Insurance Code sections | https://www.law.cornell.edu/regulations/california/10-CCR-2695.7 | 2026-11-01 |
| Title 10 CCR §2695.7 / Title 10 CCR §§2695.5(e) and 2695.7 / Title 10 CCR §§ 2695.1-2695.14 | VERIFIED (§2695.5(e) added for acknowledgment) | 15-day acknowledgment (2695.5(e)); 40-day accept or deny and 30-day status letters (2695.7(b),(c)); regulations run through 2695.14 | https://www.law.cornell.edu/regulations/california/10-CCR-2695.5 ; https://www.law.cornell.edu/regulations/california/10-CCR-2695.14 | 2026-11-01 |
| §12340.7 (Insurance Code) | REMOVED | Defines title insurance "rate"; it has nothing to do with interest. Replaced with Civil Code § 3289. | https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?lawCode=INS&division=2.&title=&part=6.&chapter=1.&article=1. | 2026-11-01 |
| Civil Code §3287 (BI) | CORRECTED (10% rate now attributed to § 3289) | § 3287 gives the right to prejudgment interest; § 3289(b) sets the 10% contract rate | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=3289 | 2026-11-01 |
| Civil Code § 3287 (water) | CORRECTED (10% rate now attributed to § 3289) | Same as above | same | 2026-11-01 |
| Civil Code § 3289 / Civ. Code § 3289 | VERIFIED | Post-breach interest at 10% per annum when the contract sets no rate | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=3289 | 2026-11-01 |
| §116.221 | VERIFIED | Small claims limit of $12,500 for natural persons | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=116.221 | 2026-11-01 |
| §116.220 | VERIFIED | General small claims limit of $6,250 (entities) | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=116.220 | 2026-11-01 |
| §337 / § 337 (CCP) | VERIFIED | Four years for an action on a written contract | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=337 | 2026-11-01 |
| §339 / § 339 (CCP) | VERIFIED | Two-year limitations period (bad-faith tort) | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=339 | 2026-11-01 |
| Insurance Code § 2051.5 | CORRECTED (garbled "36 months … extended to 36 months" claim) | At least 12 months from the first ACV payment to collect replacement cost; at least 36 months for a state-of-emergency loss; 6-month good-cause extensions | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=INS&sectionNum=2051.5 | 2026-11-01 |
| § 2060 (Insurance Code) | CORRECTED from "copy of the policy upon request" | Requires a list of ALE items; after a declared emergency, ALE for at least 24 months, extendable to 36 | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=INS&sectionNum=2060 | 2026-11-01 |
| § 2695.9 / 10 CCR § 2695.9(f) | VERIFIED; CORRECTED claim (removed "depreciation of labor") | Replacement-cost claim standards; depreciation must be itemized, justified, and explained in writing | https://www.law.cornell.edu/regulations/california/10-CCR-2695.9 | 2026-11-01 |
| Insurance Code §§ 2051 and 2051.5 | CORRECTED from "§§ 2051, 2051.5, and 2695.9(f)" (2695.9(f) is a regulation) | § 2051: ACV equals repair or replace cost less a fair deduction for physical depreciation | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=INS&sectionNum=2051 | 2026-11-01 |
| Insurance Code § 790.035 | VERIFIED | Up to $5,000 per act, or $10,000 per willful act | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=INS&sectionNum=790.035 | 2026-11-01 |
| Prudential-LMI v. Superior Court | VERIFIED | 51 Cal.3d 674 (1990): the one-year suit limit is equitably tolled from notice of the claim until formal denial | https://scocal.stanford.edu/opinion/prudential-lmi-commercial-ins-v-superior-court-31251 | 2026-11-01 |
| Health & Safety Code §§ 1368 and 1368.01 / § 1368 | CORRECTED (unverified "72 hours" removed) | Grievance system; resolution within 30 days, with expedited review for an imminent and serious threat | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=1368.01 | 2026-11-01 |
| Health & Safety Code § 1368.04 | CORRECTED (unverified "$2,500,000 for willful violations" removed) | DMHC enforcement and administrative penalties for grievance violations | https://wpso.dmhc.ca.gov/enfactions/violation.aspx | 2026-11-01 |
| Insurance Code § 10169 | VERIFIED | Independent Medical Review for CDI-regulated health insurers | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=INS&sectionNum=10169 | 2026-11-01 |
| Health & Safety Code § 1340 et seq. | VERIFIED | Knox-Keene Act | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=1340 | 2026-11-01 |
| Health & Safety Code § 1374.30 | VERIFIED | DMHC Independent Medical Review | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=1374.30 | 2026-11-01 |
| Health & Safety Code § 1367.01(e) | CORRECTED (removed the "California-licensed" claim) | Only a licensed physician or licensed health professional competent in the clinical issue may deny or modify for medical necessity; no California-only license requirement | https://www.leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?lawCode=HSC&division=2.&title=&part=&chapter=2.2.&article=5. | 2026-11-01 |
| Insurance Code §§ 530 and 532 | VERIFIED | Proximate-cause rules for covered and excepted perils (efficient proximate cause) | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=INS&sectionNum=530 | 2026-11-01 |
| Garvey v. State Farm | VERIFIED | 48 Cal.3d 395 (1989): efficient proximate cause | https://scocal.stanford.edu/opinion/garvey-v-state-farm-fire-cas-co-30866 | 2026-11-01 |
| Sabella v. Wisler | VERIFIED | 59 Cal.2d 21 (1963): efficient proximate cause | https://scocal.stanford.edu/opinion/sabella-v-wisler-27397 | 2026-11-01 |

### Florida (FL)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| § 627.6043 | REMOVED | It covers notice of cancellation, nonrenewal, and rate change; it has no appeal right and no 65-day window. Replaced with § 627.6141 (medical-necessity appeal to the insurer's physician, answer within 15 business days) and § 641.511 (HMO grievance within 1 year). | https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.6043.html ; .../0627.6141.html ; .../0641.511.html | 2026-11-01 |
| § 641.3155 | VERIFIED (dropped the subsection pin "(5)") | HMO prompt pay: 20, 40, and 120 days; overdue claims bear 12% simple interest | https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0641/Sections/0641.3155.html | 2026-11-01 |
| § 627.6131 | VERIFIED | Health insurer prompt pay: 20, 40, and 120 days; 12% simple interest | https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.6131.html | 2026-11-01 |
| § 627.613 → § 627.6131 | CORRECTED | § 627.613 sets 10% interest (45-day rule); the 12% rate is in § 627.6131 | .../0627.613.html | 2026-11-01 |
| former § 627.428 | CORRECTED from "§ 627.428 awards attorney's fees" | Repealed by ch. 2023-15 (HB 837). Fees are now under § 624.155(7) (bad faith) or § 86.121 (declaratory coverage action after a total denial). | https://www.flsenate.gov/Session/Bill/2023/837/Analyses/h0837z.CJS.PDF ; .../0624.155.html ; .../0086.121.html | 2026-11-01 |
| § 627.70152 | VERIFIED | Notice of intent to sue at least 10 business days before filing a property suit | .../0627.70152.html | 2026-11-01 |
| Chapter 627 | VERIFIED | Insurance rates and contracts chapter | https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/0627.html | 2026-11-01 |
| § 627.7011 / § 627.7011(3) | VERIFIED | Replacement-cost offer; (3) pay ACV first, then RC as work is done | .../0627.7011.html | 2026-11-01 |
| § 627.701(10) | VERIFIED | Optional roof deductible capped at the lesser of 2% of Coverage A or 50% of roof replacement cost | .../0627.701.html | 2026-11-01 |

### Georgia (GA)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| O.C.G.A. § 33-7-11(j) | CORRECTED from "similar penalties" | UM bad faith after a 60-day demand: up to the greater of 25% of the recovery or $25,000, plus attorney's fees (2021 amendment) | https://law.justia.com/codes/georgia/2022/title-33/chapter-7/section-33-7-11/ (official code text reproduction; Georgia's official code is hosted by LexisNexis) | 2026-11-01 |
| O.C.G.A. § 9-11-4 | VERIFIED | Civil Practice Act service of process | https://law.justia.com/codes/georgia/title-9/chapter-11/article-2/section-9-11-4/ | 2026-11-01 |
| Southern General Insurance Co. v. Holt, 262 Ga. 267 (1992) | CORRECTED from "Holt v. State Farm" | Insurer's failure to accept a time-limited demand within limits can be bad faith (third-party failure to settle) | https://www.courtlistener.com/opinion/5790920/southern-general-insurance-v-holt/ | 2026-11-01 |
| O.C.G.A. § 33-20A-5 | CORRECTED (unsupported "60 days to appeal" and "claim file" claims removed) | Requires a grievance hearing before a panel of three or more (including a physician other than the medical director); adverse decisions must state specific findings and the policies relied on. Under Ga. Comp. R. & Regs. 120-2-111-.04, the outcome is due in 30 days pre-service or 60 days post-service. | https://law.justia.com/codes/georgia/title-33/chapter-20a/article-1/section-33-20a-5/ ; https://oci.georgia.gov/document/document/120-2-111-04pdf/download | 2026-11-01 |
| O.C.G.A. § 33-20A-30 et seq. | CORRECTED (unsupported "within 60 days" external-review deadline removed) | Patient's Right to Independent Review; the request goes to the Department on its forms | https://law.justia.com/codes/georgia/title-33/chapter-20a/article-2/section-33-20a-35/ | 2026-11-01 |
| O.C.G.A. § 33-20A-1 et seq. | VERIFIED | Article 1, Patient Protection (managed care) | https://law.justia.com/codes/georgia/2023/title-33/chapter-20a/ | 2026-11-01 |
| O.C.G.A. § 33-32-5 | REMOVED | Valued-policy rule for a total fire loss; it does not require insurers to pay code upgrades | https://law.justia.com/codes/georgia/2020/title-33/chapter-32/section-33-32-5/ | 2026-11-01 |
| O.C.G.A. § 33-4-3 | CORRECTED (claim) | Foreign insurers appoint a resident agent; service on the Commissioner only when that agent cannot be served | https://law.justia.com/codes/georgia/title-33/chapter-4/section-33-4-3/ | 2026-11-01 |

### Illinois (IL)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| 215 ILCS 5/154.6 | VERIFIED | Improper claims practices | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200005/ | 2026-11-01 |
| 815 ILCS 505/2 | VERIFIED | Consumer Fraud Act prohibition | https://ftp.ilga.gov/ILCS/Ch%200815/ | 2026-11-01 |
| 215 ILCS 180 | VERIFIED | Health Carrier External Review Act; request within 4 months (180/35) | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200180/021501800K35.html | 2026-11-01 |
| 50 Ill. Adm. Code 919.50 (Code 919.50) | VERIFIED (hub) | Affirm or deny within a reasonable time; pay within 30 days after affirming liability; written denial explanation within 30 days | https://ftp.ilga.gov/JCAR/AdminCode/050/050009190000500R.html | 2026-11-01 |
| 50 Ill. Adm. Code 919 / Code 919 | VERIFIED | Improper Claims Practice rules | https://ftp.ilga.gov/JCAR/AdminCode/050/ | 2026-11-01 |
| Sandy Point Dental v. Cincinnati Ins. Co., 20 F.4th 327 (7th Cir. 2021) | CORRECTED (it was presented as an "Illinois courts" holding) | Federal court applying Illinois law: COVID loss of use without physical alteration is not "direct physical loss" | https://law.justia.com/cases/federal/appellate-courts/ca7/21-1186/21-1186-2021-12-09.html | 2026-11-01 |
| 215 ILCS 5/ (Insurance Code); 215 ILCS 5/155 | VERIFIED; CORRECTED "lesser of $60,000 or 60%" | § 155 allows fees and costs plus an amount not exceeding any one of 60%, $60,000, or the excess over the settlement offer | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200005/021500050K155.html | 2026-11-01 |
| 215 ILCS 5/397 | CORRECTED (claim) | It only directs the Director to make basic fire policies uniform. It sets no 60-day proof-of-loss rule and no suit deadline. | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200005/021500050K397.html | 2026-11-01 |
| 215 ILCS 5/143.1 | CORRECTED (claim) | It does not "permit" a one-year limit; it tolls the policy's suit-limitation period from proof of loss until denial | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200005/021500050K143.1.html | 2026-11-01 |
| 215 ILCS 134/45 | VERIFIED | Managed Care Reform Act appeals, complaints, and external review | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200134/021501340K45.html | 2026-11-01 |
| 215 ILCS 134 | VERIFIED | Managed Care Reform and Patient Rights Act | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200134/ | 2026-11-01 |

### New York (NY)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| 11 NYCRR § 216 (Regulation 64); 11 NYCRR §§ 216.4 and 216.6 | VERIFIED (water FAQ now cites 216.4 for acknowledgment) | 15 business days to acknowledge (216.4) and to send forms (216.5); accept or deny within 15 business days of proof of loss, status letters every 90 days (216.6) | https://www.law.cornell.edu/regulations/new-york/11-NYCRR-216.4 ; https://www.law.cornell.edu/regulations/new-york/11-NYCRR-216.6 | 2026-11-01 |
| Insurance Law § 5106 / § 5106(b) | CORRECTED (arbitration is optional, not "mandatory") | Overdue after 30 days; 2% per month; fees; insurer must offer arbitration as an option | https://www.nysenate.gov/legislation/laws/ISC/5106 | 2026-11-01 |
| 11 NYCRR § 65 | VERIFIED | No-fault regulation (Regulation 68) | https://www.dfs.ny.gov/industry_guidance/regulations | 2026-11-01 |
| CPLR § 213 | VERIFIED | Six years for contract actions | https://www.nysenate.gov/legislation/laws/CVP/213 | 2026-11-01 |
| Insurance Law Article 49 (§ 4900 et seq.) | CORRECTED from "§§ 4900-4914" | The official index lists Article 49 as §§ 4900–4917 | https://www.nysenate.gov/legislation/laws/ISC | 2026-11-01 |
| General Business Law § 349 | VERIFIED | Deceptive acts and practices | https://www.nysenate.gov/legislation/laws/GBS/349 | 2026-11-01 |
| ERISA § 502(a) | VERIFIED | 29 U.S.C. § 1132(a) civil enforcement | https://www.law.cornell.edu/uscode/text/29/1132 | 2026-11-01 |
| Article 49 (Ins. Law and Public Health Law) | VERIFIED | Utilization review and external appeal | https://www.nysenate.gov/legislation/laws/PBH/A49 | 2026-11-01 |
| § 3418 (Ins. Law) | REMOVED | Not an interest provision (the 2%/month rate is the no-fault § 5106). Replaced with CPLR § 5004 at 9%. | https://www.nysenate.gov/legislation/laws/ISC | 2026-11-01 |
| Ins. Law § 3445 | CORRECTED (claim) | Directs DFS to set disclosure rules and uniform trigger standards for windstorm deductibles by regulation. The specific NWS trigger stated on the page was not in the statute and was removed. | https://www.nysenate.gov/legislation/laws/ISC/3445 | 2026-11-01 |
| CPLR § 5004 | VERIFIED | Interest at 9% per annum (2% for consumer debt against natural persons) | https://www.nysenate.gov/legislation/laws/CVP/5004 | 2026-11-01 |
| Pioneer Tower Owners Assn. v. State Farm Fire & Cas. Co., 12 N.Y.3d 302 (2009) | VERIFIED (full cite added) | Exclusions must be clear; ambiguous earth-movement exclusions are read narrowly in favor of coverage | https://www.nycourts.gov/reporter/3dseries/2009/2009_03409.htm | 2026-11-01 |

### North Carolina (NC)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| N.C. Gen. Stat. § 58-50-61 | CORRECTED (the "180 days under § 58-50-61" attribution was removed) | Utilization review. Noncertification notice with reasons and appeal instructions (h); standard appeal decided within 30 days. The statute sets no 180-day filing period. | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_58/GS_58-50-61.html | 2026-11-01 |
| N.C. Gen. Stat. § 6-21.1 | CORRECTED (incomplete conditions) | Fees if the refusal was unwarranted, the recovery is $25,000 or less, and the recovery exceeds the highest offer made 90 or more days before trial | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_6/GS_6-21.1.html | 2026-11-01 |
| § 58-50-80 | VERIFIED | Standard external review; request within 120 days | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_58/GS_58-50-80.html | 2026-11-01 |
| N.C. Gen. Stat. § 58-50-84 | VERIFIED | External review decision binding on the insurer | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_58/GS_58-50-84.html | 2026-11-01 |
| Chapter 58 / Article 50 | VERIFIED | Insurance chapter, Article 50 | https://www.ncleg.gov/Laws/GeneralStatuteSections/Chapter58 | 2026-11-01 |
| N.C. Gen. Stat. § 1D-25 | VERIFIED | Punitives capped at the greater of 3x compensatory or $250,000 | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_1D/GS_1D-25.html | 2026-11-01 |

### Ohio (OH)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| Ohio Revised Code § 3901.19 through § 3901.26 | CORRECTED (mislabeled "Unfair Claims Settlement Practices Act"; Ohio Adm. Code 3901-1-54 added) | Unfair and deceptive insurance practices law (3901.26 references "sections 3901.19 to 3901.26") | https://codes.ohio.gov/ohio-revised-code/section-3901.26 | 2026-11-01 |
| R.C. § 1343.03 / ORC 1343.03 | VERIFIED | Prejudgment interest | https://codes.ohio.gov/ohio-revised-code/section-1343.03 | 2026-11-01 |
| R.C. § 3901.381 | REMOVED | Health third-party-payer prompt pay; not property claim handling. Replaced with Ohio Adm. Code 3901-1-54 (acknowledge in 15 days; accept or deny within 21 days of proof of loss). | https://codes.ohio.gov/ohio-revised-code/section-3901.381 ; https://codes.ohio.gov/ohio-administrative-code/rule-3901-1-54 | 2026-11-01 |
| R.C. § 2305.06 | CORRECTED from "two years … under R.C. § 2305.10" | Written contracts: six years. § 2305.10 is the two-year bodily-injury and property tort statute. The fire page's "8-year" § 2305.06 period was also updated to six. | https://codes.ohio.gov/ohio-revised-code/section-2305.06 | 2026-11-01 |
| R.C. 3929.27 / § 3929.27 | REMOVED (4 uses) | "Solicitor agent of company"; it does not authorize one-year suit limits or code-upgrade coverage | https://codes.ohio.gov/ohio-revised-code/section-3929.27 | 2026-11-01 |
| R.C. 3929.25 | CORRECTED (claim) | Valued-policy rule: full policy amount on a total fire loss of a building. It does not create a "standard fire policy" or appraisal clause. | https://codes.ohio.gov/ohio-revised-code/section-3929.25 | 2026-11-01 |
| ORC 3923.041 / § 3923.041 | CORRECTED (claim) | Prior authorization: 48 hours urgent or 10 calendar days otherwise; appeals in the same windows | https://codes.ohio.gov/ohio-revised-code/section-3923.041 | 2026-11-01 |
| § 3922.01 et seq. | VERIFIED | External review chapter | https://codes.ohio.gov/ohio-revised-code/chapter-3922 | 2026-11-01 |
| ORC 3922.02 | CORRECTED from "ORC 3922.06" | Request external review within 180 days (§ 3922.06 covers issuer reconsideration) | https://codes.ohio.gov/ohio-revised-code/section-3922.02 | 2026-11-01 |
| ORC 3922.09 | VERIFIED | Expedited external review, decision within 72 hours | https://codes.ohio.gov/ohio-revised-code/section-3922.09 | 2026-11-01 |
| Chapter 3923 | VERIFIED | Sickness and accident insurance | https://codes.ohio.gov/ohio-revised-code/chapter-3923 | 2026-11-01 |

### Pennsylvania (PA)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| 31 Pa. Code § 146.1 et seq. / 31 Pa. Code § 146 | VERIFIED | Acknowledge in 10 working days (146.5); investigate within 30 days, then updates every 45 days (146.6) | https://www.pacodeandbulletin.gov/secure/pacode/data/031/chapter146/s146.5.html ; .../s146.6.html | 2026-11-01 |
| 40 P.S. § 1171.5 | VERIFIED | UIPA unfair methods and acts | https://www.legis.state.pa.us/WU01/LI/LI/US/HTM/1974/0/0205..HTM | 2026-11-01 |
| 75 Pa.C.S. § 1716 | VERIFIED | Overdue after 30 days; 12% interest; fees if unreasonable | https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/75/00.017..HTM | 2026-11-01 |
| 75 Pa.C.S. § 1798 | VERIFIED | (b) Fees when the refusal has no reasonable foundation | same | 2026-11-01 |
| 40 P.S. §§ 991.2101–991.2193 / § 991.2101 et seq. | CORRECTED from "§§ 991.2141–991.2193" | Article XXI (Act 68) begins at § 991.2101 | https://www.palegis.us/statutes/unconsolidated/law-information?sessYr=1998&sessInd=0&actNum=68 | 2026-11-01 |
| 29 U.S.C. § 1132 | VERIFIED | ERISA civil enforcement | https://www.law.cornell.edu/uscode/text/29/1132 | 2026-11-01 |
| 31 Pa. Code Ch. 154 | VERIFIED | Quality health care accountability regulations | https://www.pacodeandbulletin.gov/secure/pacode/data/031/chapter154/chap154toc.html | 2026-11-01 |

### Texas (TX)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| § 16.003 (Tex. Civ. Prac. & Rem. Code) | REMOVED (3 uses) | Two-year tort period; it does not govern policy contract claims. Replaced with Tex. Ins. Code § 541.162 (two years for Ch. 541 claims) plus the policy's contractual clause. | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=CP&Value=16.003 | 2026-11-01 |
| Tex. Ins. Code § 542A.003 | CORRECTED from "at least 60 days" and "including fire" | Notice no later than the 61st day before suit; applies only to force-of-nature losses (wildfire, lightning, etc.), not every fire | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=IN&Value=542A | 2026-11-01 |
| Tex. Ins. Code § 542.060 | CORRECTED (qualifier added) | 18% plus fees, but for Chapter 542A actions the judgment rate plus 5% (542.060(c)) | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=IN&Value=542 | 2026-11-01 |
| Section 2051.301 | REMOVED | Not an applicable code-upgrade provision ("2051.301-style endorsements"); replaced with ordinance-or-law endorsements | — | 2026-11-01 |
| Barbara Technologies v. State Farm Lloyds | VERIFIED | 589 S.W.3d 806 (Tex. 2019): paying an appraisal award does not exempt the insurer from TPPCA damages as a matter of law | https://txcourts.gov/media/1444300/170640.pdf | 2026-11-01 |
| Hinojos v. State Farm Lloyds | VERIFIED | 619 S.W.3d 651 (Tex. 2021): paying the appraisal award does not foreclose TPPCA interest for late payment | https://www.txcourts.gov/media/1451837/190280.pdf | 2026-11-01 |
| Tex. Ins. Code Chapter 4201 | CORRECTED from "§§ 4201.151–4201.359" (range not verified) | Utilization review | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=IN&Value=4201 | 2026-11-01 |
| Chapters 1271, 1301, 1369 | CORRECTED from "§§ 1271, 1301, 1369" (these are chapters) | HMO benefits, PPO plans, prescription drug benefits (step therapy) | https://statutes.capitol.texas.gov/ | 2026-11-01 |
| § 542.058 (health page) | REMOVED | General 60-day delay rule; the health clean-claim deadlines it was paired with are in §§ 1301.101–1301.137 | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=IN&Value=542 | 2026-11-01 |
| §§ 1301.101–1301.137 | VERIFIED | Subchapter C, prompt payment; § 1301.103 sets 30 days electronic and 45 days nonelectronic | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=IN&Value=1301.103 | 2026-11-01 |
| § 541.152 / Section 541.152 | VERIFIED | Actual damages, fees, and up to 3x for knowing violations | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=IN&Value=541 | 2026-11-01 |
| § 541.154 | VERIFIED | 60-day pre-suit notice | same | 2026-11-01 |
| Tex. Civ. Prac. & Rem. Code § 38.001 | VERIFIED | Fees on contract claims | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=CP&Value=38.001 | 2026-11-01 |
| Chapter 4201 / Chapter 1369 | VERIFIED | Utilization review; prescription drug benefits | https://statutes.capitol.texas.gov/ | 2026-11-01 |
| Tex. Ins. Code 541.162 | VERIFIED | Two-year limitations period for Ch. 541 claims | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=IN&Value=541 | 2026-11-01 |
| Tex. Bus. & Com. Code 17.565 | VERIFIED | Two-year DTPA limitations period | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=BC&Value=17.565 | 2026-11-01 |
| Section 541.151 | VERIFIED | Private action, including the DTPA § 17.46(b) tie-in | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=IN&Value=541 | 2026-11-01 |
| Section 17.505 | VERIFIED | 60-day DTPA notice | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=BC&Value=17.505 | 2026-11-01 |
| Chapter 17 (Bus. & Com. Code) | VERIFIED | DTPA | https://statutes.capitol.texas.gov/ | 2026-11-01 |

### Held-back hub fields (`hub-pending-fields.json`)
- **CA `claim_deadlines`: VERIFIED.** Acknowledge within 15 days (10 CCR § 2695.5(e)); decision within 40 days (§ 2695.7(b)); payment wording tightened to "within 30 calendar days after accepting it (10 CCR § 2695.7(h))"; status letters every 30 days (§ 2695.7(c)); Civ. Code § 3289 at 10%; AB 3275 requires health plans to pay, contest, or deny within 30 days effective Jan 1, 2026 (https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240AB3275 ; DMHC APL 25-007). Released. [verified_on: 2026-11-01]
- **IL `claim_deadlines`: CORRECTED, then released.** Acknowledge: 919.40 defines "reasonable promptness" as a maximum of 15 working days (VERIFIED). Decision: 919.50 (VERIFIED). Payment: within 30 days after affirming liability (919.50(a), added). Status: CORRECTED from "every 45 days (919.80)". 919.80 actually requires a written delay explanation when a fire and extended coverage claim is unresolved more than 75 days after report, or 25 days after proof of loss, whichever is less. Interest: removed the unverified "no separate statutory interest rate" claim and restated the § 155 cap. The same 919.80 "45-day" error was corrected in IL `primary_insurance_statute.key_provisions[2]` and `unique_protections[1]`. Sources: https://ftp.ilga.gov/JCAR/AdminCode/050/050009190000400R.html ; .../050009190000500R.html ; .../050009190000800R.html [verified_on: 2026-11-01]
- `hub-pending-fields.json` is now `{}`.

### Texas state data (TX hub) — prompt-payment corrections (2026-11-01)
Official text: Texas Insurance Code chapters 542 and 542A, `https://tcss.legis.texas.gov/resources/IN/htm/IN.542.htm` and `.../IN.542A.htm`, read 2026-11-01.

| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| § 542A.003 | CORRECTED (state data) | Written notice is required no later than the 61st day before filing an action to which Chapter 542A applies. "60-day pre-suit notice" was replaced. | https://tcss.legis.texas.gov/resources/IN/htm/IN.542A.htm | 2026-11-01 |
| § 542.060 / § 542.060(c) | CORRECTED (state data) | (a) 18% a year plus reasonable and necessary attorney's fees; (c) only in an action to which Chapter 542A applies: simple interest at the judgment-date rate under Finance Code § 304.003 plus five percent, plus fees. The claim that the judgment rate plus 5% applies to all post-September-2017 claims was wrong and was replaced. The unverified "capped at 20%" figure was removed. | https://tcss.legis.texas.gov/resources/IN/htm/IN.542.htm | 2026-11-01 |
| Finance Code § 304.003 | VERIFIED (as cross-referenced) | The rate source that § 542.060(c) incorporates by reference (stated in § 542.060(c) itself). | https://tcss.legis.texas.gov/resources/IN/htm/IN.542.htm | 2026-11-01 |

### Texas hub — Chapter 542A storm/hurricane/roof section (2026-11-02)
Official text: Texas Insurance Code Chapter 542A, `https://tcss.legis.texas.gov/resources/IN/htm/IN.542A.htm`, read 2026-11-02 (Texas Legislature Online statute text — official).

| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| Chapter 542A | VERIFIED | Claims for damage to real property caused wholly or partly by forces of nature | https://tcss.legis.texas.gov/resources/IN/htm/IN.542A.htm | 2026-11-01 |
| § 542A.001 | VERIFIED | Defines "claim" (first-party real-property claim, forces of nature incl. hurricane, hail, wind, tornado, flood, wildfire, lightning, rainstorm) | https://tcss.legis.texas.gov/resources/IN/htm/IN.542A.htm | 2026-11-01 |
| § 542A.002 | VERIFIED | Applies to actions against insurer or agent for contract, negligence/fraud, Ch. 541 Subch. D, Ch. 542 Subch. B, DTPA | https://tcss.legis.texas.gov/resources/IN/htm/IN.542A.htm | 2026-11-01 |
| § 542A.003(a), (b), (d) | VERIFIED | 61st-day written notice; contents (acts/omissions, specific amount owed, attorney's fees incurred); exceptions (limitations, counterclaim) | https://tcss.legis.texas.gov/resources/IN/htm/IN.542A.htm | 2026-11-01 |
| § 542A.004 | VERIFIED | Insurer may request inspection within 30 days of notice; complete within 60 days if reasonably possible | https://tcss.legis.texas.gov/resources/IN/htm/IN.542A.htm | 2026-11-01 |
| § 542A.005 | VERIFIED | Plea in abatement for missing notice or no inspection opportunity | https://tcss.legis.texas.gov/resources/IN/htm/IN.542A.htm | 2026-11-01 |
| § 542A.007 / § 542A.007(d) | VERIFIED | Fee award proportional to judgment/amount-alleged ratio (<0.2 none; >=0.8 full); fee cutoff if notice lacked specific amount | https://tcss.legis.texas.gov/resources/IN/htm/IN.542A.htm | 2026-11-01 |

### National pages — health insurance appeal deadlines + how to fight a claim denial (2026-11-02)
Official text: eCFR, read 2026-11-02 (current through 2026-10-29): 45 CFR § 147.136 (`https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-B/part-147/section-147.136`) and 29 CFR § 2560.503-1 (`https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XXV/subchapter-L/part-2560/section-2560.503-1`). Source type: Official (eCFR).

| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| 29 CFR § 2560.503-1(h)(3)(i) | VERIFIED | Group health plan procedures must give claimants at least 180 days after notice of an adverse benefit determination to appeal | eCFR 2560.503-1 | 2026-11-01 |
| 29 CFR § 2560.503-1(h)(2)(ii), (h)(2)(iii), (h)(3)(ii) | VERIFIED | Opportunity to submit written comments/documents; free reasonable access to and copies of all relevant documents; review that does not defer to the initial determination | eCFR 2560.503-1 | 2026-11-01 |
| 29 CFR § 2560.503-1(f)(2)(i) | VERIFIED | Urgent care claims: decision as soon as possible, no later than 72 hours after receipt | eCFR 2560.503-1 | 2026-11-01 |
| 29 CFR § 2560.503-1(f)(2)(iii) | VERIFIED | Pre-service claims 15 days (one extension up to 15 days); post-service claims 30 days (one extension up to 15 days) | eCFR 2560.503-1 | 2026-11-01 |
| 29 CFR § 2560.503-1(i)(2)(i)-(iii) | VERIFIED | Appeal decisions: urgent 72 hours; pre-service 30 days and post-service 60 days for a plan with one level of appeal | eCFR 2560.503-1 | 2026-11-01 |
| 45 CFR § 147.136 / § 147.136(b) | VERIFIED | Internal claims and appeals and external review requirements for group health plans and issuers (group and individual coverage) | eCFR 147.136 | 2026-11-01 |
| § 147.136(a)(1)(ii) | VERIFIED | Grandfathered plans: external review (c) and (d) still apply to certain out-of-network emergency, nonparticipating-provider-at-participating-facility, and air ambulance disputes | eCFR 147.136 | 2026-11-01 |
| § 147.136(b)(2)(ii)(F) | VERIFIED | Deemed exhaustion of internal process where the plan fails to adhere to the requirements | eCFR 147.136 | 2026-11-01 |
| § 147.136(c) | VERIFIED | State external review standards; state process must allow at least four months to request external review | eCFR 147.136 | 2026-11-01 |
| § 147.136(d) | VERIFIED | Federal external review process for plans/issuers not subject to a state process: four months to file; IRO decision within 45 days; expedited review within 72 hours | eCFR 147.136 | 2026-11-01 |

### National pages — letter-generator templates (ERISA claims regulation) (2026-11-01 close-out)
Official text: eCFR 29 CFR § 2560.503-1, current through 2026-10-29, `https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XXV/subchapter-L/part-2560/section-2560.503-1`. Source type: Official (eCFR).

| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| 29 CFR § 2560.503-1(h)(2)(i) | VERIFIED | Plans other than group health and disability plans must give claimants at least 60 days after notice of an adverse benefit determination to appeal | eCFR 2560.503-1 | 2026-11-01 |
| 29 CFR § 2560.503-1(h)(4) | VERIFIED | Plans providing disability benefits must meet (h)(3)(i)-(v), including at least 180 days to appeal | eCFR 2560.503-1 | 2026-11-01 |
| 29 CFR § 2560.503-1(h) | VERIFIED | Full and fair review: 180 days to appeal for group health and disability plans (h)(3)(i), (h)(4); 60 days for other plans (h)(2)(i) | eCFR 2560.503-1 | 2026-11-01 |

## Source-grade audit of the Phase A "Key verified facts" citations (2026-11-01 close-out)
The Phase A state sections above cited secondary sources (law-firm blogs, aggregators). Each citation that appeared only there was re-checked against the official text on 2026-11-01. VERIFIED (Official) = the legislature's or agency's own site; VERIFIED (Primary) = full opinion text on CourtListener (the reporter citation resolves to the named case). Anything the official site blocks from automated reads stays SECONDARY and is listed at the end. No official text contradicted a Phase A claim.

### California (CA)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| Brandt v. Superior Court, 37 Cal.3d 813 (1985) | VERIFIED (Primary: CourtListener opinion text) | Insured may recover attorney fees incurred to obtain policy benefits after a bad-faith denial (Brandt fees) | https://www.courtlistener.com/c/Cal.%203d/37/813/ | 2026-11-01 |

### Texas (TX)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| Tex. Ins. Code Ch. 541 | VERIFIED (Official) | Unfair methods of competition / unfair or deceptive practices in insurance | https://tcss.legis.texas.gov/resources/IN/htm/IN.541.htm | 2026-11-01 |
| Tex. Ins. Code Ch. 542 | VERIFIED (Official) | Processing and settlement of claims (prompt payment) | https://tcss.legis.texas.gov/resources/IN/htm/IN.542.htm | 2026-11-01 |
| Tex. Ins. Code § 542.055 | VERIFIED (Official) | Receipt of notice of claim: acknowledge, commence investigation, request items | https://tcss.legis.texas.gov/resources/IN/htm/IN.542.htm | 2026-11-01 |
| Tex. Ins. Code § 542.056 | VERIFIED (Official) | Notice of acceptance or rejection of claim | same | 2026-11-01 |
| Tex. Ins. Code § 542.057 | VERIFIED (Official) | Payment of claim | same | 2026-11-01 |
| Tex. Ins. Code § 542.059 | VERIFIED (Official) | Extension of deadlines | same | 2026-11-01 |
| Tex. Ins. Code Ch. 1813 | VERIFIED (Official) | Chapter exists in the Insurance Code (existence only; no figure relied on) | https://tcss.legis.texas.gov/resources/IN/htm/IN.1813.htm | 2026-11-01 |

### Florida (FL)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| Fla. Stat. § 626.9541 | VERIFIED (Official) | Unfair methods of competition and unfair or deceptive acts | https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0626/Sections/0626.9541.html | 2026-11-01 |
| Fla. Stat. § 627.70131 | VERIFIED (Official) | Insurer's duty: acknowledge within 7 calendar days; pay or deny within 60 days after notice of a property claim | https://www.flsenate.gov/Laws/Statutes/2025/627.70131 | 2026-11-01 |
| Fla. Stat. § 627.7142 | VERIFIED (Official) | Homeowner Claims Bill of Rights | https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.7142.html | 2026-11-01 |
| Fla. Stat. § 624.155 | VERIFIED (Official) | Civil remedy for insurer bad faith | https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0624/Sections/0624.155.html | 2026-11-01 |
| Fla. Stat. § 627.4265 | VERIFIED (Official) | Payment of settlement | https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.4265.html | 2026-11-01 |
| Fla. Stat. § 627.70132 | VERIFIED (Official) | Notice of property insurance claim | https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.70132.html | 2026-11-01 |
| Fla. Stat. § 55.03 | VERIFIED (Official) | Judgment interest rate | https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0055/Sections/0055.03.html | 2026-11-01 |

### New York (NY)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| Bi-Economy Market, Inc. v. Harleysville Ins. Co. of N.Y., 10 N.Y.3d 187 (2008) | VERIFIED (Primary: CourtListener opinion text) | Consequential damages for breach of the insurance contract | https://www.courtlistener.com/c/N.Y.3d/10/187/ | 2026-11-01 |
| Panasia Estates, Inc. v. Hudson Ins. Co., 10 N.Y.3d 200 (2008) | VERIFIED (Primary: CourtListener opinion text) | Consequential damages for breach of the insurance contract | https://www.courtlistener.com/c/N.Y.3d/10/200/ | 2026-11-01 |

### Illinois (IL)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| 215 ILCS 5/154.5 | VERIFIED (Official) | Improper claims practice where committed knowingly or with frequency | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200005/021500050K154.5.html | 2026-11-01 |
| 735 ILCS 5/13-206 | VERIFIED (Official) | Ten-year limitation on written contracts | https://ftp.ilga.gov/ILCS/Ch%200735/Act%200005/073500050K13-206.html | 2026-11-01 |

### Pennsylvania (PA)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| 42 Pa.C.S. § 8371 | VERIFIED (Official) | Insurer bad faith: interest at prime rate plus 3%, punitive damages, court costs and attorney fees | https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/00.083..HTM | 2026-11-01 |
| 42 Pa.C.S. § 5524 | VERIFIED (Official) | Two-year limitation | https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/00.055..HTM | 2026-11-01 |
| 42 Pa.C.S. § 5525 | VERIFIED (Official) | Four-year limitation (contract actions) | same | 2026-11-01 |
| 31 Pa. Code § 146.7 | VERIFIED (Official) | Standards for prompt, fair and equitable settlements | https://www.pacodeandbulletin.gov/secure/pacode/data/031/chapter146/s146.7.html | 2026-11-01 |
| Rancosky v. Washington National Ins. Co., 170 A.3d 364 (Pa. 2017) | VERIFIED (Primary: CourtListener opinion text) | Bad-faith standard under 42 Pa.C.S. § 8371 (Terletsky test) | https://www.courtlistener.com/c/A.3d/170/364/ | 2026-11-01 |

### Ohio (OH)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| R.C. 3901.20 | VERIFIED (Official) | Unfair and deceptive acts in the business of insurance | https://codes.ohio.gov/ohio-revised-code/section-3901.20 | 2026-11-01 |
| R.C. 2315.21 | VERIFIED (Official) | Punitive damages: procedure and caps | https://codes.ohio.gov/ohio-revised-code/section-2315.21 | 2026-11-01 |
| R.C. 2305.09 | VERIFIED (Official) | Four-year limitation (including certain torts) | https://codes.ohio.gov/ohio-revised-code/section-2305.09 | 2026-11-01 |
| R.C. Ch. 3922 | VERIFIED (Official) | External review of adverse benefit determinations | https://codes.ohio.gov/ohio-revised-code/chapter-3922 | 2026-11-01 |
| Hoskins v. Aetna Life Ins. Co., 6 Ohio St.3d 272 (1983) | VERIFIED (Primary: CourtListener opinion text) | First-party bad-faith tort | https://www.courtlistener.com/c/Ohio%20St.%203d/6/272/ | 2026-11-01 |
| Zoppo v. Homestead Ins. Co., 71 Ohio St.3d 552 (1994) | VERIFIED (Primary: CourtListener opinion text) | First-party bad-faith standard (lack of reasonable justification) | https://www.courtlistener.com/c/Ohio%20St.%203d/71/552/ | 2026-11-01 |

### North Carolina (NC)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| N.C. Gen. Stat. § 58-63-15 | VERIFIED (Official) | Unfair methods of competition and unfair or deceptive acts | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_58/GS_58-63-15.html | 2026-11-01 |
| N.C. Gen. Stat. § 75-1.1 | VERIFIED (Official) | Unfair or deceptive acts or practices in commerce | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_75/GS_75-1.1.html | 2026-11-01 |
| N.C. Gen. Stat. § 75-16 | VERIFIED (Official) | Treble damages | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_75/GS_75-16.html | 2026-11-01 |
| N.C. Gen. Stat. § 75-16.1 | VERIFIED (Official) | Attorney fees in Chapter 75 actions | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_75/GS_75-16.1.html | 2026-11-01 |
| N.C. Gen. Stat. § 58-3-100 | VERIFIED (Official) | Claim acknowledgment and status timing | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_58/GS_58-3-100.html | 2026-11-01 |
| N.C. Gen. Stat. § 58-44-16 | VERIFIED (Official) | Standard fire policy: loss payable 60 days after proof of loss and ascertainment | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_58/GS_58-44-16.html | 2026-11-01 |
| N.C. Gen. Stat. § 1-52 | VERIFIED (Official) | Three-year limitation | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_1/GS_1-52.html | 2026-11-01 |
| N.C. Gen. Stat. § 58-50-75 | VERIFIED (Official) | External review article (Smart NC) | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_58/GS_58-50-75.html | 2026-11-01 |
| N.C. Gen. Stat. § 58-3-225 | VERIFIED (Official) | Prompt claim payments under health benefit plans | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_58/GS_58-3-225.html | 2026-11-01 |

### Arizona (AZ)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| A.R.S. § 20-461 | VERIFIED (Official) | Unfair claim settlement practices | https://www.azleg.gov/ars/20/00461.htm | 2026-11-01 |
| A.R.S. § 20-462 | VERIFIED (Official) | Timely payment: a first-party claim unpaid 30 days after acceptable proof of loss bears interest at the legal rate | https://www.azleg.gov/ars/20/00462.htm | 2026-11-01 |
| A.R.S. § 12-548 | VERIFIED (Official) | Six-year limitation (written contracts) | https://www.azleg.gov/ars/12/00548.htm | 2026-11-01 |
| A.R.S. § 12-542 | VERIFIED (Official) | Two-year limitation | https://www.azleg.gov/ars/12/00542.htm | 2026-11-01 |
| A.R.S. §§ 20-2533 through 20-2537 | VERIFIED (Official) | Health care appeals: grievance, expedited, initial appeal, external independent review | https://www.azleg.gov/ars/20/02533.htm ; https://www.azleg.gov/ars/20/02537.htm | 2026-11-01 |
| Noble v. National American Life Ins. Co., 128 Ariz. 188 (1981) | VERIFIED (Primary: CourtListener opinion text) | First-party bad-faith tort | https://www.courtlistener.com/c/Ariz./128/188/ | 2026-11-01 |
| Zilisch v. State Farm Mut. Auto. Ins. Co., 196 Ariz. 234 (2000) | VERIFIED (Primary: CourtListener opinion text) | Bad faith: duty beyond fair debatability | https://www.courtlistener.com/c/Ariz./196/234/ | 2026-11-01 |

### Remaining SECONDARY (official source blocks automated reads or is not public)
- **California:** Ins. Code § 790.03, § 2071; Civ. Code § 3294. leginfo.legislature.ca.gov and law.justia.com return 403 to automated requests. Re-checked 2026-11-02 through Perplexity (quoting leginfo) and the california.public.law mirror (§ 2071); URLs and amendment dates are in Phase C. Remains SECONDARY. [verified_on: 2026-11-02]
- **New York:** none. Ins. Law § 2601, § 3224-a, § 3408 and § 3404 were read on nysenate.gov on 2026-11-02 and upgraded to Official (see Phase C). The NY court dollar limits and the § 4910 fee remain Secondary (nycourts.gov returns 403). [verified_on: 2026-11-02]
- **Georgia:** O.C.G.A. § 33-4-6, § 9-3-24, § 15-10-2 (Justia/govinfo court opinions; the legislature hosts only an annotated Title 33 supplement that omits their unamended text). § 33-6-34 and § 33-7-11(j) were read in the official Title 33 PDF on 2026-11-02 (Phase C). [verified_on: 2026-11-02]
- **Pennsylvania:** 40 P.S. §§ 1171.1 to 1171.15: § 1171.5 is verified against legis.state.pa.us (Phase B); the other sections of the range were not individually re-read. [verified_on: 2026-11-01]

### Illinois (IL) — literal page forms (2026-11-01 close-out)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| Insurance Code § 397 (Section 397; 215 ILCS 5/397) | VERIFIED | Directs the Director to make basic fire policies uniform; no proof-of-loss or suit deadline of its own | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200005/021500050K397.html | 2026-11-01 |
| 50 Ill. Adm. Code § 919 (Section 919; Code 919) | VERIFIED | Improper Claims Practice rules: 15 working days for reasonable promptness (919.40); affirm or deny in a reasonable time and pay within 30 days after affirming liability (919.50) | https://ftp.ilga.gov/JCAR/AdminCode/050/050009190000500R.html | 2026-11-01 |

## Phase C — strict-mode verification (2026-11-02)
Gate A15 is now strict: every citation (pages, generator data, and every source file) and every dollar/percent/day figure (pages, generator data) must map to a dated entry in this log. This section logs, against primary text read on 2026-11-02, every item that had no entry; unverifiable sentences were removed from the sources (court filing-fee ranges, policy-clause durations, a 60-70% IMR statistic, attorney-fee price claims on the landing page, and the unverified sentences in the 70 merged/unrendered combo files). Source grade is in the Status column: Official = the legislature's, court's or agency's own site; Primary = full opinion text resolved by reporter citation on CourtListener; Secondary = mirror or Perplexity-only, with the URL and amendment date recorded.

### Arizona (AZ)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| A.R.S. § 20-2537 | VERIFIED (Official) | External independent review and expedited external independent review; a member may start one within four months after written notice of an adverse determination (subsection B); read 2026-11-02 | https://www.azleg.gov/ars/20/02537.htm | 2026-11-02 |
| A.R.S. § 22-201 | VERIFIED (Official) | Justices of the peace have exclusive original jurisdiction of civil actions of $10,000 or less (subsection B); read 2026-11-02 | https://www.azleg.gov/ars/22/00201.htm | 2026-11-02 |
| A.R.S. § 22-503 | VERIFIED (Official) | Small claims division jurisdiction: claims not exceeding $5,000, exclusive of interest and costs; read 2026-11-02 | https://www.azleg.gov/ars/22/00503.htm | 2026-11-02 |
| Darner Motor Sales v. Universal Underwriters Ins. Co., 140 Ariz. 383 (1984) | VERIFIED (Primary: CourtListener reporter cite resolves to the named case) | Reasonable-expectations doctrine for insurance contract terms | https://www.courtlistener.com/c/Ariz./140/383/ | 2026-11-02 |

### California (CA)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| Gruenberg v. Aetna Ins. Co., 9 Cal.3d 566 (1973) | VERIFIED (Primary: CourtListener reporter cite resolves to the named case) | Insurer's bad-faith withholding of benefits is a tort | https://www.courtlistener.com/c/Cal.%203d/9/566/ | 2026-11-02 |
| Egan v. Mutual of Omaha Ins. Co., 24 Cal.3d 809 (1979) | VERIFIED (Primary: CourtListener reporter cite resolves to the named case) | Implied covenant of good faith: tort liability for unreasonable refusal to pay benefits | https://www.courtlistener.com/c/Cal.%203d/24/809/ | 2026-11-02 |
| Moradi-Shalal v. Fireman's Fund Ins. Companies, 46 Cal.3d 287 (1988) | VERIFIED (Primary: CourtListener reporter cite resolves to the named case) | No private right of action under Ins. Code § 790.03(h) | https://www.courtlistener.com/c/Cal.%203d/46/287/ | 2026-11-02 |
| Code of Civil Procedure § 85 | VERIFIED (Secondary: Perplexity quoting leginfo; leginfo returns 403 to automated reads) | Limited civil case: amount in controversy $35,000 or less (Stats. 2023, ch. 861, SB 71, effective 1/1/2024) | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=85. | 2026-11-02 |
| Health & Safety Code § 1368(a)(4)(A) | VERIFIED (Secondary: california.public.law mirror) | Health plan grievance system must provide written acknowledgment within five calendar days of receiving a grievance (5 days), with exceptions | https://california.public.law/codes/ca_health_and_safety_code_section_1368 | 2026-11-02 |
| Insurance Code § 2071 | VERIFIED (Secondary: Perplexity + california.public.law mirror; amendment Stats. 2018, ch. 639, AB 2594, effective 9/21/2018) | Standard fire policy: suit within 12 months after inception of the loss; 24 months for a Gov. Code § 8558(b) state of emergency; informal appraisal | https://california.public.law/codes/ca_ins_code_section_2071 | 2026-11-02 |
| Insurance Code § 790.03(h) | VERIFIED (Secondary: Perplexity quoting leginfo; no 2025-26 chaptered change found) | Sixteen unfair claims settlement practices | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=INS&sectionNum=790.03 | 2026-11-02 |
| Civil Code § 3294 | VERIFIED (Secondary: Perplexity quoting leginfo; Stats. 1992, ch. 178, effective 1/1/1993) | Punitive damages require clear and convincing evidence of oppression, fraud or malice | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=3294.&lawCode=CIV | 2026-11-02 |

### Florida (FL)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| Fla. Stat. § 627.6141 | VERIFIED (Official) | A claim denied as not medically necessary gets an appeal to the insurer's licensed physician, who must respond within a reasonable time not to exceed 15 business days; read 2026-11-02 | https://www.flsenate.gov/Laws/Statutes/2025/627.6141 | 2026-11-02 |
| Fla. Stat. § 641.511 | VERIFIED (Official) | HMO subscriber grievance procedure; a subscriber must submit a grievance within 1 year after the action that initiated it; read 2026-11-02 | https://www.flsenate.gov/Laws/Statutes/2025/641.511 | 2026-11-02 |
| Fla. Stat. § 86.121 | VERIFIED (Official) | Attorney fees to the insured in a declaratory action on coverage after a total coverage denial; does not apply to residential or commercial property policies; read 2026-11-02 | https://www.flsenate.gov/Laws/Statutes/2025/86.121 | 2026-11-02 |
| Fla. Stat. § 95.11 | VERIFIED (Official) | Five years for an action on a written instrument, § 95.11(2)(b) (5 years; five years); property insurance contract action five years from date of loss, § 95.11(2)(e); read 2026-11-02 | https://www.flsenate.gov/Laws/Statutes/2025/95.11 | 2026-11-02 |
| Fla. Stat. § 627.6131 and § 641.3155 | VERIFIED (Official for § 627.6131) | Electronic health claims paid or denied within 20 days of receipt; non-electronic claims within 40 days; 12% interest on overdue claims; read 2026-11-02 | https://www.flsenate.gov/Laws/Statutes/2025/627.6131 | 2026-11-02 |
| Fla. Stat. § 627.70132 | VERIFIED (Official) | Claim or reopened claim barred unless notice given within 1 year after the date of loss; supplemental claim within 18 months after the date of loss; read 2026-11-02 | https://www.flsenate.gov/Laws/Statutes/2025/627.70132 | 2026-11-02 |
| Fla. Stat. § 627.7142 | VERIFIED (Official) | Homeowner Claims Bill of Rights must be provided within 14 days after receiving an initial communication about a claim; read 2026-11-02 | https://www.flsenate.gov/Laws/Statutes/2025/627.7142 | 2026-11-02 |
| Fla. Stat. § 34.01 | VERIFIED (Official) | County court civil jurisdiction: $50,000 for actions filed on or after January 1, 2023; read 2026-11-02 | https://www.flsenate.gov/Laws/Statutes/2025/34.01 | 2026-11-02 |
| Fla. Sm. Cl. R. 7.010 | VERIFIED (Secondary: Perplexity citing the Florida Bar rules PDF effective 7/1/2026) | Small claims cases: $8,000 or less, exclusive of costs, interest and attorney fees | https://www-media.floridabar.org/uploads/2026/08/2026_01-JUL-Small-Claims-Rules-7-1-2026-1.pdf | 2026-11-02 |

### Georgia (GA)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| O.C.G.A. § 33-6-34 | CORRECTED (the "written accept or deny within 15 days" claim removed; the section has no such deadline) | Lists unfair claims practices: failing to acknowledge claim communications with reasonable promptness, refusing to pay without a reasonable investigation, failing to affirm or deny within a reasonable time after written request; amended 2020, 2022, 2023 (HB 295, eff. 7/1/2023); nothing found for 2024-2026 | https://www.legis.ga.gov/api/document/docs/default-source/joint-features-document-library/t33-ch1-22-(v24)-pdf.pdf (official LexisNexis text, 2025 Supp., read 2026-11-02) | 2026-11-02 |
| Ga. Comp. R. & Regs. 120-2-52-.03 | VERIFIED (Official) | Personal private passenger auto claims: acknowledge within 15 days; affirm or deny within 15 days of a completed proof of loss; pay within 10 days after coverage is confirmed and the amount is undisputed; read 2026-11-02 | https://rules.sos.ga.gov/gac/120-2-52 | 2026-11-02 |
| O.C.G.A. § 33-7-11(j) | VERIFIED (Official) | Uninsured-motorist bad faith after a 60-day demand: not more than 25 percent of the recovery or $25,000, whichever is greater, plus fees (2021 amendment) | same Title 33 PDF, p. 64 | 2026-11-02 |
| O.C.G.A. § 33-4-6 | VERIFIED (Secondary: M.D. Ga. opinions on govinfo.gov (7:25-cv-00004-LAG, 7/21/2025; 7:25-cv-00155-WLS, 3/9/2026) and Justia; no 2024-2026 amendment found) | 60-day demand; penalty of not more than 50 percent of the liability or $5,000, whichever is greater, plus attorney fees, on a bad-faith refusal | https://law.justia.com/codes/georgia/title-33/chapter-4/section-33-4-6/ | 2026-11-02 |
| O.C.G.A. § 9-3-24 | VERIFIED (Secondary: Justia; no amendment found) | Six years (6-year; six-year; six years) for simple written contracts | https://law.justia.com/codes/georgia/title-9/chapter-3/article-2/section-9-3-24/ | 2026-11-02 |
| O.C.G.A. § 15-10-2 | VERIFIED (Secondary: Justia 2024 Code and county court sites) | Magistrate court civil jurisdiction where the amount demanded does not exceed $15,000 | https://law.justia.com/codes/georgia/title-15/chapter-10/article-1/section-15-10-2/ | 2026-11-02 |
| HB 1344 (2026 session), new O.C.G.A. § 33-24-59.37 | VERIFIED (Official: enrolled text read 2026-11-02; signing date 5/12/2026 per Perplexity) | First-party property policies issued, delivered or renewed on or after July 1, 2027 may not set suit deadlines shorter than 2 years (two years) from the date of loss; not in force for existing policies; liability and workers' compensation exempt | https://www.legis.ga.gov/api/legislation/document/20252026/249047 | 2026-11-02 |

### Illinois (IL)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| 215 ILCS 5/154.6 (Section 154.6) | VERIFIED (Official) | Acts constituting improper claims practice, if committed without just cause and in violation of Section 154.5; read 2026-11-02 | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200005/021500050K154.6.html | 2026-11-02 |
| 50 Ill. Adm. Code 919.80 | VERIFIED (Official) | A fire and extended coverage claim unresolved for more than 75 calendar days from the date reported, or 25 calendar days after proof of loss, whichever is less, requires a reasonable written explanation of the delay; read 2026-11-02 | https://ftp.ilga.gov/JCAR/AdminCode/050/050009190000800R.html | 2026-11-02 |
| Ill. S. Ct. Rule 281 | VERIFIED (Secondary: Perplexity; official rules directory lists Rule 281, amended 9/29/2021 eff. 1/1/2022; the PDF text could not be extracted) | Small claim definition: $10,000 limit | https://www.illinoiscourts.gov/rules-law/supreme-court-rules/directory/ | 2026-11-02 |
| Sandy Point Dental v. Cincinnati Ins. Co., 20 F.4th 327 (7th Cir. 2021) | VERIFIED (Secondary: Justia opinion text via Perplexity; CourtListener does not resolve F.4th) | Loss of use without physical alteration of property is not "direct physical loss" under the policy | https://law.justia.com/cases/federal/appellate-courts/ca7/21-1186/21-1186-2021-12-09.html | 2026-11-02 |

### New York (NY)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| Insurance Law § 2601 | VERIFIED (Official; last amended 2019-01-04) | Unfair claim settlement practices; thirty working days after proof of loss in subsection (a)(4); penalty under § 109(b) | https://www.nysenate.gov/legislation/laws/ISC/2601 | 2026-11-02 |
| Insurance Law § 3224-a (Ins. Law § 3224-a) | VERIFIED (Official; last amended 2025-09-19) | Prompt pay: 30 days for electronic claims, 45 days for paper or fax claims; interest at the greater of the Tax Law corporate rate or 12% a year from the date payment was due; each late claim is a separate violation | https://www.nysenate.gov/legislation/laws/ISC/3224-A | 2026-11-02 |
| Insurance Law § 3408 | VERIFIED (Official; last amended 2014-11-28) | Court may compel appraisal; appraisal decides actual cash value, replacement cost and extent and amount of loss, not coverage | https://www.nysenate.gov/legislation/laws/ISC/3408 | 2026-11-02 |
| Insurance Law § 3404(e) | VERIFIED (Official; last amended 2015-03-06) | Standard fire policy: suit within 24 months (two years; 2-year; two-year) after inception of the loss; excludes increased cost by reason of any ordinance or law | https://www.nysenate.gov/legislation/laws/ISC/3404 | 2026-11-02 |
| 11 NYCRR 216.6(c) | VERIFIED (Official text via Cornell LII) | Accept or reject within 15 business days of proof of loss or explain why more time is needed; status letters every 90 days | https://www.law.cornell.edu/regulations/new-york/11-NYCRR-216.6 | 2026-11-02 |
| Insurance Law § 4910(c)(1) | VERIFIED (Secondary: Perplexity; nysenate.gov URL; last amended 2026-01-16) | External appeal fee of up to $25 per appeal ($25), waived for hardship, refunded if the denial is overturned | https://www.nysenate.gov/legislation/laws/ISC/4910 | 2026-11-02 |
| NY small-claims and civil court limits | VERIFIED (Secondary: Perplexity citing nycourts.gov, which returns 403 to automated reads; page date 2025-01-01) | NYC Civil Court small claims $10,000; city and district courts $5,000; town and village courts $3,000; NYC Civil Court civil jurisdiction $50,000; City Courts outside NYC civil jurisdiction $15,000 | https://www.nycourts.gov/help/small-claims ; https://ww2.nycourts.gov/courts/6jd/descriptions.shtml | 2026-11-02 |

### North Carolina (NC)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| N.C. Gen. Stat. § 58-50-75 et seq. | VERIFIED (Official) | Part of Article 50 on external review of utilization-review decisions; § 58-50-75 states purpose, scope and definitions; read 2026-11-02 | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_58/GS_58-50-75.html | 2026-11-02 |
| N.C. Gen. Stat. fifty-eight dash fifty dash ninety-five | REMOVED | Repealed by Session Laws 2015-92, effective June 19, 2015; the range "through" it was replaced by "et seq." on the health-appeal page and in the NC hub data | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_58/GS_58-50-95.html | 2026-11-02 |
| N.C. Gen. Stat. § 7A-210 | VERIFIED (Official) | Small claim action: amount in controversy not more than $10,000; read 2026-11-02 | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_7A/GS_7A-210.html | 2026-11-02 |
| N.C. Gen. Stat. § 7A-243 | VERIFIED (Official) | District court is the proper division for civil actions of $25,000 or less; superior court above $25,000 | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_7A/GS_7A-243.html | 2026-11-02 |
| N.C. Gen. Stat. § 6-21.1 | VERIFIED (Official) | Fees allowed where the insurer unreasonably refused to pay, damages recovered are $25,000 or less, and exceed the highest offer made no later than 90 days before trial; capped at $10,000 | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_6/GS_6-21.1.html | 2026-11-02 |
| N.C. Gen. Stat. § 75-16.2 | VERIFIED (Official) | Civil actions under Chapter 75 barred unless commenced within four years (four-year; 4 years) after the cause of action accrues | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_75/GS_75-16.2.html | 2026-11-02 |

### Ohio (OH)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| R.C. 3901.21 (ORC 3901.21; § 3901.21) | VERIFIED (Official; effective October 24, 2024) | Defines unfair and deceptive acts or practices in the business of insurance, including claim-settlement practices; read 2026-11-02 | https://codes.ohio.gov/ohio-revised-code/section-3901.21 | 2026-11-02 |
| R.C. 2305.09 (§ 2305.09) | VERIFIED (Official) | Four-year limitation (including certain torts); literal page forms | https://codes.ohio.gov/ohio-revised-code/section-2305.09 | 2026-11-02 |
| R.C. 1925.02 | VERIFIED (Official; effective April 9, 2025) | Small claims division: money claims not exceeding $6,000 | https://codes.ohio.gov/ohio-revised-code/section-1925.02 | 2026-11-02 |
| R.C. 1901.17 | VERIFIED (Official) | Municipal court original jurisdiction: amount claimed not exceeding $15,000 | https://codes.ohio.gov/ohio-revised-code/section-1901.17 | 2026-11-02 |

### Pennsylvania (PA)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| Terletsky v. Prudential Property & Cas. Ins. Co., 437 Pa. Super. 108, 649 A.2d 680 (1994) | VERIFIED (Primary: CourtListener reporter cite resolves to the named case) | Two-part bad-faith test: no reasonable basis for denying benefits, and knowledge or reckless disregard of that fact | https://www.courtlistener.com/c/Pa.%20Super./437/108/ | 2026-11-02 |
| 42 Pa.C.S. § 1515(a)(3) | VERIFIED (Secondary: Perplexity citing legis.state.pa.us; (a)(3) last amended August 11, 2009) | Magisterial district court civil jurisdiction: $12,000, exclusive of interest and costs | https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/00.015.015.000..HTM | 2026-11-02 |

### Texas (TX)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| Arnold v. National County Mutual Fire Ins. Co., 725 S.W.2d 165 (Tex. 1987) | VERIFIED (Primary: CourtListener reporter cite resolves to the named case) | Insurer's duty of good faith and fair dealing to its insured | https://www.courtlistener.com/c/S.W.2d/725/165/ | 2026-11-02 |
| Tex. Civ. Prac. & Rem. Code § 16.051 | VERIFIED (Official) | Residual limitations period: four years (four-year; four years) after the cause of action accrues | https://tcss.legis.texas.gov/resources/CP/htm/CP.16.htm | 2026-11-02 |
| Tex. Civ. Prac. & Rem. Code § 16.070 | VERIFIED (Official) | A contract may not limit the time to sue to less than two years (two-year; two years); shorter periods are void | https://tcss.legis.texas.gov/resources/CP/htm/CP.16.htm | 2026-11-02 |
| Tex. Ins. Code § 542A.007 | VERIFIED (Official) | Full reasonable fees if the judgment-to-amount-alleged ratio is 0.8 or more (80%); no fees if it is less than 0.2 (20%) | https://tcss.legis.texas.gov/resources/IN/htm/IN.542A.htm | 2026-11-02 |
| Tex. Gov't Code § 27.031 | VERIFIED (Official) | Justice court original jurisdiction over civil matters of not more than $20,000, exclusive of interest | https://tcss.legis.texas.gov/resources/GV/htm/GV.27.htm | 2026-11-02 |

### National pages — first-party product facts and federal literal forms (2026-11-02)
| Citation as it now appears | Status | What it says | Official source | verified_on |
|---|---|---|---|---|
| ClaimFighter price | VERIFIED (first-party: src/App.jsx constant `price: "$19"`) | One letter costs a flat $19 with no subscription; the landing-page claim about what attorneys charge was removed as unverifiable | src/App.jsx | 2026-11-02 |
| 29 CFR § 2560.503-1 (§ 2560.503-1) | VERIFIED (Official) | ERISA claims-procedure regulation; literal section-symbol form of the entries dated 2026-07-19 in VERIFICATION_LOG.md | https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XXV/subchapter-L/part-2560/section-2560.503-1 | 2026-11-02 |
