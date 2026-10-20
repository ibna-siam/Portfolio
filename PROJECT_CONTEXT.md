# Project Context: Siam's Personal Portfolio Redesign

**Project:** Siam's Personal Portfolio Redesign  
**Repository:** [https://github.com/ibna-siam/Portfolio](https://github.com/ibna-siam/Portfolio)  
**Hosting Target:** Vercel  
**Design System:** Executive Financial Precision  
**Primary Focus:** Accounting & Finance (75% weight) with ACCA Career Trajectory  
**Supporting Strength:** Business Management, Financial Technology, Automation & Dashboards (25% weight)  
**Target Identity:** Md Ibna Siam — BBA Candidate in Accounting & Finance, Daffodil International University (Academic ID: 252-58-083)  

---

## 1. Project Overview & Professional Positioning

This repository houses the personal professional portfolio of **Md Ibna Siam**, an undergraduate BBA Accounting & Finance student at Daffodil International University (DIU), Dhaka, Bangladesh.

### Core Strategic Purpose:
To transition away from a generic developer template into a high-credibility, corporate-ready portfolio tailored for:
1. **Accounting & Audit Recruiters:** Audit and assurance firms, professional advisory practices, and finance departments seeking high attention to detail, adherence to accounting standards (IFRS / BAS, Income Tax Act 2023), and analytical precision.
2. **Corporate Finance & Internship Placement:** Organizations looking for practical fluency in financial reporting, cost accounting, variance analysis, and spreadsheet/ERP modeling.
3. **Academic Mentors & Collaborators:** Transparent presentation of undergraduate research and analytical capabilities.

### Mandatory Content & Qualification Rules:
- **ACCA Trajectory:** ACCA is presented strictly as a career target / planned professional qualification. No claims of earned ACCA student registration, exam completion, affiliate status, or membership are made without verified independent documentation.
- **Academic Standing:** Siam is presented strictly in his authentic capacity as an undergraduate student and researcher, never as a qualified accountant, chartered tax consultant, or certified auditor.
- **Privacy Enforcement:** Personal phone numbers (`+880 1841-380687`) are strictly excluded from all public UI surfaces. Official university email (`252-58-083@diu.edu.bd`) and verified LinkedIn profile serve as primary direct channels.

---

## 2. Technical Stack & Architecture

- **UI Framework:** React 19 (`react` 19.2.6, `react-dom` 19.2.6)
- **Build System:** Vite 8.0.12 (with `@vitejs/plugin-react` 6.0.1)
  - Deployment Root: `base: '/'`
  - Output Directory: `dist`
  - Build Command: `vite build`
- **Styling & CSS:** Tailwind CSS 3.4.19 & PostCSS 8.5.15
  - Foundation: Executive Financial Precision color system (Slate/Navy canvas, Emerald accent, Amber variance alerts)
  - Typography: Playfair Display (editorial serif headlines), DM Sans (clear body text), JetBrains Mono (monospaced financial data & codes)
  - Numerals: `.tabular-nums` (`font-variant-numeric: tabular-nums`) for aligned financial schedules
- **Animation & Motion:** Framer Motion 12.40.0 (fully respecting `prefers-reduced-motion: reduce`)
- **Icons:** React Icons 5.6.0 (`react-icons/fi`)
- **Production Analytics:** `@vercel/speed-insights/react` 2.0.0
- **Form Handling:** Formspree (`https://formspree.io/f/mjgzqeeg`) with client-side accessible error handling and validation
- **Quality Gates:** ESLint 10.3.0 (enforces 0 errors, 0 warnings)

---

## 3. Application Structure & Components

```
src/
├── App.jsx                     # Root application container & section layout
├── main.jsx                    # React 19 createRoot entry point
├── index.css                   # Tailwind directives, base layers, .tabular-nums, motion queries
├── hooks/                      # Custom React hooks (useTheme, useActiveSection, useScrollPosition)
├── assets/
│   └── siam.jpeg               # High-resolution verified portrait asset
├── data/
│   ├── portfolioData.js        # Master portfolio dataset (raw source values preserved)
│   ├── caseStudyIntegrity.js   # Integrity audit register & discrepancy notes for 8 studies
│   ├── competenciesData.js     # Evidence-based 16-competency matrix across 4 domains
│   ├── academicJourneyData.js  # Confirmed academic timeline milestones & ACCA roadmap
│   └── techSolutionsData.js    # 3 verified business-technology problem solving projects
└── components/
    ├── Navbar.jsx              # Executive wordmark, credential pill, canonical navigation anchors
    ├── Hero.jsx                # Accounting headline, verified CV CTA, LCP-optimized portrait
    ├── About.jsx               # Academic narrative, 4 factual highlight cards
    ├── Skills.jsx              # Competencies Matrix with discipline filters & ARIA tablist
    ├── Projects.jsx            # Case Studies Showcase & Interactive 5-tab Modal Viewer
    ├── TechSolutions.jsx       # 3 Technology Solutions (~25% weight) with status badges
    ├── Experience.jsx          # Academic Progression timeline & ACCA qualification roadmap
    ├── Contact.jsx             # Accessible Formspree form, inquiry selector, copy-email button
    ├── Footer.jsx              # Canonical links, verified dossier anchors, back-to-top button
    └── SectionHeading.jsx      # Canonical section header component (label, title, subtitle)
```

---

## 4. Financial Integrity Registry & Discrepancy Transparency

In compliance with professional accounting ethics, raw source figures in `src/data/portfolioData.js` are strictly preserved, while mathematical or narrative discrepancies are transparently disclosed via `src/data/caseStudyIntegrity.js` and rendered in the interactive viewer:

1. **Individual Income Tax Return (Study 2):** Discrepancy between narrative summary and calculation table regarding investment rebate ceiling and net refund. Flagged with `Requires reconciliation` banner.
2. **StyleTex RMG Cost Sheet (Study 4):** Contribution margin calculation divergence between stated variable cost components (BDT 1,120) and table output (BDT 420 vs. BDT 380). Flagged with `Requires reconciliation` banner.
3. **FIFA World Cup Economic Impact (Study 8):** Distinction between direct operational revenue and broad macroeconomic gross output estimates. Flagged with `Requires reconciliation` banner.
4. **Square Pharmaceuticals Overhead Claim (Study 1):** Overhead reduction figure framed strictly as an academic student recommendation rather than an achieved corporate outcome.

---

## 5. Technology Solutions Showcase (~25% Supporting Weight)

Presented in a dedicated section (`#solutions`) separate from the 8 academic studies:
1. **Executive Financial Portfolio & Case Study Showcase:** Live deployed web application engineered for financial precision with `.tabular-nums` financial tables, transparent integrity audit registers, and accessible modal drawers (`https://github.com/ibna-siam/Portfolio`).
2. **Digital Mess & Shared Expense Reconciliation System:** Cost-allocation operational prototype automating hostel meal rate calculation and settlement sheets. Links to developer GitHub profile pending dedicated repository publication.
3. **Personal Cash Flow & Student Budget Allocation Tool:** Managerial personal budgeting functional prototype applying variance analysis. Links to developer GitHub profile pending dedicated repository publication.

---

## 6. Deployment & Hosting Architecture (Vercel)

- **Hosting Platform:** Vercel Root Deployment
- **Framework Preset:** Vite
- **Root Directory:** `./`
- **Build Command:** `vite build`
- **Output Directory:** `dist`
- **Base Path:** `'/'` in `vite.config.js`
- **Routing Strategy:** Single Page Application (in-page hash anchors: `#about`, `#skills`, `#projects`, `#solutions`, `#experience`, `#contact`). No client-side browser history routes required.
- **Environment Variables:** None required for production build.
- **Performance Monitoring:** `@vercel/speed-insights` tracks real-user Core Web Vitals automatically.

---

## 7. Current Project Status & Release Governance

- **Phases 1–11:** 100% Complete.
- **Quality Gates:** `npm run lint` passes with 0 errors/0 warnings; `npm run build` succeeds in ~1.0s.
- **Release Status:** **Ready for owner approval to release.**
- **Governance:** No commit, push, or deployment may be executed without explicit authorization from the project owner.
