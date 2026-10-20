/**
 * academicJourneyData.js
 *
 * Confirmed Academic Journey & Professional Development records for Md Ibna Siam.
 * Source of truth: Existing portfolio records and approved project documents.
 *
 * Strict Integrity Rules:
 * - No fabricated GPA/CGPA, rankings, or graduation dates.
 * - No unverified certifications or course completion claims.
 * - ACCA is represented strictly as a future target qualification.
 */

export const ACADEMIC_MILESTONES = [
  {
    id: "bba-accounting",
    institution: "Daffodil International University",
    campus: "Birulia, Savar, Dhaka-1216",
    degree: "Bachelor of Business Administration (B.B.A.)",
    major: "Major in Accounting",
    status: "Current Undergraduate Program",
    period: "2025 — Present",
    overview:
      "Formal undergraduate business curriculum emphasizing core financial accounting, management reporting, taxation under Bangladesh regulations, and auditing standards.",
    disciplines: [
      "Financial Accounting & Reporting",
      "Cost & Management Accounting",
      "Taxation (Income Tax Act 2023)",
      "Auditing & Assurance Services",
      "Corporate Finance & Valuation",
      "Macroeconomics & Business Law",
    ],
    connectedStudies: [
      {
        id: 1,
        title: "Financial Statement Analysis — Square Pharmaceuticals Ltd.",
        discipline: "Financial Accounting",
      },
      {
        id: 2,
        title: "AgroFab Ltd. Master Budgeting Simulation",
        discipline: "Management Accounting",
      },
      {
        id: 3,
        title: "Individual Income Tax Return (AY 2023–24)",
        discipline: "Taxation (ITA 2023)",
      },
      {
        id: 4,
        title: "StyleTex RMG Costing & CVP Analysis",
        discipline: "Cost Accounting",
      },
      {
        id: 5,
        title: "DhakaShop Retail Internal Audit Report",
        discipline: "Auditing & Assurance",
      },
    ],
  },
  {
    id: "hsc-business",
    institution: "Ghatail Cantonment Public School & College",
    campus: "Ghatail Cantonment, Tangail",
    degree: "Higher Secondary Certificate (HSC)",
    major: "Business Studies Group",
    status: "Completed",
    period: "2022 — 2024",
    overview:
      "Secondary higher education with academic concentration in Business Studies, building theoretical fundamentals in financial recordkeeping, business mathematics, and economics.",
    disciplines: [
      "Principles of Accounting",
      "Finance, Banking & Insurance",
      "Economics & Market Systems",
      "Business Organization & Management",
    ],
    connectedStudies: [],
  },
  {
    id: "ssc-business",
    institution: "Ghatail Govt. Pilot High School",
    campus: "Ghatail, Tangail",
    degree: "Secondary School Certificate (SSC)",
    major: "Business Studies Group",
    status: "Completed",
    period: "2020 — 2022",
    overview:
      "Foundational secondary schooling establishing core mathematical problem-solving, introduction to commerce, and elementary accounting principles.",
    disciplines: [
      "Introduction to Accounting",
      "General Mathematics & Problem Solving",
      "General Science & Business Concepts",
    ],
    connectedStudies: [],
  },
];

export const PROFESSIONAL_TRAJECTORY = {
  qualification: "ACCA (Association of Chartered Certified Accountants)",
  credentialBody: "ACCA Global (United Kingdom)",
  trajectoryType: "Future Target Professional Qualification",
  statusLabel: "Career Pathway in Planning",
  integrityNotice:
    "Target professional qualification following undergraduate studies. No registration, student membership, completed exams, or exemptions are claimed without independent verification.",
  strategicFocus: [
    "International Financial Reporting Standards (IFRS)",
    "Audit & Assurance Standards (ISA)",
    "Performance Management & Financial Strategy",
    "Global Professional Ethics & Governance",
  ],
};
