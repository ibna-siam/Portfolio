/**
 * caseStudyIntegrity.js
 *
 * Financial Integrity & Metadata Registry for Portfolio Case Studies.
 * Provides transparent, recruiter-facing metadata for all 8 academic studies
 * without mutating raw financial values in `src/data/portfolioData.js`.
 *
 * Status Definitions:
 * - VERIFIED: Arithmetic and supporting inputs reproduced from verified evidence.
 * - ACADEMIC_CALC: Calculation based on disclosed academic inputs without commercial claims.
 * - RECONCILIATION_REQ: A material inconsistency remains unresolved between narrative/tables/formulas.
 * - HYPOTHETICAL: Inputs or scenarios are explicitly hypothetical pedagogical models.
 * - SOURCE_LIMITATION: Claim cannot be verified because primary evidence is unavailable.
 */

export const INTEGRITY_STATUS = {
  VERIFIED: {
    key: "verified",
    label: "Verified from available evidence",
    shortLabel: "Verified",
    theme: "emerald",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
    description: "Calculations and supporting inputs have been reproduced from disclosed academic or public records.",
  },
  ACADEMIC_CALC: {
    key: "academic_calc",
    label: "Academic calculation",
    shortLabel: "Academic Calc",
    theme: "blue",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700",
    description: "Calculation derived from academic coursework inputs; not indicative of commercial client results.",
  },
  RECONCILIATION_REQ: {
    key: "reconciliation_req",
    label: "Requires reconciliation",
    shortLabel: "Review Required",
    theme: "amber",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-800 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700",
    description: "An internal inconsistency exists between narrative figures, calculation tables, or standard accounting formulas. Raw source data is preserved while under review.",
  },
  HYPOTHETICAL: {
    key: "hypothetical",
    label: "Illustrative / hypothetical",
    shortLabel: "Hypothetical Model",
    theme: "purple",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
    badge: "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700",
    description: "Simulation based entirely on hypothetical case study parameters created for coursework instruction.",
  },
  SOURCE_LIMITATION: {
    key: "source_limitation",
    label: "Source limitation",
    shortLabel: "Source Limitation",
    theme: "slate",
    bg: "bg-ink-100/70 dark:bg-ink-800/60",
    text: "text-ink-700 dark:text-ink-300",
    border: "border-ink-200 dark:border-ink-700",
    badge: "bg-ink-200/70 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-ink-300 dark:border-ink-600",
    description: "Primary underlying documentation is unavailable to independently reproduce every stated conclusion.",
  },
};

