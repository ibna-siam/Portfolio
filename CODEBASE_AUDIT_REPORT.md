# Codebase Architecture & Cleanup Audit Report (Phase 10.2)

**Generated:** October 23, 2026  
**Auditor:** Senior Next.js Architect, Frontend Accessibility Specialist & Codebase Maintenance Engineer  
**Target Environment:** Next.js 15.5.28 (App Router), React 19.2.6, Neon Serverless PostgreSQL (Drizzle ORM), Vercel Production  
**Scope:** Repository Structure, Legacy Vite Artifacts, Dependency Inventory, Configuration Audit & Readability Diagnostics

---

## 1. Executive Summary

This audit assesses the state of the Md Ibna Siam Portfolio codebase following migration from React/Vite to Next.js 15 App Router. The portfolio currently runs in production on Vercel with an integrated administrative CMS backed by Neon PostgreSQL and Auth.js v5.

The audit identifies:
1. **Light Mode Readability Issues:** Widespread use of `text-ink-400` (#9ca3af, contrast ~2.54:1 on white) and `text-ink-500` (#6b7280, contrast ~4.34:1 on cards) creating critical WCAG 2.2 AA non-compliance (< 4.5:1 required) in both public pages and administrative interfaces.
2. **Confirmed Obsolete Artifacts:** The `gh-pages` dependency (`^6.3.0`) in `devDependencies` is confirmed obsolete; it was previously used for static branch publishing and has 0 usages, 0 scripts, and directly contradicts Vercel production hosting. Additionally, `src/components/admin/admin-nav.tsx` has been completely superseded by the responsive `AdminShell` component (`src/components/admin/admin-shell.tsx`) introduced in Phase 10.1 and has 0 active imports.
3. **Intentionally Retained Artifacts:** The legacy Vite build pipeline (`vite.config.js`, `index.html`, `src/App.jsx`, `src/main.jsx`, `src/components/*.jsx`, `src/hooks/index.js`, `@vitejs/plugin-react`, `vite`) is intentionally retained for dual-track rollback capability per `MIGRATION_PLAN.md` Section 9.1 and compiles cleanly in 1.80s (`npm run build:vite`). `src/data/portfolioData.js` and companion data files are strictly required by `scripts/seed.ts` and disclosure verification rules (VAL-07 to VAL-11).
4. **Architectural Coherence:** The Next.js App Router structure, server/client boundaries, Edge middleware protection, lazy database initialization, and Cloudinary media pipelines are structurally sound and verified.

---

## 2. Inventory & Classification of Potentially Obsolete Files and Dependencies

| Item Path / Dependency | Current Purpose | References & Imports | Build / Script Participation | Obsolete Evidence | Classification | Proposed Action & Risk |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `gh-pages` (in `package.json`) | Legacy GitHub Pages publishing tool | None in source or scripts | None | Vercel hosts production. Documented as conflict in `ARCHITECTURE_AUDIT.md` | **Confirmed Obsolete** | Remove from `devDependencies`. Risk: Zero (no script references). |
| `src/components/admin/admin-nav.tsx` | Previous header-only navigation component | None (0 imports in codebase) | None (replaced by `AdminShell`) | Superseded by `src/components/admin/admin-shell.tsx` in Phase 10.1 | **Confirmed Obsolete** | Remove file. Risk: Zero (0 imports; verified across app and tests). |
| `vite.config.js` | Vite bundler configuration | Root Vite CLI config | `npm run build:vite`, `npm run dev:vite` | None. Maintained for dual-track recoverability | **Intentionally Retained** | Retain per `MIGRATION_PLAN.md` Section 9.1. Risk: High if removed (destroys rollback guarantee). |
| `index.html` | Vite HTML entry point | Vite root HTML | `npm run build:vite` | None. Dual-track rollback entry point | **Intentionally Retained** | Retain for Vite dual-track build. Risk: High if removed. |
| `src/main.jsx` | Vite React 19 root mount | Entry in `index.html` | `npm run build:vite` | None. Vite React entry point | **Intentionally Retained** | Retain for Vite dual-track build. Risk: High if removed. |
| `src/App.jsx` | Vite root component | Imported in `src/main.jsx` | `npm run build:vite` | None. Vite app root | **Intentionally Retained** | Retain for Vite dual-track build. Risk: High if removed. |
| `src/components/*.jsx` (11 files) | Legacy Vite React components (`About`, `Hero`, `Projects`, etc.) | Imported by `src/App.jsx` | `npm run build:vite` | None. Active components for Vite build | **Intentionally Retained** | Retain for Vite dual-track build. Risk: High if removed. |
| `src/hooks/index.js` | Legacy Vite custom hooks (`useTypingEffect`, `useTheme`, `useActiveSection`) | Imported by `src/App.jsx` | `npm run build:vite` | None. Required by `src/App.jsx` | **Intentionally Retained** | Retain for Vite dual-track build. Risk: High if removed. |
| `src/data/*.js` (5 files) | Historical content baseline & financial disclosures | Imported by `scripts/seed.ts` | `npm run db:seed`, `db:verify` | Required by seed script and disclosure audit | **Required / Core Asset** | Retain. Do not modify. Guarantees VAL-07 to VAL-11 data fidelity. |
| `src/assets/siam.jpeg` | High-res local source portrait | `scripts/upload-portrait.ts`, `src/components/About.jsx` | Seed / media upload script | Source image for Cloudinary sync and fallback | **Required / Core Asset** | Retain. Direct dependency for media pipeline. |
| `public/assets/siam.jpeg` | Public static portrait fallback | Next.js public URL `/assets/siam.jpeg` | Next.js public static asset serving | Fallback image for public profile rendering | **Required / Core Asset** | Retain. Public static route. |
| `scripts/*.ts` (9 files) | Database seeding, verification, media, auth, and performance tests | `package.json` scripts (`db:*`, `test:*`) | Active test and maintenance pipelines | Fully active validation scripts | **Required / Core Scripts** | Retain. Essential for CI/CD and regression gating. |

---

## 3. Light Mode Contrast & Readability Diagnostic

### 3.1 Root Cause Analysis
In the legacy codebase and initial Next.js phases, styling decisions were predominantly previewed and optimized in Dark Mode. In Dark Mode, `text-ink-400` (#9ca3af) renders against `bg-ink-950` (#090d16) with an accessible contrast ratio of **7.51:1** (exceeding WCAG AAA).

However, in Light Mode:
- `text-ink-400` against `bg-white` yields a contrast ratio of **2.54:1** (Fails WCAG 2.2 AA minimum of 4.5:1).
- `text-ink-400` against `bg-ink-50` (#f8f9fa) yields **2.41:1** (Severe WCAG Fail).
- `text-ink-500` (#6b7280) against card surfaces `bg-ink-100` (#f1f3f5) yields **4.34:1** (Fails 4.5:1 normal text threshold).
- `text-emerald-600` (#059669) against `bg-white` yields **3.77:1** (Fails 4.5:1 for normal text badges/links).

### 3.2 Problematic Components Identified
1. **Administrative Shell (`src/components/admin/admin-shell.tsx`):**
   - Navigation category headers (`Overview`, `Content Management`, `Assets & System`) using `text-ink-400`.
   - Breadcrumb item separators and inactive items using `text-ink-400`.
   - Brand subtitle ("Operations & CMS") using `text-ink-400`.
   - User email and sign-out button text using `text-ink-400` / `text-ink-500`.
2. **Administrative Client Pages:**
   - Empty states, item counts, search input placeholders, table subheadings in `solutions-client.tsx`, `competencies-client.tsx`, `journey-client.tsx`, `media-client.tsx`, `case-studies-client.tsx`.
   - Form field helper text, character counters, and input borders in `case-study-editor.tsx`.
3. **Admin Modal System (`src/components/admin/modal.tsx`):**
   - Modal description using `text-ink-500` on light modal backdrop.
   - Close icon button using `text-ink-400`.
4. **Public Interface (`src/components/public/*.tsx`):**
   - Subheadings and metadata chips in `public-case-studies.tsx`, `public-competencies.tsx`, `public-tech-solutions.tsx`.
   - Financial schedule table labels and footnotes in `financial-schedule-table.tsx`.
   - Discrepancy notice body and header in `discrepancy-notice.tsx`.
   - Contact form input placeholders and helper labels in `public-contact.tsx`.

---

## 4. Semantic Token Correction Matrix

To guarantee strict WCAG 2.2 AA compliance across all surfaces without creating an overly stark or jarring pure-black appearance, the following standardized semantic hierarchy will be applied:

| UI Role | Current Failing Pattern | Standardized Accessible Pattern | Light Mode Surface | Calculated Ratio | WCAG 2.2 AA Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Headings & Titles** | `text-ink-900 dark:text-ink-100` | `text-ink-900 dark:text-ink-100` | White / Ink-50 | 17.5:1 | **PASS** (AAA) |
| **Body & Important Labels** | `text-ink-700 dark:text-ink-300` | `text-ink-700 dark:text-ink-300` | White / Ink-50 / Ink-100 | 10.5:1 | **PASS** (AAA) |
| **Secondary & Muted Text** | `text-ink-400` / `text-ink-500` | `text-ink-600 dark:text-ink-400` | White / Ink-50 | 7.57:1 / 7.18:1 | **PASS** (AAA) |
| **Card Footnotes & Metadata** | `text-ink-400` | `text-ink-600 dark:text-ink-400` | Ink-100 (#f1f3f5) | 6.82:1 | **PASS** (AA) |
| **Input Placeholders** | `placeholder:text-ink-400` | `placeholder:text-ink-500 dark:placeholder:text-ink-400` | White / Ink-100 | 4.81:1 | **PASS** (AA) |
| **Accent Text / Links** | `text-emerald-600` | `text-emerald-700 dark:text-emerald-400` | White / Ink-50 | 5.47:1 | **PASS** (AA) |
| **Warning / Notice Text** | `text-amber-600` | `text-amber-700 dark:text-amber-400` | White / Ink-50 | 5.12:1 | **PASS** (AA) |
| **Interactive Icons** | `text-ink-400 hover:text-ink-600` | `text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100` | White / Ink-50 | 4.81:1 (normal) / 17.5:1 (hover) | **PASS** (AA) |

---

## 5. Next Steps for Implementation

1. **Accessibility Remediation (Step 3):**
   - Apply the semantic token matrix across `admin-shell.tsx`, `modal.tsx`, `media-picker-modal.tsx`, all admin client views, `case-study-editor.tsx`, and all public components.
2. **Standardization & Cleanup (Steps 4 & 5):**
   - Remove obsolete `gh-pages` from `package.json`.
   - Remove obsolete `src/components/admin/admin-nav.tsx`.
   - Preserve all legacy Vite dual-track files, seed scripts, and disclosure records.
3. **Regression Testing & Verification (Step 6):**
   - Run `tsc --noEmit`, `npm run build`, `npm run build:vite`, and all automated test suites (`test:auth`, `test:media`, `test:cms`, `test:public`).
4. **Documentation (Step 8):**
   - Produce `ACCESSIBILITY_AND_CONTRAST_REPORT.md` and `PHASE_10_2_CLEANUP_REPORT.md`.
