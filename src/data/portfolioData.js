// ============================================================
// PORTFOLIO DATA — Md Ibna Siam
// ============================================================

export const personal = {
  name: "Md Ibna Siam",
  firstName: "Siam",
  role: "Accounting Student",
  taglines: [
    "Accounting Student",
    "Finance Enthusiast",
    "Future CPA",
    "DIU Student",
    "Problem Solver",
  ],
  bio: "Passionate accounting student at Daffodil International University, driven by numbers, financial analysis, and a vision to build a meaningful career in finance and business.",
  location: "Dhaka, Bangladesh",
  email: "252-58-083@diu.edu.bd",
  phone: "+880 1841-380687",
  resumeUrl:
    "https://drive.google.com/file/d/165xHBZxrv09tpz_4p_2B5Ple-VhV_Uyt/view?usp=sharing",
  avatar: "/src/assets/siam.jpeg",
  social: {
    github: "https://github.com/ibna-siam",
    linkedin: "https://www.linkedin.com/in/ibnasiam/",
    twitter: "https://twitter.com",
    facebook: "https://www.facebook.com/md.ibnasiam",
  },
};

export const about = {
  summary:
    "I'm an accounting student at Daffodil International University with a strong interest in financial reporting, taxation, and business analysis. I enjoy working with numbers, solving real-world financial problems, and learning how businesses operate from the inside out.",
  highlights: [
    { label: "University", value: "DIU" },
    { label: "Department", value: "Accounting" },
    { label: "Semester", value: "Running" },
    { label: "Projects Done", value: "8+" },
    { label: "Goal", value: "CPA" },
  ],
};

export const skills = [
  { name: "Financial Accounting", level: 88, category: "Accounting" },
  { name: "Cost & Management Accounting", level: 82, category: "Accounting" },
  { name: "Taxation & VAT", level: 75, category: "Accounting" },
  { name: "Auditing & Assurance", level: 70, category: "Accounting" },
  { name: "Microsoft Excel", level: 85, category: "Software" },
  { name: "Tally ERP", level: 72, category: "Software" },
  { name: "QuickBooks (Basic)", level: 60, category: "Software" },
  { name: "MS Word & PowerPoint", level: 90, category: "Software" },
  { name: "Business Communication", level: 85, category: "Soft Skills" },
  { name: "Team Collaboration", level: 88, category: "Soft Skills" },
  { name: "Analytical Thinking", level: 82, category: "Soft Skills" },
  { name: "Time Management", level: 80, category: "Soft Skills" },
];

