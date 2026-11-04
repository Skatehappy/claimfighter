// api/_checklist-fallbacks.js — per-claim-type checklist content, shared by api/checklist.js (Edge-safe: no imports).
// `focus` steers the model; `steps` is the static fallback used when the model list is unusable (call failed,
// cut off twice, or too few items survived the citation/figure lock). Fallback items are plain action steps only:
// no statute, regulation, case, deadline, dollar amount, percentage or day count (no digits at all), so nothing
// here needs a VERIFICATION_LOG entry. Wording stays inside each claim type.

const COMMON_START = ['Send the letter by certified mail, return receipt requested, and keep the tracking number', 'Keep a complete copy of everything you send'];
const COMMON_END = ['Write down the date you sent the letter and the date any response arrives, and log every call with the insurer', 'If the claim is still not resolved, consider a complaint to your state insurance department or a consult with an attorney'];

export const TYPES = {
  'Health Insurance Denial': {
    focus: 'a denied health insurance claim or coverage request',
    steps: ['Keep the denial letter and the explanation of benefits, and highlight the stated reason for denial', 'Ask your treating doctor for a letter explaining why the treatment or service is needed for you', 'Gather the medical records, test results and treatment notes that support the request', 'Request a copy of the full claim file and the plan documents in writing', 'Ask in writing how to request an independent external review if the appeal is denied'],
  },
  'Medical Bill Dispute': {
    focus: 'a disputed medical bill or a billing error',
    steps: ['Request an itemized bill with billing codes from the provider in writing', 'Compare the bill line by line with your explanation of benefits and note each mismatch', 'Ask your insurer to confirm what it paid, what it denied and why', 'Keep written proof that you disputed the bill before you pay any disputed amount', 'Keep every statement, collection notice and payment record in one folder'],
  },
  'Life Insurance Claim Denied': {
    focus: 'a denied life insurance death benefit claim',
    steps: ['Keep the denial letter and highlight the reason the insurer gave', 'Gather the policy, the application, premium payment records and the death certificate', 'Request the insurer\'s full claim file, including any investigation reports, in writing', 'Collect medical records or other documents that answer the reason for denial', 'Confirm the beneficiary designation on file and keep proof of your identity as beneficiary'],
  },
  'Disability Insurance Denied': {
    focus: 'a denied or terminated disability insurance claim',
    steps: ['Keep the denial letter and highlight the reason given for the denial', 'Request the complete claim file and the policy or plan documents in writing', 'Ask each treating doctor for a letter describing your limitations and how they affect your work', 'Gather medical records, job description and work history that show why you cannot work', 'Review any independent medical exam report and note each point you disagree with'],
  },
  'Long-Term Care Denied': {
    focus: 'a denied long-term care insurance claim',
    steps: ['Keep the denial letter and highlight the reason the insurer gave', 'Gather the policy and its definition of when benefits begin', 'Ask your doctor or care provider for a letter describing the help you need with daily activities', 'Collect care plans, facility or caregiver records and invoices for the care you receive', 'Request the insurer\'s full claim file and assessment notes in writing'],
  },
  'Home / Auto / Renters Claim': {
    focus: 'a denied, delayed or underpaid home, auto or renters insurance claim',
    steps: ['Photograph or video all damage, with dates visible, and keep damaged items if you can', 'Get repair estimates from licensed contractors or body shops and keep copies', 'Keep receipts for emergency repairs, temporary housing or a rental vehicle', 'Request the insurer\'s adjuster report and an explanation of how it valued the loss', 'Compare your policy declarations and exclusions with the reason the insurer gave'],
  },
  'Surprise Medical Bill': {
    focus: 'an unexpected out-of-network medical bill',
    steps: ['Keep the bill and the explanation of benefits together and note which provider billed you', 'Write down where you were treated and whether you chose the provider or were assigned one', 'Ask the provider and the insurer, in writing, to explain how the charge was calculated', 'Ask the provider to hold the account out of collections while the dispute is open', 'Ask your insurer in writing to reprocess the claim at the in-network level where appropriate'],
  },
  'Other': {
    focus: 'an insurance claim denial or dispute',
    steps: ['Keep the denial letter and highlight the reason the insurer gave', 'Gather the policy, the claim paperwork and anything that answers the stated reason', 'Request the insurer\'s full claim file in writing', 'State clearly in your letter what you want the insurer to do', 'Ask in writing about any further review or appeal options'],
  },
};

const norm = s => String(s || '').trim().toLowerCase();
export function typeInfo(claimType) {
  const k = Object.keys(TYPES).find(t => norm(t) === norm(claimType));
  return TYPES[k || 'Other'];
}
export function fallbackFor(claimType) {
  return [...COMMON_START, ...typeInfo(claimType).steps, ...COMMON_END];
}
