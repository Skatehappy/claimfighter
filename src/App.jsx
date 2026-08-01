import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID  = "YOUR_EMAILJS_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = "YOUR_EMAILJS_PUBLIC_KEY";

const APP = {
  name: "ClaimFighter",
  tagline: "Insurance Appeal Letter Writer",
  icon: "⚔️",
  color: "#1a4a2e",
  colorLight: "#2d7a4e",
  payhip: "https://payhip.com/claimfighter",
  support: "support@claimfighter.com",
  price: "$19",
  font: "'Source Serif 4', Georgia, serif",
  displayFont: "'Playfair Display', serif",
};

const STEPS = ["Intro", "Policyholder", "Property", "Claim", "Demand", "Generate", "Letter"];
const FORM_STEPS = ["Policyholder", "Property", "Claim", "Demand"];

const colors = {
  paper: "#f8faf8",
  paperWarm: "#f0f5f0",
  paperDark: "#e0ece0",
  white: "#ffffff",
  ink: "#0f1a0f",
  inkLight: "#2a3d2a",
  inkMuted: "#5a7a5a",
  inkFaint: "#8aaa8a",
  gold: APP.color,
  goldLight: APP.colorLight,
  border: "#b0ccb0",
  borderLight: "#d0e8d0",
  green: "#1a5c2a",
  red: "#8b1a1a",
  errorBg: "#fff0f0",
  errorBorder: "#ffcccc",
  errorText: "#cc2222",
};

const stepFields = {
  Policyholder: [
    { key: "ownerName",  label: "Your Full Name",     type: "text",   required: true,  placeholder: "Jane Smith" },
    { key: "ownerEmail", label: "Your Email",          type: "text",   required: false, placeholder: "jane@email.com" },
    { key: "state",      label: "Your State",          type: "text",   required: true,  placeholder: "Connecticut" },
    { key: "policyNumber", label: "Policy Number",     type: "text",   required: false, placeholder: "POL-123456" },
  ],
  Property: [
    { key: "insurerName",    label: "Insurance Company",      type: "text",   required: true,  placeholder: "e.g. Aetna, State Farm" },
    { key: "claimNumber",    label: "Claim Number",           type: "text",   required: false, placeholder: "CLM-789012" },
    { key: "claimType",      label: "Type of Claim",          type: "select", required: true,
      options: ["Health Insurance Denial", "Medical Bill Dispute", "Life Insurance Claim Denied", "Disability Insurance Denied", "Long-Term Care Denied", "Home / Auto / Renters Claim", "Surprise Medical Bill", "Other"] },
    { key: "denialDate",     label: "Date of Denial Letter",  type: "text",   required: false, placeholder: "e.g. March 15, 2026" },
  ],
  Claim: [
    { key: "billAmount",     label: "Bill Amount Disputed",   type: "text",     required: false, placeholder: "e.g. $4,200" },
    { key: "whatDenied",     label: "What Was Denied",        type: "textarea", required: true,
      placeholder: "e.g. Emergency room visit on Feb 10, 2026. Claim for $4,200. Denied as 'not medically necessary'." },
    { key: "whyWrong",       label: "Why the Denial Is Wrong", type: "textarea", required: true,
      placeholder: "e.g. My doctor ordered this treatment. The diagnosis clearly meets medical necessity criteria. Similar claims were paid last year." },
    { key: "evidence",       label: "Evidence You Have",       type: "textarea", required: false,
      placeholder: "e.g. Doctor's letter supporting medical necessity, prior authorization approval, EOB showing similar claim was paid, medical records." },
    { key: "amountDisputed", label: "Amount at Stake",         type: "text",   required: false, placeholder: "e.g. $4,200" },
  ],
  Demand: [
    { key: "demand",         label: "What You Want",          type: "select", required: true,
      options: ["Full payment of the denied claim", "Reconsideration and reversal of denial", "External independent review", "Partial payment plus reconsideration", "Written explanation and policy clarification"] },
    { key: "deadline",       label: "Response Deadline You're Setting", type: "text", required: false, placeholder: "e.g. 30 days from receipt of this letter" },
    { key: "nextSteps",      label: "What You'll Do If Ignored", type: "select", required: false,
      options: ["File complaint with state insurance commissioner", "Request external independent review", "Consult an attorney", "File complaint and consult attorney", "All available remedies"] },
    { key: "additionalInfo", label: "Anything Else to Include", type: "textarea", required: false, placeholder: "Any other relevant details..." },
  ],
};

const requiredFields = {
  Policyholder: ["ownerName", "state"],
  Property: ["insurerName", "claimType"],
  Claim: ["whatDenied", "whyWrong"],
  Demand: ["demand"],
};