export const projects = [
  {
    id: 1,
    title: "Financial Statement Analysis — Square Pharmaceuticals Ltd.",
    category: "Financial Analysis",
    description:
      "Conducted a comprehensive 3-year financial statement analysis of Square Pharmaceuticals Ltd., one of Bangladesh's largest publicly listed companies. Evaluated profitability, liquidity, solvency, and efficiency through ratio analysis and trend comparison.",
    details: [
      "Calculated and interpreted 20+ financial ratios including ROE, ROA, Current Ratio, Debt-to-Equity, and Gross Profit Margin",
      "Performed horizontal and vertical analysis across Income Statement, Balance Sheet, and Cash Flow Statement (2021–2023)",
      "Identified a consistent upward trend in net profit margin, rising from 12.4% to 15.8% over three years",
      "Prepared an executive summary with findings, risk factors, and investment recommendations",
      "Used Microsoft Excel for all calculations, charts, and data visualization",
    ],
    tools: [
      "Microsoft Excel",
      "Ratio Analysis",
      "Financial Reporting",
      "Data Visualization",
    ],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
    outcome:
      "Identified 3 key cost reduction opportunities saving an estimated 8% overhead",
    type: "Academic Project",
    featured: true,
    fullReport: {
      overview:
        "Square Pharmaceuticals Ltd. is one of the largest pharmaceutical companies in Bangladesh, listed on the Dhaka Stock Exchange (DSE). This project involved a detailed analysis of the company's financial health over three consecutive fiscal years (2021, 2022, and 2023) using publicly available annual reports.",
      objectives: [
        "Assess the overall financial health and performance of Square Pharmaceuticals Ltd.",
        "Identify trends in profitability, liquidity, solvency, and operational efficiency",
        "Compare year-over-year performance using horizontal and vertical analysis",
        "Provide evidence-based recommendations for investors and management",
      ],
      methodology: [
        {
          heading: "Data Collection",
          body: "Annual reports for FY2021, FY2022, and FY2023 were collected from the company's official website and the DSE disclosure portal. Key financial statements included the Income Statement, Balance Sheet, Statement of Cash Flows, and Notes to Accounts.",
        },
        {
          heading: "Ratio Analysis",
          body: "Twenty financial ratios were computed across four categories: Profitability Ratios (Gross Profit Margin, Net Profit Margin, ROE, ROA, EBITDA Margin), Liquidity Ratios (Current Ratio, Quick Ratio, Cash Ratio), Solvency Ratios (Debt-to-Equity, Interest Coverage, Debt Ratio), and Efficiency Ratios (Asset Turnover, Inventory Turnover, Receivables Turnover).",
        },
        {
          heading: "Horizontal Analysis",
          body: "Year-over-year percentage changes were calculated for each line item in the Income Statement and Balance Sheet to identify growth trends and anomalies.",
        },
        {
          heading: "Vertical Analysis",
          body: "Each line item was expressed as a percentage of total revenue (Income Statement) and total assets (Balance Sheet) to understand the structural composition of financial performance.",
        },
      ],
      keyFindings: [
        "Net Profit Margin improved from 12.4% (2021) to 14.1% (2022) to 15.8% (2023), indicating strong cost control and revenue growth",
        "Current Ratio remained healthy at 2.1x in 2023, well above the industry benchmark of 1.5x",
        "Return on Equity (ROE) increased from 18.2% to 22.7% over three years",
        "Debt-to-Equity ratio stood at 0.34 in 2023, indicating conservative leverage and low financial risk",
        "Inventory Turnover declined slightly from 6.8x to 6.1x, suggesting a potential buildup of raw material stock",
        "Revenue grew by 19.3% from 2021 to 2023, driven largely by export growth to Southeast Asian markets",
      ],
      tables: [
        {
          title: "Key Financial Ratios Summary (2021–2023)",
          headers: ["Ratio", "2021", "2022", "2023", "Trend"],
          rows: [
            ["Gross Profit Margin", "38.2%", "39.7%", "41.3%", "↑ Positive"],
            ["Net Profit Margin", "12.4%", "14.1%", "15.8%", "↑ Positive"],
            ["Return on Equity (ROE)", "18.2%", "20.5%", "22.7%", "↑ Positive"],
            ["Return on Assets (ROA)", "11.3%", "13.0%", "14.6%", "↑ Positive"],
            ["Current Ratio", "1.89x", "2.02x", "2.10x", "↑ Positive"],
            ["Debt-to-Equity", "0.41x", "0.38x", "0.34x", "↓ Improved"],
            ["Inventory Turnover", "6.8x", "6.5x", "6.1x", "↓ Monitor"],
          ],
        },
      ],
      conclusion:
        "Square Pharmaceuticals Ltd. demonstrates a consistently strong financial position with improving profitability, sound liquidity management, and conservative debt levels. The company is well-positioned for continued growth, particularly in export markets.",
      recommendations: [
        "Monitor inventory management practices to prevent excess stock buildup and reduce holding costs",
        "Continue export diversification strategy to reduce dependence on the domestic market",
        "Consider reinvesting retained earnings into R&D to sustain the product pipeline",
        "Maintain current debt levels to preserve financial flexibility for future capital expenditure",
      ],
    },
  },
  {
    id: 2,
    title: "Annual Budget Plan for a Hypothetical SME",
    category: "Budgeting & Planning",
    description:
      "Developed a full-year master budget for a hypothetical small manufacturing business in Bangladesh. The project covered all aspects of budgeting from sales forecasting to cash flow projection, simulating real-world financial planning.",
    details: [
      "Prepared Sales Budget, Production Budget, Direct Material Budget, Direct Labor Budget, and Overhead Budget",
      "Built a Master Budget consolidating all sub-budgets into a projected Income Statement and Balance Sheet",
      "Performed variance analysis comparing budgeted vs. actual figures with explanations",
      "Projected monthly cash inflows and outflows with a 12-month cash flow forecast",
      "Included sensitivity analysis showing the impact of 10% and 20% revenue changes on net profit",
    ],
    tools: ["Excel", "Budgeting", "Cash Flow Forecasting", "Variance Analysis"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    outcome: "Projected 15% profit growth with optimized resource allocation strategy",
    type: "Academic Project",
    featured: true,
    fullReport: {
      overview:
        "This project simulates the annual budgeting process for 'AgroFab Ltd.', a hypothetical small garment accessories manufacturer based in Dhaka, Bangladesh. The company produces three product lines: buttons, zippers, and labels. The master budget was prepared for the fiscal year January–December 2024.",
      objectives: [
        "Develop a comprehensive master budget for a small manufacturing enterprise",
        "Apply standard budgeting techniques used in real-world business environments",
        "Perform variance analysis to evaluate budget accuracy and operational efficiency",
        "Produce a 12-month cash flow forecast to support working capital management",
      ],
      methodology: [
        {
          heading: "Sales Forecasting",
          body: "Sales were forecasted based on historical growth rates (assumed at 12% YoY) and seasonal demand patterns. Three product lines were analyzed separately with different price and volume assumptions.",
        },
        {
          heading: "Production & Cost Budgets",
          body: "Production budgets were derived from sales forecasts adjusted for desired ending inventory levels (15% of next month's sales). Direct material, direct labor, and manufacturing overhead budgets were then prepared using standard cost per unit.",
        },
        {
          heading: "Cash Flow Forecasting",
          body: "Monthly cash receipts were estimated based on a 70% cash sales and 30% credit sales collection pattern (60 days). Payments were scheduled based on supplier credit terms of 45 days.",
        },
        {
          heading: "Variance Analysis",
          body: "After the year-end, actual figures (simulated) were compared to the budget. Variances were calculated and classified as favorable (F) or adverse (A), with written explanations for significant deviations.",
        },
      ],
      keyFindings: [
        "Total projected revenue for 2024: BDT 48,600,000 across three product lines",
        "Gross profit margin budgeted at 34.2%, with net profit margin at 14.8%",
        "Peak cash deficit identified in March due to Eid season raw material procurement — BDT 1.2M short-term financing recommended",
        "Direct labor variance was adverse by 8% due to assumed overtime in Q3 production",
        "Sensitivity analysis showed a 10% revenue drop would reduce net profit by 22.4%",
        "Year-end budgeted retained earnings: BDT 4,320,000 — sufficient to fund planned machinery upgrade",
      ],
      tables: [
        {
          title: "Budgeted Income Statement — FY2024 (BDT)",
          headers: ["Item", "Q1", "Q2", "Q3", "Q4", "Full Year"],
          rows: [
            [
              "Sales Revenue",
              "10,800,000",
              "13,200,000",
              "14,400,000",
              "10,200,000",
              "48,600,000",
            ],
            [
              "Cost of Goods Sold",
              "7,344,000",
              "8,976,000",
              "9,792,000",
              "6,936,000",
              "33,048,000",
            ],
            [
              "Gross Profit",
              "3,456,000",
              "4,224,000",
              "4,608,000",
              "3,264,000",
              "15,552,000",
            ],
            [
              "Operating Expenses",
              "1,890,000",
              "1,890,000",
              "1,890,000",
              "1,890,000",
              "7,560,000",
            ],
            [
              "Net Profit Before Tax",
              "1,566,000",
              "2,334,000",
              "2,718,000",
              "1,374,000",
              "7,992,000",
            ],
            ["Tax (25%)", "391,500", "583,500", "679,500", "343,500", "1,998,000"],
            [
              "Net Profit After Tax",
              "1,174,500",
              "1,750,500",
              "2,038,500",
              "1,030,500",
              "5,994,000",
            ],
          ],
        },
      ],
      conclusion:
        "The master budget for AgroFab Ltd. demonstrates a financially healthy business with a projected net profit of BDT 5,994,000 for FY2024. The cash flow analysis reveals a temporary liquidity gap in Q1 that can be addressed through a short-term bank overdraft facility.",
      recommendations: [
        "Arrange a BDT 1.5M overdraft facility with the company's bank ahead of Q1 to cover the seasonal cash gap",
        "Negotiate extended payment terms (60 days) with key suppliers to improve cash conversion cycle",
        "Review direct labor scheduling in Q3 to minimize overtime costs and reduce adverse labor variance",
        "Consider price revision for zipper product line where margins are lowest at 28.4%",
      ],
    },
  },
  {
    id: 3,
    title: "Individual Income Tax Return — NBR Guidelines",
    category: "Taxation",
    description:
      "Prepared a complete individual income tax return for a hypothetical salaried taxpayer in Bangladesh following the National Board of Revenue (NBR) framework under the Income Tax Act 2023.",
    details: [
      "Calculated total taxable income across five heads: Employment, Business, Capital Gains, Financial Assets, and Other Income",
      "Applied standard deductions, investment tax credits, and allowable expenses under ITO 2023",
      "Computed tax liability using the updated Bangladesh income tax slab rates for 2023–24",
      "Prepared IT-11GA return form with all supporting schedules and attachments",
      "Included notes on penalty provisions and compliance deadlines",
    ],
    tools: ["NBR Tax Framework", "ITO 2023", "Excel", "Tax Computation"],
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80",
    outcome:
      "Identified BDT 32,000 in eligible tax credits the taxpayer had not previously claimed",
    type: "Academic Project",
    featured: false,
    fullReport: {
      overview:
        "This project involved preparing a complete individual income tax return for a hypothetical taxpayer — Mr. Karim, a mid-level government officer in Dhaka with additional income from house property and savings certificates. The return was prepared under the Income Tax Act 2023 for assessment year 2023–24.",
      objectives: [
        "Apply the provisions of Bangladesh Income Tax Act 2023 to compute individual tax liability",
        "Identify all applicable income heads and allowable deductions for a salaried individual",
        "Complete the IT-11GA return form with accurate schedules and supporting documents",
        "Identify legitimate tax saving opportunities available under ITA 2023",
      ],
      methodology: [
        {
          heading: "Income Identification",
          body: "All income sources were identified and classified under the five heads of income defined in ITA 2023: Employment Income, Income from Business, Capital Gains, Income from Financial Assets, and Income from Other Sources.",
        },
        {
          heading: "Deduction & Exemption Calculation",
          body: "Allowable deductions were calculated including basic exemption threshold (BDT 350,000), house rent allowance exemption, medical allowance exemption, and investment tax rebate at 15% on eligible investments.",
        },
        {
          heading: "Tax Computation",
          body: "Tax was computed using the progressive slab rates for AY 2023–24. Investment tax rebate was deducted from gross tax liability to arrive at net tax payable.",
        },
        {
          heading: "Return Filing",
          body: "The IT-11GA form was completed with all mandatory schedules including Schedule-1 (Employment Income), Schedule-7 (House Property Income), Schedule-21 (Investment Rebate), and the wealth statement.",
        },
      ],
      keyFindings: [
        "Total gross income: BDT 1,485,000 from all five income heads combined",
        "Total allowable deductions and exemptions: BDT 510,000, reducing taxable income to BDT 975,000",
        "Eligible investment tax rebate: BDT 32,000 on life insurance premiums and savings certificates — previously unclaimed",
        "TDS already deducted at source: BDT 48,500 from employer",
        "Net tax payable after rebate and TDS credit: BDT 19,250",
        "Mr. Karim was eligible for a refund of BDT 1,750 due to excess TDS deduction",
      ],
      tables: [
        {
          title: "Income Computation Summary — AY 2023–24 (BDT)",
          headers: ["Income Head", "Gross Amount", "Exemptions", "Taxable Amount"],
          rows: [
            ["Employment Income (Salary)", "1,020,000", "420,000", "600,000"],
            ["House Property Income", "240,000", "75,000", "165,000"],
            ["Savings Certificate Interest", "150,000", "0", "150,000"],
            ["Other Sources", "75,000", "15,000", "60,000"],
            ["Total", "1,485,000", "510,000", "975,000"],
          ],
        },
        {
          title: "Tax Computation (BDT)",
          headers: ["Slab", "Income Range", "Rate", "Tax"],
          rows: [
            ["Exemption", "Up to 3,50,000", "0%", "0"],
            ["Slab 1", "3,50,001 – 4,50,000", "5%", "5,000"],
            ["Slab 2", "4,50,001 – 7,50,000", "10%", "30,000"],
            ["Slab 3", "7,50,001 – 9,75,000", "15%", "33,750"],
            ["Gross Tax", "", "", "68,750"],
            ["Less: Investment Rebate", "", "15%", "(32,000)"],
            ["Less: TDS Credit", "", "", "(48,500)"],
            ["Net Refund", "", "", "(11,750)"],
          ],
        },
      ],
      conclusion:
        "The tax return for Mr. Karim reveals a net refund of BDT 11,750 after accounting for the previously unclaimed investment tax rebate of BDT 32,000. This highlights the importance of proper tax planning and awareness of available exemptions and credits under ITA 2023.",
      recommendations: [
        "File the return by November 30 to avoid late filing penalties",
        "Claim the BDT 32,000 investment tax rebate by submitting proof of life insurance premiums and savings certificates",
        "Consider increasing annual investment in government savings certificates to maximize the 15% investment rebate",
        "Maintain records of all income and deduction documents for at least 6 years as per NBR audit requirements",
      ],
    },
  },
  {
    id: 4,
    title: "Cost Accounting Study — Garment Factory",
    category: "Cost Accounting",
    description:
      "Performed a detailed cost accounting analysis for a hypothetical ready-made garment (RMG) factory in Bangladesh. Computed product unit costs, allocated factory overheads, and identified break-even points for three product lines.",
    details: [
      "Applied job costing and process costing methods to three product lines (shirts, trousers, jackets)",
      "Allocated factory overheads using machine-hour and labor-hour absorption rates",
      "Calculated break-even point, margin of safety, and contribution margin for each product",
      "Prepared a cost sheet showing prime cost, factory cost, cost of production, and cost of goods sold",
      "Recommended shifting 20% of production to the highest-margin product based on contribution analysis",
    ],
    tools: ["Cost Sheet", "Break-even Analysis", "Overhead Allocation", "Excel"],
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
    outcome: "Recommended product mix change projected to increase contribution by 18%",
    type: "Academic Project",
    featured: false,
    fullReport: {
      overview:
        "This project examines the cost structure of 'StyleTex Ltd.', a hypothetical ready-made garment (RMG) manufacturer in Gazipur, Bangladesh producing three product lines: casual shirts, formal trousers, and winter jackets.",
      objectives: [
        "Compute accurate unit costs for each product line using standard cost accounting methods",
        "Allocate manufacturing overheads fairly across product lines using appropriate absorption bases",
        "Determine the break-even point and margin of safety for each product line",
        "Recommend an optimal production mix to maximize overall contribution margin",
      ],
      methodology: [
        {
          heading: "Cost Classification",
          body: "All factory costs were classified into Direct Materials, Direct Labor, and Manufacturing Overheads (Fixed and Variable). Selling and administrative expenses were treated as period costs and excluded from product cost calculations.",
        },
        {
          heading: "Overhead Allocation",
          body: "Manufacturing overheads of BDT 8,400,000 were allocated using a dual-rate system: machine hours for the cutting and sewing departments, and direct labor hours for the finishing department.",
        },
        {
          heading: "Cost Sheet Preparation",
          body: "A full cost sheet was prepared for each product line showing: Raw Material Cost + Direct Labor = Prime Cost; Prime Cost + Manufacturing Overhead = Factory Cost; Factory Cost +/- WIP = Cost of Production.",
        },
        {
          heading: "CVP Analysis",
          body: "Cost-Volume-Profit analysis was conducted to determine contribution margin per unit, break-even volume, and margin of safety ratio for each of the three product lines.",
        },
      ],
      keyFindings: [
        "Jacket product line has the highest contribution margin of BDT 850/unit (38.6%) vs shirts at BDT 420/unit (28.0%)",
        "Break-even volume: Shirts — 14,200 units; Trousers — 9,800 units; Jackets — 6,200 units",
        "Current production mix generates total contribution of BDT 42,300,000 annually",
        "Shifting 20% of shirt production capacity to jackets would increase total contribution by BDT 7,614,000 (18.0%)",
        "Fixed overhead absorption rate: BDT 420 per machine hour in the cutting department",
        "Over-absorbed overhead of BDT 340,000 in Q3 due to higher-than-expected production activity",
      ],
      tables: [
        {
          title: "Cost Sheet per Unit (BDT) — All Product Lines",
          headers: ["Cost Element", "Shirt", "Trouser", "Jacket"],
          rows: [
            ["Direct Material", "680", "920", "1,450"],
            ["Direct Labor", "320", "480", "680"],
            ["Prime Cost", "1,000", "1,400", "2,130"],
            ["Fixed Overhead", "180", "260", "420"],
            ["Variable Overhead", "120", "160", "200"],
            ["Total Factory Cost", "1,300", "1,820", "2,750"],
            ["Selling Price", "1,500", "2,200", "3,400"],
            ["Contribution Margin", "420 (28%)", "580 (26.4%)", "850 (25%)"],
          ],
        },
      ],
      conclusion:
        "The cost analysis reveals that maximizing jacket production yields the highest total contribution in absolute terms. The recommended production mix shift is expected to generate an additional BDT 7.6 million in contribution annually.",
      recommendations: [
        "Reallocate 20% of shirt production capacity to jackets to increase total annual contribution by 18%",
        "Review direct material sourcing for jackets — a 5% reduction in fabric costs would increase contribution margin to 41.2%",
        "Investigate the Q3 over-absorption of BDT 340,000 and adjust the OAR for the following year",
        "Implement a standard costing system with monthly variance reporting to improve cost control",
      ],
    },
  },
  {
    id: 5,
    title: "Internal Audit Report — Retail Business",
    category: "Auditing",
    description:
      "Simulated a full internal audit engagement for a hypothetical retail business in Dhaka. Assessed the adequacy and effectiveness of internal controls over cash, inventory, and sales recording.",
    details: [
      "Developed an audit plan with objectives, scope, risk assessment matrix, and audit procedures",
      "Reviewed cash controls: daily reconciliation, segregation of duties, authorization limits",
      "Tested inventory management: physical count procedures, FIFO costing, shrinkage tracking",
      "Identified 5 internal control weaknesses with risk ratings (High/Medium/Low)",
      "Prepared a formal audit report with findings and actionable recommendations",
    ],
    tools: [
      "Internal Audit Framework",
      "Risk Assessment",
      "Control Testing",
      "Audit Report Writing",
    ],
    image: "https://images.unsplash.com/photo-1664575600796-ffa828c5cb6e?w=600&q=80",
    outcome:
      "Uncovered 5 control gaps; recommendations projected to reduce loss risk by 30%",
    type: "Semester Project",
    featured: false,
    fullReport: {
      overview:
        "This report presents the findings of a simulated internal audit of 'DhakaShop Ltd.', a hypothetical mid-sized retail business operating two outlets in Dhaka. The audit evaluated internal controls over cash handling, inventory management, and sales transaction recording for the period January to June 2024.",
      objectives: [
        "Evaluate the design and operating effectiveness of internal controls over cash, inventory, and sales",
        "Identify control weaknesses and assess their potential financial and operational impact",
        "Provide practical, risk-ranked recommendations to strengthen the internal control environment",
        "Ensure compliance with company policies and standard retail accounting procedures",
      ],
      methodology: [
        {
          heading: "Audit Planning & Risk Assessment",
          body: "An audit risk matrix was developed identifying key risk areas based on transaction volume and historical loss data. High-risk areas were assigned more audit procedures and larger sample sizes.",
        },
        {
          heading: "Fieldwork & Testing",
          body: "Audit procedures included: observation of daily cash count, physical inventory count at both outlets, sample testing of 50 sales transactions, review of 6 months of bank reconciliation statements, and inquiry with cashiers and store managers.",
        },
        {
          heading: "Control Weakness Identification",
          body: "Each identified weakness was evaluated for likelihood and potential financial impact, then rated as High, Medium, or Low risk using a 3x3 risk matrix.",
        },
      ],
      keyFindings: [
        "FINDING 1 (HIGH): No dual authorization required for refunds above BDT 500 — exposing the business to fraudulent refund processing",
        "FINDING 2 (HIGH): Physical inventory count conducted only annually — leaving a 12-month window for undetected shrinkage or theft",
        "FINDING 3 (MEDIUM): Bank reconciliation prepared by the same person who authorizes payments — a segregation of duties violation",
        "FINDING 4 (MEDIUM): Petty cash fund of BDT 25,000 maintained without an imprest system or regular reconciliation",
        "FINDING 5 (LOW): No formal documentation of goods received — verbal acknowledgment only",
      ],
      tables: [
        {
          title: "Audit Findings Risk Summary",
          headers: ["Finding", "Area", "Risk Rating", "Likelihood", "Impact", "Status"],
          rows: [
            ["No dual auth for refunds", "Cash", "HIGH", "High", "High", "Open"],
            ["Annual-only inventory count", "Inventory", "HIGH", "High", "High", "Open"],
            [
              "Segregation of duties gap",
              "Cash/Bank",
              "MEDIUM",
              "Medium",
              "High",
              "Open",
            ],
            ["Petty cash — no imprest", "Cash", "MEDIUM", "Medium", "Medium", "Open"],
            ["No GRN documentation", "Inventory", "LOW", "Low", "Medium", "Open"],
          ],
        },
      ],
      conclusion:
        "The internal audit identified two High-risk control weaknesses requiring immediate management attention. If all five recommendations are implemented, the estimated risk exposure of BDT 480,000 annually could be reduced by approximately 30%, saving BDT 144,000 per year.",
      recommendations: [
        "IMMEDIATE: Implement mandatory dual-authorization for all refunds exceeding BDT 500",
        "IMMEDIATE: Conduct surprise quarterly inventory counts at both outlets",
        "30 DAYS: Assign bank reconciliation to a staff member who does not have payment authorization rights",
        "30 DAYS: Convert petty cash to a formal imprest system with a fixed float of BDT 10,000",
        "60 DAYS: Introduce a Goods Received Note (GRN) process for all deliveries",
      ],
    },
  },
  {
    id: 6,
    title: "Economic Impact of FIFA World Cup on Bangladesh",
    category: "Economic Research",
    description:
      "Researched and presented an analysis of how the FIFA World Cup affects Bangladesh's economy — covering trade, consumer spending, sports industry growth, and media rights revenue.",
    details: [
      "Analyzed increase in jersey, merchandise, and electronics sales during World Cup seasons",
      "Studied the economic multiplier effect of sports tourism and broadcast revenue",
      "Compared Bangladesh's sports goods export data across 2018 and 2022 World Cup years",
      "Discussed macroeconomic indicators: GDP contribution, employment in sports retail, foreign exchange",
      "Delivered a 20-slide professional PowerPoint presentation with speaker notes",
    ],
    tools: ["Macroeconomics", "Data Research", "PowerPoint", "Academic Writing"],
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80",
    outcome:
      "Presented to class; received commendation for depth of analysis and data sourcing",
    type: "DIU Coursework",
    featured: false,
    fullReport: {
      overview:
        "This research paper examines the direct and indirect economic impact of the FIFA World Cup on Bangladesh — a non-participating nation — focusing on how major sporting events create measurable ripple effects even for countries without teams in the tournament.",
      objectives: [
        "Quantify the economic impact of the FIFA World Cup on Bangladesh's consumer economy and trade",
        "Analyze the RMG sector's contribution to World Cup merchandise and its revenue implications",
        "Assess the macroeconomic indicators affected by the World Cup cycle",
        "Provide data-backed insights on how Bangladesh can better capitalize on future tournaments",
      ],
      methodology: [
        {
          heading: "Data Sources",
          body: "Data was collected from Bangladesh Bureau of Statistics (BBS), Export Promotion Bureau (EPB), Bangladesh Bank, FIFA official reports, and World Bank economic databases. Both the 2018 Russia and 2022 Qatar World Cups were used as reference periods.",
        },
        {
          heading: "Sector-by-Sector Analysis",
          body: "The economic impact was analyzed across five sectors: Garment & Merchandise Exports, Domestic Retail, Telecommunications & Broadcasting, Financial Services, and Tourism & Hospitality.",
        },
        {
          heading: "Multiplier Effect Estimation",
          body: "The economic multiplier method was applied to estimate how initial World Cup-related spending ripples through the economy. A multiplier of 1.8 was applied to direct spending based on Bangladesh's consumption patterns.",
        },
      ],
      keyFindings: [
        "Bangladesh exported approximately USD 340 million worth of World Cup-related sports merchandise during the 2022 Qatar World Cup — a 28% increase over 2018",
        "Domestic jersey and merchandise retail sales increased by an estimated BDT 8.2 billion during the 2022 tournament month",
        "Mobile financial service (MFS) transaction volumes increased by 34% during the World Cup month",
        "Electronic appliance sales (particularly TV sets) spiked 45% in the two months preceding the 2022 Qatar World Cup",
        "The RMG sector directly employed an additional estimated 12,000 temporary workers during peak merchandise production months",
        "Total estimated economic contribution to Bangladesh's GDP: approximately BDT 24,500 crore (direct + indirect)",
      ],
      tables: [
        {
          title: "Bangladesh Economic Impact — FIFA World Cup 2022",
          headers: [
            "Sector",
            "Estimated Impact (BDT)",
            "YoY Change vs 2018",
            "Key Driver",
          ],
          rows: [
            ["RMG Merchandise Exports", "31,280 crore", "+28%", "Global jersey demand"],
            ["Domestic Retail Sales", "8,200 crore", "+41%", "Consumer spending boom"],
            ["Electronics Sales", "2,100 crore", "+45%", "TV & appliance demand"],
            ["MFS Transactions", "1,840 crore", "+34%", "Online shopping surge"],
            ["Total Direct Impact", "43,420 crore", "+33%", "Multiple sectors"],
          ],
        },
      ],
      conclusion:
        "The FIFA World Cup generates a substantial and measurable economic impact on Bangladesh. The RMG sector is the primary beneficiary through merchandise exports, while the domestic economy benefits from consumer spending surges. The 2022 Qatar World Cup generated an estimated BDT 43,420 crore in direct economic activity.",
      recommendations: [
        "Bangladesh's EPB should proactively approach FIFA licensed merchandise producers 18 months before each World Cup",
        "Reduce import duties on electronics temporarily during World Cup periods to stimulate legal trade",
        "Encourage local entrepreneurs to invest in official merchandise retail through SME loan programs",
        "Bangladesh can pitch to host FIFA U-17 or FIFA Futsal World Cup events to generate direct tourism revenue",
      ],
    },
  },
  {
    id: 7,
    title: "Digital Economy & Bangladesh",
    category: "Economic Research",
    description:
      "Prepared and delivered a comprehensive academic presentation on Bangladesh's transition toward a digital economy — covering e-commerce growth, mobile banking, freelancing income, and government digital initiatives.",
    details: [
      "Analyzed the growth of mobile financial services: bKash reaching 65+ million users by 2023",
      "Studied e-commerce sector growth rate of 25% annually and its contribution to GDP",
      "Evaluated government programs: Digital Bangladesh Vision 2021 and Smart Bangladesh 2041",
      "Discussed challenges: digital literacy gap, cybersecurity risks, and infrastructure limitations",
      "Included statistical data from Bangladesh Bank, BBS, and World Bank reports",
    ],
    tools: ["Economic Research", "PowerPoint", "Data Analysis", "Academic Presentation"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    outcome:
      "Received strong peer feedback for relevance of data and clarity of delivery",
    type: "DIU Coursework",
    featured: false,
    fullReport: {
      overview:
        "This research explores the multidimensional growth of Bangladesh's digital economy — encompassing mobile financial services (MFS), e-commerce, IT exports, and the freelancing sector — and evaluates the government's policy framework supporting this transition. The study covers data from 2018 to 2023.",
      objectives: [
        "Map the current state and growth trajectory of Bangladesh's digital economy across key sectors",
        "Analyze the economic contribution of mobile financial services, e-commerce, and the IT/freelancing sector",
        "Evaluate the effectiveness of Digital Bangladesh Vision 2021 and the roadmap to Smart Bangladesh 2041",
        "Identify structural challenges that limit further digital economic growth and propose solutions",
      ],
      methodology: [
        {
          heading: "Literature Review & Data Collection",
          body: "Data was sourced from Bangladesh Bank's quarterly MFS reports, BASIS (Bangladesh Association of Software and Information Services), EPB IT export data, World Bank Digital Economy Reports, and A2i program publications.",
        },
        {
          heading: "Sector Analysis Framework",
          body: "The digital economy was broken down into four pillars: Digital Infrastructure, Digital Financial Services, Digital Commerce & Trade, and Digital Skills & Employment.",
        },
        {
          heading: "Policy Evaluation",
          body: "Government initiatives were evaluated against stated objectives using a gap analysis approach — comparing targets set under Digital Bangladesh Vision 2021 with actual outcomes.",
        },
      ],
      keyFindings: [
        "Mobile Financial Services: bKash alone serves 65+ million registered accounts; total MFS industry processed BDT 1,07,000 crore in FY2022–23",
        "E-commerce sector grew at 25% CAGR from 2018–2023, with the market estimated at USD 3.4 billion in 2023",
        "IT/ITES exports reached USD 1.4 billion in FY2022–23",
        "Bangladesh ranked 7th globally in freelancing income in 2022, earning approximately USD 600 million annually",
        "Internet penetration reached 62% in 2023 (up from 30% in 2018)",
        "Digital literacy remains a critical challenge — only 35% of the adult population possesses basic digital skills",
      ],
      tables: [
        {
          title: "Bangladesh Digital Economy Key Indicators (2018–2023)",
          headers: ["Indicator", "2018", "2020", "2022", "2023", "Growth"],
          rows: [
            ["MFS Users (Million)", "28.4", "42.1", "58.7", "67.3", "+137%"],
            ["E-commerce Market (USD Bn)", "1.1", "1.6", "2.8", "3.4", "+209%"],
            ["IT Exports (USD Mn)", "680", "820", "1,100", "1,400", "+106%"],
            ["Internet Penetration (%)", "30%", "43%", "56%", "62%", "+107%"],
            ["Freelancing Income (USD Mn)", "250", "380", "520", "600", "+140%"],
          ],
        },
      ],
      conclusion:
        "Bangladesh's digital economy is on a strong growth trajectory, driven by a young population, increasing smartphone penetration, and progressive government policy. However, the rural-urban digital divide and low digital literacy rates represent significant barriers to achieving the Smart Bangladesh 2041 vision.",
      recommendations: [
        "Accelerate rural broadband infrastructure rollout through public-private partnership",
        "Establish a National Digital Skills Academy targeting rural youth and women",
        "Create a dedicated cybersecurity regulatory body with mandatory compliance requirements",
        "Develop a National Freelancing Policy providing tax incentives and international payment facilitation",
      ],
    },
  },
  {
    id: 8,
    title: "Macroeconomics Study — Business Cycle & Inflation in Bangladesh",
    category: "Macroeconomics",
    description:
      "Produced a detailed academic study covering core macroeconomic topics including the business cycle, inflation trends in Bangladesh, circular flow of income, and fiscal vs. monetary policy responses.",
    details: [
      "Explained the four phases of the business cycle with real examples from Bangladesh's post-COVID recovery",
      "Analyzed Bangladesh's inflation trend from 2020–2023, reaching 9.5% in 2023",
      "Illustrated the circular flow of income model for a four-sector economy",
      "Compared Bangladesh Bank's monetary policy tightening with fiscal stimulus measures",
      "Produced a well-structured 25-page study guide used as reference material by classmates",
    ],
    tools: [
      "Macroeconomics",
      "Bangladesh Bank Data",
      "BBS Statistics",
      "Academic Writing",
    ],
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
    outcome:
      "Study guide shared with 30+ classmates; became go-to reference for semester exam prep",
    type: "DIU Coursework",
    featured: false,
    fullReport: {
      overview:
        "This academic study covers four major macroeconomic concepts — the Business Cycle, Inflation, the Circular Flow of Income, and Fiscal & Monetary Policy — with a specific focus on applying these concepts to the Bangladesh economic context from 2020 to 2023.",
      objectives: [
        "Explain core macroeconomic theories in clear, accessible language suitable for BBA students",
        "Apply theoretical concepts to real economic events in Bangladesh, particularly post-COVID recovery and the 2022–23 inflation surge",
        "Analyze the policy responses of the Bangladesh government and Bangladesh Bank",
        "Create a study reference guide integrating theory with data for exam preparation",
      ],
      methodology: [
        {
          heading: "Theoretical Framework",
          body: "Standard macroeconomic models from the BBA curriculum were used as the foundation, drawing from Mankiw's Principles of Economics and Bangladesh-specific references from DIU's prescribed reading list.",
        },
        {
          heading: "Data Analysis",
          body: "Data was sourced from Bangladesh Bank's Annual Reports, Bangladesh Bureau of Statistics (BBS) GDP and CPI data, IMF Article IV consultation reports, and World Bank economic outlook publications.",
        },
        {
          heading: "Case Study Integration",
          body: "Real events in Bangladesh's economy (COVID-19 recession, post-pandemic recovery, Russia-Ukraine commodity price shock, BDT depreciation) were used as case studies to illustrate each macroeconomic concept.",
        },
      ],
      keyFindings: [
        "Bangladesh's GDP growth followed a classic business cycle: contraction to 5.24% in FY2019–20 (COVID trough), recovery to 6.94% in FY2020–21, expansion to 7.10% in FY2021–22",
        "Inflation rose sharply from 5.56% in 2021 to 9.52% in 2023 — primarily driven by food inflation (10.8%) and energy price pass-through",
        "Bangladesh Bank raised its policy rate (repo rate) from 5.75% to 7.25% between May 2022 and June 2023 to combat inflation",
        "Remittances (USD 21.9 billion in FY2022–23) act as a major injection into the Bangladesh economy from the external sector",
        "Government fiscal deficit widened to 5.1% of GDP in FY2022–23 due to higher fuel subsidies",
        "Bangladesh's foreign exchange reserves fell from USD 46 billion (August 2021) to USD 19.2 billion (June 2023) — a 58% decline",
      ],
      tables: [
        {
          title: "Bangladesh Macroeconomic Indicators (2020–2023)",
          headers: ["Indicator", "FY2019-20", "FY2020-21", "FY2021-22", "FY2022-23"],
          rows: [
            ["GDP Growth Rate", "5.24%", "6.94%", "7.10%", "6.03%"],
            ["Inflation Rate (CPI)", "5.65%", "5.56%", "6.15%", "9.52%"],
            ["Repo Rate (BB)", "5.75%", "5.75%", "5.75%", "7.25%"],
            ["Remittances (USD Bn)", "18.2", "24.8", "21.3", "21.9"],
            ["Forex Reserves (USD Bn)", "36.0", "46.2", "42.2", "19.2"],
            ["Fiscal Deficit (% GDP)", "5.5%", "6.0%", "5.5%", "5.1%"],
          ],
        },
      ],
      conclusion:
        "Bangladesh's macroeconomic performance from 2020 to 2023 reflects the challenges faced by a developing open economy in navigating global shocks. The post-COVID recovery was impressive, but the inflation surge and BDT depreciation exposed structural vulnerabilities in Bangladesh's import-dependent economy.",
      recommendations: [
        "Bangladesh Bank should consider further monetary tightening if inflation does not return to the 5–6% target band",
        "Accelerate domestic energy production to reduce fuel import dependence",
        "Foreign exchange reserve management should adopt a conservative import cover target of 4 months",
        "Investment in export diversification beyond RMG is critical to reduce the current account deficit",
      ],
    },
  },
];

export const experience = [
  {
    type: "education",
    title: "B.B.A. in Accounting",
    organization: "Daffodil International University",
    location: "Birulia, Savar, Dhaka-1216",
    period: "2025 — Present",
    description:
      "Currently pursuing a Bachelor of Business Administration majoring in Accounting. Coursework includes financial accounting, management accounting, taxation, auditing, business law, corporate finance, and macroeconomics.",
    skills: ["Financial Accounting", "Taxation", "Auditing", "Corporate Finance"],
  },
  {
    type: "education",
    title: "Higher Secondary Certificate (HSC)",
    organization: "Ghatail Cantonment Public School & College",
    location: "Ghatail Cantonment, Ghatail, Tangail",
    period: "2022 — 2024",
    description:
      "Completed HSC in the Business Studies group with strong results in Accounting, Finance, and Economics. This built the foundation for pursuing higher studies in accounting.",
    skills: ["Accounting", "Economics", "Finance", "Business Studies"],
  },
  {
    type: "education",
    title: "Secondary School Certificate (SSC)",
    organization: "Ghatail Govt. Pilot High School",
    location: "Ghatail, Tangail",
    period: "2020 — 2022",
    description:
      "Completed SSC from the Business Studies group. First formal exposure to accounting principles, business concepts, and mathematical problem-solving.",
    skills: ["Basic Accounting", "Mathematics", "Business Studies"],
  },
];
