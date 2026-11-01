// National (all-state) guide pages. Every citation here is logged in
// VERIFICATION_LOG-SEO-CONTENT.md ("National pages" section); pending.js withholds
// any sentence whose citation is not logged, same as every other page.
export const NATIONAL_PAGES = [
  {
    slug: 'health-insurance-denial-appeal-deadlines',
    metaTitle: 'Health Insurance Denial Appeal Deadlines | ClaimFighter',
    metaDescription: 'How long you have to appeal a denied health claim: 180 days to appeal, 72-hour urgent reviews, 4 months for external review. Appeal letter, $19.',
    h1: 'Health Insurance Denial Appeal Deadlines',
    intro: [
      'When a health plan denies a claim, the clock starts on the date you receive the denial notice. Federal rules set minimum timelines for the plan and for you: how long you have to appeal, how quickly the plan must answer, and how long you have to ask for an independent external review. This page summarizes those federal minimums for private health plans. State law can add protections for insured (non-self-funded) plans, and Medicare and Medicaid have their own appeal rules that are not covered here.',
      'Your denial letter and plan documents control the exact dates that apply to you. Check them first, and write down the date you received the denial.'
    ],
    table: {
      caption: 'Federal minimum timelines for a denied health claim',
      head: ['Step', 'Timeline', 'Source'],
      rows: [
        ['File your internal appeal', 'The plan must give you at least 180 days after you receive the denial notice', '29 CFR § 2560.503-1(h)(3)(i)'],
        ['Plan decides an urgent-care claim', 'As soon as possible, and no later than 72 hours after it receives the claim', '29 CFR § 2560.503-1(f)(2)(i)'],
        ['Plan decides a pre-service claim (before you get care)', 'Within 15 days, with one extension of up to 15 days for reasons outside the plan’s control', '29 CFR § 2560.503-1(f)(2)(iii)'],
        ['Plan decides a post-service claim (after you got care)', 'Within 30 days, with one extension of up to 15 days for reasons outside the plan’s control', '29 CFR § 2560.503-1(f)(2)(iii)'],
        ['Plan decides your appeal: urgent care', 'No later than 72 hours after it receives your appeal', '29 CFR § 2560.503-1(i)(2)(i)'],
        ['Plan decides your appeal: pre-service', 'No later than 30 days after it receives your appeal, for a plan with one level of appeal', '29 CFR § 2560.503-1(i)(2)(ii)'],
        ['Plan decides your appeal: post-service', 'No later than 60 days after it receives your appeal, for a plan with one level of appeal', '29 CFR § 2560.503-1(i)(2)(iii)'],
        ['Request external review', 'Within 4 months after you receive the denial or final internal denial notice', '45 CFR § 147.136(d)'],
        ['Independent reviewer (IRO) decides', 'Within 45 days after the IRO receives the request for standard external review', '45 CFR § 147.136(d)'],
        ['Expedited external review', 'As expeditiously as possible, and no more than 72 hours after the IRO receives the request', '45 CFR § 147.136(d)']
      ]
    },
    sections: [
      {
        h2: 'Which rules apply to your plan',
        p: [
          'The Affordable Care Act regulation at 45 CFR § 147.136 requires group health plans and insurers offering group or individual coverage to run an effective internal claims and appeals process and to provide external review (§ 147.136(b)). For group plans, that internal process builds on the Department of Labor claims regulation for ERISA plans at 29 CFR § 2560.503-1, which is where the 180-day and decision-deadline rules in the table come from.',
          'Grandfathered plans are generally outside most of § 147.136, but the external review requirements still apply to them for disputes over certain out-of-network emergency services, nonemergency services by out-of-network providers at in-network facilities, and air ambulance services (§ 147.136(a)(1)(ii)).',
          'ERISA plans (most job-based coverage) and insured plans can be reviewed differently on the external-review step. Where a state external review process meets the federal minimum standards, the state process applies; a plan or insurer not subject to one must provide the federal process (§ 147.136(c) and (d)).'
        ]
      },
      {
        h2: 'Internal appeal first',
        p: [
          'Start with the internal appeal. Under the ERISA claims rule, the plan must give you at least 180 days after the denial notice to appeal, a review that does not defer to the original decision, and the chance to submit written comments, documents and other information (29 CFR § 2560.503-1(h)(2)(ii), (h)(3)(i) and (h)(3)(ii)).',
          'You can ask the plan for reasonable access to, and copies of, all documents, records and other information relevant to your claim, free of charge (29 CFR § 2560.503-1(h)(2)(iii)). Ask for the claim file in your first letter so you can answer the stated reason for denial point by point.',
          'If a plan does not follow the internal appeal rules, you may be deemed to have exhausted the internal process and can move to external review or other remedies (45 CFR § 147.136(b)(2)(ii)(F)).'
        ]
      },
      {
        h2: 'Then external review',
        p: [
          'If the internal appeal fails, you can ask for review by an independent review organization. Under the federal process, the request must be filed within four months after you receive the denial or the final internal denial (45 CFR § 147.136(d)). The IRO decides standard requests within 45 days of receiving them and expedited requests within 72 hours (45 CFR § 147.136(d)).',
          'Expedited external review is available when the standard time frame would seriously jeopardize your life or health or your ability to regain maximum function, and in certain emergency situations before discharge (45 CFR § 147.136(d)).'
        ]
      }
    ],
    faqs: [
      { q: 'How long do I have to appeal a health insurance denial?', a: 'Under the federal ERISA claims rule, a plan must give you at least 180 days after you receive the denial notice to file an internal appeal (29 CFR § 2560.503-1(h)(3)(i)). Your plan documents may give you longer, so check the denial letter for the exact date.' },
      { q: 'How fast must an insurer decide an urgent appeal?', a: 'No later than 72 hours after it receives your appeal for an urgent-care claim (29 CFR § 2560.503-1(i)(2)(i)).' },
      { q: 'How long do I have to request external review?', a: 'Four months after you receive the denial or final internal denial notice under the federal external review process (45 CFR § 147.136(d)). A state external review process must allow at least four months as well (45 CFR § 147.136(c)).' }
    ],
    appHref: '/app?dispute=health-insurance-claim-appeal',
    cta: 'Write my health insurance appeal letter',
    ctaNote: 'Answer a few questions and get a ready-to-send appeal letter for $19.'
  },
  {
    slug: 'how-to-fight-an-insurance-claim-denial',
    metaTitle: 'How to Fight an Insurance Claim Denial | ClaimFighter',
    metaDescription: 'A step-by-step process to fight a denied or underpaid insurance claim, plus how to structure the appeal letter. Pick your state. $19 letter.',
    h1: 'How to Fight an Insurance Claim Denial',
    intro: [
      'A denial is the insurer’s first answer, not the last word. Most denials can be challenged in writing, and a clear, well-organized letter that answers the stated reason for denial gives you the best chance of getting the claim reviewed again. This guide covers the process that works across insurance types and how to structure the letter.',
      'Deadlines and legal rights differ by state and by type of coverage, so use this page for the process and your state guide for the specific rules.'
    ],
    steps: [
      { t: 'Read the denial and note the dates', b: 'Find the exact reason the insurer gives, the policy provision it relies on, the date of the letter and the date you received it. Every deadline in your policy and under the law runs from those dates.' },
      { t: 'Get the claim file and the policy', b: 'Request a complete copy of your policy and everything the insurer relied on: adjuster notes, estimates, medical or engineering reports and correspondence. For health plans governed by ERISA, you are entitled to reasonable access to and copies of all documents relevant to your claim, free of charge (29 CFR § 2560.503-1(h)(2)(iii)).' },
      { t: 'Match the denial to the policy language', b: 'Compare the reason for denial with the actual coverage grant, exclusions and exceptions. Many denials rest on an exclusion that does not fit the facts, or on an incomplete investigation.' },
      { t: 'Gather your evidence', b: 'Collect photos, receipts, repair or contractor estimates, medical records, a doctor’s letter, expert opinions and anything showing the timeline. Evidence that directly answers the insurer’s stated reason carries the most weight.' },
      { t: 'Write the appeal or demand letter', b: 'Follow the structure below, send it by a method that proves delivery, and keep a copy of everything. Stay factual and specific.' },
      { t: 'Track the deadlines and escalate', b: 'Note the insurer’s response deadlines, follow up in writing, and use the next step if the answer is no: an internal appeal, an independent external review for health claims, a complaint to your state insurance department, appraisal for amount-of-loss disputes, or an attorney.' }
    ],
    letterH2: 'How to structure the letter',
    letterParts: [
      'Heading: your name and address, the insurer, the policy and claim numbers, the date of loss or service and the date of the denial.',
      'Purpose: one sentence saying you are appealing or disputing the denial of the specific claim.',
      'The reason for denial: quote or summarize what the insurer said, so your response is tied to it.',
      'Why it is wrong: respond point by point with the policy language and the facts, and refer to each attached document.',
      'What you want: the exact payment, repair, coverage decision or re-review you are requesting, and a reasonable response date.',
      'Records request and reservation of rights: ask for the claim file and state that you reserve all appeal and review rights.',
      'Enclosures and delivery: list your exhibits and send the letter by certified mail with return receipt or another trackable method.'
    ],
    sections: [
      {
        h2: 'Choose your state guide',
        p: [
          'State insurance law controls deadlines for insurers, interest and penalties, bad faith remedies and how to complain to your insurance regulator. Open the guide for your state:'
        ],
        stateLinks: true
      },
      {
        h2: 'Health insurance denials',
        p: [
          'Health plans have their own federal appeal timelines, including a minimum of 180 days to appeal under the ERISA claims rule (29 CFR § 2560.503-1(h)(3)(i)). See the guide to health insurance denial appeal deadlines for the full set of internal appeal and external review deadlines.'
        ],
        links: [['/health-insurance-denial-appeal-deadlines', 'Health insurance denial appeal deadlines']]
      }
    ],
    faqs: [
      { q: 'Can I appeal an insurance claim denial myself?', a: 'Yes. You can write the appeal or demand letter yourself. A clear letter that answers the stated reason for denial, attaches your evidence and asks for a specific outcome is the usual first step.' },
      { q: 'What should an insurance denial appeal letter include?', a: 'Your policy and claim numbers, the date and reason for the denial, a point-by-point response with your evidence, the specific outcome you want, a response date and a request for the claim file.' }
    ],
    appHref: '/app',
    cta: 'Write my claim denial letter',
    ctaNote: 'Choose your denial type and state, answer a few questions, and get your letter for $19.'
  }
];
