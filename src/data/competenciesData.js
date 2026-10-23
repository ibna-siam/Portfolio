// ============================================================
// ACCOUNTING & FINANCIAL COMPETENCIES MATRIX DATA
// Grounded strictly in BBA coursework, case studies, and empirical projects.
// Contains zero arbitrary percentages, star ratings, or unverified claims.
// ============================================================

export const COMPETENCY_CATEGORIES = [
  { id: "All", label: "All Disciplines" },
  { id: "Financial Accounting", label: "Financial Accounting" },
  { id: "Managerial Accounting", label: "Managerial Costing" },
  { id: "Taxation & Audit", label: "Taxation & Audit" },
  { id: "Software & Tech", label: "Software & Tech" },
];

export const competencies = [
  // ------------------------------------------------------------
  // Domain 1: Financial Accounting & Reporting
  // ------------------------------------------------------------
  {
    name: "Financial Statement Analysis & Ratio Modeling",
    domain: "Financial Accounting",
    category: "Financial Accounting",
    evidenceLabel: "Case Study",
    description:
      "Conducting horizontal, vertical, and cross-sectional financial analysis. Evaluating liquidity, operating profitability, asset utilization, and solvency trends from corporate annual reports.",
    frameworkTags: ["IFRS / BAS", "Liquidity Ratios", "Solvency Modeling"],
    relatedProject: "Square Pharmaceuticals Analysis",
  },
  {
    name: "IFRS & Bangladesh Accounting Standards (BAS)",
    domain: "Financial Accounting",
    category: "Financial Accounting",
    evidenceLabel: "Coursework",
    description:
      "Studying core recognition criteria, measurement principles, disclosure mandates, and financial statement presentation standards governing corporate reporting.",
    frameworkTags: ["IFRS Framework", "BAS Standards", "Disclosure Analysis"],
    relatedProject: "Financial Reporting Curriculum",
  },
  {
    name: "DuPont Profitability Decomposition",
    domain: "Financial Accounting",
    category: "Financial Accounting",
    evidenceLabel: "Case Study",
    description:
      "Decomposing Return on Equity (ROE) into operating profit margin, total asset turnover, and financial leverage (equity multiplier) to isolate corporate performance drivers.",
    frameworkTags: ["DuPont Model", "ROE Analytics", "Margin Analysis"],
    relatedProject: "Square Pharmaceuticals Analysis",
  },
  {
    name: "Balance Sheet & Cash Flow Pattern Interpretation",
    domain: "Financial Accounting",
    category: "Financial Accounting",
    evidenceLabel: "Academic Study",
    description:
      "Interpreting operating, investing, and financing cash flows alongside balance sheet structures to assess working capital health and corporate capital stability.",
    frameworkTags: ["Cash Flow Analysis", "Working Capital", "Capital Structure"],
    relatedProject: "Corporate Financial Analysis",
  },

  // ------------------------------------------------------------
  // Domain 2: Managerial Accounting & Cost Analysis
  // ------------------------------------------------------------
  {
    name: "Cost-Volume-Profit (CVP) & Break-Even Modeling",
    domain: "Managerial Accounting",
    category: "Managerial Accounting",
    evidenceLabel: "Case Study",
    description:
      "Calculating contribution margins, multi-product weighted break-even volumes, operating leverage, and margin of safety across apparel manufacturing lines.",
    frameworkTags: ["CVP Modeling", "Contribution Margin", "Break-Even"],
    relatedProject: "StyleTex RMG Costing Study",
  },
  {
    name: "Operational Master Budgeting & Cash Scheduling",
    domain: "Managerial Accounting",
    category: "Managerial Accounting",
    evidenceLabel: "Case Study",
    description:
      "Formulating integrated departmental schedules: sales targets, production schedules, direct materials/labor requirements, overhead allocations, and quarterly cash budgets.",
    frameworkTags: ["Master Budget", "Operating Plans", "Pro Forma Statements"],
    relatedProject: "AgroFab Master Budget",
  },
  {
    name: "Variance Analysis & Standard Costing",
    domain: "Managerial Accounting",
    category: "Managerial Accounting",
    evidenceLabel: "Case Study",
    description:
      "Analyzing favorable and adverse deviations between standard cost expectations and actual outcomes across materials price/usage and labor rate/efficiency.",
    frameworkTags: ["Variance Analysis", "Standard Costing", "Cost Control"],
    relatedProject: "AgroFab Budget & StyleTex Studies",
  },
  {
    name: "Cost Behavior & Overhead Absorption",
    domain: "Managerial Accounting",
    category: "Managerial Accounting",
    evidenceLabel: "Coursework",
    description:
      "Distinguishing direct versus indirect cost classifications, fixed versus variable behavior, and applying absorption costing methods for managerial pricing support.",
    frameworkTags: ["Cost Behavior", "Absorption Costing", "Overhead Allocation"],
    relatedProject: "Managerial Accounting Studies",
  },

  // ------------------------------------------------------------
  // Domain 3: Taxation, Audit & Compliance
  // ------------------------------------------------------------
  {
    name: "Bangladesh Income Tax Act 2023 Assessment",
    domain: "Taxation & Audit",
    category: "Taxation & Audit",
    evidenceLabel: "Case Study",
    description:
      "Determining individual gross assessable income across salary, housing allowances, medical benefits, and investment securities under current statutory tax slabs.",
    frameworkTags: ["Income Tax Act 2023", "Tax Slabs", "Statutory Compliance"],
    relatedProject: "Individual Tax Return Study",
  },
  {
    name: "Tax Rebate Calculations & Allowable Deductions",
    domain: "Taxation & Audit",
    category: "Taxation & Audit",
    evidenceLabel: "Case Study",
    description:
      "Evaluating eligible investment allowances (DPS, life insurance, government bonds) to compute legal statutory tax rebates and net payable liability.",
    frameworkTags: ["Tax Rebates", "Investment Credit", "Exemption Analysis"],
    relatedProject: "Individual Tax Return Study",
  },
  {
    name: "Internal Control Review & Audit Procedures",
    domain: "Taxation & Audit",
    category: "Taxation & Audit",
    evidenceLabel: "Case Study",
    description:
      "Evaluating internal control environments, dual-authorization protocols, segregation of duties, and physical inventory count procedures in retail operations.",
    frameworkTags: ["Internal Controls", "Control Testing", "Substantive Audit"],
    relatedProject: "DhakaShop Retail Internal Audit",
  },
  {
    name: "Audit Risk Identification & Loss Mitigation",
    domain: "Taxation & Audit",
    category: "Taxation & Audit",
    evidenceLabel: "Case Study",
    description:
      "Identifying vulnerabilities in point-of-sale reconciliations, stock shrinkage patterns, and manual transaction ledgers with procedural recommendations.",
    frameworkTags: ["Risk Assessment", "Shrinkage Control", "Loss Prevention"],
    relatedProject: "DhakaShop Retail Internal Audit",
  },

  // ------------------------------------------------------------
  // Domain 4: Financial Software & Technology
  // ------------------------------------------------------------
  {
    name: "Microsoft Excel Financial & Variance Modeling",
    domain: "Software & Tech",
    category: "Software & Tech",
    evidenceLabel: "Analytical Method",
    description:
      "Building structured spreadsheet models with lookup functions (XLOOKUP/INDEX-MATCH), sensitivity data tables, nested logic, and automated financial statements.",
    frameworkTags: ["Excel Modeling", "Data Tables", "Automated Schedules"],
    relatedProject: "Master Budget & CVP Workbooks",
  },
  {
    name: "Tally ERP & Accounting Information Systems",
    domain: "Software & Tech",
    category: "Software & Tech",
    evidenceLabel: "Coursework",
    description:
      "Managing chart of accounts hierarchies, journal voucher entries, debit/credit reconciliations, inventory tracking, and computerized trial balance generation.",
    frameworkTags: ["Tally ERP", "General Ledger", "Computerized Accounting"],
    relatedProject: "Accounting Information Systems",
  },
  {
    name: "Analytical Reporting Dashboards & Data Visualization",
    domain: "Software & Tech",
    category: "Software & Tech",
    evidenceLabel: "Technical Project",
    description:
      "Designing structured visual dashboard layouts that transform raw financial numbers into clear managerial summaries, variance highlights, and KPI metrics.",
    frameworkTags: ["Data Visualization", "KPI Dashboards", "Variance Displays"],
    relatedProject: "Business Analytics & Dashboards",
  },
  {
    name: "Web Application & Calculation Engine Development",
    domain: "Software & Tech",
    category: "Software & Tech",
    evidenceLabel: "Technical Project",
    description:
      "Applying modern web technologies (React, JavaScript) as a complementary skill to build responsive financial calculators, interactive schedules, and data tools.",
    frameworkTags: ["React", "JavaScript", "Calculation Engines"],
    relatedProject: "Siam's Portfolio & Tech Projects",
  },
];
