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
- **Key verified facts:** 15-working-day acknowledgment (919.40); 45-day status letters (919.80); **§ 155 is the exclusive first-party remedy** (no separate common-law bad-faith tort) — attorney's fees + costs + penalty = greater of 60% of amount owed, $60,000, or excess over the insurer's pre-suit offer; 10-yr written-contract SOL (735 ILCS 5/13-206) with commonly-enforced 1-yr policy suit-limit; Health Carrier External Review Act (215 ILCS 180), 4-month external-review window.
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
- **Key verified facts:** 15-day acknowledgment; 21-day accept/deny after proof of loss; 45-day status letters; 10-day payment after acceptance (all OAC 3901-1-54); common-law bad faith (Hoskins v. Aetna; Zoppo v. Homestead) with punitive damages on actual malice (capped under R.C. 2315.21); 8-yr written-contract SOL (R.C. 2305.06), 4-yr bad-faith tort SOL (R.C. 2305.09), 1-yr policy suit-limit common; R.C. Ch. 3922 external review; OAC 3901-1-54 amended 2022.
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