const conditionalFields = {
  "Health Insurance Denial": [
    { key: "healthDenialReason", label: "Specific Denial Reason", type: "select", options: ["Medical necessity","Prior authorization not obtained","Out-of-network provider","Experimental or investigational treatment","Coverage exclusion","Other"] },
  ],
  "Medical Bill Dispute": [
    { key: "medicalBillSubtype", label: "Type of Dispute", type: "select", options: ["Itemized bill error / overcharge","Insurance underpayment (patient responsibility)","Sent to collections wrongfully","Duplicate charge","Other"] },
  ],
  "Life Insurance Claim Denied": [
    { key: "lifePolicyType",      label: "Policy Type",              type: "select", options: ["Term","Whole Life","Universal Life","Variable","Unknown"] },
    { key: "lifeDenialReason",    label: "Reason for Denial",        type: "select", options: ["Misrepresentation on application","Exclusion clause (e.g., suicide, aviation)","Lapsed policy","Contestability period","Beneficiary dispute","Other"] },
    { key: "lifeDateOfDeath",     label: "Date of Death",            type: "text",   placeholder: "e.g. March 10, 2025" },
    { key: "lifePolicyIssueDate", label: "Policy Issue Date",        type: "text",   placeholder: "e.g. July 1, 2022" },
  ],
  "Disability Insurance Denied": [
    { key: "disabilityPlanType",          label: "Plan Type",                              type: "select", options: ["Employer group plan (ERISA-governed)","Individual policy"] },
    { key: "disabilityDuration",          label: "Short-Term or Long-Term",                type: "select", options: ["Short-term disability (STD)","Long-term disability (LTD)"] },
    { key: "disabilityDenialReason",      label: "Reason for Denial",                      type: "select", options: ["Does not meet definition of disability","Pre-existing condition","Insufficient documentation","Independent medical exam (IME) dispute","Other"] },
    { key: "disabilityBenefitsReceived",  label: "Benefits Received Before Denial (if any)", type: "text",   placeholder: "e.g. 6 months, or none" },
  ],
  "Long-Term Care Denied": [
    { key: "ltcDenialReason",    label: "Reason for Denial",              type: "select",   options: ["Benefit trigger not met","Insufficient ADL limitations","Care setting not covered","Documentation dispute","Other"] },
    { key: "ltcAdls",            label: "ADLs the Insured Cannot Perform", type: "textarea", rows: 2, placeholder: "e.g. Bathing, dressing, and toileting without substantial assistance (ADLs: bathing, dressing, eating, toileting, transferring, continence)" },
    { key: "ltcCurrentSetting",  label: "Current Care Setting",            type: "select",   options: ["Home care","Assisted living","Nursing facility","Adult day care","Other"] },
  ],
  "Home / Auto / Renters Claim": [
    { key: "propertyPolicyType",     label: "Policy Type",        type: "select", options: ["Homeowners","Auto","Renters","Condo","Landlord / rental property"] },
    { key: "propertyDisputeType",    label: "Type of Dispute",    type: "select", options: ["Claim denial","Underpayment","Depreciation dispute","Coverage exclusion","Delay in adjustment"] },
    { key: "propertyCauseOfLoss",    label: "Cause of Loss",      type: "select", options: ["Storm / wind","Fire","Water (not flood)","Flood","Theft","Vandalism","Auto collision","Auto comprehensive","Other"] },
    { key: "propertyAmountOffered",  label: "Amount Insurer Offered", type: "text", placeholder: "e.g. $3,200" },
    { key: "propertyAmountClaimed",  label: "Amount You Are Claiming", type: "text", placeholder: "e.g. $12,800" },
  ],
  "Surprise Medical Bill": [
    { key: "surpriseBillType",         label: "Bill Type",                        type: "select", options: ["Out-of-network provider at in-network facility","Air ambulance","Emergency care at out-of-network facility","Anesthesia or pathology ancillary to in-network procedure","Other"] },
    { key: "surpriseBilledAmount",     label: "Amount Billed",                    type: "text",   placeholder: "e.g. $4,800" },
    { key: "surpriseInNetworkRate",    label: "In-Network Rate (if known)",       type: "text",   placeholder: "e.g. $850" },
    { key: "surpriseInsurerContacted", label: "Have You Contacted the Insurer?",  type: "select", options: ["Yes","No","Insurer declined to help"] },
  ],
};

function buildClaimFields(baseFields, claimType) {
  const cond = conditionalFields[claimType];
  if (!cond) return baseFields;
  const idx = baseFields.findIndex(f => f.key === "claimType");
  if (idx === -1) return [...baseFields, ...cond];
  return [...baseFields.slice(0, idx + 1), ...cond, ...baseFields.slice(idx + 1)];
}

const inputStyle = (focused) => ({
  width: "100%",
  padding: "13px 16px",
  background: colors.white,
  border: `1px solid ${focused ? colors.goldLight : colors.border}`,
  borderRadius: "8px",
  color: colors.ink,
  fontSize: "15px",
  fontFamily: APP.font,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
});

const btnStyle = (active) => ({
  background: active ? `linear-gradient(135deg, ${colors.goldLight}, ${colors.gold})` : colors.paperDark,
  border: "none",
  color: active ? "#fff" : colors.inkFaint,
  padding: "13px 28px",
  borderRadius: "6px",
  cursor: active ? "pointer" : "default",
  fontSize: "15px",
  fontWeight: active ? "700" : "400",
  fontFamily: APP.font,
  transition: "all 0.2s",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  boxShadow: active ? `0 2px 12px ${colors.goldLight}55` : "none",
});

