# ClaimFighter — SEO Content Verification Log (state-data.json)
Created: 2026-07-22
Directive: All-Letter-Apps Content-Enrichment (Phase 2 — insurance-claims domain)
Retrieval layer: **Perplexity MCP** (`perplexity_ask`, Sonar Pro, `search_context_size: high`) — the Perplexity tools were connected this session, so research was done "the Perplexity way" (see [[project_letterapps_and_fueldesk_session]] open item #2). Every statutory citation, deadline, and regulatory body below is grounded in Perplexity's web-cited answers; representative source URLs are listed per state (retrieval date 2026-07-22).
Scope: the 10 states in `scripts/data/states.js` (CA, TX, FL, NY, IL, PA, OH, GA, NC, AZ) — NOT 50.
Domain fields per state: `primary_insurance_statute`, `regulatory_body` / `complaint_process`, `claim_deadlines` (acknowledge / decision / payment / status / interest), `bad_faith`, `appraisal`, `statute_of_limitations`, `external_review`, `unique_protections`, `common_issues`, `last_major_reform`.

---

## California (CA)
- **Primary framework:** Unfair Insurance Practices Act (Cal. Ins. Code § 790.03(h)) + Fair Claims Settlement Practices Regulations (10 CCR §§ 2695.1–2695.11); appraisal & 1-yr suit-limit under Ins. Code § 2071.
- **Key verified facts:** 15-day acknowledgment (10 CCR § 2695.5(e)); 40-day accept/deny after proof of claim (§ 2695.7(b)); 30-day status updates (§ 2695.7(c)); common-law bad faith (Gruenberg, Egan) with Brandt fees (Brandt v. Superior Court, 37 Cal.3d 813) and punitive damages (Civ. Code § 3294); DMHC/CDI Independent Medical Review; AB 3275 (eff. 1/1/2026) uniform 30-day health-claim pay/contest/deny; 2026 wildfire package (SB 495) 60% contents advance.
- **Sources:**
  - https://www.alfainternational.com/compendium/insurance-law/california/ (Fair Claims regs timing §§ 2695.5, 2695.7)
  - https://www.dwt.com/insights/2025/09/california-ab-3275-claim-payment-deadlines-2026 (AB 3275 30-day rule, eff. 2026)
  - https://hillguard.com/california-bad-faith-insurance-law/ (implied covenant, Brandt fees, § 3294 punitives, SOL)
  - https://uphelp.org/claim-guidance-publications/insurance-claim-rules-in-california-2020/ (Ins. Code § 2071 appraisal + 12-month suit-limit; 24-month emergency extension)
  - https://www.kqed.org/science/1999791/new-california-insurance-laws-on-the-books-in-2026 (2026 wildfire reforms, contents advances)

## Texas (TX)
- **Primary framework:** Prompt Payment of Claims Act (Tex. Ins. Code Ch. 542, Subch. B) + Unfair Settlement Practices (Ch. 541) + weather-claim Ch. 542A; new binding-appraisal Ch. 1813.
- **Key verified facts:** 15-day acknowledge (§ 542.055), 15-business-day accept/deny (§ 542.056), 5-business-day pay (§ 542.057), 15-day catastrophe extension (§ 542.059); late-payment interest 18% (pre-9/2017) or post-judgment+5% capped 20% + attorney's fees (§ 542.060); Ch. 541 treble damages for knowing violations + common-law bad faith (Arnold); SB 458 (2025)→Ch. 1813 binding appraisal eff. 1/1/2026; HB 2067 automatic non-renewal explanations eff. 1/1/2026.
- **Sources:**
  - https://www.dcspia.com/blog/texas-insurance-claim-deadlines-and-time-limits/ (§§ 542.055–542.060 deadlines & interest)
  - https://law.justia.com/codes/texas/insurance-code/title-5/subtitle-c/chapter-542/subchapter-b/section-542-058/ (Ch. 542 late-payment)
  - https://www.dicklawfirm.com/blog/2025/june/does-texas-have-bad-faith-insurance-laws-/ (Ch. 541/542 + treble damages)
  - https://www.gavnat.com/blog/texas-appraisal-law-updates-for-2026-what-sb-458-changes-for-homeowners-insurers-and-public-adjusters/ (SB 458 / Ch. 1813 binding appraisal, eff. 1/1/2026)
  - https://rguajardofirm.com/blog/understanding-texas-hb-2067-what-it-means-for-your-car-insurance-claim/ (HB 2067 explanations, eff. 1/1/2026)

## Florida (FL)
- **Primary framework:** Unfair Insurance Trade Practices Act (F.S. § 626.9541) + claim-handling § 627.70131 + Homeowner Claims Bill of Rights § 627.7142; bad-faith civil remedy § 624.155.
- **Key verified facts:** 7-day acknowledgment of each communication (§ 627.70131(1)(a)); 60-day pay/deny (§ 627.70131(7)(a), reduced from 90); interest via § 55.03; 20-day payment after settlement (§ 627.4265); § 624.155 civil-remedy notice + 60-day cure; SB 76 (2021) & SB 2-A (Dec 2022) repealed one-way fees, banned AOB, shortened notice to 1 yr / 18 mo supplemental (§ 627.70132); HB 837 (2023) SOL/fee reforms.
- **Sources:**
  - https://oceanpoint.claims/resources/florida-statutes/627-70131-claim-response-deadlines/ (§ 627.70131 deadlines + § 55.03 interest)
  - https://brelly.com/claim-resources/florida-guide/ (7/30/60-day markers; Homeowner Claims Bill of Rights)
  - https://ilabacalaw.com/blog/personal-injury/florida-bad-faith-insurance-claims-explained/ (§ 624.155 CRN + 60-day cure)
  - https://www.comegys.com/florida-property-insurance-reform-2025-legislative-updates-market-impact/ (SB 2-A: one-way fee repeal, AOB ban, notice shortening)
  - https://ilabacalaw.com/blog/personal-injury/florida-insurance-claim-deadlines-and-statutes-of-limitations/ (§ 95.11 5-yr contract SOL; § 627.70132 notice)

## New York (NY)
- **Primary framework:** Ins. Law § 2601 (unfair claim settlement) + Regulation 64 (11 NYCRR Part 216); health prompt-pay § 3224-a; standard fire policy / appraisal § 3408 and 2-yr suit-limit § 3404.
- **Key verified facts:** 15-business-day response (11 NYCRR 216.4(b)); investigate within 15 business days (216.6(a)); accept/deny within 15 business days of completing investigation (216.6(b)); health claims paid in 45 days + 12% interest (§ 3224-a); **NO first-party bad-faith tort** — recovery is breach of contract + foreseeable consequential damages (Bi-Economy Market v. Harleysville; Panasia Estates v. Hudson); appraisal incl. scope-of-loss (§ 3408, 2014 amendment); 6-yr contract SOL (CPLR 213(2)); DFS external appeal (4-month window).
- **Sources:**
  - https://ezel.ai/templates/coverage-position-denial-response/ny (Reg 64 / 11 NYCRR 216 timing)
  - https://www.dfs.ny.gov/insurance/ogco2002/rg207242.htm (§ 3224-a 45-day prompt-pay + interest)
  - https://www.robinskaplan.com/newsroom/insights/empire-state-of-mind-new-york-bad-faith-update (no bad-faith tort; Bi-Economy/Panasia consequential damages)
  - https://law.justia.com/codes/new-york/isc/article-34/ (§ 3404 2-yr suit-limit; § 3408 appraisal)
  - https://www.propertyinsurancecoveragelaw.com/blog/new-york-passes-legislation-allowing-appraisal-to-determine-scope-of-loss/ (§ 3408 scope-of-loss appraisal, 2014)

## Illinois (IL)
- **Primary framework:** Improper Claims Practices (215 ILCS 5/154.5–154.6) + reasonable-settlement regs (50 Ill. Adm. Code Part 919); exclusive statutory remedy 215 ILCS 5/155.
- **Key verified facts:** 15-working-day acknowledgment (919.40); 45-day status letters (919.80); **§ 155 is the exclusive first-party remedy** (no separate common-law bad-faith tort) — attorney's fees + costs + penalty = greater of 60% of amount owed, $60,000, or excess over the insurer's pre-suit offer; 10-yr written-contract SOL (735 ILCS 5/13-206) with commonly-enforced 1-yr policy suit-limit; Health Carrier External Review Act (215 ILCS 180), 4-month external-review window. *(Superseded 2026-11-01: 919.80 status timing corrected — see Phase B, Illinois.)*
- **Sources:**
  - https://voltaire.claims/resources/compendium/jurisdictions/illinois/ (Part 919 acknowledgment & 45-day updates)
  - https://www.illinoiscourts.gov/Resources/20c1fc42-7062-4b6e-918a-4a52c8a1ee6e/1002543.htm (§ 155 remedy structure)
  - https://www.illinoislegalaid.org/legal-information/litigating-policyholder-claims-against-insurance-companies (§ 155 exclusivity; penalty amounts)
  - https://uphelp.org/claim-guidance-publications/insurance-consumer-rights-in-illinois-2022/ (10-yr contract SOL; 1-yr policy suit-limit)
  - https://magmilelaw.com/what-is-the-unfair-claims-settlement-practices-act-and-is-your-insurance-company-violating-it/ (215 ILCS 180 external review, 4-month window)

## Pennsylvania (PA)
- **Primary framework:** Unfair Insurance Practices Act (40 P.S. §§ 1171.1–1171.15) + Unfair Claims Settlement Practices regs (31 Pa. Code Ch. 146); statutory bad faith 42 Pa.C.S. § 8371.
- **Key verified facts:** 10-working-day acknowledgment (§ 146.5(a)); 15-working-day accept/deny after proof of loss (§ 146.7(a)); 30-day investigation then 45-day delay letters (§ 146.6); **§ 8371 statutory bad faith** — interest at prime+3%, punitive damages, court costs & attorney's fees; Rancosky v. Washington National (2017) adopted the two-part Terletsky test; 4-yr contract SOL (§ 5525), 2-yr bad-faith SOL (§ 5524); Act 68 grievances + Act 146 of 2022 PID-administered external review.
- **Sources:**
  - https://www.pacodeandbulletin.gov/Display/pacode?file=/secure/pacode/data/031/chapter146/s146.6.html&d=reduce (§ 146.6 30-day investigation / 45-day delay letters)
  - https://www.propertyinsurancecoveragelaw.com/blog/claims-handling-requirements-by-state-pennsylvania/ (§§ 146.5, 146.7 deadlines)
  - https://siddonslaw.com/bad-faith-insurance-lawyer/pennsylvania/ (§ 8371 prime+3% interest, punitives, fees)
  - https://www.jdsupra.com/legalnews/pennsylvania-supreme-court-clarifies-69623/ (Rancosky / Terletsky standard, 2017)
  - https://www.claimprepguide.com/states/pennsylvania (§ 5525 / § 5524 limitations)

## Ohio (OH)
- **Primary framework:** Unfair & Deceptive Insurance Practices (R.C. 3901.20–3901.21) + OAC 3901-1-54; common-law first-party bad faith.
- **Key verified facts:** 15-day acknowledgment; 21-day accept/deny after proof of loss; 45-day status letters; 10-day payment after acceptance (all OAC 3901-1-54); common-law bad faith (Hoskins v. Aetna; Zoppo v. Homestead) with punitive damages on actual malice (capped under R.C. 2315.21); 8-yr written-contract SOL (R.C. 2305.06), 4-yr bad-faith tort SOL (R.C. 2305.09), 1-yr policy suit-limit common; R.C. Ch. 3922 external review; OAC 3901-1-54 amended 2022. *(Superseded 2026-11-01: R.C. 2305.06 is 6 years — see Phase B, Ohio.)*
- **Sources:**
  - https://voltaire.claims/resources/compendium/jurisdictions/ohio/ (OAC 3901-1-54 timeframes)
  - https://uphelp.org/claim-guidance-publications/insurance-consumer-rights-in-ohio-2022/ (acknowledgment/decision/payment timing; 1-yr suit-limit)
  - https://www.ohio-insurance-lawyer.com/insurance-bad-faith-ohio-zoppo-v-homestead.php (Zoppo/Hoskins bad-faith tort, punitives)
  - https://www.drodermiller.com/blog/2025/05/what-is-ohios-statute-of-limitations-for-insurance-claims/ (R.C. 2305.06 8-yr / 2305.09 4-yr)
  - https://www.registerofohio.state.oh.us/servlet/RooBusinessPDF?ruleActionId=596390&docTypeId=15 (OAC 3901-1-54 2022 amendment)

## Georgia (GA)
- **Primary framework:** Unfair Claims Settlement Practices Act (O.C.G.A. §§ 33-6-30 to 33-6-37) + bad-faith penalty O.C.G.A. § 33-4-6.
- **Key verified facts:** § 33-6-34 prompt acknowledgment/investigation, 15-day written accept/deny; **§ 33-4-6 requires a 60-day written demand** before penalties attach — recovery = greater of 50% of the insurer's liability or $5,000, plus attorney's fees (statute itself adds no separate punitive award); 6-yr written-contract SOL (O.C.G.A. § 9-3-24); appraisal contractual; O.C.G.A. Ch. 33-20E external review; HB 1344 (Georgia Insurance Affordability and Claims Integrity Act) signed May 12, 2026 (incl. 2-yr minimum property suit-limit).
- **Sources:**
  - https://law.justia.com/codes/georgia/2020/title-33/chapter-4/section-33-4-6/ (§ 33-4-6 60-day demand; 50%/$5,000 penalty + fees)
  - https://www.robinskaplan.com/newsroom/insights/claims-handling-practices-georgia (§§ 33-6-30 to 33-6-37; § 33-6-34 15-day decision)
  - https://legalclarity.org/georgia-insurance-claims-laws-deadlines-and-compliance/ (deadlines; § 9-3-24 6-yr SOL; policy suit-limit)
  - https://www.namic.org/news/260512ma05/ (HB 1344 signed May 12, 2026)
  - https://www.insurancejournal.com/news/southeast/2026/03/04/860355.htm (2026 property suit-limit ≥ 2 years)

## North Carolina (NC)
- **Primary framework:** Unfair Claim Settlement Practices Act (N.C.G.S. § 58-63-15(11)) + UDTPA (§ 75-1.1) with treble damages (§ 75-16) & fees (§ 75-16.1).
- **Key verified facts:** 30-day acknowledgment (§ 58-3-100(a)); 45-day status updates (§ 58-3-100(c)); 60-day payment after proof of loss + ascertainment by agreement/appraisal (§ 58-44-16(17)); common-law bad faith (refusal + bad faith + aggravating conduct → punitives) plus per se UDTPA treble damages + fees; **3-yr contract SOL (§ 1-52) that policies may NOT contractually shorten** for property claims; Smart NC external review (§§ 58-50-75 to 58-50-95); health clean-claims paid in 30 days (§ 58-3-225); SB 452 auto reform eff. 7/1/2025; HB 315 litigation-funding ban eff. 7/1/2026.
- **Sources:**
  - https://www.ncleg.net/enactedlegislation/statutes/html/bysection/chapter_58/gs_58-63-15.html (§ 58-63-15(11) unfair acts)
  - https://voltaire.claims/resources/compendium/jurisdictions/north-carolina/ (§ 58-3-100 30-day/45-day; § 58-44-16(17) 60-day payment)
  - https://www.jdsupra.com/legalnews/bad-faith-and-unfair-trade-practices-4545774/ (common-law bad faith + UDTPA treble damages)
  - https://www.propertyinsurancecoveragelaw.com/blog/insurance-claim-statute-of-limitations-in-north-carolina/ (§ 1-52 3-yr SOL; no contractual shortening)
  - https://www.ncdoi.gov/changes-rating-automobile-insurance-policies-effective-july-1-2025 (SB 452 auto reform, 7/1/2025)

## Arizona (AZ)
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
| Citation as it now appears | Status | What it says | Official source |
|---|---|---|---|
| A.R.S. §§ 20-2530 through 20-2540 | VERIFIED | Health care appeals article (definitions through the appeals fund) | https://www.azleg.gov/ars/20/02530.htm ; https://www.azleg.gov/ars/20/02540.htm |
| A.R.S. § 20-2535 | CORRECTED from "bad faith damages and attorneys' fees under § 20-2535" | Initial appeal; member has up to two years after a denial to request it. It has no fee-shifting provision. The "180 days" deadline (cited to § 20-2533) was corrected to the two-year window. | https://www.azleg.gov/ars/20/02535.htm |
| A.R.S. § 20-2534 | CORRECTED (the claim-file demand moved to § 20-2533) | Expedited review, 72-hour determination (verified). It contains no claim-file right; § 20-2533(E) requires the basis, criteria used, and clinical rationale. | https://www.azleg.gov/ars/20/02534.htm ; https://www.azleg.gov/ars/20/02533.htm |
| A.R.S. § 22-503 | CORRECTED from "$3,500" | Small claims division jurisdiction is up to $5,000 | https://www.azleg.gov/ars/22/00503.htm |
| A.R.S. § 12-555 | CORRECTED (unverified "recent amendments" claim removed) | UM/UIM claim requires written notice to the insurer within three years after the accident | https://www.azleg.gov/ars/12/00555.htm |
| Title 20 | VERIFIED | Title 20 of the Arizona Revised Statutes is Insurance | https://www.azleg.gov/arstitle/ |

### California (CA)
| Citation as it now appears | Status | What it says | Official source |
|---|---|---|---|
| 10 CCR §2695.7 (meta description) | CORRECTED from "Insurance Code … §2695" | §2695.x are Title 10 regulations, not Insurance Code sections | https://www.law.cornell.edu/regulations/california/10-CCR-2695.7 |
| Title 10 CCR §2695.7 / Title 10 CCR §§2695.5(e) and 2695.7 / Title 10 CCR §§ 2695.1-2695.14 | VERIFIED (§2695.5(e) added for acknowledgment) | 15-day acknowledgment (2695.5(e)); 40-day accept or deny and 30-day status letters (2695.7(b),(c)); regulations run through 2695.14 | https://www.law.cornell.edu/regulations/california/10-CCR-2695.5 ; https://www.law.cornell.edu/regulations/california/10-CCR-2695.14 |
| §12340.7 (Insurance Code) | REMOVED | Defines title insurance "rate"; it has nothing to do with interest. Replaced with Civil Code § 3289. | https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?lawCode=INS&division=2.&title=&part=6.&chapter=1.&article=1. |
| Civil Code §3287 (BI) | CORRECTED (10% rate now attributed to § 3289) | § 3287 gives the right to prejudgment interest; § 3289(b) sets the 10% contract rate | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=3289 |
| Civil Code § 3287 (water) | CORRECTED (10% rate now attributed to § 3289) | Same as above | same |
| Civil Code § 3289 / Civ. Code § 3289 | VERIFIED | Post-breach interest at 10% per annum when the contract sets no rate | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=3289 |
| §116.221 | VERIFIED | Small claims limit of $12,500 for natural persons | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=116.221 |
| §116.220 | VERIFIED | General small claims limit of $6,250 (entities) | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=116.220 |
| §337 / § 337 (CCP) | VERIFIED | Four years for an action on a written contract | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=337 |
| §339 / § 339 (CCP) | VERIFIED | Two-year limitations period (bad-faith tort) | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=339 |
| Insurance Code § 2051.5 | CORRECTED (garbled "36 months … extended to 36 months" claim) | At least 12 months from the first ACV payment to collect replacement cost; at least 36 months for a state-of-emergency loss; 6-month good-cause extensions | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=INS&sectionNum=2051.5 |
| § 2060 (Insurance Code) | CORRECTED from "copy of the policy upon request" | Requires a list of ALE items; after a declared emergency, ALE for at least 24 months, extendable to 36 | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=INS&sectionNum=2060 |
| § 2695.9 / 10 CCR § 2695.9(f) | VERIFIED; CORRECTED claim (removed "depreciation of labor") | Replacement-cost claim standards; depreciation must be itemized, justified, and explained in writing | https://www.law.cornell.edu/regulations/california/10-CCR-2695.9 |
| Insurance Code §§ 2051 and 2051.5 | CORRECTED from "§§ 2051, 2051.5, and 2695.9(f)" (2695.9(f) is a regulation) | § 2051: ACV equals repair or replace cost less a fair deduction for physical depreciation | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=INS&sectionNum=2051 |
| Insurance Code § 790.035 | VERIFIED | Up to $5,000 per act, or $10,000 per willful act | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=INS&sectionNum=790.035 |
| Prudential-LMI v. Superior Court | VERIFIED | 51 Cal.3d 674 (1990): the one-year suit limit is equitably tolled from notice of the claim until formal denial | https://scocal.stanford.edu/opinion/prudential-lmi-commercial-ins-v-superior-court-31251 |
| Health & Safety Code §§ 1368 and 1368.01 / § 1368 | CORRECTED (unverified "72 hours" removed) | Grievance system; resolution within 30 days, with expedited review for an imminent and serious threat | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=1368.01 |
| Health & Safety Code § 1368.04 | CORRECTED (unverified "$2,500,000 for willful violations" removed) | DMHC enforcement and administrative penalties for grievance violations | https://wpso.dmhc.ca.gov/enfactions/violation.aspx |
| Insurance Code § 10169 | VERIFIED | Independent Medical Review for CDI-regulated health insurers | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=INS&sectionNum=10169 |
| Health & Safety Code § 1340 et seq. | VERIFIED | Knox-Keene Act | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=1340 |
| Health & Safety Code § 1374.30 | VERIFIED | DMHC Independent Medical Review | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=1374.30 |
| Health & Safety Code § 1367.01(e) | CORRECTED (removed the "California-licensed" claim) | Only a licensed physician or licensed health professional competent in the clinical issue may deny or modify for medical necessity; no California-only license requirement | https://www.leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?lawCode=HSC&division=2.&title=&part=&chapter=2.2.&article=5. |
| Insurance Code §§ 530 and 532 | VERIFIED | Proximate-cause rules for covered and excepted perils (efficient proximate cause) | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=INS&sectionNum=530 |
| Garvey v. State Farm | VERIFIED | 48 Cal.3d 395 (1989): efficient proximate cause | https://scocal.stanford.edu/opinion/garvey-v-state-farm-fire-cas-co-30866 |
| Sabella v. Wisler | VERIFIED | 59 Cal.2d 21 (1963): efficient proximate cause | https://scocal.stanford.edu/opinion/sabella-v-wisler-27397 |

### Florida (FL)
| Citation as it now appears | Status | What it says | Official source |
|---|---|---|---|
| § 627.6043 | REMOVED | It covers notice of cancellation, nonrenewal, and rate change; it has no appeal right and no 65-day window. Replaced with § 627.6141 (medical-necessity appeal to the insurer's physician, answer within 15 business days) and § 641.511 (HMO grievance within 1 year). | https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.6043.html ; .../0627.6141.html ; .../0641.511.html |
| § 641.3155 | VERIFIED (dropped the subsection pin "(5)") | HMO prompt pay: 20, 40, and 120 days; overdue claims bear 12% simple interest | https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0641/Sections/0641.3155.html |
| § 627.6131 | VERIFIED | Health insurer prompt pay: 20, 40, and 120 days; 12% simple interest | https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.6131.html |
| § 627.613 → § 627.6131 | CORRECTED | § 627.613 sets 10% interest (45-day rule); the 12% rate is in § 627.6131 | .../0627.613.html |
| former § 627.428 | CORRECTED from "§ 627.428 awards attorney's fees" | Repealed by ch. 2023-15 (HB 837). Fees are now under § 624.155(7) (bad faith) or § 86.121 (declaratory coverage action after a total denial). | https://www.flsenate.gov/Session/Bill/2023/837/Analyses/h0837z.CJS.PDF ; .../0624.155.html ; .../0086.121.html |
| § 627.70152 | VERIFIED | Notice of intent to sue at least 10 business days before filing a property suit | .../0627.70152.html |
| Chapter 627 | VERIFIED | Insurance rates and contracts chapter | https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/0627.html |
| § 627.7011 / § 627.7011(3) | VERIFIED | Replacement-cost offer; (3) pay ACV first, then RC as work is done | .../0627.7011.html |
| § 627.701(10) | VERIFIED | Optional roof deductible capped at the lesser of 2% of Coverage A or 50% of roof replacement cost | .../0627.701.html |

### Georgia (GA)
| Citation as it now appears | Status | What it says | Official source |
|---|---|---|---|
| O.C.G.A. § 33-7-11(j) | CORRECTED from "similar penalties" | UM bad faith after a 60-day demand: up to the greater of 25% of the recovery or $25,000, plus attorney's fees (2021 amendment) | https://law.justia.com/codes/georgia/2022/title-33/chapter-7/section-33-7-11/ (official code text reproduction; Georgia's official code is hosted by LexisNexis) |
| O.C.G.A. § 9-11-4 | VERIFIED | Civil Practice Act service of process | https://law.justia.com/codes/georgia/title-9/chapter-11/article-2/section-9-11-4/ |
| Southern General Insurance Co. v. Holt, 262 Ga. 267 (1992) | CORRECTED from "Holt v. State Farm" | Insurer's failure to accept a time-limited demand within limits can be bad faith (third-party failure to settle) | https://www.courtlistener.com/opinion/5790920/southern-general-insurance-v-holt/ |
| O.C.G.A. § 33-20A-5 | CORRECTED (unsupported "60 days to appeal" and "claim file" claims removed) | Requires a grievance hearing before a panel of three or more (including a physician other than the medical director); adverse decisions must state specific findings and the policies relied on. Under Ga. Comp. R. & Regs. 120-2-111-.04, the outcome is due in 30 days pre-service or 60 days post-service. | https://law.justia.com/codes/georgia/title-33/chapter-20a/article-1/section-33-20a-5/ ; https://oci.georgia.gov/document/document/120-2-111-04pdf/download |
| O.C.G.A. § 33-20A-30 et seq. | CORRECTED (unsupported "within 60 days" external-review deadline removed) | Patient's Right to Independent Review; the request goes to the Department on its forms | https://law.justia.com/codes/georgia/title-33/chapter-20a/article-2/section-33-20a-35/ |
| O.C.G.A. § 33-20A-1 et seq. | VERIFIED | Article 1, Patient Protection (managed care) | https://law.justia.com/codes/georgia/2023/title-33/chapter-20a/ |
| O.C.G.A. § 33-32-5 | REMOVED | Valued-policy rule for a total fire loss; it does not require insurers to pay code upgrades | https://law.justia.com/codes/georgia/2020/title-33/chapter-32/section-33-32-5/ |
| O.C.G.A. § 33-4-3 | CORRECTED (claim) | Foreign insurers appoint a resident agent; service on the Commissioner only when that agent cannot be served | https://law.justia.com/codes/georgia/title-33/chapter-4/section-33-4-3/ |

### Illinois (IL)
| Citation as it now appears | Status | What it says | Official source |
|---|---|---|---|
| 215 ILCS 5/154.6 | VERIFIED | Improper claims practices | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200005/ |
| 815 ILCS 505/2 | VERIFIED | Consumer Fraud Act prohibition | https://ftp.ilga.gov/ILCS/Ch%200815/ |
| 215 ILCS 180 | VERIFIED | Health Carrier External Review Act; request within 4 months (180/35) | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200180/021501800K35.html |
| 50 Ill. Adm. Code 919.50 (Code 919.50) | VERIFIED (hub) | Affirm or deny within a reasonable time; pay within 30 days after affirming liability; written denial explanation within 30 days | https://ftp.ilga.gov/JCAR/AdminCode/050/050009190000500R.html |
| 50 Ill. Adm. Code 919 / Code 919 | VERIFIED | Improper Claims Practice rules | https://ftp.ilga.gov/JCAR/AdminCode/050/ |
| Sandy Point Dental, P.C. v. Cincinnati Ins. Co., 20 F.4th 327 (7th Cir. 2021) | CORRECTED (it was presented as an "Illinois courts" holding) | Federal court applying Illinois law: COVID loss of use without physical alteration is not "direct physical loss" | https://law.justia.com/cases/federal/appellate-courts/ca7/21-1186/21-1186-2021-12-09.html |
| 215 ILCS 5/ (Insurance Code); 215 ILCS 5/155 | VERIFIED; CORRECTED "lesser of $60,000 or 60%" | § 155 allows fees and costs plus an amount not exceeding any one of 60%, $60,000, or the excess over the settlement offer | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200005/021500050K155.html |
| 215 ILCS 5/397 | CORRECTED (claim) | It only directs the Director to make basic fire policies uniform. It sets no 60-day proof-of-loss rule and no suit deadline. | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200005/021500050K397.html |
| 215 ILCS 5/143.1 | CORRECTED (claim) | It does not "permit" a one-year limit; it tolls the policy's suit-limitation period from proof of loss until denial | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200005/021500050K143.1.html |
| 215 ILCS 134/45 | VERIFIED | Managed Care Reform Act appeals, complaints, and external review | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200134/021501340K45.html |
| 215 ILCS 134 | VERIFIED | Managed Care Reform and Patient Rights Act | https://ftp.ilga.gov/ILCS/Ch%200215/Act%200134/ |

### New York (NY)
| Citation as it now appears | Status | What it says | Official source |
|---|---|---|---|
| 11 NYCRR § 216 (Regulation 64); 11 NYCRR §§ 216.4 and 216.6 | VERIFIED (water FAQ now cites 216.4 for acknowledgment) | 15 business days to acknowledge (216.4) and to send forms (216.5); accept or deny within 15 business days of proof of loss, status letters every 90 days (216.6) | https://www.law.cornell.edu/regulations/new-york/11-NYCRR-216.4 ; https://www.law.cornell.edu/regulations/new-york/11-NYCRR-216.6 |
| Insurance Law § 5106 / § 5106(b) | CORRECTED (arbitration is optional, not "mandatory") | Overdue after 30 days; 2% per month; fees; insurer must offer arbitration as an option | https://www.nysenate.gov/legislation/laws/ISC/5106 |
| 11 NYCRR § 65 | VERIFIED | No-fault regulation (Regulation 68) | https://www.dfs.ny.gov/industry_guidance/regulations |
| CPLR § 213 | VERIFIED | Six years for contract actions | https://www.nysenate.gov/legislation/laws/CVP/213 |
| Insurance Law Article 49 (§ 4900 et seq.) | CORRECTED from "§§ 4900-4914" | The official index lists Article 49 as §§ 4900–4917 | https://www.nysenate.gov/legislation/laws/ISC |
| General Business Law § 349 | VERIFIED | Deceptive acts and practices | https://www.nysenate.gov/legislation/laws/GBS/349 |
| ERISA § 502(a) | VERIFIED | 29 U.S.C. § 1132(a) civil enforcement | https://www.law.cornell.edu/uscode/text/29/1132 |
| Article 49 (Ins. Law and Public Health Law) | VERIFIED | Utilization review and external appeal | https://www.nysenate.gov/legislation/laws/PBH/A49 |
| § 3418 (Ins. Law) | REMOVED | Not an interest provision (the 2%/month rate is the no-fault § 5106). Replaced with CPLR § 5004 at 9%. | https://www.nysenate.gov/legislation/laws/ISC |
| Ins. Law § 3445 | CORRECTED (claim) | Directs DFS to set disclosure rules and uniform trigger standards for windstorm deductibles by regulation. The specific NWS trigger stated on the page was not in the statute and was removed. | https://www.nysenate.gov/legislation/laws/ISC/3445 |
| CPLR § 5004 | VERIFIED | Interest at 9% per annum (2% for consumer debt against natural persons) | https://www.nysenate.gov/legislation/laws/CVP/5004 |
| Pioneer Tower Owners Assn. v. State Farm Fire & Cas. Co., 12 N.Y.3d 302 (2009) | VERIFIED (full cite added) | Exclusions must be clear; ambiguous earth-movement exclusions are read narrowly in favor of coverage | https://www.nycourts.gov/reporter/3dseries/2009/2009_03409.htm |

### North Carolina (NC)
| Citation as it now appears | Status | What it says | Official source |
|---|---|---|---|
| N.C. Gen. Stat. § 58-50-61 | CORRECTED (the "180 days under § 58-50-61" attribution was removed) | Utilization review. Noncertification notice with reasons and appeal instructions (h); standard appeal decided within 30 days. The statute sets no 180-day filing period. | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_58/GS_58-50-61.html |
| N.C. Gen. Stat. § 6-21.1 | CORRECTED (incomplete conditions) | Fees if the refusal was unwarranted, the recovery is $25,000 or less, and the recovery exceeds the highest offer made 90 or more days before trial | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_6/GS_6-21.1.html |
| § 58-50-80 | VERIFIED | Standard external review; request within 120 days | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_58/GS_58-50-80.html |
| N.C. Gen. Stat. § 58-50-84 | VERIFIED | External review decision binding on the insurer | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_58/GS_58-50-84.html |
| Chapter 58 / Article 50 | VERIFIED | Insurance chapter, Article 50 | https://www.ncleg.gov/Laws/GeneralStatuteSections/Chapter58 |
| N.C. Gen. Stat. § 1D-25 | VERIFIED | Punitives capped at the greater of 3x compensatory or $250,000 | https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_1D/GS_1D-25.html |

### Ohio (OH)
| Citation as it now appears | Status | What it says | Official source |
|---|---|---|---|
| Ohio Revised Code § 3901.19 through § 3901.26 | CORRECTED (mislabeled "Unfair Claims Settlement Practices Act"; Ohio Adm. Code 3901-1-54 added) | Unfair and deceptive insurance practices law (3901.26 references "sections 3901.19 to 3901.26") | https://codes.ohio.gov/ohio-revised-code/section-3901.26 |
| R.C. § 1343.03 / ORC 1343.03 | VERIFIED | Prejudgment interest | https://codes.ohio.gov/ohio-revised-code/section-1343.03 |
| R.C. § 3901.381 | REMOVED | Health third-party-payer prompt pay; not property claim handling. Replaced with Ohio Adm. Code 3901-1-54 (acknowledge in 15 days; accept or deny within 21 days of proof of loss). | https://codes.ohio.gov/ohio-revised-code/section-3901.381 ; https://codes.ohio.gov/ohio-administrative-code/rule-3901-1-54 |
| R.C. § 2305.06 | CORRECTED from "two years … under R.C. § 2305.10" | Written contracts: six years. § 2305.10 is the two-year bodily-injury and property tort statute. The fire page's "8-year" § 2305.06 period was also updated to six. | https://codes.ohio.gov/ohio-revised-code/section-2305.06 |
| R.C. 3929.27 / § 3929.27 | REMOVED (4 uses) | "Solicitor agent of company"; it does not authorize one-year suit limits or code-upgrade coverage | https://codes.ohio.gov/ohio-revised-code/section-3929.27 |
| R.C. 3929.25 | CORRECTED (claim) | Valued-policy rule: full policy amount on a total fire loss of a building. It does not create a "standard fire policy" or appraisal clause. | https://codes.ohio.gov/ohio-revised-code/section-3929.25 |
| ORC 3923.041 / § 3923.041 | CORRECTED (claim) | Prior authorization: 48 hours urgent or 10 calendar days otherwise; appeals in the same windows | https://codes.ohio.gov/ohio-revised-code/section-3923.041 |
| § 3922.01 et seq. | VERIFIED | External review chapter | https://codes.ohio.gov/ohio-revised-code/chapter-3922 |
| ORC 3922.02 | CORRECTED from "ORC 3922.06" | Request external review within 180 days (§ 3922.06 covers issuer reconsideration) | https://codes.ohio.gov/ohio-revised-code/section-3922.02 |
| ORC 3922.09 | VERIFIED | Expedited external review, decision within 72 hours | https://codes.ohio.gov/ohio-revised-code/section-3922.09 |
| Chapter 3923 | VERIFIED | Sickness and accident insurance | https://codes.ohio.gov/ohio-revised-code/chapter-3923 |

### Pennsylvania (PA)
| Citation as it now appears | Status | What it says | Official source |
|---|---|---|---|
| 31 Pa. Code § 146.1 et seq. / 31 Pa. Code § 146 | VERIFIED | Acknowledge in 10 working days (146.5); investigate within 30 days, then updates every 45 days (146.6) | https://www.pacodeandbulletin.gov/secure/pacode/data/031/chapter146/s146.5.html ; .../s146.6.html |
| 40 P.S. § 1171.5 | VERIFIED | UIPA unfair methods and acts | https://www.legis.state.pa.us/WU01/LI/LI/US/HTM/1974/0/0205..HTM |
| 75 Pa.C.S. § 1716 | VERIFIED | Overdue after 30 days; 12% interest; fees if unreasonable | https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/75/00.017..HTM |
| 75 Pa.C.S. § 1798 | VERIFIED | (b) Fees when the refusal has no reasonable foundation | same |
| 40 P.S. §§ 991.2101–991.2193 / § 991.2101 et seq. | CORRECTED from "§§ 991.2141–991.2193" | Article XXI (Act 68) begins at § 991.2101 | https://www.palegis.us/statutes/unconsolidated/law-information?sessYr=1998&sessInd=0&actNum=68 |
| 29 U.S.C. § 1132 | VERIFIED | ERISA civil enforcement | https://www.law.cornell.edu/uscode/text/29/1132 |
| 31 Pa. Code Ch. 154 | VERIFIED | Quality health care accountability regulations | https://www.pacodeandbulletin.gov/secure/pacode/data/031/chapter154/chap154toc.html |

### Texas (TX)
| Citation as it now appears | Status | What it says | Official source |
|---|---|---|---|
| § 16.003 (Tex. Civ. Prac. & Rem. Code) | REMOVED (3 uses) | Two-year tort period; it does not govern policy contract claims. Replaced with Tex. Ins. Code § 541.162 (two years for Ch. 541 claims) plus the policy's contractual clause. | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=CP&Value=16.003 |
| Tex. Ins. Code § 542A.003 | CORRECTED from "at least 60 days" and "including fire" | Notice no later than the 61st day before suit; applies only to force-of-nature losses (wildfire, lightning, etc.), not every fire | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=IN&Value=542A |
| Tex. Ins. Code § 542.060 | CORRECTED (qualifier added) | 18% plus fees, but for Chapter 542A actions the judgment rate plus 5% (542.060(c)) | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=IN&Value=542 |
| Section 2051.301 | REMOVED | Not an applicable code-upgrade provision ("2051.301-style endorsements"); replaced with ordinance-or-law endorsements | — |
| Barbara Technologies v. State Farm Lloyds | VERIFIED | 589 S.W.3d 806 (Tex. 2019): paying an appraisal award does not exempt the insurer from TPPCA damages as a matter of law | https://txcourts.gov/media/1444300/170640.pdf |
| Hinojos v. State Farm Lloyds | VERIFIED | 619 S.W.3d 651 (Tex. 2021): paying the appraisal award does not foreclose TPPCA interest for late payment | https://www.txcourts.gov/media/1451837/190280.pdf |
| Tex. Ins. Code Chapter 4201 | CORRECTED from "§§ 4201.151–4201.359" (range not verified) | Utilization review | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=IN&Value=4201 |
| Chapters 1271, 1301, 1369 | CORRECTED from "§§ 1271, 1301, 1369" (these are chapters) | HMO benefits, PPO plans, prescription drug benefits (step therapy) | https://statutes.capitol.texas.gov/ |
| § 542.058 (health page) | REMOVED | General 60-day delay rule; the health clean-claim deadlines it was paired with are in §§ 1301.101–1301.137 | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=IN&Value=542 |
| §§ 1301.101–1301.137 | VERIFIED | Subchapter C, prompt payment; § 1301.103 sets 30 days electronic and 45 days nonelectronic | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=IN&Value=1301.103 |
| § 541.152 / Section 541.152 | VERIFIED | Actual damages, fees, and up to 3x for knowing violations | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=IN&Value=541 |
| § 541.154 | VERIFIED | 60-day pre-suit notice | same |
| Tex. Civ. Prac. & Rem. Code § 38.001 | VERIFIED | Fees on contract claims | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=CP&Value=38.001 |
| Chapter 4201 / Chapter 1369 | VERIFIED | Utilization review; prescription drug benefits | https://statutes.capitol.texas.gov/ |
| Tex. Ins. Code 541.162 | VERIFIED | Two-year limitations period for Ch. 541 claims | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=IN&Value=541 |
| Tex. Bus. & Com. Code 17.565 | VERIFIED | Two-year DTPA limitations period | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=BC&Value=17.565 |
| Section 541.151 | VERIFIED | Private action, including the DTPA § 17.46(b) tie-in | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=IN&Value=541 |
| Section 17.505 | VERIFIED | 60-day DTPA notice | https://statutes.capitol.texas.gov/GetStatute.aspx?Code=BC&Value=17.505 |
| Chapter 17 (Bus. & Com. Code) | VERIFIED | DTPA | https://statutes.capitol.texas.gov/ |

### Held-back hub fields (`hub-pending-fields.json`)
- **CA `claim_deadlines`: VERIFIED.** Acknowledge within 15 days (10 CCR § 2695.5(e)); decision within 40 days (§ 2695.7(b)); payment wording tightened to "within 30 calendar days after accepting it (10 CCR § 2695.7(h))"; status letters every 30 days (§ 2695.7(c)); Civ. Code § 3289 at 10%; AB 3275 requires health plans to pay, contest, or deny within 30 days effective Jan 1, 2026 (https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240AB3275 ; DMHC APL 25-007). Released.
- **IL `claim_deadlines`: CORRECTED, then released.** Acknowledge: 919.40 defines "reasonable promptness" as a maximum of 15 working days (VERIFIED). Decision: 919.50 (VERIFIED). Payment: within 30 days after affirming liability (919.50(a), added). Status: CORRECTED from "every 45 days (919.80)". 919.80 actually requires a written delay explanation when a fire and extended coverage claim is unresolved more than 75 days after report, or 25 days after proof of loss, whichever is less. Interest: removed the unverified "no separate statutory interest rate" claim and restated the § 155 cap. The same 919.80 "45-day" error was corrected in IL `primary_insurance_statute.key_provisions[2]` and `unique_protections[1]`. Sources: https://ftp.ilga.gov/JCAR/AdminCode/050/050009190000400R.html ; .../050009190000500R.html ; .../050009190000800R.html
- `hub-pending-fields.json` is now `{}`.
