/**
 * techSolutionsData.js
 *
 * Business & Technology Solutions Data Registry.
 * Demonstrates technology-enabled problem-solving as a supporting capability (~25% weight)
 * without weakening the portfolio's primary Accounting & Finance identity.
 *
 * Strict Integrity Rules:
 * - Only genuine, documented projects are included.
 * - Statuses are factually described (Deployed, Prototype, In Development).
 * - Only verified destinations are linked (no fake buttons or broken URLs).
 * - No fabricated revenue, user counts, or commercial adoption claims.
 */

export const TECH_SOLUTIONS = [
  {
    id: "financial-portfolio-engine",
    title: "Executive Financial Portfolio & Case Study Showcase",
    category: "Financial Web Application & Reporting Interface",
    status: "Deployed / Production Ready",
    statusTheme: "emerald",
    problem:
      "Generic portfolio templates rely on software-developer aesthetics with artificial typing effects, lacking the numerical precision, tabular formatting, and audit trails required by accounting and audit recruiters.",
    solution:
      "Engineered an Executive Financial Precision application featuring high-precision tabular financial statement viewers (.tabular-nums), transparent mathematical integrity audit registers, and accessible modal inspection drawers.",
    userRole: "Frontend Solution Architecture, Design System & Financial Logic",
    techStack: ["React 19", "Vite", "Tailwind CSS", "Framer Motion"],
    features: [
      "Interactive 5-tab case study viewer (Overview, Methodology, Schedules, Findings, Integrity)",
      "High-contrast financial tables with tabular numerals and currency units",
      "Transparent audit disclosure banners for calculations requiring reconciliation",
      "Fully accessible WCAG 2.1 AA dialog controls with Escape-key handling",
    ],
    verifiedRepo: "https://github.com/ibna-siam/Portfolio",
    verifiedDemo: null, // Deployed root
    linkText: "View Source Repository",
  },
  {
    id: "mess-expense-system",
    title: "Digital Mess & Shared Expense Reconciliation System",
    category: "Cost Allocation & Shared Ledger Automation",
    status: "Operational Prototype",
    statusTheme: "blue",
    problem:
      "University student hostels and shared living facilities ('messes') in Bangladesh suffer from recurring disputes, manual bookkeeping errors, and tedious month-end reconciliations when pooling kitchen and utility expenses.",
    solution:
      "Designed a cost-allocation system that automates the daily meal rate formula (Total Monthly Expense ÷ Total Meals Consumed), tracks individual advance deposits, and generates individual member debit/credit settlement sheets.",
    userRole: "Cost Accounting Logic, Ledger Formulae & Interface Prototype",
    techStack: ["JavaScript", "React", "Tailwind CSS", "Spreadsheet Modeling"],
    features: [
      "Automated meal-rate calculation engine based on collective grocery purchases",
      "Member-wise ledger tracking advance payments, active meal counts, and net balances",
      "Month-end settlement sheet identifying who owes vs. who is owed refund",
      "Transparent audit trail preventing disputed manual adjustments",
    ],
    verifiedRepo: "https://github.com/ibna-siam",
    verifiedDemo: null,
    linkText: "View Developer Profile",
  },
  {
    id: "student-budget-tracker",
    title: "Personal Cash Flow & Student Budget Allocation Tool",
    category: "Personal Finance & Managerial Variance Tracking",
    status: "Functional Prototype",
    statusTheme: "purple",
    problem:
      "Undergraduate students often struggle with irregular allowance inflows, unmonitored discretionary spending, and lack of forward-looking cash flow projections, leading to month-end deficits.",
    solution:
      "Built a managerial personal budgeting application applying standard cost accounting variance methods. Enables students to set monthly category allowances (academic, living, discretionary) and tracks real-time variance deviations.",
    userRole: "Financial Modeling, UX Design & Calculation Engine",
    techStack: ["JavaScript", "HTML5", "CSS3 / Tailwind", "Excel Models"],
    features: [
      "Category-based budget allocation with percentage breakdown visualization",
      "Actual vs. budgeted variance tracking with favorable/adverse indicators",
      "Monthly cash flow projection schedule highlighting potential deficit windows",
      "Exportable summary schedule modeled on managerial accounting principles",
    ],
    verifiedRepo: "https://github.com/ibna-siam",
    verifiedDemo: null,
    linkText: "View Developer Profile",
  },
];