function Field({ field, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "4px" }}>
      <label style={{ display: "block", marginBottom: "7px", fontSize: "13px", color: colors.inkMuted }}>
        {field.label}
        {field.required && <span style={{ color: colors.goldLight, marginLeft: "4px" }}>*</span>}
      </label>
      {field.type === "select" ? (
        <select
          value={value || ""}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...inputStyle(focused), cursor: "pointer" }}
        >
          <option value="">Select...</option>
          {field.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...inputStyle(focused), resize: "vertical", lineHeight: "1.7", minHeight: "112px" }}
        />
      ) : (
        <input
          type="text"
          value={value || ""}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyle(focused)}
        />
      )}
    </div>
  );
}

function Spinner() {
  return (
    <span style={{
      width: "16px", height: "16px",
      border: "2px solid rgba(255,255,255,0.3)",
      borderTopColor: "#fff",
      borderRadius: "50%",
      display: "inline-block",
      animation: "spin 0.8s linear infinite"
    }} />
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [accessCode, setAccessCode] = useState("");
  const [codeValid, setCodeValid] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [letter, setLetter] = useState("");
  const [altLetter, setAltLetter] = useState("");
  const [activeTab, setActiveTab] = useState("standard");
  const [checklist, setChecklist] = useState([]);
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      setAccessCode(code.toUpperCase());
      verifyCode(code.toUpperCase(), true);
    }
  }, []);

  useEffect(() => {
    try { const s = sessionStorage.getItem("cf_form"); if (s) setFormData(JSON.parse(s)); } catch {}
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem("cf_form", JSON.stringify(formData)); } catch {}
  }, [formData]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get("state");
    const disputeParam = params.get("dispute");
    const slugToStateName = {
      "california": "California", "texas": "Texas", "florida": "Florida",
      "new-york": "New York", "illinois": "Illinois", "pennsylvania": "Pennsylvania",
      "ohio": "Ohio", "georgia": "Georgia", "north-carolina": "North Carolina", "arizona": "Arizona"
    };
    const slugToClaimType = {
      "denied-homeowners-insurance-claim": "Homeowners — Property Damage Denial",
      "underpaid-property-damage-claim": "Homeowners — Underpaid Claim",
      "hurricane-storm-damage-dispute": "Homeowners — Property Damage Denial",
      "water-damage-claim-denial": "Homeowners — Property Damage Denial",
      "fire-damage-claim-underpayment": "Homeowners — Underpaid Claim",
      "auto-insurance-claim-denial": "Auto Insurance Denial",
      "health-insurance-claim-appeal": "Health Insurance — Medical Necessity Denial",
      "roof-damage-claim-dispute": "Homeowners — Property Damage Denial",
      "bad-faith-insurance-letter": "Other",
      "business-interruption-claim-dispute": "Other"
    };
    const updates = {};
    if (stateParam && slugToStateName[stateParam]) updates.state = slugToStateName[stateParam];
    if (disputeParam && slugToClaimType[disputeParam]) updates.claimType = slugToClaimType[disputeParam];
    if (Object.keys(updates).length) setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const isStepValid = (stepName) => {
    return (requiredFields[stepName] || []).every(k => formData[k] && formData[k].trim());
  };

  const verifyCode = async (code, silent = false) => {
    if (!code || !code.trim()) { setCodeError("Please enter your access code."); return; }
    setCodeError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode: code, systemPrompt: "Reply: VALID", userPrompt: "check" }),
      });
      if (res.status === 401) {
        if (!silent) setCodeError("Invalid access code. Check your Payhip receipt email.");
        setCodeValid(false);
      } else {
        setCodeValid(true);
        if (!silent) setStep(1);
      }
    } catch {
      if (!silent) setCodeError("Could not verify. Check your connection.");
    }
  };

  const callAPI = async (systemPrompt, userPrompt, reviewMode, draftLetter) => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessCode, systemPrompt, userPrompt, reviewMode: !!reviewMode, draftLetter: draftLetter || "" }),
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Generation failed"); }
    return (await res.json()).text;
  };

  const systemPrompt = `You are an expert insurance appeal attorney. Write compelling, legally precise appeal letters that maximize the chance of claim approval.

Rules:
- Open with clear statement of what was denied, policy number, and claim number
- Cite the specific denial reason and rebut it point by point
- Reference ACA internal appeal rights, ERISA, or state bad faith statutes as applicable
- Invoke the right to external independent review
- Set a firm response deadline
- Professional, factual tone
- 500-700 words
- Format: formal letter with [DATE] placeholder, via certified mail
- For medical bill disputes: cite the No Surprises Act (effective Jan 1, 2022), state balance billing laws, and the patient's right to an itemized bill within 30 days. Demand removal of improper charges or correction of billing errors.
- For collections disputes: cite FDCPA validation rights and demand proof of debt before any payment.
- Output ONLY the letter, no preamble`;

  const lifeSystemPrompt = `You are an expert insurance appeal attorney specializing in life insurance claim denials. Write compelling, legally precise demand letters to reverse denials of death benefit claims.

Rules:
- Open with clear statement of the policy, insured's name, date of death, policy number, and denied claim amount
- Identify the insurer's stated denial reason and rebut it point by point
- If the denial is based on misrepresentation: cite the state's contestability period statute and incontestability clause — if the policy has been in force beyond the contestability period (typically 2 years), material misrepresentation cannot void the policy
- If the denial is based on an exclusion clause: require the insurer to cite the specific policy language and prove the exclusion applies; exclusions are construed narrowly against the insurer
- If the denial is based on a lapsed policy: cite the state's grace period and reinstatement provisions, and any required notice-of-lapse statutes
- If beneficiary dispute: demand interpleader or deposit of proceeds with the court pending resolution
- Cite the insurer's duty of good faith and fair dealing under the state's common law and insurance code
- Invoke state insurance department complaint rights
- Set a firm 30-day response deadline
- Professional, factual tone
- 500-700 words
- Format: formal letter with [DATE] placeholder, via certified mail
- Output ONLY the letter, no preamble`;

  const disabilitySystemPrompt = `You are an expert insurance appeal attorney specializing in disability insurance denials, including ERISA-governed group plans and individual policies. Write compelling, legally precise appeal letters.

Rules:
- Open with clear statement of the claimant, policy or plan, disability onset date, and denial details
- Identify whether the plan is ERISA-governed (employer-sponsored group plan) or an individual policy, and tailor the legal authority accordingly
- For ERISA plans: cite ERISA Section 503 (29 U.S.C. § 1133) and the claims regulation 29 CFR § 2560.503-1; demand a full and fair review, the complete administrative record (entire claim file, all reviewer reports, consultants' opinions), and note the applicable appeal deadline (180 days for health and disability claims under 29 CFR §2560.503-1(h); 60 days for other ERISA welfare or pension claims)
- For individual policies: cite the state's insurance code, unfair claims settlement practices act, and common-law bad faith
- Rebut the specific denial reason:
  * If "does not meet definition of disability": quote the policy or plan definition verbatim and apply it to the claimant's documented limitations and treating physician's opinions
  * If "insufficient documentation": demand a specific list of what is missing and an extension to supply it
  * If based on an independent medical exam (IME): demand all IME records, the examiner's credentials, questions posed, and the right to submit a treating-physician rebuttal
  * If "pre-existing condition": cite the policy's pre-existing condition look-back period and any HIPAA or ERISA portability protections
- Reference the treating physician's opinion and the deference it is typically owed
- Set a firm 45-day response deadline for ERISA plans, 30 days for individual policies
- Professional, factual tone
- 500-700 words
- Format: formal letter with [DATE] placeholder, via certified mail
- Output ONLY the letter, no preamble`;

  const ltcSystemPrompt = `You are an expert insurance appeal attorney specializing in long-term care (LTC) insurance denials. Write compelling, legally precise appeal letters.

Rules:
- Open with clear statement of the insured, policy number, current care setting, and denial details
- If denial is based on "benefit trigger not met": quote the policy's own benefit trigger definition and apply it to the insured's documented functional limitations — typically inability to perform 2 or more Activities of Daily Living (bathing, dressing, eating, toileting, transferring, continence) without substantial assistance, or severe cognitive impairment requiring substantial supervision
- If denial is based on "care setting not covered": cite the specific policy language on covered settings (home care, assisted living, nursing facility, adult day care) and demand identification of the exclusion clause
- If denial is based on "insufficient documentation": demand a specific list of what is missing
- Cite the state's long-term care insurance regulations — most states adopt the NAIC Long-Term Care Insurance Model Act and Model Regulation; reference these when applicable
- Cite the insured's right to an independent assessment by a qualified professional when the insurer's determination conflicts with the treating physician's
- Cite the insurer's duty of good faith and fair dealing
- Invoke state insurance department complaint rights
- Set a firm 30-day response deadline
- Professional, factual tone
- 500-700 words
- Format: formal letter with [DATE] placeholder, via certified mail
- Output ONLY the letter, no preamble`;

  const propertyCasualtySystemPrompt = `You are an expert insurance appeal attorney specializing in property and casualty insurance claims (homeowners, auto, renters). Write compelling, legally precise demand letters for denied or underpaid claims.

Rules:
- Open with clear statement of the policy type, policy number, claim number, date of loss, and the dispute
- Identify the denial or underpayment reason and rebut it point by point
- Cite the state's unfair claims settlement practices act — most states have statutory requirements for timely investigation, prompt good-faith settlement, and written explanation of denial
- Cite the insurer's contractual duty to investigate thoroughly and pay covered losses
- For underpayment disputes: invoke the policy's appraisal clause — if the insured and insurer disagree on the amount of loss, either party may demand appraisal; identify your independent appraiser and demand the insurer name theirs
- For coverage denials based on exclusion: require the insurer to cite the specific exclusion language and prove it applies; exclusions are construed narrowly against the insurer, and the burden of proof is on the insurer
- For depreciation disputes: demand an itemized depreciation calculation and cite the policy's replacement cost provisions
- If applicable, cite the state's bad faith statute (first-party or common-law bad faith), preserving claims for consequential damages and attorney's fees
- Invoke state insurance department complaint rights
- Set a firm 30-day response deadline
- Professional, factual tone
- 500-700 words
- Format: formal letter with [DATE] placeholder, via certified mail
- Output ONLY the letter, no preamble`;

  const surpriseBillPrompt = `You are an expert insurance appeal attorney specializing in surprise medical bills and balance billing disputes. Write compelling, legally precise demand letters.

Rules:
- Open with clear statement of the provider, facility, date of service, amount billed, and the applicable in-network cost-sharing rate when known
- Cite the federal No Surprises Act (effective January 1, 2022) codified at 42 U.S.C. §§ 300gg-111 through 300gg-139, with implementing regulations at 45 CFR Parts 147 and 149 and Department of Labor regulations at 29 CFR § 2590.716-4 through 716-8
- Identify which NSA protection applies:
  * Out-of-network provider at an in-network facility, non-emergency services (45 CFR § 149.120)
  * Air ambulance services (45 CFR § 149.130)
  * Emergency services at an out-of-network facility (45 CFR § 149.110)
- Reference the patient's right to be billed no more than the in-network cost-sharing amount for protected services, and the statutory prohibition on balance billing
- Note that the provider's recourse for any additional payment is the Federal Independent Dispute Resolution (IDR) process between the provider and insurer — not the patient
- Cite any applicable state surprise billing law (e.g., California AB 72; New York Financial Services Law § 606; Texas SB 1264); many state laws provide stronger protections
- Demand: immediate cessation of collection efforts, correction of the bill to reflect only the in-network cost-sharing amount, refund of any overpayment, and retraction of any credit reporting
- Warn of remedies: complaint to the federal No Surprises Help Desk (1-800-985-3059), complaint to CMS, complaint to the state insurance department or attorney general, and private rights of action where state law provides
- Set a firm 30-day response deadline
- Professional, factual tone
- 500-700 words
- Format: formal letter with [DATE] placeholder, via certified mail
- Output ONLY the letter, no preamble`;

  const pickSystemPrompt = (claimType) => {
    if (!claimType) return systemPrompt;
    // Directive's coarse options
    if (claimType === "Life Insurance Claim Denied") return lifeSystemPrompt;
    if (claimType === "Disability Insurance Denied") return disabilitySystemPrompt;
    if (claimType === "Long-Term Care Denied") return ltcSystemPrompt;
    if (claimType === "Home / Auto / Renters Claim") return propertyCasualtySystemPrompt;
    if (claimType === "Surprise Medical Bill") return surpriseBillPrompt;
    if (claimType === "Health Insurance Denial") return systemPrompt;
    if (claimType === "Medical Bill Dispute") return systemPrompt;
    // Legacy fine-grained labels (session continuity)
    if (claimType.startsWith("Life Insurance")) return lifeSystemPrompt;
    if (claimType.startsWith("Disability")) return disabilitySystemPrompt;
    if (claimType.startsWith("Long-Term Care")) return ltcSystemPrompt;
    if (claimType.startsWith("Medical Bill — Surprise")) return surpriseBillPrompt;
    if (claimType.startsWith("Homeowners") || claimType.startsWith("Renters") || claimType.startsWith("Auto Insurance")) return propertyCasualtySystemPrompt;
    return systemPrompt;
  };

  const buildPrompt = (tone) => {
    const base = `
POLICYHOLDER: ${formData.ownerName}
STATE: ${formData.state}
POLICY NUMBER: ${formData.policyNumber || "not provided"}
INSURER: ${formData.insurerName}
CLAIM NUMBER: ${formData.claimNumber || "not provided"}
CLAIM TYPE: ${formData.claimType}
BILL AMOUNT DISPUTED: ${formData.billAmount || "not specified"}
DENIAL DATE: ${formData.denialDate || "not provided"}
WHAT WAS DENIED: ${formData.whatDenied}
WHY DENIAL IS WRONG: ${formData.whyWrong}
EVIDENCE: ${formData.evidence || "none provided"}
AMOUNT AT STAKE: ${formData.amountDisputed || "not specified"}
DEMAND: ${formData.demand}
RESPONSE DEADLINE: ${formData.deadline || "30 days"}
NEXT STEPS IF IGNORED: ${formData.nextSteps || "all available remedies"}
ADDITIONAL INFO: ${formData.additionalInfo || "none"}`;

    const cond = (conditionalFields[formData.claimType] || [])
      .filter(f => formData[f.key]?.toString().trim())
      .map(f => `${f.label.toUpperCase()}: ${formData[f.key]}`)
      .join("\n");
    const fullBase = cond ? `${base}\n\nTYPE-SPECIFIC DETAILS:\n${cond}` : base;

    if (tone === "assertive") {
      return `Write a MORE ASSERTIVE appeal letter. Stronger language, explicit bad faith references, more forceful demands. Different wording from standard:\n${fullBase}`;
    }
    return `Write a STANDARD PROFESSIONAL appeal letter:\n${fullBase}`;
  };

  const generateLetter = async () => {
    setLoading(true);
    setError("");
    setLetter("");
    setAltLetter("");
    setChecklist([]);
    try {
      const effectivePrompt = pickSystemPrompt(formData.claimType);
      setLoadingMsg("Drafting your appeal letter...");
      const draft = await callAPI(effectivePrompt, buildPrompt("standard"), false, "");
      setLoadingMsg("Running quality review...");
      const reviewed = await callAPI("", "", true, draft);
      setLetter(reviewed);
      setLoadingMsg("Generating assertive version...");
      const alt = await callAPI(effectivePrompt, buildPrompt("assertive"), false, "");
      setAltLetter(alt);
      setLoadingMsg("Building checklist...");
      try {
        const clRes = await fetch("/api/checklist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessCode,
            address: formData.insurerName,
            state: formData.state,
            varianceType: "insurance appeal",
            letterExcerpt: reviewed.substring(0, 300),
          }),
        });
        if (clRes.ok) {
          const d = await clRes.json();
          setChecklist(d.checklist || []);
        }
      } catch {}
      setStep(STEPS.indexOf("Letter"));
      setRetryCount(0);
    } catch (e) {
      const n = retryCount + 1;
      setRetryCount(n);
      setError(`Generation failed: ${e.message}. Please try again.`);
    }
    setLoading(false);
    setLoadingMsg("");
  };

  const sendEmail = async () => {
    if (!email || !email.includes("@")) return;
    setEmailSending(true);
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: email,
        to_name: formData.ownerName,
        insurer: formData.insurerName,
        letter_standard: letter,
        letter_assertive: altLetter,
        from_name: APP.name,
        reply_to: APP.support,
      }, EMAILJS_PUBLIC_KEY);
      setEmailSent(true);
    } catch {
      setError("Email send failed. Please copy the letter manually.");
    }
    setEmailSending(false);
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadPDF = (text) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 72;
    const usableWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const lineHeight = 14;
    doc.setFont("Times", "normal");
    doc.setFontSize(11);
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const fullText = text.replace(/\[DATE\]/g, today);
    const lines = doc.splitTextToSize(fullText, usableWidth);
    let y = margin;
    lines.forEach(line => {
      if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
    doc.save("ClaimFighter-appeal-letter.pdf");
  };

  const reset = () => {
    setStep(codeValid ? 1 : 0);
    setFormData({});
    setLetter("");
    setAltLetter("");
    setError("");
    setEmailSent(false);
    setChecklist([]);
    setRetryCount(0);
    try { sessionStorage.removeItem("cf_form"); } catch {}
  };

  const currentStep = STEPS[step];

  return (
    <div style={{ minHeight: "100vh", background: colors.paper, fontFamily: APP.font, color: colors.ink }}>

      {/* NAV */}
      <div style={{ background: colors.white, borderBottom: `1px solid ${colors.border}`, padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "34px", height: "34px", background: `linear-gradient(135deg, ${colors.goldLight}, ${colors.gold})`, borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
            {APP.icon}
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "700", fontFamily: APP.displayFont, color: colors.ink }}>{APP.name}</div>
            <div style={{ fontSize: "10px", color: colors.inkFaint, letterSpacing: "0.1em", textTransform: "uppercase" }}>{APP.tagline}</div>
          </div>
        </div>
        {letter && (
          <button onClick={reset} style={{ background: "transparent", border: `1px solid ${colors.border}`, color: colors.inkMuted, padding: "7px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontFamily: APP.font }}>
            ← New Letter
          </button>
        )}
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* INTRO / ACCESS GATE */}
        {currentStep === "Intro" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "13px", color: colors.goldLight, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
              {APP.icon} {APP.name}
            </div>
            <h1 style={{ fontFamily: APP.displayFont, fontSize: "clamp(28px,5vw,44px)", color: colors.ink, marginBottom: "16px", fontWeight: "900" }}>
              They Denied Your Claim. Fight Back.
            </h1>
            <p style={{ fontSize: "17px", color: colors.inkMuted, maxWidth: "480px", margin: "0 auto 40px", lineHeight: "1.7" }}>
              AI-generated appeal letters for insurance denials of all types — health, medical bills, life, disability, long-term care, and property. Attorney-quality. 5 minutes. $19.
            </p>
            <div style={{ maxWidth: "400px", margin: "0 auto", background: colors.white, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "32px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
              <div style={{ fontSize: "14px", color: colors.inkLight, marginBottom: "16px", fontWeight: "600" }}>Enter Your Access Code</div>
              <input
                type="text"
                value={accessCode}
                onChange={e => { setAccessCode(e.target.value.toUpperCase()); setCodeError(""); }}
                placeholder="e.g. CF-ABC123"
                style={{ ...inputStyle(false), textAlign: "center", fontSize: "18px", letterSpacing: "0.1em", marginBottom: "12px", fontWeight: "600" }}
              />
              {codeError && <div style={{ color: colors.errorText, fontSize: "13px", marginBottom: "12px" }}>{codeError}</div>}
              <button onClick={() => verifyCode(accessCode)} style={{ ...btnStyle(!!accessCode.trim()), width: "100%", justifyContent: "center", padding: "14px" }}>
                Unlock My Letter →
              </button>
              <div style={{ marginTop: "16px", fontSize: "12px", color: colors.inkFaint }}>
                Don't have a code?{" "}
                <a href={APP.payhip} style={{ color: colors.goldLight, textDecoration: "none" }}>Purchase for {APP.price} →</a>
              </div>
            </div>
          </div>
        )}

        {/* FORM STEPS */}
        {FORM_STEPS.includes(currentStep) && (
          <div>
            {/* Progress bar */}
            <div style={{ marginBottom: "36px" }}>
              <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
                {FORM_STEPS.map((s, i) => {
                  const idx = FORM_STEPS.indexOf(currentStep);
                  return (
                    <div key={s} style={{ flex: 1, height: "3px", borderRadius: "2px", background: i < idx ? colors.goldLight : i === idx ? colors.gold : colors.borderLight, transition: "background 0.3s" }} />
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {FORM_STEPS.map((s, i) => {
                  const idx = FORM_STEPS.indexOf(currentStep);
                  return (
                    <div key={s} style={{ fontSize: "10px", color: i <= idx ? colors.goldLight : colors.borderLight, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                      {s}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step title */}
            <div style={{ marginBottom: "28px" }}>
              <h2 style={{ fontFamily: APP.displayFont, fontSize: "26px", color: colors.ink, marginBottom: "6px", fontWeight: "700" }}>
                {currentStep === "Policyholder" && "About You"}
                {currentStep === "Property" && "Your Policy & Insurer"}
                {currentStep === "Claim" && "The Claim"}
                {currentStep === "Demand" && "Your Demand"}
              </h2>
              <p style={{ fontSize: "14px", color: colors.inkMuted, lineHeight: "1.6" }}>
                {currentStep === "Policyholder" && "Your contact information and policy details."}
                {currentStep === "Property" && "The insurance company and type of claim."}
                {currentStep === "Claim" && "What was denied and why they're wrong."}
                {currentStep === "Demand" && "What you want and what you'll do next."}
              </p>
            </div>

            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {(currentStep === "Property" ? buildClaimFields(stepFields.Property, formData.claimType) : (stepFields[currentStep] || [])).map(f => (
                <Field key={f.key} field={f} value={formData[f.key]} onChange={v => handleChange(f.key, v)} />
              ))}
            </div>

            {/* Nav buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "36px" }}>
              <button onClick={() => setStep(s => s - 1)} style={{ ...btnStyle(true), background: "transparent", border: `1px solid ${colors.border}`, color: colors.inkMuted, boxShadow: "none" }}>
                ← Back
              </button>
              <button onClick={() => setStep(s => s + 1)} disabled={!isStepValid(currentStep)} style={btnStyle(isStepValid(currentStep))}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* GENERATE */}
        {currentStep === "Generate" && (
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontFamily: APP.displayFont, fontSize: "30px", color: colors.ink, marginBottom: "12px" }}>Ready to Generate</h2>
            <p style={{ fontSize: "16px", color: colors.inkMuted, maxWidth: "480px", margin: "0 auto 36px", lineHeight: "1.7" }}>
              Enter your email to receive a copy, then click Generate. Two-pass AI quality review — about 20-30 seconds.
            </p>
            <div style={{ maxWidth: "420px", margin: "0 auto" }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ ...inputStyle(false), textAlign: "center", marginBottom: "16px", fontSize: "15px" }}
              />
              <button onClick={generateLetter} disabled={loading} style={{ ...btnStyle(!loading), width: "100%", justifyContent: "center", padding: "16px", fontSize: "17px" }}>
                {loading ? <><Spinner /> {loadingMsg || "Generating..."}</> : "Generate My Letter ✦"}
              </button>
              {error && (
                <div style={{ marginTop: "16px", padding: "13px 16px", background: colors.errorBg, border: `1px solid ${colors.errorBorder}`, borderRadius: "8px", color: colors.errorText, fontSize: "13px" }}>
                  {error}
                  <button onClick={generateLetter} style={{ marginLeft: "12px", background: "transparent", border: "none", color: colors.goldLight, cursor: "pointer", fontSize: "13px" }}>Try again →</button>
                </div>
              )}
              <div style={{ marginTop: "14px", fontSize: "12px", color: colors.inkFaint }}>Two-pass AI review · Standard + Assertive versions · Checklist included</div>
            </div>
            <button onClick={() => setStep(s => s - 1)} style={{ marginTop: "28px", background: "transparent", border: "none", color: colors.inkFaint, cursor: "pointer", fontSize: "13px", fontFamily: APP.font }}>
              ← Edit my answers
            </button>
          </div>
        )}

        {/* LETTER OUTPUT */}
        {currentStep === "Letter" && letter && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
              <div>
                <div style={{ fontFamily: APP.displayFont, fontSize: "24px", color: colors.gold, marginBottom: "4px" }}>Your Letter is Ready</div>
                <div style={{ fontSize: "13px", color: colors.inkFaint }}>Two-pass AI reviewed · Two versions · Checklist included</div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => copyText(activeTab === "standard" ? letter : altLetter)} style={btnStyle(true)}>
                  {copied ? "✓ Copied!" : "Copy Letter"}
                </button>
                <button onClick={() => downloadPDF(activeTab === "standard" ? letter : altLetter)} style={{ ...btnStyle(true), background: "transparent", border: `1px solid ${colors.goldLight}`, color: colors.goldLight }}>
                  ⬇ PDF
                </button>
              </div>
            </div>

            {altLetter && (
              <div style={{ display: "flex", gap: "2px", background: colors.paperDark, padding: "4px", borderRadius: "8px", marginBottom: "6px" }}>
                {[["standard", "Standard / Professional"], ["assertive", "Assertive / Detailed"]].map(([key, label]) => (
                  <button key={key} onClick={() => setActiveTab(key)} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "none", cursor: "pointer", fontFamily: APP.font, fontSize: "13px", transition: "all 0.2s", background: activeTab === key ? `linear-gradient(135deg, ${colors.goldLight}, ${colors.gold})` : "transparent", color: activeTab === key ? "#fff" : colors.inkMuted, fontWeight: activeTab === key ? "600" : "400" }}>
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div style={{ fontSize: "12px", color: colors.inkFaint, marginBottom: "16px" }}>
              {activeTab === "standard" ? "Measured, professional tone. Good for first appeal." : "Stronger framing. Better when initial request was ignored."}
            </div>

            <div style={{ background: colors.white, border: `1px solid ${colors.border}`, borderRadius: "10px", padding: "40px 48px", lineHeight: "1.9", fontSize: "14px", color: colors.inkLight, whiteSpace: "pre-wrap", fontFamily: APP.font, boxShadow: "0 4px 32px rgba(0,0,0,0.08)", marginBottom: "24px" }}>
              {activeTab === "standard" ? letter : altLetter}
            </div>

            {email && !emailSent && (
              <div style={{ background: colors.paperWarm, border: `1px solid ${colors.border}`, borderRadius: "8px", padding: "18px 22px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                <div style={{ fontSize: "14px", color: colors.inkLight }}>Send a copy to <strong>{email}</strong></div>
                <button onClick={sendEmail} disabled={emailSending} style={{ ...btnStyle(!emailSending), padding: "9px 20px", fontSize: "13px" }}>
                  {emailSending ? <><Spinner /> Sending...</> : "Send Copy →"}
                </button>
              </div>
            )}

            {emailSent && (
              <div style={{ background: "#e8f5e8", border: "1px solid #b0d8b0", borderRadius: "8px", padding: "14px 20px", marginBottom: "20px", fontSize: "14px", color: colors.green }}>
                ✓ Letter emailed to {email}
              </div>
            )}

            {checklist.length > 0 && (
              <div style={{ background: colors.white, border: `1px solid ${colors.border}`, borderRadius: "10px", padding: "24px 28px", marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", color: colors.goldLight, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Next Steps Checklist</div>
                {checklist.map((item, i) => (
                  <label key={i} style={{ display: "flex", gap: "12px", marginBottom: "10px", cursor: "pointer", alignItems: "flex-start" }}>
                    <input type="checkbox" style={{ marginTop: "3px", accentColor: colors.goldLight }} />
                    <span style={{ fontSize: "14px", color: colors.inkLight, lineHeight: "1.5" }}>{item}</span>
                  </label>
                ))}
              </div>
            )}

            <div style={{ background: "#fdf8ff", border: "1px solid #d8c8e8", borderRadius: "10px", padding: "20px 24px", marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "14px" }}>
                <span style={{ fontSize: "22px" }}>💡</span>
                <div>
                  <div style={{ fontSize: "13px", color: "#7050a0", fontWeight: "600", marginBottom: "6px" }}>Consider a public adjuster for large claims.</div>
                  <div style={{ fontSize: "12px", color: "#9070b0", lineHeight: "1.6" }}>
                    Public adjusters work on contingency and specialize in maximizing claim payouts. For claims over $10,000, they often recover significantly more.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: "14px 18px", background: colors.paperWarm, borderRadius: "8px", border: `1px solid ${colors.borderLight}`, fontSize: "11px", color: colors.inkFaint, lineHeight: "1.7" }}>
              <strong>Legal Disclaimer:</strong> This letter is AI-generated and does not constitute legal advice. Review all content for accuracy before sending. For complex matters, consult a licensed attorney.
            </div>

            <div style={{ marginTop: "24px", textAlign: "center", padding: "20px", background: colors.white, borderRadius: "10px", border: `1px solid ${colors.borderLight}` }}>
              <div style={{ fontSize: "14px", color: colors.inkMuted, marginBottom: "6px" }}>Did your claim get approved?</div>
              <div style={{ fontSize: "12px", color: colors.inkFaint }}>Share your outcome → <span style={{ color: colors.goldLight }}>results@claimfighter.com</span></div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        body { margin: 0; }
        @media print { button { display: none !important; } body { background: #fff; } }
      `}</style>

      <footer style={{ textAlign: "center", padding: "16px", fontSize: "0.72rem", color: "#888", borderTop: "1px solid #e5e0d6", marginTop: "40px" }}>
        ClaimFighter v1.1 · © 2026 The Super Simple Software Company · support@buyappsonce.com
      </footer>
    </div>
  );
}