export const CASE_STUDY_METADATA = {
  // ── 1. Square Pharmaceuticals Ltd. ──────────────────────────
  1: {
    id: 1,
    group: "Applied Accounting Case Study",
    groupShort: "Accounting",
    groupId: "accounting",
    academicScope: "BBA Financial Statement Analysis Coursework · DIU",
    framework: "IFRS / BAS Financial Statement Analysis & DSE Disclosures",
    integrityStatus: INTEGRITY_STATUS.ACADEMIC_CALC,
    secondaryStatus: INTEGRITY_STATUS.SOURCE_LIMITATION,
    evidenceType: "Secondary Public Records (DSE Annual Reports FY21–FY23)",
    currencyUnit: "BDT & % Ratios",
    inputsClassification: "Secondary Public Financial Disclosures",
    calculationBasis: "Standard Horizontal, Vertical & Financial Ratio Analysis",
    discrepancyNotice: null,
    auditNotes: [
      {
        topic: "Corporate Outcome Claim Clarification",
        finding: "The project outcome references 'saving an estimated 8% overhead'. This is an academic proposal formulated as coursework recommendations, not an executed consulting engagement or realized corporate cost reduction at Square Pharmaceuticals Ltd.",
        status: "Clarified as Academic Estimation",
      },
      {
        topic: "Financial Statement Source Provenance",
        finding: "Ratio calculations are derived from published annual reports (FY2020-21 through FY2022-23) on the Dhaka Stock Exchange. Historical ratios (ROE 22.7%, Current Ratio 2.1x) reproduce cleanly from disclosed balance sheets and income statements.",
        status: "Arithmetic Verified from Public Disclosures",
      },
    ],
    formulas: [
      { name: "Gross Profit Margin", formula: "(Gross Profit / Net Revenue) × 100" },
      { name: "Net Profit Margin", formula: "(Net Profit After Tax / Net Revenue) × 100" },
      { name: "Return on Equity (ROE)", formula: "(Net Profit After Tax / Shareholders' Equity) × 100" },
      { name: "Current Ratio", formula: "Current Assets / Current Liabilities" },
      { name: "Debt-to-Equity", formula: "Total Debt / Total Shareholders' Equity" },
    ],
  },

  // ── 2. AgroFab Ltd. Master Budgeting ──────────────────────────
  2: {
    id: 2,
    group: "Applied Accounting Case Study",
    groupShort: "Accounting",
    groupId: "accounting",
    academicScope: "BBA Managerial Accounting Simulation · DIU",
    framework: "Managerial Master Budgeting (Sales, Production, DM, DL, Cash Forecast)",
    integrityStatus: INTEGRITY_STATUS.HYPOTHETICAL,
    secondaryStatus: null,
    evidenceType: "Classroom Simulation Problem Set (FY2024 Model)",
    currencyUnit: "BDT (Quarterly & Annual)",
    inputsClassification: "Hypothetical SME Case Parameters",
    calculationBasis: "Standard Operational Budgeting Sequences & Variance Analysis",
    discrepancyNotice: null,
    auditNotes: [
      {
        topic: "Mathematical Schedule Consistency",
        finding: "The budgeted income statement exhibits internal mathematical consistency: Full year revenue of BDT 48,600,000 less COGS of BDT 33,048,000 correctly equals Gross Profit of BDT 15,552,000 (32.0% GP margin). Less operating expenses BDT 7,560,000 gives Net Profit Before Tax of BDT 7,992,000; applying 25% corporate tax rate (BDT 1,998,000) exactly yields Net Profit After Tax of BDT 5,994,000.",
        status: "Internally Consistent Academic Simulation",
      },
      {
        topic: "Pedagogical Grounding",
        finding: "All financial inputs reflect an educational case simulation ('AgroFab Ltd.') illustrating seasonal cash flow constraints and working capital requirements.",
        status: "Hypothetical Educational Model",
      },
    ],
    formulas: [
      { name: "Gross Profit", formula: "Sales Revenue - Cost of Goods Sold (DM + DL + MOH)" },
      { name: "Net Profit Before Tax", formula: "Gross Profit - Operating Expenses" },
      { name: "Corporate Tax (25%)", formula: "Net Profit Before Tax × 25%" },
      { name: "Net Profit After Tax", formula: "Net Profit Before Tax - Corporate Tax" },
    ],
  },

  // ── 3. Individual Income Tax Return (AY 2023–24) ─────────────
  3: {
    id: 3,
    group: "Applied Accounting Case Study",
    groupShort: "Accounting",
    groupId: "accounting",
    academicScope: "BBA Taxation Practice & Return Preparation · DIU",
    framework: "Bangladesh Income Tax Act 2023 (ITA 2023) & NBR IT-11GA Schedule",
    integrityStatus: INTEGRITY_STATUS.RECONCILIATION_REQ,
    secondaryStatus: INTEGRITY_STATUS.HYPOTHETICAL,
    evidenceType: "Classroom Tax Simulation Problem Set (AY 2023–24)",
    currencyUnit: "BDT",
    inputsClassification: "Hypothetical Taxpayer Case Parameters (Mr. Karim)",
    calculationBasis: "Progressive Slab Computation under ITA 2023",
    discrepancyNotice: {
      headline: "Notice: Calculation Under Review — Narrative vs. Slab Schedule Divergence",
      summary: "A divergence exists between the narrative summary and the computation table in the source records. Original source figures are preserved intact while under owner review.",
      details: [
        "Narrative claims: Net tax payable after rebate and TDS credit is reported as BDT 19,250, alongside an eligible refund of BDT 1,750.",
        "Table computation: Gross tax of BDT 68,750 minus investment rebate of BDT 32,000 equals BDT 36,750. Subtracting TDS credit of BDT 48,500 yields an arithmetic net refund of BDT 11,750 (recorded as (11,750) in row 241 and affirmed in conclusion row 245).",
        "Evaluation: The narrative figures (BDT 19,250 payable / BDT 1,750 refund) reflect an earlier calculation state or alternative deduction assumption prior to applying the final BDT 32,000 rebate schedule. Neither figure has been modified in data files, preserving audit provenance.",
      ],
      originalValues: "Narrative: BDT 19,250 payable / BDT 1,750 refund · Table: (BDT 11,750) net refund",
      formulaTested: "Gross Tax (68,750) - Investment Rebate (32,000) - TDS (48,500) = (11,750) Refund",
      statusText: "Requires Owner Reconciliation · Raw values preserved",
    },
    auditNotes: [
      {
        topic: "Tax Slab Mathematical Verification",
        finding: "Taxable income of BDT 975,000 subjected to AY 2023–24 slabs: Nil up to 350,000; 5% on next 100,000 (BDT 5,000); 10% on next 300,000 (BDT 30,000); 15% on remaining 225,000 (BDT 33,750). Sum of slab tax = BDT 68,750. The arithmetic of the table itself is completely correct.",
        status: "Table Arithmetic Verified",
      },
      {
        topic: "Narrative Conflict Origin",
        finding: "Narrative bullets reference BDT 19,250 payable and BDT 1,750 refund, which conflict with the BDT 11,750 net refund produced by the table schedule. Source values remain unaltered per financial precision guidelines.",
        status: "Flagged for Owner Reconciliation",
      },
    ],
    formulas: [
      { name: "Taxable Income", formula: "Gross Income (1,485,000) - Allowable Exemptions (510,000) = 975,000" },
      { name: "Gross Tax Liability", formula: "Sum of progressive slab rates (0% + 5% + 10% + 15%) = BDT 68,750" },
      { name: "Net Tax / Refund", formula: "Gross Tax (68,750) - Rebate (32,000) - TDS (48,500) = (11,750) Refund" },
    ],
  },

  // ── 4. StyleTex RMG Costing & CVP Analysis ────────────────────
  4: {
    id: 4,
    group: "Applied Accounting Case Study",
    groupShort: "Accounting",
    groupId: "accounting",
    academicScope: "BBA Cost and Management Accounting Coursework · DIU",
    framework: "Absorption Costing, Unit Cost Sheet & CVP Break-Even Analysis",
    integrityStatus: INTEGRITY_STATUS.RECONCILIATION_REQ,
    secondaryStatus: INTEGRITY_STATUS.HYPOTHETICAL,
    evidenceType: "Classroom Managerial Costing Case Set",
    currencyUnit: "BDT per Unit & % Contribution Ratio",
    inputsClassification: "Hypothetical RMG Factory Operational Parameters (StyleTex Ltd.)",
    calculationBasis: "Standard Job/Process Costing & Contribution Margin Modeling",
    discrepancyNotice: {
      headline: "Notice: Calculation Under Review — Contribution Margin Arithmetic Divergence",
      summary: "A discrepancy exists in the shirt product line contribution margin calculation. Original figures are preserved intact while under owner review.",
      details: [
        "Stated shirt inputs: Selling Price = BDT 1,500; Direct Material = BDT 680; Direct Labor = BDT 320; Variable Overhead = BDT 120.",
        "Total Variable Cost: BDT 680 + BDT 320 + BDT 120 = BDT 1,120 per unit.",
        "Standard Managerial Formula: Selling Price (1,500) - Total Variable Cost (1,120) = BDT 380 per unit (Contribution Margin Ratio: 380 / 1,500 = 25.33%).",
        "Reported table value: The table reports '420 (28%)'. Whether BDT 420 was derived under an alternative cost classification (e.g. omitting variable overhead or using an earlier BDT 1,080 cost base) is undocumented.",
        "Preservation policy: Source values in portfolioData.js remain unchanged; this case study is displayed with an explicit reconciliation disclosure.",
      ],
      originalValues: "Reported: BDT 420 (28%) · Calculated: BDT 380 (25.33%) per unit",
      formulaTested: "CM = Selling Price (1,500) - Variable Cost (1,120) = BDT 380 per unit",
      statusText: "Requires Owner Reconciliation · Raw values preserved",
    },
    auditNotes: [
      {
        topic: "Factory Cost Reconciliation",
        finding: "Prime Cost (DM 680 + DL 320 = 1,000) plus Fixed Overhead (180) and Variable Overhead (120) sums to Total Factory Cost of BDT 1,300. Selling Price (1,500) minus Total Factory Cost (1,300) equals Operating Profit of BDT 200 per unit.",
        status: "Factory Cost Arithmetic Verified",
      },
      {
        topic: "Contribution Margin Divergence",
        finding: "Managerial accounting defines Contribution Margin as Selling Price minus Variable Costs. With variable costs of BDT 1,120, arithmetic CM is BDT 380, whereas the table displays BDT 420.",
        status: "Flagged for Owner Reconciliation",
      },
    ],
    formulas: [
      { name: "Prime Cost", formula: "Direct Material + Direct Labor" },
      { name: "Total Factory Cost", formula: "Prime Cost + Fixed Overhead + Variable Overhead" },
      { name: "Calculated CM (Unit)", formula: "Selling Price (1,500) - Variable Costs (1,120) = BDT 380" },
      { name: "Break-Even Volume", formula: "Fixed Overhead / Contribution Margin per unit" },
    ],
  },

  // ── 5. DhakaShop Retail Internal Audit ────────────────────────
  5: {
    id: 5,
    group: "Applied Accounting Case Study",
    groupShort: "Accounting",
    groupId: "accounting",
    academicScope: "BBA Auditing & Assurance Fieldwork Simulation · DIU",
    framework: "COSO-Aligned Internal Control Evaluation & 3×3 Risk Assessment",
    integrityStatus: INTEGRITY_STATUS.HYPOTHETICAL,
    secondaryStatus: null,
    evidenceType: "Classroom Audit Practice Problem Set",
    currencyUnit: "BDT & Qualitative Risk Ratings",
    inputsClassification: "Simulated Retail Enterprise Parameters (DhakaShop Ltd.)",
    calculationBasis: "Risk Matrix Scoring (Likelihood × Financial Impact)",
    discrepancyNotice: null,
    auditNotes: [
      {
        topic: "Simulation Scope & Loss Exposure Grounding",
        finding: "The 5 control weaknesses and projected annual loss exposure of BDT 480,000 (with potential 30% reduction saving BDT 144,000) are educational modeling benchmarks designed to teach internal audit reporting conventions. They do not represent commercial client engagements or professional audit sign-offs.",
        status: "Pedagogical Case Modeling",
      },
      {
        topic: "Compliance and Reporting Standards",
        finding: "The audit matrix rigorously implements standard internal control testing criteria: segregation of duties, physical verification, dual authorization limits, and petty cash imprest systems.",
        status: "Methodology Verified to Academic Standard",
      },
    ],
    formulas: [
      { name: "Risk Score", formula: "Likelihood Rating × Financial Impact Rating" },
      { name: "Projected Risk Reduction", formula: "Annual Loss Exposure (BDT 480,000) × 30% Expected Mitigation = BDT 144,000" },
    ],
  },

  // ── 6. FIFA World Cup Economic Impact ─────────────────────────
  6: {
    id: 6,
    group: "Macroeconomic Research Paper",
    groupShort: "Research",
    groupId: "macroeconomics",
    academicScope: "BBA Macroeconomic Research Paper & Coursework · DIU",
    framework: "Keynesian Multiplier Analysis & International Trade Transmission",
    integrityStatus: INTEGRITY_STATUS.RECONCILIATION_REQ,
    secondaryStatus: INTEGRITY_STATUS.SOURCE_LIMITATION,
    evidenceType: "Secondary Regulatory & Trade Publications (BBS, EPB, BB, FIFA)",
    currencyUnit: "BDT crore & USD",
    inputsClassification: "Secondary National Statistical Aggregates",
    calculationBasis: "Sectoral Trade Analysis & Multiplier Estimation (k = 1.8)",
    discrepancyNotice: {
      headline: "Notice: Macroeconomic Data Definition Divergence Under Review",
      summary: "A definitional contradiction exists between the written narrative and the sector impact schedule. Original values are preserved intact while under review.",
      details: [
        "Narrative claim: Key Finding 6 reports 'Total estimated economic contribution to Bangladesh's GDP: approximately BDT 24,500 crore (direct + indirect)'.",
        "Table breakdown: Table row 425 reports 'Total Direct Impact: 43,420 crore (+33%)' across RMG merchandise, retail sales, electronics, and MFS transactions.",
        "Definitional contradiction: Mathematically, Total Direct Impact cannot exceed Total Economic Contribution (Direct + Indirect). The table likely aggregates gross sector sales volume rather than net value-added GDP contribution, or compares different economic boundaries.",
        "Preservation policy: Source values in portfolioData.js remain unaltered; the study is flagged for review with this disclosure.",
      ],
      originalValues: "Narrative Total (Direct + Indirect): BDT 24,500 crore · Table Direct Impact: BDT 43,420 crore",
      formulaTested: "Total Economic Impact = Direct Impact + Indirect (Multiplier Effect) [Direct cannot exceed Total]",
      statusText: "Requires Definitional Reconciliation · Raw values preserved",
    },
    auditNotes: [
      {
        topic: "Multiplier Formula Consistency",
        finding: "The stated multiplier methodology posits k = 1.8 on direct expenditure. However, applying k = 1.8 to BDT 43,420 crore would yield BDT 78,156 crore, which starkly contradicts the BDT 24,500 crore narrative estimate.",
        status: "Flagged for Definitional Reconciliation",
      },
      {
        topic: "Secondary Data Sourcing",
        finding: "Export figures (USD 340 million in RMG merchandise) cite EPB and BBS trade bulletins for the 2022 Qatar tournament window.",
        status: "Secondary Source References Noted",
      },
    ],
    formulas: [
      { name: "Economic Multiplier Effect", formula: "Total Impact = Initial Direct Injection × Multiplier Factor (k = 1.8)" },
    ],
  },

  // ── 7. Digital Economy & Bangladesh ───────────────────────────
  7: {
    id: 7,
    group: "Macroeconomic Research Paper",
    groupShort: "Research",
    groupId: "macroeconomics",
    academicScope: "BBA Macroeconomic Research Paper & Coursework · DIU",
    framework: "Digital Economy Indicator Matrix (Fintech, E-commerce, IT Exports)",
    integrityStatus: INTEGRITY_STATUS.ACADEMIC_CALC,
    secondaryStatus: INTEGRITY_STATUS.SOURCE_LIMITATION,
    evidenceType: "Secondary Regulatory & Industry Bulletins (BB, BASIS, BBS)",
    currencyUnit: "BDT crore, USD & % Penetration",
    inputsClassification: "Secondary Published Statistical Series (2018–2023)",
    calculationBasis: "Compound Annual Growth Rate (CAGR) & Pillar Assessment",
    discrepancyNotice: null,
    auditNotes: [
      {
        topic: "Indicator Trend Consistency",
        finding: "Reported data series (MFS users expanding from 28.4M in 2018 to 67.3M in 2023; e-commerce growing from USD 1.1B to USD 3.4B) align with historical Bangladesh Bank quarterly reports and BASIS trade surveys.",
        status: "Consistent with Published Regulatory Bulletins",
      },
      {
        topic: "Academic Synthesis",
        finding: "The study represents an undergraduate research compilation analyzing policy milestones under Digital Bangladesh Vision 2021 and Smart Bangladesh 2041.",
        status: "Academic Research Synthesis",
      },
    ],
    formulas: [
      { name: "Compound Annual Growth Rate (CAGR)", formula: "[(Ending Value / Beginning Value)^(1/n)] - 1" },
    ],
  },

  // ── 8. Macroeconomics Study — Inflation & Business Cycle ───────
  8: {
    id: 8,
    group: "Macroeconomic Research Paper",
    groupShort: "Research",
    groupId: "macroeconomics",
    academicScope: "BBA Macroeconomics Coursework & Student Reference Guide · DIU",
    framework: "Keynesian Business Cycle, Circular Flow of Income & CPI Analysis",
    integrityStatus: INTEGRITY_STATUS.ACADEMIC_CALC,
    secondaryStatus: INTEGRITY_STATUS.SOURCE_LIMITATION,
    evidenceType: "Secondary Regulatory Publications (BB Annual Reports, BBS CPI Bulletins)",
    currencyUnit: "Percentage (%) & USD Billion",
    inputsClassification: "Official BBS and Bangladesh Bank Time-Series (FY20 to FY23)",
    calculationBasis: "Macroeconomic Indicator Comparison & Monetary Transmission",
    discrepancyNotice: null,
    auditNotes: [
      {
        topic: "Macroeconomic Indicator Alignment",
        finding: "Reported indicators reflect official economic statistics: GDP growth trough of 5.24% in FY20, CPI inflation rising from 5.56% to 9.52% in FY23, repo rate hike from 5.75% to 7.25%, and forex reserve drawdowns (USD 46.2B to USD 19.2B) accurately reflect published Bangladesh Bank bulletins.",
        status: "Consistent with Official National Statistics",
      },
      {
        topic: "Academic Grounding",
        finding: "Created as an undergraduate course study guide for exam reference, applying macroeconomic frameworks to Bangladesh's post-COVID recovery and commodity price shocks.",
        status: "Academic Coursework Reference Guide",
      },
    ],
    formulas: [
      { name: "CPI Inflation Rate", formula: "[(CPI_current - CPI_prior) / CPI_prior] × 100" },
      { name: "Fiscal Deficit Ratio", formula: "(Gross Fiscal Deficit / Nominal GDP) × 100" },
    ],
  },
};
