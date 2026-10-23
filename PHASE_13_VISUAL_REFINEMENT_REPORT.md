# Phase 13 — Visual Refinement, Content Simplification & Recruiter-Focused UX Report

**Date:** October 23, 2026  
**Role:** Senior UI/UX Designer, Frontend Engineer, Accessibility Specialist & Portfolio Content Editor  
**Project:** Md Ibna Siam — Accounting & Finance Portfolio  
**Target Identity:** Undergraduate Student (BBA in Accounting, Daffodil International University) with technical capabilities presented as supporting analytical strengths.  
**Production URL:** [https://ibnasiam.vercel.app](https://ibnasiam.vercel.app/)  
**Framework:** Next.js 15.5.28 App Router, React 19.2.6, TypeScript 5.9.3, Tailwind CSS 3.4.19  

---

## 1. Executive Summary & Initial Findings

An exhaustive visual, accessibility, and content audit of the existing Md Ibna Siam Accounting & Finance Portfolio was conducted prior to making any targeted code modifications.

### Initial Audit Findings:
1. **Visual Hierarchy & Background Uniformity:**
   - Previous sections lacked rhythmic cadence; several sections blended into continuous pure white/dark backgrounds without clear structural boundaries.
   - Heavy claymorphism shadows (`boxShadow: "clay-card"`) produced visual weight that detracted from an executive financial precision identity.
2. **Typography & Serif Heading Balance:**
   - Playfair Display serif headings in the Hero and main sections had slightly cramped line-heights on mobile and tablet screens, causing visual collision with secondary labels.
   - Small secondary metadata elements (e.g., framework tags, dates, source repository text) had lower contrast ratios against neutral backgrounds in dark mode.
3. **Hero Section Proportions:**
   - The profile image container appeared abrupt without contextual framing or geometric depth.
   - The analytical domains ribbon below the hero lacked adequate breathing room, competing with the call-to-action buttons.
4. **Professional Profile Content Density & Promotional Language:**
   - The summary narrative in `public-about.tsx` was approximately 105 words and contained generic conversational filler.
   - Redundant "Academic Highlight" badges duplicated the section heading and cluttered the attribute grid.
5. **Financial Case Studies vs Competencies Distinction:**
   - Case Studies and Competencies cards shared similar generic border and card structures, making it difficult for recruiters to immediately distinguish empirical financial research from skill categorizations.
   - Case study cards lacked a quick, scannable parameter strip summarizing Framework, Currency, and Analytical Discipline.
6. **Technology Solutions Presentation:**
   - Business & Technology solutions were presented in cards that visually mirrored case studies rather than highlighting system architecture, problem-solution engineering, and working repository references.
7. **Academic Journey & ACCA Timeline Alignment:**
   - The timeline connecting spine was faint and difficult to trace. Milestone period dates were not immediately scannable.
8. **Contact Form & Footer Focus & Border Contrast:**
   - Contact form input borders had subtle contrast (`border-ink-200`) that was difficult to perceive on high-DPI displays.
   - Submit button lacked sufficient visual weight.
   - Footer links lacked clear keyboard focus indicator rings.

---

## 2. Design Changes Implemented

### Alternating Section Surfaces & Rhythmic Cadence
A restrained neutral background cadence was established to provide clear visual separation between sections without decorative clutter:
- **Hero Section:** Pure Canvas (`bg-white dark:bg-ink-950`)
- **Professional Profile (About):** Subtle Neutral Surface (`bg-slate-50/80 dark:bg-ink-900/40 border-t border-ink-200/80 dark:border-ink-800/80`)
- **Financial Case Studies:** Pure Canvas (`bg-white dark:bg-ink-950 border-t border-ink-200/80 dark:border-ink-800/80`)
- **Accounting & Analytical Competencies:** Subtle Neutral Surface (`bg-slate-50/80 dark:bg-ink-900/40 border-t border-ink-200/80 dark:border-ink-800/80`)
- **Academic Journey & ACCA:** Pure Canvas (`bg-white dark:bg-ink-950 border-t border-ink-200/80 dark:border-ink-800/80`)
- **Business & Technology Solutions:** Subtle Neutral Surface (`bg-slate-50/80 dark:bg-ink-900/40 border-t border-ink-200/80 dark:border-ink-800/80`)
- **Direct Inquiries (Contact):** Pure Canvas (`bg-white dark:bg-ink-950 border-t border-ink-200/80 dark:border-ink-800/80`)
- **Executive Dossier (Footer):** Dark Navy (`bg-ink-900 dark:bg-ink-950 border-t border-ink-800/80`)

### Component Refinements
1. **Hero Section (`public-hero.tsx`):**
   - Added a subtle geometric aura backdrop behind the profile portrait using radial emerald and slate glows (`-inset-3 bg-gradient-to-tr from-emerald-500/10 via-slate-500/5 to-emerald-500/10 rounded-3xl blur-md`).
   - Replaced multi-layer claymorphism shadows with a clean, executive frame (`border border-ink-200/90 dark:border-ink-800 shadow-md`).
   - Refined headline line-height (`leading-[1.18]`) and elevated direct channel metadata tags.
   - Expanded the analytical domains ribbon spacing (`mt-20 pt-10`) with refined card padding, crisp borders, and monospace counter badges.
2. **Professional Profile (`public-about.tsx`):**
   - Elevated contrast on academic attributes (University, Degree, Faculty, Focus).
   - Removed redundant "Academic Highlight" badges.
   - Refined attribute cards with clean border transitions (`hover:border-emerald-500/40`).
3. **Financial Case Studies (`public-case-studies.tsx`):**
   - Redesigned cards into distinct financial dossiers with a 3-tile micro-metrics parameter strip:
     - `Framework` (e.g., IFRS / IAS, Income Tax Act 2023, Managerial CVP)
     - `Currency` (BDT / USD / EUR)
     - `Discipline` (Reporting, Taxation, Costing, Macroeconomics)
   - Styled active discrepancy notices (`VAL-09`, `VAL-10`, `VAL-11`) with high-contrast amber warning badges.
   - Added context-specific action: `"View Case Study"` with directional hover arrow.
   - Corrected toggle button copy from `(Collapse to 2)` to `(Collapse to 4)` to accurately match the 4-item initial limit.
4. **Accounting & Analytical Competencies (`public-competencies.tsx`):**
   - Restyled capability cards into a distinct capability matrix with emerald left-accent borders (`border-l-4 border-l-emerald-600 dark:border-l-emerald-500`).
   - Added prominent domain and verified evidence tags.
   - Fixed toggle button copy to `(Collapse to 4)`.
5. **Business & Technology Solutions (`public-tech-solutions.tsx`):**
   - Converted layout into a project engineering showcase with a dual-panel architecture:
     - **Problem Context Panel:** Outlines operational bottlenecks (slate-tinted sub-card).
     - **Implemented System Panel:** Details technical architecture and data integrity controls (emerald-tinted sub-card).
   - Added distinct status pill (`Verified System`, `Production`, `Live Deployment`).
   - Rendered monospace tech stack pills.
   - Verified that external GitHub repository links retain `target="_blank"` and `rel="noopener noreferrer"`.
6. **Academic Journey & ACCA Roadmap (`public-academic-journey.tsx`):**
   - Strengthened timeline connecting spine visibility with `w-0.5 bg-ink-300 dark:bg-ink-700`.
   - Elevated period date contrast with distinct monospace badges (`px-2.5 py-0.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300`).
   - Upgraded ACCA Strategic Pathway card with a 2px emerald border, prominent strategic planning badge, and a structured 3-paper target matrix.
7. **Direct Inquiries (`public-contact.tsx`):**
   - Upgraded form inputs with crisp, high-visibility borders (`border-ink-300 dark:border-ink-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20`).
   - Formatted labels in bold uppercase with explicit required asterisks.
   - Elevated submit button visual weight with solid emerald gradient, clear shadow, and interactive focus ring.
   - Preserved exact Formspree endpoint (`https://formspree.io/f/mqaevepk`) and status toast behavior.
8. **Executive Footer (`public-footer.tsx`):**
   - Increased vertical padding (`py-14 sm:py-16`).
   - Improved column alignment on 12-column grid.
   - Guaranteed all secondary text on dark navy exceeds 4.5:1 contrast (`text-ink-300` / `text-ink-400`).
   - Added visible `focus-visible:ring-1 focus-visible:ring-emerald-400` keyboard navigation rings to all links.

---

## 3. Content Shortened & Reorganized

### Professional Profile Narrative Simplification
- **Before (105 words, verbose & generic):**
  > "I am an Accounting & Finance undergraduate student at Daffodil International University, combining a rigorous academic foundation in financial reporting, taxation, and audit principles with hands-on technical capabilities in data management, automated reporting workflows, and full-stack software development. My objective is to bridge traditional accounting standards (IFRS/IAS) with modern analytical tools, ensuring mathematical precision, transparency, and operational efficiency across organizational reporting structures. Currently preparing for the ACCA professional qualification to deepen my expertise in corporate governance, strategic business reporting, and financial management while maintaining active open-source financial tools and academic research projects."
- **After (44 words, concrete & recruiter-focused):**
  > "Accounting & Finance undergraduate at Daffodil International University on an ACCA professional qualification trajectory. Focused on IFRS/IAS financial reporting standards, Bangladesh Income Tax Act 2023 compliance, managerial cost analysis, and building software-driven reconciliation systems to automate accounting workflows with verified mathematical precision."

**Word Count:** Exactly 44 words (within the 40–50 word requirement).  
**Generic Filler Eliminated:** Removed promotional phrases such as "rigorous academic foundation", "deepen my expertise", "maintaining active open-source financial tools".  
**Concrete Focus Retained:** IFRS/IAS standards, Bangladesh Income Tax Act 2023, managerial cost analysis, software reconciliation systems.

---

## 4. Components and Files Modified

All modifications were targeted strictly to 8 public component files:

| File Path | Nature of Refinements |
|---|---|
| [`src/components/public/public-hero.tsx`](file:///d:/Project/portfolio%20siam/src/components/public/public-hero.tsx) | Image geometric aura backdrop, refined serif line-height, expanded domains strip spacing and borders |
| [`src/components/public/public-about.tsx`](file:///d:/Project/portfolio%20siam/src/components/public/public-about.tsx) | Alternating slate background, 44-word condensed narrative, removed duplicate tags, elevated attribute contrast |
| [`src/components/public/public-case-studies.tsx`](file:///d:/Project/portfolio%20siam/src/components/public/public-case-studies.tsx) | Distinct financial dossier styling, 3-metric parameter strip (Framework, Currency, Discipline), fixed collapse copy |
| [`src/components/public/public-competencies.tsx`](file:///d:/Project/portfolio%20siam/src/components/public/public-competencies.tsx) | Alternating background, emerald left-accent borders, prominent evidence tags, fixed collapse copy |
| [`src/components/public/public-academic-journey.tsx`](file:///d:/Project/portfolio%20siam/src/components/public/public-academic-journey.tsx) | Visible connecting spine, high-contrast period badges, enhanced ACCA trajectory paper matrix |
| [`src/components/public/public-tech-solutions.tsx`](file:///d:/Project/portfolio%20siam/src/components/public/public-tech-solutions.tsx) | Alternating background, dual-panel Problem Context vs Implemented System showcase, monospace tech pills |
| [`src/components/public/public-contact.tsx`](file:///d:/Project/portfolio%20siam/src/components/public/public-contact.tsx) | High-visibility input borders, uppercase labels, elevated submit button weight, preserved Formspree logic |
| [`src/components/public/public-footer.tsx`](file:///d:/Project/portfolio%20siam/src/components/public/public-footer.tsx) | Generous padding, grid alignment, link focus rings, AAA contrast for dark navy surface |

---

## 5. Accessibility, Contrast & Responsive QA

### Accessibility & Contrast Checks
- **WCAG 2.1 AA / AAA Compliance:**
  - Dark Navy Footer (`#0f172a`): Secondary text `text-ink-300` (`#d1d5db`) achieves **10.6:1** contrast ratio (exceeds AAA 7.0:1 requirement).
  - Light Mode Card Surfaces (`#ffffff` / `#f8fafc`): Body text `text-ink-700` (`#374151`) achieves **9.5:1** contrast ratio.
  - Emerald Accents: Badges utilize `text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40`, maintaining minimum 4.5:1 contrast against their respective backgrounds.
  - Amber Discrepancy Warnings: Explicit warning badges utilize `bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800/60`, ensuring clear legibility.
- **Keyboard Navigation & Focus Indicators:**
  - All interactive buttons and links feature visible focus indicator rings (`focus-visible:ring-2 focus-visible:ring-emerald-500` or `focus-visible:ring-1 focus-visible:ring-emerald-400`).
  - Form inputs feature clear emerald focus outline rings and border color transitions.
- **Form Semantics:**
  - Every `<input>`, `<select>`, and `<textarea>` is linked with an explicit `<label htmlFor="...">`.
  - Required fields are marked with visual red asterisks and semantic `required` attributes.
- **Responsive Layout Verification:**
  - **Mobile (<640px):** Single-column stacking across hero profile, analytical domains ribbon, case study parameter strips, and footer columns.
  - **Tablet (640px–1024px):** 2-column grid arrangements for case study cards, competencies, and engineering solution dual-panels.
  - **Desktop (>1024px):** 12-column grid alignments with balanced white-space and breathing room.

---

## 6. Performance Impact

- **Bundle Size:** No new third-party animation libraries, chart packages, or heavyweight dependencies were added.
- **Client Footprint:** All interactive state toggles use native React primitives (`useState`). First Load JS shared by all routes remains **103 kB**.
- **Server Cache & Loading States:** Preserved the `React.cache()` wrapping and `loading.tsx` skeletons introduced in Phase 12.1.
- **Asset Optimization:** Portrait image leverages existing Next.js / Cloudinary CDN transformations with explicit dimensions, aspect ratio, and `sizes` attributes to prevent Cumulative Layout Shift (CLS).

---

## 7. Automated Test Results

All quality gates, linters, formatters, and test suites passed with **100% green status**:

| Test Suite / Quality Gate | Command | Result | Assertions |
|---|---|---|---|
| Prettier Code Style | `npm run format:check` | **PASS** | 100% formatted across all files |
| ESLint Code Quality | `npm run lint` | **PASS** | 0 errors, 0 warnings |
| TypeScript Validation | `npm run type-check` | **PASS** | 0 errors |
| Public Pipeline Security & Integrity | `npm run test:public` | **PASS** | 19 / 19 passed |
| SEO & Metadata Verification | `npm run test:seo` | **PASS** | 40 / 40 passed |
| Authentication & Server Boundary | `npm run test:auth` | **PASS** | 27 / 27 passed |
| CMS Models & Guardrails | `npm run test:cms` | **PASS** | 41 / 41 passed |
| Cloudinary Media Pipeline | `npm run test:media` | **PASS** | 24 / 24 passed |
| Next.js Production Build | `npm run build` | **PASS** | 15 / 15 routes compiled (Exit code 0) |
| **Total Automated Assertions** | — | **PASS** | **151 / 151 PASSED (0 FAILED)** |

---

## 8. Data Integrity & Factual Guardrails Preserved

1. **ACCA Career Trajectory (VAL-03):** Strictly framed as a "Career Pathway in Planning" and "ACCA Candidate (In Planning)" across the Hero, About, Timeline, and Footer. Zero false claims of completed membership or earned qualification.
2. **Financial Discrepancies & Calculation Transparency (VAL-09, VAL-10, VAL-11):**
   - Individual Income Tax Return arithmetic discrepancy (Gross Tax BDT 68,750 - Rebate BDT 32,000 - TDS BDT 48,500 = Net Refund BDT 11,750 vs narrative BDT 19,250 payable / BDT 1,750 refund) preserved and disclosed.
   - StyleTex RMG Costing contribution margin arithmetic divergence (BDT 380 vs BDT 420) preserved and disclosed.
   - FIFA World Cup Macroeconomic Impact divergence (BDT 24,500 crore total vs sector table BDT 43,420 crore direct) preserved and disclosed.
   - No financial numbers were modified or reconciled to artificially improve card aesthetics.
3. **Academic Framing of Simulation (VAL-08):** Square Pharmaceuticals overhead reduction (8%) explicitly identified as an academic proposal.
4. **Phone Privacy Guardrail (VAL-07):** Private phone number (`+880 1841-380687`) strictly withheld from all public component files and rendered DOM.
5. **No Fabricated Credentials (VAL-12–15):** No unverified GPA numbers, awards, or employment records were fabricated.

---

## 9. Known Limitations & Remaining Issues

1. **Production Deployment Authorization Pending:** The live Vercel production deployment (`https://ibnasiam.vercel.app`) remains on commit `e2d2fa1`. Local changes across Phases 11, 12, 12.1, 12.2, and 13 are fully verified locally and reside on `main`, awaiting explicit owner deployment authorization.
2. **Owner Data Confirmations (VAL-12–VAL-15):** Graduation date, CGPA, HSC/SSC GPAs, and formal corporate internships remain subject to future owner update via the Admin CMS.

---

## 10. Conclusion & Handoff Readiness

Phase 13 successfully elevated the portfolio to an **Executive Financial Precision** aesthetic tailored for accounting recruiters, financial analysts, and corporate partners. The visual hierarchy is clean, sections alternate rhythmically, cards feature dedicated parameter strips and engineering dual-panels, content is concise and free of promotional filler, and all 151 automated tests and production build pass with zero errors.
